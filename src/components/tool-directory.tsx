"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import {
  categoryDescriptions,
  categoryIcons,
  toolCategories,
  toolItems,
} from "@/lib/tools";

export default function ToolDirectory() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!trimmed) return toolItems;
    return toolItems.filter((tool) => {
      const haystack = `${tool.title} ${tool.summary} ${tool.category} ${tool.tags.join(" ")}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [trimmed]);

  return (
    <>
      <div className="search-wrap" role="search">
        <FiSearch aria-hidden className="search-icon" />
        <input
          type="search"
          className="search-input"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="Search tools by name, tag, or category..."
          aria-label="Search tools"
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <FiX aria-hidden />
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="meta-note">
          No tools match <strong>{query}</strong>. Try a different search.
        </p>
      ) : (
        toolCategories.map((category) => {
          const categoryTools = filtered.filter((tool) => tool.category === category);
          if (categoryTools.length === 0) return null;
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
                {categoryTools.map((tool) => (
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
        })
      )}
    </>
  );
}
