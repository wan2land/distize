import { EventEmitter } from 'events'
import { resolve } from 'path'

import { copyNodeModules } from './copy-node-modules'
import { copySourceFiles } from './copy-source-files'
import { remove } from './utils/fs'


export interface DistizeOptions {
  src: string[] | string
  basePath?: string
  out?: string
  modulePath?: string
  noClean?: boolean
  noModules?: boolean
  dev?: false
}

export interface DistizeResult extends Promise<void> {
  on(event: 'progress', listener: (name: 'CLEAN' | 'COPY_SOURCE_FILES' | 'COPY_NODE_MODULES') => void): this
  on(event: 'copy', listener: (src: string, dest: string) => void): this
  on(event: 'done', listener: () => void): this
}

export function distize(options: DistizeOptions): DistizeResult {
  const basePath = options.basePath ?? process.cwd()
  const dest = resolve(basePath, options.out ?? 'dist')

  const emitter = new EventEmitter()

  function onCopy(src: string, dest: string) {
    emitter.emit('copy', src, dest)
  }

  const promise = Promise.resolve()
    .then(() => {
      if (options.noClean) {
        return Promise.resolve()
      }
      emitter.emit('progress', 'CLEAN')
      return remove(dest)
    })
    .then(() => {
      if (Array.isArray(options.src) && options.src.length === 0) {
        return Promise.resolve()
      }
      emitter.emit('progress', 'COPY_SOURCE_FILES')
      return copySourceFiles(options.src, dest, {
        basePath: options.basePath,
        onCopy,
      })
    })
    .then(() => {
      if (options.noModules) {
        return Promise.resolve()
      }
      emitter.emit('progress', 'COPY_NODE_MODULES')
      const modulePath = options.modulePath && resolve(basePath, options.modulePath.replace(/\/node_modules\/?$/, '')) || basePath

      return remove(resolve(dest, 'node_modules')).then(() => copyNodeModules(dest, {
        basePath: options.basePath,
        cwd: modulePath,
        devDeps: options.dev,
        onCopy,
      }))
    })
    .then(() => {
      emitter.emit('done')
    })

  Object.assign(promise, {
    on(event: string, listener: any) {
      emitter.on(event, listener)
      return promise
    },
  })
  return promise as DistizeResult
}
