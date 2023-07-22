import { atom } from 'recoil';
import type { TodoData } from '../types';
import { recoilKey } from './recoilKey';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const compState = atom<TodoData[]>({
  key: recoilKey.compState,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
