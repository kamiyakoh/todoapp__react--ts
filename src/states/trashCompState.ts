import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';

export const trashCompState = atom<TodoData[]>({
  key: 'TRASH_COMP_STATE' as RecoilKeys,
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
