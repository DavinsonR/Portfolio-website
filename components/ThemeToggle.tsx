"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

/** Sun / moon drawn at one stroke weight — no emoji, no icon font. */
function Glyph({ mode }: { mode: Mode }) {
  return mode === "dark" ? (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M8 1.4v1.5M8 13.1v1.5M1.4 8h1.5M13.1 8h1.5M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1" />
      </g>
    </svg>
  );
}

export default function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const [mode, setMode] = useState<Mode | null>(null);

  // localStorage y matchMedia no existen durante el prerender estático, así que
  // el modo real solo se puede conocer después de montar. No hay versión de esto
  // derivable en el render: es estado del navegador, no del componente.
  useEffect(() => {
    // El script de arranque ya estampó `data-theme` antes del primer pintado
    // cuando había preferencia guardada; se lee de ahí antes que de nada.
    const stamped = document.documentElement.getAttribute("data-theme");
    // `localStorage` LANZA en modo privado estricto y bajo políticas de empresa
    // que apagan el almacenamiento; el script de arranque ya lo envuelve, y un
    // efecto de React que lanza se lleva la página entera, no solo el botón.
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {}
    const stored = stamped === "light" || stamped === "dark" ? stamped : saved;
    const resolved: Mode =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(resolved);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Sin almacenamiento el tema dura lo que dura la pestaña. Es lo correcto.
    }
  };

  // Renders inert until the real mode is known, so the icon never flips on load.
  const next: Mode = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      // Sin `mode` todavía no se sabe qué hace el botón: hasta que se sepa, el
      // nombre no afirma una dirección que puede ser la contraria.
      aria-label={mode ? (next === "dark" ? labels.dark : labels.light) : labels.dark}
      aria-pressed={mode ? mode === "dark" : undefined}
      title={mode ? (next === "dark" ? labels.dark : labels.light) : undefined}
      className="no-print inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-control text-body transition-colors hover:border-cold hover:text-cold"
    >
      {mode ? <Glyph mode={next} /> : <span className="h-[15px] w-[15px]" />}
    </button>
  );
}
