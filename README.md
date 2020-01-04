# Distize

<p>
  <a href="https://travis-ci.org/wan2land/distize"><img alt="Build" src="https://img.shields.io/travis/wan2land/distize.svg?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/distize?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/distize.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/distize"><img alt="Version" src="https://img.shields.io/npm/v/distize.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/distize"><img alt="License" src="https://img.shields.io/npm/l/distize.svg?style=flat-square" /></a>
  <br />
  <a href="https://david-dm.org/wan2land/distize"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/distize.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/distize?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/distize.svg?style=flat-square" /></a>
</p>

Copy current `node_modules` without `devDependencies` to destination directory.

## Installation

```bash
npm install distize --save
```

## Usage

### CLI

```bash
npx distize dest
npx distize dest --dev # npx distize dest -D
```

### API

```ts
copyNodeModules(dest: string, options: { cwd?: string, devDeps?: boolean, noDeps?: boolean } = {}): Promise<void>
```

```js
import { copyNodeModules } from 'distize'

await copyNodeModules('dest', options: {
  devDeps: true,
})
```
