import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {
  describeFile,
  distRoot,
  extractCssReferences,
  extractHtmlReferences,
  findDuplicateFunctionNames,
  findDuplicateHtmlIds,
  listFiles,
  projectRoot,
  requiredPublicFiles,
  sha256File,
} from './lib/project.mjs';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const targetName = targetIndex >= 0 ? args[targetIndex + 1] : '.';
const verifyManifest = args.includes('--verify-manifest');
const targetRoot = path.resolve(projectRoot, targetName);
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function resolveInside(base, reference) {
  const resolved = path.resolve(base, reference);
  const relative = path.relative(targetRoot, resolved);
  return {
    resolved,
    inside: relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)),
  };
}

for (const relativePath of requiredPublicFiles) {
  check(await exists(path.join(targetRoot, relativePath)), `Missing required public file: ${relativePath}`);
}

const htmlPath = path.join(targetRoot, 'index.html');
const cssPath = path.join(targetRoot, 'assets/css/style.css');
const scriptPath = path.join(targetRoot, 'assets/js/script.js');
const html = await readFile(htmlPath, 'utf8');
const css = await readFile(cssPath, 'utf8');
const script = await readFile(scriptPath, 'utf8');

check(/<meta\s+charset=["']UTF-8["']/i.test(html), 'index.html must declare UTF-8.');
check(/http-equiv=["']Content-Security-Policy["']/i.test(html), 'Content Security Policy meta tag is missing.');
for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
  check(html.includes(directive), `Content Security Policy is missing: ${directive}`);
}
check(/<meta\s+name=["']referrer["']/i.test(html), 'Referrer policy meta tag is missing.');
check(!/\son[a-z]+\s*=/i.test(html), 'Inline event handlers are not allowed in index.html.');
check(findDuplicateHtmlIds(html).length === 0, `Duplicate HTML ids: ${findDuplicateHtmlIds(html).join(', ')}`);

const htmlReferences = extractHtmlReferences(html);
for (const reference of htmlReferences) {
  const candidate = resolveInside(targetRoot, reference);
  check(candidate.inside, `HTML reference escapes the public root: ${reference}`);
  if (candidate.inside) check(await exists(candidate.resolved), `Broken HTML reference: ${reference}`);
}

const cssBase = path.dirname(cssPath);
for (const reference of extractCssReferences(css)) {
  const candidate = resolveInside(cssBase, reference);
  check(candidate.inside, `CSS reference escapes the public root: ${reference}`);
  if (candidate.inside) check(await exists(candidate.resolved), `Broken CSS reference: ${reference}`);
}

const duplicateFunctions = findDuplicateFunctionNames(script);
check(
  duplicateFunctions.length === 0,
  `Duplicate top-level functions: ${duplicateFunctions.map(({ name, count }) => `${name} (${count})`).join(', ')}`,
);

try {
  new vm.Script(script, { filename: scriptPath });
  check(true, 'JavaScript syntax is valid.');
} catch (error) {
  check(false, `JavaScript syntax error: ${error.message}`);
}
check(script.includes('function safeUrl('), 'safeUrl security boundary is missing.');
check(script.includes('function bindMediaErrorHandlers('), 'Safe media error handling is missing.');
check(!script.toLowerCase().includes('javascript:'), 'Dangerous javascript: URL found in application source.');

const knownMojibake = ['\u00e2\u20ac\u201d', '\u00e2\u201d\u20ac', '\ufffd'];
for (const [label, content] of [['index.html', html], ['style.css', css], ['script.js', script]]) {
  check(!knownMojibake.some((value) => content.includes(value)), `Known encoding corruption found in ${label}.`);
}

const metadataDir = path.join(targetRoot, 'metadata');
for (const entry of await readdir(metadataDir, { withFileTypes: true })) {
  if (!entry.isFile() || path.extname(entry.name) !== '.json') continue;
  const metadataPath = path.join(metadataDir, entry.name);
  try {
    JSON.parse(await readFile(metadataPath, 'utf8'));
    check(true, `Valid JSON: metadata/${entry.name}`);
  } catch (error) {
    check(false, `Invalid JSON in metadata/${entry.name}: ${error.message}`);
  }
}

const release = JSON.parse(await readFile(path.join(targetRoot, 'metadata/release.json'), 'utf8'));
if (targetRoot === projectRoot) {
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));
  check(packageJson.version === release.version, 'package.json and metadata/release.json versions must match.');
}

if (verifyManifest) {
  check(targetRoot === distRoot, '--verify-manifest may only be used with --target dist.');
  const manifestPath = path.join(targetRoot, 'build-manifest.json');
  check(await exists(manifestPath), 'dist/build-manifest.json is missing.');

  if (await exists(manifestPath)) {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    check(manifest.release === release.version, 'Build manifest and release metadata versions must match.');

    const actualFiles = (await listFiles(targetRoot, {
      ignoredNames: ['.git', 'build-manifest.json'],
    })).filter((file) => file !== 'build-manifest.json');
    const expectedFiles = manifest.files.map((file) => file.path).sort((a, b) => a.localeCompare(b));
    check(JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), 'Build manifest file list does not match dist/.');

    for (const expected of manifest.files) {
      const actual = await describeFile(targetRoot, expected.path);
      check(actual.bytes === expected.bytes, `Size mismatch in dist/${expected.path}.`);
      check(actual.sha256 === expected.sha256, `SHA-256 mismatch in dist/${expected.path}.`);

      if (expected.path !== '.nojekyll') {
        const sourcePath = path.join(projectRoot, expected.path);
        check(await exists(sourcePath), `Source file missing for dist/${expected.path}.`);
        if (await exists(sourcePath)) {
          check(await sha256File(sourcePath) === expected.sha256, `dist/${expected.path} differs from source.`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`Quality gate failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Quality gate passed: ${checks} checks for ${path.relative(projectRoot, targetRoot) || 'source'}.`);
}
