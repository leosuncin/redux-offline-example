import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import { makeStore } from './app/store';
import App from './App';
import todoHandlers from './mocks/todo';

const server = setupServer(...todoHandlers);

describe('<App />', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should show an empty list', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The list of tasks will be shown here',
    );
  });

  it('should add a task', async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    user.type(screen.getByLabelText('Task'), 'Buy milk');
    user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('should toggle a todo', async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    expect(
      within(screen.getAllByRole('listitem')[1]).getByRole('checkbox', {
        name: 'Mark done',
      }),
    ).not.toBeChecked();

    user.click(
      within(screen.getAllByRole('listitem')[1]).getByRole('checkbox', {
        name: 'Mark done',
      }),
    );

    expect(
      within(screen.getAllByRole('listitem')[1]).getByRole('checkbox', {
        name: 'Mark pending',
      }),
    ).toBeChecked();
  });

  it('should edit a todo', async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    user.click(
      within(screen.getAllByRole('listitem')[0]).getByRole('button', {
        name: 'Edit',
      }),
    );

    user.type(
      screen.getByLabelText('Change task'),
      '{selectall}Buy ice cream{enter}',
    );

    expect(screen.getByText('Buy ice cream')).toBeInTheDocument();
  });

  it('should switch the filter', async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    user.click(screen.getByLabelText('Active'));

    expect(
      within(screen.getByTestId('list-todo')).getAllByRole('listitem'),
    ).toHaveLength(2);

    user.click(screen.getByLabelText('Completed'));

    expect(
      within(screen.getByTestId('list-todo')).getAllByRole('listitem'),
    ).toHaveLength(3);
  });

  it('should clear completed', async () => {
    const store = makeStore({ filter: 'completed' });

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    user.click(screen.getByRole('button', { name: 'Clear completed' }));

    expect(screen.queryByTestId('list-todo')).not.toBeInTheDocument();
  });

  it('should remove a todo', async () => {
    const store = makeStore({ filter: 'active' });

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await expect(
      screen.findByText('Establish a healthy work-life balance'),
    ).resolves.toBeInTheDocument();

    user.click(
      within(
        screen.getByTestId('todo-9ceec59a-f95c-4017-9de7-507e11034414'),
      ).getByRole('button', {
        name: 'Remove',
      }),
    );

    expect(screen.queryByText('Just do it')).not.toBeInTheDocument();
  });

  it('should paginate the list', async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.queryByRole('alert'));

    user.click(
      within(screen.getByRole('navigation')).getByRole('button', { name: '2' }),
    );

    await waitFor(() =>
      expect(
        within(screen.getByRole('navigation')).getByRole('button', {
          name: '2',
        }),
      ).toBeDisabled(),
    );
  });
});
