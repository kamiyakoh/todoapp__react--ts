import { act, renderHook, render } from '@testing-library/react';
import { useActiveBoard } from '../useActiveBoard';
import { FC, ReactNode } from 'react';
import Recoil, { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE, selector, atom } from 'recoil';
import { activeState } from '../../states/activeState';
import { compState } from '../../states/compState';
import { trashActiveState } from '../../states/trashActiveState';
import { useActive } from '../useActive';
import { useComp } from '../useComp';
import { useTrashActive } from '../useTrashActive';

jest.mock('../../utils/customToast');
const multipliedState = selector({
  key: 'MultipliedActive',
  get: ({ get }) => get(activeState),
});
snapshot_UNSTABLE().getLoadable(multipliedState).valueOrThrow();

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

  /* const setNewActiveMock = jest.spyOn(useActive(), 'setNewActive');
  const setNewCompMock = jest.spyOn(useComp(), 'setNewComp');
  const setNewTrashActiveMock = jest.spyOn(useTrashActive(), 'setNewTrashActive'); */
  interface Props {
    children: ReactNode;
  }

  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, []);
    set(compState, []);
    set(trashActiveState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  beforeEach(() => {
    /* const setRecoilState = jest.fn();
    jest.spyOn(Recoil, 'useRecoilState').mockReturnValue([[], setRecoilState]); */
    jest.mock('recoil', () => ({
      useRecoilState: jest.fn().mockReturnValue(() => [[], jest.fn()]),
    }));
    /* jest.mock('../useActive', () => ({
      useActive: jest.fn().mockReturnValue({
        active: mockActive,
        setNewActive: jest.fn(),
        delActive: jest.fn(),
      }),
    }));
    jest.mock('../useComp', () => ({
      useActive: jest.fn().mockReturnValue({
        comp: mockComp,
        setNewComp: jest.fn(),
      }),
    })); */
    jest.mock('../useTrashActive', () => ({
      useTrashActive: jest.fn().mockReturnValue({
        trashActive: mockTrashActive,
        setNewTrashActive: jest.fn(),
      }),
    }));
  });

  // Test the useActiveBoard hook
  test('should handle checkbox change', () => {
    renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });
    const mockInput = jest.fn(() => ({
      target: { checked: true },
    })) as unknown as () => React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockInput(), 1);
    });

    expect(useActive().setNewActive).toHaveBeenCalledWith([
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
          { taskNum: 1, value: 'TaskB', checked: true },
        ],
      },
    ]);
  });

  test('Trash action', () => {
    renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });
    renderHook(() => useTrashActive(), {
      wrapper: TestWrapper,
    });
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.trash();
    });

    expect(useTrashActive().setNewTrashActive).toHaveBeenCalledWith([
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
    expect(useActive().setNewActive).toHaveBeenCalledWith([
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

  test('Submit action', () => {
    renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });
    renderHook(() => useComp(), {
      wrapper: TestWrapper,
    });
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });
    const mockInput = jest.fn(() => ({
      preventDefault: jest.fn(),
    })) as unknown as () => React.FormEvent<HTMLFormElement>;
    jest.mock('recoil', () => ({
      useRecoilState: jest.fn().mockReturnValue(() => [[], jest.fn()]),
    }));
    const spy = jest.spyOn(useComp(), 'setNewComp').mockImplementation(() => jest.fn());

    act(() => {
      result.current.onSubmit(mockInput());
    });

    expect(spy).toHaveBeenCalledWith([
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
    expect(useActive().setNewActive).toHaveBeenCalledWith([
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
