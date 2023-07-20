import type { TodoTask, TodoData, FormValues, UseCustomForm } from '../types';
import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useActive } from './useActive';
import { toastSuccess, toastError } from '../utils/customToast';

export const useCustomForm = (): UseCustomForm => {
  const { active, setNewActive } = useActive();
  // React Hook Form用宣言
  const { register, handleSubmit, control, reset, setFocus, getValues } = useForm<FormValues>({
    defaultValues: {
      title: '',
      tasks: [{ value: '' }],
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
          let task = null;
          if (item.value !== '') {
            task = {
              taskNum: index,
              value: item.value,
              checked: false,
            };
            isTask = true;
          }
          return task;
        })
        .filter(Boolean) as TodoTask[];
      if (isTask) {
        setIsError(false);
        const newBoard: TodoData = {
          id: active.length ?? 0,
          title: data.title,
          tasks: taskValues,
        };
        const newActive: TodoData[] = [...active, newBoard];
        setNewActive(newActive);
        setFocus('title');
        reset();
        isTask = false;
        toastSuccess('作成しました');
      } else {
        setIsError(true);
        toastError('することを入力してください');
        setFocus(`tasks.0.value`);
      }
    },
    [active, reset, setFocus, setIsError, setNewActive]
  );

  // することのinput欄を増減
  const [isInline, setIsInline] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  useEffect(() => {
    if (taskCount > 0) {
      setIsInline(true);
    } else if (taskCount < 2) {
      setIsInline(false);
    }
  }, [taskCount, setIsInline]);
  const addTask = (): void => {
    append({ value: '' });
    setTaskCount(taskCount + 1);
  };
  const reduceTask = (number: number): void => {
    remove(number);
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
    register,
    handleSubmit,
    fields,
    isError,
    onSubmit,
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
