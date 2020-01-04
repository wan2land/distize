import { exists, lstat, mkdir, readdir, readFile, Stats, writeFile } from 'fs'
import { join } from 'path'

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
  return new Promise((resolve, reject) => {
    exists(path, (exists) => {
      return resolve(exists)
    })
  })
}

function mkdirPromise(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdir(path, { recursive: true },(err) => {
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


export async function copy(source: string, target: string): Promise<void> {
  if ((await lstatPromise(source)).isDirectory()) {
    if (!(await existsPromise(target))) {
      await mkdirPromise(target)
    }
    (await readdirPromise(source)).forEach((file) => {
      copy(join(source, file), join(target, file))
    })
  } else if (!(await existsPromise(target))) {
    await writeFilePromise(target, await readFilePromise(source))
  }
}
