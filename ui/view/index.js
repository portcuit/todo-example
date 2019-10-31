const {section,header,h1,input,label,ul,li,div,button,footer,span,strong,a} = require('@cycle/dom')

const view = ([newTodo, items, left]) =>
  section('.todoapp', [
    header('.header', [
      h1('todos'),
      input('.new-todo', {
        ...newTodo,
        props: {
          value: newTodo.store,
          placeholder: 'What needs to be done?',
          autofocus: true
        }
      })
    ]),
    section('.main', [
      input('#toggle-all.toggle-all', {
        props: {
          type: 'checkbox'
        }
      }),
      label({
        attributes: {
          for: 'toggle-all'
        }
      }, 'Mark all as complete'),
      ul('.todo-list', items)
    ]),
    footer('.footer', [
      span('.todo-count', [
        strong(left.store),
        ' item left'
      ])
    ])
  ])

module.exports = {view}
