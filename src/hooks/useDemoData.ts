import type { TodoTask, TodoData } from '../types';
import { useCallback } from 'react';
import axios from 'axios';
import { useActive } from './useActive';
import { useComp } from './useComp';

interface UseDemoData {
  fetch: () => void;
}
interface Todos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useDemoData = (): UseDemoData => {
  const { setNewActive } = useActive();
  const { setNewComp } = useComp();

  const remakeArr = (arr: Todos[], isComp: boolean): TodoData[] => {
    const sortArr = arr.reduce((acc: Array<{ userId: number; title: string[] }>, item) => {
      const { userId, title } = item;
      const exItem = acc.find((x) => x.userId === userId);
      if (exItem !== undefined) {
        exItem.title.push(title);
      } else {
        acc.push({ userId, title: [title] });
      }
      return acc;
    }, []);
    const result = sortArr.map((item, index) => {
      const tasks: TodoTask[] = item.title.map((elm: string, num: number) => ({
        taskNum: num,
        value: elm,
        checked: isComp,
      }));
      return { id: index, title: phonetic(item.userId), tasks };
    });
    return result;
  };

  const fetch = useCallback(async () => {
    try {
      const res = await axios.get<Todos[]>('https://jsonplaceholder.typicode.com/todos');
      const remakeRes = (isComp: boolean): TodoData[] => {
        const filteredRes = res.data.filter((item: Todos) => item.completed === isComp);
        const remakedRes = remakeArr(filteredRes, isComp);
        return remakedRes;
      };
      const remakedActive = remakeRes(false);
      localStorage.setItem('active', JSON.stringify(remakedActive));
      setNewActive(remakedActive);
      const remakedComp = remakeRes(true);
      localStorage.setItem('comp', JSON.stringify(remakedComp));
      setNewComp(remakedComp);
    } catch (error) {
      window.alert('インターネットからのデモデータ取得に失敗しました');
    }
  }, [setNewActive, setNewComp]);
  return { fetch };
};

const phonetic = (num: number): string => {
  const mod = num % 26;
  switch (mod) {
    case 1:
      return 'Apples';
    case 2:
      return 'Butter';
    case 3:
      return 'Charlie';
    case 4:
      return 'Duff';
    case 5:
      return 'Edward';
    case 6:
      return 'Freddy';
    case 7:
      return 'George';
    case 8:
      return 'Harry';
    case 9:
      return 'Ink';
    case 10:
      return 'Johnnie';
    case 11:
      return 'King';
    case 12:
      return 'London';
    case 13:
      return 'Monkey';
    case 14:
      return 'Nuts';
    case 15:
      return 'Orenge';
    case 16:
      return 'Pudding';
    case 17:
      return 'Queeenie';
    case 18:
      return 'Robert';
    case 19:
      return 'Sugger';
    case 20:
      return 'Tommy';
    case 21:
      return 'Uncle';
    case 22:
      return 'Vinegar';
    case 23:
      return 'Willie';
    case 24:
      return 'Xerxes';
    case 25:
      return 'Yellow';
    case 0:
      return 'Zebra';
    default:
      return '';
  }
};
