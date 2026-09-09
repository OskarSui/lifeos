import type { TaskPriority, TaskStatus } from "../tasks/task.types";

export interface FocusTask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface TodayFocus {
  id: string;
  taskId: string;
  date: string;
  task: FocusTask;
}

export interface SetTodayFocusInput {
  userId: string;
  taskId: string;
}
