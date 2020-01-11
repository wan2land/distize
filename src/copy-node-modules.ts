import { join } from 'path'

import { copy } from './utils/filesystem'
import { listPackages } from './utils/list-packages'

export interface CopyNodeModulesOptions {
  debug?: boolean
  cwd?: string
  devDeps?: false
}

export function copyNodeModules(dest: string, options: CopyNodeModulesOptions = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  return listPackages(options)
    .then((pkgAbsPaths) => {
      return Promise.all(pkgAbsPaths.map((pkgAbsPath) => {
        return copy(pkgAbsPath, join(dest, pkgAbsPath.slice(pkgAbsPath.indexOf('node_modules/'))), { debug: options.debug })
      }))
    })
    .then(() => Promise.resolve())
}
