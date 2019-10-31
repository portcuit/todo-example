const {li,div,label,button,input} = require('@cycle/dom')

const view = ([title, completed, destroy, edit]) =>
  li({
    class: {
      editing: destroy.store.editing,
      completed: destroy.store.completed
    }
  }, [
    div('.view', [
      input('.toggle', {
        ...completed,
        props: {
          type: 'checkbox',
          checked: completed.store
        }
      }),
      label(title, title.store),
      button('.destroy', destroy)
    ]),
    input('.edit', {
      ...edit,
      props: {
        value: edit.store
      }
    })
  ])

module.exports = {view}