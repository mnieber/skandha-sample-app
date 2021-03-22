import React from 'react';
import { observer } from 'mobx-react-lite';
import { TodoT } from 'src/todos/types';
import classnames from 'classnames';
import './TodoListViewItem.scss';

export type PropsT = {
  todo: TodoT;
  className?: any;
  onMouseDown: any;
  onMouseUp: any;
};

export const TodoListViewItem: React.FC<PropsT> = observer((props: PropsT) => {
  return (
    <div
      className={classnames('TodoListViewItem', props.className)}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {props.todo.name}
    </div>
  );
});
