import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import { selectFilter } from '../filter/filterSlice';

export type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

const todoAdapter = createEntityAdapter<Todo>();

const initialState = todoAdapter.getInitialState();

export type TodoSliceState = typeof initialState;

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: {
      prepare(task: string) {
        return {
          payload: {
            id: nanoid(),
            task,
            completed: false,
          },
        };
      },
      reducer: todoAdapter.addOne,
    },
    updateTodo: todoAdapter.updateOne,
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

export const { addTodo, clearCompleted, removeTodo, updateTodo } =
  todoSlice.actions;

export default todoSlice;
