import { useCallback, useEffect, useState } from "react";

import { createTask, deleteTask, updateTask } from "../../tasks/task.api";

import KanbanBoard from "../../tasks/components/KanbanBoard";
import QuickCapture from "../../tasks/components/QuickCapture";
import TaskEditor from "../../tasks/components/TaskEditor";

import { setTodayFocus } from "../../focus/focus.api";
import TodayFocus from "../../focus/components/TodayFocus";
import { createGoal, getGoals } from "../../goals/goal.api";

import GoalForm from "../../goals/components/GoalForm";
import GoalList from "../../goals/components/GoalList";

import TodayProgress from "./TodayProgress";
import { getTodayDashboard } from "../dashboard.api";
import type { DashboardCounts, DashboardProgress } from "../dashboard.types";
import type { TodayFocus as TodayFocusType } from "../../focus/focus.types";
import type { Goal } from "../../goals/goal.types";
import type { Task, TaskStatus } from "../../tasks/task.types";
import { DEMO_USER_ID } from "../../../lib/demo-user";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorState from "../../../components/ui/ErrorState";

function TodayDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focus, setFocus] = useState<TodayFocusType | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
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

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadDashboard = useCallback(async (isInitialLoad = false) => {
    try {
      setError(null);

      if (isInitialLoad) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }

      const [dashboard, goals] = await Promise.all([
        getTodayDashboard(DEMO_USER_ID),

        getGoals(DEMO_USER_ID),
      ]);

      setTasks(dashboard.tasks);
      setFocus(dashboard.focus);
      setCounts(dashboard.counts);
      setProgress(dashboard.progress);
      setGoals(goals);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load dashboard");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([getTodayDashboard(DEMO_USER_ID), getGoals(DEMO_USER_ID)])
      .then(([dashboard, goals]) => {
        setTasks(dashboard.tasks);
        setFocus(dashboard.focus);
        setCounts(dashboard.counts);
        setProgress(dashboard.progress);
        setGoals(goals);
      })
      .catch((error: unknown) => {
        setError(error instanceof Error ? error.message : "Failed to load dashboard");
      })
      .finally(() => {
        setInitialLoading(false);
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
      goalId: string | null;
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

  async function handleCreateGoal(title: string, description: string) {
    try {
      setError(null);

      await createGoal({
        userId: DEMO_USER_ID,
        title,
        description: description || undefined,
      });

      await loadDashboard();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create goal");

      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        {initialLoading ? (
          <LoadingState message="Loading your day..." />
        ) : error && tasks.length === 0 ? (
          <ErrorState
            message={error}
            onRetry={() => void loadDashboard(true)}
            retrying={refreshing}
          />
        ) : (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 sm:text-sm sm:normal-case sm:tracking-normal">
              Today
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What matters now?
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Focus on one important action and keep moving.
            </p>
          </div>
        )}
        {refreshing && (
          <span className="shrink-0 text-xs text-gray-400" role="status">
            Updating...
          </span>
        )}
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <TodayFocus
        focus={focus}
        tasks={tasks}
        onSelect={handleSelectFocus}
        disabled={initialLoading}
      />

      <TodayProgress counts={counts} progress={progress} />
      <QuickCapture onCreate={handleCreateTask} disabled={initialLoading} />

      {tasks.length === 0 && (
        <div className="rounded-xl border border-dashed bg-white p-6 text-center sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900">Start with one task</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Capture the first thing you want to move forward today.
          </p>
        </div>
      )}

      <KanbanBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GoalForm onCreate={handleCreateGoal} disabled={initialLoading} />
        <GoalList goals={goals} />
      </div>

      {editingTask && (
        <TaskEditor
          task={editingTask}
          goals={goals}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

export default TodayDashboard;
