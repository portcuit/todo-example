const {prepare} = require('@pkit/core')
snabbdom = require('@pkit/snabbdom/port').raw
worker = require('@pkit/worker/port').raw
const context = require('@pkit/core/port/context').raw
const store = require('@pkit/uikit/port/store')
const ui = require('@pkit/uikit/port/ui')

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
        completed: store.attribute,
        editing: store.attribute
      },
      left: null
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
      completed: ui.element,
      edit: ui.element
    },
    left: ui.element
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
  }
})