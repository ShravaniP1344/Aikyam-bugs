import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const children = [];
let shuttingDown = false;

function start(command, args = [], options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
    ...options,
  });

  children.push(child);

  child.on('error', (error) => {
    console.error(`\nFailed to start ${command}:`, error.message);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown && code !== 0 && signal == null) {
      shutdown(code ?? 1);
    }
  });

  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child && !child.killed) {
      try {
        child.kill(isWindows ? undefined : 'SIGTERM');
      } catch {
        // Process may already have exited.
      }
    }
  }

  setTimeout(() => process.exit(code), 150);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// Start contact form backend on internal port 3001
start(
  process.execPath,
  ['--env-file-if-exists=.env', 'server/index.mjs'],
  {
    env: {
      ...process.env,
      PORT: '3001',
      API_PORT: '3001',
    },
  }
);

// Start Vite frontend
if (isWindows) {
  const comspec =
    process.env.ComSpec ||
    process.env.COMSPEC ||
    'cmd.exe';

  start(
    comspec,
    ['/d', '/s', '/c', 'npm run dev:web'],
    { windowsHide: false }
  );
} else {
  start('npm', ['run', 'dev:web']);
}