"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGithub, FiGrid, FiHome } from "react-icons/fi";

const links = [
  { href: "/", label: "Home", Icon: FiHome },
  { href: "/tools", label: "All Tools", Icon: FiGrid },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="site-nav">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${isActive ? "nav-link-active" : ""}`}
          >
            <link.Icon aria-hidden />
            <span>{link.label}</span>
          </Link>
        );
      })}
      <a
        href="https://github.com/gmook9/publictools"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link"
      >
        <FiGithub aria-hidden />
        <span>GitHub</span>
      </a>
    </nav>
  );
}
