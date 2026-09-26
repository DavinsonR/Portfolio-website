"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "done" | "fail";

/** Glifos al mismo trazo que el resto del sistema: 1,3px sobre caja de 16. */
function Glyph({ state }: { state: State }) {
  return state === "done" ? (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path d="M3.2 8.4 6.4 11.6 12.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <rect x="5.6" y="5.6" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.4 3.6V3a.6.6 0 0 0-.6-.6H3a.6.6 0 0 0-.6.6v6.8c0 .33.27.6.6.6h.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** Copiar la dirección al portapapeles.
 *
 *  `mailto:` es el único camino de contacto que tenía la página, y es el que más
 *  falla justo en la máquina del lector objetivo: un reclutador en Outlook Web o
 *  Gmail dentro del navegador corporativo hace clic y no pasa nada — sin error,
 *  sin ventana, sin nada que reintentar. Este botón no sustituye al `mailto:`;
 *  cubre el caso en que el `mailto:` es un clic muerto.
 *
 *  Sin JS el botón no se pinta: la dirección ya está en texto plano al lado, así
 *  que no hay nada que degradar. Si el portapapeles se niega (contexto inseguro,
 *  permiso denegado), el componente lo dice y deja la dirección seleccionable en
 *  vez de fingir que copió. */
export default function CopyEmail({
  email,
  labels,
  className = "",
}: {
  email: string;
  labels: { copy: string; copied: string; fail: string };
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("done");
      timer.current = setTimeout(() => setState("idle"), 2400);
    } catch {
      setState("fail");
    }
  };

  if (state === "fail") {
    return (
      <p className={`text-[14px] leading-[1.5] text-body ${className}`}>
        {labels.fail}{" "}
        <span className="break-all text-ink select-all">{email}</span>
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`lift inline-flex items-center gap-2 rounded-[3px] border border-control px-3 py-2 text-[14px] font-semibold transition-colors hover:border-cold hover:text-cold ${
        state === "done" ? "border-pos text-pos" : "text-ink"
      } ${className}`}
    >
      <Glyph state={state} />
      {state === "done" ? labels.copied : labels.copy}
      {/* El cambio de etiqueta lo ve quien mira; esto lo anuncia a quien escucha. */}
      <span aria-live="polite" className="sr-only">
        {state === "done" ? labels.copied : ""}
      </span>
    </button>
  );
}
