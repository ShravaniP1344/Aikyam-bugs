import http from 'node:http';
import net from 'node:net';
import tls from 'node:tls';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const PORT = Number(process.env.API_PORT || (IS_PRODUCTION ? (process.env.PORT || 3000) : (process.env.PORT || 3001)));
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const BODY_LIMIT_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX || 8);
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 15000);
const TRUST_PROXY = String(process.env.TRUST_PROXY || 'false').toLowerCase() === 'true';

const rateBuckets = new Map();

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const productionCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' *",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function setCommonHeaders(res) {
  Object.entries(securityHeaders).forEach(([key, value]) => res.setHeader(key, value));
  if (IS_PRODUCTION) res.setHeader('Content-Security-Policy', productionCsp);
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  setCommonHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
      return forwarded.split(',')[0].trim();
    }
  }
  return req.socket.remoteAddress || 'unknown';
}

function enforceRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, startedAt: now });
    return { allowed: true, remaining: Math.max(RATE_MAX - 1, 0) };
  }

  bucket.count += 1;
  rateBuckets.set(ip, bucket);

  if (bucket.count > RATE_MAX) {
    const retryAfter = Math.max(Math.ceil((RATE_WINDOW_MS - (now - bucket.startedAt)) / 1000), 1);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  return { allowed: true, remaining: Math.max(RATE_MAX - bucket.count, 0) };
}

function cleanSingleLine(value, maxLength) {
  return String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMessage(value, maxLength) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function parseMailRecipients(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter(isValidEmail);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > BODY_LIMIT_BYTES) {
        reject(Object.assign(new Error('Request body too large.'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error('Invalid JSON body.'), { statusCode: 400 }));
      }
    });

    req.on('error', reject);
  });
}

class SmtpResponseReader {
  constructor(socket) {
    this.socket = socket;
    this.lineBuffer = '';
    this.lines = [];
    this.waiters = [];

    socket.on('data', (chunk) => {
      this.lineBuffer += chunk.toString('utf8');
      let index;
      while ((index = this.lineBuffer.indexOf('\n')) !== -1) {
        const line = this.lineBuffer.slice(0, index + 1).replace(/\r?\n$/, '');
        this.lineBuffer = this.lineBuffer.slice(index + 1);
        const waiter = this.waiters.shift();
        if (waiter) waiter.resolve(line);
        else this.lines.push(line);
      }
    });

    socket.on('error', (error) => {
      while (this.waiters.length) this.waiters.shift().reject(error);
    });

    socket.on('close', () => {
      const error = new Error('SMTP connection closed unexpectedly.');
      while (this.waiters.length) this.waiters.shift().reject(error);
    });
  }

  readLine() {
    if (this.lines.length) return Promise.resolve(this.lines.shift());
    return new Promise((resolve, reject) => this.waiters.push({ resolve, reject }));
  }

  async readResponse() {
    const responseLines = [];
    let code = null;

    while (true) {
      const line = await this.readLine();
      responseLines.push(line);
      const match = line.match(/^(\d{3})([ -])/);
      if (!match) continue;
      code ??= Number(match[1]);
      if (match[2] === ' ') break;
    }

    return { code, text: responseLines.join('\n'), lines: responseLines };
  }
}

function createSocket({ host, port, secure }) {
  return new Promise((resolve, reject) => {
    const options = { host, port };
    const socket = secure
      ? tls.connect({ ...options, servername: host, rejectUnauthorized: true })
      : net.connect(options);

    const onError = (error) => {
      socket.removeListener(secure ? 'secureConnect' : 'connect', onConnect);
      reject(error);
    };
    const onConnect = () => {
      socket.removeListener('error', onError);
      socket.setTimeout(SMTP_TIMEOUT_MS, () => socket.destroy(new Error('SMTP connection timed out.')));
      resolve(socket);
    };

    socket.once('error', onError);
    socket.once(secure ? 'secureConnect' : 'connect', onConnect);
  });
}

function upgradeToTls(socket, host) {
  return new Promise((resolve, reject) => {
    socket.removeAllListeners('data');
    socket.removeAllListeners('error');
    socket.removeAllListeners('close');

    const secureSocket = tls.connect({
      socket,
      servername: host,
      rejectUnauthorized: true,
    });

    const onError = (error) => reject(error);
    secureSocket.once('error', onError);
    secureSocket.once('secureConnect', () => {
      secureSocket.removeListener('error', onError);
      secureSocket.setTimeout(SMTP_TIMEOUT_MS, () => secureSocket.destroy(new Error('SMTP connection timed out.')));
      resolve(secureSocket);
    });
  });
}

