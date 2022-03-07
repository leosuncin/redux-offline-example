import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

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
  },
});

const todoSelectors = todoAdapter.getSelectors(
  (state: RootState) => state.todo,
);

export const selectTodos = todoSelectors.selectAll;

export const { addTodo, removeTodo, updateTodo } = todoSlice.actions;

export default todoSlice;
