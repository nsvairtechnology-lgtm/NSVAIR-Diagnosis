const { createServer } = require('http');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
try {
  const dbDir = path.join(process.cwd(), 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (e) {
  // ignore
}

// Fallback DATABASE_URL if missing or pointing to sandbox
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('/home/z/')) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'db', 'custom.db')}`;
}

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

console.log(`🚀 Starting NSVAIR Diagnosis on ${hostname}:${port}...`);

const app = next({
  dev: false,
  hostname,
  port,
  dir: process.cwd(),
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      // Basic health check endpoint
      if (req.url === '/health' || req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', app: 'NSVAIR Diagnosis', timestamp: new Date().toISOString() }));
        return;
      }
      handle(req, res);
    });

    server.listen(port, hostname, (err) => {
      if (err) {
        console.error('❌ Failed to listen on port:', err);
        process.exit(1);
      }
      console.log(`✅ NSVAIR Diagnosis is live and listening on http://${hostname}:${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully...');
      server.close(() => process.exit(0));
    });
    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT, shutting down...');
      server.close(() => process.exit(0));
    });
  })
  .catch((err) => {
    console.error('❌ Error preparing Next.js server:', err);
    process.exit(1);
  });
