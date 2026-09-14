import type { TaskPriority, TaskStatus } from './task.js';

export interface SetTodayFocusInput {
  userId: string;
  taskId: string;
}

export interface FocusTask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
}

export interface TodayFocusResponse {
  id: string;
  taskId: string;
  date: Date;
  task: FocusTask;
}
