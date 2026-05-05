import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { main } from '../dist/cli.js';

test('cli inspect writes fixture output', async () => {
  const out = path.resolve('out/test-cli');
  const originalLog = console.log;
  try {
    await rm(out, { recursive: true, force: true });
    await mkdir(path.dirname(out), { recursive: true });
    console.log = () => undefined;
    const code = await main(['inspect', 'fixtures/notion-export', '--output', out]);
    assert.equal(code, 0);
    const index = JSON.parse(await readFile(path.join(out, 'index.json'), 'utf8'));
    assert.equal(index.stats.pages, 3);
  } finally {
    console.log = originalLog;
    await rm(out, { recursive: true, force: true });
  }
});
