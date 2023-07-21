import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';

export const activeState = atom<TodoData[]>({
  key: 'ACITVE_STATE' as RecoilKeys,
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
