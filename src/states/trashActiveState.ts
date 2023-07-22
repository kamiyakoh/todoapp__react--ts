import { atom } from 'recoil';
import type { TodoData } from '../types';
import { recoilKey } from './recoilKey';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const trashActiveState = atom<TodoData[]>({
  key: recoilKey.trashActiveState,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
