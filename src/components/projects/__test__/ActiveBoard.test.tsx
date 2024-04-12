import { FC, ReactNode } from 'react';
import { render, renderHook, act, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { ActiveBoard } from '../ActiveBoard';
import { useActiveBoard } from '../../../hooks/useActiveBoard';
import { activeState } from '../../../states/activeState';
import { compState } from '../../../states/compState';
import { trashActiveState } from '../../../states/trashActiveState';
import { useActive } from '../../../hooks/useActive';
import { useComp } from '../../../hooks/useComp';
import { useTrashActive } from '../../../hooks/useTrashActive';

interface Props {
  children: ReactNode;
}

describe('Activeboard Test', () => {
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
        { taskNum: 0, value: 'Comp1', checked: true },
        { taskNum: 1, value: 'Comp2', checked: true },
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

  test('render', () => {
    // テストするコンポーネントをレンダリング
    const { getByText } = render(
      <BrowserRouter>
        <RecoilRoot initializeState={initializeState}>
          <ActiveBoard boardId={boardId} />
        </RecoilRoot>
      </BrowserRouter>
    );

    // タイトルとタスクが表示されていることを確認
    expect(getByText('Todo List1')).toBeInTheDocument();
    expect(getByText('Task1')).toBeInTheDocument();
    expect(getByText('Task2')).toBeInTheDocument();
  });

  test('trashButton Test', () => {
    // テストするコンポーネントをレンダリング
    const { getByText } = render(
      <BrowserRouter>
        <RecoilRoot initializeState={initializeState}>
          <ActiveBoard boardId={boardId} />
        </RecoilRoot>
      </BrowserRouter>
    );

    // 削除ボタンをクリック
    fireEvent.click(getByText('削除'));
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
  });

  test('checkbox-allchekced -> show submitButton Test', () => {
    // テストするコンポーネントをレンダリング
    render(
      <BrowserRouter>
        <RecoilRoot initializeState={initializeState}>
          <ActiveBoard boardId={boardId} />
        </RecoilRoot>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByDisplayValue('Task1'));
    fireEvent.click(screen.getByDisplayValue('Task2'));
    fireEvent.click(screen.getByText('完了'));
    const snapshot = snapshot_UNSTABLE();

    expect(snapshot.getLoadable(compState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'Comp List1',
        tasks: [
          { taskNum: 0, value: 'Comp1', checked: true },
          { taskNum: 1, value: 'Comp2', checked: true },
        ],
      },
      {
        id: 1,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: true },
          { taskNum: 1, value: 'Task2', checked: true },
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
  });

  test('EditButton links navigate', () => {
    // テストするコンポーネントをレンダリング
    const { getByText } = render(
      <BrowserRouter>
        <RecoilRoot initializeState={initializeState}>
          <ActiveBoard boardId={boardId} />
        </RecoilRoot>
      </BrowserRouter>
    );

    // 変種ボタンをクリック
    fireEvent.click(getByText('編集'));

    expect(window.location.pathname).toBe(`/active/${boardId}`);
  });
});
