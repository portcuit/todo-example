const {compose,plug,source,sink} = require('@tsugite/core')
const {element,container,vnode,containerCollection} = require('@tsugite/uikit/helper/ui')

exports.default = (context, ui, state, action, view) =>
  compose(
    plug(vnode(view.view), source(ui.data), sink(ui.vnode)),
    plug(container,
      source(context.init), sink(ui.data),
      source(ui.newTodo.data),
      source(ui.item.collection.data),
      source(ui.left.data)),
    plug(element({keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.newTodo.data), sink(ui.newTodo.data)),
    plug(element(), source(state.left), sink(ui.left.data)),
    containerCollection(
      state.item, ui.item,
      state.item.collection, ui.item.collection,
      view.item.view,
      ui.item.title.data,
      ui.item.completed.data,
      ui.item.destroy.data,
      ui.item.edit.data),
    plug(element({dblclick: [action.item.title.dblclick]}),
      source(state.item.title.data), sink(ui.item.title.data)),
    plug(element({change: [action.item.completed.change, ['target', 'checked']]}),
      source(state.item.completed.data), sink(ui.item.completed.data)),
    plug(element({click: [action.item.destroy.click]}),
      source(state.item.data), sink(ui.item.destroy.data)),
    plug(element({keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.item.title.data), sink(ui.item.edit.data)))
