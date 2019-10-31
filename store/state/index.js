const {apply,pipe,isNil,not,insert,__,length,propEq} = require('ramda')
const {map} = require('rxjs/operators')
const {compose,plug,source,sink} = require('@tsugite/core')
const {base,attribute,container,init,add} = require('@tsugite/uikit/helper/store')

const left = (source$, sink) =>
  source$.pipe(
    map(([items]) =>
      items
        .filter(pipe(isNil,not))
        .filter(propEq('completed', false))),
    map(pipe(length, insert(0,__,[]), apply(sink))))

exports.default = (state, context, initial) =>
  compose(
    plug(left, source(state.item.collection.data), sink(state.left)),
    plug(init(initial.init), source(context.init), sink(state.update)),
    attribute(state.item.editing, state.item, state, ['editing'], ['items', 0, 'editing']),
    attribute(state.item.completed, state.item, state, ['completed'], ['items', 0, 'completed']),
    attribute(state.item.title, state.item, state, ['title'], ['items', 0, 'title']),
    container(state.item.collection, state.item),
    add(state.item.collection, initial.item),
    attribute(state.item.collection, state, state, ['items'], ['items', 0]),
    attribute(state.newTodo, state, state, ['newTodo'], ['newTodo']),
    base(state, {}))
