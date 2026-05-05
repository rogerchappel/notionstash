import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StashIndex } from './types.js';

export async function writeJsonIndex(index: StashIndex, outputRoot: string, pretty = true): Promise<string> {
  await mkdir(outputRoot, { recursive: true });
  const destination = path.join(outputRoot, 'index.json');
  await writeFile(destination, JSON.stringify(index, null, pretty ? 2 : 0) + '\n', 'utf8');
  return destination;
}
