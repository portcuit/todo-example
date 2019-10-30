const {li,div,label,button,input} = require('@cycle/dom')

const view = ([title, checked, destroy, edit]) =>
  li({
    class: {
      editing: destroy.store.editing
    }
  }, [
    div('.view', [
      input('.toggle', {
        ...checked,
        props: {
          type: 'checkbox',
          checked: checked.store
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