import { useState, useCallback } from 'react';

interface UseModal {
  isOpen: boolean;
  isScale: boolean;
  isShow: boolean;
  openModal: () => Promise<void>;
  closeModal: () => Promise<void>;
}

export const useModal = (): UseModal => {
  const wait = async (seconds: number): Promise<void> => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isScale, setIsScale] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const openModal = useCallback(async () => {
    document.body.style.overflow = 'hidden';
    setIsOpen(true);
    await wait(0.1);
    setIsScale(true);
    await wait(0.25);
    setIsShow(true);
  }, []);
  const closeModal = useCallback(async () => {
    document.body.style.overflow = 'auto';
    setIsShow(false);
    setIsScale(false);
    await wait(0.35);
    setIsOpen(false);
  }, []);

  return { isOpen, isScale, isShow, openModal, closeModal };
};
