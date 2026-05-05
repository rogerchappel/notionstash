# Contributing

Thanks for helping improve notionstash.

## Development setup

```bash
npm install
npm test
npm run smoke
```

## Contribution principles

- Keep the default path local-first and deterministic.
- Add fixtures for parser behavior instead of relying on live services.
- Do not add hidden network calls, telemetry, credential scraping, or publishing.
- Preserve source attribution and audit-friendly output paths.
- Prefer small, reviewable changes.

## Pull request checklist

- [ ] Tests or fixtures cover the change.
- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] `npm run smoke` passes for local fixtures.
- [ ] Docs mention any user-visible behavior change.
