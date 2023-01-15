import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import CreateTodo from './CreateTodo';

describe('<CreateTodo />', () => {
  const mockStore = configureStore(getDefaultMiddleware());

  it('should render', () => {
    const store = mockStore();

    render(
      <Provider store={store}>
        <CreateTodo />
      </Provider>,
    );

    expect(screen.getByRole('textbox', { name: 'Task' })).toBeVisible();
    expect(screen.getByRole('button')).toBeVisible();
  });

  it('should add a task', async () => {
    const store = mockStore();

    render(
      <Provider store={store}>
        <CreateTodo />
      </Provider>,
    );

    await user.type(screen.getByLabelText('Task'), 'Buy milk');
    await user.click(screen.getByRole('button'));

    expect(screen.getByLabelText('Task')).toHaveProperty('value', '');
    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toHaveProperty(
      'type',
      'todo/addTodo/pending',
    );
  });
});
