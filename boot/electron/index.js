const {compose, plug, source, sink} = require('@pkit/core')
const {directSink, mapToSink} = require('@pkit/helper')
const {context} = require('@pkit/core/port')
const electron = require('@pkit/electron')

const port = {
  ...context,
  electron: electron.port
}

const options = {
  width: 1920,
  height: 1200,
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInWorker: true
  }
}

const main = port =>
  compose(
    electron.default(port.electron, port),
    plug(directSink,
      source(port.electron.terminated), sink(port.quit)),
    plug(mapToSink(`file://${__dirname}/index.html`),
      source(port.electron.window), sink(port.electron.load)),
    plug(mapToSink(options),
      source(port.electron.ready), sink(port.electron.open)))

global.subject$ = require('../../main').electron(port, main)