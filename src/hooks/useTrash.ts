import type { TodoData } from '../types';
import { useState, useEffect, useCallback } from 'react';
import { toastDel } from '../utils/customToast';

interface UseTrash {
  trashCount: number;
  checkedIds: TrashDelCheck[];
  allDel: () => void;
  handleToggle: (id: number) => void;
  dels: () => void;
}
interface TrashDelCheck {
  id: number;
  checked: boolean;
}

export const useTrash = (trashBoards: TodoData[], setTrash: (array: TodoData[]) => void): UseTrash => {
  const [trashCount, setTrashCount] = useState(0);
  // trashから全破棄
  const allDel = useCallback(() => {
    if (window.confirm('ゴミ箱内を全て破棄しますか？')) {
      setTrash([]);
      setTrashCount(0);
      toastDel('ゴミ箱内を全て破棄しました');
    }
  }, [setTrash]);
  // trashからまとめて破棄
  const checkedIdsInit: TrashDelCheck[] = [];
  trashBoards.map((item) => checkedIdsInit.push({ id: item.id, checked: false }));
  const [checkedIds, setCheckedIds] = useState(checkedIdsInit);
  useEffect(() => {
    const ids: TrashDelCheck[] = [];
    trashBoards.map((item) => ids.push({ id: item.id, checked: false }));
    setCheckedIds(ids);
  }, [trashBoards]);
  const handleToggle = useCallback(
    (id: number) => {
      const newCheckedIds = [...checkedIds];
      newCheckedIds[id].checked = !newCheckedIds[id].checked;
      setCheckedIds(newCheckedIds);
      if (newCheckedIds[id].checked) {
        setTrashCount(trashCount + 1);
      } else {
        setTrashCount(trashCount - 1);
      }
    },
    [checkedIds, trashCount]
  );
  const dels = useCallback(() => {
    if (trashCount <= 0) {
      window.alert('まとめて破棄する黒板を選択してボタンを押してください');
      return;
    }
    if (trashCount > 0) {
      if (window.confirm(`ゴミ箱から${trashCount}件を完全に破棄しますか？`)) {
        const newCheckedIds = checkedIds.filter((item) => item.checked);
        const trashIdsToDelete = newCheckedIds.map((item) => item.id);
        const filteredTrash = trashBoards.filter((item) => !trashIdsToDelete.includes(item.id));
        const fixedIdTrash = filteredTrash.map((item, index) => ({
          ...item,
          id: index,
        }));
        setTrash(fixedIdTrash);
        setTrashCount(0);
        toastDel(`ゴミ箱から${trashCount}件を完全破棄しました`);
      }
    }
  }, [checkedIds, trashCount, trashBoards, setTrash]);

  return { trashCount, checkedIds, allDel, handleToggle, dels };
};
