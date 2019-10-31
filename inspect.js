const {resolve} = require('path');
const {pipe} = require('ramda');

const nodeRequire = path =>
  require(path[0] === '.' ? resolve(path) : path)

const clearAll = pipe(
  path =>
    resolve(path),
  path =>
    Object.keys(require.cache)
      .filter(file =>
        file.indexOf(path) === 0)
      .map(file =>
        (delete require.cache[file], file)))

let subject$
const reload = async path => {
  if (subject$) {
    await new Promise(resolve => {
      subject$.next(['context.main.terminate'])
      subject$.subscribe({complete: resolve})
    })
    await new Promise(resolve =>
      setTimeout(resolve, 100))
  }
  clearAll('./src')
  subject$ = require(path).default()
  return subject$
}

Object.assign(global, {clearAll, reload, nodeRequire});

setTimeout(() => console.log('timeout'), 24 * 60 * 60 * 1000)