import path from 'node:path';
import { createHash } from 'node:crypto';

export function slashPath(value: string): string {
  return value.split(path.sep).join('/');
}

export function stableId(...parts: string[]): string {
  return createHash('sha1').update(parts.join('\0')).digest('hex').slice(0, 16);
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'untitled';
}

export function notionNameWithoutId(fileName: string): string {
  const stem = fileName.replace(/\.(md|markdown|html)$/i, '');
  return stem.replace(/\s+[0-9a-f]{32}$/i, '').trim();
}

export function isProbablyAsset(fileName: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg|pdf|zip|csv|xlsx?|docx?|pptx?|mov|mp4|mp3|wav)$/i.test(fileName);
}
