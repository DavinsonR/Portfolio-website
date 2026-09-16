/** Datos de la página de credit-risk-mlops.
 *
 *  NINGÚN NÚMERO SE ESCRIBE AQUÍ. Todo sale de `lib/credit-risk-data/`, que es una
 *  copia literal del bundle `exports/web/` del repositorio del modelo — el mismo
 *  bundle que allá tiene un control (`run web-check`) verificando que coincide con
 *  los exports que lo generaron. La cadena es: predicciones guardadas → export →
 *  bundle → esta página.
 *
 *  Lo que este archivo sí hace es DERIVAR: pasar proporciones a puntos
 *  porcentuales, elegir la cosecha más reciente, dar formato. Cada derivación está
 *  a la vista, que es la diferencia entre transformar y teclear.
 */

import economia from "./credit-risk-data/economia.json";
import equidad from "./credit-risk-data/equidad.json";
import evento from "./credit-risk-data/evento.json";
import manifest from "./credit-risk-data/manifest.json";
import modelos from "./credit-risk-data/modelos.json";
import monitoreo from "./credit-risk-data/monitoreo.json";
import provenance from "./credit-risk-data/PROVENANCE.json";
import umbrales from "./credit-risk-data/umbrales.json";
import vocabulario from "./credit-risk-data/vocabulario.json";

export const REPO = "https://github.com/DavinsonR/credit-risk-mlops";
/** La demo es bilingüe y toma el idioma de `?lang=`. Se lo pasamos explícitamente
 *  para que no dependa del idioma del navegador: quien está leyendo la página en
 *  inglés quiere la demo en inglés, aunque su Chrome esté en otra cosa.
 *
 *  Es `index.html` y no el directorio: `public/` sirve archivos, no resuelve
 *  índices de carpeta. */
export function demoHref(lang: string): string {
  return `/credit-risk-demo/index.html?lang=${lang === "es" ? "es" : "en"}`;
}

export const CR = {
  manifest,
  provenance,
  economia,
  equidad,
  evento,
  modelos,
  monitoreo,
  umbrales,
  vocabulario,
} as const;

// ---------------------------------------------------------------- el acantilado

export type CliffPoint = { fy: number; sinSoporte: number; n: number };

/** Masa de `business_age` que cae en categorías sin soporte, por cosecha.
 *
 *  `sin_soporte` es un mapa variable → proporción y sólo trae las variables que
 *  cruzaron el umbral, así que una cosecha sin problema no tiene la clave. Ausencia
 *  significa cero, y conviene decirlo: leerlo como `undefined` rompería la serie
 *  justo en los años donde el modelo estaba bien. */
export const cliff: CliffPoint[] = monitoreo.deriva.cohortes.map((c) => ({
  fy: c.approval_fy,
  sinSoporte: (c.sin_soporte as Record<string, number>).business_age ?? 0,
  n: c.n,
}));

export const cliffLatest = cliff[cliff.length - 1];
export const cliffFirstBreak = cliff.find((p) => p.sinSoporte > 0)!;

// ---------------------------------------------------------------- estudio de evento

export type EventPoint = {
  anio: number;
  gamma: number;
  lo: number;
  hi: number;
  fase: "previo" | "base" | "shock" | "post";
};

const BASE_YEAR = 2021;
const SHOCK_YEAR = 2022;

export const eventPoints: EventPoint[] = evento.coeficientes.map((c) => ({
  anio: c.anio,
  gamma: c.gamma_pp,
  lo: c.ic95_lo,
  hi: c.ic95_hi,
  fase:
    c.anio === BASE_YEAR
      ? "base"
      : c.anio < BASE_YEAR
        ? "previo"
        : c.anio === SHOCK_YEAR
          ? "shock"
          : "post",
}));

export const gapByYear = evento.brecha_por_anio;
export const regimes = evento.regimenes;
export const umbralPP = evento.umbral_economico_pp;

/** El peor coeficiente previo: es el que hace fallar el test de tendencias
 *  paralelas, y por tanto el que decide que no se publique un efecto. */
export const worstPre = eventPoints
  .filter((p) => p.fase === "previo")
  .reduce((a, b) => (Math.abs(b.gamma) > Math.abs(a.gamma) ? b : a));

// ---------------------------------------------------------------- dinero

export const money = {
  avoided: economia.al_10_por_ciento.loss_avoided,
  forgone: economia.al_10_por_ciento.good_volume_foregone,
  lift: economia.al_10_por_ciento.lift_vs_random,
  absorbedBySBA: economia.absorbe_sba_usd,
  realizedLoss: economia.perdida_realizada_usd,
  window: economia.ventana as [number, number],
  loans: economia.n_prestamos,
};

export function compactUSD(v: number, lang: string): string {
  const n = Math.abs(v);
  const [div, suf] = n >= 1e9 ? [1e9, "B"] : n >= 1e6 ? [1e6, "M"] : [1e3, "K"];
  const num = (v / div).toFixed(n / div >= 10 ? 0 : 2);
  // En español el separador decimal es la coma; el signo $ va igual delante.
  return `$${lang === "es" ? num.replace(".", ",") : num}${suf}`;
}

export function pct(v: number, lang: string, digits = 1): string {
  const s = (v * 100).toFixed(digits);
  return `${lang === "es" ? s.replace(".", ",") : s}%`;
}

export function pp(v: number, lang: string, digits = 2): string {
  const s = v.toFixed(digits);
  return `${v > 0 ? "+" : ""}${lang === "es" ? s.replace(".", ",") : s} pp`;
}

/** Umbral de un gate, leído de `config.yaml` vía el bundle.
 *
 *  Se busca por nombre en vez de teclear 0.80: si alguien moviera el umbral en el
 *  repositorio del modelo, esta página cambiaría con él en lugar de contradecirlo.
 *  Ese era exactamente el riesgo — dos copias del mismo umbral, y la del escaparate
 *  mostrando aprobado lo que el gate bloquea. */
export function gateThreshold(gate: string, fallback: number): number {
  return umbrales.umbrales.find((u) => u.gate === gate)?.valor ?? fallback;
}

export function num(v: number, lang: string, digits = 4): string {
  const s = v.toFixed(digits);
  return lang === "es" ? s.replace(".", ",") : s;
}
