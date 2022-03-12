import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeFilter, Filter, selectFilter } from './filterSlice';

function FilterBy() {
  const filter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  function handleChangeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(changeFilter(event.currentTarget.value as Filter));
  }

  return (
    <fieldset className="btn-group" role="group">
      <legend className="visually-hidden">Filter by</legend>
      <input
        type="radio"
        className="btn-check"
        id="all"
        name="filter"
        value="all"
        checked={filter === 'all'}
        onChange={handleChangeFilter}
      />
      <label
        className={`btn ${
          filter === 'all' ? 'btn-dark' : 'btn-outline-secondary'
        }`}
        htmlFor="all"
      >
        All
      </label>

      <input
        type="radio"
        className="btn-check"
        id="active"
        name="filter"
        value="active"
        checked={filter === 'active'}
        onChange={handleChangeFilter}
      />
      <label
        className={`btn ${
          filter === 'active' ? 'btn-dark' : 'btn-outline-secondary'
        }`}
        htmlFor="active"
      >
        Active
      </label>

      <input
        type="radio"
        className="btn-check"
        id="completed"
        name="filter"
        value="completed"
        checked={filter === 'completed'}
        onChange={handleChangeFilter}
      />
      <label
        className={`btn ${
          filter === 'completed' ? 'btn-dark' : 'btn-outline-secondary'
        }`}
        htmlFor="completed"
      >
        Completed
      </label>
    </fieldset>
  );
}

export default FilterBy;
