import { act, renderHook } from '@testing-library/react';
import { useActiveBoard } from '../useActiveBoard';
import { FC, ReactNode } from 'react';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { activeState } from '../../states/activeState';
import { compState } from '../../states/compState';
import { trashActiveState } from '../../states/trashActiveState';
import { useActive } from '../useActive';
import { useComp } from '../useComp';
import { useTrashActive } from '../useTrashActive';
import * as actualCustomToastModule from '../../utils/customToast';

jest.mock('../../utils/customToast');
const customToastModule = actualCustomToastModule as jest.Mocked<typeof actualCustomToastModule>;

describe('useActiveBoard Hook', () => {
  const boardId = 0;
  const mockActive = [
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
  const mockComp = [
    {
      id: 0,
      title: 'Comp List1',
      tasks: [
        { taskNum: 0, value: 'Comp1', checked: false },
        { taskNum: 1, value: 'Comp2', checked: false },
      ],
    },
  ];
  const mockTrashActive = [
    {
      id: 0,
      title: 'TrashActive List1',
      tasks: [
        { taskNum: 0, value: 'Trash1', checked: false },
        { taskNum: 1, value: 'Trash2', checked: false },
      ],
    },
  ];
  interface Props {
    children: ReactNode;
  }

  const spyToastCustom = jest.spyOn(customToastModule, 'toastCustom');
  const spyToastSuccess = jest.spyOn(customToastModule, 'toastSuccess');

  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, []);
    set(compState, []);
    set(trashActiveState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  renderHook(() => useActive(), {
    wrapper: TestWrapper,
  });
  renderHook(() => useComp(), {
    wrapper: TestWrapper,
  });
  renderHook(() => useTrashActive(), {
    wrapper: TestWrapper,
  });

  beforeEach(() => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActCompTrashA(mockActive, mockComp, mockTrashActive);
    });
  });

  afterAll(() => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActCompTrashA([], [], []);
    });
  });

  test('handle checkbox change', () => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.onChange(1);
    });
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task2', checked: true },
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
    ]);
  });

  test('Trash action', () => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.trash();
    });
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(trashActiveState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'TrashActive List1',
        tasks: [
          { taskNum: 0, value: 'Trash1', checked: false },
          { taskNum: 1, value: 'Trash2', checked: false },
        ],
      },
      {
        id: 1,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task2', checked: false },
        ],
      },
    ]);
    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: '',
        tasks: [
          { taskNum: 0, value: 'TaskA', checked: false },
          { taskNum: 1, value: 'TaskB', checked: false },
        ],
      },
    ]);
    expect(spyToastCustom).toBeCalledWith('ゴミ箱へ移動しました', '🚮');
  });

  test('Submit action', () => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });
    const mockInput = jest.fn(() => ({
      preventDefault: jest.fn(),
    })) as unknown as () => React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.onSubmit(mockInput());
    });
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(compState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'Comp List1',
        tasks: [
          { taskNum: 0, value: 'Comp1', checked: false },
          { taskNum: 1, value: 'Comp2', checked: false },
        ],
      },
      {
        id: 1,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task2', checked: false },
        ],
      },
    ]);
    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: '',
        tasks: [
          { taskNum: 0, value: 'TaskA', checked: false },
          { taskNum: 1, value: 'TaskB', checked: false },
        ],
      },
    ]);
    expect(spyToastSuccess).toBeCalledWith('完了おめでとう');
  });
});
