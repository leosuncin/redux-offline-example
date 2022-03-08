import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Todo, removeTodo, selectTodos, updateTodo } from './todoSlice';

type ItemTodoProps = {
  isEditing: boolean;
  todo: Todo;
  toggleEdit: (todoId: Todo['id'] | undefined) => void;
};

function ItemTodo({ todo, isEditing, toggleEdit }: ItemTodoProps) {
  const dispatch = useAppDispatch();
  const Tag: keyof HTMLElementTagNameMap = todo.completed ? 's' : 'span';

  if (isEditing) {
    return (
      <form
        className="list-group-item list-group-action"
        data-testid={`todo-${todo.id}`}
        onSubmit={(event) => {
          event.preventDefault();
          const task = (
            event.currentTarget.elements.namedItem('task') as HTMLInputElement
          ).value;
          dispatch(updateTodo({ id: todo.id, changes: { task } }));
          event.currentTarget.reset();
        }}
        onReset={() => {
          toggleEdit(undefined);
        }}
      >
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <label htmlFor="task" className="col-form-label">
              Change task
            </label>
          </div>

          <div className="col">
            <input
              type="text"
              id="task"
              name="task"
              className="form-control"
              defaultValue={todo.task}
              required
            />
          </div>

          <div className="col-auto btn-group">
            <button type="submit" className="btn btn-success btn-sm">
              Save
            </button>
            <button type="reset" className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <li
      className="list-group-item d-flex justify-content-between"
      data-testid={`todo-${todo.id}`}
    >
      <input
        type="checkbox"
        className="form-check-input me-3"
        aria-label={todo.completed ? 'Mark pending' : 'Mark done'}
        aria-describedby={todo.id}
        checked={todo.completed}
        onChange={(event) => {
          const completed = event.currentTarget.checked;

          dispatch(updateTodo({ id: todo.id, changes: { completed } }));
        }}
      />

      <Tag className="text-start w-100" id={todo.id}>
        {todo.task}
      </Tag>

      <fieldset className="btn-group" role="group">
        <legend className="visually-hidden">Actions</legend>
        <button
          type="button"
          className="btn btn-info btn-sm"
          aria-describedby={todo.id}
          onClick={() => {
            toggleEdit(todo.id);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          aria-describedby={todo.id}
          onClick={() => {
            dispatch(removeTodo(todo.id));
          }}
        >
          Remove
        </button>
      </fieldset>
    </li>
  );
}

function ListTodo() {
  const todos = useAppSelector(selectTodos);
  const [edit, setEdit] = useState<Todo['id'] | undefined>();

  if (todos.length === 0)
    return (
      <div className="alert alert-secondary" role="alert">
        The list of tasks will be shown here
      </div>
    );

  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <ItemTodo
          key={todo.id}
          todo={todo}
          isEditing={todo.id === edit}
          toggleEdit={setEdit}
        />
      ))}
    </ul>
  );
}

export default ListTodo;
