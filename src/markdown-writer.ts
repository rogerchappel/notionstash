import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { NormalizedPage, StashIndex } from './types.js';
import { slashPath } from './path-utils.js';

export async function writeMarkdownTree(index: StashIndex, outputRoot: string): Promise<string> {
  const markdownRoot = path.join(outputRoot, 'markdown');
  await mkdir(markdownRoot, { recursive: true });
  for (const page of index.pages) {
    const destination = path.join(markdownRoot, page.parentPath ?? '', `${page.slug}.md`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, renderPage(page), 'utf8');
  }
  return markdownRoot;
}

export function renderPage(page: NormalizedPage): string {
  const lines = [
    '---',
    `id: ${page.id}`,
    `title: ${JSON.stringify(page.title)}`,
    `source: ${JSON.stringify(page.relativePath)}`,
    '---',
    '',
    `# ${page.title}`,
    '',
    `> Source: ${page.relativePath}`,
    ''
  ];

  for (const block of page.blocks) {
    if (block.type === 'heading') lines.push(`${'#'.repeat(Math.max(1, block.depth))} ${block.text}`);
    else if (block.type === 'list_item') lines.push(`- ${block.text}`);
    else if (block.type === 'todo') lines.push(`- [ ] ${block.text}`);
    else if (block.type === 'quote') lines.push(`> ${block.text}`);
    else lines.push(block.text);
    lines.push('');
  }

  if (page.links.length > 0) {
    lines.push('## Links', '');
    for (const link of page.links) lines.push(`- [${link.text}](${link.href}) (${link.kind})`);
    lines.push('');
  }

  if (page.attachments.length > 0) {
    lines.push('## Attachments', '');
    for (const attachment of page.attachments) lines.push(`- ${attachment.kind}: ${slashPath(attachment.sourcePath)}`);
    lines.push('');
  }

  return lines.join('\n');
}
