// ============================================================
// LAS CIFRAS DE LA TESIS — un solo sitio.
//
// La página /research/fintech-inclusion publicó durante semanas β = +0,0007,
// p = 0,90, un bootstrap de 0,89, un placebo de 0,68, «91 pruebas» y «15
// especificaciones», cuando el repositorio de la tesis ya decía +0,0038,
// p = 0,54, 189 pruebas y 160 especificaciones (sesión 27). Las cifras estaban
// copiadas a mano en seis sitios de dos idiomas —la cabecera, la banda, la
// tabla, las fichas, la portada y la historia— y nadie las comparaba con su
// fuente. Es FALLO-28 en otro repositorio: la cifra venía de donde no debía.
//
// Ahora cada cifra se escribe UNA vez, aquí, con el archivo y la clave de donde
// sale, y el contenido (`lib/content/projects.ts`, `home.ts`, `historia.ts`)
// la interpola con el formato de cada idioma. Actualizar la página tras un
// `uv run iif econ` es editar este fichero y nada más.
//
// Fuente: repositorio `DavinsonR/financial-inclusion-colombia`, rama `main`
// tras el PR de cierre (ADR-024 y ADR-025, 2026-09-23). Rutas relativas a esa raíz:
//   R = data/processed/econ/resultados.json          (generado 2026-09-17T16:38:07Z)
//   C = data/processed/econ/curva_especificacion.json (generado 2026-09-17T16:38:37Z)
//   F = data/processed/forecast/resultados.json      (generado 2026-09-24T02:05:26Z)
//   I = data/processed/indice_diagnosticos.csv
//
// Los valores van al redondeo que se publica, no con todos sus decimales: el
// redondeo es una decisión editorial y se toma aquí, una vez, no en cada frase.
// `check:figures` falla si alguien vuelve a escribir un «β = …» a mano en
// `lib/content/`.
// ============================================================

/** Una cifra al redondeo con que se publica. */
export type Fig = { readonly value: number; readonly digits: number };
const fig = (value: number, digits: number): Fig => ({ value, digits });

