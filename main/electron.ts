import {compose, plug, source, sink} from '@pkit/core'
import {directSink, mapToSink} from '@pkit/helper'
import {context} from '@pkit/core/port'
import * as electron from '@pkit/electron'
import {electron as main} from '../main'

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

const cuit = port =>
  compose(
    electron.default(port.electron, port),
    plug(directSink,
      source(port.electron.terminated), sink(port.quit)),
    plug(mapToSink(`file://${__dirname}/electron.html`),
      source(port.electron.window), sink(port.electron.load)),
    plug(mapToSink(options),
      source(port.electron.ready), sink(port.electron.open)));

Object.assign(globalThis, {
  subject$: main(port, cuit)
});
