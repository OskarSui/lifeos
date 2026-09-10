import { useState, type FormEvent } from "react";

interface GoalFormProps {
  onCreate: (title: string, description: string) => Promise<void>;
  disabled?: boolean;
}

function GoalForm({ onCreate, disabled = false }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || creating || disabled) {
      return;
    }
    try {
      setCreating(true);

      await onCreate(trimmedTitle, trimmedDescription);

      setTitle("");
      setDescription("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Direction</p>

        <h2 className="mt-1 text-lg font-semibold text-gray-900">Create a goal</h2>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="goal-title" className="mb-1 block text-sm font-medium text-gray-700">
            Goal
          </label>

          <input
            id="goal-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            disabled={disabled || creating}
            placeholder="What do you want to achieve?"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="goal-description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="goal-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={5000}
            rows={3}
            disabled={disabled || creating}
            placeholder="Why does this goal matter?"
            className="w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || creating || title.trim().length === 0}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create goal"}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;
