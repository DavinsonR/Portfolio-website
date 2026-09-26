"use client";

import { useEffect, useRef } from "react";

/** Un envoltorio que publica `--k = viewBox / ancho real` para los SVG que se
 *  escalan con `width: 100%`.
 *
 *  Un gráfico con `viewBox` de 720 en un contenedor de 297px (teléfono de
 *  393px con sus márgenes) se pinta a escala 0,41: un `font-size` de 10 en
 *  unidades del viewBox son 4,1px en pantalla — «some letters are super small»,
 *  la queja textual de un revisor real (DA-02). Los `<text>` ponen su tamaño
 *  como `calc(12px * var(--k))`: en unidades del viewBox crece justo lo que la
 *  escala encoge, y en pantalla mide siempre 12px. Por encima de la medida del
 *  viewBox `--k` se queda en 1 y el texto escala con el gráfico, como antes.
 *
 *  Es un componente de cliente que acepta hijos de servidor: los cuatro
 *  gráficos de credit-risk siguen siendo SVG de servidor sin JavaScript propio;
 *  lo único que hidrata es este `div` y su ResizeObserver. */
export default function ScaleAware({
  base,
  className,
  children,
}: {
  /** El ancho del viewBox del SVG envuelto. */
  base: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => el.style.setProperty("--k", String(Math.max(1, base / Math.max(1, el.clientWidth))));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [base]);

  return (
    <div ref={ref} className={className} style={{ "--k": 1 } as React.CSSProperties}>
      {children}
    </div>
  );
}
