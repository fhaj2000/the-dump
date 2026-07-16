import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectRoot } from './lib/project.mjs';

const testsRoot = path.join(projectRoot, 'tests');
const tests = (await readdir(testsRoot))
  .filter((file) => file.endsWith('.test.mjs'))
  .sort((a, b) => a.localeCompare(b));

if (!tests.length) throw new Error('No .test.mjs files were found.');

for (const file of tests) {
  await import(pathToFileURL(path.join(testsRoot, file)));
}

