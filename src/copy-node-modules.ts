import { join } from 'path'

import { copy } from './utils/copy'
import { listPackages } from './utils/list-packages'

export async function copyNodeModules(dest: string, options: { cwd?: string, devDeps?: boolean, noDeps?: boolean } = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  const paths = await listPackages(options)
  return Promise.all(paths.map((path) => {
    const target = path.slice(path.indexOf('node_modules/'))
    return copy(path, join(options.cwd || process.cwd(), dest, target))
  })).then(() => Promise.resolve())
}
