import { exists, lstat, mkdir, readdir, readFile, Stats, writeFile } from 'fs'
import { join, resolve, dirname } from 'path'


function lstatPromise(path: string): Promise<Stats> {
  return new Promise((resolve, reject) => {
    lstat(path, (err, stat) => {
      if (err) {
        return reject(err)
      }
      return resolve(stat)
    })
  })
}

function existsPromise(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    exists(path, (exists) => {
      return resolve(exists)
    })
  })
}

function mkdirPromise(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdir(path, { recursive: true }, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

function readdirPromise(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) {
        return reject(err)
      }
      return resolve(files)
    })
  })
}

function readFilePromise(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

function writeFilePromise(path: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, data, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

async function copyOrCreateDirectory(src: string, dest: string, options: { debug?: boolean } = {}): Promise<void> {
  if ((await lstatPromise(src)).isDirectory()) {
    if (!await existsPromise(dest)) {
      if (options.debug) {
        console.log(`create directory ${dest}`)
      }
      await mkdirPromise(dest)
    }
    (await readdirPromise(src)).forEach((file) => {
      copyOrCreateDirectory(join(src, file), join(dest, file))
    })
  } else if (!await existsPromise(dest)) {
    const destDir = dirname(dest)
    if (!await existsPromise(destDir)) {
      if (options.debug) {
        console.log(`create directory ${destDir}`)
      }
      await mkdirPromise(destDir)
    }
    if (options.debug) {
      console.log(`copy file "${src}" to "${dest}"`)
    }
    await writeFilePromise(dest, await readFilePromise(src))
  }
}

export function copy(src: string | string[], dest: string, options: { debug?: boolean } = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  return (Array.isArray(src) ? src : [src]).reduce((carry, src) => {
    return carry.then(() => {
      const absSrc = resolve(process.cwd(), src)
      const absDest = resolve(process.cwd(), dest, absSrc.replace(process.cwd(), '').replace(/^\/+/, ''))
      return copyOrCreateDirectory(absSrc, absDest, options)
    })
  }, Promise.resolve())
}
