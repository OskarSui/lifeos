interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div
      className="rounded-xl border bg-white p-8 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"
        aria-hidden="true"
      />

      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export default LoadingState;
