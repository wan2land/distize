import { EventEmitter } from 'events'
import { resolve } from 'path'

import { copyNodeModules } from './copy-node-modules'
import { copySourceFiles } from './copy-source-files'
import { remove } from './utils/fs'


export interface DistizeOptions {
  src: string[] | string
  basePath?: string
  out?: string
  ignore?: string[]
  modulePath?: string
  noModules?: boolean
  dev?: false
}

export interface DistizeEventEmitter extends EventEmitter {
  on(event: 'progress', listener: (name: 'CLEAN' | 'COPY_SOURCE_FILES' | 'COPY_NODE_MODULES') => void): this
  on(event: 'copy', listener: (src: string, dest: string) => void): this
  on(event: 'done', listener: () => void): this
}

export function distize(options: DistizeOptions): DistizeEventEmitter {
  const basePath = options.basePath || process.cwd()
  const dest = resolve(basePath, options.out || 'dist')

  const emitter = new EventEmitter()
  emitter.emit('progress', 'CLEAN')

  function onCopy(src: string, dest: string) {
    emitter.emit('copy', src, dest)
  }

  remove(dest)
    .then(() => {
      emitter.emit('progress', 'COPY_SOURCE_FILES')
      return copySourceFiles(options.src, dest, {
        basePath: options.basePath,
        onCopy,
      })
    })
    .then(() => {
      emitter.emit('progress', 'COPY_NODE_MODULES')
      const modulePath = options.modulePath && resolve(basePath, options.modulePath.replace(/\/node_modules\/?$/, '')) || basePath
      return options.noModules ? Promise.resolve() : copyNodeModules(dest, {
        basePath: options.basePath,
        cwd: modulePath,
        devDeps: options.dev,
        onCopy,
      })
    })
    .then(() => {
      emitter.emit('done')
    })

  return emitter
}
