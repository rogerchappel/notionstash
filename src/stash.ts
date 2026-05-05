import path from 'node:path';
import { assertDirectory, discoverSources } from './discover.js';
import { normalizeSources } from './normalize.js';
import { writeJsonIndex } from './index-writer.js';
import { writeMarkdownTree } from './markdown-writer.js';
import { writeSummary } from './summary.js';
import type { StashOptions, StashResult } from './types.js';

export async function stashNotionExport(options: StashOptions): Promise<StashResult> {
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  await assertDirectory(input);
  const sources = await discoverSources(input);
  const index = await normalizeSources(input, sources);
  const indexPath = await writeJsonIndex(index, output, options.pretty ?? true);
  const markdownRoot = await writeMarkdownTree(index, output);
  const summaryPath = await writeSummary(index, output);
  return { index, indexPath, markdownRoot, summaryPath };
}

export * from './types.js';
export { discoverSources } from './discover.js';
export { normalizeSources } from './normalize.js';
export { renderSummary } from './summary.js';
export { renderPage } from './markdown-writer.js';
