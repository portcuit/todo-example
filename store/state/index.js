const {compose,plug,source,sink} = require('@tsugite/core')
const {base,attribute,init} = require('@tsugite/uikit/helper/store')

exports.default = (state, context, initial) =>
  compose(
    plug(init(initial.init), source(context.init), sink(state.update)),
    attribute(state.root, state, state, ['root'], ['root']),
    base(state, {}))
