# notionstash

A local-first Notion export crawler that turns messy export folders into a tidy JSON index, an agent-ready Markdown tree, and a source-linked crawl summary.

Think of it as a little librarian for your exported workspace: careful, deterministic, and nosy only inside the folder you point it at.

## Why

Notion exports are useful but awkward for agents and developer tools. `notionstash` normalizes the useful parts — pages, blocks, links, and attachments — without touching the Notion API or sending data anywhere.

## Install

```bash
npm install
npm run build
```

## Quickstart

```bash
node dist/cli.js inspect ./fixtures/notion-export --output ./out/demo
# or after package install/link:
notionstash inspect ./fixtures/notion-export --output ./out/demo
```

Outputs:

- `index.json` — SQLite-ish JSON database for pages, blocks, links, attachments, and stats.
- `markdown/` — normalized Markdown files with frontmatter and source links.
- `crawl-summary.md` — human-readable audit summary with source paths.

## CLI

```bash
notionstash inspect <export-dir> --output <out-dir>
notionstash inspect <export-dir> --output <out-dir> --compact
```

`inspect` requires a local directory. There are no hidden network calls, telemetry hooks, credentials, or publish steps.

## Example result

```json
{
  "ok": true,
  "pages": 2,
  "blocks": 9,
  "links": 4,
  "attachments": 2,
  "index": "/repo/out/demo/index.json",
  "markdown": "/repo/out/demo/markdown",
  "summary": "/repo/out/demo/crawl-summary.md"
}
```

## Safety and privacy

- Local files only by default.
- No Notion API calls.
- No credential discovery.
- No telemetry.
- Source paths are recorded so you can audit what was imported.
- Treat exports as private data; review generated Markdown before sharing it.

## Source attribution

`notionstash` is an original TypeScript MVP inspired by the adjacent OSS project [`notcrawl`](https://github.com/vincentkoc/notcrawl). It does not copy that implementation; the V1 here is scoped to deterministic local Notion export fixtures and agent/developer workflows.

## Development

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Package contents

The npm package allowlist includes the runtime files plus the public support
documents needed for release review: `README.md`, `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
Run `npm run package:smoke` or `npm pack --dry-run` before publishing to
confirm those files are still present in the tarball.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes local-first, fixture-backed, and explicit about any future optional external behavior.

## Security

See [SECURITY.md](SECURITY.md). Please do not attach private Notion exports to public issues.

## License

MIT © Roger Chappel

## Verification

Run the release-readiness checks that match this package before publishing or opening a release PR.

- `npm run release:check` - run the full release gate
