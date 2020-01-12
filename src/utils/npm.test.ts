import { listPackages } from './npm'


describe('testsuite of utils/npm', () => {
  it('test listPackages', async () => {
    expect((await listPackages()).length).toEqual(47)
    expect((await listPackages({ noDeps: false })).length).toEqual(47)
    expect((await listPackages({ devDeps: false })).length).toEqual(47)
    expect((await listPackages({ noDeps: false, devDeps: false })).length).toEqual(47)
  }, 10000)

  it('test listPackages, noDeps=true', async () => {
    expect((await listPackages({ noDeps: true })).length).toEqual(0)
    expect((await listPackages({ noDeps: true, devDeps: false })).length).toEqual(0)
  }, 10000)

  it('test listPackages, devDeps=true', async () => {
    expect((await listPackages({ devDeps: true })).length).toEqual(608)
    expect((await listPackages({ devDeps: true, noDeps: false })).length).toEqual(608)
  }, 10000)
})
