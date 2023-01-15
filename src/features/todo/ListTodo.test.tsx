import { render, screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import { makeStore, RootState } from '../../app/store';
import ListTodo from './ListTodo';
import todoSlice, { todoAdapter } from './todoSlice';

const emptyState: RootState = {
  todo: todoSlice.getInitialState(),
  filter: 'all',
  paginate: { currentPage: 1, total: 0 },
};
const listState: RootState = {
  todo: todoAdapter.setAll(todoSlice.getInitialState(), [
    {
      id: 'a',
      task: 'make a sandwich',
      completed: false,
      createdAt: 1,
      updatedAt: 1,
    },
    {
      id: 'b',
      task: 'make a salad',
      completed: true,
      createdAt: 0,
      updatedAt: 0,
    },
  ]),
  filter: 'all',
  paginate: { currentPage: 1, total: 0 },
};
const server = setupServer(
  rest.all('*', (_, response, { json }) => response(json({}))),
);

describe('<ListTodo />', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  beforeEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should show an alert with an empty list', () => {
    const store = makeStore(emptyState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The list of tasks will be shown here',
    );
  });

  it('should list all of the todo', () => {
    const store = makeStore(listState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(
      listState.todo.ids.length,
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should toggle a todo', async () => {
    const store = makeStore(listState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(
      within(screen.getByTestId('todo-a')).getByRole('checkbox'),
    ).not.toBeChecked();

    await user.click(
      within(screen.getByTestId('todo-a')).getByRole('checkbox'),
    );

    expect(
      within(screen.getByTestId('todo-a')).getByRole('checkbox'),
    ).toBeChecked();
  });

  it('should edit a todo', async () => {
    const store = makeStore(listState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-a')).toBeInTheDocument();

    await user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );

    await user.clear(screen.getByLabelText('Change task'));
    await user.type(
      screen.getByLabelText('Change task'),
      'Eat healthy food{enter}',
    );

    expect(screen.getByText('Eat healthy food')).toBeInTheDocument();
    expect(screen.queryByLabelText('Change task')).not.toBeInTheDocument();
  });

  it('should cancel the editing of a todo', async () => {
    const store = makeStore(listState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-a')).toBeInTheDocument();

    await user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );

    await user.clear(screen.getByLabelText('Change task'));
    await user.type(screen.getByLabelText('Change task'), 'Eat healthy food');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.getByText(listState.todo.entities['a']!.task),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Task')).not.toBeInTheDocument();

    await user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );
  });

  it('should remove a todo', async () => {
    const store = makeStore(listState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-b')).toBeInTheDocument();

    await user.click(
      within(screen.getByTestId('todo-b')).getByRole('button', {
        name: 'Remove',
      }),
    );

    expect(screen.queryByTestId('todo-b')).not.toBeInTheDocument();
  });
});
