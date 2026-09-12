interface EmptyStateProps {
  title: string;
  description: string;
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-8 text-center">
      <h3 className="font-medium text-gray-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

export default EmptyState;
