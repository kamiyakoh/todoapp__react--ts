import { atom } from 'recoil';
import type { TodoData } from '../types';

export const activeState = atom<TodoData[]>({
  key: 'ACTIVE_STATE',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const savedActive = JSON.parse(localStorage.getItem('active') ?? '[]') as TodoData[];
      setSelf(savedActive);

      onSet((newValue) => {
        localStorage.setItem('active', JSON.stringify(newValue));
      });
    },
  ],
});
