export type AttachmentKind = 'image' | 'file';

export type StashOptions = {
  input: string;
  output: string;
  pretty?: boolean;
};

export type CrawlSource = {
  root: string;
  relativePath: string;
  absolutePath: string;
  kind: 'markdown' | 'html' | 'asset';
};

export type NormalizedBlock = {
  id: string;
  pageId: string;
  type: 'heading' | 'paragraph' | 'list_item' | 'todo' | 'quote' | 'code' | 'image' | 'attachment';
  text: string;
  depth: number;
  sourceLine?: number;
};

export type NormalizedLink = {
  id: string;
  pageId: string;
  text: string;
  href: string;
  kind: 'internal' | 'external' | 'attachment';
  sourceLine?: number;
};

export type NormalizedAttachment = {
  id: string;
  pageId: string;
  kind: AttachmentKind;
  href: string;
  sourcePath: string;
  copiedTo?: string;
};

export type NormalizedPage = {
  id: string;
  title: string;
  slug: string;
  sourcePath: string;
  relativePath: string;
  parentPath?: string;
  blocks: NormalizedBlock[];
  links: NormalizedLink[];
  attachments: NormalizedAttachment[];
};

export type StashIndex = {
  schemaVersion: 1;
  generatedAt: string;
  sourceRoot: string;
  pages: NormalizedPage[];
  links: NormalizedLink[];
  attachments: NormalizedAttachment[];
  stats: {
    pages: number;
    blocks: number;
    links: number;
    attachments: number;
  };
};

export type StashResult = {
  index: StashIndex;
  indexPath: string;
  markdownRoot: string;
  summaryPath: string;
};
