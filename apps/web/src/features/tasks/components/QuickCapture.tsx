import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface QuickCaptureProps {
  onCreate: (title: string) => Promise<void>;
  disabled?: boolean;
}

function QuickCapture({ onCreate, disabled = false }: QuickCaptureProps) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
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
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row ">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Capture an idea or task..."
          disabled={creating || disabled}
        />
        <Button type="submit" disabled={creating || disabled || !title.trim()}>
          {creating ? "Adding..." : "Add task"}
        </Button>
      </div>

      <p className="mt-2 px-1 text-xs text-gray-400">Press Enter to capture</p>
    </form>
  );
}

export default QuickCapture;
