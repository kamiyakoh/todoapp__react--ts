import { atom } from 'recoil';
import type { TodoData } from '../types';
import type { RecoilKeys } from '../types/recoilKeys';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const trashActiveState = atom<TodoData[]>({
  key: 'TRASH_ACTIVE_STATE' as RecoilKeys,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
