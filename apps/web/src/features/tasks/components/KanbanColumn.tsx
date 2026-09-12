import type { Task, TaskStatus } from "../task.types";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

function KanbanColumn({
  title,
  status,
  tasks,
  onStatusChange,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  const variantStyles = {
    INBOX: {
      accent: "bg-[var(--kanban-inbox-accent)]",
      background: "bg-[var(--kanban-inbox-bg)]",
    },

    IN_PROGRESS: {
      accent: "bg-[var(--kanban-progress-accent)]",
      background: "bg-[var(--kanban-progress-bg)]",
    },

    DONE: {
      accent: "bg-[var(--kanban-done-accent)]",
      background: "bg-[var(--kanban-done-bg)]",
    },
  };

  const styles = variantStyles[status];
  return (
    <section className="flex min-h-[180px] flex-col rounded-xl border border-[var(--kanban-column-border)] bg-[var(--kanban-column-bg)] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${styles.accent}`} aria-hidden="true" />

          <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] ${styles.background}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/50 p-4 text-center text-sm text-gray-400">
            {status === "INBOX"
              ? "Capture your next idea here."
              : status === "IN_PROGRESS"
                ? "Nothing in progress."
                : "No completed tasks yet."}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default KanbanColumn;
