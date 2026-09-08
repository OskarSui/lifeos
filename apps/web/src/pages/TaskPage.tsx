import { useEffect, useState } from "react";

import { getTasks } from "../features/tasks/task.api";
import type { Task } from "../features/tasks/task.types";

const USER_ID = "112c9068-a834-4f5c-bb90-4c7e6a69fee2";

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
          userId: USER_ID,
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

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>

        <p className="mt-1 text-sm text-gray-500">Capture, organize and execute.</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {loading && <p className="text-sm text-gray-500">Loading tasks...</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-sm text-gray-500">No tasks yet.</p>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-lg border p-4">
                <p className="font-medium">{task.title}</p>

                <p className="mt-1 text-sm text-gray-500">
                  {task.status} · {task.priority}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TasksPage;
