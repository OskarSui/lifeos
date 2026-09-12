import { useState } from "react";

import type { Task, TaskPriority } from "../task.types";
import type { Goal } from "../../goals/goal.types";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface TaskEditorProps {
  task: Task;
  goals: Goal[];
  onSave: (
    task: Task,
    input: {
      title: string;
      description: string | null;
      priority: TaskPriority;
      dueDate: string | null;
      goalId: string | null;
    },
  ) => Promise<void>;
  onClose: () => void;
}

function TaskEditor({ task, goals, onSave, onClose }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");

  const [goalId, setGoalId] = useState(task.goalId ?? "none");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSave(task, {
        title: trimmedTitle,
        description: description.trim() || null,
        priority,
        dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null,
        goalId: goalId === "none" ? null : goalId,
      });

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-editor-title"
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="task-editor-title" className="text-lg font-semibold">
              Edit task
            </h2>

            <p className="mt-1 text-sm text-gray-500">Update task details.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close editor"
            className="rounded-md px-2 py-1 text-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={5000}
              rows={4}
              disabled={saving}
              className="w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              placeholder="Add more details..."
            />
          </div>

          <div>
            <label htmlFor="task-goal" className="mb-1 block text-sm font-medium text-gray-700">
              Goal
            </label>

            <Select value={goalId} onValueChange={setGoalId} disabled={saving}>
              <SelectTrigger id="task-goal" className="w-full">
                <SelectValue placeholder="No goal" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">No goal</SelectItem>

                {goals
                  .filter((goal) => goal.status === "ACTIVE")
                  .map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-priority"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Priority
              </label>

              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
                disabled={saving}
              >
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Due date
              </label>

              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={saving}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="min-h-11 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskEditor;
