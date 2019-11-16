import {compose,plug,source,sink} from '@pkit/core'
import {dropSink, dropBindSink, mapToSink} from '@pkit/helper'
import {keyCode, add} from './processors'

const KEY_CODE_ENTER = 13,
  KEY_CODE_ESC = 27;

export const port = {
  newTodo: {
    keypress: null,
    enter: null
  },
  item: {
    title: {
      dblclick: null
    },
    completed: {
      change: null,
    },
    destroy: {
      click: null
    },
    edit: {
      keypress: null,
      enter: null,
      esc: null
    }
  }
};

export default action =>
  compose(
    plug(keyCode(KEY_CODE_ENTER),
      source(action.newTodo.keypress), sink(action.newTodo.enter)),
    plug(keyCode(KEY_CODE_ENTER),
      source(action.item.edit.keypress), sink(action.item.edit.enter)),
    plug(keyCode(KEY_CODE_ESC),
      source(action.item.edit.keypress), sink(action.item.edit.esc)))

export const ui = (action, state) =>
  compose(
    plug(dropSink(2),
      source(action.newTodo.enter), sink(state.newTodo.update)),
    plug(mapToSink(),
      source(action.newTodo.enter), sink(state.item.collection.add)),
    plug(add,
      source(action.newTodo.enter), sink(state.item.title.update),
      source(state.item.collection.data)),
    plug(mapToSink(''),
      source(action.newTodo.enter), sink(state.newTodo.update)),
    plug(dropSink(1),
      source(action.item.completed.change), sink(state.item.completed.update)),
    plug(dropBindSink(1, null),
      source(action.item.destroy.click), sink(state.item.collection.update)),
    plug(dropBindSink(1, true),
      source(action.item.title.dblclick), sink(state.item.editing.update)),
    plug(dropSink(2),
      source(action.item.edit.enter), sink(state.item.title.update)),
    plug(dropBindSink(3, false),
      source(action.item.edit.enter), sink(state.item.editing.update)),
    plug(dropBindSink(3, false),
      source(action.item.edit.esc), sink(state.item.editing.update)))
