import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverSources, normalizeSources } from '../dist/index.js';

test('normalizes pages, links, blocks, and attachments', async () => {
  const root = 'fixtures/notion-export';
  const sources = await discoverSources(root);
  const index = await normalizeSources(root, sources, '2026-05-05T08:30:00.000Z');
  assert.equal(index.stats.pages, 3);
  assert.ok(index.stats.blocks >= 8);
  assert.equal(index.links.some((link) => link.kind === 'external' && link.href === 'https://notion.so'), true);
  assert.equal(index.attachments.some((attachment) => attachment.sourcePath.includes('diagram.png')), true);
  assert.equal(index.pages.map((page) => page.title).join(','), 'Home,Project Alpha,Research Notes');
  assert.equal(index.pages.some((page) => page.blocks.some((block) => block.type === 'quote')), true);
});
