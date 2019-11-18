import h from '@pkit/snabbdom/h'

export const item = ([title, completed, destroy, edit]) =>
  <li class={{
    editing: destroy.data.editing,
    completed: destroy.data.completed
  }}>
    <div class={{view: true}}>
      <input class={{toggle: true}} {...completed} props={{
        type: 'checkbox',
        checked: completed.data
      }} />
      <label {...title}>{title.data}</label>
      <button class={{destroy: true}} {...destroy} />
    </div>
    <input class={{edit: true}} {...edit} props={{value: edit.data}} />
  </li>;

export const app = ([newTodo, items, left]) =>
  <section class={{todoapp: true}}>
    <header class={{todo: true}}>
      <h1>todos</h1>
      <input class={{'new-todo': true}} {...newTodo} props={{
        value: newTodo.data,
        placeholder: 'What needs to be done?',
        autofocus: true
      }} />
    </header>
    <section class={{main: true}}>
      <input class={{'toggle-all': true}} props={{id: 'toggle-all', type: 'checkbox'}} />
      <label attr={{for: 'toggle-all'}}>Mark all as complete</label>
      <ul class={{'todo-list': true}}>{items}</ul>
    </section>
    <footer class={{footer: true}}>
      <span class={{'todo-count': true}}>
        <strong>
          {left.data} item left
        </strong>
      </span>
    </footer>
  </section>;