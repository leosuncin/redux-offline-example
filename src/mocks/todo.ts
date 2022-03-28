import { rest } from 'msw';

import { todoAdapter } from '../features/todo/todoSlice';
import type { Todo } from '../features/todo/todoSlice';

let state = todoAdapter.setMany(todoAdapter.getInitialState(), [
  {
    id: '8fe18020-1e68-4a53-be2c-d7e582334a5a',
    task: 'Just do it',
    completed: true,
  },
  {
    id: '7b6b5203-62b3-4e57-b177-407501653d24',
    task: 'Complete the project',
    completed: false,
  },
  {
    id: '9ebc6a28-dbdf-4b30-8cd5-1dd09cd3ae94',
    task: 'Speak at an industry conference or event',
    completed: true,
  },
  {
    id: '9ceec59a-f95c-4017-9de7-507e11034414',
    task: 'Establish a healthy work-life balance',
    completed: false,
  },
]);
const todoSelectors = todoAdapter.getSelectors();

export const listTodoHandler = rest.get<Todo[]>(
  '/api/todos',
  (_request, response, context) => {
    return response(
      context.delay(),
      context.set('x-total-count', '69'),
      context.json(todoSelectors.selectAll(state)),
    );
  },
);

export const createTodoHandler = rest.post<Todo, {}, Todo>(
  '/api/todos',
  (request, response, context) => {
    const todo = request.body;
    state = todoAdapter.addOne(state, todo);

    return response(context.delay(), context.status(201), context.json(todo));
  },
);

export const updateTodoHandler = rest.patch<
  Todo,
  { id: string },
  Partial<Todo>
>('/api/todos/:id', (request, response, context) => {
  const { id } = request.params;
  const todo = todoSelectors.selectById(state, request.params.id)!;

  state = todoAdapter.updateOne(state, {
    id,
    changes: request.body,
  });

  return response(context.delay(), context.json(todo));
});

export const removeTodoHandler = rest.delete<undefined, { id: string }>(
  '/api/todos/:id',
  (request, response, context) => {
    const { id } = request.params;

    state = todoAdapter.removeOne(state, id);

    return response(context.delay());
  },
);

const handlers = [
  listTodoHandler,
  createTodoHandler,
  updateTodoHandler,
  removeTodoHandler,
];

export default handlers;
