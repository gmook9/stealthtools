"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolItems } from "@/lib/tools";

const baseLinks = [{ href: "/", label: "Home" }, { href: "/tools", label: "All Tools" }];

export default function SiteNav() {
  const pathname = usePathname();

  const links = [
    ...baseLinks,
    ...toolItems.map((tool) => ({ href: tool.path, label: tool.title })),
  ];

  return (
    <nav aria-label="Main navigation" className="site-nav">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${isActive ? "nav-link-active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
