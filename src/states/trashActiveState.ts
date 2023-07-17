import { atom } from 'recoil';
import type { TodoData } from '../types';

export const trashActiveState = atom<TodoData[]>({
  key: 'TRASH_ACTIVE_STATE',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const savedTrashActive = JSON.parse(localStorage.getItem('trashActive') ?? '[]') as TodoData[];
      setSelf(savedTrashActive);

      onSet((newValue) => {
        localStorage.setItem('trashActive', JSON.stringify(newValue));
      });
    },
  ],
});
