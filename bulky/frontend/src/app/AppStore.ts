import { observable, makeObservable } from "mobx";
import { TodosStore } from "src/todos/TodosStore";

export class AppStore {
  @observable todosStore: TodosStore;

  constructor() {
    makeObservable(this);
    this.todosStore = new TodosStore();
    this.todosStore.loadTodos();
  }
}
