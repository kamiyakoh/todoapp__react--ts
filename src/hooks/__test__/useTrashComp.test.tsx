import { FC, ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { useComp } from '../useComp';
import { trashCompState } from '../../states/trashCompState';

interface Props {
  children: ReactNode;
}

describe('UseTrashAcive Test', () => {
  const initializeState = ({ set }: MutableSnapshot): void => {
    set(trashCompState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  test('SetNewTrashComp', () => {
    const { result } = renderHook(() => useComp(), {
      wrapper: TestWrapper,
    });

    const newTrashComp = [
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
      result.current.setNewComp(newTrashComp);
    });
    expect(result.current.comp).toEqual(newTrashComp);
  });
});
