import Badge from "../../../components/ui/Badge";
import type { Task, TaskStatus } from "../task.types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <h3 className="break-words font-medium text-gray-900">{task.title}</h3>

        {task.description && (
          <p className="mt-1 break-words text-sm text-gray-500">{task.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Badge
            variant={
              task.priority === "HIGH"
                ? "danger"
                : task.priority === "MEDIUM"
                  ? "warning"
                  : "neutral"
            }
          >
            {task.priority}
          </Badge>

          <Badge
            variant={
              task.status === "DONE"
                ? "success"
                : task.status === "IN_PROGRESS"
                  ? "primary"
                  : "neutral"
            }
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:flex">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
          className="min-h-11 w-full rounded-md border bg-white px-3 py-2 text-sm sm:w-auto"
        >
          <option value="INBOX">Inbox</option>

          <option value="IN_PROGRESS">In Progress</option>

          <option value="DONE">Done</option>
        </select>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="min-h-11 rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className="min-h-11 rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
