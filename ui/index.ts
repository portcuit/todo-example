import {compose,plug,source,sink} from '@pkit/core'
import {mapToSink} from '@pkit/helper'
import {
  containerStatePort, attributeStatePort, collectionStatePort,
  elementViewPort, containerViewPort, collectionViewPort,
  baseState, containerState, attributeState, addState,
  vnode, elementView, containerView, containerCollection
} from '@pkit/ui'
import {left} from './processors'
import * as initial from './initial'
import * as template from './template'

export const port = {
  state: {
    ...containerStatePort,
    root: attributeStatePort,
    newTodo: attributeStatePort,
    item: {
      ...containerStatePort,
      collection: {
        ...collectionStatePort,
        add: null
      },
      title: attributeStatePort,
      completed: attributeStatePort,
      editing: attributeStatePort
    },
    left: null
  },
  view: {
    ...containerViewPort,
    newTodo: elementViewPort,
    item: {
      ...containerViewPort,
      collection: collectionViewPort,
      title: elementViewPort,
      destroy: elementViewPort,
      completed: elementViewPort,
      edit: elementViewPort
    },
    left: elementViewPort
  }
};

const state = (context, state) =>
  compose(
    left(source(state.item.collection.data), sink(state.left)),
    plug(mapToSink(initial.state),
      source(context.init), sink(state.update)),
    attributeState(state.item.editing,
      state.item, ['editing'],
      state, ['items', 0, 'editing']),
    attributeState(state.item.completed,
      state.item, ['completed'],
      state, ['items', 0, 'completed']),
    attributeState(state.item.title,
      state.item, ['title'],
      state, ['items', 0, 'title']),
    containerState(state.item, state.item.collection),
    addState(state.item.collection, initial.item),
    attributeState(state.item.collection,
      state, ['items'],
      state, ['items', 0]),
    attributeState(state.newTodo,
      state, ['newTodo'],
      state, ['newTodo']),
    baseState(state, {}));

const view = (context, state, view, action) =>
  compose(
    vnode(source(view.data), sink(view.vnode),
      template.app),
    containerView(source(context.init), sink(view.data),
      source(view.newTodo.data),
      source(view.item.collection.data),
      source(view.left.data)),
    elementView(source(state.newTodo.data), sink(view.newTodo.data),
      {keypress: [action.newTodo.keypress, ['keyCode'], ['target', 'value']]}),
    elementView(source(state.left), sink(view.left.data)),
    containerCollection(
      state.item, view.item,
      state.item.collection, view.item.collection,
      template.item,
      source(view.item.title.data),
      source(view.item.completed.data),
      source(view.item.destroy.data),
      source(view.item.edit.data)),
    elementView(source(state.item.title.data), sink(view.item.title.data),
      {dblclick: [action.item.title.dblclick]}),
    elementView(source(state.item.completed.data), sink(view.item.completed.data),
      {change: [action.item.completed.change, ['target', 'checked']]}),
    elementView(source(state.item.data), sink(view.item.destroy.data),
      {click: [action.item.destroy.click]}),
    elementView(source(state.item.title.data), sink(view.item.edit.data),
      {keydown: [action.item.edit.keypress, ['keyCode'], ['target', 'value']]}));

export default (context, statePort, viewPort, action) =>
  compose(
    view(context, statePort, viewPort, action),
    state(context, statePort))
