const {apply,pipe,isNil,not,insert,__,length,propEq} = require('ramda')
const {map} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@pkit/core')
const ui = require('@pkit/uikit')
const initial = require('./initial')
const template = require('./template')

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

const left = (source$, sink) =>
  source$.pipe(
    map(([items]) =>
      items
        .filter(pipe(isNil,not))
        .filter(propEq('completed', false))),
    map(pipe(length, insert(0,__,[]), apply(sink))))

const state = (state, context) =>
  compose(
    plug(left, source(state.item.collection.data), sink(state.left)),
    plug(ui.helper.state.init(initial.state), source(context.init), sink(state.update)),
    ui.helper.state.attribute(state.item.editing, state.item, state, ['editing'], ['items', 0, 'editing']),
    ui.helper.state.attribute(state.item.completed, state.item, state, ['completed'], ['items', 0, 'completed']),
    ui.helper.state.attribute(state.item.title, state.item, state, ['title'], ['items', 0, 'title']),
    ui.helper.state.container(state.item.collection, state.item),
    ui.helper.state.add(state.item.collection, initial.item),
    ui.helper.state.attribute(state.item.collection, state, state, ['items'], ['items', 0]),
    ui.helper.state.attribute(state.newTodo, state, state, ['newTodo'], ['newTodo']),
    ui.helper.state.base(state, {}))

const view = (context, view, state, action) =>
  compose(
    plug(ui.helper.view.vnode(template.app), source(view.data), sink(view.vnode)),
    plug(ui.helper.view.container,
      source(context.init), sink(view.data),
      source(view.newTodo.data),
      source(view.item.collection.data),
      source(view.left.data)),
    plug(ui.helper.view.element({keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.newTodo.data), sink(view.newTodo.data)),
    plug(ui.helper.view.element(), source(state.left), sink(view.left.data)),
    ui.helper.view.containerCollection(
      state.item, view.item,
      state.item.collection, view.item.collection,
      template.item,
      view.item.title.data,
      view.item.completed.data,
      view.item.destroy.data,
      view.item.edit.data),
    plug(ui.helper.view.element({dblclick: [action.item.title.dblclick]}),
      source(state.item.title.data), sink(view.item.title.data)),
    plug(ui.helper.view.element({change: [action.item.completed.change, ['target', 'checked']]}),
      source(state.item.completed.data), sink(view.item.completed.data)),
    plug(ui.helper.view.element({click: [action.item.destroy.click]}),
      source(state.item.data), sink(view.item.destroy.data)),
    plug(ui.helper.view.element({keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}),
      source(state.item.title.data), sink(view.item.edit.data)))

exports.default = (context, statePort, viewPort, action) =>
  compose(
    view(context, viewPort, statePort, action),
    state(statePort, context)
  )
