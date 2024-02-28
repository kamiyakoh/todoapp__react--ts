import { FC, ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { useComp } from '../useComp';
import { compState } from '../../states/compState';

interface Props {
  children: ReactNode;
}

describe('UseComp Test', () => {
  const initializeState = ({ set }: MutableSnapshot): void => {
    set(compState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  test('SetNewComp Test', () => {
    const { result } = renderHook(() => useComp(), {
      wrapper: TestWrapper,
    });

    const newComp = [
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
      result.current.setNewComp(newComp);
    });
    expect(result.current.comp).toEqual(newComp);
  });

  test('DeleteComp Test', () => {
    const { result } = renderHook(() => useComp(), {
      wrapper: TestWrapper,
    });

    const initComp = [
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
      result.current.setNewComp(initComp);
    });

    act(() => {
      result.current.delComp(1);
    });

    expect(result.current.comp).toEqual([
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
