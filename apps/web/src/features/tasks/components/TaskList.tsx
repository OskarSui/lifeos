import type { Task, TaskStatus } from "../task.types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">No tasks yet.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default TaskList;
