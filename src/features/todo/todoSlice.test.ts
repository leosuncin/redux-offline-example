import todoSlice, {
  addTodo,
  removeTodo,
  selectTodos,
  Todo,
  TodoSliceState,
  updateTodo,
} from './todoSlice';

describe('Todo slice', () => {
  it('should add one todo', () => {
    const dispatch = jest.fn();

    addTodo('just do it')(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalled();
    const [pendingAction] = dispatch.mock.calls.flat();

    const nextState = todoSlice.reducer(
      todoSlice.getInitialState(),
      pendingAction,
    );
    const todos = selectTodos({
      [todoSlice.name]: nextState,
      filter: 'all',
      paginate: { currentPage: 1, total: 0 },
    });

    expect(todos).toHaveLength(1);
    expect(todos[0]).toMatchObject<Todo>({
      id: expect.any(String),
      task: 'just do it',
      completed: false,
    });
  });

  it('should update one todo', () => {
    const initialState: TodoSliceState = {
      ids: ['a'],
      entities: {
        a: {
          id: 'a',
          task: 'make a sandwich',
          completed: false,
        },
      },
    };
    const dispatch = jest.fn();

    updateTodo({ id: 'a', changes: { completed: true } })(
      dispatch,
      () => ({ [todoSlice.name]: initialState }),
      undefined,
    );
    const [pendingAction] = dispatch.mock.calls.flat();

    const nextState = todoSlice.reducer(initialState, pendingAction);
    const todos = selectTodos({
      [todoSlice.name]: nextState,
      filter: 'all',
      paginate: { currentPage: 1, total: 0 },
    });

    expect(todos).toHaveLength(1);
    expect(todos[0]).toHaveProperty('completed', true);
  });

  it('should remove one todo', () => {
    const initialState: TodoSliceState = {
      ids: ['a', 'b'],
      entities: {
        a: {
          id: 'a',
          task: 'make a sandwich',
          completed: false,
        },
        b: {
          id: 'b',
          task: 'make a salad',
          completed: true,
        },
      },
    };
    const nextState = todoSlice.reducer(initialState, removeTodo('b'));
    const todos = selectTodos({
      [todoSlice.name]: nextState,
      filter: 'all',
      paginate: { currentPage: 1, total: 0 },
    });

    expect(todos).toHaveLength(1);
    expect(todos.findIndex((todo) => todo.id === 'b')).toBe(-1);
  });
});
