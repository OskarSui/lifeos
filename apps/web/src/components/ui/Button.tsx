import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyles =
    "min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-bg-hover)] focus:ring-[var(--color-primary)]/30",

    secondary:
      "border border-[var(--color-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] shadow-sm hover:bg-[var(--button-secondary-bg-hover)] focus:ring-[var(--color-primary)]/20",

    danger:
      "bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-bg-hover)] focus:ring-[var(--color-danger)]/30",

    ghost:
      "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] focus:ring-[var(--color-primary)]/20",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
