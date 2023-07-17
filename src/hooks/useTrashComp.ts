import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import type { TodoData } from '../types';
import { trashCompState } from '../states/trashCompState';

interface UseTrashComp {
  trashComp: TodoData[];
  setNewTrashComp: (newTrashComp: TodoData[]) => void;
}

export const useTrashComp = (): UseTrashComp => {
  const [trashComp, setTrashComp] = useRecoilState(trashCompState);
  const setNewTrashComp = useCallback(
    (newTrashComp: TodoData[]) => {
      localStorage.setItem('trashComp', JSON.stringify(newTrashComp));
      setTrashComp(newTrashComp);
    },
    [setTrashComp]
  );

  return { trashComp, setNewTrashComp };
};
