# Release candidate readiness

## Summary
- Branch prepared for release-candidate readiness review.
- Local verification status: **FAIL**
- Detailed command output is captured in `.rc_check.log`.

## Checks run
1. `npm run release:check`
2. `bash scripts/validate.sh`
3. `node /Users/roger/Developer/my-opensource/releasebox/bin/releasebox.js check .`

## Result
```
> tsc

src/cli.ts(17,35): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
src/cli.ts(59,35): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
src/cli.ts(60,3): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
src/discover.ts(1,31): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/discover.ts(2,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/discover.ts(18,37): error TS7006: Parameter 'a' implicitly has an 'any' type.
src/discover.ts(18,40): error TS7006: Parameter 'b' implicitly has an 'any' type.
src/html-parser.ts(1,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/html-parser.ts(2,26): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/index-writer.ts(1,34): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/index-writer.ts(2,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/markdown-parser.ts(1,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/markdown-parser.ts(2,26): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/markdown-writer.ts(1,34): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/markdown-writer.ts(2,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/normalize.ts(1,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/path-utils.ts(1,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/path-utils.ts(2,28): error TS2307: Cannot find module 'node:crypto' or its corresponding type declarations.
src/stash.ts(1,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
src/summary.ts(1,27): error TS2307: Cannot find module 'node:fs/promises' or its corresponding type declarations.
src/summary.ts(2,18): error TS2307: Cannot find module 'node:path' or its corresponding type declarations.
FAIL: package script: release:check
NOTE: agent-qc not installed; skipping optional agent check

Validation failed.

## releasebox
✅ releasebox config: node-cli
✅ ci workflow: .github/workflows/ci.yml
✅ release dry run workflow: .github/workflows/release-dry-run.yml
✅ task breakdown: docs/TASKS.md
✅ orchestration plan: docs/ORCHESTRATION.md
✅ dependabot config: .github/dependabot.yml
✅ npm test script: npm run build && node --test tests/*.test.mjs
✅ build script: tsc
✅ smoke script: bash scripts/smoke.sh
✅ bin entry: {"notionstash":"./dist/cli.js"}
RESULT release_check=2 validate=1 releasebox=0
```
