import {compose,plug,source,sink} from '@pkit/core'
import {mapToSink} from '@pkit/helper'
import * as ui from '@pkit/ui'
import * as initial from './initial'
import * as template from './template'
import {left} from './processors'

export const port = {
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
};

const state = (context, state, {attribute, container, base, add}) =>
  compose(
    left(source(state.item.collection.data), sink(state.left)),
    plug(mapToSink(initial.state),
      source(context.init), sink(state.update)),
    attribute(state.item.editing, state.item, state, ['editing'], ['items', 0, 'editing']),
    attribute(state.item.completed, state.item, state, ['completed'], ['items', 0, 'completed']),
    attribute(state.item.title, state.item, state, ['title'], ['items', 0, 'title']),
    container(state.item.collection, state.item),
    add(state.item.collection, initial.item),
    attribute(state.item.collection, state, state, ['items'], ['items', 0]),
    attribute(state.newTodo, state, state, ['newTodo'], ['newTodo']),
    base(state, {}));

const view = (context, state, view, action, {vnode, container, element, containerCollection}) =>
  compose(
    vnode(source(view.data), sink(view.vnode),
      template.app),
    container(source(context.init), sink(view.data),
      source(view.newTodo.data),
      source(view.item.collection.data),
      source(view.left.data)),
    element(source(state.newTodo.data), sink(view.newTodo.data),
      {keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]}),
    element(source(state.left), sink(view.left.data)),
    containerCollection(
      state.item, view.item,
      state.item.collection, view.item.collection,
      template.item,
      source(view.item.title.data),
      source(view.item.completed.data),
      source(view.item.destroy.data),
      source(view.item.edit.data)),
    element(source(state.item.title.data), sink(view.item.title.data),
      {dblclick: [action.item.title.dblclick]}),
    element(source(state.item.completed.data), sink(view.item.completed.data),
      {change: [action.item.completed.change, ['target', 'checked']]}),
    element(source(state.item.data), sink(view.item.destroy.data),
      {click: [action.item.destroy.click]}),
    element(source(state.item.title.data), sink(view.item.edit.data),
      {keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}));

export default (context, statePort, viewPort, action) =>
  compose(
    view(context, statePort, viewPort, action, ui.helper.view),
    state(context, statePort, ui.helper.state))
