import { rest } from 'msw';

import type { Todo } from '../features/todo/todoSlice';

const todos: Todo[] = [
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
];

export const listTodoHandler = rest.get<Todo[]>(
  '/api/todos',
  (_request, response, context) => {
    return response(
      context.delay(),
      context.set('x-total-count', '69'),
      context.json(todos),
    );
  },
);

export default [listTodoHandler];
