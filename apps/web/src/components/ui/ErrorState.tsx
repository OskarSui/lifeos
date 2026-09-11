interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
}

function ErrorState({ message, onRetry, retrying = false }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <h3 className="font-medium text-red-900">Something went wrong</h3>

      <p className="mt-2 text-sm text-red-700">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-4 min-h-11 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {retrying ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}

export default ErrorState;
