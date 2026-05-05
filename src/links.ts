import type { NormalizedLink } from './types.js';
import { stableId } from './path-utils.js';

const markdownLinkPattern = /!?\[([^\]]*)\]\(([^)]+)\)/g;
const htmlLinkPattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;

export function extractMarkdownLinks(pageId: string, line: string, sourceLine: number): NormalizedLink[] {
  const links: NormalizedLink[] = [];
  for (const match of line.matchAll(markdownLinkPattern)) {
    const href = cleanHref(match[2] ?? '');
    if (!href) continue;
    links.push({
      id: stableId(pageId, href, String(sourceLine), match[0]),
      pageId,
      text: match[1] || href,
      href,
      kind: classifyLink(href),
      sourceLine
    });
  }
  return links;
}

export function extractHtmlLinks(pageId: string, html: string): NormalizedLink[] {
  const links: NormalizedLink[] = [];
  for (const match of html.matchAll(htmlLinkPattern)) {
    const href = cleanHref(match[1] ?? '');
    if (!href) continue;
    links.push({
      id: stableId(pageId, href, match[0]),
      pageId,
      text: stripTags(match[2] ?? href).trim() || href,
      href,
      kind: classifyLink(href)
    });
  }
  return links;
}

export function classifyLink(href: string): NormalizedLink['kind'] {
  if (/^https?:\/\//i.test(href)) return 'external';
  if (/\.(png|jpe?g|gif|webp|svg|pdf|zip|csv|xlsx?|docx?|pptx?)($|[?#])/i.test(href)) return 'attachment';
  return 'internal';
}

export function cleanHref(href: string): string {
  return href.trim().replace(/^<|>$/g, '').replace(/\\ /g, ' ');
}

export function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}
