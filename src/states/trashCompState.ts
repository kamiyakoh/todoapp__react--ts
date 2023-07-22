import { atom } from 'recoil';
import type { TodoData } from '../types';
import { recoilKey } from './recoilKey';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const trashCompState = atom<TodoData[]>({
  key: recoilKey.trashCompState,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
