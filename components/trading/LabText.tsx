"use client";

import { useEffect, useState } from "react";
import { fetchIndexShared, type IndexData } from "@/lib/data/trading-sim";
import { fillLab, hasLabVars, labStatsFrom, type LabStats } from "@/lib/data/lab-stats";

/** Un texto del diccionario con cifras del laboratorio dentro («Sobrevivieron
 *  {survivors}»). El servidor lo pinta con la instantánea versionada —así la
 *  cifra está en el HTML, para el buscador y para la red que bloquea scripts—
 *  y el navegador lo actualiza con el índice vivo si llega. Si la plantilla no
 *  pide nada, no pide nada: es un `<>{texto}</>` y ningún fetch.
 *
 *  El estado inicial es el mismo texto que pintó el servidor, así que la
 *  hidratación no ve ninguna diferencia; el cambio, si lo hay, llega después. */
export default function LabText({ template, initial, lang }: { template: string; initial: LabStats; lang: string }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    if (!hasLabVars(template)) return;
    let alive = true;
    fetchIndexShared<IndexData>()
      .then(({ data }) => {
        const live = labStatsFrom(data);
        if (alive && live) setStats(live);
      })
      // Sin dato vivo se queda la instantánea, que es un dato real con fecha.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [template]);

  return <>{fillLab(template, stats, lang)}</>;
}
