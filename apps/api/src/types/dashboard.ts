import type { TaskResponse } from './task.js';

export interface DashboardTask {
  id: string;
  title: string;
  description: string | null;
  status: TaskResponse['status'];
  priority: TaskResponse['priority'];
  dueDate: Date | null;
  completedAt: Date | null;
}

export interface DashboardFocus {
  id: string;
  taskId: string;
  date: Date;
  task: DashboardTask;
}

export interface DashboardCounts {
  total: number;
  inbox: number;
  inProgress: number;
  done: number;
}

export interface DashboardProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface TodayDashboardResponse {
  date: string;
  focus: DashboardFocus | null;
  tasks: DashboardTask[];
  counts: DashboardCounts;
  progress: DashboardProgress;
}
