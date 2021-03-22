import { observer } from 'mobx-react-lite';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import React from 'react';
import { ClickToSelectItems, SelectWithKeys } from 'skandha-facets/handlers';
import { useTodosCtr } from 'src/todos/components/useTodosCtr';
import { TodoListViewItem } from 'src/todos/components';
import { TodoT } from 'src/todos/types';
import './TodoListView.scss';

type PropsT = {};

export const TodoListView: React.FC<PropsT> = observer(() => {
  const ctr = useTodosCtr();
  const todos: TodoT[] = Object.values(ctr.outputs.filteredTodoById);

  const clickHandler = new ClickToSelectItems({ selection: ctr.selection });
  const keyHandler = new SelectWithKeys({ container: ctr });

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
      {...clickHandler.handle(todo.id)}
    />
  ));

  return (
    <KeyboardEventHandler
      handleKeys={['up', 'down', 'shift+up', 'shift+down']}
      onKeyEvent={
        keyHandler.handle(['up', 'shift+up'], ['down', 'shift+down']).onKeyDown
      }
    >
      <div className="TodoListView" tabIndex={1}>
        {filterDiv}
        {todoDivs}
      </div>
    </KeyboardEventHandler>
  );
});
