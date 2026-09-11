interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger";

function Badge({ children, variant = "neutral" }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-text)]",

    primary: "bg-[var(--badge-primary-bg)] text-[var(--badge-primary-text)]",

    success: "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",

    warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",

    danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
