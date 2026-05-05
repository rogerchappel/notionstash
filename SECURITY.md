# Security Policy

## Supported versions

The current `main` branch is supported during the pre-1.0 phase.

## Reporting a vulnerability

Please report security issues privately where possible. Do not upload private Notion exports to public issues.

## Privacy boundaries

notionstash is designed to read only the local export directory passed to `notionstash inspect`. Default behavior has:

- no Notion API calls
- no external HTTP requests
- no telemetry
- no credential discovery
- no publishing

If a future feature adds optional external behavior, it must be explicit, documented, and disabled by default.