async function sendCommand(socket, reader, command, acceptedCodes) {
  socket.write(`${command}\r\n`);
  const response = await reader.readResponse();
  if (!acceptedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${response.code}): ${response.text}`);
  }
  return response;
}

function encodeHeader(value) {
  const clean = cleanSingleLine(value, 300);
  if (/^[\x20-\x7E]*$/.test(clean)) return clean;
  return `=?UTF-8?B?${Buffer.from(clean, 'utf8').toString('base64')}?=`;
}

function dotStuff(value) {
  return value.replace(/^\./gm, '..');
}

function createMimeMessage({ from, to, replyTo, subject, text, html }) {
  const boundary = `aikyam_${crypto.randomUUID().replaceAll('-', '')}`;
  const headers = [
    `From: ${cleanSingleLine(from, 300)}`,
    `To: ${to.map((item) => cleanSingleLine(item, 254)).join(', ')}`,
    `Reply-To: ${cleanSingleLine(replyTo, 254)}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@aikyam.local>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return `${headers.join('\r\n')}\r\n\r\n${body}`;
}

async function sendSmtpMail({ from, to, replyTo, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const requireTls = String(process.env.SMTP_REQUIRE_TLS ?? 'true').toLowerCase() !== 'false';
  const smtpPort = Number(process.env.SMTP_PORT || (secure ? 465 : 587));

  if (!host || !user || !pass || !to.length) {
    const error = new Error('SMTP is not configured.');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  let socket = await createSocket({ host, port: smtpPort, secure });
  let reader = new SmtpResponseReader(socket);

  try {
    let response = await reader.readResponse();
    if (response.code !== 220) throw new Error(`SMTP greeting failed: ${response.text}`);

    response = await sendCommand(socket, reader, 'EHLO aikyam.co', [250]);

    if (!secure && requireTls) {
      const supportsStartTls = response.lines.some((line) => /STARTTLS/i.test(line));
      if (!supportsStartTls) throw new Error('SMTP server does not advertise STARTTLS.');

      await sendCommand(socket, reader, 'STARTTLS', [220]);
      socket = await upgradeToTls(socket, host);
      reader = new SmtpResponseReader(socket);
      await sendCommand(socket, reader, 'EHLO aikyam.co', [250]);
    }

    await sendCommand(socket, reader, 'AUTH LOGIN', [334]);
    await sendCommand(socket, reader, Buffer.from(user, 'utf8').toString('base64'), [334]);
    await sendCommand(socket, reader, Buffer.from(pass, 'utf8').toString('base64'), [235]);

    await sendCommand(socket, reader, `MAIL FROM:<${user}>`, [250]);
    for (const recipient of to) {
      await sendCommand(socket, reader, `RCPT TO:<${recipient}>`, [250, 251]);
    }

    await sendCommand(socket, reader, 'DATA', [354]);
    const mimeMessage = createMimeMessage({ from, to, replyTo, subject, text, html });
    socket.write(`${dotStuff(mimeMessage)}\r\n.\r\n`);
    response = await reader.readResponse();
    if (response.code !== 250) throw new Error(`SMTP DATA failed (${response.code}): ${response.text}`);

    try {
      await sendCommand(socket, reader, 'QUIT', [221]);
    } catch {
      // Message has already been accepted; QUIT failures are non-fatal.
    }
  } finally {
    if (!socket.destroyed) socket.end();
  }
}

async function handleContact(req, res) {
  const ip = getClientIp(req);
  const limit = enforceRateLimit(ip);
  if (!limit.allowed) {
    return sendJson(
      res,
      429,
      { message: 'Too many contact requests. Please wait a few minutes and try again.' },
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  try {
    const body = await readJsonBody(req);
    const companyWebsite = cleanSingleLine(body?.companyWebsite, 300);

    // Honeypot: bots often fill hidden fields. Pretend success without sending.
    if (companyWebsite) {
      return sendJson(res, 200, { ok: true, message: 'Message received.' });
    }

    const name = cleanSingleLine(body?.name, 120);
    const email = cleanSingleLine(body?.email, 254).toLowerCase();
    const subject = cleanSingleLine(body?.subject, 180);
    const message = cleanMessage(body?.message, 5000);

    if (name.length < 2 || subject.length < 3 || message.length < 10 || !isValidEmail(email)) {
      return sendJson(res, 400, {
        message: 'Please enter a valid name, work email, subject, and a message of at least 10 characters.',
      });
    }

    const recipients = parseMailRecipients(process.env.MAIL_TO);
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || recipients.length === 0) {
      console.error('Contact mail is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_TO to .env.');
      return sendJson(res, 503, {
        message: 'Contact email is temporarily unavailable. Please email info@aikyam.co directly.',
      });
    }

    const submittedAt = new Date().toISOString();
    const userAgent = cleanSingleLine(req.headers['user-agent'], 500) || 'Unavailable';
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
    const safeSubmittedAt = escapeHtml(submittedAt);
    const mailFrom = process.env.MAIL_FROM || `AIKYAM Website <${process.env.SMTP_USER}>`;

    await sendSmtpMail({
      from: mailFrom,
      to: recipients,
      replyTo: email,
      subject: `[AIKYAM Website] ${subject}`,
      text: [
        'New AIKYAM website enquiry',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        '',
        'Message:',
        message,
        '',
        `Submitted: ${submittedAt}`,
        `IP: ${ip}`,
        `User-Agent: ${userAgent}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#0d1520">
          <h2 style="margin-bottom:8px">New AIKYAM website enquiry</h2>
          <p style="margin-top:0;color:#526173">A visitor submitted the contact form on the AIKYAM website.</p>
          <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #e4eaf1">
            <tr><td style="font-weight:700;width:120px;background:#f6f8fb">Name</td><td>${safeName}</td></tr>
            <tr><td style="font-weight:700;background:#f6f8fb">Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="font-weight:700;background:#f6f8fb">Subject</td><td>${safeSubject}</td></tr>
            <tr><td style="font-weight:700;background:#f6f8fb;vertical-align:top">Message</td><td>${safeMessage}</td></tr>
            <tr><td style="font-weight:700;background:#f6f8fb">Submitted</td><td>${safeSubmittedAt}</td></tr>
          </table>
        </div>
      `,
    });

    return sendJson(res, 200, { ok: true, message: 'Message sent successfully.' });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    console.error('Contact form error:', error);

    if (!res.headersSent) {
      return sendJson(res, statusCode, {
        message:
          statusCode === 413
            ? 'Your message is too large. Please shorten it and try again.'
            : statusCode === 400
              ? 'The contact request is invalid.'
              : 'We could not send your message right now. Please try again or email info@aikyam.co directly.',
      });
    }
  }
}

function serveStatic(req, res, pathname) {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    requestedPath = '/';
  }

  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
  const candidate = path.resolve(distDir, relativePath);
  const insideDist = candidate === distDir || candidate.startsWith(`${distDir}${path.sep}`);
  const filePath = insideDist && fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    ? candidate
    : path.join(distDir, 'index.html');

  if (!fs.existsSync(filePath)) {
    if (!IS_PRODUCTION) {
      return sendJson(res, 404, { message: 'In development mode, please access the frontend via Vite dev server on port 3000.' });
    }
    return sendJson(res, 503, { message: 'Production build not found. Run npm run build first.' });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const isAsset = filePath !== path.join(distDir, 'index.html');
  const stat = fs.statSync(filePath);
  const range = req.headers.range;

  setCommonHeaders(res);

  if (range && (ext === '.mp4' || ext === '.webm')) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : stat.size - 1;
      if (Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end >= start && end < stat.size) {
        res.writeHead(206, {
          'Content-Type': contentType,
          'Content-Length': end - start + 1,
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
        });
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
    }

    res.writeHead(416, {
      'Content-Range': `bytes */${stat.size}`,
    });
    return res.end();
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': ext === '.mp4' || ext === '.webm' ? 'bytes' : 'none',
    'Cache-Control': isAsset ? 'public, max-age=86400' : 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, environment: NODE_ENV });
  }

  if (method === 'POST' && pathname === '/api/contact') {
    return handleContact(req, res);
  }

  if (pathname.startsWith('/api/')) {
    return sendJson(res, 404, { message: 'API route not found.' });
  }

  if (!['GET', 'HEAD'].includes(method)) {
    return sendJson(res, 405, { message: 'Method not allowed.' }, { Allow: 'GET, HEAD, POST' });
  }

  return serveStatic(req, res, pathname);
});

server.requestTimeout = 20_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AIKYAM server running on http://localhost:${PORT} (${NODE_ENV})`);
  if (!IS_PRODUCTION) console.log('Vite development server should run on http://localhost:3000');
});
