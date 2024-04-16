# Distize

<p>
  <a href="https://github.com/wan2land/distize/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/wan2land/distize/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/distize?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/distize.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/distize"><img alt="Version" src="https://img.shields.io/npm/v/distize.svg?style=flat-square&logo=npm" /></a>
  <a href="https://www.npmjs.com/package/distize"><img alt="License" src="https://img.shields.io/npm/l/distize.svg?style=flat-square" /></a>
</p>

Copy source files and `node_modules` without `devDependencies` to destination directory.

## Installation

```bash
npm install distize --save
```

## Usage

### CLI

```bash
# copy current path(.) to dist directory
npx distize

# copy specific path to custom dist directory
npx distize libs/* graphql/* --out mydist

# copy node_modules only
npx distize --no-files
```

### Javascript

```js
import { distize } from 'distize'

await distize({ src: '.' })
```

## Documents

```
Usage:

  $ distize <path ...> [options]

Synopsis:

  $ distize [--timeout ms] --src file ...
  $ distize --help

Options:

  -h, --help         Display this usage info.
  -V, --version      Output the version number.
  -v, --verbose      Increase the verbosity of messages.
  -o, --out string   Copy all input files into an output directory.
                     [default: dist]
  --no-clean         Without cleaning the output directory.

Module Options:

  --no-files                 Run without copying files.
  --no-modules               Run without copying node_modules.
  -M, --module-path string   Change node_modules path.
  -D, --dev                  Copy modules in devDependencies also.
```

## Examples

### with AWS CDK

When you deploy your Lambda project using the AWS CDK, you also need to deploy `node_modules`.
Lambda has a capacity limit. You can use **distize** to copy `node_modules` except` devDependencies`.

file: `package.json`

```json
{
  "scripts": {
    "build": "npm run build:infra && npm run build:server",
    "build:server": "babel ./src --out-dir ./src-dist --extensions \".ts\"",
    "build:infra": "babel ./infra --out-dir ./infra-dist --extensions \".ts\"",
    "deploy": "npm run build && distize ./src-dist/* && cdk deploy"
  },
  "dependencies": {
    "core-js": "^3.6.0"
  },
  "devDependencies": {
    "@aws-cdk/aws-apigateway": "^1.19.0",
    "@aws-cdk/aws-lambda": "^1.19.0",
    "@aws-cdk/core": "^1.19.0",
    "@babel/cli": "7.7.7",
    "@babel/core": "7.7.7",
    "@babel/plugin-proposal-class-properties": "7.7.4",
    "@babel/plugin-proposal-decorators": "7.7.4",
    "@babel/plugin-proposal-object-rest-spread": "7.7.7",
    "@babel/preset-env": "7.7.7",
    "@babel/preset-typescript": "7.7.7",
    "@types/aws-lambda": "^8.10.39",
    "@types/graphql": "14.5.0",
    "@types/node": "^12.12.21",
    "aws-cdk": "^1.19.0",
    "distize": "^1.1.0",
    "source-map-support": "^0.5.16",
    "typescript": "^3.7.3"
  }
}
```

## API

```ts
interface DistizeOptions {
  src: string[] | string
  basePath?: string
  out?: string
  modulePath?: string
  noModules?: boolean
  dev?: false
}

export interface DistizeResult extends Promise<void> {
  on(
    event: 'progress',
    listener: (
      name: 'CLEAN' | 'COPY_SOURCE_FILES' | 'COPY_NODE_MODULES'
    ) => void
  ): this
  on(event: 'copy', listener: (src: string, dest: string) => void): this
  on(event: 'done', listener: () => void): this
}

function distize(options: DistizeOptions): DistizeResult
```
