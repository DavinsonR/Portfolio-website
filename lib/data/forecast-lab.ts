/* El contrato con macro-forecast-lab-latam: `public/forecast-lab/*.json`.

   Lo genera `uv run python -m macro_lab.exportar_web` en ese repositorio y se copia
   tal cual; aquí no se recalcula ningún modelo. El exportador ya comprobó que cada
   pronóstico cuadra con su período y con el valor real, así que esta capa solo lee,
   alinea por índice y mide errores. Un `null` es un fallo del modelo en ese origen,
   no un cero: se salta, nunca se rellena. */

export type ModelId = "naive" | "ar1" | "arima" | "rf" | "lstm" | "comb";
export type Freq = "anual" | "trimestral";
export type Regime = "calma" | "ruptura";

export type Country = { iso3: string; es: string; en: string; anual: boolean; trimestral: boolean };

export type Meta = {
  version: string;
  commit: string;
  generado: string;
  repositorio: string;
  ruptura: [number, number];
  paises: Country[];
  modelos: { id: ModelId; nombre: string }[];
  trimestral_ajustada: string[];
};

/** Una serie: `y` completa desde `inicio`; `pron[m][j]` pronostica `y[o0 + j]`
 *  con los datos hasta `y[o0 + j - 1]`. */
export type Series = {
  iso3: string;
  inicio: string;
  o0: number;
  y: (number | null)[];
  pron: Record<ModelId, (number | null)[]>;
};

export type AggCell = { mediana: number | null; p: number | null; n: number | null; sig: number | null };
export type AggRow = { modelo: string; id: ModelId | null; calma: AggCell; ruptura: AggCell };
export type RelRow = { iso3: string; regimen: Regime; modelo: ModelId; rel: number | null; p: number | null; sig: boolean };
export type FrontierRow = { iso3: string; completos: number[]; contiguos: number[] };
export type HolmRow = { modelo: string; ganancia: number | null; p: number | null; holm: number | null };
export type FreqRow = { brazo: "M" | "A" | "B" | "C"; modelo: "lstm" | "naive" | "ar1"; mae: number | null; ganancia: number | null; p: number | null; holm: number | null };

export type Summary = {
  agregado: Record<Freq, AggRow[]>;
  relativo: Record<Freq, RelRow[]>;
  frontera: FrontierRow[];
  holm: HolmRow[];
  frecuencia: FreqRow[];
};

export const BASE = "/forecast-lab";

const cache = new Map<string, Promise<unknown>>();

/** Una petición por archivo y por sesión, la compartan cuantos widgets la compartan.
 *  Si falla, se borra de la caché para que «reintentar» vuelva a pedirla. */
export function load<T>(file: string): Promise<T> {
  let p = cache.get(file) as Promise<T> | undefined;
  if (!p) {
    p = fetch(`${BASE}/${file}`).then((r) => {
      if (!r.ok) throw new Error(`${file}: ${r.status}`);
      return r.json() as Promise<T>;
    });
    p.catch(() => cache.delete(file));
    cache.set(file, p);
  }
  return p;
}

export const loadMeta = () => load<Meta>("meta.json");
export const loadSeries = (f: Freq) => load<Series[]>(`series_${f}.json`);
export const loadSummary = () => load<Summary>("resumen.json");

// ---------------------------------------------------------------- períodos

/** Etiqueta del período i de una serie: "1961" + i, o "2006Q1" + i trimestres. */
export function periodLabel(inicio: string, i: number): string {
  const q = /^(\d{4})Q([1-4])$/.exec(inicio);
  if (!q) return String(Number(inicio) + i);
  const k = Number(q[1]) * 4 + (Number(q[2]) - 1) + i;
  return `${Math.floor(k / 4)}Q${(k % 4) + 1}`;
}

export const yearOf = (label: string) => Number(label.slice(0, 4));

export function regimeOf(label: string, ruptura: readonly number[]): Regime {
  const y = yearOf(label);
  return y >= ruptura[0] && y <= ruptura[ruptura.length - 1] ? "ruptura" : "calma";
}

/** Número de orígenes evaluados en una serie. */
export const nOrigins = (s: Series) => s.y.length - s.o0;

// ---------------------------------------------------------------- errores

/** Errores absolutos de un modelo en los orígenes [desde, hasta), saltando fallos. */
export function absErrors(s: Series, m: ModelId, from = 0, to = nOrigins(s)): number[] {
  const out: number[] = [];
  for (let j = from; j < to; j++) {
    const f = s.pron[m][j];
    const y = s.y[s.o0 + j];
    if (f != null && y != null) out.push(Math.abs(f - y));
  }
  return out;
}

