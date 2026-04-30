import type { ReactNode } from "react";

type ToolShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function ToolShell({ eyebrow, title, description, children }: ToolShellProps) {
  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-copy">{description}</p>
      </header>
      <div className="tool-panel">{children}</div>
    </section>
  );
}
