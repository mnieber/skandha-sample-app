import './App.scss';
import { TodosCtrProvider } from 'src/todos/components/useTodosCtr';
import { TodoListView } from 'src/todos/components';

export function App() {
  return (
    <div className="App">
      <TodosCtrProvider>
        <TodoListView />
      </TodosCtrProvider>
    </div>
  );
}

export default App;
