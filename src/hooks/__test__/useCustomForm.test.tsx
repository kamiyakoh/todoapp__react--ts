import { renderHook, act, waitFor, screen } from '@testing-library/react';
import React, { FC, ReactNode } from 'react';
// import { act } from 'react-dom/test-utils';
import { useCustomForm } from '../useCustomForm';
import { useActive } from '../useActive';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import { activeState } from '../../states/activeState';
import { TodoData } from '../../types';
import { toastSuccess } from '../../utils/customToast';
// モックする関数やカスタムフックを使ってテストを行う
interface Props {
  children: ReactNode;
}

describe('useCustomForm', () => {
  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );

  beforeEach(() => {
    /* jest.mock('../useActive', () => ({
      useActive: jest.fn().mockReturnValue({
        active: [] as TodoData[],
        setNewActive: jest.fn(),
        delActive: jest.fn(),
      }),
    })); */
    /* jest.mock('react-hook-form', () => ({
      useForm: jest.fn().mockReturnValue(() => ({
        register: jest.fn(),
        handleSubmit: jest.fn(),
        control: {},
        reset: jest.fn(),
        setFocus: jest.fn(),
        getValues: jest.fn(() => ({ title: 'Test Title', tasks: [{ value: 'Task 1' }] })),
      })),
      useFieldArray: jest.fn().mockReturnValue(() => ({
        fields: [{}, {}],
        append: jest.fn(),
        remove: jest.fn(),
      })),
    })); */
    /* jest.mock('../../utils/customToast', () => ({
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
    })); */
  });

  // const setFocusSpy = spyOn(react-hook)
  it('should handle form submission with valid data', async () => {
    // Arrange
    const x = renderHook(() => useActive(), {
      wrapper: TestWrapper,
    }).result;
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });
    const toastSuccessObject = { toastSuccess };
    const toastSuccessSpy = jest.spyOn(toastSuccessObject, 'toastSuccess');
    // const setNewActiveSpy = jest.spyOn(useActive(), 'setNewActive');

    // Act
    /*     act(() => {
      result.current.setNewActive([]);
    }); */
    act(() => {
      result.current.onSubmit({
        title: 'Test Title',
        tasks: [{ value: 'Task 1' }, { value: 'Task 2' }],
      });
    });

    // Assert
    expect(x.current.setNewActive).toHaveBeenCalledWith([
      {
        id: 0,
        title: 'Test Title',
        tasks: [
          { taskNum: 0, value: 'Task 1', checked: false },
          { taskNum: 1, value: 'Task 2', checked: false },
        ],
      },
    ]);
    // expect(setFocus).toHaveBeenCalledWith('title');
    // expect(reset).toHaveBeenCalled();
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith('作成しました');
    });
  });

  it('should handle form submission with empty task and show error', () => {
    // Arrange
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });
    // const setNewActiveSpy = jest.spyOn(useActive(), 'setNewActive');

    // Act
    act(() => {
      result.current.onSubmit({
        title: 'Test Title',
        tasks: [{ value: '' }],
      });
    });

    // Assert
    // expect(useActive().setNewActive).not.toHaveBeenCalled();
    /* expect(setFocus).toHaveBeenCalledWith('tasks.0.value');
    expect(reset).not.toHaveBeenCalled(); */
    expect(screen.getByText('することを入力してください')).toBeInTheDocument();
  });
});
