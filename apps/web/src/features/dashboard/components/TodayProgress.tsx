import type { DashboardCounts, DashboardProgress } from "../dashboard.types";

interface TodayProgressProps {
  counts: DashboardCounts;
  progress: DashboardProgress;
}

function TodayProgress({ counts, progress }: TodayProgressProps) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Today</p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">Your progress</h2>
        </div>

        <span className="text-2xl font-semibold text-gray-900">{progress.percentage}%</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <ProgressStat label="Inbox" value={counts.inbox} />

        <ProgressStat label="In progress" value={counts.inProgress} />

        <ProgressStat label="Done" value={counts.done} />
      </div>

      <div className="mt-5">
        <div
          className="h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.percentage}
          aria-label="Today's progress"
        >
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{
              width: `${progress.percentage}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>
            {progress.completed} of {progress.total} completed
          </span>

          <span>{progress.percentage}%</span>
        </div>
      </div>
    </section>
  );
}

interface ProgressStatProps {
  label: string;
  value: number;
}

function ProgressStat({ label, value }: ProgressStatProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default TodayProgress;
