import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const projectRoot = path.resolve(currentDir, '..', '..');
export const distRoot = path.join(projectRoot, 'dist');

export const publicEntries = [
  'index.html',
  'assets',
  'audio',
  'metadata',
];

export const requiredPublicFiles = [
  'index.html',
  'assets/css/style.css',
  'assets/js/script.js',
  'assets/images/favicon.png',
  'assets/images/dump-logo.png',
  'audio/mouse-click-sound.mp3',
  'audio/page-turn-add.wav',
  'audio/paper-crumple-trash.wav',
  'metadata/release.json',
];

const externalReference = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function toPosix(value) {
  return value.split(path.sep).join('/');
}

export function stripQueryAndHash(value) {
  return value.split('#', 1)[0].split('?', 1)[0];
}

export function isLocalReference(value) {
  const clean = String(value || '').trim();
  return Boolean(clean) && !externalReference.test(clean);
}

export function extractHtmlReferences(html) {
  const references = [];
  const attribute = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attribute)) {
    if (isLocalReference(match[1])) references.push(stripQueryAndHash(match[1]));
  }
  return references;
}

export function extractCssReferences(css) {
  const references = [];
  const url = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of css.matchAll(url)) {
    if (isLocalReference(match[1])) references.push(stripQueryAndHash(match[1]));
  }
  return references;
}

export function findDuplicateHtmlIds(html) {
  const counts = new Map();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    counts.set(match[1], (counts.get(match[1]) || 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
}

export function findDuplicateFunctionNames(source) {
  const counts = new Map();
  for (const match of source.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) {
    counts.set(match[1], (counts.get(match[1]) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name, count]) => ({ name, count }));
}

export async function listFiles(root, options = {}) {
  const ignoredNames = new Set(options.ignoredNames || []);
  const files = [];

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoredNames.has(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) files.push(toPosix(path.relative(root, absolute)));
    }
  }

  await walk(root);
  return files.sort((a, b) => a.localeCompare(b));
}

export async function sha256File(file) {
  const content = await readFile(file);
  return createHash('sha256').update(content).digest('hex');
}

export async function describeFile(root, relativePath) {
  const absolute = path.join(root, relativePath);
  const details = await stat(absolute);
  return {
    path: toPosix(relativePath),
    bytes: details.size,
    sha256: await sha256File(absolute),
  };
}

export function assertSafeDistPath(candidate) {
  const resolved = path.resolve(candidate);
  if (resolved !== distRoot || path.dirname(resolved) !== projectRoot || path.basename(resolved) !== 'dist') {
    throw new Error(`Refusing to clean unexpected output path: ${resolved}`);
  }
  return resolved;
}

