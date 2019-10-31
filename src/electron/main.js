const {cond,pipe,T,apply, identity} = require('ramda')
const {of} = require('rxjs')
const {tap,catchError} = require('rxjs/operators')
const {run} = require('@pkit/core')

const port = require('./port').default
const main = require('./').default

exports.default = () =>
  run(main(port), port, port.context.main,
    stream$ =>
      stream$.pipe(
        tap(pipe(cond([
          [T, identity]
        ]), apply(console.log))),
        catchError(e => (console.error(e),
          process.env.STAGE ?
            process.exit(-1) :
            of()))))
