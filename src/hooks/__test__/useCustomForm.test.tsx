import { renderHook, act } from '@testing-library/react';
import React, { FC, ReactNode } from 'react';
// import { act } from 'react-dom/test-utils';
import { useCustomForm } from '../useCustomForm';
import { useActive } from '../useActive';
import { RecoilRoot, MutableSnapshot, snapshot_UNSTABLE } from 'recoil';
import { activeState } from '../../states/activeState';
import * as actualCustomToastModule from '../../utils/customToast';

jest.mock('../../utils/customToast');
const customToastModule = actualCustomToastModule as jest.Mocked<typeof actualCustomToastModule>;

interface Props {
  children: ReactNode;
}

describe('useCustomForm', () => {
  const spyToastSuccess = jest.spyOn(customToastModule, 'toastSuccess');
  const spyToastError = jest.spyOn(customToastModule, 'toastError');

  const initializeState = ({ set }: MutableSnapshot): void => {
    set(activeState, []);
  };
  const TestWrapper: FC<Props> = ({ children }) => (
    <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
  );
  renderHook(() => useActive(), {
    wrapper: TestWrapper,
  });

  beforeEach(() => {
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActive([]);
    });
  });

  afterAll(() => {
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.setNewActive([]);
    });
  });

  test('should handle form submission with valid data', () => {
    // Arrange
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });

    // Act
    act(() => {
      result.current.onSubmit({
        title: 'Test Title',
        tasks: [{ value: 'Task 1' }, { value: 'Task 2' }],
      });
    });
    const snapshot = snapshot_UNSTABLE();

    // Assert
    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual([
      {
        id: 0,
        title: 'Test Title',
        tasks: [
          { taskNum: 0, value: 'Task 1', checked: false },
          { taskNum: 1, value: 'Task 2', checked: false },
        ],
      },
    ]);
    expect(spyToastSuccess).toBeCalledWith('作成しました');
  });

  test('should handle form submission with empty task and show error', () => {
    // Arrange
    const { result } = renderHook(() => useCustomForm(), {
      wrapper: TestWrapper,
    });

    // Act
    act(() => {
      result.current.onSubmit({
        title: 'Test Title',
        tasks: [{ value: '' }],
      });
    });
    const snapshot = snapshot_UNSTABLE();

    // Assert
    expect(snapshot.getLoadable(activeState).valueOrThrow()).toStrictEqual([]);
    expect(spyToastError).toBeCalledWith('することを入力してください');
  });
});
