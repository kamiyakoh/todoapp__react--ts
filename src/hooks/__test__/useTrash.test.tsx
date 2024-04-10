import { renderHook, act, waitFor } from '@testing-library/react';
import { useTrash } from '../useTrash';

// window.confirmをモック化する
const mockConfirm = jest.fn(() => true);
window.confirm = mockConfirm;

// window.alertをモック化する
const mockAlert = jest.fn();
window.alert = mockAlert;

describe('UseTrash Test', () => {
  const setTrashMock = jest.fn();
  const trashBoards = [
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
      title: 'Todo List2',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: true },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
    {
      id: 2,
      title: '',
      tasks: [
        { taskNum: 0, value: 'TaskX', checked: false },
        { taskNum: 1, value: 'TaskY', checked: false },
      ],
    },
  ];

  test('AllDel Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));
    mockConfirm.mockReturnValueOnce(true);

    act(() => {
      result.current.allDel();
    });

    expect(setTrashMock).toHaveBeenCalledWith([]);
    expect(result.current.trashCount).toBe(0);
  });

  test('AllDel ComfirmCancel Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));
    mockConfirm.mockReturnValueOnce(false);

    act(() => {
      result.current.handleToggle(0);
      result.current.allDel();
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(setTrashMock).not.toHaveBeenCalled();
    expect(result.current.trashCount).toBe(1);
  });

  test('Dels success test', async () => {
    const setTrashMock = jest.fn();
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));
    mockConfirm.mockReturnValueOnce(true);

    await act(async () => {
      await waitFor(() => {
        result.current.handleToggle(0);
      });
    });

    expect(result.current.trashCount).toBe(1);

    await act(async () => {
      await waitFor(() => {
        result.current.handleToggle(2);
      });
    });

    expect(result.current.trashCount).toBe(2);

    await act(async () => {
      await waitFor(() => {
        result.current.dels();
      });
    });

    expect(setTrashMock).toHaveBeenCalledWith([
      {
        id: 0,
        title: 'Todo List2',
        tasks: [
          { taskNum: 0, value: 'TaskA', checked: true },
          { taskNum: 1, value: 'TaskB', checked: false },
        ],
      },
    ]);
    expect(result.current.trashCount).toBe(0);
    expect(mockAlert).not.toHaveBeenCalled();
  });

  test('Dels Nochecked Alert Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));

    act(() => {
      result.current.dels();
    });

    expect(mockAlert).toHaveBeenCalledWith('まとめて破棄する黒板を選択してボタンを押してください');
    expect(mockConfirm).not.toHaveBeenCalled();
    expect(setTrashMock).not.toHaveBeenCalled();
  });

  test('Dels ComfirmCancel Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));

    mockConfirm.mockReturnValueOnce(false);

    act(() => {
      result.current.handleToggle(0);
      result.current.dels();
    });

    expect(mockConfirm).not.toHaveBeenCalled();
    expect(setTrashMock).not.toHaveBeenCalled();
    expect(result.current.trashCount).toBe(1);
    expect(mockAlert).toHaveBeenCalled();
  });
});
