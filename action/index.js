const {apply,propEq,remove} = require('ramda')
const {of} = require('rxjs')
const {tap,filter,map,mergeMap} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@tsugite/core')
const {direct,bindTo,dropBindTo} = require('@tsugite/helper')

const keyCode = keyCode =>
  (source$, sink) =>
    source$.pipe(
      filter(propEq(0, keyCode)),
      map(remove(0,1)),
      map(apply(sink)))

// const addAndUpdate = (source$, add, update) =>
//   source$.pipe(
//     mergeMap(([data]) =>
//       of(
//         // add(...dropLast(1, idxs)),
//         // update(data, ...idxs)
//       )))

exports.default = action =>
  compose(
    plug(keyCode(13), source(action.newTodo.keypress), sink(action.newTodo.enter)),
    plug(keyCode(13), source(action.item.edit.keypress), sink(action.item.edit.enter)),
    plug(keyCode(27), source(action.item.edit.keypress), sink(action.item.edit.esc))
    )

exports.ui = (action, state) =>
  compose(
    // plug(addAndUpdate,
    //   source(action.newTodo.enter),
    //   sink(state.item.collection.add),
    //   sink(state.item.title.update)
    //   ),

    plug(direct, source(action.item.checked.change), sink(state.item.checked.update)),
    plug(bindTo(null), source(action.item.destroy.click), sink(state.item.collection.update)),
    plug(bindTo(true), source(action.item.title.dblclick), sink(state.item.editing.update)),

    plug(direct, source(action.item.edit.enter), sink(state.item.title.update)),
    plug(dropBindTo(1, false), source(action.item.edit.enter), sink(state.item.editing.update)),
    plug(dropBindTo(1, false), source(action.item.edit.esc), sink(state.item.editing.update))
  )
