interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-(--card-border) bg-(--card-bg) shadow-(--card-shadow) ${className}`}
    >
      {children}
    </section>
  );
}

export default Card;
