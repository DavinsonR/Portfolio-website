/** El contrato de serving del modelo de crédito, en TypeScript.
 *
 *  Es la cuarta implementación del mismo contrato: `serving/api/app.py` (FastAPI),
 *  `serving/vercel/api/score.py` y `serving/web/index.html` en `credit-risk-mlops`, y
 *  esta, que alimenta el simulador de la página del proyecto. Las cuatro tienen que
 *  dar el MISMO número; una divergencia silenciosa entre ellas es el fallo más
 *  peligroso posible porque nadie ve un error, solo respuestas distintas según por
 *  dónde entró la solicitud.
 *
 *  Por eso esto es un módulo puro, sin navegador ni runtime de ONNX: la codificación,
 *  la calibración, las bandas y la pérdida esperada se prueban en
 *  `tests/credit-scorer.test.ts`, que además compara las bandas y la severidad con la
 *  copia de la demo publicada en `public/credit-risk-demo/`.
 *
 *  Qué NO vive aquí: el vocabulario de cada categoría. Ese sale de `contract.json`,
 *  el mismo archivo que exporta el modelo, y se lee en tiempo de ejecución.
 */

export type Contract = {
  feature_order: string[];
  numeric: string[];
  categorical: string[];
  categories: Record<string, string[]>;
  unknown_code: number;
  calibrator: string;
  calibrator_shift: number;
  parity: { max_abs_diff: number; tolerance: number; n_rows: number };
};

export type Payload = {
  gross_approval: number;
  sba_guaranteed: number;
  initial_rate: number;
  jobs_supported: number;
  naics_sector: string;
  business_type: string;
  business_age: string;
  revolver_status: string;
  collateral_ind: string;
  rate_type: string;
  processing_method: string;
  borrower_state: string;
  has_franchise: number;
};

/** Parte garantizada por defecto: 75% del monto, el valor con el que la demo publicada
 *  arranca y el mismo del smoke test de CI en `credit-risk-mlops`. */
export const DEFAULT_GUARANTEE_SHARE = 0.75;

/** Un préstamo 7(a) típico: los valores con los que arrancan la demo y el smoke test
 *  del servicio. Quien use el simulador solo tiene que tocar lo que le interesa. */
export const DEFAULTS: Payload = {
  gross_approval: 250000,
  sba_guaranteed: 250000 * DEFAULT_GUARANTEE_SHARE,
  initial_rate: 8.5,
  jobs_supported: 6,
  naics_sector: "72",
  business_type: "CORPORATION",
  business_age: "Existing or more than 2 years old",
  revolver_status: "N",
  collateral_ind: "Y",
  rate_type: "V",
  processing_method: "Preferred Lenders Program",
  borrower_state: "TX",
  has_franchise: 0,
};

/** Categoría que el SBA empezó a usar después del entrenamiento. No está en el
 *  contrato, y ofrecerla es deliberado: es el caso que la sección del acantilado
 *  explica — el modelo la codifica como desconocida y responde igual de seguro. */
export const OUT_OF_CONTRACT_AGE = "Change of Ownership";

type Derived = { guarantee_pct: number | null; log_gross_approval: number | null };

function derived(p: Payload): Derived {
  const gross = p.gross_approval;
  return {
    guarantee_pct: gross ? p.sba_guaranteed / gross : null,
    log_gross_approval: gross > 0 ? Math.log(gross) : null,
  };
}

/** Aplica el contrato: numéricas primero, categóricas después, en el orden del
 *  contrato. ONNX recibe un tensor posicional, no un objeto, así que el orden es
 *  parte del contrato. Una categoría fuera del vocabulario se codifica con
 *  `unknown_code`, como se comportaría en producción. */
export function encode(p: Payload, c: Contract): Float32Array {
  const d = derived(p);
  const row: number[] = [];
  for (const name of c.numeric) {
    const v = name in d ? d[name as keyof Derived] : (p as Record<string, unknown>)[name];
    row.push(v === null || v === undefined ? NaN : Number(v));
  }
  for (const name of c.categorical) {
    const vocab = c.categories[name] ?? [];
    const idx = vocab.indexOf(String((p as Record<string, unknown>)[name]));
    row.push(idx >= 0 ? idx : c.unknown_code);
  }
  return Float32Array.from(row);
}

/** Las variables categóricas cuyo valor no está en el vocabulario de entrenamiento. */
export function unknownFields(p: Payload, c: Contract): string[] {
  return c.categorical.filter((name) => {
    const vocab = c.categories[name] ?? [];
    return !vocab.includes(String((p as Record<string, unknown>)[name]));
  });
}

/** Desplazamiento de intercepto en escala logit. Monótono: no altera el ranking. */
export function calibrate(raw: number, c: Contract): number {
  if (c.calibrator !== "intercept") return raw;
  const q = Math.min(Math.max(raw, 1e-6), 1 - 1e-6);
  const logit = Math.log(q / (1 - q)) + (c.calibrator_shift || 0);
  return 1 / (1 + Math.exp(-logit));
}

export type Band = "A" | "B" | "C" | "D" | "E";

/** Cortes de banda de `serving/api/app.py`: convención de la industria, no un
 *  resultado del modelo. El último corte es 1.01 para que PD = 1 caiga en E. */
export const BANDS: ReadonlyArray<readonly [number, Band]> = [
  [0.03, "A"],
  [0.06, "B"],
  [0.12, "C"],
  [0.2, "D"],
  [1.01, "E"],
];

export function band(pd: number): Band {
  return (BANDS.find(([t]) => pd < t) ?? BANDS[BANDS.length - 1])[1];
}

/** Posición de una PD en una escala de cinco tramos iguales, uno por banda, de 0 a 1.
 *  Lineal dentro de cada tramo; el de E se dibuja hasta 40% y se satura ahí, porque
 *  estirarlo hasta 100% aplastaría las otras cuatro bandas en una esquina. */
export const SCALE_MAX = 0.4;

export function bandPosition(pd: number): number {
  const edges = [0, ...BANDS.slice(0, -1).map(([t]) => t), SCALE_MAX];
  const n = BANDS.length;
  const x = Math.min(Math.max(pd, 0), SCALE_MAX);
  for (let i = 0; i < n; i++) {
    const lo = edges[i];
    const hi = edges[i + 1];
    if (x < hi || i === n - 1) return (i + (x - lo) / (hi - lo)) / n;
  }
  return 1;
}

/** Severidad media observada en los charge-off del panel, la de `serving/api/app.py`.
 *  Es un promedio, no un modelo de LGD, y la página lo dice. */
export const LGD = 0.735;

export type Loss = { total: number; sba: number; lender: number; share: number };

/** Pérdida esperada y su reparto: la SBA absorbe la parte garantizada. */
export function expectedLoss(pd: number, p: Payload): Loss {
  const total = pd * LGD * p.gross_approval;
  const share = p.gross_approval > 0 ? p.sba_guaranteed / p.gross_approval : 0;
  return { total, sba: total * share, lender: total * (1 - share), share };
}
