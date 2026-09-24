"use client";

/* El simulador de crédito, dentro de la página del proyecto.

   Corre el mismo artefacto ONNX que la demo de `public/credit-risk-demo/` —el mismo
   `model.onnx` y el mismo `contract.json`, servidos desde esa carpeta— con
   onnxruntime-web en el navegador del visitante. La lógica del contrato no vive aquí
   sino en `lib/data/credit-scorer.ts`, que es puro y está probado.

   Tres decisiones de uso:
   - Cuatro campos bastan. Los otros nueve arrancan con los valores de un préstamo
     típico y se abren con un botón: nadie tiene que teclear trece cosas para ver un
     número.
   - Se recalcula en cada cambio. Una inferencia son microsegundos; un botón de
     «calcular» solo añadía un paso y la posibilidad de mirar un resultado viejo.
   - El modelo (1,9 MB) y el runtime se cargan cuando la sección se acerca a la
     pantalla, no con la página: quien no baja hasta aquí no los paga.

   La CSP de esta ruta es la única del sitio que admite `wasm-unsafe-eval` y los dos
   CDN del runtime; está en `next.config.ts`, con su porqué. */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import {
  BANDS,
  DEFAULTS,
  DEFAULT_GUARANTEE_SHARE,
  LGD,
  OUT_OF_CONTRACT_AGE,
  band,
  bandPosition,
  calibrate,
  encode,
  expectedLoss,
  unknownFields,
  type Band,
  type Contract,
  type Payload,
} from "@/lib/data/credit-scorer";

type Copy = Dictionary["creditRisk"]["demo"];

// ---------------------------------------------------------------- el runtime

/* Versión fijada y con `integrity`: sin él, un CDN comprometido puede sustituir el
   código que puntúa el crédito y la página lo ejecuta sin chistar. Es el mismo
   archivo y el mismo hash que la demo publicada. El .wasm que el runtime pide
   después no lleva SRI —lo pide ort, no una etiqueta— y eso se declara en
   next.config.ts en vez de disimularse. */
const ORT_SRC = "https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.19.2/ort.min.js";
const ORT_SRI = "sha384-4uQjzVxVRlLf2zq2sqRNKh3IzetqQzu15fI6xgLQzhXYGJMtTZc/fvdszanED0Zp";
const ORT_WASM = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/";
const MODEL = "/credit-risk-demo/model.onnx";
const CONTRACT = "/credit-risk-demo/contract.json";

type OrtTensor = { dims: readonly number[]; data: ArrayLike<number> };
type OrtSession = {
  inputNames: readonly string[];
  outputNames: readonly string[];
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
};
type Ort = {
  env: { wasm: { wasmPaths: string } };
  Tensor: new (type: "float32", data: Float32Array, dims: number[]) => OrtTensor;
  InferenceSession: { create(url: string, opts: { executionProviders: string[] }): Promise<OrtSession> };
};
type Engine = { ort: Ort; session: OrtSession; contract: Contract };

/* Con límite de tiempo, como el laboratorio de trading: sin él, una red que se
   cuelga sin cerrar la conexión deja «cargando» para siempre, que parece una página
   rota sin decirlo. */
