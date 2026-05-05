import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import type { CrawlSource } from './types.js';
import { isProbablyAsset, slashPath } from './path-utils.js';

export async function discoverSources(root: string): Promise<CrawlSource[]> {
  const absoluteRoot = path.resolve(root);
  const out: CrawlSource[] = [];
  await walk(absoluteRoot, absoluteRoot, out);
  return out.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function walk(root: string, current: string, out: CrawlSource[]): Promise<void> {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await walk(root, full, out);
      continue;
    }
    if (!entry.isFile()) continue;
    const source = classify(root, full);
    if (source) out.push(source);
  }
}

function classify(root: string, absolutePath: string): CrawlSource | undefined {
  const relativePath = slashPath(path.relative(root, absolutePath));
  if (/\.(md|markdown)$/i.test(absolutePath)) {
    return { root, absolutePath, relativePath, kind: 'markdown' };
  }
  if (/\.html?$/i.test(absolutePath)) {
    return { root, absolutePath, relativePath, kind: 'html' };
  }
  if (isProbablyAsset(absolutePath)) {
    return { root, absolutePath, relativePath, kind: 'asset' };
  }
  return undefined;
}

export async function assertDirectory(pathName: string): Promise<void> {
  const info = await stat(pathName).catch(() => undefined);
  if (!info?.isDirectory()) {
    throw new Error(`Input must be an existing Notion export directory: ${pathName}`);
  }
}
