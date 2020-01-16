import { resolve } from 'path'

import { copySourceFiles } from './copy-source-files'
import { remove } from './utils/fs'
import { glob } from './utils/path'


describe('testsuite of copy-source-files', () => {
  let beforeCwd = ''

  beforeAll(() => {
    beforeCwd = process.cwd()
    process.chdir(resolve(__dirname, '..'))
  })

  afterAll(() => {
    if (beforeCwd) {
      process.chdir(beforeCwd)
    }
  })

  it('test copySourceFiles unknown', async () => {
    await remove('dist')
    await copySourceFiles('unknown', 'dist')

    expect(await glob('dist/**/*')).toEqual([])
  })

  it('test copySourceFiles single dir', async () => {
    await remove('dist')
    await copySourceFiles('stubs', 'dist')

    expect((await glob('dist/**/*', { nodir: true })).sort()).toEqual([
      'dist/stubs/infra/src/app.ts',
      'dist/stubs/service/dist/bundle.js',
      'dist/stubs/service/src/entry.ts',
      'dist/stubs/service/src/utils.ts',
    ])
  })

  it('test copySourceFiles many dirs', async () => {
    await remove('dist')
    await copySourceFiles(['stubs/infra', 'stubs/service'], 'dist')

    expect((await glob('dist/**/*', { nodir: true })).sort()).toEqual([
      'dist/infra/src/app.ts',
      'dist/service/dist/bundle.js',
      'dist/service/src/entry.ts',
      'dist/service/src/utils.ts',
    ])
  })

  it('test copySourceFiles glob pattern', async () => {
    await remove('dist')
    await copySourceFiles(['stubs/*'], 'dist')

    expect((await glob('dist/**/*', { nodir: true })).sort()).toEqual([
      'dist/infra/src/app.ts',
      'dist/service/dist/bundle.js',
      'dist/service/src/entry.ts',
      'dist/service/src/utils.ts',
    ])
  })
})
