"use client";

/* Una isla por pieza interactiva, repartidas entre las secciones de la página. Esta
   parte es la única que baja con el HTML y pesa casi nada: una puerta que se abre
   600 px antes de que la pieza entre en pantalla (el mismo patrón que el atlas, por
   FALLO-30). Las piezas, sus gráficos y sus datos se piden al abrirse la puerta, así que
   quien nunca llega hasta aquí no los descarga, y el presupuesto de peso de la página
   no los cuenta. */

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { LabCopy } from "@/lib/content/forecast";

export type Kind = "dashboard" | "play" | "backtest" | "region" | "frequency" | "holm";

const Widgets = lazy(() => import("./widgets"));
// El panel es su propio fragmento: quien solo mira el panorama no baja las piezas, y viceversa.
const Dashboard = lazy(() => import("./dashboard"));

export default function Island({ kind, copy, lang }: { kind: Kind; copy: LabCopy; lang: string }) {
  /* Nace cerrada en el servidor Y en el cliente: si naciera abierta donde no hay
     observador (el servidor no lo tiene), el HTML traería las piezas y el cliente la
     puerta, y React avisaría de una hidratación que no cuadra (#418). Un navegador sin
     IntersectionObserver la abre en cuanto monta. */
  const [near, setNear] = useState(false);
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (near) return;
    const el = shell.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setNear(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const placeholder = (
    <p role="status" className="py-16 text-center text-[14px] text-muted">
      {copy.loading}
    </p>
  );

  return (
    <div ref={shell} className="fl-shell">
      {near ? (
        <Suspense fallback={placeholder}>
          {kind === "dashboard" ? <Dashboard copy={copy} lang={lang} /> : <Widgets kind={kind as Exclude<Kind, "dashboard">} copy={copy} lang={lang} />}
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
