import type { Task, TaskStatus } from "../task.types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <h3 className="break-words font-medium text-gray-900">{task.title}</h3>

        {task.description && (
          <p className="mt-1 break-words text-sm text-gray-500">{task.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-2 py-1">{task.priority}</span>

          <span className="rounded-full bg-gray-100 px-2 py-1">{task.status}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
          className="min-h-9 w-full rounded-md border bg-white px-2 py-1 text-sm sm:w-auto"
        >
          <option value="INBOX">Inbox</option>

          <option value="IN_PROGRESS">In Progress</option>

          <option value="DONE">Done</option>
        </select>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className="min-h-9 rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
