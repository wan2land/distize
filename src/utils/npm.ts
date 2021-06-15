import { exec } from 'child_process'


const RE_NODE_MODULES = /\/node_modules\//g

export interface ListPackagesOptions {
  cwd?: string
  devDeps?: boolean
  noDeps?: boolean
}

export function listPackagePaths(options: ListPackagesOptions = {}): Promise<string[]> {
  let command = 'npm ls --prod=true --parseable=true --all'
  if (options.devDeps && options.noDeps) {
    command = 'npm ls --dev=true --parseable=true --all'
  } else if (options.devDeps) {
    command = 'npm ls --parseable=true --all'
  } else if (options.noDeps) {
    return Promise.resolve([])
  }

  return new Promise((resolve, reject) => {
    exec(command, { cwd: options.cwd }, (err, stdout) => {
      if (err) {
        return reject(err)
      }
      const packages = stdout.toString().split('\n').filter(line => {
        const matches = line.match(RE_NODE_MODULES)
        return matches && matches.length === 1
      })
      resolve(packages)
    })
  })
}
