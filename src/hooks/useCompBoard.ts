import type { TodoData } from '../types';
import { useCallback, useMemo } from 'react';
import { useComp } from './useComp';
import { useTrashComp } from './useTrashComp';
import { toastCustom } from '../utils/customToast';

interface UseCompBoard {
  board: TodoData;
  trash: () => void;
}

export const useCompBoard = (boardId: number): UseCompBoard => {
  const { comp, delComp } = useComp();
  const { trashComp, setNewTrashComp } = useTrashComp();
  const board = useMemo(() => {
    return (
      comp.find((b) => b.id === boardId) ?? { id: -1, title: '', tasks: [{ taskNum: -1, value: '', checked: false }] }
    );
  }, [comp, boardId]);
  // compからゴミ箱へ
  const trash = useCallback(() => {
    const newTrashBoard = { ...board, id: trashComp.length };
    const newTrash = [...trashComp, newTrashBoard];
    setNewTrashComp(newTrash);
    delComp(boardId);
    toastCustom('ゴミ箱へ移動しました', '🚮');
  }, [trashComp, board, boardId, setNewTrashComp, delComp]);

  return { board, trash };
};
