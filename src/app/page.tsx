import Link from "next/link";
import { FiGithub, FiShield, FiZap } from "react-icons/fi";
import { toolItems } from "@/lib/tools";

const featurePoints = [
  {
    Icon: FiShield,
    title: "Local-only processing",
    body: "Every conversion runs in your browser tab. No uploads, no analytics, no server inspection.",
  },
  {
    Icon: FiZap,
    title: "Fast and dependency-light",
    body: "Built on a small set of vetted libraries. The site is statically rendered and cache-friendly.",
  },
  {
    Icon: FiGithub,
    title: "Open and auditable",
    body: "All source code is available so security teams can review it before approving usage.",
  },
];

export default function Home() {
  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Workplace-Ready</p>
        <h1 className="hero-title">Secure, Client-side Utility Hub</h1>
        <p className="hero-copy">
          A single place for common workplace conversion and inspection tasks. Sensitive data
          never leaves your browser, so this site is safe to use for internal payloads.
        </p>
        <div className="button-row">
          <Link href="/tools" className="button-link">
            Browse All Tools
          </Link>
          <a
            href="https://github.com/gmook9/publictools"
            target="_blank"
            rel="noopener noreferrer"
            className="button-link button-ghost"
          >
            <FiGithub aria-hidden />
            <span style={{ marginLeft: "0.4rem" }}>GitHub Repository</span>
          </a>
        </div>
      </header>

      <div className="feature-grid">
        {featurePoints.map((feature) => (
          <article key={feature.title} className="feature-card">
            <feature.Icon aria-hidden />
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>

      <div className="tool-grid">
        {toolItems.map((tool) => (
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
              Launch
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
