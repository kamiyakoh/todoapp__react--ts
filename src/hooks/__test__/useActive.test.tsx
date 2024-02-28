import { FC, ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { useActive } from '../useActive';
import { activeState } from '../../states/activeState';

interface Props {
  children: ReactNode;
}

describe('UseActive Test', () => {
  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  test('SetNewActive Test', () => {
    const { result } = renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });

    const newActive = [
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

    act(() => {
      result.current.setNewActive(newActive);
    });
    expect(result.current.active).toEqual(newActive);
  });

  test('DeleteActive Test', () => {
    const { result } = renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });

    const initActive = [
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
      {
        id: 2,
        title: 'Todo ListA',
        tasks: [
          { taskNum: 0, value: 'TaskAlpha', checked: false },
          { taskNum: 1, value: 'TaskBeta', checked: false },
        ],
      },
    ];

    act(() => {
      result.current.setNewActive(initActive);
    });

    act(() => {
      result.current.delActive(1);
    });

    expect(result.current.active).toEqual([
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
        title: 'Todo ListA',
        tasks: [
          { taskNum: 0, value: 'TaskAlpha', checked: false },
          { taskNum: 1, value: 'TaskBeta', checked: false },
        ],
      },
    ]);
  });
});
