import { render, screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { store } from './app/store';
import App from './App';

describe('<App />', () => {
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
    user.click(screen.getByRole('button'));

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

  it('should remove a todo', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    user.click(
      within(screen.getByRole('group', { name: 'Actions' })).getByRole(
        'button',
        {
          name: 'Remove',
        },
      ),
    );

    expect(screen.queryByText('Buy ice cream')).not.toBeInTheDocument();
  });
});
