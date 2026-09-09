import { apiRequest } from "../../services/api-client";

import type { CreateGoalInput, Goal, UpdateGoalInput } from "./goal.types";

export function getGoals(userId: string): Promise<Goal[]> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<Goal[]>(`/goals?${searchParams.toString()}`);
}

export function createGoal(input: CreateGoalInput): Promise<Goal> {
  return apiRequest<Goal>("/goals", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateGoal(id: string, userId: string, input: UpdateGoalInput): Promise<Goal> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<Goal>(`/goals/${id}?${searchParams.toString()}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteGoal(id: string, userId: string): Promise<void> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  await apiRequest<void>(`/goals/${id}?${searchParams.toString()}`, {
    method: "DELETE",
  });
}
