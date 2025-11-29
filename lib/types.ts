export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskTag = 'bug' | 'feature' | 'review';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string | null;  // この行を追加
  tags: TaskTag[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}