export const THESIS = {
  /** R › especificacion.unidades · .n · .periodos */
  panel: { departments: 33, n: 228, from: 2019, to: 2025 },

  /** R › principales[0] — efectos de entidad y tiempo, errores por clúster. */
  base: { coef: fig(0.0038, 4), se: fig(0.0062, 4), p: fig(0.54, 2), n: 228 },
  /** R › principales[1] — la misma base con errores de Driscoll-Kraay. */
  driscollKraay: { coef: fig(0.0038, 4), se: fig(0.0034, 4), p: fig(0.27, 2), n: 228 },
  /** R › principales[2] — solo efectos de entidad. p = 1,2e-7: se publica «< 0,001».
   *  `coefShort` es el mismo coeficiente a tres decimales, el de la prosa. */
  entityOnly: { coef: fig(0.0272, 4), coefShort: fig(0.027, 3), se: fig(0.005, 4), pBelow: fig(0.001, 3), n: 228 },
  /** R › principales[3] — en cambios del índice. */
  changes: { coef: fig(-0.0045, 4), se: fig(0.0043, 4), p: fig(0.3, 2), n: 226 },
  /** R › disenos[0] — CCE, cargas heterogéneas. */
  cce: { coef: fig(0.0017, 4), se: fig(0.0087, 4), p: fig(0.84, 2), n: 228 },
  /** R › disenos[2] — SLX, rezago espacial del índice. */
  slx: { coef: fig(0.0074, 4), se: fig(0.0071, 4), p: fig(0.3, 2), n: 221 },
  /** R › disenos[1] — shift-share, exposición 2018 × adopción nacional.
   *  `coefShort` es el de la prosa, como en el README. */
  shiftShare: { coef: fig(0.0166, 4), coefShort: fig(0.017, 3), se: fig(0.0059, 4), p: fig(0.005, 3), n: 223 },
  /** R › shift_share_contraste.placebos[1] (urbanización inicial × adopción)
   *  y .carrera[1].p (el índice con la urbanización en la misma ecuación). */
  shiftShareUrban: { coef: fig(0.05, 3), p: fig(0.008, 3), indexPWithUrban: fig(0.1, 2) },

  /** R › robustez.wild_cluster_bootstrap — p_bootstrap 0,550; 999 réplicas de Rademacher; 33 clústeres;
   *  studentizado con el error agrupado CR1 (ADR-024; antes 0,481 con el homocedástico). */
  bootstrap: { p: fig(0.55, 2), reps: 999, clusters: 33 },
  /** R › robustez.placebo_permutacion — modo «trayectoria», p_placebo 0,508; 499 réplicas. */
  placebo: { p: fig(0.51, 2), reps: 499 },
  /** R › diagnosticos.pesaran_cd — estadístico 2,4018, p 0,0163. */
  pesaranCd: { stat: fig(2.4, 2), p: fig(0.016, 3) },
  /** R › robustez.jackknife.minimo / .maximo — ninguno significativo. */
  jackknife: { min: fig(0, 3), max: fig(0.008, 3) },

  /** R › potencia.mde.potencia_80_pp_por_de (0,6013, sobre t(32)), en pp por DE identificante. */
  mde80: fig(0.6, 2),
  /** R › robustez.wild_cluster_bootstrap.margen_minimo_bootstrap (0,01622) × potencia.escala_del_regresor:
   *  de_identificante 0,3368 → 0,55 pp; de_bruta 1,2361 → 2,0 pp. Es la cota del titular (ADR-024). */
  bound: { pp: fig(0.55, 2), raw: fig(2, 1) },
  /** R › robustez.wild_cluster_bootstrap.tost_bootstrap: ±0,50 pp p 0,068 (no equivale), ±0,25 pp p 0,293
   *  (no equivale), ±1,0 pp p 0,001 (equivale). La inferencia de referencia es el bootstrap (ADR-024). */
  tost: { wide: { margin: fig(0.5, 2), p: fig(0.07, 2) }, narrow: { margin: fig(0.25, 2), p: fig(0.29, 2) }, ruledOut: { margin: fig(1, 1), p: fig(0.001, 3) } },
  /** R › potencia.escala_del_regresor: de_bruta 1,236 → de_sin_efectos_de_dos_vias 0,337.
   *  La proporción que se va (1 − 0,0742) se publica como «92 %», igual que
   *  el README y ADR-018 del repositorio. */
  twoWayVariance: { removedPct: 92, sdBefore: fig(1.24, 2), sdAfter: fig(0.34, 2) },

  /** C › total y resumen["entidad y tiempo" | "solo entidad"].significativas / .especificaciones */
  curve: { total: 160, perArm: 80, significantTwoWay: 5, significantEntityOnly: 50 },

  /** I › kmo de las filas «uso» y «profundidad» (acceso tiene una sola variable). */
  kmo: { use: fig(0.317, 3), depth: fig(0.407, 3) },
  /** R › denominador.filas (indice «placebo», ventana completa, con controles): el índice con los
   *  numeradores de 2018 congelados, que solo se mueve por su denominador. Contemporáneo −0,2279
   *  (p 0,0007), rezagado −0,1285 (p 0,030), fijo +0,1294 (p 0,44) (ADR-017, ADR-024). */
  denominator: { contemporaneous: fig(-0.23, 2), lagged: fig(-0.13, 2), laggedP: fig(0.03, 2), fixed: fig(0.13, 2), fixedP: fig(0.44, 2) },

  /** F › puerta_de_calidad: ganancia_sobre_ingenuo_pct 38,55; origenes_ganados 3
   *  de n_origenes 8; ganancia_sin_mejor_origen_pct 8,29 (mejor_origen 2021);
   *  dm_p 0,287 con dm_agrupacion «origen» (un año de origen por grupo). */
  forecast: { gainPct: fig(38.6, 1), won: 3, of: 8, bestOrigin: 2021, gainWithoutBestPct: fig(8.3, 1), dmP: fig(0.29, 2), from: 2026, to: 2028 },

  /** `uv run pytest --collect-only -q` en el repositorio, 2026-09-23. */
  tests: 242,
  /** docs/decisiones/ADR-*.md en `main` (ADR-001 a ADR-025). */
  adrs: 25,
} as const;

/** Formato por idioma: coma decimal y punto de miles en español, al revés en
 *  inglés; menos tipográfico (−) y más explícito (+) en los coeficientes. */
export function thesisFormat(lang: "es" | "en") {
  const loc = lang === "es" ? "es-CO" : "en-US";
  const n = (f: Fig) =>
    Math.abs(f.value)
      .toLocaleString(loc, { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits, useGrouping: true })
      .replace(/^/, f.value < 0 ? "−" : "");
  return {
    /** Sin signo explícito salvo el menos: «0,54», «−0,31». */
    n,
    /** Con signo siempre: «+0,0038», «−0,0045». */
    s: (f: Fig) => (f.value < 0 ? n(f) : `+${n(f)}`),
    /** Un umbral: «< 0,001». */
    lt: (f: Fig) => `< ${n(f)}`,
    /** Enteros con separador de miles del idioma. */
    int: (v: number) => v.toLocaleString(loc),
  };
}
