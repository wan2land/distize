import { EventEmitter } from 'events'
import globby from 'globby'

import { copyManyFiles, remove } from './utils/filesystem'
import { copyNodeModules } from './utils/npm'


export interface DistizeOptions {
  src: string[] | string
  out?: string
  ignore?: string[]
  noModules?: boolean
  cwd?: string
  devDeps?: false
}

export interface DistizeEventEmitter extends EventEmitter {
  on(event: 'progress', listener: (name: 'CLEAN' | 'COPY_SOURCES' | 'COPY_NODE_MODULES') => void): this
  on(event: 'fs_mkdir', listener: (path: string) => void): this
  on(event: 'fs_copy', listener: (src: string, dest: string) => void): this
  on(event: 'done', listener: () => void): this
}

export function distize(options: DistizeOptions): DistizeEventEmitter {
  const out = options.out || 'dist'

  const emitter = new EventEmitter()
  emitter.emit('progress', 'CLEAN')

  function onCreateDirectory(path: string) {
    emitter.emit('fs_mkdir', path)
  }
  function onCopyFile(src: string, dest: string) {
    emitter.emit('fs_copy', src, dest)
  }

  remove(out)
    .then(() => {
      emitter.emit('progress', 'COPY_SOURCES')
      return globby(options.src, {
        ignore: [
          ...options.ignore || [],
          out,
          'node_modules',
        ],
      })
    })
    .then((files) => copyManyFiles(files, out, {
      onCreateDirectory,
      onCopyFile,
    }))
    .then(() => {
      emitter.emit('progress', 'COPY_NODE_MODULES')
      return options.noModules ? Promise.resolve() : copyNodeModules(out, {
        cwd: options.cwd,
        devDeps: options.devDeps,
        onCreateDirectory,
        onCopyFile,
      })
    })
    .then(() => {
      emitter.emit('done')
    })

  return emitter
}
