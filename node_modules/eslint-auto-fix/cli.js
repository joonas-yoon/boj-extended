#!/usr/bin/env node

let argv = require('yargs')
  .usage('$0 [globs-to-watch] [options]')
  .option('verbose', {
    default: false,
    describe: 'Whether to say when a file is being fixed',
    type: 'boolean',
  })
  .option('fix-on-startup', {
    default: false,
    describe: 'Whether to fix all the matching files immediately',
    type: 'boolean',
  })
  .epilogue('[globs-to-watch] are file globs you want to watch for changes.\nDefaults to "./**/*.js".\n(You probably want to enclose these in quotes unless you want the shell to expand them before watching.)')
  .help()
  .argv

require('./fix')(argv._, argv)
