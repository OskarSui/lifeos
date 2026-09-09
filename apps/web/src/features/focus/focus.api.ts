import { apiRequest } from "../../services/api-client";
import type { SetTodayFocusInput, TodayFocus } from "./focus.types";

export function getTodayFocus(userId: string): Promise<TodayFocus | null> {
  const searchParams = new URLSearchParams();

  searchParams.set("userId", userId);

  return apiRequest<TodayFocus | null>(`/focus/today?${searchParams.toString()}`);
}

export function setTodayFocus(input: SetTodayFocusInput): Promise<TodayFocus> {
  return apiRequest<TodayFocus>("/focus/today", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
