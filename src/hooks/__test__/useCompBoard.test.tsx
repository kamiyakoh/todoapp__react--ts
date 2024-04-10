import { act, renderHook } from '@testing-library/react';
import { useCompBoard } from '../useCompBoard';
import { FC, ReactNode } from 'react';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { compState } from '../../states/compState';
import { trashCompState } from '../../states/trashCompState';
import { useComp } from '../useComp';
import { useTrashComp } from '../useTrashComp';
import * as actualCustomToastModule from '../../utils/customToast';

jest.mock('../../utils/customToast');
const customToastModule = actualCustomToastModule as jest.Mocked<typeof actualCustomToastModule>;

describe('useActiveBoard Hook', () => {
  const boardId = 0;
  const mockComp = [
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
      title: '',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: false },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
  ];
  const mockTrashComp = [
    {
      id: 0,
      title: 'TrashComp List1',
      tasks: [
        { taskNum: 0, value: 'Trash1', checked: false },
        { taskNum: 1, value: 'Trash2', checked: false },
      ],
    },
  ];
  const spyToastCustom = jest.spyOn(customToastModule, 'toastCustom');
  interface Props {
    children: ReactNode;
  }

  const initializeState = ({ set }: MutableSnapshot): void => {
    set(compState, []);
    set(trashCompState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  renderHook(() => useComp(), {
    wrapper: TestWrapper,
  });
  renderHook(() => useTrashComp(), {
    wrapper: TestWrapper,
  });

  beforeEach(() => {
    const { result } = renderHook(() => useCompBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewCompTrashC(mockComp, mockTrashComp);
    });
  });

  afterAll(() => {
    const { result } = renderHook(() => useCompBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewCompTrashC([], []);
    });
  });

  test('Trash action', () => {
    const { result } = renderHook(() => useCompBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.trash();
    });
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(trashCompState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'TrashComp List1',
        tasks: [
          { taskNum: 0, value: 'Trash1', checked: false },
          { taskNum: 1, value: 'Trash2', checked: false },
        ],
      },
      {
        id: 1,
        title: 'Comp List1',
        tasks: [
          { taskNum: 0, value: 'Comp1', checked: false },
          { taskNum: 1, value: 'Comp2', checked: false },
        ],
      },
    ]);
    expect(snapshot.getLoadable(compState).valueOrThrow()).toStrictEqual([
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
});
