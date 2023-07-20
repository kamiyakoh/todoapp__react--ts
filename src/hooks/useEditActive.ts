import type { TodoTask, TodoData, FormValues, UseCustomForm, UseEditActive } from '../types';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActive } from './useActive';
import { toastError, toastSuccess } from '../utils/customToast';

export const useEditActive = (id: number): UseCustomForm & UseEditActive => {
  const navigate = useNavigate();
  const { active, setNewActive } = useActive();
  const board = useMemo(() => {
    return active.find((b) => b.id === Number(id)) ?? { id: -1, title: '', tasks: [] };
  }, [active, id]);
  const taskList = useMemo(() => board.tasks, [board]);
  // React Hook Form用宣言
  const defaultTasks: TodoTask[] = taskList.map((t: TodoTask) => ({
    taskNum: t.taskNum,
    value: t.value,
    checked: t.checked,
  }));
  const { register, handleSubmit, control, reset, setFocus, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      title: board.title,
      tasks: defaultTasks,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });
  // submitボタンを押した時
  const [isError, setIsError] = useState(false);
  const onSubmit = useCallback(
    (data: FormValues) => {
      let isTask = false;
      const dataTask = data.tasks;
      const taskValues = dataTask
        .map((item, index) => {
          let taskValue = { taskNum: -1, value: '', checked: false };
          if (item.value !== '') {
            let isChecked = false;
            const thisTask = taskList.find((t) => t.taskNum === index) ?? { taskNum: -1, value: '', checked: false };
            if (thisTask.value === item.value) isChecked = thisTask.checked;
            taskValue = {
              taskNum: index,
              value: item.value,
              checked: isChecked,
            };
            isTask = true;
          }
          return taskValue;
        })
        .filter((t) => t.taskNum !== -1);
      if (isTask) {
        setIsError(false);
        const newBoard: TodoData = {
          id: Number(id),
          title: data.title,
          tasks: taskValues,
        };
        const newActive = active.map((item) => {
          if (item === board) {
            return newBoard;
          }
          return item;
        });
        setNewActive(newActive);
        reset();
        isTask = false;
        toastSuccess('編集しました');
        navigate('/active', { state: { isEdited: true } });
      } else {
        setIsError(true);
        toastError('することを入力してください');
        setFocus(`tasks.0.value`);
      }
    },
    [active, board, reset, setFocus, setNewActive, taskList, id, navigate]
  );

  // することのinput欄を増減
  const [isInline, setIsInline] = useState(false);
  const [taskCount, setTaskCount] = useState(taskList.length);
  useEffect(() => {
    if (taskCount > 1) {
      setIsInline(true);
    } else if (taskCount < 2) {
      setIsInline(false);
    }
  }, [taskCount]);
  const addTask = (): void => {
    append({ value: '' });
    setTaskCount(taskCount + 1);
  };
  const reduceTask = (number: number): void => {
    remove(number - 1);
    setTaskCount(taskCount - 1);
  };
  // 漢字変換・予測変換（サジェスト）選択中か否かの判定
  const [composing, setComposition] = useState(false);
  const startComposition = useCallback(() => {
    setComposition(true);
  }, [setComposition]);
  const endComposition = useCallback(() => {
    setComposition(false);
  }, [setComposition]);
  // タイトル入力中にエンターですること入力欄にフォーカス
  const onKeydownTitle = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        // 変換中でない時に エンター で input を増やす
        case 'Enter':
          e.preventDefault();
          if (composing) break;
          setFocus('tasks.0.value');
          break;
        default:
          break;
      }
    },
    [composing, setFocus]
  );
  // input入力時にキーボード操作でinput欄を増減
  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    const value = getValues(`tasks.${index}.value`);
    switch (e.key) {
      // 変換中でない時に エンター で input を増やす
      case 'Enter':
        e.preventDefault();
        if (composing) break;
        addTask();
        break;
      // input が空欄時に バックスペース で input を減らす
      case 'Backspace':
        if (value === '') {
          if (taskCount === 0) {
            setFocus('title');
          } else {
            reduceTask(index);
            if (index === 0) {
              setFocus('title');
            } else {
              const prev: number = index - 1;
              setFocus(`tasks.${prev}.value`);
            }
          }
        }
        break;
      default:
        break;
    }
  };

  return {
    board,
    register,
    handleSubmit,
    getValues,
    formState,
    fields,
    onSubmit,
    isError,
    isInline,
    taskCount,
    addTask,
    reduceTask,
    startComposition,
    endComposition,
    onKeydownTitle,
    onKeydown,
  };
};
