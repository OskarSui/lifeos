import { apiRequest } from "../../services/api-client";
import type { TodayDashboard } from "./dashboard.types";

export function getTodayDashboard(userId: string): Promise<TodayDashboard> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<TodayDashboard>(`/dashboard/today?${searchParams.toString()}`);
}
