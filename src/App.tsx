import CreateTodo from './features/todo/CreateTodo';
import ListTodo from './features/todo/ListTodo';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col px-4 py-4 text-center">
          <h1 className="display-5 fw-bold">Todo List App</h1>
        </div>
      </div>
      <div className="row my-5">
        <div className="col">
          <CreateTodo />
        </div>
      </div>
      <div className="row my-4">
        <div className="col">
          <ListTodo />
        </div>
      </div>
    </div>
  );
}

export default App;
