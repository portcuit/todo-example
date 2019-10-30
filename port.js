const {prepare} = require('@tsugite/core')
snabbdom = require('@tsugite/snabbdom/port').raw
worker = require('@tsugite/worker/port').raw
const context = require('@tsugite/port/context').raw
const store = require('@tsugite/uikit/port/store')
const ui = require('@tsugite/uikit/port/ui')
const action = require('@tsugite/port/action')

module.exports = prepare({
  context: {
    main: context,
    ui: {
      ...context,
      reload: null
    }
  },
  snabbdom: snabbdom,
  worker: worker,
  store: {
    state: {
      ...store.container,
      root: store.attribute
    }
  },
  ui: ui.container
})