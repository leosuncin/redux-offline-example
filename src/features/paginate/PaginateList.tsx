import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAll } from '../todo/todoSlice';
import { selectCurrentPage, selectPages, selectTotal } from './paginateSlice';

function PaginateList() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(selectCurrentPage);
  const total = useAppSelector(selectTotal);
  const pages = useAppSelector(selectPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < Math.ceil(total / 10);

  function goToPage(page: number) {
    return () => {
      void dispatch(fetchAll(page));
    };
  }

  if (pages < 2) return null;

  return (
    <nav aria-label="Todos navigation">
      <ul className="pagination justify-content-center mt-2">
        <li className={hasPrevious ? 'page-item' : 'page-item disabled'}>
          <button
            type="button"
            className="page-link"
            aria-label="Previous"
            disabled={!hasPrevious}
            onClick={goToPage(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {Array.from({ length: pages }, (_, index) => {
          const page = index + 1;
          const isCurrentPage = currentPage === page;

          return (
            <li
              key={page}
              className={isCurrentPage ? 'page-item active' : 'page-item'}
            >
              <button
                type="button"
                className="page-link"
                disabled={isCurrentPage}
                onClick={goToPage(page)}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li className={hasNext ? 'page-item' : 'page-item disabled'}>
          <button
            type="button"
            className="page-link"
            aria-label="Next"
            disabled={!hasNext}
            onClick={goToPage(currentPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default PaginateList;
