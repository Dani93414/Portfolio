import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    if (!path.extname(pathname)) pathname += '.html';
    const target = path.normalize(path.join(root, pathname));
    if (!target.startsWith(root)) throw new Error('Invalid path');
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    const content = await readFile(target);
    response.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      // This is a local development server: always serve the latest edited file.
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    response.end(content);
  } catch {
    try {
      const content = await readFile(path.join(root, '404.html'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(content);
    } catch {
      response.writeHead(404).end('404');
    }
  }
});

server.listen(port, () => console.log(`Portfolio disponible en http://localhost:${port}`));
