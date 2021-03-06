import {
  addListener,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

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
  const loadingBar = useRef<LoadingBarRef>(null);

  useEffect(() => {
    const unsubscribe = dispatch(
      addListener({
        matcher: isPending,
        async effect(_, { condition }) {
          loadingBar.current?.continuousStart(10, 1e3);

          const finish = await Promise.race([
            condition(isFulfilled),
            condition(isRejected),
          ]);
          if (finish) {
            loadingBar.current?.complete();
          }
        },
      }),
    ) as unknown as CallableFunction;
    const promise = dispatch(fetchAll());

    return () => {
      unsubscribe();
      promise.abort();
    };
  }, [dispatch]);

  return (
    <div className="container">
      <LoadingBar ref={loadingBar} shadow />
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
