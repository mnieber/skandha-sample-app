import React from 'react';
import { action, reaction } from 'mobx';
import { TodosCtr } from 'src/todos/TodosCtr';
import { useStore } from 'src/app/components/StoreProvider';
import { TodoT, TodoByIdT } from 'src/todos/types';

const TodosCtrContext = React.createContext<TodosCtr | undefined>(undefined);

export const TodosCtrProvider: React.FC = ({ children }) => {
  const { todosStore } = useStore();

  const [ctr] = React.useState(() => {
    const ctr = new TodosCtr();
    ctr.filtering.apply((todos: TodoT[]) => {
      return todos.filter((x: TodoT) => x.state === 'done');
    });
    ctr.filtering.setEnabled(false);
    return ctr;
  });

  React.useEffect(() => {
    const cleanUp = reaction(
      () => todosStore.todoById,
      action((todoById: TodoByIdT) => {
        ctr.inputs.todoById = todoById;
      }),
      {
        fireImmediately: true,
      }
    );
    return cleanUp;
  });

  return (
    <TodosCtrContext.Provider value={ctr}>{children}</TodosCtrContext.Provider>
  );
};

export const useTodosCtr = () => {
  const ctr = React.useContext(TodosCtrContext);
  if (!ctr) {
    throw new Error('useTodosCtr must be used within a TodosCtrProvider.');
  }
  return ctr;
};
