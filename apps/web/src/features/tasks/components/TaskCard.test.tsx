import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TaskCard from "./TaskCard";
import type { Task } from "../task.types";

const task: Task = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  userId: "550e8400-e29b-41d4-a716-446655440000",
  goalId: null,
  title: "Build frontend UI/UX",
  description: "Add tests for LifeOS components",
  status: "IN_PROGRESS",
  priority: "MEDIUM",
  dueDate: null,
  completedAt: null,
  createdAt: "2026-09-11T10:00:00.000Z",
  updatedAt: "2026-09-11T10:00:00.000Z",
};

describe("TaskCard", () => {
  it("renders the task information", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />,
    );

    expect(screen.getByText("Build frontend UI/UX")).toBeInTheDocument();

    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it("calls onEdit when Edit is clicked", async () => {
    const user = userEvent.setup();

    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />,
    );

    const editButton = screen.getByRole("button", {
      name: /edit/i,
    });

    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onDelete when Delete is clicked", async () => {
    const user = userEvent.setup();

    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /delete/i,
    });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
