const {compose,plug,source,sink} = require('@pkit/core')
const {dropTo,dropBindTo,mapToSink} = require('@pkit/helper')
const {keyCode, add} = require('./processors')

const KEY_CODE_ENTER = 13,
  KEY_CODE_ESC = 27

exports.default = action =>
  compose(
    plug(keyCode(KEY_CODE_ENTER),
      source(action.newTodo.keypress), sink(action.newTodo.enter)),
    plug(keyCode(KEY_CODE_ENTER),
      source(action.item.edit.keypress), sink(action.item.edit.enter)),
    plug(keyCode(KEY_CODE_ESC),
      source(action.item.edit.keypress), sink(action.item.edit.esc)))

exports.ui = (action, state) =>
  compose(
    plug(dropTo(2),
      source(action.newTodo.enter), sink(state.newTodo.update)),
    plug(mapToSink(),
      source(action.newTodo.enter), sink(state.item.collection.add)),
    plug(add,
      source(action.newTodo.enter), sink(state.item.title.update),
      source(state.item.collection.data)),
    plug(mapToSink(''),
      source(action.newTodo.enter), sink(state.newTodo.update)),
    plug(dropTo(1),
      source(action.item.completed.change), sink(state.item.completed.update)),
    plug(dropBindTo(1, null),
      source(action.item.destroy.click), sink(state.item.collection.update)),
    plug(dropBindTo(1, true),
      source(action.item.title.dblclick), sink(state.item.editing.update)),
    plug(dropTo(2),
      source(action.item.edit.enter), sink(state.item.title.update)),
    plug(dropBindTo(3, false),
      source(action.item.edit.enter), sink(state.item.editing.update)),
    plug(dropBindTo(3, false),
      source(action.item.edit.esc), sink(state.item.editing.update)))
