const {apply} = require('ramda')
const {of} = require('rxjs')
const {tap,map,catchError} = require('rxjs/operators')
const {run} = require('@pkit/core')

const port = require('./port').default
const {default: main, ui} = require('./')

exports.default = () =>
  run(main(port), port, port.context.main,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => (console.error(e),
          process.env.STAGE ?
            process.exit(-1) :
            of()))))

exports.ui = () =>
  run(ui(port), port, port.context.main,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e)
          self.postMessage(['error', 'worker', e.message, e.stack])
          return of()
        })))
