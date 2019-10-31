const {compose,plug,source,sink} = require('@pkit/core')
const {direct,fromEmitter} = require('@pkit/helper')

exports.default = port => {
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
    plug(direct, source(port.ui.vnode), sink(port.snabbdom.render)),
    plug(fromEmitter(emitter, 'action')),
    require('./action').default(port.action),
    require('./logic/lifecycle').default(port.context, port.worker, `${__dirname}/boot/ui.js`),
    require('@pkit/snabbdom').default(port.snabbdom, port.context.main, document.body.children[0], [actionModule, ...defaultModules]),
    require('@pkit/worker').default(port.context.ui, port.worker, [
      port.store.state.update,
      port.action.newTodo.enter,
      port.action.item.completed.change,
      port.action.item.destroy.click,
      port.action.item.title.dblclick,
      port.action.item.edit.enter,
      port.action.item.edit.esc,
      port.context.ui.terminate,
      port.context.main.terminate]))
}

exports.ui = port =>
  compose(
    plug(direct, source(port.context.main.terminate), sink(port.context.ui.terminate)),
    plug(direct, source(port.context.ui.terminate), sink(port.context.ui.terminated)),
    require('./action').ui(port.action, port.store.state),
    require('./ui').default(port.context.main, port.ui, port.store.state, port.action,
      {...require('./ui/view'), item: require('./ui/view/item')}),
    require('./store/state').default(port.store.state, port.context.main,
      {init: require('./store/state/initial'), item: require('./store/state/initial/item')}),
    require('@pkit/worker').server(port.worker.serverPost, [
      port.ui.vnode,
      port.context.ui.terminated]))