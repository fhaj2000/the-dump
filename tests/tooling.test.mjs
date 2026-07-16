import assert from 'node:assert/strict';
import test from 'node:test';
import {
  extractCssReferences,
  extractHtmlReferences,
  findDuplicateFunctionNames,
  findDuplicateHtmlIds,
  isLocalReference,
  stripQueryAndHash,
} from '../scripts/lib/project.mjs';

test('reference extraction keeps only local public assets', () => {
  const html = '<link href="assets/site.css?v=2"><img src="images/a.png#x"><a href="https://example.com">x</a>';
  const css = '.a{background:url("../images/a.png?v=1")} .b{background:url(data:image/png;base64,AA==)}';

  assert.deepEqual(extractHtmlReferences(html), ['assets/site.css', 'images/a.png']);
  assert.deepEqual(extractCssReferences(css), ['../images/a.png']);
  assert.equal(stripQueryAndHash('a.png?v=1#x'), 'a.png');
  assert.equal(isLocalReference('//example.com/file'), false);
});

test('duplicate declarations are reported deterministically', () => {
  const source = 'function alpha() {}\nfunction beta() {}\nfunction alpha() {}\n';
  assert.deepEqual(findDuplicateFunctionNames(source), [{ name: 'alpha', count: 2 }]);
  assert.deepEqual(findDuplicateHtmlIds('<div id="a"></div><span id="a"></span>'), ['a']);
});

