import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from 'src/app/components/StoreProvider';
import { TodoListViewItem } from 'src/todos/components';
import { TodosCtr } from 'src/todos/TodosCtr';
import { TodoT } from 'src/todos/types';
import './TodoListView.scss';

type PropsT = {};

export const TodoListView: React.FC<PropsT> = observer(() => {
  const { todosStore } = useStore();

  // For simplicity, the container is created as local state of the
  // view component. It's usually preferred though to provide it with a
  // hook similar to useStore().
  const [ctr] = React.useState(() => {
    const ctr = new TodosCtr();
    ctr.filtering.apply((todos) => {
      return todos.filter((x: TodoT) => x.state === 'done');
    });
    ctr.filtering.setEnabled(false);
    return ctr;
  });

  React.useEffect(() => {
    runInAction(() => {
      ctr.inputs.todoById = todosStore.todoById;
    });
  }, [ctr.inputs, todosStore.todoById]);

  const todos: TodoT[] = Object.values(ctr.outputs.filteredTodoById);

  const filterDiv = (
    <div className="TodoListView__filter">
      <input
        className="TodoListView__filter__checkbox"
        type="checkbox"
        onChange={() => ctr.filtering.setEnabled(!ctr.filtering.isEnabled)}
      />
      <p>Only show completed todos</p>
    </div>
  );

  const todoDivs = todos.map((todo) => (
    <TodoListViewItem
      key={todo.id}
      className={{
        'TodoListViewItem--selected': ctr.selection.ids.includes(todo.id),
        'TodoListViewItem--highlighted': ctr.highlight.id === todo.id,
      }}
      todo={todo}
      onMouseDown={(e: any) => {
        ctr.selection.select({
          itemId: todo.id,
          isShift: e.shiftKey,
          isCtrl: e.ctrlKey,
        });
      }}
    />
  ));

  return (
    <div className="TodoListView">
      {filterDiv}
      {todoDivs}
    </div>
  );
});
