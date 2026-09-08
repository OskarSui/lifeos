import type { Task, TaskStatus } from "../task.types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4">
      <div className="min-w-0">
        <h3 className="truncate font-medium text-gray-900">{task.title}</h3>

        {task.description && <p className="mt-1 text-sm text-gray-500">{task.description}</p>}

        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span>{task.priority}</span>
          <span>·</span>
          <span>{task.status}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="INBOX">Inbox</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-md border px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
