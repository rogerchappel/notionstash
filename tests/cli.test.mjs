import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { main } from '../dist/cli.js';

test('cli inspect writes fixture output', async () => {
  const out = await mkdtemp(path.join(tmpdir(), 'notionstash-cli-'));
  try {
    const code = await main(['inspect', 'fixtures/notion-export', '--output', out]);
    assert.equal(code, 0);
    const index = JSON.parse(await readFile(path.join(out, 'index.json'), 'utf8'));
    assert.equal(index.stats.pages, 3);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});
