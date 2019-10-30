const {compose,plug,source,sink} = require('@tsugite/core')
const {base,attribute,container,init,add} = require('@tsugite/uikit/helper/store')

exports.default = (state, context, initial) =>
  compose(
    plug(init(initial.init), source(context.init), sink(state.update)),
    attribute(state.item.editing, state.item, state, ['editing'], ['items', 0, 'editing']),
    attribute(state.item.checked, state.item, state, ['checked'], ['items', 0, 'checked']),
    attribute(state.item.title, state.item, state, ['title'], ['items', 0, 'title']),
    container(state.item.collection, state.item),
    add(state.item.collection, initial.item),
    attribute(state.item.collection, state, state, ['items'], ['items', 0]),
    attribute(state.root, state, state, ['root'], ['root']),
    attribute(state.newTodo, state, state, ['newTodo'], ['newTodo']),
    base(state, {}))
