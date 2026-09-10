import type { Task } from "../../tasks/task.types";
import type { TodayFocus } from "../focus.types";

interface TodayFocusProps {
  focus: TodayFocus | null;
  tasks: Task[];
  onSelect: (taskId: string) => Promise<void>;
  disabled?: boolean;
}

function TodayFocusComponent({ focus, tasks, onSelect, disabled = false }: TodayFocusProps) {
  const availableTasks = tasks.filter((task) => task.status !== "DONE");

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Today&apos;s Focus
        </p>

        <h2 className="mt-1 text-lg font-semibold text-gray-900">What matters most today?</h2>
      </div>

      {focus ? (
        <div className="mt-4 rounded-lg border bg-gray-50 p-4 sm:mt-5 ">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="break-words font-medium text-gray-900">{focus.task.title}</p>

              {focus.task.description && (
                <p className="mt-1 break-words text-sm text-gray-500">{focus.task.description}</p>
              )}
            </div>

            <span className="w-fit shrink-0 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white">
              {focus.task.priority}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-5">
          <p className="text-sm text-gray-500">
            You haven&apos;t selected your main task for today.
          </p>
        </div>
      )}

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
    </section>
  );
}

export default TodayFocusComponent;
