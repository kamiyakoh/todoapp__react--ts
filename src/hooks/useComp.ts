import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import type { TodoData } from '../types';
import { compState } from '../states/compState';

interface UseComp {
  comp: TodoData[];
  setNewComp: (newComp: TodoData[]) => void;
  delComp: (id: number) => void;
}

export const useComp = (): UseComp => {
  const [comp, setComp] = useRecoilState(compState);
  const setNewComp = useCallback(
    (newComp: TodoData[]) => {
      setComp(newComp);
    },
    [setComp]
  );
  const delComp = useCallback(
    (id: number) => {
      const filteredComp = comp.filter((item) => item !== comp[id]);
      const fixedIdComp = filteredComp.map((item, index) => ({
        ...item,
        id: index,
      }));
      setNewComp(fixedIdComp);
    },
    [comp, setNewComp]
  );

  return { comp, setNewComp, delComp };
};
