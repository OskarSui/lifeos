import { apiRequest } from "../../services/api-client";
import type { CreateTaskInput, Task, UpdateTaskInput } from "./task.types";

interface GetTaskParams {
  userId: string;
  status?: Task["status"];
  priority?: Task["priority"];
  goalId?: string;
}

export function getTasks(params: GetTaskParams): Promise<Task[]> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", params.userId);

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.priority) {
    searchParams.set("priority", params.priority);
  }

  if (params.goalId) {
    searchParams.set("goalId", params.goalId);
  }

  return apiRequest<Task[]>(`/tasks?${searchParams.toString()}`);
}

export function getTask(id: string, userId: string): Promise<Task> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<Task>(`/tasks/${id}?${searchParams.toString()}`);
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(id: string, userId: string, input: UpdateTaskInput): Promise<Task> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<Task>(`/tasks/${id}?${searchParams.toString()}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteTask(id: string, userId: string): Promise<void> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  await apiRequest<void>(`/tasks/${id}?${searchParams.toString()}`, {
    method: "DELETE",
  });
}
