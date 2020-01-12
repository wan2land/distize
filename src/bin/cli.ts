#!/usr/bin/env node

import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import globby from 'globby'
import ora from 'ora'

import { copyNodeModules } from '../copy-node-modules'
import { copyManyFiles, remove } from '../utils/filesystem'


const cmdOptions = [
  { group: 'build', name: 'src', type: String, multiple: true, defaultOption: true, defaultValue: [] },

  { group: 'build', name: 'help', alias: 'h', type: Boolean, description: 'Display this usage info.' },
  { group: 'build', name: 'version', alias: 'V', type: Boolean, description: 'Output the version number.' },
  { group: 'build', name: 'verbose', alias: 'v', type: Boolean, description: 'Increase the verbosity of messages.' },

  { group: 'build', name: 'out', alias: 'o', type: String, description: 'Copy all input files into an output directory.\n[default: {bold dist}]', defaultValue: 'dist' },

  { group: 'build', name: 'ignore', type: String, multiple: true },

  { group: 'modules', name: 'no-modules', type: Boolean, description: 'Copy files without node_modules.' },
  { group: 'modules', name: 'module-path', alias: 'M', type: String, description: 'Change node_modules path.' },
  { group: 'modules', name: 'dev', alias: 'D', type: Boolean, description: 'Copy modules in devDependencies also.' },
]

const args = commandLineArgs(cmdOptions)._all

if (args.version) {
  console.log(`v${require('../../package.json').version}`) // eslint-disable-line @typescript-eslint/no-require-imports
  process.exit(0)
}

if (args.help) {
  const log = args.help ? console.log : console.error
  log(commandLineUsage([
    { content: '{yellow Usage:}', raw: true },
    {
      content: [
        '$ distize <path ...> [options]',
      ],
    },
    { content: '{yellow Synopsis:}', raw: true },
    {
      content: [
        '$ distize [{bold --timeout} {underline ms}] {bold --src} {underline file} ...',
        '$ distize {bold --help}',
      ],
    },
    { content: '{yellow Options:}', raw: true },
    {
      hide: ['src'],
      optionList: cmdOptions,
      group: 'build',
    },
    { content: '{yellow Module Options:}', raw: true },
    {
      optionList: cmdOptions,
      group: 'modules',
    },
  ]).replace(/^\s+/, ''))
  process.exit(args.help ? 0 : 1)
}

const cwd = process.cwd()
let spinner = ora(`Remove old dist files, "${args.out}"`).start()

function onCreateDirectory(path: string) {
  spinner.text = `Create directory "${path.replace(cwd, '').replace(/^\/+/, '')}"`
}

function onCopyFile(src: string, dest: string) {
  spinner.text = `Copy file "${src.replace(cwd, '').replace(/^\/+/, '')}" to "${dest.replace(cwd, '').replace(/^\/+/, '')}"`
}

remove(args.out)
  .then(() => {
    spinner.succeed(`Remove old dist files, "${args.out}"`)
    spinner = ora('Loading source files').start()
    return globby(args.src.length > 0 ? args.src : '.', {
      ignore: [
        ...args.ignore || [],
        args.out,
        'node_modules',
      ],
    })
  })
  .then((files) => {
    spinner.succeed()
    spinner = ora('Copy source files').start()
    return copyManyFiles(files, args.out, {
      onCreateDirectory: args.verbose ? onCreateDirectory : void 0,
      onCopyFile: args.verbose ? onCopyFile : void 0,
    })
  })
  .then(() => {
    spinner.succeed('Copy source files')
    spinner = ora('Copy node_modules').start()
    return args['no-modules'] ? Promise.resolve() : copyNodeModules(args.out, {
      cwd: args['module-path'],
      devDeps: args.dev,
      onCreateDirectory: args.verbose ? onCreateDirectory : void 0,
      onCopyFile: args.verbose ? onCopyFile : void 0,
    })
  })
  .then(() => {
    spinner.succeed('Copy node_modules')
  })
