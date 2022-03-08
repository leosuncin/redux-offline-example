import { useAppDispatch } from '../../app/hooks';
import { addTodo } from './todoSlice';

function CreateTodo() {
  const dispatch = useAppDispatch();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const task = (
      event.currentTarget.elements.namedItem('task') as HTMLInputElement
    ).value;

    dispatch(addTodo(task));
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          name="task"
          className="form-control"
          aria-describedby="task-helper"
          aria-label="Task"
          required
        />
        <span id="task-helper" className="form-text">
          Add something to do
        </span>
      </div>

      <button type="submit" className="btn btn-primary">
        Add task
      </button>
    </form>
  );
}

export default CreateTodo;
