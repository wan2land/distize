import { basename, resolve } from 'path'

import { copy, CopyOptions } from './utils/fs'
import { glob } from './utils/path'

export interface CopySourceFilesInterface extends CopyOptions {
  basePath?: string
}

export function copySourceFiles(
  src: string | string[],
  dest: string,
  options: CopySourceFilesInterface = {}
): Promise<void> {
  if (!src) {
    throw new TypeError('Missing source path(or pattern) argument.')
  }
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }

  const basePath = options.basePath
    ? resolve(process.cwd(), options.basePath)
    : process.cwd()

  return glob(src)
    .then((files) => [...new Set(files.map((file) => resolve(basePath, file)))])
    .then((files) =>
      files.reduce(
        (carry, file) =>
          carry.then(() => {
            return copy(file, resolve(basePath, dest, basename(file)), {
              onCopy: options.onCopy,
            })
          }),
        Promise.resolve()
      )
    )
}
