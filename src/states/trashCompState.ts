import { atom } from 'recoil';
import type { TodoData } from '../types';

export const trashCompState = atom<TodoData[]>({
  key: 'TRASH_COMP_STATE',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const savedTrashComp = JSON.parse(localStorage.getItem('trashComp') ?? '[]') as TodoData[];
      setSelf(savedTrashComp);

      onSet((newValue) => {
        localStorage.setItem('trashComp', JSON.stringify(newValue));
      });
    },
  ],
});
