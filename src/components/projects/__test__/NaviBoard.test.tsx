import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { NaviBoard } from '../NaviBoard';
import * as useActiveModule from '../../../hooks/useActive';
import * as useCompModule from '../../../hooks/useComp';

jest.mock('../../../hooks/useActive');
jest.mock('../../../hooks/useComp');

describe('NaviBoard Test', () => {
  beforeEach(() => {
    jest.spyOn(useActiveModule, 'useActive').mockReturnValue({
      active: [
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
      setNewActive: jest.fn(),
      delActive: jest.fn(),
    });
    jest.spyOn(useCompModule, 'useComp').mockReturnValue({ comp: [], setNewComp: jest.fn(), delComp: jest.fn() });
  });

  jest.mock('../../../hooks/useComp', () => ({
    useComp: jest.fn(() => ({ comp: [] })),
  }));
  test('render--active', () => {
    // Arrange
    const props = {
      isActive: true,
      isComp: false,
    };

    // Act
    render(
      <RecoilRoot>
        <BrowserRouter>
          <NaviBoard {...props} />
        </BrowserRouter>
      </RecoilRoot>
    );

    // Assert
    expect(screen.getByText('作成')).toBeInTheDocument();
    expect(screen.queryByText('進行中')).toBeNull();
    expect(screen.getByText('完了済 0')).toBeInTheDocument();
  });

  test('Click links navigates pathname --active', async () => {
    // Arrange
    const props = {
      isActive: true,
      isComp: false,
    };

    // Act
    render(
      <RecoilRoot>
        <BrowserRouter>
          <NaviBoard {...props} />
        </BrowserRouter>
      </RecoilRoot>
    );

    // Assert
    await userEvent.click(screen.getByText('作成'));
    expect(window.location.pathname).toBe('/');

    await userEvent.click(screen.getByText('完了済 0'));
    expect(window.location.pathname).toBe('/comp');
  });

  test('render--comp', () => {
    // Arrange
    const props = {
      isActive: false,
      isComp: true,
    };

    // Act
    render(
      <RecoilRoot>
        <BrowserRouter>
          <NaviBoard {...props} />
        </BrowserRouter>
      </RecoilRoot>
    );

    // Assert
    expect(screen.getByText('作成')).toBeInTheDocument();
    expect(screen.getByText('進行中 2')).toBeInTheDocument();
    expect(screen.queryByText('完了済')).toBeNull();
  });
  test('Click links navigates pathname --comp', async () => {
    // Arrange
    const props = {
      isActive: false,
      isComp: true,
    };

    // Act
    render(
      <RecoilRoot>
        <BrowserRouter>
          <NaviBoard {...props} />
        </BrowserRouter>
      </RecoilRoot>
    );

    // Assert
    await userEvent.click(screen.getByText('作成'));
    expect(window.location.pathname).toBe('/');

    await userEvent.click(screen.getByText('進行中 2'));
    expect(window.location.pathname).toBe('/active');
  });
});
