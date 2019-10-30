const {compose,plug,source,sink} = require('@tsugite/core')
const {direct,fromEmitter} = require('@tsugite/helper')

exports.default = port => {
  const {EventEmitter} = require('events')
  const {defaultModules} = require('@tsugite/snabbdom')
  const createActionModule = require('@tsugite/snabbdom/action')
  const emitter = new EventEmitter
  const actionModule = createActionModule(emitter, 'action')
  const {injectGlobal} = require('emotion')

  injectGlobal`
@import url("https://unpkg.com/todomvc-app-css@2.3.0/index.css");
`
  return compose(
    plug(direct, source(port.ui.vnode), sink(port.snabbdom.render)),
    plug(fromEmitter(emitter, 'action')),
    require('./logic/lifecycle').default(port.context, port.worker, './src/todo/boot/ui.js'),
    require('@tsugite/snabbdom').default(port.snabbdom, port.context.main, document.body.children[0], [actionModule, ...defaultModules]),
    require('@tsugite/worker').default(port.context.ui, port.worker, [
      port.store.state.update,
      port.context.main.terminate]))
}

exports.ui = port =>
  compose(
    plug(direct, source(port.context.main.terminate), sink(port.context.ui.terminate)),
    plug(direct, source(port.context.ui.terminate), sink(port.context.ui.terminated)),
    require('./ui').default(port.ui, port.store,
      require('./ui/view')),
    require('./store/state').default(port.store.state, port.context.main,
      {init: require('./store/state/initial')}),
    require('@tsugite/worker').server(port.worker.serverPost, [
      port.ui.vnode,
      port.context.ui.terminated]))