import { resolve } from 'path'

import { distize } from './distize'
import { remove } from './utils/fs'
import { glob } from './utils/path'


describe('testsuite of distize', () => {
  const BASE_PATH = resolve(__dirname, '..')

  let beforeCwd = ''
  beforeAll(() => {
    beforeCwd = process.cwd()
    process.chdir(BASE_PATH)
  })

  afterAll(() => {
    if (beforeCwd) {
      process.chdir(beforeCwd)
    }
  })

  it('test distize', async () => {
    await remove('dist')
    const result = distize({ src: 'stubs/infra' })

    const events = [] as any[]

    expect(result.on('progress', (name) => events.push(name))).toBe(result)
    expect(result.on('copy', (from, to) => events.push([from, to]))).toBe(result)
    expect(result.on('done', () => events.push(true))).toBe(result)

    expect(result).toBeInstanceOf(Promise)
    expect(await result).toBeUndefined()

    expect(await glob('dist/*')).toEqual([
      'dist/infra',
      'dist/node_modules',
    ])
    expect(await glob('dist/infra/**/*', { nodir: true })).toEqual([
      'dist/infra/src/app.ts',
    ])
    expect(events).toEqual([
      'CLEAN',
      'COPY_SOURCE_FILES',
      [`${BASE_PATH}/stubs/infra/src/app.ts`, `${BASE_PATH}/dist/infra/src/app.ts`],
      'COPY_NODE_MODULES',
      true,
    ])
  })

  it('test distize without modules', async () => {
    await remove('dist')
    const result = distize({ src: 'stubs/infra', noModules: true })

    const events = [] as any[]

    expect(result.on('progress', (name) => events.push(name))).toBe(result)
    expect(result.on('copy', (from, to) => events.push([from, to]))).toBe(result)
    expect(result.on('done', () => events.push(true))).toBe(result)

    expect(result).toBeInstanceOf(Promise)
    expect(await result).toBeUndefined()

    expect(await glob('dist/*')).toEqual([
      'dist/infra',
    ])
    expect(await glob('dist/infra/**/*', { nodir: true })).toEqual([
      'dist/infra/src/app.ts',
    ])
    expect(events).toEqual([
      'CLEAN',
      'COPY_SOURCE_FILES',
      [`${BASE_PATH}/stubs/infra/src/app.ts`, `${BASE_PATH}/dist/infra/src/app.ts`],
      true,
    ])
  })
})
