"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XpBar } from "./xp-bar";

// Prompts (/learn/prompts) et Playground (/learn/playground) restent
// accessibles par URL et via les liens du contenu, mais hors nav (guidage).
const LINKS = [
  { href: "/learn", label: "Académie", exact: true },
  { href: "/learn/glossaire", label: "Glossaire" },
];

/** Sous-navigation de l'académie + barre d'XP, sticky sous le header global. */
export function AcademyNav() {
  const pathname = usePathname();
  return (
    <div className="sticky top-[49px] z-10 -mx-4 border-b border-border bg-background/85 px-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <nav className="flex items-center gap-1 font-mono text-xs">
          {LINKS.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <XpBar compact />
      </div>
    </div>
  );
}
