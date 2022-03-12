import { resolve } from 'path'

import { listPackagePaths } from './npm'

const deps = Object.keys(require('../../package.json').dependencies) // eslint-disable-line
const devDeps = Object.keys(require('../../package.json').devDependencies) // eslint-disable-line

describe('testsuite of utils/npm', () => {
  const BASE_PATH = resolve(__dirname, '../..')

  it('test dependencies loading', () => {
    expect(deps.length).toBeGreaterThan(0)
    expect(devDeps.length).toBeGreaterThan(0)
  })

  it('test listPackagePaths', async () => {
    const packages = await listPackagePaths()

    for (const dep of deps) {
      expect(packages).toContain(`${BASE_PATH}/node_modules/${dep}`)
    }
    for (const devDep of devDeps) {
      expect(packages).not.toContain(`${BASE_PATH}/node_modules/${devDep}`)
    }

    // Same Options
    expect(await listPackagePaths({ noDeps: false })).toEqual(packages)
    expect(await listPackagePaths({ devDeps: false })).toEqual(packages)
    expect(await listPackagePaths({ noDeps: false, devDeps: false })).toEqual(
      packages
    )
  }, 30000)

  it('test listPackagePaths, noDeps=true', async () => {
    const packages = await listPackagePaths({ noDeps: true })
    expect(packages).toEqual([])

    // Same Options
    expect(await listPackagePaths({ noDeps: true, devDeps: false })).toEqual(
      packages
    )
  }, 30000)

  it('test listPackagePaths, devDeps=true', async () => {
    const packages = await listPackagePaths({ devDeps: true })

    for (const dep of deps) {
      expect(packages).toContain(`${BASE_PATH}/node_modules/${dep}`)
    }
    for (const devDep of devDeps) {
      expect(packages).toContain(`${BASE_PATH}/node_modules/${devDep}`)
    }

    // Same Options
    expect(await listPackagePaths({ devDeps: true, noDeps: false })).toEqual(
      packages
    )
  }, 30000)
})
