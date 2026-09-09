import type { Task, TaskStatus } from "../task.types";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

const columns: Array<{
  title: string;
  status: TaskStatus;
}> = [
  {
    title: "Inbox",
    status: "INBOX",
  },
  {
    title: "In Progress",
    status: "IN_PROGRESS",
  },
  {
    title: "Done",
    status: "DONE",
  },
];

function KanbanBoard({ tasks, onStatusChange, onDelete }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={columnTasks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}

export default KanbanBoard;