export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** MAE de un modelo relativo al ingenuo, sobre los mismos orígenes (pares completos). */
export function relMae(s: Series, m: ModelId, from = 0, to = nOrigins(s), keep?: (j: number) => boolean): number {
  let a = 0, b = 0, n = 0;
  for (let j = from; j < to; j++) {
    if (keep && !keep(j)) continue;
    const f = s.pron[m][j], g = s.pron.naive[j], y = s.y[s.o0 + j];
    if (f == null || g == null || y == null) continue;
    a += Math.abs(f - y);
    b += Math.abs(g - y);
    n++;
  }
  return n && b ? a / b : NaN;
}

// ---------------------------------------------------------------- formato

const nf = (lang: string, d: number) =>
  new Intl.NumberFormat(lang === "en" ? "en-US" : "es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });

export function num(lang: string, v: number | null | undefined, d = 1): string {
  return v == null || !Number.isFinite(v) ? "—" : nf(lang, d).format(v);
}

/** Un valor con signo explícito: +2,3 / −1,4 (menos tipográfico, no guion). */
export function signed(lang: string, v: number | null | undefined, d = 1): string {
  if (v == null || !Number.isFinite(v)) return "—";
  const s = nf(lang, d).format(Math.abs(v));
  return v > 0 ? `+${s}` : v < 0 ? `−${s}` : s;
}

/** p con el piso honesto: por debajo de 0,001 no se escribe un cero. */
export function pval(lang: string, v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return v < 0.001 ? (lang === "en" ? "< 0.001" : "< 0,001") : nf(lang, 3).format(v);
}

export const countryName = (c: Country | undefined, lang: string) => (c ? (lang === "en" ? c.en : c.es) : "");

// ---------------------------------------------------------------- panel descriptivo

export type IndicatorId =
  | "pib_crecimiento" | "pib_per_capita" | "inflacion_ipc" | "desempleo" | "cuenta_corriente_pib"
  | "exportaciones_pib" | "inversion_pib" | "credito_privado_pib" | "remesas_pib" | "ied_pib";

export type Indicator = { id: IndicatorId; es: string; en: string; unidad_es: string; unidad_en: string; log: boolean };

/** Panel anual del Banco Mundial: `datos[iso3][indicador][i]` es el valor de `anios[i]`. */
export type Panel = {
  anios: number[];
  indicadores: Indicator[];
  datos: Record<string, Record<IndicatorId, (number | null)[]>>;
  fuente: string;
  /** Tramos de la fuente que se sabe rotos y llegan enmascarados (null). */
  defectos?: { iso3: string; indicador: string; desde: number; hasta: number }[];
};

/** ISE mensual sin ajuste estacional (DANE, Cuadro 1): 16 series desde `inicio` (AAAA-MM). */
export type Ise = { inicio: string; series: { id: string; es: string; en: string; v: (number | null)[] }[]; fuente: string };

export type EventCat = "deuda" | "bancaria" | "hiperinflacion" | "cambiaria" | "reforma" | "externo" | "politica" | "desastre";
export type EconEvent = {
  iso3: string; anio: number; mes: number | null; cat: EventCat;
  titulo_es: string; texto_es: string; titulo_en: string; texto_en: string;
};
export type Events = { categorias: { id: EventCat; es: string; en: string }[]; eventos: EconEvent[] };

export const loadPanel = () => load<Panel>("panel.json");
export const loadIse = () => load<Ise>("ise.json");
export const loadEvents = () => load<Events>("eventos.json");

/** Escala simétrica logarítmica: conserva el signo y el cero, y deja ver en el mismo eje
 *  una inflación de 3 % y una de 10.000 %. */
export const symlog = (v: number) => Math.sign(v) * Math.log10(1 + Math.abs(v));
export const symexp = (u: number) => Math.sign(u) * (10 ** Math.abs(u) - 1);

/** Media y desviación estándar muestral de los valores finitos. */
export function stats(xs: (number | null | undefined)[]): { n: number; mean: number; sd: number } {
  const v = xs.filter((x): x is number => x != null && Number.isFinite(x));
  const n = v.length;
  if (!n) return { n, mean: NaN, sd: NaN };
  const m = v.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)) : NaN;
  return { n, mean: m, sd };
}

/** Perfil estacional: desvío medio de cada mes respecto del promedio de su año, en %,
 *  usando solo años completos. Es la estacionalidad que el ajuste del DANE quitaría. */
export function seasonalProfile(values: (number | null)[], startMonth: number): number[] {
  const byMonth: number[][] = Array.from({ length: 12 }, () => []);
  const firstFull = (13 - startMonth) % 12; // índice del primer enero (startMonth 1 = enero)
  for (let i = firstFull; i + 12 <= values.length; i += 12) {
    const year = values.slice(i, i + 12);
    if (year.some((x) => x == null)) continue;
    const m = (year as number[]).reduce((a, b) => a + b, 0) / 12;
    year.forEach((x, k) => byMonth[k].push(((x as number) / m - 1) * 100));
  }
  return byMonth.map((xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN));
}
