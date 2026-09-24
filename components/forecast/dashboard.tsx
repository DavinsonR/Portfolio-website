"use client";

/* El panorama: analítica descriptiva de América Latina antes de los modelos.

   Un solo estado de filtros —economías, métrica, período y eventos— gobierna todas las
   vistas: indicadores, serie, ranking, dispersión, mapa de calor y cronología. Cambiar
   un filtro mueve todo a la vez, y casi todo se puede usar como filtro a su vez (tocar
   una barra, un punto o un nombre añade o quita esa economía; tocar un evento enfoca su
   período). La estacionalidad va aparte porque solo existe para Colombia.

   Mismas reglas visuales que el resto del laboratorio: cifras en tinta o azul, sin
   ámbar; cada economía se distingue por color Y trazo, con su nombre al final de la
   línea; los textos de los SVG miden 12 px en pantalla (ScaleAware). */

import { useMemo, useRef, useState } from "react";
import ScaleAware from "@/components/ScaleAware";
import type { LabCopy } from "@/lib/content/forecast";
import {
  loadEvents,
  loadIse,
  loadMeta,
  loadPanel,
  seasonalProfile,
  stats,
  symexp,
  symlog,
  type EconEvent,
  type EventCat,
  type Events,
  type Indicator,
  type IndicatorId,
  type Ise,
  type Meta,
  type Panel,
} from "@/lib/data/forecast-lab";
import { setSel } from "./store";
import { useLoadAll } from "./useLoad";

type Copy = LabCopy["dash"];

const MAX = 6;
const PRESETS: Record<keyof Copy["presets"], string[]> = {
  big: ["ARG", "BRA", "CHL", "COL", "MEX", "PER"],
  andes: ["BOL", "COL", "ECU", "PER", "VEN"],
  south: ["ARG", "BRA", "CHL", "PRY", "URY"],
  central: ["CRI", "GTM", "HND", "NIC", "PAN", "SLV"],
  caribbean: ["CUB", "DOM", "HTI", "MEX"],
};

// Seis voces que ya existen en el sistema; la quinta y la sexta se separan por trazo.
const PALETTE = [
  { c: "var(--color-cold)", d: "" },
  { c: "var(--color-building)", d: "" },
  { c: "var(--color-pos)", d: "" },
  { c: "var(--color-neg)", d: "" },
  { c: "var(--color-ink)", d: "7 4" },
  { c: "var(--color-muted)", d: "2 4" },
];

const TXT = (px = 12) => ({ fontSize: `calc(${px}px * var(--k, 1))` });
const lin = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

function fmt(lang: string, v: number | null | undefined, ind: IndicatorId, withUnit = false): string {
  if (v == null || !Number.isFinite(v)) return "—";
  const loc = lang === "en" ? "en-US" : "es-CO";
  const d = ind === "pib_per_capita" ? 0 : Math.abs(v) >= 1000 ? 0 : 1;
  // Menos tipográfico, no guion: «−12,3» y no «-12,3».
  const s = new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v).replace("-", "−");
  if (!withUnit) return s;
  return ind === "pib_per_capita" ? `US$ ${s}` : `${s} %`;
}

function niceTicks(lo: number, hi: number, n: number): number[] {
  const raw = (hi - lo) / n || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
}

/** Ticks para la escala simétrica logarítmica: potencias de 10 con signo y el cero. */
function logTicks(lo: number, hi: number): number[] {
  const out = [0];
  for (const p of [1, 10, 100, 1000, 10000, 100000]) {
    if (p <= hi) out.push(p);
    if (-p >= lo) out.unshift(-p);
  }
  return out;
}

// ================================================================ contenedor

export default function Dashboard({ copy, lang }: { copy: LabCopy; lang: string }) {
  const { data, failed, retry } = useLoadAll({ meta: loadMeta, panel: loadPanel, events: loadEvents, ise: loadIse }, "panorama");
  if (failed)
    return (
      <div role="alert" className="py-12 text-center text-[14px] text-body">
        <p>{copy.error}</p>
        <button type="button" onClick={retry} className="mt-3 rounded-[3px] border border-control px-4 py-2 text-ink hover:border-cold">
          {copy.retry}
        </button>
      </div>
    );
  if (!data)
    return (
      <p role="status" className="py-16 text-center text-[14px] text-muted">
        {copy.loading}
      </p>
    );
  return <Board copy={copy.dash} lang={lang} meta={data.meta} panel={data.panel} events={data.events} ise={data.ise} />;
}

// ================================================================ el tablero

/** Exportado para la prueba de humo (tests/forecast-dashboard.test.tsx): se renderiza con los
 *  JSON reales y cada métrica, sin navegador. */
