import type { TodoTask } from '../types';
import { useState, useEffect, useCallback } from 'react';
import { useActive } from './useActive';
import { useComp } from './useComp';
import { useTrashActive } from './useTrashActive';
import { toastCustom, toastSuccess } from '../utils/customToast';

interface UseActiveBoard {
  title?: string;
  taskList: TodoTask[];
  allChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, taskNum: number) => void;
  trash: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useActiveBoard = (boardId: number): UseActiveBoard => {
  const { active, setNewActive, delActive } = useActive();
  const { comp, setNewComp } = useComp();
  const { trashActive, setNewTrashActive } = useTrashActive();

  const board = active.find((b) => b.id === boardId);
  const title = board?.title;
  const [taskList, setTaskList] = useState<TodoTask[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  useEffect(() => {
    if (board !== undefined) {
      setTaskList(board.tasks);
    }
  }, [board, board?.tasks]);
  useEffect(() => {
    const allItemsChecked = taskList.every((item) => item.checked);
    setAllChecked(allItemsChecked);
  }, [taskList]);
  // checkboxを切り替えた時
  const onChange = (e: React.ChangeEvent<HTMLInputElement>, taskNum: number): void => {
    const checked: boolean = e.currentTarget.checked;
    const updatedTaskList = taskList.map((item) => {
      if (item.taskNum === taskNum) {
        return { ...item, checked };
      }
      return item;
    });
    setTaskList(updatedTaskList);
    // const tasks = updatedTaskList;
    const updatedActive = active.map((item) => {
      if (item.id === boardId) {
        return { ...item, tasks: updatedTaskList };
      }
      return item;
    });
    setNewActive(updatedActive);
  };
  // activeからゴミ箱へ
  const trash = useCallback(() => {
    const newTrashBoard = { ...board, id: trashActive.length };
    const newTrash = [...trashActive, newTrashBoard];
    const fixedNewTrash = newTrash.map((b) => ({
      id: b.id,
      title: b.title,
      tasks: b.tasks ?? [],
    }));
    setNewTrashActive(fixedNewTrash);
    delActive(boardId);
    toastCustom('ゴミ箱へ移動しました', '🚮');
  }, [trashActive, board, boardId, setNewTrashActive, delActive]);
  // submitボタンを押した時
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const taskValues = taskList.map((item) => ({
      taskNum: item.taskNum,
      value: item.value,
      checked: item.checked,
    }));
    const compBoard = {
      id: comp.length ?? 0,
      title,
      tasks: taskValues,
    };
    const newComp = [...comp, compBoard];
    setNewComp(newComp);
    const filteredActive = active.filter((item) => item !== active[boardId]);
    const fixedIdActive = filteredActive.map((item, index) => ({
      ...item,
      id: index,
    }));
    setNewActive(fixedIdActive);
    toastSuccess('完了おめでとう');
  };

  return { title, taskList, allChecked, onChange, trash, onSubmit };
};
