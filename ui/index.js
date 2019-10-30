const {compose,plug,source,sink} = require('@tsugite/core')
const {element,container,collection,modified,vnode} = require('@tsugite/uikit/helper/ui')

exports.default = (ui, state, action, view) =>
  compose(
    plug(vnode(view.view), source(ui.data), sink(ui.vnode)),

    plug(container,
      source(state.root.unit), sink(ui.data),
      source(ui.newTodo.data),
      source(ui.item.collection.data)),

    plug(element({
      keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]
    }), source(state.item.collection.data), sink(ui.newTodo.data)),

    plug(collection,
      source(ui.item.modified),
      source(state.item.collection.modify),
      sink(ui.item.collection.data)),
    plug(modified, source(state.item.data), sink(ui.item.modified),
      source(ui.item.vnode), source(state.item.collection.modified)),
    plug(vnode(view.item.view), source(ui.item.data), sink(ui.item.vnode)),
    plug(container, source(state.item.data), sink(ui.item.data),
      source(ui.item.title.data),
      source(ui.item.checked.data),
      source(ui.item.destroy.data),
      source(ui.item.edit.data)
    ),
    plug(element({dblclick: [action.item.title.dblclick]}),
      source(state.item.title.data), sink(ui.item.title.data)),
    plug(element({change: [action.item.checked.change, ['target', 'checked']]}),
      source(state.item.checked.data), sink(ui.item.checked.data)),
    plug(element({click: [action.item.destroy.click]}),
      source(state.item.data), sink(ui.item.destroy.data)),
    plug(element({keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.item.title.data), sink(ui.item.edit.data)
    ),
  )
