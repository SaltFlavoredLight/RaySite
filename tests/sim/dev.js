
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const PORT = 2237;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let pathname;

  try {
    pathname = decodeURIComponent(
      new URL(req.url, `http://localhost:${PORT}`).pathname
    );
  } catch {
    res.writeHead(400);
    return res.end('Bad Request');
  }

  const relativePath = pathname === '/'
    ? 'index.html'
    : pathname.replace(/^\/+/, '');

  const filePath = path.resolve(ROOT, relativePath);

  // Prevent requests from accessing files outside the project root.
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end('404 - File Not Found');
    }

    res.writeHead(200, {
      'Content-Type':
        MIME_TYPES[path.extname(filePath).toLowerCase()] ||
        'application/octet-stream'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving files from: ${ROOT}`);
});
