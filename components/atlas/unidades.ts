/* Unidades y ancla de la capa de proyección (D-36): reglas puras que comparten el
   componente, el renderizador y las pruebas. */

/* El exportador de la tesis publica el crecimiento por habitante MEDIDO como fracción
   (0,0148) y el PROYECTADO en por ciento (1,55). Con la proyección visible, Meta pasaba de
   «+0,01» en 2025 a «2,59» en 2026: una aceleración de doscientas veces que no existe. Se
   convierte aquí, una vez, al cargar. La guarda (ningún valor fuera de ±1) evita la doble
   conversión el día que el exportador lo publique en por ciento. */
export const EN_FRACCION = ["crecimiento_pib_real_pc"];

type ConSeries = { series: Record<string, (number | null)[][]> };

export function enPorCiento<T extends ConSeries>(s: T): T {
  let cambio = false;
  const out = { ...s.series };
  for (const id of EN_FRACCION) {
    const m = s.series[id];
    if (!m) continue;
    const vs = m.flat().filter((v): v is number => v !== null && Number.isFinite(v));
    if (!vs.length || vs.some((v) => Math.abs(v) >= 1)) continue;
    out[id] = m.map((fila) => fila.map((v) => (v === null ? null : v * 100)));
    cambio = true;
  }
  return cambio ? { ...s, series: out } : s;
}

/* Unidad de cada cifra. Las etiquetas del export no la traen: sin ella «2,62» no dice si es
   un por ciento o un índice, y el ancho del intervalo son puntos porcentuales. */
export function unidad(id: string, locale: string): string {
  if (id === "intervalo_ancho_proy") return " pp";
  if (id.startsWith("crecimiento_")) return locale.startsWith("es") ? " %" : "%";
  return "";
}

/* Solo las dos series reconciliadas con el consenso nacional llevan el ancla. La versión
   sin anclar (ADR-021) y el ancho del intervalo no: decir «escenario condicional al ancla»
   bajo la capa titulada «sin anclar al consenso» eran dos afirmaciones contrarias. */
export const esAnclada = (id: string) => id.endsWith("_proy") && id !== "intervalo_ancho_proy";
