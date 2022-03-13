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

import { store } from './app/store';
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
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The list of tasks will be shown here',
    );
  });

  it('should add a task', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    user.type(screen.getByLabelText('Task'), 'Buy milk');
    user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('should toggle a todo', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Mark done' }),
    ).not.toBeChecked();

    user.click(screen.getByRole('checkbox', { name: 'Mark done' }));

    expect(
      screen.getByRole('checkbox', { name: 'Mark pending' }),
    ).toBeChecked();
  });

  it('should edit a todo', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    user.click(
      within(screen.getByRole('group', { name: 'Actions' })).getByRole(
        'button',
        {
          name: 'Edit',
        },
      ),
    );

    user.type(
      screen.getByLabelText('Change task'),
      '{selectall}Buy ice cream{enter}',
    );

    expect(screen.getByText('Buy ice cream')).toBeInTheDocument();
  });

  it('should switch the filter', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    user.click(screen.getByLabelText('Active'));

    expect(screen.getByRole('alert')).toBeVisible();

    user.click(screen.getByLabelText('Completed'));

    expect(
      within(screen.getByTestId('list-todo')).getAllByRole('listitem'),
    ).toHaveLength(1);
  });

  it('should clear completed', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    user.click(screen.getByRole('button', { name: 'Clear completed' }));

    expect(screen.queryByTestId('list-todo')).not.toBeInTheDocument();
  });

  it('should remove a todo', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.getByRole('alert'));

    expect(screen.queryByText('Just do it')).toBeInTheDocument();

    user.click(
      within(screen.getByRole('group', { name: 'Actions' })).getByRole(
        'button',
        {
          name: 'Remove',
        },
      ),
    );

    expect(screen.queryByText('Just do it')).not.toBeInTheDocument();
  });

  it('should paginate the list', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    await waitForElementToBeRemoved(screen.getByRole('alert'));

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
