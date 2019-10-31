const {last,apply} = require('ramda')
const {zip,of} = require('rxjs')
const {tap,filter,map,mapTo,mergeMap,withLatestFrom} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@pkit/core')
const {direct} = require('@pkit/helper')

const start = (source$, sink) =>
  source$.pipe(
    mapTo({
      width: 1920,
      height: 1200,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    }),
    map(sink))

const load = (source$, sink) =>
  source$.pipe(
    mapTo(`file://${__dirname}/../static/electron.html`),
    map(sink))

exports.default = (root,electron) => compose(
  plug(load, source(electron.window), sink(electron.load)),
  plug(direct, source(electron.terminated), sink(root.terminated)),
  plug(start, source(electron.ready), sink(electron.open)))
