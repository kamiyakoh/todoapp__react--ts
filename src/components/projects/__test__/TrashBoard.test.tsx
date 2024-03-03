import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrashBoard } from '../TrashBoard';
import { TodoData } from '../../../types';

// useTrashBoardModule を import する前に実際のモジュールをインポートする
import * as actualUseTrashBoardModule from '../../../hooks/useTrashBoard';

jest.mock('../../../hooks/useTrashBoard');
const useTrashBoardModule = actualUseTrashBoardModule as jest.Mocked<typeof actualUseTrashBoardModule>;

describe('TrashBoard Test', () => {
  const spy = jest.spyOn(useTrashBoardModule, 'useTrashBoard').mockReturnValue({
    board: {
      id: 0,
      title: 'Todo List1',
      tasks: [
        { taskNum: 0, value: 'Task1', checked: false },
        { taskNum: 1, value: 'Task2', checked: false },
      ],
    },
    title: 'Todo List1',
    onClickDel: jest.fn(),
    takeOut: jest.fn(),
  });

  beforeEach(() => {
    jest.spyOn(useTrashBoardModule, 'useTrashBoard').mockReturnValue({
      board: {
        id: 0,
        title: 'Todo List1',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task2', checked: false },
        ],
      },
      title: 'Todo List1',
      onClickDel: jest.fn(),
      takeOut: jest.fn(),
    });
  });

  test('renders correctly with the provided props', () => {
    const props = {
      isActive: true,
      distArr: [] as TodoData[],
      trashArr: [
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
      ],
      boardId: 0,
      setDist: jest.fn(),
      setTrash: jest.fn(),
    };

    const { getByText } = render(<TrashBoard {...props} />);

    expect(getByText('Todo List1')).toBeInTheDocument();
    expect(getByText('戻す')).toBeInTheDocument();
    expect(getByText('破棄')).toBeInTheDocument();
  });

  test('calls takeOut function when 戻す button is clicked', async () => {
    const props = {
      isActive: true,
      distArr: [] as TodoData[],
      trashArr: [
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
      ],
      boardId: 0,
      setDist: jest.fn(),
      setTrash: jest.fn(),
    };

    const { getByText } = render(<TrashBoard {...props} />);

    await userEvent.click(getByText('戻す'));
    expect(spy.mock.results[0].value.takeOut).toHaveBeenCalled(); // eslint-disable-line
  });

  test('calls onClickDel function when 破棄 button is clicked', async () => {
    const props = {
      isActive: true,
      distArr: [] as TodoData[],
      trashArr: [
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
      ],
      boardId: 0,
      setDist: jest.fn(),
      setTrash: jest.fn(),
    };

    const { getByText } = render(<TrashBoard {...props} />);

    await userEvent.click(getByText('破棄'));
    expect(spy.mock.results[0].value.onClickDel).toHaveBeenCalled(); // eslint-disable-line
  });
});
