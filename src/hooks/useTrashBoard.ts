import { useCallback, useMemo } from 'react';
import { toastDel, toastTakeOut } from '../utils/customToast';
import { TodoData } from '../types';

interface UseTrashBoard {
  board: TodoData;
  title: string;
  onClickDel: () => void;
  takeOut: () => void;
}

export const useTrashBoard = (
  distArr: TodoData[],
  trashArr: TodoData[],
  boardId: number,
  setDist: (newDist: TodoData[]) => void,
  setTrash: (fixedIdTrash: TodoData[]) => void
): UseTrashBoard => {
  const board: TodoData = useMemo(() => {
    return (
      trashArr.find((b) => b.id === boardId) ?? {
        id: -1,
        title: '',
        tasks: [{ taskNum: -1, value: '', checked: false }],
      }
    );
  }, [boardId, trashArr]);
  const title: string = board.title ?? '';
  // trashから破棄
  const del = useCallback(() => {
    const filteredTrash = trashArr.filter((item) => item !== board);
    const fixedIdTrash = filteredTrash.map((item, index) => ({
      ...item,
      id: index,
    }));
    setTrash(fixedIdTrash);
  }, [board, trashArr, setTrash]);
  const onClickDel = useCallback(() => {
    if (window.confirm('完全に破棄しますか？')) {
      del();
      toastDel('完全に破棄しました');
    }
  }, [del]);
  // trashから戻す
  const takeOut = useCallback(() => {
    const distObj = { ...board, id: distArr.length };
    const newDist = [...distArr, distObj];
    setDist(newDist);
    del();
    toastTakeOut();
  }, [board, distArr, setDist, del]);

  return { board, title, onClickDel, takeOut };
};
