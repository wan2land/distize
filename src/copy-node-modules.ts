import { resolve } from 'path'

import { copy, CopyOptions } from './utils/fs'
import { listPackagePaths, ListPackagesOptions } from './utils/npm'

export interface CopyNodeModulesOptions extends CopyOptions, ListPackagesOptions {
  basePath?: string
}

export function copyNodeModules(dest: string, options: CopyNodeModulesOptions = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  const basePath = options.basePath ? resolve(process.cwd(), options.basePath) : process.cwd()

  return listPackagePaths(options)
    .then((pkgAbsPaths) => {
      return pkgAbsPaths.reduce((carry, pkgAbsPath) => carry.then(() => {
        return copy(pkgAbsPath, resolve(basePath, dest, pkgAbsPath.slice(pkgAbsPath.indexOf('node_modules'))))
      }), Promise.resolve())
    })
}
