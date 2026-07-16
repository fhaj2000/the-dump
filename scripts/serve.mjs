import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { distRoot, projectRoot } from './lib/project.mjs';

const root = process.argv.includes('--dist') ? distRoot : projectRoot;
const port = Number.parseInt(process.env.PORT || '8080', 10);
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
  ['.png', 'image/png'],
  ['.wav', 'audio/wav'],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const candidate = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, candidate);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const details = await stat(candidate);
    if (!details.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.setHeader('Content-Type', mimeTypes.get(path.extname(candidate).toLowerCase()) || 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (request.method === 'HEAD') response.end();
    else createReadStream(candidate).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  const label = root === distRoot ? 'dist' : 'source';
  console.log(`Serving ${label} at http://localhost:${port}`);
});

