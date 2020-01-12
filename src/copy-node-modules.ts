import { join } from 'path'

import { copyManyFiles, CopyOptions } from './utils/filesystem'
import { listPackages } from './utils/list-packages'

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
