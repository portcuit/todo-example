const {compose,plug,source,sink} = require('@pkit/core')
const {directSink,fromEmitter} = require('@pkit/helper')
const worker = require('@pkit/worker')

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
      port.store.state.update,
      port.action.newTodo.enter,
      port.action.item.completed.change,
      port.action.item.destroy.click,
      port.action.item.title.dblclick,
      port.action.item.edit.enter,
      port.action.item.edit.esc,
      port.context.ui.terminate,
      port.context.main.terminate),
    plug(fromEmitter(emitter, 'action')),
    require('./action').default(port.action),
    require('@pkit/snabbdom').default(port.snabbdom, port, document.body.children[0], [actionModule, ...defaultModules]),
    plug(directSink, source(port.ui.vnode), sink(port.snabbdom.render)))
}

exports.ui = (port, parent) =>
  compose(
    worker.useChildWorker(port.worker.child, parent,
      port.ui.vnode,
      port.context.ui.terminated),
    plug(directSink, source(port.context.main.terminate), sink(port.context.ui.terminate)),
    plug(directSink, source(port.context.ui.terminate), sink(port.context.ui.terminated)),
    require('./action').ui(port.action, port.store.state),
    require('./ui').default(port, port.ui, port.store.state, port.action,
      {...require('./ui/view'), item: require('./ui/view/item')}),
    require('./store/state').default(port.store.state, port,
      {init: require('./store/state/initial'), item: require('./store/state/initial/item')}),
  )