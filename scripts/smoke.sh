#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
rm -rf out/smoke
npm run build >/dev/null
node dist/cli.js inspect fixtures/notion-export --output out/smoke > out/smoke-result.json
test -f out/smoke/index.json
test -f out/smoke/crawl-summary.md
test -d out/smoke/markdown
node -e "const fs=require('node:fs'); const r=JSON.parse(fs.readFileSync('out/smoke-result.json','utf8')); if(!r.ok||r.pages!==2) process.exit(1);"
printf 'notionstash smoke ok\n'
