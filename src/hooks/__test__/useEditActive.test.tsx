import { FC, ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { activeState } from '../../states/activeState';
import { useEditActive } from '../useEditActive';

interface Props {
  children: ReactNode;
}

const mockedNavigator = jest.fn();
/* eslint-disable */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));
/* eslint-enable */

describe('UseEditActive Test', () => {
  const boardId = 0;
  const mockActive = [
    {
      id: 0,
      title: 'Active0',
      tasks: [
        { taskNum: 0, value: 'Task0', checked: true },
        { taskNum: 1, value: 'Task1', checked: true },
        { taskNum: 2, value: 'Task2', checked: false },
      ],
    },
    {
      id: 1,
      title: 'Active1',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: false },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
  ];

  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, mockActive);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  beforeEach(() => {
    const { result } = renderHook(() => useEditActive(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActive(mockActive);
    });
  });

  afterAll(() => {
    const { result } = renderHook(() => useEditActive(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActive([]);
    });
  });

  test('init values test', () => {
    const { result } = renderHook(() => useEditActive(boardId), {
      wrapper: TestWrapper,
    });

    expect(result.current.board.title).toBe('Active0');
    expect(result.current.board.tasks.length).toBe(3);
    expect(result.current.board.tasks[0].value).toBe('Task0');
    expect(result.current.board.tasks[0].checked).toBe(true);
  });

  test('onSubmit success test', () => {
    const { result } = renderHook(() => useEditActive(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.onSubmit({
        title: 'EditedTitle',
        tasks: [{ value: 'EditedTask' }, { value: 'Task1' }],
      });
    });

    expect(result.current.board.title).toBe('EditedTitle');
    expect(result.current.board.tasks.length).toBe(2);
    expect(result.current.board.tasks[0].value).toBe('EditedTask');
    expect(result.current.board.tasks[0].checked).toBe(false);
    expect(result.current.board.tasks[1].value).toBe('Task1');
    expect(result.current.board.tasks[1].checked).toBe(true);
  });

  test('onSubmit error test', () => {
    const { result } = renderHook(() => useEditActive(boardId), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.onSubmit({
        title: 'EditedTitle',
        tasks: [{ value: '' }],
      });
    });
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual(mockActive);
  });
});
