import Link from "next/link";
import { toolItems } from "@/lib/tools";

export default function ToolsIndexPage() {
  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Tool Directory</p>
        <h1 className="hero-title">Public Workplace Utilities</h1>
        <p className="hero-copy">
          Each utility runs fully in the browser. No tool submits your data to a backend API.
        </p>
      </header>

      <div className="tool-grid">
        {toolItems.map((tool) => (
          <article key={tool.path} className="tool-card">
            <h2>{tool.title}</h2>
            <p>{tool.summary}</p>
            <div className="tag-row">
              {tool.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={tool.path} className="button-link">
              Open Tool
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
