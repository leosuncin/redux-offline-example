import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore, { MockGetState } from 'redux-mock-store';

import type { RootState } from '../../app/store';
import FilterBy from './FilterBy';
import filterSlice from './filterSlice';

describe('<FilterBy />', () => {
  const mockStore = configureStore<RootState>();
  const getState: MockGetState<RootState> = (actions) => {
    return {
      todo: {
        ids: [],
        entities: {},
      },
      [filterSlice.name]: actions.reduce(
        (state, action) => filterSlice.reducer(state, action),
        filterSlice.getInitialState(),
      ),
    };
  };

  it('should change the filter', () => {
    const store = mockStore(getState);

    render(
      <Provider store={store}>
        <FilterBy />
      </Provider>,
    );

    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked();

    user.click(screen.getByLabelText('Active'));

    expect(store.getActions().at(-1)).toHaveProperty('payload', 'active');
    expect(screen.getByRole('radio', { name: 'Active' })).toBeChecked();

    user.click(screen.getByLabelText('Completed'));

    expect(store.getActions().at(-1)).toHaveProperty('payload', 'completed');
    expect(screen.getByRole('radio', { name: 'Completed' })).toBeChecked();
  });
});
