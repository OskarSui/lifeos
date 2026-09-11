import type { Task } from "../../tasks/task.types";
import type { TodayFocus } from "../focus.types";
import { Card } from "../../../components/ui/card";

interface TodayFocusProps {
  focus: TodayFocus | null;
  tasks: Task[];
  onSelect: (taskId: string) => Promise<void>;
  disabled?: boolean;
}

function TodayFocusComponent({ focus, tasks, onSelect, disabled = false }: TodayFocusProps) {
  const availableTasks = tasks.filter((task) => task.status !== "DONE");

  return (
    <Card className="p-4 sm:p-5">
      <div className="rounded-xl border border-[var(--color-primary)]/15 bg-[var(--color-primary-soft)] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-text)]">
              Today's Focus
            </p>

            {focus ? (
              <>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
                  {focus.task.title}
                </h2>

                {focus.task.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
                    {focus.task.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text)]">
                  Choose your main task
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  Choose one important task below as your main focus for today.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="today-focus" className="mb-2 block text-sm font-medium text-gray-700">
          {focus ? "Change focus" : "Choose your focus"}
        </label>

        <select
          id="today-focus"
          value={focus?.taskId ?? ""}
          onChange={(event) => {
            const taskId = event.target.value;

            if (taskId) {
              void onSelect(taskId);
            }
          }}
          disabled={disabled || availableTasks.length === 0}
          className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        >
          <option value="">Select a task...</option>

          {availableTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        {availableTasks.length === 0 && (
          <p className="mt-2 text-xs text-gray-400">Create a task first.</p>
        )}
      </div>
    </Card>
  );
}

export default TodayFocusComponent;
