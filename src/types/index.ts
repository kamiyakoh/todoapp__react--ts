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
