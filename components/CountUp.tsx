"use client";

import { useEffect, useRef, useState } from "react";

/* A figure on a tear sheet arrives by being counted, not by fading.
   The value ships rendered in full from the server, so a reader
   without JS — or one who asked for stillness — sees the final
   number and never a zero. Prefix and suffix ("15+", "10+ hrs/mo")
   are preserved exactly as written. */

export const SHAPE = /^(\D*?)(\d[\d.,]*)([\s\S]*)$/;

export default function CountUp({
  value,
  lang,
  className,
}: {
  value: string;
  lang?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = SHAPE.exec(value);
    if (!el || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, pre, digits, post] = m;
    const target = Number(digits.replace(/[.,]/g, ""));
    if (!Number.isFinite(target) || target === 0) return;

    const fmt = (n: number) =>
      `${pre}${new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US").format(n)}${post}`;

    let raf = 0;
    let start = 0;
    const DUR = 1100;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min((t - start) / DUR, 1);
          // easeOutExpo: fast to the neighbourhood, then settles
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setShown(fmt(Math.round(target * eased)));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        setShown(fmt(0));
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, lang]);

  /* Durante 1.100 ms el nodo enseña un número que no es el de la página: quien
     lo recorre con el cursor virtual a mitad de cuenta se lleva "847" donde
     dice 1.347. El valor animado se oculta a la asistencia y el real viaja al
     lado, siempre correcto y sin depender de que la cuenta haya terminado. */
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
