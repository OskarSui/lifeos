import type { Task } from "../tasks/task.types";
import type { TodayFocus } from "../focus/focus.types";

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

export interface TodayDashboard {
  date: string;
  focus: TodayFocus | null;
  tasks: Task[];
  counts: DashboardCounts;
  progress: DashboardProgress;
}
