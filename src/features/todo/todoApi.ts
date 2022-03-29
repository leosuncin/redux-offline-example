import type { AsyncThunkPayloadCreator, Update } from '@reduxjs/toolkit';

import type { AsyncThunkConfig } from '../../app/store';
import type { Todo } from './todoSlice';

export const getAll: AsyncThunkPayloadCreator<
  Todo[],
  number | undefined,
  AsyncThunkConfig<{ fulfilledMeta: { totalCount: number } }>
> = async (page = 1, { signal, fulfillWithValue }) => {
  const queryParams = new URLSearchParams({
    _page: page.toString(),
    _sort: 'createdAt',
    _order: 'desc',
  });
  const response = await fetch(`/api/todos?${queryParams.toString()}`, {
    signal,
  });
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
> = async ({ changes, id }) => {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(changes),
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
