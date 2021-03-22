import React from 'react';
import { runInAction } from 'mobx';
import { TodosCtr } from 'src/todos/TodosCtr';
import { useStore } from 'src/app/components/StoreProvider';
import { TodoT } from 'src/todos/types';

const TodosCtrContext = React.createContext<TodosCtr | undefined>(undefined);

export const TodosCtrProvider: React.FC = ({ children }) => {
  const [ctr] = React.useState(() => {
    const ctr = new TodosCtr();
    ctr.filtering.apply((todos: TodoT[]) => {
      return todos.filter((x: TodoT) => x.state === 'done');
    });
    ctr.filtering.setEnabled(false);
    return ctr;
  });

  return (
    <TodosCtrContext.Provider value={ctr}>{children}</TodosCtrContext.Provider>
  );
};

export const useTodosCtr = () => {
  const ctr = React.useContext(TodosCtrContext);
  const { todosStore } = useStore();

  if (!ctr) {
    throw new Error('useTodosCtr must be used within a TodosCtrProvider.');
  }

  React.useEffect(() => {
    runInAction(() => {
      ctr.inputs.todoById = todosStore.todoById;
    });
  }, [ctr.inputs, todosStore.todoById]);

  return ctr;
};
