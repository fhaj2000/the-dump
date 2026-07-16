import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  assertSafeDistPath,
  describeFile,
  distRoot,
  listFiles,
  projectRoot,
  publicEntries,
} from './lib/project.mjs';

const output = assertSafeDistPath(distRoot);
const packageJson = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));

await mkdir(output, { recursive: true });

for (const entry of await readdir(output, { withFileTypes: true })) {
  if (entry.name === '.git') continue;
  await rm(path.join(output, entry.name), { recursive: true, force: true });
}

for (const entry of publicEntries) {
  await cp(path.join(projectRoot, entry), path.join(output, entry), {
    recursive: true,
    force: true,
  });
}

await writeFile(path.join(output, '.nojekyll'), '', 'utf8');

const files = (await listFiles(output, {
  ignoredNames: ['.git', 'build-manifest.json'],
})).filter((file) => file !== 'build-manifest.json');

const manifest = {
  schemaVersion: 1,
  release: packageJson.version,
  files: await Promise.all(files.map((file) => describeFile(output, file))),
};

await writeFile(
  path.join(output, 'build-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

const bytes = manifest.files.reduce((total, file) => total + file.bytes, 0);
console.log(`Built DUMP ${manifest.release}: ${manifest.files.length} files, ${bytes} bytes.`);
