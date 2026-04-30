import Link from "next/link";
import {
  categoryDescriptions,
  categoryIcons,
  toolCategories,
  toolItems,
} from "@/lib/tools";

export const metadata = {
  title: "All Tools | Public Workplace Tools",
};

export default function ToolsIndexPage() {
  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Tool Directory</p>
        <h1 className="hero-title">All Workplace Utilities</h1>
        <p className="hero-copy">
          Every utility runs in your browser. No tool sends your data to a backend or third-party API.
        </p>
      </header>

      {toolCategories.map((category) => {
        const tools = toolItems.filter((tool) => tool.category === category);
        if (tools.length === 0) return null;
        const CategoryIcon = categoryIcons[category];

        return (
          <section key={category} className="category-block">
            <header className="category-header">
              <CategoryIcon aria-hidden />
              <div>
                <h2>{category}</h2>
                <p>{categoryDescriptions[category]}</p>
              </div>
            </header>

            <div className="tool-grid">
              {tools.map((tool) => (
                <article key={tool.path} className="tool-card">
                  <div className="tool-card-head">
                    <span className="tool-card-icon" aria-hidden>
                      <tool.Icon />
                    </span>
                    <h3>{tool.title}</h3>
                  </div>
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
      })}
    </section>
  );
}
