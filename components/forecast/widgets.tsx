"use client";

/* Las seis piezas del laboratorio. Este módulo solo baja cuando una isla abre su puerta
   (ver Island.tsx), así que su peso no entra en el de la página.

   Reglas de estilo que se aplican aquí sin excepción (docs/DESIGN.md):
   - Toda cifra va en tinta o en azul. El ámbar se usa en UNA sola cosa: el pronóstico
     del visitante, que es lo único humano de la página.
   - Cada modelo se distingue por su forma y por su trazo, no solo por su color: el
     ingenuo siempre en gris y discontinuo, como toda referencia del sitio.
   - Los textos de los SVG miden 12 px en pantalla con `--k` (ScaleAware).
   - Los controles son los del atlas (`atlas-field`, `atlas-views`, `atlas-range`): el
     mismo aspecto y el mismo foco que el lector ya conoce del sitio.

   Una economía elegida en una pieza viaja a las demás: el estado de selección es un
   almacén de módulo, compartido por todas las islas de la página. */

import { useEffect, useMemo, useRef, useState } from "react";
import ScaleAware from "@/components/ScaleAware";
import type { LabCopy } from "@/lib/content/forecast";
import {
  absErrors,
  countryName,
  loadMeta,
  loadSeries,
  loadSummary,
  mean,
  nOrigins,
  num,
  periodLabel,
  pval,
  regimeOf,
  relMae,
  signed,
  yearOf,
  type Meta,
  type ModelId,
  type Regime,
  type Series,
  type Summary,
} from "@/lib/data/forecast-lab";
import type { Kind } from "./Island";
import { setSel, useSel } from "./store";

// ---------------------------------------------------------------- datos

type Loaded<T> = { data: T | null; failed: boolean; retry: () => void };

