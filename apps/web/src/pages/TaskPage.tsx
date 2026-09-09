import { useCallback, useEffect, useState } from "react";

import { createTask, deleteTask, updateTask } from "../features/tasks/task.api";

import KanbanBoard from "../features/tasks/components/KanbanBoard";
import QuickCapture from "../features/tasks/components/QuickCapture";
import TaskEditor from "../features/tasks/components/TaskEditor";

import TodayFocusComponent from "../features/focus/components/TodayFocus";
import type { TodayFocus } from "../features/focus/focus.types";
import { setTodayFocus } from "../features/focus/focus.api";

import { getTodayDashboard } from "../features/dashboard/dashboard.api";

import type { Task, TaskStatus } from "../features/tasks/task.types";

import TodayProgress from "../features/dashboard/components/TodayProgress";
import type { DashboardCounts, DashboardProgress } from "../features/dashboard/dashboard.types";

import { DEMO_USER_ID } from "../lib/demo-user";

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [counts, setCounts] = useState<DashboardCounts>({
    total: 0,
    inbox: 0,
    inProgress: 0,
    done: 0,
  });

  const [progress, setProgress] = useState<DashboardProgress>({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const [focus, setFocus] = useState<TodayFocus | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);

      const dashboard = await getTodayDashboard(DEMO_USER_ID);

      setTasks(dashboard.tasks);
      setFocus(dashboard.focus);
      setCounts(dashboard.counts);
      setProgress(dashboard.progress);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTodayDashboard(DEMO_USER_ID)
      .then((dashboard) => {
        setTasks(dashboard.tasks);
        setFocus(dashboard.focus);
        setCounts(dashboard.counts);
        setProgress(dashboard.progress);
      })
      .catch((error: unknown) => {
        setError(error instanceof Error ? error.message : "Failed to load dashboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleCreateTask(title: string) {
    try {
      setError(null);

      await createTask({
        userId: DEMO_USER_ID,
        title,
        priority: "MEDIUM",
      });

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task");

      throw error;
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      setError(null);

      await updateTask(task.id, DEMO_USER_ID, { status });

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task");
    }
  }

  async function handleDeleteTask(task: Task) {
    try {
      setError(null);

      await deleteTask(task.id, DEMO_USER_ID);

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete task");
    }
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
  }

  async function handleSaveTask(
    task: Task,
    input: {
      title: string;
      description: string | null;
      priority: Task["priority"];
      dueDate: string | null;
    },
  ) {
    try {
      setError(null);

      await updateTask(task.id, DEMO_USER_ID, input);

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task");

      throw error;
    }
  }

  async function handleSelectFocus(taskId: string) {
    try {
      setError(null);

      await setTodayFocus({
        userId: DEMO_USER_ID,
        taskId,
      });

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to set today's focus");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-400">Today</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          What matters now?
        </h1>

        <p className="mt-1 text-sm text-gray-500">Capture, focus and execute.</p>
      </div>

      <TodayFocusComponent
        focus={focus}
        tasks={tasks}
        onSelect={handleSelectFocus}
        disabled={loading}
      />

      <TodayProgress counts={counts} progress={progress} />

      <QuickCapture onCreate={handleCreateTask} disabled={loading} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>

          <p className="text-sm text-gray-500">Move work forward.</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading today...</p>
        ) : (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}
      </div>

      {editingTask && (
        <TaskEditor
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </section>
  );
}

export default TasksPage;
