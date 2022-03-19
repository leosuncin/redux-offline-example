import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { AsyncThunkConfig, RootState } from '../../app/store';
import { selectFilter } from '../filter/filterSlice';
import * as todoApi from './todoApi';

// HACK Remove after upgrade to Typescript 4.6
declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

export type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

export const todoAdapter = createEntityAdapter<Todo>();

const initialState = todoAdapter.getInitialState();

export type TodoSliceState = typeof initialState;

export const fetchAll = createAsyncThunk<
  Todo[],
  number | undefined,
  AsyncThunkConfig<{ fulfilledMeta: { totalCount: number } }>
>('todo/fetchAll', todoApi.getAll);

export const addTodo = createAsyncThunk('todo/addTodo', todoApi.createOne, {
  idGenerator() {
    return crypto.randomUUID();
  },
});

export const updateTodo = createAsyncThunk(
  'todo/updateTodo',
  todoApi.updateOne,
);

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    removeTodo: todoAdapter.removeOne,
    clearCompleted(state) {
      const completedKeys = todoAdapter
        .getSelectors()
        .selectAll(state)
        .filter(({ completed }) => completed)
        .map(({ id }) => id);
      todoAdapter.removeMany(state, completedKeys);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAll.fulfilled, todoAdapter.setAll);

    builder
      .addCase(addTodo.pending, (state, action) => {
        todoAdapter.addOne(state, {
          id: action.meta.requestId,
          task: action.meta.arg,
          completed: false,
        });
      })
      .addCase(addTodo.fulfilled, todoAdapter.setOne);

    builder
      .addCase(updateTodo.pending, (state, action) => {
        todoAdapter.updateOne(state, action.meta.arg);
      })
      .addCase(updateTodo.fulfilled, todoAdapter.setOne);
  },
});

const todoSelectors = todoAdapter.getSelectors(
  (state: RootState) => state.todo,
);

export const selectTodos = createSelector(
  todoSelectors.selectAll,
  selectFilter,
  (list, filter) =>
    list.filter((todo) => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    }),
);

export const selectCountCompleted = (state: RootState): number =>
  todoSelectors
    .selectAll(state)
    .reduce((count, { completed }) => count + Number(completed), 0);

export const { selectTotal } = todoSelectors;

export const { clearCompleted, removeTodo } = todoSlice.actions;

export default todoSlice;
