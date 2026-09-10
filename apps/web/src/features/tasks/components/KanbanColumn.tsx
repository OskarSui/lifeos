import type { Task, TaskStatus } from "../task.types";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}

function KanbanColumn({ title, tasks, onStatusChange, onDelete, onEdit }: KanbanColumnProps) {
  return (
    <section className="min-w-0 rounded-xl bg-gray-100 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>

        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/50 p-4 text-center text-sm text-gray-400">
            No tasks
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
