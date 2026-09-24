export function SectionIntro({ eyebrow, title, description, align = "left" }: { eyebrow: string; title: string; description?: string; align?: "left" | "split" }) {
  return (
    <header className={`home-section-intro home-section-intro--${align}`}>
      <p className="home-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="home-section-description">{description}</p>}
    </header>
  );
}

export function EmptyDataNote({ children }: { children: React.ReactNode }) {
  return <p className="home-empty-note">{children}</p>;
}
