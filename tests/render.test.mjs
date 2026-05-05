import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPage, renderSummary } from '../dist/index.js';

test('renders source-linked markdown page and summary', () => {
  const page = {
    id: 'p1', title: 'Demo', slug: 'demo', sourcePath: '/tmp/Demo.md', relativePath: 'Demo.md',
    blocks: [{ id: 'b1', pageId: 'p1', type: 'paragraph', text: 'Hello', depth: 0, sourceLine: 1 }],
    links: [{ id: 'l1', pageId: 'p1', text: 'Site', href: 'https://example.com', kind: 'external', sourceLine: 1 }],
    attachments: []
  };
  const markdown = renderPage(page);
  assert.match(markdown, /Source: Demo\.md/);
  assert.match(markdown, /https:\/\/example\.com/);

  const summary = renderSummary({ schemaVersion: 1, generatedAt: 'now', sourceRoot: '/tmp', pages: [page], links: page.links, attachments: [], stats: { pages: 1, blocks: 1, links: 1, attachments: 0 } });
  assert.match(summary, /Pages: 1/);
});
