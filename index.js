const {compose,plug,source,sink} = require('@pkit/core')
const {directSink,fromEmitter} = require('@pkit/helper')
const worker = require('@pkit/worker')
const ui = require('./ui')
const action = require('./action')
const snabbdom = require('@pkit/snabbdom/port')
const {context} = require('@pkit/core/port')

exports.port = {
  ...context,
  context: {
    main: context,
    ui: {
      ...context,
      reload: null
    }
  },
  snabbdom,
  worker: worker.port,
  ui: ui.port,
  action: action.port
}

exports.default = (port, Worker) => {
  const {EventEmitter} = require('events')
  const {defaultModules} = require('@pkit/snabbdom')
  const createActionModule = require('@pkit/snabbdom/action')
  const emitter = new EventEmitter
  const actionModule = createActionModule(emitter, 'action')
  const {injectGlobal} = require('emotion')

  injectGlobal`
@import url("https://unpkg.com/todomvc-app-css@2.3.0/index.css");
`
  return compose(
    worker.useParentWorker(port.worker.parent, port, Worker,
      `${__dirname}/boot/ui.js`,
      port.action.newTodo.enter,
      port.action.item.completed.change,
      port.action.item.destroy.click,
      port.action.item.title.dblclick,
      port.action.item.edit.enter,
      port.action.item.edit.esc,
      port.context.ui.terminate,
      port.context.main.terminate),
    plug(fromEmitter(emitter, 'action')),
    action.default(port.action),
    require('@pkit/snabbdom').default(port.snabbdom, port, document.body.children[0], [actionModule, ...defaultModules]),
    plug(directSink, source(port.ui.view.vnode), sink(port.snabbdom.render)))
}

exports.ui = (port, parent) =>
  compose(
    worker.useChildWorker(port.worker.child, parent,
      port.ui.view.vnode,
      port.context.ui.terminated),
    plug(directSink, source(port.context.main.terminate), sink(port.context.ui.terminate)),
    plug(directSink, source(port.context.ui.terminate), sink(port.context.ui.terminated)),
    action.ui(port.action, port.ui.state),
    ui.default(port, port.ui.state, port.ui.view, port.action))