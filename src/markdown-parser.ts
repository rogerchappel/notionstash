import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { CrawlSource, NormalizedAttachment, NormalizedBlock, NormalizedPage } from './types.js';
import { extractMarkdownLinks } from './links.js';
import { notionNameWithoutId, slashPath, slugify, stableId } from './path-utils.js';

export async function parseMarkdownPage(source: CrawlSource): Promise<NormalizedPage> {
  const text = await readFile(source.absolutePath, 'utf8');
  const title = findTitle(text) || notionNameWithoutId(path.basename(source.relativePath));
  const pageId = stableId(source.relativePath, title);
  const blocks: NormalizedBlock[] = [];
  const links = [];
  const attachments: NormalizedAttachment[] = [];

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? '';
    const line = raw.trim();
    if (!line) continue;
    const sourceLine = i + 1;
    const block = parseLine(pageId, line, sourceLine);
    if (block) blocks.push(block);
    const lineLinks = extractMarkdownLinks(pageId, raw, sourceLine);
    links.push(...lineLinks);
    for (const link of lineLinks.filter((candidate) => candidate.kind === 'attachment')) {
      attachments.push({
        id: stableId(pageId, link.href, 'attachment'),
        pageId,
        kind: /\.(png|jpe?g|gif|webp|svg)($|[?#])/i.test(link.href) ? 'image' : 'file',
        href: link.href,
        sourcePath: slashPath(path.posix.join(path.posix.dirname(source.relativePath), link.href))
      });
    }
  }

  return {
    id: pageId,
    title,
    slug: slugify(title),
    sourcePath: source.absolutePath,
    relativePath: source.relativePath,
    parentPath: path.posix.dirname(source.relativePath) === '.' ? undefined : path.posix.dirname(source.relativePath),
    blocks,
    links,
    attachments
  };
}

function findTitle(markdown: string): string | undefined {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || undefined;
}

function parseLine(pageId: string, line: string, sourceLine: number): NormalizedBlock | undefined {
  const heading = line.match(/^(#{1,6})\s+(.+)$/);
  if (heading) {
    return block(pageId, 'heading', heading[2] ?? '', heading[1]?.length ?? 1, sourceLine);
  }
  const todo = line.match(/^- \[([ xX])\]\s+(.+)$/);
  if (todo) return block(pageId, 'todo', todo[2] ?? '', 0, sourceLine);
  const list = line.match(/^[-*+]\s+(.+)$/);
  if (list) return block(pageId, 'list_item', list[1] ?? '', 0, sourceLine);
  const quote = line.match(/^>\s+(.+)$/);
  if (quote) return block(pageId, 'quote', quote[1] ?? '', 0, sourceLine);
  if (/^```/.test(line)) return block(pageId, 'code', line, 0, sourceLine);
  if (/^!\[[^\]]*\]\([^)]+\)/.test(line)) return block(pageId, 'image', line, 0, sourceLine);
  return block(pageId, 'paragraph', line, 0, sourceLine);
}

function block(pageId: string, type: NormalizedBlock['type'], text: string, depth: number, sourceLine: number): NormalizedBlock {
  return {
    id: stableId(pageId, String(sourceLine), type, text),
    pageId,
    type,
    text: text.trim(),
    depth,
    sourceLine
  };
}
