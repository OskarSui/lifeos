import { useState } from "react";

interface QuickCaptureProps {
  onCreate: (title: string) => Promise<void>;
  disabled?: boolean;
}

function QuickCapture({ onCreate, disabled = false }: QuickCaptureProps) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || creating || disabled) {
      return;
    }

    try {
      setCreating(true);

      await onCreate(trimmedTitle);

      setTitle("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={disabled || creating}
          maxLength={200}
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
        />

        <button
          type="submit"
          disabled={disabled || creating || title.trim().length === 0}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "Adding..." : "Add"}
        </button>
      </div>

      <p className="mt-2 px-1 text-xs text-gray-400">Press Enter to capture</p>
    </form>
  );
}

export default QuickCapture;
