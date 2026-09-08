import { apiRequest } from "../../services/api-client";
import type { Task } from "./task.types";

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
