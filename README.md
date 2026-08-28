# AIKYAM Website

Responsive AIKYAM React/Vite website with a server-side contact form mail API.

## What is included

- Technology Ecosystem section removed from the website and section progress navigation.
- Responsive navigation for desktop, tablet and mobile, including an accessible hamburger menu.
- Responsive layout refinements for phones, tablets, laptops, landscape phones and large screens.
- Working contact form that sends the submitted name, work email, subject and message to your configured email address.
- SMTP credentials stay on the server in `.env`; they are never exposed to the browser bundle.
- Contact endpoint includes validation, rate limiting, security headers and a bot honeypot.

## 1. Install

```bash
npm install
```

## 2. Configure email

Copy `.env.example` to `.env` and add your SMTP credentials:

```bash
cp .env.example .env
```

Required values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-app-password
MAIL_TO=info@aikyam.co
MAIL_FROM="AIKYAM Website <your-email@yourdomain.com>"
```

For Gmail/Google Workspace, use an **App Password** when 2-Step Verification is enabled. Do not put SMTP secrets in variables beginning with `VITE_`, because Vite exposes those variables to the browser.

## 3. Development

Run frontend and contact API together:

```bash
npm run dev
```

- Website: `http://localhost:3000`
- API: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## 4. Production build

```bash
npm run build
npm start
```

In production, the Node server serves the built React app from `dist` and handles `/api/contact` from the same domain.

Typical production environment:

```env
NODE_ENV=production
PORT=3001
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
MAIL_TO=...
MAIL_FROM=...
```

If a reverse proxy such as Nginx forwards traffic to Node, point it to the Node port. Set `TRUST_PROXY=true` only when the proxy is trusted and configured correctly.

## Contact email contents

Each successful form submission sends an email containing:

- Visitor name
- Visitor email (also set as Reply-To)
- Project/request subject
- Full message
- Submission timestamp
- Request IP and User-Agent in the plain-text diagnostic copy

## Useful commands

```bash
npm run dev       # Vite + email API
npm run dev:web   # Frontend only
npm run dev:api   # Contact API only
npm run check     # TypeScript check
npm run build     # Production frontend build
npm start         # Production Node server
```
