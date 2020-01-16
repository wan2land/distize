import { resolve } from 'path'

import { copyNodeModules } from './copy-node-modules'
import { remove } from './utils/fs'
import { glob } from './utils/path'

const deps = [
  'command-line-args',
  'command-line-usage',
  'core-js',
  'glob',
  'ora',
]

describe('testsuite of copy-node-modules', () => {
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

  it('test copyNodeModules', async () => {
    await remove('dist')
    await copyNodeModules('dist')

    const expectNodeModules = await glob('dist/node_modules/*')

    for (const dep of deps) {
      expect(expectNodeModules).toContain(`dist/node_modules/${dep}`)
    }
  }, 10000)
})
