import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TodayFocus from "./TodayFocus";
import type { TodayFocus as TodayFocusType } from "../focus.types";
import type { Task } from "../../tasks/task.types";

const task: Task = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  userId: "550e8400-e29b-41d4-a716-446655440000",
  goalId: null,
  title: "Finish LifeOS frontend tests",
  description: "Complete the frontend testing phase",
  status: "IN_PROGRESS",
  priority: "HIGH",
  dueDate: null,
  completedAt: null,
  createdAt: "2026-09-12T08:00:00.000Z",
  updatedAt: "2026-09-12T08:00:00.000Z",
};

const secondTask: Task = {
  ...task,
  id: "550e8400-e29b-41d4-a716-446655440002",
  title: "Prepare Docker setup",
};

const focus: TodayFocusType = {
  id: "550e8400-e29b-41d4-a716-446655440010",
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
};

describe("TodayFocus", () => {
  it("shows an empty state when there is no focus", () => {
    const onSelect = vi.fn().mockResolvedValue(undefined);

    render(<TodayFocus focus={null} tasks={[task, secondTask]} onSelect={onSelect} />);

    expect(screen.getByRole("heading", { name: "Choose your main task" })).toBeInTheDocument();
  });

  it("displays the current focus task", () => {
    const onSelect = vi.fn().mockResolvedValue(undefined);

    render(<TodayFocus focus={focus} tasks={[task, secondTask]} onSelect={onSelect} />);

    expect(
      screen.getByRole("heading", {
        name: "Finish LifeOS frontend tests",
      }),
    ).toBeInTheDocument();
  });

  it("changes the focus task", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn().mockResolvedValue(undefined);

    render(<TodayFocus focus={focus} tasks={[task, secondTask]} onSelect={onSelect} />);

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, secondTask.id);

    expect(onSelect).toHaveBeenCalledWith(secondTask.id);
  });
});
