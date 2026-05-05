import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverSources } from '../dist/index.js';

test('discovers markdown pages and assets deterministically', async () => {
  const sources = await discoverSources('fixtures/notion-export');
  assert.deepEqual(sources.map((source) => source.relativePath), [
    'Home 0123456789abcdef0123456789abcdef.md',
    'Project Alpha/Project Alpha abcdefabcdefabcdefabcdefabcdefab.md',
    'assets/brief.pdf',
    'assets/diagram.png'
  ]);
  assert.equal(sources.filter((source) => source.kind === 'markdown').length, 2);
  assert.equal(sources.filter((source) => source.kind === 'asset').length, 2);
});
