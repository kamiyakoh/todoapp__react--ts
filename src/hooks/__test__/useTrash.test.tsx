import { renderHook, act, waitFor } from '@testing-library/react';
import { useTrash } from '../useTrash';

import * as actualCustomToastModule from '../../utils/customToast';

// window.confirmをモック化する
const mockConfirm = jest.fn(() => true);
window.confirm = mockConfirm;

// window.alertをモック化する
const mockAlert = jest.fn();
window.alert = mockAlert;

jest.mock('../../utils/customToast');
const customToastModule = actualCustomToastModule as jest.Mocked<typeof actualCustomToastModule>;

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
  const spyToastCustom = jest.spyOn(customToastModule, 'toastCustom');

  test('AllDel success Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));
    mockConfirm.mockReturnValueOnce(true);

    act(() => {
      result.current.allDel();
    });

    expect(mockConfirm).toHaveBeenCalledWith('ゴミ箱内を全て破棄しますか？');
    expect(setTrashMock).toHaveBeenCalledWith([]);
    expect(result.current.trashCount).toBe(0);
    expect(spyToastCustom).toBeCalledWith('ゴミ箱内を全て破棄しました', '💥');
  });

  test('AllDel ComfirmCancel Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));
    mockConfirm.mockReturnValueOnce(false);

    act(() => {
      result.current.handleToggle(0);
      result.current.allDel();
    });

    expect(mockConfirm).toHaveBeenCalledWith('ゴミ箱内を全て破棄しますか？');
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

    expect(mockConfirm).toHaveBeenCalledWith('ゴミ箱から2件を完全に破棄しますか？');
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
    expect(spyToastCustom).toBeCalledWith(`ゴミ箱から2件を完全破棄しました`, '💥');
  });

  test('Dels Nochecked Alert Test', () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));

    act(() => {
      result.current.dels();
    });

    expect(mockConfirm).not.toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith('まとめて破棄する黒板を選択してボタンを押してください');
    expect(mockConfirm).not.toHaveBeenCalled();
    expect(setTrashMock).not.toHaveBeenCalled();
  });

  test('Dels ComfirmCancel Test', async () => {
    const { result } = renderHook(() => useTrash(trashBoards, setTrashMock));

    mockConfirm.mockReturnValueOnce(false);

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

    expect(mockConfirm).toHaveBeenCalledWith('ゴミ箱から2件を完全に破棄しますか？');
    expect(setTrashMock).not.toHaveBeenCalled();
    expect(result.current.trashCount).toBe(2);
    expect(mockAlert).not.toHaveBeenCalled();
  });
});
