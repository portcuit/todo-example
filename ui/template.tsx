import {h} from '@pkit/snabbdom'

export const item = ([title, completed, destroy, edit]) =>
  <li class={{
    editing: destroy.store.editing,
    completed: destroy.store.completed
  }}>
    <div class={{view: true}}>
      <input class={{toggle: true}} {...completed} props={{
        type: 'checkbox',
        checked: completed.store
      }} />
      <label {...title}>{title.store}</label>
      <button class={{destroy: true}} {...destroy} />
    </div>
    <input class={{edit: true}} {...edit} props={{value: edit.store}} />
  </li>;

export const app = ([newTodo, items, left]) =>
  <section class={{todoapp: true}}>
    <header class={{todo: true}}>
      <h1>todos</h1>
      <input class={{'new-todo': true}} {...newTodo} props={{
        value: newTodo.store,
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
          {left.store} item left
        </strong>
      </span>
    </footer>
  </section>;