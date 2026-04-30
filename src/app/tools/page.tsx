import ToolDirectory from "@/components/tool-directory";

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

      <ToolDirectory />
    </section>
  );
}

