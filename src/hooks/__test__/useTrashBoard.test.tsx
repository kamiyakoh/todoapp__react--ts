import { renderHook, act } from '@testing-library/react';
import { useTrashBoard } from '../useTrashBoard';

describe('useTrashBoard Test', () => {
  const distArrMock = [
    {
      id: 0,
      title: 'Todo ListA',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: false },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
  ];
  const trashArrMock = [
    {
      id: 0,
      title: 'Todo List1',
      tasks: [
        { taskNum: 0, value: 'Task1', checked: false },
        { taskNum: 1, value: 'Task2', checked: false },
      ],
    },
    {
      id: 1,
      title: '',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: false },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
  ];
  const boardIdMock = 0;

  test('returns the correct initial values', () => {
    const { result } = renderHook(() => useTrashBoard(distArrMock, trashArrMock, boardIdMock, jest.fn(), jest.fn()));

    expect(result.current.board).toEqual({
      id: 0,
      title: 'Todo List1',
      tasks: [
        { taskNum: 0, value: 'Task1', checked: false },
        { taskNum: 1, value: 'Task2', checked: false },
      ],
    });
    expect(result.current.title).toBe('Todo List1');
  });

  test('onClickDel deletes the board and shows toast if confirmed', () => {
    window.confirm = jest.fn(() => true);
    const setTrashMock = jest.fn();
    const { result } = renderHook(() => useTrashBoard(distArrMock, trashArrMock, boardIdMock, jest.fn(), setTrashMock));

    act(() => {
      result.current.onClickDel();
    });

    expect(setTrashMock).toHaveBeenCalledWith([
      {
        id: 0,
        title: '',
        tasks: [
          { taskNum: 0, value: 'TaskA', checked: false },
          { taskNum: 1, value: 'TaskB', checked: false },
        ],
      },
    ]);

    expect(window.confirm).toHaveBeenCalledWith('完全に破棄しますか？');
  });

  test('onClickDel does nothing if cancel is clicked', () => {
    window.confirm = jest.fn(() => false);
    const setTrashMock = jest.fn();
    const { result } = renderHook(() => useTrashBoard(distArrMock, trashArrMock, boardIdMock, jest.fn(), setTrashMock));

    act(() => {
      result.current.onClickDel();
    });

    expect(setTrashMock).not.toHaveBeenCalled();
  });

  test('takeOut moves the board to distArr and shows success toast', () => {
    const setDistMock = jest.fn();
    const setTrashMock = jest.fn();

    const { result } = renderHook(() =>
      useTrashBoard(distArrMock, trashArrMock, boardIdMock, setDistMock, setTrashMock)
    );

    act(() => {
      result.current.takeOut();
    });

    expect(setDistMock).toHaveBeenCalledWith([
      ...distArrMock,
      {
        id: distArrMock.length,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task2', checked: false },
        ],
      },
    ]);
    expect(setTrashMock).toHaveBeenCalledWith([
      {
        id: 0,
        title: '',
        tasks: [
          { taskNum: 0, value: 'TaskA', checked: false },
          { taskNum: 1, value: 'TaskB', checked: false },
        ],
      },
    ]);
  });
});
