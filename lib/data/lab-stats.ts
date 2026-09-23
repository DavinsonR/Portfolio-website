// ============================================================
// LAS CIFRAS DEL LABORATORIO — derivadas, no escritas.
//
// «Sobrevivieron menos de 50», «publiqué las 1.342 que no», «una de cada
// ocho»: las tres estaban escritas a mano en el diccionario sobre un dato que
// el pipeline recalcula cada noche. El 16 sep sobrevivían 51; el 23 sep, 45.
// Un titular fijo sobre un dato móvil entra y sale de la verdad sin que nadie
// lo toque, y el bloque de estadísticas de la misma página —que sí lee el
// dato— lo desmentía en pantalla (auditoría del 23 sep 2026, hallazgo #3).
//
// Ahora el diccionario guarda la PLANTILLA («Sobrevivieron {survivors}») y el
// número sale de `overfitting.overall`: en el build, de la instantánea
// versionada (`lib/data/lab-snapshot.ts`); en el navegador, del índice vivo
// (`components/trading/LabText.tsx`). Este módulo es puro y sin nada de
// servidor a propósito: lo importa también el componente de cliente.
//
// `check:figures` vigila que nadie vuelva a escribir esas cifras a mano.
// ============================================================
import type { IndexData, OverfittingRow } from "./trading-sim";
import { num } from "./trading-sim";

export type LabStats = {
  variants: number;
  beatIs: number;
  survivors: number;
  survivalRate: number;
};

/** Del índice (vivo o instantánea) a los cuatro números. `null` si el export
 *  no trae el total: quien llama decide si eso es un error (el build) o un
 *  «me quedo con lo que tenía» (el navegador). */
export function labStatsFrom(data: Pick<IndexData, "overfitting"> | null | undefined): LabStats | null {
  const rows = data?.overfitting?.by_n_components ?? [];
  // El export lleva el total bajo `overall`; formas anteriores lo guardaban
  // como fila marcada dentro del array. Se aceptan las dos.
  const o: OverfittingRow | undefined = data?.overfitting?.overall ?? rows.find((r) => r.is_grand_total);
  if (!o || !o.n_variants || !o.n_beat_is || o.n_beat_is_and_oos == null) return null;
  const rate = o.oos_survival_rate ?? o.n_beat_is_and_oos / o.n_beat_is;
  return { variants: o.n_variants, beatIs: o.n_beat_is, survivors: o.n_beat_is_and_oos, survivalRate: rate };
}

const ONE_IN = {
  es: ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"],
  en: ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"],
};

/** Lo que una plantilla puede pedir.
 *
 *  `oneIn` es «una de cada N» con N redondeado (13,0 % → ocho; 14,8 % → siete),
 *  escrito con letra como el resto de la prosa. `survivalPct` va sin decimales:
 *  en prosa «13 %» es la cifra que se recuerda, y el bloque de estadísticas del
 *  laboratorio ya da el decimal. */
export function labValues(s: LabStats, lang: string): Record<string, string> {
  const l = lang === "es" ? "es" : "en";
  const oneIn = Math.max(2, Math.round(1 / s.survivalRate));
  return {
    variants: num(lang, s.variants, 0),
    beatIs: num(lang, s.beatIs, 0),
    survivors: num(lang, s.survivors, 0),
    eliminated: num(lang, s.variants - s.survivors, 0),
    oneIn: ONE_IN[l][oneIn] ?? String(oneIn),
    survivalPct: new Intl.NumberFormat(l === "es" ? "es-CO" : "en-US", {
      style: "percent",
      maximumFractionDigits: 0,
    }).format(s.survivalRate),
  };
}

const VAR = /\{(variants|beatIs|survivors|eliminated|oneIn|survivalPct)\}/g;
const HAS = /\{(?:variants|beatIs|survivors|eliminated|oneIn|survivalPct)\}/;

export const hasLabVars = (template: string) => HAS.test(template);

/** Rellena la plantilla. Sin variables devuelve el texto tal cual, así que se
 *  puede aplicar a cualquier cadena del diccionario sin mirar antes. */
export function fillLab(template: string, stats: LabStats, lang: string): string {
  if (!HAS.test(template)) return template;
  const v = labValues(stats, lang);
  return template.replace(VAR, (_, k: string) => v[k]);
}
