import { render, screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore, { MockGetState } from 'redux-mock-store';

import type { RootState } from '../../app/store';
import ListTodo from './ListTodo';
import todoSlice from './todoSlice';

describe('<ListTodo />', () => {
  const mockStore = configureStore<RootState>();
  const emptyState: RootState = {
    todo: { ids: [], entities: {} },
    filter: 'all',
  };
  const listState: RootState = {
    todo: {
      ids: ['a', 'b'],
      entities: {
        a: {
          id: 'a',
          task: 'make a sandwich',
          completed: false,
        },
        b: {
          id: 'b',
          task: 'make a salad',
          completed: true,
        },
      },
    },
    filter: 'all',
  };
  const getState: MockGetState<RootState> = (actions) => {
    if (actions.length === 0) return listState;

    return {
      ...listState,
      [todoSlice.name]: actions.reduce(
        (state, action) => todoSlice.reducer(state, action),
        listState.todo,
      ),
    };
  };

  it('should show an alert with an empty list', () => {
    const store = mockStore(emptyState);

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
    const store = mockStore(listState);

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

  it('should toggle a todo', () => {
    const store = mockStore(getState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(
      within(screen.getByTestId('todo-a')).getByRole('checkbox'),
    ).not.toBeChecked();

    user.click(within(screen.getByTestId('todo-a')).getByRole('checkbox'));

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toHaveProperty('type', 'todo/updateTodo');
    expect(store.getActions()[0]).toHaveProperty('payload.changes.completed');
    expect(
      within(screen.getByTestId('todo-a')).getByRole('checkbox'),
    ).toBeChecked();
  });

  it('should edit a todo', () => {
    const store = mockStore(getState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-a')).toBeInTheDocument();

    user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );

    user.type(
      screen.getByLabelText('Change task'),
      '{selectall}Eat healthy food{enter}',
    );

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toHaveProperty('type', 'todo/updateTodo');
    expect(store.getActions()[0]).toHaveProperty(
      'payload.changes.task',
      'Eat healthy food',
    );
    expect(screen.getByText('Eat healthy food')).toBeInTheDocument();
    expect(screen.queryByLabelText('Change task')).not.toBeInTheDocument();
  });

  it('should cancel the editing of a todo', () => {
    const store = mockStore(getState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-a')).toBeInTheDocument();

    user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );

    user.type(
      screen.getByLabelText('Change task'),
      '{selectall}Eat healthy food',
    );
    user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(store.getActions()).toHaveLength(0);
    expect(
      screen.getByText(listState.todo.entities['a']!.task),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Task')).not.toBeInTheDocument();

    user.click(
      within(screen.getByTestId('todo-a')).getByRole('button', {
        name: 'Edit',
      }),
    );

    expect(screen.getByLabelText('Change task')).toHaveValue(
      listState.todo.entities['a']!.task,
    );
  });

  it('should remove a todo', () => {
    const store = mockStore(getState);

    render(
      <Provider store={store}>
        <ListTodo />
      </Provider>,
    );

    expect(screen.getByTestId('todo-b')).toBeInTheDocument();

    user.click(
      within(screen.getByTestId('todo-b')).getByRole('button', {
        name: 'Remove',
      }),
    );

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toHaveProperty('type', 'todo/removeTodo');
    expect(store.getActions()[0]).toHaveProperty('payload', 'b');
    expect(screen.queryByTestId('todo-b')).not.toBeInTheDocument();
  });
});
