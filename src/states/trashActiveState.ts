import { atom } from 'recoil';
import type { TodoData } from '../types';

export const trashActiveState = atom<TodoData[]>({
  key: 'TRASH_ACTIVE_STATE',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const saveTrashdActive = JSON.parse(localStorage.getItem('trashActive') ?? '[]') as TodoData[];
      setSelf(saveTrashdActive);

      onSet((newValue) => {
        localStorage.setItem('trashActive', JSON.stringify(newValue));
      });
    },
  ],
});
