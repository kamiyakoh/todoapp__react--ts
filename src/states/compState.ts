import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const compState = atom<TodoData[]>({
  key: 'COMP_STATE' as RecoilKeys,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
