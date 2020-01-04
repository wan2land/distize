#!/usr/bin/env node

import { copyNodeModules } from '../copy-node-modules'


let isHelp = false
let isAfterDashdash = false
let devDeps = false

const args = process.argv.slice(2).filter(arg => {
  if (isAfterDashdash) {
    return !!arg
  }

  if (arg === '--') {
    isAfterDashdash = true
  } else if (arg === '--dev' || arg === '-D') {
    devDeps = true
  } else if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
    isHelp = true
  } else {
    return !!arg
  }
  return false
})

function go(n: number) {
  if (n >= args.length) {
    return
  }
  copyNodeModules(args[n], {
    devDeps,
  }).then(() => {
    go(n + 1)
  })
}

if (isHelp || args.length === 0) {
  const log = isHelp ? console.log : console.error

  log('Usage: distize <path> [<path> ...]')
  log('')
  log('  Copy node_modules to "path" recursively.')
  log('')
  log('Options:')
  log('')
  log('  -h, --help          Display this usage info')
  log('  -D, --dev           Copy modules in devDependencies also.')
  log('  --                  Stop parsing flags')
  process.exit(isHelp ? 0 : 1)
} else {
  go(0)
}
