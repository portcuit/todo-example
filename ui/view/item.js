const {li,div,label,button,input} = require('@cycle/dom')

const view = ([title, checked, destroy, edit]) =>
  li({
    class: {
      editing: destroy.value.editing
    }
  }, [
    div('.view', [
      input('.toggle', {
        action: checked.action,
        idxs: checked.idxs,
        props: {
          type: 'checkbox',
          checked: checked.value
        }
      }),
      label({
        action: title.action,
        idxs: title.idxs
      }, title.value),
      button('.destroy', {
        action: destroy.action,
        idxs: destroy.idxs
      })
    ]),
    input('.edit', {
      action: edit.action,
      idxs: edit.idxs,
      props: {
        value: edit.value
      }
    })
  ])


module.exports = {view}