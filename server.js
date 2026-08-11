const path = require('path');
const fs = require('fs');
const http = require('http');

// Ensure database directory exists
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Fallback DATABASE_URL if pointing to /home/z/
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('/home/z/')) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'db', 'custom.db')}`;
}

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`🚀 Starting NSVAIR Diagnosis Server on ${hostname}:${port}...`);

const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standalonePath)) {
  console.log(`📦 Launching Next.js standalone server from ${standalonePath}`);
  process.env.PORT = String(port);
  process.env.HOSTNAME = hostname;
  require(standalonePath);
} else {
  console.log(`⚡ Launching standard Next.js production server on ${hostname}:${port}`);
  const next = require('next');
  const app = next({ dev: false, hostname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(port, hostname, (err) => {
      if (err) {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
      }
      console.log(`✅ NSVAIR Diagnosis ready on http://${hostname}:${port}`);
    });
  }).catch((err) => {
    console.error('❌ Error preparing Next.js app:', err);
    process.exit(1);
  });
}
