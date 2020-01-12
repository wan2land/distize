import { exec } from 'child_process'
import { join } from 'path'

import { copyManyFiles, CopyOptions } from './filesystem'


const RE_NODE_MODULES = /\/node_modules\//g

export interface ListPackagesOptions {
  cwd?: string
  devDeps?: boolean
  noDeps?: boolean
}

export function listPackages(options: ListPackagesOptions = {}): Promise<string[]> {
  let command = 'npm ls --prod=true --parseable=true'
  if (options.devDeps && options.noDeps) {
    command = 'npm ls --dev=true --parseable=true'
  } else if (options.devDeps) {
    command = 'npm ls --parseable=true'
  } else if (options.noDeps) {
    return Promise.resolve([])
  }

  return new Promise((resolve) => {
    exec(command, { cwd: options.cwd }, (_, stdout) => {
      const packages = stdout.toString().split('\n').filter(line => {
        const matches = line.match(RE_NODE_MODULES)
        return matches && matches.length === 1
      })
      resolve(packages)
    })
  })
}

export interface CopyNodeModulesOptions extends CopyOptions {
  cwd?: string
  devDeps?: false
}

export function copyNodeModules(dest: string, options: CopyNodeModulesOptions = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  return listPackages(options)
    .then((pkgAbsPaths) => {
      return pkgAbsPaths.reduce((carry, pkgAbsPath) => {
        return carry.then(() => copyManyFiles(pkgAbsPath, join(dest, pkgAbsPath.slice(pkgAbsPath.indexOf('node_modules/'))), options))
      }, Promise.resolve())
    })
}
