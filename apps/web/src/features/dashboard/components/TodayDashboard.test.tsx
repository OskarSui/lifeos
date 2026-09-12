import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TodayDashboard from "./TodayDashboard";

import { getTodayDashboard } from "../dashboard.api";
import { getGoals } from "../../goals/goal.api";

import type { TodayDashboard as TodayDashboardData } from "../dashboard.types";
import type { Goal } from "../../goals/goal.types";

vi.mock("../dashboard.api", () => ({
  getTodayDashboard: vi.fn(),
}));

vi.mock("../../goals/goal.api", () => ({
  getGoals: vi.fn(),
  createGoal: vi.fn(),
}));

vi.mock("../../tasks/task.api", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock("../../focus/focus.api", () => ({
  setTodayFocus: vi.fn(),
}));

const task = {
  id: "task-1",
  userId: "user-1",
  goalId: null,
  title: "Finish LifeOS frontend tests",
  description: "Complete the frontend testing phase",
  status: "IN_PROGRESS" as const,
  priority: "HIGH" as const,
  dueDate: null,
  completedAt: null,
  createdAt: "2026-09-12T08:00:00.000Z",
  updatedAt: "2026-09-12T08:00:00.000Z",
};

const dashboard: TodayDashboardData = {
  date: "2026-09-12",
  focus: {
    id: "focus-1",
    taskId: task.id,
    date: "2026-09-12T00:00:00.000Z",
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    },
  },
  tasks: [task],
  counts: {
    total: 1,
    inbox: 0,
    inProgress: 1,
    done: 0,
  },
  progress: {
    completed: 0,
    total: 1,
    percentage: 0,
  },
};

const goals: Goal[] = [
  {
    id: "goal-1",
    userId: "user-1",
    title: "Become a senior engineer",
    description: null,
    status: "ACTIVE",
    createdAt: "2026-09-12T08:00:00.000Z",
    updatedAt: "2026-09-12T08:00:00.000Z",
  },
];

describe("TodayDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays today's dashboard", async () => {
    vi.mocked(getTodayDashboard).mockResolvedValue(dashboard);
    vi.mocked(getGoals).mockResolvedValue(goals);

    render(<TodayDashboard />);

    expect(screen.getByText("Loading your day...")).toBeInTheDocument();

    expect(await screen.findAllByRole("heading", { name: task.title })).toHaveLength(2);

    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    });

    expect(getTodayDashboard).toHaveBeenCalled();
    expect(getGoals).toHaveBeenCalled();
  });

  it("displays an error when loading the dashboard fails", async () => {
    vi.mocked(getTodayDashboard).mockRejectedValue(new Error("Dashboard unavailable"));
    vi.mocked(getGoals).mockResolvedValue([]);

    render(<TodayDashboard />);

    const alerts = await screen.findAllByRole("alert");

    expect(alerts).toHaveLength(2);
    expect(screen.getAllByText("Dashboard unavailable")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
