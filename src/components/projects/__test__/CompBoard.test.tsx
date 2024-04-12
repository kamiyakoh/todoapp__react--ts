import { FC, ReactNode } from 'react';
import { render, renderHook, act, fireEvent } from '@testing-library/react';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { CompBoard } from '../CompBoard';
import { useCompBoard } from '../../../hooks/useCompBoard';
import { compState } from '../../../states/compState';
import { useComp } from '../../../hooks/useComp';
import { useTrashComp } from '../../../hooks/useTrashComp';
import { trashCompState } from '../../../states/trashCompState';

interface Props {
  children: ReactNode;
}

describe('Compboard Test', () => {
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

  it('render', () => {
    // テストするコンポーネントをレンダリング
    const { getByText } = render(
      <RecoilRoot>
        <CompBoard boardId={boardId} />
      </RecoilRoot>
    );

    // タイトルとタスクが表示されていることを確認
    expect(getByText('Comp List1')).toBeInTheDocument();
    expect(getByText('Comp1')).toBeInTheDocument();
    expect(getByText('Comp2')).toBeInTheDocument();
  });

  test('trashButton Test', () => {
    // テストするコンポーネントをレンダリング
    const { getByText } = render(
      <RecoilRoot>
        <CompBoard boardId={boardId} />
      </RecoilRoot>
    );

    // 削除ボタンをクリック
    fireEvent.click(getByText('削除'));
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
  });
});