export function Board({ copy, lang, meta, panel, events, ise, initial }: {
  copy: Copy; lang: string; meta: Meta; panel: Panel; events: Events; ise: Ise;
  initial?: { sel?: string[]; ind?: IndicatorId; from?: number; to?: number };
}) {
  const years = panel.anios;
  const lastYear = years[years.length - 1];
  const [sel, setSelected] = useState<string[]>(initial?.sel ?? PRESETS.big);
  const [ind, setInd] = useState<IndicatorId>(initial?.ind ?? "pib_crecimiento");
  const [from, setFrom] = useState(initial?.from ?? 1980);
  const [to, setTo] = useState(initial?.to ?? lastYear);
  const [showEvents, setShowEvents] = useState(true);
  const [cats, setCats] = useState<EventCat[]>(events.categorias.map((c) => c.id));
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [focusEvent, setFocusEvent] = useState<EconEvent | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const indicator = panel.indicadores.find((i) => i.id === ind) as Indicator;
  const name = (iso3: string) => {
    const c = meta.paises.find((p) => p.iso3 === iso3);
    return c ? (lang === "en" ? c.en : c.es) : iso3;
  };
  const i0 = years.indexOf(from);
  const i1 = years.indexOf(to);
  const span = years.slice(i0, i1 + 1);
  const series = (iso3: string, id: IndicatorId = ind) => (panel.datos[iso3]?.[id] ?? []).slice(i0, i1 + 1);
  const colorOf = (iso3: string) => PALETTE[sel.indexOf(iso3)] ?? PALETTE[0];

  const toggle = (iso3: string) => {
    setSelected((s) => (s.includes(iso3) ? s.filter((x) => x !== iso3) : s.length >= MAX ? [...s.slice(1), iso3] : [...s, iso3]));
    // La economía viaja al juego y al origen móvil, si tiene serie anual para ellos.
    if (meta.paises.find((c) => c.iso3 === iso3)?.anual) setSel({ iso3 });
  };

  const visibleEvents = events.eventos.filter(
    (e) => showEvents && cats.includes(e.cat) && e.anio >= from && e.anio <= to && (e.iso3 === "LATAM" || sel.includes(e.iso3)),
  );
  const eventNo = new Map(visibleEvents.map((e, k) => [e, k + 1]));
  // Cobertura parcial también se dice: Argentina tiene inflación solo desde 2018 en el Banco
  // Mundial, y una línea corta sin aviso se leería como el dato completo.
  const thin = sel
    .map((iso3) => ({ iso3, n: series(iso3).filter((v) => v != null).length }))
    .filter((c) => c.n < span.length / 2);

  const focus = (e: EconEvent) => {
    setFocusEvent(e);
    setFrom(Math.max(years[0], e.anio - 6));
    setTo(Math.min(lastYear, e.anio + 6));
    if (e.iso3 !== "LATAM" && !sel.includes(e.iso3)) toggle(e.iso3);
    chartRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <div className="fl-board">
      <Filters
        copy={copy}
        lang={lang}
        meta={meta}
        panel={panel}
        events={events}
        sel={sel}
        setSelected={setSelected}
        toggle={toggle}
        ind={ind}
        setInd={setInd}
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        showEvents={showEvents}
        setShowEvents={setShowEvents}
        cats={cats}
        setCats={setCats}
        colorOf={colorOf}
        name={name}
      />

      <Kpis copy={copy} lang={lang} ind={ind} sel={sel} series={series} span={span} name={name} />
      {thin.length > 0 && (
        <p className="mt-3 text-[14px] text-muted">
          {fill(copy.missing, { names: thin.map((c) => `${name(c.iso3)} (${fill(copy.yearsOf, { n: c.n, total: span.length })})`).join(", ") })}
        </p>
      )}

      <div ref={chartRef} className="mt-8">
        <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
          {copy.chart.title} · {lang === "en" ? indicator.en : indicator.es} <span className="normal-case tracking-normal">({lang === "en" ? indicator.unidad_en : indicator.unidad_es})</span>
        </h3>
        <LineChart
          copy={copy}
          lang={lang}
          indicator={indicator}
          sel={sel}
          span={span}
          series={series}
          colorOf={colorOf}
          name={name}
          events={visibleEvents}
          eventNo={eventNo}
          hoverYear={hoverYear}
          setHoverYear={setHoverYear}
          focusEvent={focusEvent}
        />
        <p className="mt-2 text-[14px] text-muted">{copy.chart.hint}</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Ranking copy={copy} lang={lang} meta={meta} indicator={indicator} sel={sel} series={series} toggle={toggle} colorOf={colorOf} name={name} />
        <Scatter copy={copy} lang={lang} meta={meta} indicator={indicator} sel={sel} series={series} toggle={toggle} colorOf={colorOf} />
      </div>

      <Heatmap
        copy={copy}
        lang={lang}
        meta={meta}
        indicator={indicator}
        sel={sel}
        span={span}
        series={series}
        toggle={toggle}
        name={name}
        events={visibleEvents}
        hoverYear={hoverYear}
        setHoverYear={setHoverYear}
      />

      <Timeline copy={copy} lang={lang} events={events} visible={visibleEvents} eventNo={eventNo} focus={focus} name={name} focused={focusEvent} />

      <Seasonality copy={copy} lang={lang} ise={ise} />

      <p className="mt-8 text-[14px] text-muted">{copy.source}</p>
    </div>
  );
}

// ================================================================ filtros

