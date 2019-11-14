const snabbdom = require('@pkit/snabbdom/port')
const {port: worker} = require('@pkit/worker')
const {context} = require('@pkit/core/port')
const state = require('@pkit/uikit/port/store')
const view = require('@pkit/uikit/port/ui')

module.exports = {
  ...context,
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
      ...state.container,
      root: state.attribute,
      newTodo: state.attribute,
      item: {
        ...state.container,
        collection: {
          ...state.collection,
          add: null
        },
        title: state.attribute,
        completed: state.attribute,
        editing: state.attribute
      },
      left: null
    }
  },
  ui: {
    ...view.container,
    newTodo: view.element,
    item: {
      ...view.container,
      collection: view.collection,
      title: view.element,
      destroy: view.element,
      completed: view.element,
      edit: view.element
    },
    left: view.element
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
}