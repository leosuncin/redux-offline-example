import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import FilterBy from './features/filter/FilterBy';
import PaginateList from './features/paginate/PaginateList';
import ClearCompletedTodo from './features/todo/ClearCompletedTodo';
import CreateTodo from './features/todo/CreateTodo';
import ListTodo from './features/todo/ListTodo';
import ShowingTodo from './features/todo/ShowingTodo';
import { fetchAll } from './features/todo/todoSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(fetchAll());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

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
      <div className="row my-2">
        <div className="col d-flex justify-content-between">
          <ShowingTodo />
          <FilterBy />
          <ClearCompletedTodo />
        </div>
      </div>
      <div className="row my-4">
        <div className="col">
          <ListTodo />
          <PaginateList />
        </div>
      </div>
    </div>
  );
}

export default App;
