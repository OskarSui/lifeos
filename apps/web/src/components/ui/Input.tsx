import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`min-h-11 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 text-sm text-[var(--input-text)] outline-none transition-colors placeholder:text-[var(--input-placeholder)] hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:ring-2 focus:ring-[var(--input-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}

export default Input;
