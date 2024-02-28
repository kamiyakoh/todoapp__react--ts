import { FC, ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { useActive } from '../useActive';
import { trashActiveState } from '../../states/trashActiveState';

interface Props {
  children: ReactNode;
}

describe('UseTrashAcive Test', () => {
  const initializeState = ({ set }: MutableSnapshot): void => {
    set(trashActiveState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  test('SetNewTrashActive', () => {
    const { result } = renderHook(() => useActive(), {
      wrapper: TestWrapper,
    });

    const newTrashActive = [
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
      result.current.setNewActive(newTrashActive);
    });
    expect(result.current.active).toEqual(newTrashActive);
  });
});
