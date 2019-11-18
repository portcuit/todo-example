import {compose,plug,source,sink} from '@pkit/core'
import {directSink,fromEventSink,switchMapZipSink} from '@pkit/helper'
import * as worker from '@pkit/worker'
import * as ui from './ui'
import * as action from './action'
import * as snabbdom from '@pkit/snabbdom'
import {context} from '@pkit/core/port'

import {EventEmitter} from 'events'
import {injectGlobal} from 'emotion'


const bridge = {
  vnode: null,
  ui: {
    ...context,
    reload: null
  },
  action: action.port
};

export const port = {
  ...context,
  snabbdom: snabbdom.port,
  worker: worker.port.parent,
  bridge
};

export const window = (port, Worker) => {
  const emitter = new EventEmitter;
  const actionModule:any = snabbdom.action(emitter, 'action');

  injectGlobal`
@import url("https://unpkg.com/todomvc-app-css@2.3.0/index.css");
`;

  return compose(
    worker.useParentWorker(port.worker, port, Worker,
      `${__dirname}/main/_ui.js`,
      ...(action => [
        action.newTodo.enter,
        action.item.completed.change,
        action.item.destroy.click,
        action.item.title.dblclick,
        action.item.edit.enter,
        action.item.edit.esc,
      ])(port.bridge.action),
      port.bridge.ui.terminate),
    plug(fromEventSink(emitter, 'action')),
    action.default(port.bridge.action),
    snabbdom.default(port.snabbdom, port, document.body.children[0],
      [actionModule, ...snabbdom.defaultModules]),
    plug(directSink,
      source(port.bridge.vnode), sink(port.snabbdom.render)),
    plug(directSink,
      source(port.terminate), sink(port.bridge.ui.terminate)),
    plug(switchMapZipSink,
      source(port.terminate),
      sink(port.quit),
      source(port.bridge.ui.terminated)))
};

export const uiPort = {
  ...context,
  worker: worker.port.child,
  ui: ui.port,
  bridge
};

export const uiKit = (port, parent) =>
  compose(
    worker.useChildWorker(port.worker, parent,
      port.bridge.vnode,
      port.bridge.ui.terminated),
    plug(directSink, source(port.ui.view.vnode), sink(port.bridge.vnode)),
    plug(directSink, source(port.bridge.ui.terminate), sink(port.bridge.ui.terminated)),
    action.ui(port.bridge.action, port.ui.state),
    ui.default(port, port.ui.state, port.ui.view, port.bridge.action));
