import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StashIndex } from './types.js';

export async function writeSummary(index: StashIndex, outputRoot: string): Promise<string> {
  const destination = path.join(outputRoot, 'crawl-summary.md');
  await writeFile(destination, renderSummary(index), 'utf8');
  return destination;
}

export function renderSummary(index: StashIndex): string {
  const lines = [
    '# notionstash crawl summary',
    '',
    `Generated: ${index.generatedAt}`,
    `Source root: ${index.sourceRoot}`,
    '',
    '## Stats',
    '',
    `- Pages: ${index.stats.pages}`,
    `- Blocks: ${index.stats.blocks}`,
    `- Links: ${index.stats.links}`,
    `- Attachments: ${index.stats.attachments}`,
    '',
    '## Pages',
    ''
  ];

  for (const page of index.pages) {
    lines.push(`- ${page.title}`);
    lines.push(`  - Source: ${page.relativePath}`);
    lines.push(`  - Blocks: ${page.blocks.length}`);
    if (page.links.length) lines.push(`  - Links: ${page.links.length}`);
    if (page.attachments.length) lines.push(`  - Attachments: ${page.attachments.length}`);
  }

  if (index.attachments.length > 0) {
    lines.push('', '## Attachment sources', '');
    for (const attachment of index.attachments) lines.push(`- ${attachment.sourcePath}`);
  }

  return lines.join('\n') + '\n';
}
