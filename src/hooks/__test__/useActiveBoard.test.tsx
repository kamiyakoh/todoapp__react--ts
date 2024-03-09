import { act, renderHook } from '@testing-library/react';
import { useActiveBoard } from '../useActiveBoard';
import { FC, ReactNode } from 'react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { activeState } from '../../states/activeState';
import { compState } from '../../states/compState';
import { trashActiveState } from '../../states/trashActiveState';
import { useActive } from '../useActive';
import { useComp } from '../useComp';
import { useTrashActive } from '../useTrashActive';

jest.mock('../../utils/customToast');

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
  const setNewActiveMock = jest.spyOn(useActive(), 'setNewActive');
  const setNewCompMock = jest.spyOn(useComp(), 'setNewComp');
  const setNewTrashActiveMock = jest.spyOn(useTrashActive(), 'setNewTrashActive');

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
    jest.mock('../useActive', () => ({
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
    }));
    jest.mock('../useTrashActive', () => ({
      useActive: jest.fn().mockReturnValue({
        trashActive: mockTrashActive,
        setNewTrashActive: jest.fn(),
      }),
    }));
  });

  // Test the useActiveBoard hook
  test('should handle checkbox change', () => {
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });
    const mockInput = jest.fn(() => ({
      target: { checked: true },
    })) as unknown as () => React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockInput(), 1);
    });

    expect(setNewActiveMock).toHaveBeenCalledWith([
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
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.trash();
    });

    expect(setNewTrashActiveMock).toHaveBeenCalledWith([
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
    expect(setNewActiveMock).toHaveBeenCalledWith([
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
    const { result } = renderHook(() => useActiveBoard(boardId), {
      wrapper: TestWrapper,
    });
    const mockInput = jest.fn() as unknown as () => React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.onSubmit(mockInput());
    });

    expect(setNewCompMock).toHaveBeenCalledWith([
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
    expect(setNewActiveMock).toHaveBeenCalledWith([
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
