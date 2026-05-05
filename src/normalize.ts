import path from 'node:path';
import type { CrawlSource, NormalizedAttachment, NormalizedPage, StashIndex } from './types.js';
import { parseMarkdownPage } from './markdown-parser.js';
import { parseHtmlPage } from './html-parser.js';
import { stableId } from './path-utils.js';

export async function normalizeSources(sourceRoot: string, sources: CrawlSource[], generatedAt = new Date().toISOString()): Promise<StashIndex> {
  const pages: NormalizedPage[] = [];
  const looseAssets: NormalizedAttachment[] = [];

  for (const source of sources) {
    if (source.kind === 'markdown') pages.push(await parseMarkdownPage(source));
    if (source.kind === 'html') pages.push(await parseHtmlPage(source));
    if (source.kind === 'asset') {
      looseAssets.push({
        id: stableId('asset', source.relativePath),
        pageId: 'unlinked',
        kind: /\.(png|jpe?g|gif|webp|svg)$/i.test(source.relativePath) ? 'image' : 'file',
        href: path.basename(source.relativePath),
        sourcePath: source.relativePath
      });
    }
  }

  const links = pages.flatMap((page) => page.links);
  const pageAttachments = pages.flatMap((page) => page.attachments);
  const attachments = mergeAttachments([...pageAttachments, ...looseAssets]);

  return {
    schemaVersion: 1,
    generatedAt,
    sourceRoot: path.resolve(sourceRoot),
    pages: pages.sort((a, b) => a.relativePath.localeCompare(b.relativePath)),
    links,
    attachments,
    stats: {
      pages: pages.length,
      blocks: pages.reduce((count, page) => count + page.blocks.length, 0),
      links: links.length,
      attachments: attachments.length
    }
  };
}

function mergeAttachments(attachments: NormalizedAttachment[]): NormalizedAttachment[] {
  const seen = new Map<string, NormalizedAttachment>();
  for (const attachment of attachments) {
    if (!seen.has(attachment.sourcePath)) seen.set(attachment.sourcePath, attachment);
  }
  return [...seen.values()].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}
