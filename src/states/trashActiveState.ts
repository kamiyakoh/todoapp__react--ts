import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';

export const trashActiveState = atom<TodoData[]>({
  key: 'TRASH_ACTIVE_STATE' as RecoilKeys,
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
