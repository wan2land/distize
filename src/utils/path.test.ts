import { resolve } from 'path'

import { glob } from './path'


describe('testsuite of utils/path', () => {

  it('test glob with relative path', async () => {
    const beforeCwd = process.cwd()
    process.chdir(resolve(__dirname, '../../stubs'))

    // unknown
    expect((await glob('service/src/unknown.js')).sort()).toEqual([
    ])

    // single file
    expect((await glob('service/src/entry.ts')).sort()).toEqual([
      'service/src/entry.ts',
    ])

    // directory
    expect((await glob('.')).sort()).toEqual([
      '.',
    ])

    process.chdir(beforeCwd)
  })

  it('test glob with abstract path', async () => {
    const STUBS = resolve(__dirname, '../../stubs')

    // unknown
    expect((await glob(resolve(STUBS, 'service/src/unknown.js'))).sort()).toEqual([
    ])

    // single file
    expect((await glob(resolve(STUBS, 'service/src/entry.ts'))).sort()).toEqual([
      resolve(STUBS, 'service/src/entry.ts'),
    ])

    // directory
    expect((await glob(STUBS)).sort()).toEqual([
      STUBS,
    ])
  })
})
