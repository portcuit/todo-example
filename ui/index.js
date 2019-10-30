const {compose,plug,source,sink} = require('@tsugite/core')
const {element,container,vnode} = require('@tsugite/uikit/helper/ui')

exports.default = (ui, store, view) =>
  compose(
    plug(element(), source(store.state.root.data), sink(ui.data)),
    plug(vnode(view.view), source(ui.data), sink(ui.vnode))
  )


