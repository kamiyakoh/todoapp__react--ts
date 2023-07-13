import { atom } from 'recoil';
import type { TodoData } from '../types';

export const compState = atom<TodoData[]>({
  key: 'COMP_STATE',
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
