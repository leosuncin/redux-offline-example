import type { AsyncThunkPayloadCreator, Update } from '@reduxjs/toolkit';

import type { AsyncThunkConfig } from '../../app/store';
import type { Todo } from './todoSlice';

export const getAll: AsyncThunkPayloadCreator<
  Todo[],
  number | undefined,
  AsyncThunkConfig<{ fulfilledMeta: { totalCount: number } }>
> = async (page = 1, { signal, fulfillWithValue }) => {
  const response = await fetch(`/api/todos?_page=${page}`, { signal });
  const totalCount = +response.headers.get('x-total-count')!;
  const json = (await response.json()) as Todo[];

  return fulfillWithValue(json, { totalCount });
};

export const createOne: AsyncThunkPayloadCreator<
  Todo,
  string,
  AsyncThunkConfig
> = async (task, { requestId }) => {
  const response = await fetch(`/api/todos`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: requestId,
      task,
      completed: false,
    }),
  });

  return response.json();
};

export const updateOne: AsyncThunkPayloadCreator<
  Todo,
  Update<Todo>,
  AsyncThunkConfig
> = async ({ changes, id }, { getState }) => {
  const todo = getState().todo.entities[id]!;
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ ...todo, ...changes, id: undefined }),
  });

  return response.json();
};

export const removeOne: AsyncThunkPayloadCreator<
  void,
  Todo['id'],
  AsyncThunkConfig
> = async (id) => {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
};
