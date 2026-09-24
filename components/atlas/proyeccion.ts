import type { Series } from "./types";

/* La capa de proyección de la tesis (ADR-019 a ADR-023) en tres funciones puras, para que
   el componente, el renderizador y las pruebas lean la misma regla. */

/* Los años proyectados solo existen para los indicadores de proyección, y al revés. Sin
   esta separación el deslizador ofrecía 2026-2028 para el índice compuesto y el lector se
   encontraba un mapa vacío con «0 de 33 unidades con dato»: un hueco correcto en los datos
   leído como una avería del sitio. */
export function aniosDelGrupo(anios: number[], proyectados: number[] | undefined, esProyeccion: boolean): number[] {
  const p = new Set(proyectados ?? []);
  if (!p.size) return anios;
  return anios.filter((a) => p.has(a) === esProyeccion);
}

/* El exportador de la tesis publica el crecimiento por habitante MEDIDO como fracción
   (0,0148) y el PROYECTADO en por ciento (1,55). Con la proyección visible, Meta pasaba
   de «+0,01» en 2025 a «2,59» en 2026: una aceleración de doscientas veces que no existe.
   Se convierte aquí, una vez, al cargar. La guarda (ningún valor fuera de ±1) evita la
   doble conversión el día que el exportador lo publique en por ciento. */
export const EN_FRACCION = ["crecimiento_pib_real_pc"];

export function enPorCiento(series: Series): Series {
  let cambio = false;
  const out: Series["series"] = { ...series.series };
  for (const id of EN_FRACCION) {
    const m = series.series[id];
    if (!m) continue;
    const vs = m.flat().filter((v): v is number => v !== null && Number.isFinite(v));
    if (!vs.length || vs.some((v) => Math.abs(v) >= 1)) continue;
    out[id] = m.map((fila) => fila.map((v) => (v === null ? null : v * 100)));
    cambio = true;
  }
  return cambio ? { ...series, series: out } : series;
}

/* Meses entre el corte del ancla y hoy. Se calcula en el navegador y no se lee del JSON:
   `antiguedad_meses` se congela el día de la exportación y con el tiempo subestima la edad. */
export function mesesDesde(fecha: string, hoy: number): number | null {
  const t = Date.parse(`${fecha}T00:00:00Z`);
  if (!Number.isFinite(t) || hoy < t) return null;
  return (hoy - t) / (1000 * 60 * 60 * 24 * 30.4375);
}

/* Solo las dos series ancladas al consenso nacional llevan el ancla; la versión sin anclar
   (ADR-021) y el ancho del intervalo no. Decir «anclado al FMI» sobre la serie que se
   titula «sin anclar» eran dos afirmaciones contrarias en el mismo mapa. */
export const esAnclada = (id: string) => id.endsWith("_proy") && id !== "intervalo_ancho_proy";

/* La lectura del escenario de la tesis habla del ancla («si Colombia crece lo que espera el
   FMI…»): solo acompaña a las series ancladas. Y trae congelada la edad del ancla del día de
   la exportación («con 16 meses de antigüedad»); la edad viva ya está en la línea del ancla,
   así que se quita de aquí para que la página no diga dos edades distintas. */
export function lecturaEscenario(id: string, lectura: string | undefined): string | null {
  if (!lectura || !esAnclada(id)) return null;
  return lectura.replace(/,\s*con \d+(?:[.,]\d+)? meses de antigüedad/, "");
}

/* El corte del ancla como fecha, o null si la exportación cambia de formato: un
   `Intl.DateTimeFormat` sobre una fecha inválida lanza y tumbaría el atlas entero. */
export function fechaCorte(fecha: string): number | null {
  const t = Date.parse(`${fecha}T00:00:00Z`);
  return Number.isFinite(t) ? t : null;
}

/* El ancho del intervalo es la capa de incertidumbre (ADR-022, decisión 4). Atenuarla por
   su propio valor invertía la rampa: el más incierto se veía como uno del medio. */
export const ANCHO = "intervalo_ancho_proy";

/* La misma plantilla que usa render.ts; aquí para que Atlas.tsx no cargue el renderizador
   (d3 y la geometría) solo por rellenar una frase. */
export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
