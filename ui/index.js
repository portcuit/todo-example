const {compose,plug,source,sink} = require('@pkit/core')
const ui = require('@pkit/ui')
const initial = require('./initial')
const template = require('./template')
const {left} = require('./processors')

exports.port = {
  state: {
    ...ui.port.state.container,
    root: ui.port.state.attribute,
    newTodo: ui.port.state.attribute,
    item: {
      ...ui.port.state.container,
      collection: {
        ...ui.port.state.collection,
        add: null
      },
      title: ui.port.state.attribute,
      completed: ui.port.state.attribute,
      editing: ui.port.state.attribute
    },
    left: null
  },
  view: {
    ...ui.port.view.container,
    newTodo: ui.port.view.element,
    item: {
      ...ui.port.view.container,
      collection: ui.port.view.collection,
      title: ui.port.view.element,
      destroy: ui.port.view.element,
      completed: ui.port.view.element,
      edit: ui.port.view.element
    },
    left: ui.port.view.element
  }
}

const state = (context, state, {attribute, container, base, add, init}) =>
  compose(
    plug(left,
      source(state.item.collection.data), sink(state.left)),
    plug(init(initial.state),
      source(context.init), sink(state.update)),
    attribute(state.item.editing, state.item, state, ['editing'], ['items', 0, 'editing']),
    attribute(state.item.completed, state.item, state, ['completed'], ['items', 0, 'completed']),
    attribute(state.item.title, state.item, state, ['title'], ['items', 0, 'title']),
    container(state.item.collection, state.item),
    add(state.item.collection, initial.item),
    attribute(state.item.collection, state, state, ['items'], ['items', 0]),
    attribute(state.newTodo, state, state, ['newTodo'], ['newTodo']),
    base(state, {}))

const view = (context, state, view, action, {vnode, container, element, containerCollection}) =>
  compose(
    plug(vnode(template.app),
      source(view.data), sink(view.vnode)),
    plug(container,
      source(context.init), sink(view.data),
      source(view.newTodo.data),
      source(view.item.collection.data),
      source(view.left.data)),
    plug(element({keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.newTodo.data), sink(view.newTodo.data)),
    plug(element(),
      source(state.left), sink(view.left.data)),
    containerCollection(
      state.item, view.item,
      state.item.collection, view.item.collection,
      template.item,
      view.item.title.data,
      view.item.completed.data,
      view.item.destroy.data,
      view.item.edit.data),
    plug(element({dblclick: [action.item.title.dblclick]}),
      source(state.item.title.data), sink(view.item.title.data)),
    plug(element({change: [action.item.completed.change, ['target', 'checked']]}),
      source(state.item.completed.data), sink(view.item.completed.data)),
    plug(element({click: [action.item.destroy.click]}),
      source(state.item.data), sink(view.item.destroy.data)),
    plug(element({keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.item.title.data), sink(view.item.edit.data)))

exports.default = (context, statePort, viewPort, action) =>
  compose(
    view(context, statePort, viewPort, action, ui.helper.view),
    state(context, statePort, ui.helper.state))
