import { lstat, mkdir, readdir, readFile, rmdir, Stats, unlink, writeFile } from 'fs'
import { dirname, join, resolve } from 'path'


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

function mkdirRecursivePromise(path: string): Promise<void> {
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

function rmdirPromise(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    rmdir(path, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

function unlinkPromise(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    unlink(path, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

export function remove(path: string): Promise<void> {
  return lstatPromise(path).then((status) => {
    if (status.isDirectory()) {
      return readdirPromise(path)
        .then((files) => files.reduce((carry, file) => {
          return carry.then(() => remove(join(path, file)))
        }, Promise.resolve()))
        .then(() => rmdirPromise(path))
    }
    return unlinkPromise(path)
  }).catch((e) => {
    if (e.code === 'ENOENT') {
      return
    }
    return console.error(e)
  })
}

export interface CopyOptions {
  onCreateDirectory?: (path: string) => any
  onCopyFile?: (src: string, dest: string) => any
}

export function copyFile(src: string, dest: string, options: CopyOptions = {}): Promise<void> {
  return lstatPromise(src).then((srcStat) => {
    // src is directory
    if (srcStat.isDirectory()) {
      return readdirPromise(src).then((files) => files.reduce((carry, file) => {
        return carry.then(() => copyFile(join(src, file), join(dest, file), options))
      }, Promise.resolve()))
    }

    const destDir = dirname(dest)

    return lstatPromise(dest)
      .then(() => remove(dest))
      .catch((e) => {
        if (e.code === 'ENOENT') {
          return
        }
        return console.error(e)
      })
      .then(() => lstatPromise(destDir))
      .catch((e) => {
        if (e.code === 'ENOENT') {
          return mkdirRecursivePromise(destDir).then(() => options.onCreateDirectory?.(destDir))
        }
        return console.error(e)
      })
      .then(() => readFilePromise(src))
      .then((body) => writeFilePromise(dest, body).then(() => options.onCopyFile?.(src, dest)))
  })
}

export function copyManyFiles(src: string | string[], dest: string, options: CopyOptions = {}): Promise<void> {
  if (!dest) {
    throw new TypeError('Missing destination directory argument.')
  }
  return (Array.isArray(src) ? src : [src]).reduce((carry, src) => {
    return carry.then(() => {
      const absSrc = resolve(process.cwd(), src)
      const absDest = resolve(process.cwd(), dest, absSrc.replace(process.cwd(), '').replace(/^\/+/, ''))
      return copyFile(absSrc, absDest, options)
    })
  }, Promise.resolve())
}
