export type TaskStatus = "INDOX" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  goalId?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string | null;
  dueDate?: string | null;
}

export interface GetTasksParams {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  goalId?: string;
}
