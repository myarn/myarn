import { Command, CompletionsCommand } from '../../deps.ts';

import { download } from './download.ts';
import { metadata } from './metadata.ts';
import { checksumCmd } from './checksum.ts';
import { init } from './init.ts';
import { install } from './install.ts';
import { show } from './show.ts';


const cli = new Command();

cli
  .name('myarn')
  .description('Myarn. Minecraft Server Environment Manager')
  .version('0.0.1')
  .globalOption('--root <path:string>', 'root path', {
    default: null,
    value: (value: string): string => value ? value : Deno.cwd()
  })
  .command('completions', new CompletionsCommand())
  .command('download', download)
  .command('checksum', checksumCmd)
  .command('metadata', metadata)
  .command('install', install)
  .command('show', show)
  .command('init', init);

export default cli;
