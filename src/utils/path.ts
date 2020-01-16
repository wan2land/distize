import nodeGlob from 'glob'


export function glob(pattern: string | string[], options: nodeGlob.IOptions = {}): Promise<string[]> {
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  return Promise.all(patterns.map(pattern => new Promise<string[]>((resolve, reject) => nodeGlob(pattern, options, (err, matches) => err ? reject(err) : resolve(matches)))))
    .then((matches) => matches.reduce((carry, match) => carry.concat(match)))
}
