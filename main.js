const {T,pipe,identity,cond,apply} = require('ramda')
const {of} = require('rxjs')
const {tap,map,catchError} = require('rxjs/operators')
const {create} = require('@tsugite/core')

const port = require('./port').default
const {default: main, ui} = require('./')

exports.default = () =>
  create(main(port), port, port.context.main,
    stream$ =>
      stream$.pipe(
        tap(pipe(cond([
          [T, identity]
        ]), apply(console.log))),
        catchError(e => (console.error(e),
          process.env.STAGE ?
            process.exit(-1) :
            of()))))

exports.ui = () =>
  create(ui(port), port, port.context.main,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e)
          self.postMessage(['error', 'worker', e.message, e.stack])
          return of()
        })))
