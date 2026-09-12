import { Badge } from "../../../components/ui/badge";
import type { Goal } from "../goal.types";

interface GoalListProps {
  goals: Goal[];
}

function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-gray-900">Goals</h2>

        <p className="mt-2 text-sm text-gray-500">Goals give your daily tasks a direction</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Direction</p>

        <h2 className="mt-1 text-lg font-semibold text-gray-900">Goals</h2>
      </div>

      <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-lg border bg-gray-50 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-medium text-gray-900">{goal.title}</h3>

                {goal.description && (
                  <p className="mt-1 break-words text-sm text-gray-500">{goal.description}</p>
                )}
              </div>

              <Badge
                variant={
                  goal.status === "COMPLETED"
                    ? "secondary"
                    : goal.status === "ARCHIVED"
                      ? "outline"
                      : "default"
                }
              >
                {goal.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GoalList;
