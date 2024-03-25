import { useRecoilState, SetterOrUpdater } from 'recoil';
import { useCallback } from 'react';
import type { TodoData } from '../types';
import { activeState } from '../states/activeState';

interface UseActive {
  active: TodoData[];
  setActive: SetterOrUpdater<TodoData[]>;
  setNewActive: (newActive: TodoData[]) => void;
  delActive: (id: number) => void;
}

export const useActive = (): UseActive => {
  const [active, setActive] = useRecoilState(activeState);
  const setNewActive = useCallback(
    (newActive: TodoData[]) => {
      setActive(newActive);
    },
    [setActive]
  );
  const delActive = useCallback(
    (id: number) => {
      const filteredActive = active.filter((item) => item !== active[id]);
      const fixedIdActive = filteredActive.map((item, index) => ({
        ...item,
        id: index,
      }));
      setNewActive(fixedIdActive);
    },
    [active, setNewActive]
  );

  return { active, setActive, setNewActive, delActive };
};
