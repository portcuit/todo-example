const {cond,pipe,T,apply, identity} = require('ramda')
const {of} = require('rxjs')
const {tap,catchError} = require('rxjs/operators')
const {run,compose} = require('@pkit/core')

const ports = require('./port').default

const stream = compose(
  require('@pkit/electron').default(ports.electron, ports.context.main),
  require('./').default(ports.context.main, ports.electron))

exports.default = () =>
  run(stream, ports, ports.context.main,
    stream$ =>
      stream$.pipe(
        tap(pipe(cond([
          [T, identity]
        ]), apply(console.log))),
        catchError(e => (console.error(e),
          process.env.STAGE ?
            process.exit(-1) :
            of()))))