function useLoad<T>(fn: () => Promise<T>, key: string): Loaded<T> {
  const [state, setState] = useState<{ key: string; data: T | null; failed: boolean }>({ key: "", data: null, failed: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    fn().then(
      (data) => alive && setState({ key, data, failed: false }),
      () => alive && setState({ key, data: null, failed: true }),
    );
    return () => {
      alive = false;
    };
    // `fn` cambia con `key`; la clave es la identidad de la petición.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  const fresh = state.key === key;
  return { data: fresh ? state.data : null, failed: fresh && state.failed, retry: () => setAttempt((a) => a + 1) };
}

// ---------------------------------------------------------------- utilidades

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const lin = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const TXT = (px = 12) => ({ fontSize: `calc(${px}px * var(--k, 1))` });

type Style = { color: string; dash: string; shape: "ring" | "circle" | "square" | "triangle" | "diamond" | "cross" };
const STYLE: Record<ModelId, Style> = {
  naive: { color: "var(--color-muted)", dash: "5 6", shape: "ring" },
  ar1: { color: "var(--color-cold)", dash: "", shape: "circle" },
  arima: { color: "var(--color-cold)", dash: "2 4", shape: "square" },
  rf: { color: "var(--color-building)", dash: "", shape: "triangle" },
  lstm: { color: "var(--color-pos)", dash: "", shape: "diamond" },
  comb: { color: "var(--color-body)", dash: "8 3", shape: "cross" },
};
const YOU = "var(--color-warm)";

function Mark({ x, y, m, r = 5 }: { x: number; y: number; m: ModelId; r?: number }) {
  const { color, shape } = STYLE[m];
  const common = { stroke: color, strokeWidth: 2 };
  switch (shape) {
    case "ring":
      return <circle cx={x} cy={y} r={r} fill="var(--color-paper)" {...common} />;
    case "circle":
      return <circle cx={x} cy={y} r={r} fill={color} {...common} />;
    case "square":
      return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={color} {...common} />;
    case "triangle":
      return <path d={`M${x},${y - r * 1.2}L${x + r * 1.1},${y + r * 0.8}L${x - r * 1.1},${y + r * 0.8}Z`} fill={color} {...common} />;
    case "diamond":
      return <path d={`M${x},${y - r * 1.25}L${x + r},${y}L${x},${y + r * 1.25}L${x - r},${y}Z`} fill={color} {...common} />;
    case "cross":
      return <path d={`M${x - r},${y - r}L${x + r},${y + r}M${x + r},${y - r}L${x - r},${y + r}`} fill="none" {...common} />;
  }
}

function Swatch({ m }: { m: ModelId }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="inline-block shrink-0">
      <Mark x={8} y={8} m={m} r={4.5} />
    </svg>
  );
}

function Toggle<T extends string>({ legend, value, options, onChange }: {
  legend: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="atlas-field">
      <legend>{legend}</legend>
      <div className="atlas-views">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function FreqToggle({ copy, meta }: { copy: LabCopy; meta: Meta }) {
  const { freq, iso3 } = useSel();
  // Una economía sin serie en la nueva frecuencia no puede seguir elegida: se vuelve a Colombia.
  const has = new Set(meta.paises.filter((p) => p.trimestral).map((p) => p.iso3));
  const annual = new Set(meta.paises.filter((p) => p.anual).map((p) => p.iso3));
  return (
    <Toggle
      legend={copy.freq}
      value={freq}
      options={[
        { id: "anual", label: copy.anual },
        { id: "trimestral", label: copy.trimestral },
      ]}
      onChange={(f) => setSel({ freq: f, iso3: (f === "trimestral" ? has : annual).has(iso3) ? iso3 : "COL" })}
    />
  );
}

function CountrySelect({ copy, meta, lang }: { copy: LabCopy; meta: Meta; lang: string }) {
  const { freq, iso3 } = useSel();
  // Solo economías con serie en esa frecuencia: Honduras no tiene anual (B-010 del laboratorio).
  const options = meta.paises.filter((p) => (freq === "anual" ? p.anual : p.trimestral));
  return (
    <label className="atlas-field">
      <span>{copy.economy}</span>
      <select value={iso3} onChange={(e) => setSel({ iso3: e.target.value })}>
        {options.map((p) => (
          <option key={p.iso3} value={p.iso3}>
            {countryName(p, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Failed({ copy, retry }: { copy: LabCopy; retry: () => void }) {
  return (
    <div role="alert" className="py-12 text-center text-[14px] text-body">
      <p>{copy.error}</p>
      <button type="button" onClick={retry} className="mt-3 rounded-[3px] border border-control px-4 py-2 text-ink hover:border-cold">
        {copy.retry}
      </button>
    </div>
  );
}

const Loading = ({ copy }: { copy: LabCopy }) => (
  <p role="status" className="py-16 text-center text-[14px] text-muted">
    {copy.loading}
  </p>
);

/** Meta + la serie de la economía elegida, en la frecuencia elegida. */
function useSeries() {
  const { freq, iso3 } = useSel();
  const meta = useLoad(loadMeta, "meta");
  const all = useLoad(() => loadSeries(freq), `series-${freq}`);
  const series = all.data ? (all.data.find((s) => s.iso3 === iso3) ?? all.data.find((s) => s.iso3 === "COL") ?? null) : null;
  return {
    meta: meta.data,
    series,
    failed: meta.failed || all.failed,
    retry: () => {
      meta.retry();
      all.retry();
    },
  };
}

// ================================================================ JUEGA

function Play({ copy, lang }: { copy: LabCopy; lang: string }) {
  const { meta, series, failed, retry } = useSeries();
  const { freq, iso3 } = useSel();
  const [score, setScore] = useState<Record<"you" | ModelId, number>[]>([]);
  if (failed) return <Failed copy={copy} retry={retry} />;
  if (!meta || !series) return <Loading copy={copy} />;
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <FreqToggle copy={copy} meta={meta} />
        <CountrySelect copy={copy} meta={meta} lang={lang} />
      </div>
      {/* La ronda se reinicia al cambiar de economía; el marcador no. */}
      <Round
        key={`${freq}-${iso3}`}
        copy={copy}
        lang={lang}
        series={series}
        meta={meta}
        onScore={(r) => setScore((s) => [...s, r])}
      />
      <Scoreboard copy={copy} lang={lang} rounds={score} onReset={() => setScore([])} />
    </div>
  );
}

function crashOrigin(s: Series, ruptura: readonly number[]): number {
  let best = -1;
  let low = Infinity;
  for (let j = 0; j < nOrigins(s); j++) {
    const label = periodLabel(s.inicio, s.o0 + j);
    const v = s.y[s.o0 + j];
    if (regimeOf(label, ruptura) === "ruptura" && yearOf(label) === ruptura[0] && v != null && v < low) {
      low = v;
      best = j;
    }
  }
  return best;
}

function firstOriginOf(s: Series, year: number): number {
  for (let j = 0; j < nOrigins(s); j++) if (yearOf(periodLabel(s.inicio, s.o0 + j)) >= year) return j;
  return 0;
}

const PLAY_MODELS: ModelId[] = ["naive", "ar1", "arima", "rf", "lstm", "comb"];

function Round({ copy, lang, series: s, meta, onScore }: {
  copy: LabCopy;
  lang: string;
  series: Series;
  meta: Meta;
  onScore: (r: Record<"you" | ModelId, number>) => void;
}) {
  // Arranca en 2015: un año tranquilo, para que la primera ronda enseñe el juego y
  // no el choque. La de 2020 se pide con su botón.
  const [j, setJ] = useState(() => firstOriginOf(s, 2015));
  const T = s.o0 + j;
  const last = s.y[T - 1] ?? 0;
  const [guess, setGuess] = useState(last);
  const [revealed, setRevealed] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const W = 720, H = 330, P = { l: 46, r: 150, t: 18, b: 34 };
  const span = s.inicio.includes("Q") ? 28 : 30;
  const t0 = Math.max(0, T - span);
  const vals = s.y.filter((v): v is number => v != null);
  const lo = Math.floor(Math.min(...vals, 0) - 1);
  const hi = Math.ceil(Math.max(...vals) + 1);
  const x = lin(t0, T, P.l, W - P.r);
  const y = lin(lo, hi, H - P.b, P.t);
  const yInv = lin(H - P.b, P.t, lo, hi);
  const target = periodLabel(s.inicio, T);
  const actual = s.y[T];

  const hist: string[] = [];
  for (let i = t0; i < T; i++) {
    const v = s.y[i];
    if (v != null) hist.push(`${hist.length ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  }
  const ticks = niceTicks(lo, hi, 5);
  const xTicks: number[] = [];
  const step = s.inicio.includes("Q") ? 8 : 5;
  for (let i = t0; i <= T; i++) {
    const lab = periodLabel(s.inicio, i);
    const yr = yearOf(lab);
    if ((s.inicio.includes("Q") ? lab.endsWith("Q1") && yr % 2 === 0 : yr % step === 0)) xTicks.push(i);
  }

  const setFromClient = (clientY: number) => {
    const el = svg.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const vy = ((clientY - box.top) / box.height) * H;
    setGuess(Math.round(clamp(yInv(vy), lo, hi) * 10) / 10);
  };

  const errors = PLAY_MODELS.map((m) => {
    const f = s.pron[m][j];
    return { m, f, e: f != null && actual != null ? Math.abs(f - actual) : null };
  });
  const yourErr = actual != null ? Math.abs(guess - actual) : null;

  const reveal = () => {
    if (revealed || actual == null) return;
    setRevealed(true);
    const r = { you: yourErr ?? NaN } as Record<"you" | ModelId, number>;
    for (const { m, e } of errors) r[m] = e ?? NaN;
    onScore(r);
  };
  const goTo = (k: number) => {
    setJ(k);
    setGuess(s.y[s.o0 + k - 1] ?? 0);
    setRevealed(false);
  };
  const nextRound = () => {
    const n = nOrigins(s);
    let k = j;
    while (n > 1 && k === j) k = Math.floor(Math.random() * n);
    goTo(k);
  };
  const crash = crashOrigin(s, meta.ruptura);

  const onKey = (e: React.KeyboardEvent) => {
    if (revealed) return;
    const d = e.key === "ArrowUp" ? 0.1 : e.key === "ArrowDown" ? -0.1 : e.key === "PageUp" ? 1 : e.key === "PageDown" ? -1 : 0;
    if (d) {
      e.preventDefault();
      setGuess((g) => Math.round(clamp(g + d, lo, hi) * 10) / 10);
    } else if (e.key === "Enter") {
      e.preventDefault();
      reveal();
    }
  };

  const sorted = [...errors].filter((r) => r.e != null).sort((a, b) => (a.e as number) - (b.e as number));
  const handleLabel = fill(copy.play.handle, { period: target });

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <ScaleAware base={W}>
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            className="block w-full touch-none select-none"
            role="img"
            aria-label={`${copy.growth}. ${handleLabel}`}
            onPointerDown={(e) => {
              if (revealed) return;
              dragging.current = true;
              (e.currentTarget as Element).setPointerCapture(e.pointerId);
              setFromClient(e.clientY);
            }}
            onPointerMove={(e) => dragging.current && setFromClient(e.clientY)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {ticks.map((v) => (
              <g key={v}>
                <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} strokeWidth="1" />
                <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
                  {num(lang, v, 0)}
                </text>
              </g>
            ))}
            {xTicks.map((i) => (
              <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
                {s.inicio.includes("Q") ? String(yearOf(periodLabel(s.inicio, i))) : periodLabel(s.inicio, i)}
              </text>
            ))}
            {/* la columna del período que se pronostica */}
            <rect x={x(T) - 14} y={P.t} width={28} height={H - P.b - P.t} fill="var(--color-coldsoft)" />
            <path d={hist.join("")} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
            {/* el ingenuo: repetir el último dato */}
            <line x1={x(T - 1)} x2={x(T)} y1={y(last)} y2={y(last)} stroke={STYLE.naive.color} strokeWidth="2" strokeDasharray="5 6" />
            {revealed && (
              <>
                {errors.map(({ m, f }) => (f != null && m !== "naive" ? <Mark key={m} x={x(T)} y={y(f)} m={m} r={4.5} /> : null))}
                <Mark x={x(T)} y={y(last)} m="naive" r={4.5} />
                {actual != null && (
                  <>
                    <line x1={x(T - 1)} x2={x(T)} y1={y(s.y[T - 1] ?? actual)} y2={y(actual)} stroke="var(--color-ink)" strokeWidth="2" />
                    <circle cx={x(T)} cy={y(actual)} r={6.5} fill="var(--color-ink)" />
                    <text x={x(T) + 18} y={y(actual) + 4} fill="var(--color-ink)" style={TXT(13)} fontWeight={600}>
                      {copy.actual} {signed(lang, actual)}
                    </text>
                  </>
                )}
              </>
            )}
            {/* tu pronóstico: lo único ámbar de la página */}
            <line x1={x(T - 1)} x2={x(T)} y1={y(last)} y2={y(guess)} stroke={YOU} strokeWidth="2" strokeDasharray="2 3" />
            <g
              role="slider"
              tabIndex={revealed ? -1 : 0}
              aria-label={handleLabel}
              aria-valuemin={lo}
              aria-valuemax={hi}
              aria-valuenow={guess}
              aria-valuetext={`${signed(lang, guess)} %`}
              aria-disabled={revealed}
              onKeyDown={onKey}
              className="fl-handle"
              style={{ cursor: revealed ? "default" : "ns-resize" }}
            >
              <circle cx={x(T)} cy={y(guess)} r={16} fill="transparent" />
              <circle cx={x(T)} cy={y(guess)} r={8} fill={YOU} stroke="var(--color-paper)" strokeWidth="2" />
            </g>
            <text x={x(T) + 18} y={y(guess) + (revealed && actual != null && Math.abs(y(guess) - y(actual)) < 16 ? 20 : 4)} fill={YOU} style={TXT(13)} fontWeight={600}>
              {copy.you} {signed(lang, guess)}
            </text>
            <text x={x(T)} y={P.t - 4} textAnchor="middle" fill="var(--color-cold)" style={TXT()} fontWeight={600}>
              {target}
            </text>
          </svg>
        </ScaleAware>
        <p className="mt-2 text-[14px] text-muted">{copy.play.instructions}</p>
      </div>

      <div className="border-t-2 border-ink pt-4 lg:border-t-0 lg:border-l lg:border-rule lg:pt-0 lg:pl-6">
        <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{fill(copy.play.yourCall, { period: target })}</p>
        <p className="mt-1 font-figure text-[34px] leading-none" style={{ color: YOU }}>
          {signed(lang, guess)}
          <span className="text-[18px]"> %</span>
        </p>
        {!revealed ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={reveal} className="rounded-[3px] bg-cold px-5 py-2.5 text-[14px] font-semibold text-paper hover:opacity-90">
              {copy.play.reveal}
            </button>
            {crash >= 0 && crash !== j && (
              <button type="button" onClick={() => goTo(crash)} className="rounded-[3px] border border-control px-4 py-2.5 text-[14px] text-ink hover:border-cold">
                {copy.play.crash}
              </button>
            )}
          </div>
        ) : (
          <div aria-live="polite">
            <p className="mt-5 text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{fill(copy.play.errorsTitle, { period: target })}</p>
            <ol className="mt-2">
              {[{ m: "you" as const, e: yourErr }, ...sorted]
                .sort((a, b) => (a.e ?? Infinity) - (b.e ?? Infinity))
                .map((r) => (
                  <li key={r.m} className="flex items-center gap-2 border-b border-rulesoft py-1.5 text-[14px]">
                    {r.m === "you" ? (
                      <span className="inline-block size-3.5 rounded-full" style={{ background: YOU }} aria-hidden="true" />
                    ) : (
                      <Swatch m={r.m} />
                    )}
                    <span className={r.m === "you" ? "font-semibold text-ink" : "text-body"}>{r.m === "you" ? copy.you : copy.models[r.m]}</span>
                    <span className="ml-auto font-figure text-[16px] text-ink">{num(lang, r.e)}</span>
                  </li>
                ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={nextRound} className="rounded-[3px] bg-cold px-5 py-2.5 text-[14px] font-semibold text-paper hover:opacity-90">
                {copy.play.next}
              </button>
              {crash >= 0 && crash !== j && (
                <button type="button" onClick={() => goTo(crash)} className="rounded-[3px] border border-control px-4 py-2.5 text-[14px] text-ink hover:border-cold">
                  {copy.play.crash}
                </button>
              )}
            </div>
          </div>
        )}
        <p className="mt-5 text-[14px] leading-[1.6] text-muted">{copy.play.hint}</p>
      </div>
    </div>
  );
}

function Scoreboard({ copy, lang, rounds, onReset }: {
  copy: LabCopy;
  lang: string;
  rounds: Record<"you" | ModelId, number>[];
  onReset: () => void;
}) {
  if (!rounds.length) return null;
  const col = (k: "you" | ModelId) => mean(rounds.map((r) => r[k]).filter(Number.isFinite));
  const won = rounds.filter((r) => r.you < r.naive).length;
  const rows: ("you" | ModelId)[] = ["you", "naive", "ar1", "lstm", "rf"];
  return (
    <div className="mt-8 border-t-2 border-ink pt-4" aria-live="polite">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
          {copy.play.score} · {copy.play.rounds}: {rounds.length}
        </p>
        <p className="text-[15px] font-semibold text-ink">{fill(copy.play.beatNaive, { won, n: rounds.length })}</p>
        <button type="button" onClick={onReset} className="ml-auto text-[14px] text-muted underline underline-offset-4 hover:text-cold">
          {copy.play.reset}
        </button>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
        {rows.map((k) => (
          <li key={k} className="border-t border-rule pt-2">
            <span className="flex items-center gap-2 text-[14px] text-body">
              {k === "you" ? <span className="inline-block size-3.5 rounded-full" style={{ background: YOU }} aria-hidden="true" /> : <Swatch m={k} />}
              {k === "you" ? copy.play.yourMae : copy.models[k]}
            </span>
            <span className="mt-1 block font-figure text-[24px] leading-none text-ink">{num(lang, col(k))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function niceTicks(lo: number, hi: number, n: number): number[] {
  const raw = (hi - lo) / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

// ================================================================ ORIGEN MÓVIL

const BT_MODELS: ModelId[] = ["ar1", "arima", "rf", "lstm", "comb"];

function Backtest({ copy, lang }: { copy: LabCopy; lang: string }) {
  const { meta, series, failed, retry } = useSeries();
  const { freq, iso3 } = useSel();
  if (failed) return <Failed copy={copy} retry={retry} />;
  if (!meta || !series) return <Loading copy={copy} />;
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <FreqToggle copy={copy} meta={meta} />
        <CountrySelect copy={copy} meta={meta} lang={lang} />
      </div>
      <BacktestChart key={`${freq}-${iso3}`} copy={copy} lang={lang} s={series} meta={meta} />
    </div>
  );
}

function BacktestChart({ copy, lang, s, meta }: { copy: LabCopy; lang: string; s: Series; meta: Meta }) {
  const n = nOrigins(s);
  const [j, setJ] = useState(() => firstOriginOf(s, meta.ruptura[0]));
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState<ModelId[]>(["ar1", "lstm"]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setJ((k) => {
        if (k >= n - 1) {
          setPlaying(false);
          return k;
        }
        return k + 1;
      });
    }, s.inicio.includes("Q") ? 160 : 260);
    return () => window.clearInterval(id);
  }, [playing, n, s.inicio]);

  const W = 720, H = 300, H2 = 150, P = { l: 46, r: 16, t: 16, b: 30 };
  const len = s.y.length;
  const vals = s.y.filter((v): v is number => v != null);
  const lo = Math.floor(Math.min(...vals, 0) - 1);
  const hi = Math.ceil(Math.max(...vals) + 1);
  const x = lin(0, len - 1, P.l, W - P.r);
  const y = lin(lo, hi, H - P.b, P.t);
  const T = s.o0 + j;
  const labels = useMemo(() => s.y.map((_, i) => periodLabel(s.inicio, i)), [s]);
  const rupt = labels.map((l, i) => (regimeOf(l, meta.ruptura) === "ruptura" ? i : -1)).filter((i) => i >= 0);

  const line = (pts: [number, number | null][]) => {
    let d = "";
    let pen = false;
    for (const [i, v] of pts) {
      if (v == null) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  const actual = line(s.y.map((v, i) => [i, v]));
  const fc = (m: ModelId) => line(s.pron[m].slice(0, j + 1).map((v, k) => [s.o0 + k, v]));

  // error acumulado relativo al ingenuo, origen a origen
  const rx = lin(0, n - 1, P.l, W - P.r);
  const ry = lin(0.4, 1.8, H2 - 24, 10);
  const running = (m: ModelId) => {
    let d = "";
    let pen = false;
    for (let k = 0; k <= j; k++) {
      const r = relMae(s, m, 0, k + 1);
      if (!Number.isFinite(r)) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${rx(k).toFixed(1)},${ry(clamp(r, 0.4, 1.8)).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  const ticks = niceTicks(lo, hi, 5);
  const every = s.inicio.includes("Q") ? 20 : 10;
  const xTicks = labels.map((l, i) => i).filter((i) => (s.inicio.includes("Q") ? labels[i].endsWith("Q1") && yearOf(labels[i]) % 5 === 0 : yearOf(labels[i]) % every === 0));
  const toggle = (m: ModelId) => setShown((v) => (v.includes(m) ? v.filter((k) => k !== m) : [...v, m]));
  const target = labels[T];

  return (
    <div className="mt-6">
      <fieldset className="atlas-field">
        <legend>{copy.backtest.toggle}</legend>
        <div className="flex flex-wrap gap-2">
          {BT_MODELS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={shown.includes(m)}
              onClick={() => toggle(m)}
              className="fl-chip"
            >
              <Swatch m={m} />
              {copy.models[m]}
            </button>
          ))}
        </div>
      </fieldset>

      <ScaleAware base={W} className="mt-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.growth}. ${fill(copy.backtest.trained, { n: T, origin: labels[T - 1] })}. ${fill(copy.backtest.forecastFor, { period: target })}`}>
          {rupt.length > 0 && (
            <rect x={x(rupt[0]) - 3} y={P.t} width={x(rupt[rupt.length - 1]) - x(rupt[0]) + 6} height={H - P.b - P.t} fill="var(--color-band2)" />
          )}
          <rect x={P.l} y={P.t} width={Math.max(0, x(T - 1) - P.l)} height={H - P.b - P.t} fill="var(--color-coldsoft)" opacity="0.7" />
          {ticks.map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} strokeWidth="1" />
              <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
                {num(lang, v, 0)}
              </text>
            </g>
          ))}
          {xTicks.map((i) => (
            <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
              {yearOf(labels[i])}
            </text>
          ))}
          {rupt.length > 0 && (
            <text x={x(rupt[0]) - 8} y={P.t + 14} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
              {copy.ruptura}
            </text>
          )}
          <path d={actual} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.85" />
          <path d={fc("naive")} fill="none" stroke={STYLE.naive.color} strokeWidth="1.5" strokeDasharray={STYLE.naive.dash} />
          {shown.map((m) => (
            <path key={m} d={fc(m)} fill="none" stroke={STYLE[m].color} strokeWidth="2" strokeDasharray={STYLE[m].dash || undefined} />
          ))}
          <line x1={x(T - 1)} x2={x(T - 1)} y1={P.t} y2={H - P.b} stroke="var(--color-cold)" strokeWidth="1.5" />
          {(["naive", ...shown] as ModelId[]).map((m) => {
            const f = s.pron[m][j];
            return f != null ? <Mark key={m} x={x(T)} y={y(f)} m={m} r={5} /> : null;
          })}
          {s.y[T] != null && <circle cx={x(T)} cy={y(s.y[T] as number)} r={5.5} fill="var(--color-ink)" />}
        </svg>
      </ScaleAware>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="button" onClick={() => {
          if (!playing && j >= n - 1) setJ(0);
          setPlaying((p) => !p);
        }} className="rounded-[3px] bg-cold px-4 py-2 text-[14px] font-semibold text-paper hover:opacity-90">
          {playing ? copy.backtest.pause : copy.backtest.play}
        </button>
        <label className="atlas-range grow">
          <span className="sr-only">{copy.backtest.origin}</span>
          <input
            type="range"
            min={0}
            max={n - 1}
            value={j}
            onChange={(e) => {
              setPlaying(false);
              setJ(Number(e.target.value));
            }}
            className="!w-full"
            aria-valuetext={labels[T - 1]}
          />
          <output>{labels[T - 1]}</output>
        </label>
      </div>
      <p className="mt-2 text-[14px] text-body">
        {fill(copy.backtest.trained, { n: T, origin: labels[T - 1] })} · {fill(copy.backtest.forecastFor, { period: target })}
        {s.y[T] != null && <> · {copy.actual} <b className="font-semibold text-ink">{signed(lang, s.y[T])}</b></>}
      </p>

      <p className="mt-6 text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.backtest.running}</p>
      <ScaleAware base={W} className="mt-2">
        <svg viewBox={`0 0 ${W} ${H2}`} className="block w-full" role="img" aria-label={copy.backtest.running}>
          {[0.5, 1, 1.5].map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={ry(v)} y2={ry(v)} stroke={v === 1 ? STYLE.naive.color : "var(--color-rule)"} strokeWidth={v === 1 ? 1.5 : 1} strokeDasharray={v === 1 ? "5 6" : undefined} />
              <text x={P.l - 8} y={ry(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
                {num(lang, v, 1)}
              </text>
            </g>
          ))}
          {shown.map((m) => (
            <path key={m} d={running(m)} fill="none" stroke={STYLE[m].color} strokeWidth="2" strokeDasharray={STYLE[m].dash || undefined} />
          ))}
          <text x={W - P.r} y={H2 - 6} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
            {copy.backtest.origin} → {labels[T - 1]}
          </text>
        </svg>
      </ScaleAware>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-body">
        {shown.map((m) => {
          const r = relMae(s, m, 0, j + 1);
          const e = absErrors(s, m, j, j + 1)[0];
          return (
            <li key={m} className="flex items-center gap-2">
              <Swatch m={m} />
              {copy.models[m]}: <b className="font-semibold text-ink">{num(lang, r, 2)}</b>
              <span className="text-muted">· {fill(copy.backtest.errorAt, { period: target })} {num(lang, e)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ================================================================ LA REGIÓN

const REGION_MODELS: ModelId[] = ["ar1", "arima", "rf", "lstm", "comb"];

function Region({ copy, lang }: { copy: LabCopy; lang: string }) {
  const meta = useLoad(loadMeta, "meta");
  const sum = useLoad(loadSummary, "summary");
  const { freq, iso3 } = useSel();
  const [regime, setRegime] = useState<Regime>("calma");
  const [hover, setHover] = useState<{ iso3: string; m: ModelId } | null>(null);
  if (meta.failed || sum.failed) return <Failed copy={copy} retry={() => { meta.retry(); sum.retry(); }} />;
  if (!meta.data || !sum.data) return <Loading copy={copy} />;
  const M = meta.data;
  const S: Summary = sum.data;
  const rows = S.relativo[freq].filter((r) => r.regimen === regime);
  const agg = S.agregado[freq];
  const byIso = new Map(M.paises.map((p) => [p.iso3, p]));

  const W = 720, rowH = 58, P = { l: 16, r: 20, t: 34, b: 30 };
  const H = P.t + REGION_MODELS.length * rowH + P.b;
  const LO = 0.3, HI = 3.2;
  const x = (v: number) => lin(Math.log(LO), Math.log(HI), P.l, W - P.r)(Math.log(clamp(v, LO, HI)));
  const hovered = hover ? rows.find((r) => r.iso3 === hover.iso3 && r.modelo === hover.m) : null;
  const economies = Array.from(new Set(rows.map((r) => r.iso3))).sort();

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <FreqToggle copy={copy} meta={M} />
        <Toggle legend={copy.regime} value={regime} onChange={setRegime} options={[{ id: "calma", label: copy.calma }, { id: "ruptura", label: copy.ruptura }]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <ScaleAware base={W}>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.region.axis}. ${copy.region.table}.`} onPointerLeave={() => setHover(null)}>
            <rect x={P.l} y={P.t - 6} width={x(1) - P.l} height={H - P.t - P.b + 6} fill="var(--color-coldsoft)" opacity="0.6" />
            {[0.5, 0.75, 1, 1.5, 2, 3].map((v) => (
              <g key={v}>
                <line x1={x(v)} x2={x(v)} y1={P.t - 6} y2={H - P.b} stroke={v === 1 ? STYLE.naive.color : "var(--color-rule)"} strokeWidth={v === 1 ? 1.5 : 1} strokeDasharray={v === 1 ? "5 6" : undefined} />
                <text x={x(v)} y={H - 10} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
                  {num(lang, v, v === 0.75 ? 2 : v % 1 ? 1 : 0)}
                </text>
              </g>
            ))}
            <text x={x(1) - 6} y={P.t - 12} textAnchor="end" fill="var(--color-cold)" style={TXT()} fontWeight={600}>
              ← {copy.region.better}
            </text>
            <text x={x(1) + 6} y={P.t - 12} fill="var(--color-muted)" style={TXT()}>
              {copy.region.worse} →
            </text>
            {REGION_MODELS.map((m, r) => {
              const cy = P.t + r * rowH + rowH / 2;
              const med = agg.find((a) => a.id === m)?.[regime].mediana;
              return (
                <g key={m}>
                  <line x1={P.l} x2={W - P.r} y1={cy} y2={cy} stroke="var(--color-rulesoft)" />
                  <text x={P.l} y={cy - 16} fill="var(--color-ink)" style={TXT(13)} fontWeight={600}>
                    {copy.models[m]}
                  </text>
                  {med != null && <line x1={x(med)} x2={x(med)} y1={cy - 15} y2={cy + 15} stroke={STYLE[m].color} strokeWidth="3" />}
                  {rows
                    .filter((d) => d.modelo === m && d.rel != null)
                    .map((d, i) => {
                      const isSel = d.iso3 === iso3;
                      const jitter = ((i % 5) - 2) * 3.5;
                      return (
                        <g
                          key={d.iso3}
                          onPointerEnter={() => setHover({ iso3: d.iso3, m })}
                          onClick={() => setSel({ iso3: d.iso3 })}
                          style={{ cursor: "pointer" }}
                        >
                          <circle cx={x(d.rel as number)} cy={cy + jitter} r={isSel ? 7 : 5} fill={STYLE[m].color} fillOpacity={isSel ? 1 : 0.45} stroke={isSel ? "var(--color-ink)" : STYLE[m].color} strokeWidth={isSel ? 2 : 1} />
                          <circle cx={x(d.rel as number)} cy={cy + jitter} r={11} fill="transparent" />
                        </g>
                      );
                    })}
                </g>
              );
            })}
          </svg>
        </ScaleAware>

        <div>
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-ink text-left text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
                <th className="py-1.5 pr-2 font-semibold">{copy.region.median}</th>
                <th className="py-1.5 pr-2 text-right font-semibold">{copy.region.wilcoxon}</th>
                <th className="py-1.5 text-right font-semibold" title={copy.region.sig}>DM</th>
              </tr>
            </thead>
            <tbody>
              {REGION_MODELS.map((m) => {
                const c = agg.find((a) => a.id === m)?.[regime];
                const good = c?.mediana != null && c.mediana < 1 && c.p != null && c.p < 0.05;
                return (
                  <tr key={m} className="border-b border-rulesoft">
                    <td className="py-1.5 pr-2">
                      <span className="flex items-center gap-2">
                        <Swatch m={m} />
                        <span className={`font-figure text-[17px] ${good ? "text-cold" : "text-ink"}`}>{c?.mediana != null ? num(lang, c.mediana, 2) : copy.region.excluded}</span>
                      </span>
                    </td>
                    <td className={`py-1.5 pr-2 text-right ${good ? "font-semibold text-cold" : "text-body"}`}>{pval(lang, c?.p)}</td>
                    <td className="py-1.5 text-right text-body">{c?.n != null ? `${c.sig ?? 0}/${c.n}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-[14px] leading-[1.55] text-muted">{copy.region.sig}</p>
        </div>
      </div>

      <p className="mt-4 min-h-[1.6em] text-[14px] text-body" aria-live="polite">
        {hovered
          ? `${countryName(byIso.get(hovered.iso3), lang)} · ${copy.models[hovered.modelo]}: ${num(lang, hovered.rel, 2)} · p = ${pval(lang, hovered.p)}`
          : fill(copy.region.selected, { name: countryName(byIso.get(iso3), lang) }) + " · " + copy.region.select}
      </p>
      {freq === "trimestral" && <p className="mt-1 text-[14px] text-muted">{copy.region.quarterlyNote}</p>}

      <details className="mt-4">
        <summary className="cursor-pointer text-[14px] text-cold underline underline-offset-4">{copy.region.table}</summary>
        <div tabIndex={0} role="region" aria-label={copy.region.table} className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-ink text-left text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
                <th className="py-1.5 pr-3 font-semibold">{copy.economy}</th>
                {REGION_MODELS.map((m) => (
                  <th key={m} className="py-1.5 pr-3 text-right font-semibold">{copy.models[m]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {economies.map((e) => (
                <tr key={e} className="border-b border-rulesoft">
                  <td className="py-1.5 pr-3 text-ink">
                    <button type="button" onClick={() => setSel({ iso3: e })} className="text-left hover:text-cold" aria-pressed={e === iso3}>
                      {countryName(byIso.get(e), lang)}
                    </button>
                  </td>
                  {REGION_MODELS.map((m) => {
                    const d = rows.find((r) => r.iso3 === e && r.modelo === m);
                    return (
                      <td key={m} className={`py-1.5 pr-3 text-right ${d?.rel != null && d.rel < 1 ? "text-cold" : "text-body"}`}>
                        {d?.rel != null ? num(lang, d.rel, 2) : "—"}
                        {d?.sig ? " *" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

// ================================================================ FRONTERA

function Frontier({ copy, lang }: { copy: LabCopy; lang: string }) {
  const meta = useLoad(loadMeta, "meta");
  const sum = useLoad(loadSummary, "summary");
  const [k, setK] = useState(20);
  if (meta.failed || sum.failed) return <Failed copy={copy} retry={() => { meta.retry(); sum.retry(); }} />;
  if (!meta.data || !sum.data) return <Loading copy={copy} />;
  const byIso = new Map(meta.data.paises.map((p) => [p.iso3, p]));
  const rows = [...sum.data.frontera]
    .map((f) => ({ iso3: f.iso3, full: f.completos[k - 1] ?? 0, run: f.contiguos[k - 1] ?? 0 }))
    .sort((a, b) => b.run - a.run || b.full - a.full || a.iso3.localeCompare(b.iso3));
  const total = rows.length;
  const need = 3 * k;
  const viable = rows.filter((r) => r.run >= need).length;
  const zero = rows.filter((r) => r.full === 0).length;

  const W = 720, rowH = 34, P = { l: 8, r: 70, t: 8, b: 26 };
  const H = P.t + total * rowH + P.b;
  const maxY = 70;
  const x = lin(0, maxY, P.l, W - P.r);

  return (
    <div>
      <label className="atlas-field">
        <span>{copy.frontier.k}</span>
        <span className="atlas-range">
          <input type="range" min={1} max={33} value={k} onChange={(e) => setK(Number(e.target.value))} className="!w-[260px] max-w-full" />
          <output className="!text-[26px]">{k}</output>
        </span>
      </label>
      <p className="mt-4 text-[15px] text-ink" aria-live="polite">
        <b className="font-semibold">{fill(copy.frontier.viable, { n: viable, total, k })}</b>
        {zero > 0 && <span className="text-body"> · {fill(copy.frontier.zero, { n: zero, total })}</span>}
      </p>
      <ScaleAware base={W} className="mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${fill(copy.frontier.viable, { n: viable, total, k })}. ${fill(copy.frontier.zero, { n: zero, total })}.`}>
          {[0, 20, 40, 60].map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={P.t} y2={H - P.b} stroke="var(--color-rule)" />
              <text x={x(v)} y={H - 8} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
                {v}
              </text>
            </g>
          ))}
          {rows.map((r, i) => {
            const cy = P.t + i * rowH;
            const ok = r.run >= need;
            return (
              <g key={r.iso3}>
                <text x={P.l} y={cy + 12} fill="var(--color-ink)" style={TXT()}>
                  {countryName(byIso.get(r.iso3), lang)}
                </text>
                <rect x={x(0)} y={cy + 17} width={x(r.full) - x(0)} height={12} fill="var(--color-coldsoft)" stroke="var(--color-coldline)" className="fl-bar" />
                <rect x={x(0)} y={cy + 17} width={x(r.run) - x(0)} height={12} fill={ok ? "var(--color-cold)" : "var(--color-control)"} className="fl-bar" />
                <text x={x(Math.max(r.full, r.run)) + 6} y={cy + 28} fill="var(--color-body)" style={TXT()}>
                  {r.full > r.run ? `${r.run} / ${r.full}` : r.run}
                </text>
              </g>
            );
          })}
          {need <= maxY && (
            <g>
              <line x1={x(need)} x2={x(need)} y1={P.t - 4} y2={H - P.b} stroke="var(--color-neg)" strokeWidth="1.5" strokeDasharray="4 4" />
            </g>
          )}
        </svg>
      </ScaleAware>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-body">
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-5 bg-cold" aria-hidden="true" />{copy.frontier.years}</li>
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-5 border border-coldline bg-coldsoft" aria-hidden="true" />{copy.frontier.complete}</li>
        <li className="flex items-center gap-2"><span className="inline-block h-0 w-5 border-t-2 border-dashed border-neg" aria-hidden="true" />{copy.frontier.threshold}: {need}</li>
      </ul>
    </div>
  );
}

// ================================================================ FRECUENCIA

function Frequency({ copy, lang }: { copy: LabCopy; lang: string }) {
  const sum = useLoad(loadSummary, "summary");
  const [arm, setArm] = useState<"M" | "A">("M");
  if (sum.failed) return <Failed copy={copy} retry={sum.retry} />;
  if (!sum.data) return <Loading copy={copy} />;
  const F = sum.data.frecuencia;
  const get = (b: string, m: string) => F.find((r) => r.brazo === b && r.modelo === m);
  const models = ["naive", "ar1", "lstm"] as const;
  const max = 9;
  const lstm = get(arm, "lstm");

  return (
    <div>
      <div className="flex">
        <Toggle legend={copy.freq} value={arm} onChange={setArm} options={[{ id: "M", label: copy.frequency.monthly }, { id: "A", label: copy.frequency.quarterly }]} />
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.frequency.maeTitle}</p>
          <ul className="mt-3 space-y-3">
            {models.map((m) => {
              const r = get(arm, m);
              const w = r?.mae != null ? (r.mae / max) * 100 : 0;
              return (
                <li key={m}>
                  <span className="flex items-center gap-2 text-[14px] text-body">
                    <Swatch m={m} />
                    {copy.models[m]}
                  </span>
                  <span className="mt-1 flex items-center gap-3">
                    <span className="fl-hbar block h-5" style={{ width: `${w}%`, background: m === "naive" ? "var(--color-band2)" : STYLE[m].color, border: m === "naive" ? "1.5px dashed var(--color-muted)" : undefined }} />
                    <span className="font-figure text-[18px] text-ink">{num(lang, r?.mae)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t-2 border-ink pt-4 lg:border-t-0 lg:border-l lg:border-rule lg:pt-0 lg:pl-6">
          <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.frequency.gain}</p>
          <p className={`mt-1 font-figure text-[40px] leading-none ${lstm?.ganancia != null && lstm.ganancia > 0 ? "text-cold" : "text-neg"}`} aria-live="polite">
            {signed(lang, lstm?.ganancia)} %
          </p>
          <p className="mt-2 text-[14px] text-body">
            p = {pval(lang, lstm?.p)} · Holm {pval(lang, lstm?.holm)}
          </p>
          <p className="mt-4 text-[14px] leading-[1.6] text-body">{copy.frequency.reading}</p>
        </div>
      </div>

      <div tabIndex={0} role="region" aria-label={copy.frequency.arms} className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[14px]">
          <caption className="pb-2 text-left text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.frequency.arms}</caption>
          <thead>
            <tr className="border-b-2 border-ink text-left text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
              <th className="py-1.5 pr-3 font-semibold">{copy.frequency.arm}</th>
              <th className="py-1.5 pr-3 text-right font-semibold">{copy.models.naive}</th>
              <th className="py-1.5 pr-3 text-right font-semibold">{copy.models.lstm}</th>
              <th className="py-1.5 pr-3 text-right font-semibold">{copy.frequency.gain}</th>
              <th className="py-1.5 pr-3 text-right font-semibold">p</th>
              <th className="py-1.5 text-right font-semibold">Holm</th>
            </tr>
          </thead>
          <tbody>
            {(["M", "A", "B", "C"] as const).map((b) => {
              const l = get(b, "lstm");
              return (
                <tr key={b} className={`border-b border-rulesoft ${b === arm ? "bg-coldsoft" : ""}`}>
                  <td className="py-2 pr-3 text-ink">{copy.frequency.armNames[b]}</td>
                  <td className="py-2 pr-3 text-right text-body">{num(lang, get(b, "naive")?.mae)}</td>
                  <td className="py-2 pr-3 text-right text-body">{num(lang, l?.mae)}</td>
                  <td className={`py-2 pr-3 text-right font-figure text-[16px] ${l?.ganancia != null && l.ganancia > 0 ? "text-cold" : "text-neg"}`}>{signed(lang, l?.ganancia)} %</td>
                  <td className="py-2 pr-3 text-right text-body">{pval(lang, l?.p)}</td>
                  <td className="py-2 text-right text-body">{pval(lang, l?.holm)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================================================================ HOLM

function Holm({ copy, lang }: { copy: LabCopy; lang: string }) {
  const sum = useLoad(loadSummary, "summary");
  const [on, setOn] = useState(false);
  if (sum.failed) return <Failed copy={copy} retry={sum.retry} />;
  if (!sum.data) return <Loading copy={copy} />;
  const rows = [...sum.data.holm].sort((a, b) => (b.ganancia ?? -Infinity) - (a.ganancia ?? -Infinity));
  const star = (r: (typeof rows)[number]) => {
    const p = on ? r.holm : r.p;
    return p != null && p < 0.05 && (r.ganancia ?? 0) > 0;
  };
  const count = rows.filter(star).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className="fl-switch">
          <span className="fl-switch-track" aria-hidden="true">
            <span className="fl-switch-knob" />
          </span>
          <span className="text-[14.5px] font-semibold text-ink">{copy.holm.switch}</span>
        </button>
        <p className="font-figure text-[22px] text-cold" aria-live="polite">
          {fill(copy.holm.count, { n: count })}
        </p>
      </div>
      <div tabIndex={0} role="region" aria-label={copy.holm.note} className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
              <th className="py-1.5 pr-3 font-semibold">{copy.holm.model}</th>
              <th className="py-1.5 pr-3 text-right font-semibold">{copy.holm.gain}</th>
              <th className={`py-1.5 pr-3 text-right font-semibold ${on ? "opacity-60" : ""}`}>{copy.holm.p}</th>
              <th className={`py-1.5 pr-3 text-right font-semibold ${on ? "" : "opacity-60"}`}>{copy.holm.pHolm}</th>
              <th className="w-8 py-1.5 font-semibold" aria-label="5 %" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.modelo} className="border-b border-rulesoft">
                <td className="py-1.5 pr-3 text-ink">{r.modelo}</td>
                <td className={`py-1.5 pr-3 text-right ${(r.ganancia ?? 0) > 0 ? "text-ink" : "text-neg"}`}>{signed(lang, r.ganancia)} %</td>
                <td className={`py-1.5 pr-3 text-right ${on ? "text-muted" : "text-ink"}`}>{pval(lang, r.p)}</td>
                <td className={`py-1.5 pr-3 text-right ${on ? "text-ink" : "text-muted"}`}>{pval(lang, r.holm)}</td>
                <td className="py-1.5 text-center font-figure text-[18px] text-cold">{star(r) ? "✱" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[14px] text-muted">{copy.holm.note}</p>
    </div>
  );
}

// ================================================================ despacho

export default function Widgets({ kind, copy, lang }: { kind: Exclude<Kind, "dashboard">; copy: LabCopy; lang: string }) {
  switch (kind) {
    case "play":
      return <Play copy={copy} lang={lang} />;
    case "backtest":
      return <Backtest copy={copy} lang={lang} />;
    case "region":
      return <Region copy={copy} lang={lang} />;
    case "frontier":
      return <Frontier copy={copy} lang={lang} />;
    case "frequency":
      return <Frequency copy={copy} lang={lang} />;
    case "holm":
      return <Holm copy={copy} lang={lang} />;
  }
}
