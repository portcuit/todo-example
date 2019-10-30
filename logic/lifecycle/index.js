const {tap,filter,map,switchMap,startWith} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@tsugite/core')
const {mapToSink} = require('@tsugite/helper')

const terminate = (source$, terminated$, sink) =>
  source$.pipe(
    switchMap(() =>
      terminated$.pipe(
        map(sink))))

const reload = path =>
  (source$, terminated$, terminate, sink) =>
    source$.pipe(
      switchMap(() =>
        terminated$.pipe(
          map(() =>
            sink(path)),
          startWith(terminate()))))

exports.default = (context, worker, path) =>
  compose(
    plug(reload(path),
      source(context.ui.reload),
      source(worker.terminated),
      sink(context.ui.terminate),
      sink(worker.create)),
    plug(mapToSink(path), source(context.main.init), sink(worker.create)),
    plug(terminate,
      source(context.main.terminate), source(worker.terminated),
      sink(context.main.terminated)))