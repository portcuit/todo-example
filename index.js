const {compose,plug,source,sink} = require('@pkit/core')
const {directSink,fromEmitter,switchMapZipSink} = require('@pkit/helper')
const worker = require('@pkit/worker')
const ui = require('./ui')
const action = require('./action')
const snabbdom = require('@pkit/snabbdom')
const {context} = require('@pkit/core/port')

const bridge = {
  vnode: null,
  ui: {
    ...context,
    reload: null
  },
  action: action.port
}

exports.port = {
  ...context,
  snabbdom: snabbdom.port,
  worker: worker.port.parent,
  bridge
}

exports.default = (port, Worker) => {
  const {EventEmitter} = require('events')
  const {defaultModules, action: createActionModule} = require('@pkit/snabbdom')
  const emitter = new EventEmitter
  const actionModule = createActionModule(emitter, 'action')
  const {injectGlobal} = require('emotion')

  injectGlobal`
@import url("https://unpkg.com/todomvc-app-css@2.3.0/index.css");
`
  return compose(
    worker.useParentWorker(port.worker, port, Worker,
      `${__dirname}/boot/ui.js`,
      ...(action => [
        action.newTodo.enter,
        action.item.completed.change,
        action.item.destroy.click,
        action.item.title.dblclick,
        action.item.edit.enter,
        action.item.edit.esc,
      ])(port.bridge.action),
      port.bridge.ui.terminate),
    plug(fromEmitter(emitter, 'action')),
    action.default(port.bridge.action),
    snabbdom.default(port.snabbdom, port, document.body.children[0], [actionModule, ...defaultModules]),
    plug(directSink,
      source(port.bridge.vnode), sink(port.snabbdom.render)),
    plug(directSink,
      source(port.terminate), sink(port.bridge.ui.terminate)),
    plug(switchMapZipSink,
      source(port.terminate),
      sink(port.quit),
      source(port.bridge.ui.terminated)))
}

exports.uiPort = {
  ...context,
  worker: worker.port.child,
  ui: ui.port,
  bridge
}

exports.ui = (port, parent) =>
  compose(
    worker.useChildWorker(port.worker, parent,
      port.bridge.vnode,
      port.bridge.ui.terminated),
    plug(directSink, source(port.ui.view.vnode), sink(port.bridge.vnode)),
    plug(directSink, source(port.bridge.ui.terminate), sink(port.bridge.ui.terminated)),
    action.ui(port.bridge.action, port.ui.state),
    ui.default(port, port.ui.state, port.ui.view, port.bridge.action))
