import { atom } from 'recoil';
import type { TodoData } from '../types';
import { recoilKey } from './recoilKey';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const activeState = atom<TodoData[]>({
  key: recoilKey.activeState,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
