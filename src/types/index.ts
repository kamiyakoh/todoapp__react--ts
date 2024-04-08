import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldArrayWithId,
  UseFormGetValues,
  FormState,
} from 'react-hook-form';

export interface TodoTask {
  taskNum: number;
  value: string;
  checked: boolean;
}

export interface TodoData {
  id: number;
  title?: string;
  tasks: TodoTask[];
}

export interface FormValues {
  title?: string;
  tasks: Array<{ value: string }>;
}

export interface UseCustomForm {
  register: UseFormRegister<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  fields: Array<FieldArrayWithId<FormValues, 'tasks', 'id'>>;
  isError: boolean;
  onSubmit: (data: FormValues) => void;
  isInline: boolean;
  taskCount: number;
  addTask: () => void;
  reduceTask: (number: number) => void;
  startComposition: () => void;
  endComposition: () => void;
  onKeydownTitle: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeydown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  setNewActive: (newActive: TodoData[]) => void;
}

export interface UseEditActive {
  board: TodoData;
  getValues: UseFormGetValues<FormValues>;
  formState: FormState<FormValues>;
}
