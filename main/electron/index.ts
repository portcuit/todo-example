import {compose, plug, source, sink} from '@pkit/core'
import {directSink, mapToSink} from '@pkit/helper'
import {context} from '@pkit/core/port'
import * as electron from '@pkit/electron'

const port = {
  ...context,
  electron: electron.port
};

const options = {
  width: 1920,
  height: 1200,
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInWorker: true
  }
};

const main = port =>
  compose(
    electron.default(port.electron, port),
    plug(directSink,
      source(port.electron.terminated), sink(port.quit)),
    plug(mapToSink(`file://${__dirname}/index.html`),
      source(port.electron.window), sink(port.electron.load)),
    plug(mapToSink(options),
      source(port.electron.ready), sink(port.electron.open)))

Object.assign(globalThis, {
  subject$: require('../../main').electron(port, main)
});