function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${what} (${ms / 1000} s)`)), ms)),
  ]);
}

function loadScript(): Promise<Ort> {
  const w = window as unknown as { ort?: Ort };
  if (w.ort) return Promise.resolve(w.ort);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = ORT_SRC;
    s.integrity = ORT_SRI;
    s.crossOrigin = "anonymous";
    s.referrerPolicy = "no-referrer";
    s.async = true;
    s.onload = () => (w.ort ? resolve(w.ort) : reject(new Error("onnxruntime-web")));
    s.onerror = () => {
      s.remove();
      reject(new Error("onnxruntime-web"));
    };
    document.head.appendChild(s);
  });
}

/* Una sola carga por página, aunque React monte dos veces en desarrollo. Si falla,
   se olvida para que «Reintentar» vuelva a intentarlo de verdad. */
let engine: Promise<Engine> | null = null;

function loadEngine(): Promise<Engine> {
  engine ??= (async () => {
    const ort = await withTimeout(loadScript(), 20000, "onnxruntime-web");
    // ort busca sus binarios relativos a la PÁGINA, no al script. Y no se fija
    // numThreads: sin aislamiento de origen ORT cae solo a un hilo, y fijarlo le
    // hace pedir un .wasm que esta versión no publica (ver la demo).
    ort.env.wasm.wasmPaths = ORT_WASM;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    let res: Response;
    try {
      res = await fetch(CONTRACT, { signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`contract.json HTTP ${res.status}`);
    const contract = (await res.json()) as Contract;
    const session = await withTimeout(
      ort.InferenceSession.create(MODEL, { executionProviders: ["wasm"] }),
      30000,
      "model.onnx",
    );
    return { ort, session, contract };
  })();
  engine.catch(() => {
    engine = null;
  });
  return engine;
}

async function score(e: Engine, p: Payload): Promise<number> {
  const input = new e.ort.Tensor("float32", encode(p, e.contract), [1, e.contract.feature_order.length]);
  const out = await e.session.run({ [e.session.inputNames[0]]: input });
  // El grafo devuelve [etiqueta, probabilidades]; se busca el tensor 2D.
  for (const name of e.session.outputNames) {
    const t = out[name];
    if (t && t.dims.length === 2 && t.dims[1] >= 2) return calibrate(Number(t.data[1]), e.contract);
  }
  throw new Error("no probability tensor in the model output");
}

// ---------------------------------------------------------------- formato

const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? `{${k}}`));

function fmt(lang: string) {
  const loc = lang === "es" ? "es-ES" : "en-US";
  // `useGrouping: "always"`: es-ES no agrupa las cifras de cuatro dígitos, y en una
  // columna de importes «7761» junto a «31.044» parece un error.
  const usd = new Intl.NumberFormat(loc, { style: "currency", currency: "USD", maximumFractionDigits: 0, useGrouping: "always" });
  const pct = (v: number, d = 2) =>
    new Intl.NumberFormat(loc, { style: "percent", minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const n = (v: number, d = 4) => new Intl.NumberFormat(loc, { maximumFractionDigits: d, useGrouping: false }).format(v);
  return { usd: (v: number) => usd.format(v), pct, n };
}

const BAND_TONE: Record<Band, string> = {
  A: "text-pos",
  B: "text-pos",
  C: "text-ink",
  D: "text-neg",
  E: "text-neg",
};

// ---------------------------------------------------------------- el componente

type Status = "idle" | "loading" | "ready" | "error";

export default function Scorer({ copy, lang }: { copy: Copy; lang: string }) {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId();
  const f = useMemo(() => fmt(lang), [lang]);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [eng, setEng] = useState<Engine | null>(null);

  const [p, setP] = useState<Payload>(DEFAULTS);
  // La garantía sigue al monto (75%) hasta que alguien la toca a mano.
  const [guarLinked, setGuarLinked] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [pd, setPd] = useState<number | null>(null);
  const result = useRef<HTMLElement>(null);
  const [resultInView, setResultInView] = useState(false);

  const start = useCallback(() => {
    setStatus("loading");
    setError("");
    loadEngine().then(
      (e) => {
        setEng(e);
        setStatus("ready");
      },
      (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      },
    );
  }, []);

  // Se carga cuando se cumplen DOS cosas: la sección está cerca (600 px antes) y
  // alguien ha interactuado con la página —mover el ratón, desplazarse, tocar,
  // una tecla—. La segunda condición no es para una persona, que la cumple en el
  // primer segundo: es para que un rastreador o una auditoría que cargan la página
  // sin tocarla no paguen 2 MB de red y ~300 ms de hilo principal compilando el
  // runtime (medido con Lighthouse: bloqueo total de 290 ms, rendimiento 0,88).
  // Sin IntersectionObserver, el foco en un campo es el que dispara la carga.
  useEffect(() => {
    const el = root.current;
    if (!el || status !== "idle" || !("IntersectionObserver" in window)) return;
    let near = false;
    let engaged = false;
    const go = () => {
      if (!near || !engaged) return;
      cleanup();
      start();
    };
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart", "wheel"] as const;
    const onInput = () => {
      engaged = true;
      go();
    };
    const io = new IntersectionObserver(
      (entries) => {
        near = entries.some((x) => x.isIntersecting);
        go();
      },
      { rootMargin: "600px 0px" },
    );
    const cleanup = () => {
      io.disconnect();
      for (const e of events) window.removeEventListener(e, onInput);
    };
    for (const e of events) window.addEventListener(e, onInput, { passive: true });
    io.observe(el);
    return cleanup;
  }, [status, start]);

  // En el teléfono el resultado queda debajo de trece campos. Mientras no se ve, una
  // barra fija abajo lo resume; cuando el panel entra en pantalla, la barra se va.
  useEffect(() => {
    const el = result.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => setResultInView(entries.some((x) => x.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const invalid = p.sba_guaranteed > p.gross_approval || !(p.gross_approval > 0);

  // Puntúa en cada cambio. `seq` descarta respuestas que llegan fuera de orden.
  const seq = useRef(0);
  useEffect(() => {
    if (!eng || invalid) return;
    const mine = ++seq.current;
    score(eng, p).then(
      (v) => {
        if (mine === seq.current) setPd(v);
      },
      (err: unknown) => {
        if (mine !== seq.current) return;
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      },
    );
  }, [eng, p, invalid]);

  const set = <K extends keyof Payload>(k: K, v: Payload[K]) =>
    setP((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "gross_approval" && guarLinked) next.sba_guaranteed = Math.round(Number(v) * DEFAULT_GUARANTEE_SHARE);
      return next;
    });
  const num = (v: string) => (v === "" ? NaN : Number(v));

  const reset = () => {
    setP(DEFAULTS);
    setGuarLinked(true);
  };

  const touch = () => {
    if (status === "idle") start();
  };

  const contract = eng?.contract;
  const vocab = (k: string, fallback: string[]) => contract?.categories[k] ?? fallback;
  const ages = [...vocab("business_age", [DEFAULTS.business_age]), OUT_OF_CONTRACT_AGE];
  const unknown = contract ? unknownFields(p, contract) : [];
  const loss = pd === null ? null : expectedLoss(pd, p);
  const letter = pd === null ? null : band(pd);
  const fieldLabel: Record<string, string> = {
    naics_sector: copy.fields.sector,
    business_type: copy.fields.entity,
    business_age: copy.fields.age,
    revolver_status: copy.fields.revolver,
    collateral_ind: copy.fields.collateral,
    rate_type: copy.fields.rateType,
    processing_method: copy.fields.method,
    borrower_state: copy.fields.state,
    has_franchise: copy.fields.franchise,
  };

  const statusText =
    status === "ready" && contract
      ? fill(copy.status.ready, { n: contract.feature_order.length })
      : status === "error"
        ? fill(copy.status.error, { msg: error })
        : copy.status[status === "ready" ? "loading" : status];

  const id = (k: string) => `${uid}-${k}`;
  const yesNo = (k: "revolver_status" | "collateral_ind") => (
    <select id={id(k)} value={p[k]} onChange={(e) => set(k, e.target.value)}>
      <option value="Y">{copy.yes}</option>
      <option value="N">{copy.no}</option>
    </select>
  );

  return (
    <div ref={root} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]" onFocusCapture={touch}>
      {/* ---------------- el formulario ---------------- */}
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <p className="mb-5 flex items-baseline gap-2.5 text-[14px] text-muted" role="status">
          <span className={`inline-block h-2 w-2 shrink-0 translate-y-[-1px] rounded-full ${status === "ready" ? "bg-pos" : status === "error" ? "bg-neg" : "bg-rule"}`} aria-hidden="true" />
          <span className="min-w-0">{statusText}</span>
          {status === "error" && (
            <button type="button" onClick={start} className="font-medium text-cold underline underline-offset-4">
              {copy.status.retry}
            </button>
          )}
        </p>

        <fieldset className="cr-grid">
          <legend className="cr-legend">{copy.essentials}</legend>
          <label className="fl-field" htmlFor={id("gross")}>
            <span>{copy.fields.gross}</span>
            <input id={id("gross")} type="number" inputMode="numeric" min={1000} step="any" value={Number.isNaN(p.gross_approval) ? "" : p.gross_approval} onChange={(e) => set("gross_approval", num(e.target.value))} />
          </label>
          <label className="fl-field" htmlFor={id("rate")}>
            <span>{copy.fields.rate}</span>
            <input id={id("rate")} type="number" inputMode="decimal" min={0} max={30} step={0.25} value={Number.isNaN(p.initial_rate) ? "" : p.initial_rate} onChange={(e) => set("initial_rate", num(e.target.value))} />
          </label>
          <label className="fl-field" htmlFor={id("sector")}>
            <span>{copy.fields.sector}</span>
            <select id={id("sector")} value={p.naics_sector} onChange={(e) => set("naics_sector", e.target.value)}>
              {Object.entries(copy.sectors).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </select>
          </label>
          <label className="fl-field" htmlFor={id("age")}>
            <span>{copy.fields.age}</span>
            <select id={id("age")} value={p.business_age} onChange={(e) => set("business_age", e.target.value)}>
              {ages.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={id("rest")}
            onClick={() => setShowAll((v) => !v)}
            className="rounded-[3px] border border-cold px-4 py-2 text-[14px] font-medium text-cold hover:bg-coldsoft"
          >
            {showAll ? copy.showLess : copy.showAll}
          </button>
          <button type="button" onClick={reset} className="text-[14px] text-muted underline underline-offset-4 hover:text-cold">
            {copy.reset}
          </button>
        </div>

        {/* La regla va en un contenedor y no en el fieldset: en un fieldset con borde, la
            leyenda se dibuja SOBRE el borde y se pega al botón de arriba. */}
        <div id={id("rest")} hidden={!showAll} className="mt-6 border-t border-rule pt-6">
          <fieldset className="cr-grid">
            <legend className="cr-legend">{copy.rest}</legend>
            <p className="col-span-full -mt-1 text-[14px] text-muted">{copy.restNote}</p>
            <label className="fl-field" htmlFor={id("guar")}>
              <span>{copy.fields.guarantee}</span>
              <input
                id={id("guar")}
                type="number"
                inputMode="numeric"
                min={0}
                step="any"
                value={Number.isNaN(p.sba_guaranteed) ? "" : p.sba_guaranteed}
                aria-describedby={id("guar-note")}
                onChange={(e) => {
                  setGuarLinked(false);
                  set("sba_guaranteed", num(e.target.value));
                }}
              />
              <small id={id("guar-note")} className="text-[12.5px] text-muted">
                {guarLinked ? copy.fields.guaranteeAuto : f.pct(p.gross_approval > 0 ? p.sba_guaranteed / p.gross_approval : 0, 1)}
              </small>
            </label>
            <label className="fl-field" htmlFor={id("jobs")}>
              <span>{copy.fields.jobs}</span>
              <input id={id("jobs")} type="number" inputMode="numeric" min={0} step={1} value={Number.isNaN(p.jobs_supported) ? "" : p.jobs_supported} onChange={(e) => set("jobs_supported", num(e.target.value))} />
            </label>
            <label className="fl-field" htmlFor={id("state")}>
              <span>{copy.fields.state}</span>
              <select id={id("state")} value={p.borrower_state} onChange={(e) => set("borrower_state", e.target.value)}>
                {vocab("borrower_state", [DEFAULTS.borrower_state]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="fl-field" htmlFor={id("entity")}>
              <span>{copy.fields.entity}</span>
              <select id={id("entity")} value={p.business_type} onChange={(e) => set("business_type", e.target.value)}>
                {vocab("business_type", [DEFAULTS.business_type]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="fl-field sm:col-span-2" htmlFor={id("method")}>
              <span>{copy.fields.method}</span>
              <select id={id("method")} value={p.processing_method} onChange={(e) => set("processing_method", e.target.value)}>
                {vocab("processing_method", [DEFAULTS.processing_method]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="fl-field" htmlFor={id("collateral_ind")}>
              <span>{copy.fields.collateral}</span>
              {yesNo("collateral_ind")}
            </label>
            <label className="fl-field" htmlFor={id("revolver_status")}>
              <span>{copy.fields.revolver}</span>
              {yesNo("revolver_status")}
            </label>
            <label className="fl-field" htmlFor={id("rateType")}>
              <span>{copy.fields.rateType}</span>
              <select id={id("rateType")} value={p.rate_type} onChange={(e) => set("rate_type", e.target.value)}>
                <option value="V">{copy.variable}</option>
                <option value="F">{copy.fixed}</option>
              </select>
            </label>
            <label className="fl-field" htmlFor={id("franchise")}>
              <span>{copy.fields.franchise}</span>
              <select id={id("franchise")} value={String(p.has_franchise)} onChange={(e) => set("has_franchise", Number(e.target.value))}>
                <option value="0">{copy.no}</option>
                <option value="1">{copy.yes}</option>
              </select>
            </label>
          </fieldset>
        </div>

        <p className="mt-8 max-w-[620px] border-l-2 border-rule pl-4 text-[14px] leading-[1.65] text-muted">{copy.warn}</p>
      </form>

      {/* Resumen fijo para pantallas estrechas: duplica lo que dice el panel, así que
          va oculto a los lectores de pantalla, que ya tienen la región en vivo. */}
      {!resultInView && !invalid && pd !== null && letter !== null && (
        <div
          aria-hidden="true"
          className="sticky bottom-0 z-10 -mx-6 -my-5 flex items-center justify-between gap-4 border-t-2 border-cold bg-paper px-6 py-3 lg:hidden"
        >
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.09em] text-muted">{copy.result.heading}</span>
          <span className="flex items-baseline gap-3">
            <span className={`font-figure text-[26px] leading-none ${BAND_TONE[letter]}`}>{letter}</span>
            <span className="font-figure text-[20px] leading-none text-ink">{f.pct(pd)}</span>
            <span className={`text-[14px] ${BAND_TONE[letter]}`}>{copy.result.bands[letter]}</span>
          </span>
        </div>
      )}

      {/* ---------------- el resultado ---------------- */}
      <section
        ref={result}
        aria-labelledby={id("res")}
        className="border-t-2 border-cold pt-5 lg:sticky lg:top-[118px] lg:self-start lg:border-t-0 lg:border-l lg:border-rule lg:pt-0 lg:pl-8"
      >
        <h3 id={id("res")} className="text-[12.5px] font-semibold uppercase tracking-[0.09em] text-muted">
          {copy.result.heading}
        </h3>

        {invalid ? (
          <p className="mt-4 text-[14px] leading-[1.6] text-neg" role="alert">
            {copy.guaranteeError}
          </p>
        ) : pd === null || letter === null || loss === null ? (
          <p className="mt-4 text-[14px] leading-[1.6] text-muted">{copy.result.waiting}</p>
        ) : (
          <div aria-live="polite">
            <div className="mt-3 flex items-end gap-5">
              <div>
                <p className="text-[12.5px] uppercase tracking-[0.09em] text-muted">{copy.result.band}</p>
                <p className={`font-figure text-[56px] leading-none ${BAND_TONE[letter]}`}>{letter}</p>
              </div>
              <div className="pb-1">
                <p className="font-figure text-[30px] leading-none text-ink">{f.pct(pd)}</p>
                <p className="mt-1 text-[14px] text-muted">{copy.result.pd}</p>
              </div>
            </div>
            <p className={`mt-2 text-[14.5px] font-medium ${BAND_TONE[letter]}`}>{copy.result.bands[letter]}</p>

            {/* La escala: cinco tramos iguales, uno por banda. */}
            <figure className="mt-5" aria-label={copy.result.scale}>
              <div className="relative h-2 w-full">
                <div className="absolute inset-0 grid grid-cols-5 gap-[2px]">
                  {BANDS.map(([, l]) => (
                    <span key={l} className={l === letter ? "bg-cold" : "bg-band2"} />
                  ))}
                </div>
                <span
                  className="absolute -top-1 h-4 w-[2px] bg-ink"
                  style={{ left: `calc(${(bandPosition(pd) * 100).toFixed(2)}% - 1px)` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1 grid grid-cols-5 text-[12.5px] text-muted">
                {BANDS.map(([, l]) => (
                  <span key={l} className={l === letter ? "font-semibold text-ink" : undefined}>
                    {l}
                  </span>
                ))}
              </div>
              <figcaption className="sr-only">{copy.result.scale}</figcaption>
            </figure>

            <dl className="mt-6 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-t border-rule pt-4 text-[14px]">
              <dt className="text-body">{copy.result.expectedLoss}</dt>
              <dd className="text-right font-semibold tabular-nums text-ink">{f.usd(loss.total)}</dd>
              <dt className="text-muted">{copy.result.sba}</dt>
              <dd className="text-right tabular-nums">{f.usd(loss.sba)}</dd>
              <dt className="text-muted">{copy.result.lender}</dt>
              <dd className="text-right tabular-nums">{f.usd(loss.lender)}</dd>
            </dl>

            {unknown.length > 0 && (
              <p className="mt-5 border-l-2 border-neg pl-3 text-[14px] leading-[1.6]">
                {unknown.map((k) => (
                  <span key={k} className="block">
                    {fill(copy.result.unknown, { value: String(p[k as keyof Payload]), field: fieldLabel[k] ?? k })}
                  </span>
                ))}
              </p>
            )}

            <button
              type="button"
              aria-expanded={showDetail}
              aria-controls={id("detail")}
              onClick={() => setShowDetail((v) => !v)}
              className="mt-6 text-[14px] font-medium text-cold underline underline-offset-4"
            >
              {showDetail ? copy.result.hideDetail : copy.result.showDetail}
            </button>

            <div id={id("detail")} hidden={!showDetail} className="mt-4">
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[14px]">
                <dt className="text-muted">{copy.result.guaranteeShare}</dt>
                <dd className="text-right tabular-nums">{f.pct(loss.share, 1)}</dd>
                <dt className="text-muted">{copy.result.lgd}</dt>
                <dd className="text-right tabular-nums">{f.pct(LGD, 1)}</dd>
              </dl>
              <p className="mt-1 text-[12.5px] text-muted">{copy.result.lgdNote}</p>
              <p className="mt-1 text-[12.5px] text-muted">
                {BANDS.slice(0, -1).map(([t, l]) => `${l} < ${f.pct(t, 0)}`).join(" · ")} · E ≥ {f.pct(BANDS[BANDS.length - 2][0], 0)}
              </p>

              {contract && (
                <>
                  <h4 className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.09em] text-muted">{copy.result.vector}</h4>
                  <p className="mt-1 text-[14px] leading-[1.55] text-muted">{copy.result.vectorNote}</p>
                  <div className="mt-2 overflow-x-auto" tabIndex={0} role="region" aria-label={copy.result.vector}>
                    <table className="w-full table-fixed border-collapse text-[12.5px] tabular-nums">
                      <thead>
                        <tr className="border-b border-rule text-left text-muted">
                          <th scope="col" className="w-[46%] py-1 pr-2 font-medium">{copy.result.feature}</th>
                          <th scope="col" className="py-1 pr-2 font-medium">{copy.result.value}</th>
                          <th scope="col" className="w-[24%] py-1 text-right font-medium">{copy.result.encoded}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(encode(p, contract)).map((v, i) => {
                          const name = contract.feature_order[i];
                          const raw = name in p ? String(p[name as keyof Payload]) : "—";
                          const bad = contract.categorical.includes(name) && v === contract.unknown_code;
                          return (
                            <tr key={name} className="border-b border-rulesoft">
                              <td className="truncate py-1 pr-2 font-mono text-[12px]" title={name}>{name}</td>
                              <td className="truncate py-1 pr-2" title={raw}>{raw}</td>
                              <td className={`py-1 text-right ${bad ? "font-semibold text-neg" : ""}`}>{f.n(v)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
