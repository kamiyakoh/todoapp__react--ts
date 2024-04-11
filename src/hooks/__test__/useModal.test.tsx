import { renderHook, act } from '@testing-library/react';
import { useModal } from '../useModal';

describe('useModal', () => {
  test('Init Test', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isScale).toBe(false);
    expect(result.current.isShow).toBe(false);
  });

  test('OpenModal Test', async () => {
    const { result } = renderHook(() => useModal());

    await act(async () => {
      await result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isScale).toBe(true);
    expect(result.current.isShow).toBe(true);
  });

  test('CloseModal Test', async () => {
    const { result } = renderHook(() => useModal());

    await act(async () => {
      await result.current.openModal();
    });

    await act(async () => {
      await result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isScale).toBe(false);
    expect(result.current.isShow).toBe(false);
  });
});
