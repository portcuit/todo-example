const {apply} = require('ramda')
const {of} = require('rxjs')
const {tap,map,catchError} = require('rxjs/operators')
const {run} = require('@pkit/core')

exports.default = (port, main, ...args) =>
  run(port, main, args,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => (console.error(e),
          process.env.STAGE ?
            process.exit(-1) :
            of()))))

exports.ui = (port, main, parent) =>
  run(port, main, [parent],
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e)
          parent.postMessage(['error', e.message, e.stack])
          return of()
        })))
