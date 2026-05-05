import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { CrawlSource, NormalizedBlock, NormalizedPage } from './types.js';
import { extractHtmlLinks, stripTags } from './links.js';
import { notionNameWithoutId, slugify, stableId } from './path-utils.js';

export async function parseHtmlPage(source: CrawlSource): Promise<NormalizedPage> {
  const html = await readFile(source.absolutePath, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim()
    || stripTags(html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1] ?? '').trim()
    || notionNameWithoutId(path.basename(source.relativePath));
  const pageId = stableId(source.relativePath, title);
  const blocks = htmlToBlocks(pageId, html);
  const links = extractHtmlLinks(pageId, html);

  return {
    id: pageId,
    title,
    slug: slugify(title),
    sourcePath: source.absolutePath,
    relativePath: source.relativePath,
    parentPath: path.posix.dirname(source.relativePath) === '.' ? undefined : path.posix.dirname(source.relativePath),
    blocks,
    links,
    attachments: links.filter((link) => link.kind === 'attachment').map((link) => ({
      id: stableId(pageId, link.href, 'attachment'),
      pageId,
      kind: /\.(png|jpe?g|gif|webp|svg)($|[?#])/i.test(link.href) ? 'image' : 'file',
      href: link.href,
      sourcePath: path.posix.join(path.posix.dirname(source.relativePath), link.href)
    }))
  };
}

function htmlToBlocks(pageId: string, html: string): NormalizedBlock[] {
  const blocks: NormalizedBlock[] = [];
  const pattern = /<(h[1-6]|p|li|blockquote|pre)[^>]*>(.*?)<\/\1>/gis;
  let index = 0;
  for (const match of html.matchAll(pattern)) {
    const tag = (match[1] ?? 'p').toLowerCase();
    const text = stripTags(match[2] ?? '').trim();
    if (!text) continue;
    const type = tag.startsWith('h') ? 'heading' : tag === 'li' ? 'list_item' : tag === 'blockquote' ? 'quote' : tag === 'pre' ? 'code' : 'paragraph';
    const depth = tag.startsWith('h') ? Number(tag.slice(1)) : 0;
    blocks.push({ id: stableId(pageId, String(index), type, text), pageId, type, text, depth });
    index += 1;
  }
  return blocks;
}
