import type { TodoData } from '../../../types';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Trash } from '../Trash';
import * as actualUseModalModule from '../../../hooks/useModal';
import * as actualUseTrashModule from '../../../hooks/useTrash';
import { useModal } from '../../../hooks/useModal';
import { useTrash } from '../../../hooks/useTrash';

jest.mock('../../../hooks/useModal');
jest.mock('../../../hooks/useTrash');

const props = {
  isActive: true,
  distArr: [] as TodoData[],
  setDist: jest.fn(),
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
      title: 'Todo List2',
      tasks: [
        { taskNum: 0, value: 'TaskA', checked: true },
        { taskNum: 1, value: 'TaskB', checked: false },
      ],
    },
    {
      id: 2,
      title: '',
      tasks: [
        { taskNum: 0, value: 'TaskX', checked: false },
        { taskNum: 1, value: 'TaskY', checked: false },
      ],
    },
  ],
  setTrash: jest.fn(),
};

describe('Trash--closedModal Test', () => {
  beforeEach(() => {
    jest.spyOn(actualUseTrashModule, 'useTrash').mockReturnValue({
      checkedIds: [],
      trashCount: 0,
      allDel: jest.fn(),
      handleToggle: jest.fn(),
      dels: jest.fn(),
    });

    jest.spyOn(actualUseModalModule, 'useModal').mockReturnValue({
      isOpen: false,
      isScale: false,
      isShow: false,
      openModal: jest.fn(),
      closeModal: jest.fn(),
    });
  });

  test('render--closedModal', () => {
    const { getByAltText, queryByText } = render(<Trash {...props} />);

    expect(getByAltText('trashbox')).toBeInTheDocument();
    expect(queryByText('ゴミ箱を空にする')).not.toBeInTheDocument();
    expect(queryByText('まとめて破棄')).not.toBeInTheDocument();
  });

  test('openModal Test', () => {
    const spyOpenModal = jest.spyOn(useModal(), 'openModal');
    const { getByAltText } = render(<Trash {...props} />);

    fireEvent.click(getByAltText('trashbox'));

    expect(spyOpenModal).toHaveBeenCalled();
  });
});

describe('Trash--openedModal Test', () => {
  beforeEach(() => {
    jest.spyOn(actualUseTrashModule, 'useTrash').mockReturnValue({
      checkedIds: [
        { id: 0, checked: true },
        { id: 1, checked: false },
        { id: 2, checked: false },
      ],
      trashCount: 1,
      allDel: jest.fn(),
      handleToggle: jest.fn(),
      dels: jest.fn(),
    });

    jest.spyOn(actualUseModalModule, 'useModal').mockReturnValue({
      isOpen: true,
      isScale: true,
      isShow: true,
      openModal: jest.fn(),
      closeModal: jest.fn(),
    });
  });

  test('render--openedModal Test', () => {
    const { queryByAltText, getByText } = render(<Trash {...props} />);

    expect(queryByAltText('trashbox')).not.toBeInTheDocument();
    expect(getByText('ゴミ箱を空にする')).toBeInTheDocument();
    expect(getByText('まとめて破棄')).toBeInTheDocument();
  });

  test('allDelButton Test', () => {
    const spyAllDel = jest.spyOn(useTrash([], jest.fn()), 'allDel');
    const { getByText } = render(<Trash {...props} />);

    fireEvent.click(getByText('ゴミ箱を空にする'));

    expect(spyAllDel).toHaveBeenCalled();
  });

  test('checkbox-handleToggle and delsButton Test', () => {
    const spyHandleToggle = jest.spyOn(useTrash([], jest.fn()), 'handleToggle');
    const allDel = jest.spyOn(useTrash([], jest.fn()), 'allDel');
    const { queryAllByRole, getByText } = render(<Trash {...props} />);

    const inputs = queryAllByRole('input');
    if (inputs.length > 0) {
      fireEvent.click(inputs[0]);
      expect(spyHandleToggle).toBeCalled();
    }

    fireEvent.click(getByText('ゴミ箱を空にする'));

    expect(allDel).toHaveBeenCalled();
  });

  test('closeModal Test', () => {
    const spyCloseModal = jest.spyOn(useModal(), 'closeModal');
    const { getAllByRole } = render(<Trash {...props} />);

    const buttons = getAllByRole('button');
    if (buttons.length > 0) {
      const button = buttons.pop() as HTMLElement;
      if (button !== undefined) {
        fireEvent.click(button);
      }
    }

    expect(spyCloseModal).toHaveBeenCalled();
  });
});
