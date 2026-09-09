import { useEffect, useState } from "react";

import { createTask, deleteTask, getTasks, updateTask } from "../features/tasks/task.api";
import KanbanBoard from "../features/tasks/components/KanbanBoard";
import type { Task, TaskStatus } from "../features/tasks/task.types";
import { DEMO_USER_ID } from "../lib/demo-user";

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(error instanceof Error ? error.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function handleCreateTask() {
    try {
      setError(null);

      const task = await createTask({
        userId: DEMO_USER_ID,
        title: "New LifeOS task",
        priority: "MEDIUM",
      });

      setTasks((currentTasks) => [task, ...currentTasks]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task");
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      setError(null);

      const updatedTask = await updateTask(task.id, DEMO_USER_ID, { status });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task");
    }
  }

  async function handleDeleteTask(task: Task) {
    try {
      setError(null);

      await deleteTask(task.id, DEMO_USER_ID);

      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete task");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>

          <p className="mt-1 text-sm text-gray-500">Capture, organize and execute.</p>
        </div>

        <button
          type="button"
          onClick={() => void handleCreateTask()}
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
        {loading ? (
          <p className="text-sm text-gray-500">Loading tasks...</p>
        ) : (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </section>
  );
}

export default TasksPage;
