import axios from 'axios';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDemoData } from '../useDemoData';
import * as useActiveModule from '../useActive';
import * as useCompModule from '../useComp';
// import { TodoData } from '../../types';

jest.mock('axios');
jest.mock('../useActive');
jest.mock('../useComp');

describe('useDemoData', () => {
  // const setNewActiveMock: TodoData[] = [];
  // const setNewCompMock: TodoData[] = [];

  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    jest
      .spyOn(useActiveModule, 'useActive')
      .mockReturnValue({ active: [], setNewActive: jest.fn(), delActive: jest.fn() });
    jest.spyOn(useCompModule, 'useComp').mockReturnValue({ comp: [], setNewComp: jest.fn(), delComp: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetch function fetches and updates state correctly', async () => {
    // Arrange
    const todosMock = [
      { userId: 1, id: 1, title: 'Task1', completed: false },
      { userId: 1, id: 2, title: 'Task2', completed: true },
      { userId: 1, id: 3, title: 'Task3', completed: false },
      { userId: 2, id: 4, title: 'Task4', completed: false },
      { userId: 2, id: 5, title: 'Task5', completed: true },
      { userId: 2, id: 6, title: 'Task6', completed: true },
    ];

    jest.spyOn(axios, 'get').mockResolvedValue({ data: todosMock });

    // Act
    const { result } = renderHook(() => useDemoData());
    await act(async () => {
      result.current.fetch();
      await waitFor(() => {
        result.current.fetch();
      });
    });

    // Assert
    expect(jest.spyOn(axios, 'get')).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
    expect(result.current.remakeData(todosMock, false)).toEqual([
      {
        id: 0,
        title: 'Apples',
        tasks: [
          { taskNum: 0, value: 'Task1', checked: false },
          { taskNum: 1, value: 'Task3', checked: false },
        ],
      },
      {
        id: 1,
        title: 'Butter',
        tasks: [{ taskNum: 0, value: 'Task4', checked: false }],
      },
    ]);
    expect(result.current.remakeData(todosMock, true)).toEqual([
      {
        id: 0,
        title: 'Apples',
        tasks: [{ taskNum: 0, value: 'Task2', checked: true }],
      },
      {
        id: 1,
        title: 'Butter',
        tasks: [
          { taskNum: 0, value: 'Task5', checked: true },
          { taskNum: 1, value: 'Task6', checked: true },
        ],
      },
    ]);
  });

  test('fetch function handles error correctly', async () => {
    // Arrange
    jest.spyOn(axios, 'get').mockRejectedValue('Error');

    // Act
    const { result } = renderHook(() => useDemoData());
    await act(async () => {
      result.current.fetch();
      await waitFor(() => {
        result.current.fetch();
      });
    });

    // Assert
    expect(window.alert).toHaveBeenCalledWith('インターネットからのデモデータ取得に失敗しました');
  });
});
