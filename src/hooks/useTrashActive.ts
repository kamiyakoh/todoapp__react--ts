import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import type { TodoData } from '../types';
import { trashActiveState } from '../states/trashActiveState';

interface UseTrashActive {
  trashActive: TodoData[];
  setNewTrashActive: (newTrashActive: TodoData[]) => void;
}

export const useTrashActive = (): UseTrashActive => {
  const [trashActive, setTrashActive] = useRecoilState(trashActiveState);
  const setNewTrashActive = useCallback(
    (newTrashActive: TodoData[]) => {
      setTrashActive(newTrashActive);
    },
    [setTrashActive]
  );

  return { trashActive, setNewTrashActive };
};