function Filters(p: {
  copy: Copy; lang: string; meta: Meta; panel: Panel; events: Events;
  sel: string[]; setSelected: (s: string[]) => void; toggle: (iso3: string) => void;
  ind: IndicatorId; setInd: (i: IndicatorId) => void;
  from: number; to: number; setFrom: (y: number) => void; setTo: (y: number) => void;
  showEvents: boolean; setShowEvents: (b: boolean) => void;
  cats: EventCat[]; setCats: (c: EventCat[]) => void;
  colorOf: (iso3: string) => { c: string; d: string }; name: (iso3: string) => string;
}) {
  const { copy, lang, panel, events } = p;
  const years = panel.anios;
  const economies = [...p.meta.paises].sort((a, b) => p.name(a.iso3).localeCompare(p.name(b.iso3), lang));
  return (
    <div className="fl-filters border-y border-rule bg-band px-4 py-5 sm:px-5">
      <fieldset className="atlas-field">
        <legend>
          {copy.economies} <span className="font-normal tracking-normal normal-case">· {copy.max}</span>
        </legend>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
            <button key={k} type="button" className="fl-preset" onClick={() => p.setSelected(PRESETS[k])} aria-pressed={PRESETS[k].join() === p.sel.join()}>
              {copy.presets[k]}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {economies.map((c) => {
            const on = p.sel.includes(c.iso3);
            const col = on ? p.colorOf(c.iso3) : null;
            return (
              <button key={c.iso3} type="button" aria-pressed={on} onClick={() => p.toggle(c.iso3)} className="fl-chip">
                <span aria-hidden="true" className="inline-block h-[3px] w-4" style={{ background: col ? col.c : "var(--color-rule)" }} />
                {p.name(c.iso3)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
        <label className="atlas-field">
          <span>{copy.indicator}</span>
          <select value={p.ind} onChange={(e) => p.setInd(e.target.value as IndicatorId)}>
            {panel.indicadores.map((i) => (
              <option key={i.id} value={i.id}>
                {lang === "en" ? i.en : i.es}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="atlas-field">
          <legend>{copy.period}</legend>
          <div className="flex flex-wrap items-center gap-3">
            <label className="atlas-range">
              <span className="text-[14px] text-body">{copy.from}</span>
              <input type="range" min={years[0]} max={years[years.length - 1]} value={p.from} onChange={(e) => p.setFrom(Math.min(Number(e.target.value), p.to - 5))} className="!w-[130px]" />
              <output>{p.from}</output>
            </label>
            <label className="atlas-range">
              <span className="text-[14px] text-body">{copy.to}</span>
              <input type="range" min={years[0]} max={years[years.length - 1]} value={p.to} onChange={(e) => p.setTo(Math.max(Number(e.target.value), p.from + 5))} className="!w-[130px]" />
              <output>{p.to}</output>
            </label>
          </div>
        </fieldset>
      </div>

      <fieldset className="atlas-field mt-5">
        <legend>{copy.events}</legend>
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" role="switch" aria-checked={p.showEvents} onClick={() => p.setShowEvents(!p.showEvents)} className="fl-switch mr-2">
            <span className="fl-switch-track" aria-hidden="true">
              <span className="fl-switch-knob" />
            </span>
            <span className="text-[14px] text-ink">{copy.showEvents}</span>
          </button>
          {events.categorias.map((c) => {
            const on = p.cats.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                disabled={!p.showEvents}
                onClick={() => p.setCats(on ? p.cats.filter((x) => x !== c.id) : [...p.cats, c.id])}
                className="fl-chip disabled:opacity-50"
              >
                {lang === "en" ? c.en : c.es}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

// ================================================================ indicadores

function Kpis({ copy, lang, ind, sel, series, span, name }: {
  copy: Copy; lang: string; ind: IndicatorId; sel: string[];
  series: (iso3: string, id?: IndicatorId) => (number | null)[]; span: number[]; name: (iso3: string) => string;
}) {
  const all: number[] = [];
  let worst: { v: number; iso3: string; y: number } | null = null;
  let best: { v: number; iso3: string; y: number } | null = null;
  const sds: number[] = [];
  for (const iso3 of sel) {
    const s = series(iso3);
    s.forEach((v, k) => {
      if (v == null) return;
      all.push(v);
      if (!worst || v < worst.v) worst = { v, iso3, y: span[k] };
      if (!best || v > best.v) best = { v, iso3, y: span[k] };
    });
    const st = stats(s);
    if (Number.isFinite(st.sd)) sds.push(st.sd);
  }
  // Las caídas del PIB se cuentan siempre sobre el crecimiento: es la métrica de las crisis.
  let falls = 0, total = 0;
  for (const iso3 of sel) for (const v of series(iso3, "pib_crecimiento")) if (v != null) { total++; if (v < 0) falls++; }
  const m = stats(all).mean;
  const vol = sds.length ? sds.reduce((a, b) => a + b, 0) / sds.length : NaN;
  const W = worst as { v: number; iso3: string; y: number } | null;
  const B = best as { v: number; iso3: string; y: number } | null;

  const tiles = [
    { label: copy.kpis.mean, value: fmt(lang, m, ind, true), note: fill(copy.kpis.coverage, { n: all.length }) },
    { label: copy.kpis.vol, value: fmt(lang, vol, ind), note: copy.kpis.volNote },
    { label: copy.kpis.worst, value: fmt(lang, W?.v, ind, true), note: W ? `${name(W.iso3)} · ${W.y}` : "—" },
    { label: copy.kpis.best, value: fmt(lang, B?.v, ind, true), note: B ? `${name(B.iso3)} · ${B.y}` : "—" },
    { label: copy.kpis.falls, value: String(falls), note: fill(copy.kpis.fallsNote, { n: falls, total }) },
  ];
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-5" aria-live="polite">
      {tiles.map((t) => (
        <div key={t.label} className="flex flex-col border-t-2 border-ink pt-3">
          <dt className="order-2 mt-2 text-[14px] leading-[1.35] font-medium text-ink">{t.label}</dt>
          <dd className="order-1 font-figure text-[clamp(24px,2.6vw,32px)] leading-none text-ink">{t.value}</dd>
          <dd className="order-3 mt-1 text-[14px] leading-[1.4] text-body">{t.note}</dd>
        </div>
      ))}
    </dl>
  );
}

// ================================================================ la serie

function LineChart(p: {
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; span: number[];
  series: (iso3: string) => (number | null)[]; colorOf: (iso3: string) => { c: string; d: string }; name: (iso3: string) => string;
  events: EconEvent[]; eventNo: Map<EconEvent, number>; hoverYear: number | null; setHoverYear: (y: number | null) => void; focusEvent: EconEvent | null;
}) {
  const { indicator, sel, span, series, lang } = p;
  const W = 760, H = 380, P = { l: 52, r: 118, t: 64, b: 30 };
  const tf = indicator.log ? symlog : (v: number) => v;
  const vals = sel.flatMap((iso3) => series(iso3)).filter((v): v is number => v != null);
  let lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  if (indicator.id !== "pib_per_capita") lo = Math.min(lo, 0);
  const pad = (tf(hi) - tf(lo)) * 0.06 || 1;
  const d0 = tf(lo) - pad, d1 = tf(hi) + pad;
  const x = lin(span[0], span[span.length - 1], P.l, W - P.r);
  const y = (v: number) => lin(d0, d1, H - P.b, P.t)(tf(v));
  const ticks = (indicator.log ? logTicks(symexp(d0), symexp(d1)) : niceTicks(d0, d1, 5)).filter((v) => { const u = tf(v); return u >= d0 && u <= d1; });
  const svg = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; w: number; e?: EconEvent } | null>(null);

  const path = (s: (number | null)[]) => {
    let d = "", pen = false;
    s.forEach((v, k) => {
      if (v == null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(span[k]).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  // Etiquetas al final de cada línea, separadas para que no se pisen.
  const ends = sel
    .map((iso3) => {
      const s = series(iso3);
      let k = s.length - 1;
      while (k >= 0 && s[k] == null) k--;
      return k >= 0 ? { iso3, x: x(span[k]), y: y(s[k] as number) } : null;
    })
    .filter((e): e is { iso3: string; x: number; y: number } => e != null)
    .sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 17) ends[k].y = ends[k - 1].y + 17;

  const onMove = (e: React.PointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const vx = ((e.clientX - b.left) / b.width) * W;
    const yr = Math.round(lin(P.l, W - P.r, span[0], span[span.length - 1])(vx));
    if (yr >= span[0] && yr <= span[span.length - 1]) {
      p.setHoverYear(yr);
      setTip({ x: e.clientX - b.left, y: e.clientY - b.top, w: b.width });
    }
  };

  const hy = p.hoverYear != null && p.hoverYear >= span[0] && p.hoverYear <= span[span.length - 1] ? p.hoverYear : null;
  const k = hy != null ? span.indexOf(hy) : -1;
  const eventYears = new Map<number, EconEvent[]>();
  p.events.forEach((e) => eventYears.set(e.anio, [...(eventYears.get(e.anio) ?? []), e]));

  return (
    <div className="relative mt-3">
      <ScaleAware base={W}>
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full touch-pan-y"
          role="img"
          aria-label={`${lang === "en" ? indicator.en : indicator.es}, ${span[0]}–${span[span.length - 1]}: ${sel.map(p.name).join(", ")}`}
          onPointerMove={onMove}
          onPointerLeave={() => { p.setHoverYear(null); setTip(null); }}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} />
              <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
                {fmt(lang, v, indicator.id)}
              </text>
            </g>
          ))}
          {niceTicks(span[0], span[span.length - 1], 7).filter((t) => Number.isInteger(t)).map((t) => (
            <text key={t} x={x(t)} y={H - 9} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
              {t}
            </text>
          ))}
          {/* eventos: una línea por año con evento, numerada como en la cronología */}
          {[...eventYears.entries()].map(([yr, es]) => {
            const focused = p.focusEvent && es.includes(p.focusEvent);
            return (
              <g key={yr}>
                <line x1={x(yr)} x2={x(yr)} y1={P.t - 4} y2={H - P.b} stroke={focused ? "var(--color-cold)" : "var(--color-control)"} strokeWidth={focused ? 2 : 1} strokeDasharray="3 4" />
                {es.slice(0, 3).map((e, j) => (
                  <g
                    key={j}
                    onPointerEnter={(ev) => {
                      const b = svg.current?.getBoundingClientRect();
                      if (b) setTip({ x: ev.clientX - b.left, y: ev.clientY - b.top, w: b.width, e });
                    }}
                    style={{ cursor: "help" }}
                  >
                    <circle cx={x(yr)} cy={P.t - 12 - j * 16} r={8} fill={focused ? "var(--color-cold)" : "var(--color-paper)"} stroke="var(--color-cold)" strokeWidth="1.5" />
                    <text x={x(yr)} y={P.t - 8 - j * 16} textAnchor="middle" fill={focused ? "var(--color-paper)" : "var(--color-cold)"} style={TXT(10.5)} fontWeight={700}>
                      {p.eventNo.get(e)}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
          {sel.map((iso3) => {
            const col = p.colorOf(iso3);
            return <path key={iso3} d={path(series(iso3))} fill="none" stroke={col.c} strokeWidth="2" strokeDasharray={col.d || undefined} strokeLinejoin="round" />;
          })}
          {ends.map((e) => (
            <text key={e.iso3} x={W - P.r + 8} y={e.y + 4} fill={p.colorOf(e.iso3).c} style={TXT()} fontWeight={600}>
              {p.name(e.iso3)}
            </text>
          ))}
          {hy != null && (
            <g pointerEvents="none">
              <line x1={x(hy)} x2={x(hy)} y1={P.t} y2={H - P.b} stroke="var(--color-ink)" strokeWidth="1" />
              {sel.map((iso3) => {
                const v = series(iso3)[k];
                return v != null ? <circle key={iso3} cx={x(hy)} cy={y(v)} r={4} fill={p.colorOf(iso3).c} stroke="var(--color-paper)" strokeWidth="1.5" /> : null;
              })}
            </g>
          )}
        </svg>
      </ScaleAware>
      {tip && (
        <div className="fl-tip" style={tip.x > tip.w * 0.55 ? { right: tip.w - tip.x + 14, top: tip.y + 14 } : { left: tip.x + 14, top: tip.y + 14 }} role="status">
          {tip.e ? (
            <>
              <b className="block text-ink">
                {p.eventNo.get(tip.e)}. {tip.e.anio} · {lang === "en" ? tip.e.titulo_en : tip.e.titulo_es}
              </b>
              <span className="block max-w-[34ch] text-body">{lang === "en" ? tip.e.texto_en : tip.e.texto_es}</span>
            </>
          ) : hy != null ? (
            <>
              <b className="block text-ink">{hy}</b>
              {[...sel]
                .map((iso3) => ({ iso3, v: series(iso3)[k] }))
                .sort((a, b) => (b.v ?? -Infinity) - (a.v ?? -Infinity))
                .map(({ iso3, v }) => (
                  <span key={iso3} className="flex items-center gap-2 text-body">
                    <span className="inline-block h-[3px] w-3" style={{ background: p.colorOf(iso3).c }} aria-hidden="true" />
                    {p.name(iso3)}
                    <b className="ml-auto pl-3 font-semibold text-ink">{fmt(lang, v, indicator.id)}</b>
                  </span>
                ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ================================================================ ranking

function Ranking({ copy, lang, meta, indicator, sel, series, toggle, colorOf, name }: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[];
  series: (iso3: string) => (number | null)[]; toggle: (iso3: string) => void;
  colorOf: (iso3: string) => { c: string; d: string }; name: (iso3: string) => string;
}) {
  const rows = meta.paises
    .map((c) => ({ iso3: c.iso3, m: stats(series(c.iso3)).mean }))
    .sort((a, b) => (Number.isFinite(b.m) ? b.m : -Infinity) - (Number.isFinite(a.m) ? a.m : -Infinity));
  const fin = rows.map((r) => r.m).filter(Number.isFinite);
  const tf = indicator.log ? symlog : (v: number) => v;
  const lo = Math.min(0, ...fin.map(tf)), hi = Math.max(0, ...fin.map(tf));
  const pct = (v: number) => ((tf(v) - lo) / (hi - lo || 1)) * 100;
  const zero = pct(0);
  return (
    <div>
      <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.ranking.title}</h3>
      <p className="mt-1 text-[14px] text-muted">{copy.ranking.hint}</p>
      <ol className="mt-3">
        {rows.map((r) => {
          const on = sel.includes(r.iso3);
          const ok = Number.isFinite(r.m);
          const left = ok ? Math.min(zero, pct(r.m)) : zero;
          const width = ok ? Math.abs(pct(r.m) - zero) : 0;
          return (
            <li key={r.iso3}>
              <button type="button" aria-pressed={on} onClick={() => toggle(r.iso3)} className="fl-rank group">
                <span className={`w-[118px] shrink-0 truncate text-left text-[14px] ${on ? "font-semibold text-ink" : "text-body"}`}>{name(r.iso3)}</span>
                <span className="relative h-3.5 grow">
                  <span className="absolute top-0 bottom-0 w-px bg-control" style={{ left: `${zero}%` }} aria-hidden="true" />
                  <span
                    className="fl-hbar absolute top-0 bottom-0"
                    style={{ left: `${left}%`, width: `${width}%`, background: on ? colorOf(r.iso3).c : "var(--color-coldline)" }}
                    aria-hidden="true"
                  />
                </span>
                <span className="w-[66px] shrink-0 text-right text-[14px] text-ink tabular-nums">{fmt(lang, r.m, indicator.id)}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ================================================================ dispersión

function Scatter({ copy, lang, meta, indicator, sel, series, toggle, colorOf }: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[];
  series: (iso3: string) => (number | null)[]; toggle: (iso3: string) => void; colorOf: (iso3: string) => { c: string; d: string };
}) {
  const W = 420, H = 380, P = { l: 52, r: 16, t: 16, b: 44 };
  const pts = meta.paises
    .map((c) => ({ iso3: c.iso3, ...stats(series(c.iso3)) }))
    .filter((d) => Number.isFinite(d.mean) && Number.isFinite(d.sd));
  const tfy = indicator.log ? symlog : (v: number) => v;
  const tfx = indicator.log ? symlog : (v: number) => v;
  const xs = pts.map((d) => tfx(d.sd)), ys = pts.map((d) => tfy(d.mean));
  // Se rotulan las elegidas y los extremos (dos arriba, dos abajo, las dos más volátiles):
  // rotular las veinte amontonaba el centro hasta no leerse ninguna.
  const byMean = [...pts].sort((a, b) => a.mean - b.mean).map((d) => d.iso3);
  const bySd = [...pts].sort((a, b) => b.sd - a.sd).map((d) => d.iso3);
  const labelled = new Set([...sel, ...byMean.slice(0, 2), ...byMean.slice(-2), ...bySd.slice(0, 2)]);
  const x0 = 0, x1 = (Math.max(...xs, 1)) * 1.08;
  const y0 = Math.min(...ys, 0), y1 = Math.max(...ys, 0) + (Math.max(...ys) - Math.min(...ys, 0)) * 0.08;
  const x = (v: number) => lin(x0, x1, P.l, W - P.r)(tfx(v));
  const y = (v: number) => lin(y0, y1, H - P.b, P.t)(tfy(v));
  const yt = indicator.log ? logTicks(symexp(y0), symexp(y1)) : niceTicks(y0, y1, 5);
  const xt = indicator.log ? logTicks(0, symexp(x1)).filter((v) => v >= 0) : niceTicks(0, x1, 4);
  return (
    <div>
      <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.scatter.title}</h3>
      <p className="mt-1 text-[14px] text-muted">{copy.scatter.hint}</p>
      <ScaleAware base={W} className="mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.scatter.y} × ${copy.scatter.x}`}>
          {yt.map((v) => (
            <g key={`y${v}`}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} />
              <text x={P.l - 7} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{fmt(lang, v, indicator.id)}</text>
            </g>
          ))}
          {xt.map((v) => (
            <text key={`x${v}`} x={x(v)} y={H - P.b + 17} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{fmt(lang, v, indicator.id)}</text>
          ))}
          <text x={(P.l + W - P.r) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{copy.scatter.x}</text>
          {pts.map((d) => {
            const on = sel.includes(d.iso3);
            return (
              <g key={d.iso3} onClick={() => toggle(d.iso3)} style={{ cursor: "pointer" }}>
                <circle cx={x(d.sd)} cy={y(d.mean)} r={on ? 6.5 : 4.5} fill={on ? colorOf(d.iso3).c : "var(--color-coldline)"} stroke={on ? "var(--color-paper)" : "none"} strokeWidth="1.5" />
                {labelled.has(d.iso3) && (
                  <text x={x(d.sd) + 8} y={y(d.mean) + 4} fill={on ? "var(--color-ink)" : "var(--color-muted)"} style={TXT(on ? 12 : 11)} fontWeight={on ? 600 : 400}>
                    {d.iso3}
                  </text>
                )}
                <title>{d.iso3}</title>
                <circle cx={x(d.sd)} cy={y(d.mean)} r={12} fill="transparent" />
              </g>
            );
          })}
        </svg>
      </ScaleAware>
    </div>
  );
}

// ================================================================ mapa de calor

const DIVERGENT = ["--atlas-neg-3", "--atlas-neg-2", "--atlas-neg-1", "--atlas-mid", "--atlas-pos-1", "--atlas-pos-2", "--atlas-pos-3"];
const SEQUENTIAL = ["--atlas-seq-0", "--atlas-seq-1", "--atlas-seq-2", "--atlas-seq-3", "--atlas-seq-4"];

function Heatmap(p: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[]; span: number[];
  series: (iso3: string) => (number | null)[]; toggle: (iso3: string) => void; name: (iso3: string) => string;
  events: EconEvent[]; hoverYear: number | null; setHoverYear: (y: number | null) => void;
}) {
  const { indicator, span, lang } = p;
  const rows = [...p.meta.paises].sort((a, b) => p.name(a.iso3).localeCompare(p.name(b.iso3), lang));
  const tf = indicator.log ? symlog : (v: number) => v;
  const all = rows.flatMap((c) => p.series(c.iso3)).filter((v): v is number => v != null).map(tf);
  // Centradas en cero las métricas que cambian de signo; secuenciales las que no.
  const diverging = ["pib_crecimiento", "cuenta_corriente_pib", "inflacion_ipc", "ied_pib"].includes(indicator.id);
  const q = (arr: number[], t: number) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(t * (s.length - 1))] ?? 0; };
  const lim = diverging ? Math.max(Math.abs(q(all, 0.03)), Math.abs(q(all, 0.97))) || 1 : 0;
  const lo = diverging ? -lim : q(all, 0.03), hi = diverging ? lim : q(all, 0.97);
  const color = (v: number | null) => {
    if (v == null) return "var(--atlas-void)";
    const u = Math.min(1, Math.max(0, (tf(v) - lo) / (hi - lo || 1)));
    const scale = diverging ? DIVERGENT : SEQUENTIAL;
    return `var(${scale[Math.min(scale.length - 1, Math.floor(u * scale.length))]})`;
  };
  const evKey = new Set(p.events.map((e) => `${e.iso3}-${e.anio}`));
  const regional = new Set(p.events.filter((e) => e.iso3 === "LATAM").map((e) => e.anio));
  const [tip, setTip] = useState<string | null>(null);

  const cell = Math.max(9, Math.min(18, Math.floor(620 / span.length)));
  return (
    <div className="mt-12">
      <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{p.copy.heat.title}</h3>
      <p className="mt-1 text-[14px] text-muted">{p.copy.heat.hint}</p>
      <div tabIndex={0} role="region" aria-label={p.copy.heat.title} className="mt-3 overflow-x-auto pb-2">
        <table className="fl-heat border-collapse" onPointerLeave={() => { p.setHoverYear(null); setTip(null); }}>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-paper" />
              {span.map((yr) => (
                <th key={yr} scope="col" className="p-0 text-center align-bottom font-normal" style={{ width: cell }}>
                  {(yr % 5 === 0 || span.length <= 16) && <span className="block text-[12px] text-muted [writing-mode:vertical-rl] rotate-180">{yr}</span>}
                  {regional.has(yr) && <span className="mx-auto mt-0.5 block size-1.5 rounded-full bg-cold" aria-hidden="true" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const s = p.series(c.iso3);
              const on = p.sel.includes(c.iso3);
              return (
                <tr key={c.iso3}>
                  <th scope="row" className="sticky left-0 z-10 bg-paper pr-2 text-left font-normal whitespace-nowrap">
                    <button type="button" aria-pressed={on} onClick={() => p.toggle(c.iso3)} className={`text-[13px] hover:text-cold ${on ? "font-semibold text-ink" : "text-body"}`}>
                      {p.name(c.iso3)}
                    </button>
                  </th>
                  {s.map((v, k) => {
                    const yr = span[k];
                    const hot = p.hoverYear === yr;
                    return (
                      <td
                        key={yr}
                        className="relative p-0"
                        style={{ width: cell, height: 18, background: color(v), outline: hot ? "1px solid var(--color-ink)" : undefined }}
                        onPointerEnter={() => { p.setHoverYear(yr); setTip(`${p.name(c.iso3)} · ${yr}: ${v == null ? p.copy.heat.noData : fmt(lang, v, indicator.id, true)}`); }}
                        title={`${p.name(c.iso3)} · ${yr}: ${v == null ? p.copy.heat.noData : fmt(lang, v, indicator.id, true)}`}
                      >
                        {evKey.has(`${c.iso3}-${yr}`) && <span className="absolute top-1/2 left-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper bg-ink" aria-hidden="true" />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 min-h-[1.6em] text-[14px] text-body" aria-live="polite">{tip ?? ""}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
        <span>{fmt(lang, indicator.log ? symexp(lo) : lo, indicator.id, true)}</span>
        {(diverging ? DIVERGENT : SEQUENTIAL).map((t) => (
          <span key={t} className="inline-block h-3 w-6" style={{ background: `var(${t})` }} aria-hidden="true" />
        ))}
        <span>{fmt(lang, indicator.log ? symexp(hi) : hi, indicator.id, true)}</span>
        <span className="ml-3 inline-block h-3 w-6" style={{ background: "var(--atlas-void)" }} aria-hidden="true" />
        <span>{p.copy.heat.noData}</span>
      </div>
    </div>
  );
}

// ================================================================ cronología

function Timeline({ copy, lang, events, visible, eventNo, focus, name, focused }: {
  copy: Copy; lang: string; events: Events; visible: EconEvent[]; eventNo: Map<EconEvent, number>;
  focus: (e: EconEvent) => void; name: (iso3: string) => string; focused: EconEvent | null;
}) {
  const catName = (id: EventCat) => {
    const c = events.categorias.find((x) => x.id === id);
    return c ? (lang === "en" ? c.en : c.es) : id;
  };
  const months = copy.season.months;
  return (
    <div className="mt-12">
      <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.timeline.title}</h3>
      {visible.length === 0 ? (
        <p className="mt-3 text-[14px] text-muted">{copy.timeline.empty}</p>
      ) : (
        <ol className="mt-3 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {visible.map((e) => (
            <li key={`${e.iso3}-${e.anio}-${e.cat}`} className={`border-t py-3 ${focused === e ? "border-cold" : "border-rulesoft"}`}>
              <div className="grid grid-cols-[34px_1fr] gap-x-3">
                <span className="font-figure text-[20px] leading-none text-cold">{eventNo.get(e)}</span>
                <div>
                  <p className="text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
                    {e.mes ? `${months[e.mes - 1]} ` : ""}{e.anio} · {e.iso3 === "LATAM" ? copy.timeline.regional : name(e.iso3)} · {catName(e.cat)}
                  </p>
                  <p className="mt-1 text-[14.5px] font-semibold text-ink">{lang === "en" ? e.titulo_en : e.titulo_es}</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-body">{lang === "en" ? e.texto_en : e.texto_es}</p>
                  <button type="button" onClick={() => focus(e)} className="mt-1.5 text-[14px] text-cold underline underline-offset-4 hover:decoration-2">
                    {copy.timeline.focus} →
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-[14px] text-muted">{copy.timeline.note}</p>
    </div>
  );
}

// ================================================================ estacionalidad

function Seasonality({ copy, lang, ise }: { copy: Copy; lang: string; ise: Ise }) {
  const [sid, setSid] = useState("ise");
  const s = ise.series.find((x) => x.id === sid) ?? ise.series[0];
  const [y0, m0] = ise.inicio.split("-").map(Number);
  const byYear = useMemo(() => {
    const out = new Map<number, (number | null)[]>();
    s.v.forEach((v, i) => {
      const k = m0 - 1 + i;
      const yr = y0 + Math.floor(k / 12);
      const arr = out.get(yr) ?? Array(12).fill(null);
      arr[k % 12] = v;
      out.set(yr, arr);
    });
    return out;
  }, [s, y0, m0]);
  const full = [...byYear.entries()].filter(([, a]) => a.every((v) => v != null)).map(([yr]) => yr);
  const allYears = [...byYear.keys()];
  const [picked, setPicked] = useState<number[]>(() => [2019, 2020, 2021, allYears[allYears.length - 1]].filter((v, i, a) => a.indexOf(v) === i));
  const profile = useMemo(() => seasonalProfile(s.v, m0), [s, m0]);

  const W = 520, H = 280, P = { l: 48, r: 60, t: 14, b: 28 };
  const vals = picked.flatMap((yr) => byYear.get(yr) ?? []).filter((v): v is number => v != null);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.08 || 1;
  const x = lin(0, 11, P.l, W - P.r);
  const y = lin(lo - pad, hi + pad, H - P.b, P.t);
  const latest = Math.max(...picked);
  const shade = (yr: number) => {
    const order = [...picked].sort((a, b) => a - b);
    const t = order.length > 1 ? order.indexOf(yr) / (order.length - 1) : 1;
    return 0.3 + 0.7 * t;
  };

  const W2 = 520, H2 = 220, P2 = { l: 48, r: 12, t: 12, b: 28 };
  const pmax = Math.max(...profile.filter(Number.isFinite).map(Math.abs), 1);
  const px = lin(0, 12, P2.l, W2 - P2.r);
  const py = lin(-pmax * 1.15, pmax * 1.15, H2 - P2.b, P2.t);
  const bw = (W2 - P2.l - P2.r) / 12 - 6;

  return (
    <div className="mt-12 border-t-2 border-ink pt-5">
      <h3 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{copy.season.title}</h3>
      <p className="mt-1 max-w-[80ch] text-[14px] leading-[1.6] text-body">{copy.season.why}</p>
      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
        <label className="atlas-field">
          <span>{copy.season.series}</span>
          <select value={sid} onChange={(e) => setSid(e.target.value)}>
            {ise.series.map((x) => (
              <option key={x.id} value={x.id}>
                {lang === "en" ? x.en : x.es}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="atlas-field">
          <legend>{copy.season.years}</legend>
          <div className="flex max-w-[640px] flex-wrap gap-1">
            {allYears.map((yr) => {
              const on = picked.includes(yr);
              return (
                <button
                  key={yr}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? (p.length > 1 ? p.filter((v) => v !== yr) : p) : [...p, yr].slice(-6)))}
                  className="fl-year"
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[14px] text-muted">{copy.season.level}</p>
          <ScaleAware base={W} className="mt-2">
            <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.season.title}: ${picked.join(", ")}`}>
              {niceTicks(lo - pad, hi + pad, 4).map((v) => (
                <g key={v}>
                  <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="var(--color-rule)" />
                  <text x={P.l - 7} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{v}</text>
                </g>
              ))}
              {copy.season.months.map((m, i) => (
                <text key={m} x={x(i)} y={H - 8} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>{m}</text>
              ))}
              {[...picked].sort((a, b) => a - b).map((yr) => {
                const arr = byYear.get(yr) ?? [];
                let d = "", pen = false, lastI = -1;
                arr.forEach((v, i) => { if (v == null) { pen = false; return; } d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`; pen = true; lastI = i; });
                const isLatest = yr === latest;
                return (
                  <g key={yr}>
                    <path d={d} fill="none" stroke={isLatest ? "var(--color-ink)" : "var(--color-cold)"} strokeOpacity={isLatest ? 1 : shade(yr)} strokeWidth={isLatest ? 2.2 : 1.8} />
                    {lastI >= 0 && (
                      <text x={x(lastI) + 6} y={y(arr[lastI] as number) + 4} fill={isLatest ? "var(--color-ink)" : "var(--color-cold)"} style={TXT(11)} fontWeight={isLatest ? 700 : 400}>{yr}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </ScaleAware>
        </div>
        <div>
          <p className="text-[14px] text-muted">{copy.season.profile}</p>
          <ScaleAware base={W2} className="mt-2">
            <svg viewBox={`0 0 ${W2} ${H2}`} className="block w-full" role="img" aria-label={copy.season.profile}>
              <line x1={P2.l} x2={W2 - P2.r} y1={py(0)} y2={py(0)} stroke="var(--color-control)" />
              {niceTicks(-pmax, pmax, 4).map((v) => (
                <text key={v} x={P2.l - 7} y={py(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{v > 0 ? `+${v}` : v}</text>
              ))}
              {profile.map((v, i) =>
                Number.isFinite(v) ? (
                  <g key={i}>
                    <rect x={px(i) + 3} y={Math.min(py(v), py(0))} width={bw} height={Math.abs(py(v) - py(0))} fill={v >= 0 ? "var(--color-cold)" : "var(--color-coldline)"} />
                    <text x={px(i) + 3 + bw / 2} y={H2 - 8} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>{copy.season.months[i]}</text>
                  </g>
                ) : null,
              )}
            </svg>
          </ScaleAware>
          <p className="mt-2 text-[14px] text-muted">
            {copy.season.profileNote.replace(/.$/, "")} ({full[0]}–{full[full.length - 1]}).
          </p>
        </div>
      </div>
    </div>
  );
}
