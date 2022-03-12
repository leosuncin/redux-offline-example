import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearCompleted, selectCountCompleted } from './todoSlice';

function ClearCompletedTodo() {
  const dispatch = useAppDispatch();
  const completed = useAppSelector(selectCountCompleted);
  const classes = completed > 0 ? 'btn btn-warning' : 'btn btn-light';

  return (
    <button
      type="submit"
      className={classes}
      disabled={completed === 0}
      onClick={() => {
        dispatch(clearCompleted());
      }}
    >
      Clear completed
    </button>
  );
}

export default ClearCompletedTodo;
