# Output contract

`notionstash inspect` writes three local artifacts.

## `index.json`

A deterministic JSON index with:

- `schemaVersion`
- `generatedAt`
- `sourceRoot`
- `pages[]`
- `links[]`
- `attachments[]`
- `stats`

The index is intentionally SQLite-ish JSON for V1 to avoid native dependency pain while preserving a database-shaped contract.

## `markdown/`

A normalized Markdown tree. Each file includes frontmatter and a `Source:` line so agents can cite the original export file.

## `crawl-summary.md`

A compact audit report with crawl stats, page source links, and attachment source paths.
