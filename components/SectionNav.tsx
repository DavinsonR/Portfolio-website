"use client";

/* An index for a long sheet. It sits under the site nav, scrolls with the reader and
   marks where they are — the same job a running head does in print. Without JS it is
   still a row of working anchors; the highlight is the only thing that needs script. */

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string };

export default function SectionNav({
  items,
  label,
  wrap = "mx-auto max-w-[980px] px-6",
}: {
  items: NavItem[];
  label: string;
  /** La medida de la página que la monta. Iba fija a 1180px y se usaba en
   *  páginas de 980: la fila de pestañas sobresalía 100px por cada lado de su
   *  propio contenido (DA-09). */
  wrap?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => n !== null);
    if (!sections.length) return;
    /* The band is the top fifth of the viewport: a section counts as read when its
       heading has cleared the navigation, not when it merely touches the bottom edge. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-118px 0px -74% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="no-print sticky top-[65px] z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className={wrap}>
        <ul className="-mb-px flex gap-1 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className={`block whitespace-nowrap border-b-2 px-3 py-2.5 text-[14px] transition-colors ${
                  active === i.id
                    ? "border-cold font-semibold text-cold"
                    : "border-transparent text-body hover:border-rule hover:text-ink"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
