import { Command } from '../../deps.ts';

import { download } from './download.ts';
import { init } from './init.ts';
import { install } from './install.ts';


const cli = new Command();

cli
  .name('myarn')
  .description('Myarn. Minecraft Server Environment Manager')
  .version('v0.0.1')
  .globalOption('--root <path:string>', 'root path', {
    default: null,
    value: (value: string): string => value ? value : Deno.cwd()
  })
  .command('download', download)
  .command('install', install)
  .command('init', init);

export default cli;
