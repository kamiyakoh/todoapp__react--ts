import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';

export const compState = atom<TodoData[]>({
  key: 'COMP_STATE' as RecoilKeys,
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const savedComp = JSON.parse(localStorage.getItem('comp') ?? '[]') as TodoData[];
      setSelf(savedComp);

      onSet((newValue) => {
        localStorage.setItem('comp', JSON.stringify(newValue));
      });
    },
  ],
});
