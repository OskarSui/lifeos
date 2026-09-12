import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KanbanBoard from "./KanbanBoard";
import type { Task } from "../task.types";

const userId = "550e8400-e29b-41d4-a716-446655440000";

const inboxTask: Task = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  userId,
  goalId: null,
  title: "Capture an idea",
  description: null,
  status: "INBOX",
  priority: "MEDIUM",
  dueDate: null,
  completedAt: null,
  createdAt: "2026-09-12T08:00:00.000Z",
  updatedAt: "2026-09-12T08:00:00.000Z",
};

const progressTask: Task = {
  ...inboxTask,
  id: "550e8400-e29b-41d4-a716-446655440002",
  title: "Build frontend tests",
  status: "IN_PROGRESS",
  priority: "HIGH",
};

const doneTask: Task = {
  ...inboxTask,
  id: "550e8400-e29b-41d4-a716-446655440003",
  title: "Finish UI polish",
  status: "DONE",
  priority: "LOW",
  completedAt: "2026-09-12T10:00:00.000Z",
};

describe("KanbanBoard", () => {
  it("renders tasks in their corresponding columns", () => {
    render(
      <KanbanBoard
        tasks={[inboxTask, progressTask, doneTask]}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Capture an idea")).toBeInTheDocument();
    expect(screen.getByText("Build frontend tests")).toBeInTheDocument();
    expect(screen.getByText("Finish UI polish")).toBeInTheDocument();
  });

  it("renders all three Kanban columns", () => {
    render(<KanbanBoard tasks={[]} onStatusChange={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders an empty state when there are no tasks", () => {
    render(<KanbanBoard tasks={[]} onStatusChange={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/capture your next idea here/i)).toBeInTheDocument();
  });
});
