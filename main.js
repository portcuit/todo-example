const {apply} = require('ramda')
const {of} = require('rxjs')
const {tap,map,catchError} = require('rxjs/operators')
const {run} = require('@pkit/core')

exports.default = (port, main, ...args) =>
  run(port, main, args,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e)
          return of()
        })))

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

exports.electron = (port, hook, ...args) =>
  run(port, hook, args,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log))),
    catchError(e => {
      console.error(e)
      return process.env.STAGE ?
        process.exit(-1) :
        of()
    }))
