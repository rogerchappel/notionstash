#!/usr/bin/env node
import { stashNotionExport } from './stash.js';

const help = `notionstash

Local-first Notion export crawler. No network/API calls are made by default.

Usage:
  notionstash inspect <export-dir> --output <out-dir>
  notionstash --help

Options:
  -o, --output <dir>   Output directory for index, markdown tree, and summary
  --compact            Write compact JSON index
`;

export async function main(argv = process.argv.slice(2)): Promise<number> {
  if (argv.includes('--help') || argv.includes('-h') || argv.length === 0) {
    console.log(help);
    return 0;
  }

  const [command, input] = argv;
  if (command !== 'inspect' || !input) {
    console.error('Expected: notionstash inspect <export-dir> --output <out-dir>');
    return 2;
  }

  const output = readOption(argv, '--output') ?? readOption(argv, '-o');
  if (!output) {
    console.error('Missing required --output <dir>');
    return 2;
  }

  try {
    const result = await stashNotionExport({ input, output, pretty: !argv.includes('--compact') });
    console.log(JSON.stringify({
      ok: true,
      pages: result.index.stats.pages,
      blocks: result.index.stats.blocks,
      links: result.index.stats.links,
      attachments: result.index.stats.attachments,
      index: result.indexPath,
      markdown: result.markdownRoot,
      summary: result.summaryPath
    }, null, 2));
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

function readOption(argv: string[], name: string): string | undefined {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await main();
}
