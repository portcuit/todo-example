const {prepare} = require('@tsugite/core')
snabbdom = require('@tsugite/snabbdom/port').raw
worker = require('@tsugite/worker/port').raw
const context = require('@tsugite/port/context').raw
const store = require('@tsugite/uikit/port/store')
const ui = require('@tsugite/uikit/port/ui')

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
      root: store.attribute,
      newTodo: store.attribute,
      item: {
        ...store.container,
        collection: {
          ...store.collection,
          add: null
        },
        title: store.attribute,
        checked: store.attribute,
        editing: store.attribute
      }
    }
  },
  ui: {
    ...ui.container,
    newTodo: ui.element,
    item: {
      ...ui.container,
      collection: ui.collection,
      title: ui.element,
      destroy: ui.element,
      checked: ui.element,
      edit: ui.element
    }
  },
  action: {
    newTodo: {
      keypress: null,
      enter: null
    },
    item: {
      title: {
        dblclick: null
      },
      checked: {
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
  }
})