import { action, observable, makeObservable } from 'mobx';

import { TodoT, TodoByIdT } from 'src/todos/types';

export class TodosStore {
  @observable todoById: TodoByIdT = {};
  @observable todo?: TodoT = undefined;

  constructor() {
    makeObservable(this);
  }

  @action loadTodos = () => {
    this.addTodos([
      {
        name: 'Fetch water',
        id: '1',
        state: 'done',
      },
      {
        name: 'Chop wood',
        id: '2',
        state: 'not done',
      },
      {
        name: 'Sweep the floor',
        id: '3',
        state: 'done',
      },
      {
        name: 'Clean the windows',
        id: '4',
        state: 'not done',
      },
      {
        name: 'Paint the fence',
        id: '5',
        state: 'done',
      },
      {
        name: 'Make the beds',
        id: '6',
        state: 'not done',
      },
    ]);
  };

  @action addTodos = (todos: TodoT[]) => {
    todos.forEach((todo: TodoT) => {
      this.todoById[todo.id] = todo;
    });
  };
}
