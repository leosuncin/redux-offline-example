import { useAppSelector } from '../../app/hooks';
import { selectTodos } from './todoSlice';
import { selectTotal } from '../paginate/paginateSlice';

function ShowingTodo() {
  const total = useAppSelector(selectTotal);
  const current = useAppSelector(selectTodos).length;

  if (total === 0) return <p>0 tasks</p>;

  return (
    <p>
      Showing {current} of {total} tasks
    </p>
  );
}

export default ShowingTodo;
