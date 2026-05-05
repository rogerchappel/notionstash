# notionstash Orchestration

This repo was built as a local-first OSS Factory project.

## Agent lanes

1. **Scaffold** — StackForge `oss-cli` generated the base project.
2. **Crawler** — deterministic filesystem traversal, no network.
3. **Normalizer** — pages, blocks, links, and attachments become typed records.
4. **Writers** — JSON index, Markdown bundle, and crawl summary.
5. **Verification** — TypeScript check, tests, smoke, and validation script.

## Safety rules

- Do not call Notion APIs in the default command path.
- Do not inspect credentials, browser profiles, or system files.
- Keep source paths visible in summaries for auditability.
- Prefer deterministic fixture tests over live service dependencies.
