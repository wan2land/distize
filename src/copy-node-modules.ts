import { join } from 'path'

import { copy } from './utils/filesystem'
import { listPackages, ListPackagesOptions } from './utils/list-packages'

export function copyNodeModules(dest: string, options: ListPackagesOptions = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  return listPackages(options)
    .then((pkgAbsPaths) => {
      return Promise.all(pkgAbsPaths.map((pkgAbsPath) => {
        return copy(pkgAbsPath, join(dest, pkgAbsPath.slice(pkgAbsPath.indexOf('node_modules/'))))
      }))
    })
    .then(() => Promise.resolve())
}
