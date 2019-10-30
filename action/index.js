const {apply,propEq,remove} = require('ramda')
const {of} = require('rxjs')
const {tap,filter,map,mergeMap} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@tsugite/core')
const {direct,dropTo,bindTo,dropBindTo,mapToSink} = require('@tsugite/helper')

const keyCode = keyCode =>
  (source$, sink) =>
    source$.pipe(
      filter(propEq(1, keyCode)),
      map(apply(sink)))

const add = (source$, sink) =>
  source$.pipe(
    map(([store,,value]) =>
      sink(value, store.length)))

exports.default = action =>
  compose(
    plug(keyCode(13), source(action.newTodo.keypress), sink(action.newTodo.enter)),
    plug(keyCode(13), source(action.item.edit.keypress), sink(action.item.edit.enter)),
    plug(keyCode(27), source(action.item.edit.keypress), sink(action.item.edit.esc)))

exports.ui = (action, state) =>
  compose(

    plug(mapToSink(), source(action.newTodo.enter), sink(state.item.collection.add)),
    plug(add, source(action.newTodo.enter), sink(state.item.title.update)),

    plug(dropTo(1), source(action.item.checked.change), sink(state.item.checked.update)),
    plug(dropBindTo(1, null), source(action.item.destroy.click), sink(state.item.collection.update)),
    plug(dropBindTo(1, true), source(action.item.title.dblclick), sink(state.item.editing.update)),

    plug(dropTo(2), source(action.item.edit.enter), sink(state.item.title.update)),
    plug(dropBindTo(3, false), source(action.item.edit.enter), sink(state.item.editing.update)),
    plug(dropBindTo(3, false), source(action.item.edit.esc), sink(state.item.editing.update))
  )
