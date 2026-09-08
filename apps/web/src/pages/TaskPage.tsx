import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../features/tasks/task.api";
import type {
  Task,
  TaskStatus,
} from "../features/tasks/task.types";
import { DEMO_USER_ID } from "../lib/demo-user";

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTasks({
          userId: DEMO_USER_ID,
        });

        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load tasks",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function handleCreateTask() {
    try {
      const task = await createTask({
        userId: DEMO_USER_ID,
        title: "New LifeOS task",
        priority: "MEDIUM",
      });

      setTasks((currentTasks) => [
        task,
        ...currentTasks,
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task",
      );
    }
  }

  async function handleStatusChange(
    task: Task,
    status: TaskStatus,
  ) {
    try {
      const updatedTask = await updateTask(
        task.id,
        DEMO_USER_ID,
        {
          status,
        },
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task",
      );
    }
  }

  async function handleDeleteTask(task: Task) {
    try {
      await deleteTask(
        task.id,
        DEMO_USER_ID,
      );

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Capture, organize and execute.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateTask}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add task
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {loading && (
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        )}

        {!loading && tasks.length === 0 && (
          <p className="text-sm text-gray-500">
            No tasks yet.
          </p>
        )}

        {!loading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {task.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {task.priority}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(event) =>
                      void handleStatusChange(
                        task,
                        event.target
                          .value as TaskStatus,
                      )
                    }
                    className="rounded-md border px-2 py-1 text-sm"
                  >
                    <option value="INBOX">
                      Inbox
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="DONE">
                      Done
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDeleteTask(task)
                    }
                    className="rounded-md border px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TasksPage;