import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { projectRoot } from '../scripts/lib/project.mjs';

const source = await readFile(path.join(projectRoot, 'assets/js/script.js'), 'utf8');
const start = source.indexOf('function safeUrl(');
const endMarker = '\n}\n\nfunction mediaAttrs';
const end = source.indexOf(endMarker, start);

assert.notEqual(start, -1, 'safeUrl function was not found');
assert.notEqual(end, -1, 'safeUrl function boundary was not found');

const sandbox = {
  isAssetRef(value) {
    return String(value || '').startsWith('idb-asset:');
  },
};

vm.runInNewContext(`${source.slice(start, end + 2)}\nthis.safeUrl = safeUrl;`, sandbox);
const { safeUrl } = sandbox;

test('safeUrl accepts expected public and local URLs', () => {
  assert.equal(safeUrl('https://example.com/image.png', 'image'), 'https://example.com/image.png');
  assert.equal(safeUrl('http://localhost:8080/audio/test.mp3', 'audio'), 'http://localhost:8080/audio/test.mp3');
  assert.equal(safeUrl('audio/page-turn-add.wav', 'audio'), 'audio/page-turn-add.wav');
  assert.equal(safeUrl('blob:https://example.com/id', 'audio'), 'blob:https://example.com/id');
  assert.equal(safeUrl('idb-asset:123', 'link'), 'idb-asset:123');
});

test('safeUrl accepts only allow-listed data URL media types', () => {
  assert.equal(safeUrl('data:image/png;base64,AA==', 'image'), 'data:image/png;base64,AA==');
  assert.equal(safeUrl('data:audio/wav;base64,AA==', 'audio'), 'data:audio/wav;base64,AA==');
  assert.equal(safeUrl('data:text/html;base64,AA==', 'link'), '');
  assert.equal(safeUrl('data:image/svg+xml;base64,AA==', 'image'), '');
});

test('safeUrl rejects executable, protocol-relative and malformed URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'vbscript:msgbox(1)',
    '//evil.example/path',
    'folder\\file.png',
    'image.png" onerror="alert(1)',
  ]) {
    assert.equal(safeUrl(value, 'link'), '');
  }
});

