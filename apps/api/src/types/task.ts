import type { TaskPriority, TaskStatus } from '@prisma/client';

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  goalId?: string;
  dueDate?: Date;
}

export interface GetTasksQuery {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string | null;
  dueDate?: Date | null;
}

export interface UpdateTaskData extends UpdateTaskInput {
  completedAt?: Date | null;
}

export interface TaskResponse {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
