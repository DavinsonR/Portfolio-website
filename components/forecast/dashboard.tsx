"use client";

/* El panorama: un tablero descriptivo de América Latina antes de los modelos.

   Se lee como un tablero de BI: una barra de filtros fija arriba y una grilla de
   visuales que se ven a la vez. Un solo estado —economías, métrica, período y eventos—
   gobierna todo: indicadores, serie, tabla de economías, mapa de calor, dispersión,
   estacionalidad y cronología. Casi todo es a su vez un filtro (una fila o un punto
   añaden o quitan la economía; un evento enfoca su período y abre su resumen).

   Reglas del sitio que se mantienen: cifras en tinta o azul, sin ámbar; recuadros planos
   con regla, sin sombras; cada economía se distingue por color Y trazo; los textos de
   los SVG miden 12 px en pantalla (ScaleAware). */

import { useEffect, useMemo, useRef, useState } from "react";
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
import { MultiSelect, SortTable, Tile, type Column } from "./ui";
import { useLoadAll } from "./useLoad";

type Copy = LabCopy["dash"];
type Series = (iso3: string, id?: IndicatorId) => (number | null)[];
type Color = { c: string; d: string };

const MAX = 6;
const PRESETS: Record<keyof Copy["presets"], string[]> = {
  big: ["ARG", "BRA", "CHL", "COL", "MEX", "PER"],
  andes: ["BOL", "COL", "ECU", "PER", "VEN"],
  south: ["ARG", "BRA", "CHL", "PRY", "URY"],
  central: ["CRI", "GTM", "HND", "NIC", "PAN", "SLV"],
  caribbean: ["CUB", "DOM", "HTI", "MEX"],
};

// Seis voces que ya existen en el sistema; la quinta y la sexta se separan por trazo.
const PALETTE: Color[] = [
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
  if (/^−0([.,]0+)?$/.test(s)) return fmt(lang, 0, ind, withUnit); // sin «−0,0»
  if (!withUnit) return s;
  return ind === "pib_per_capita" ? `US$ ${s}` : `${s} %`;
}

function niceTicks(lo: number, hi: number, n: number): number[] {
  const raw = (hi - lo) / n || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000 + 0); // +0: sin −0
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

/** Exportado para la prueba de humo (tests/forecast-dashboard.test.ts): se renderiza con los
 *  JSON reales y cada métrica, sin navegador. */
export function Board({ copy, lang, meta, panel, events, ise, initial }: {
  copy: Copy; lang: string; meta: Meta; panel: Panel; events: Events; ise: Ise;
  initial?: { sel?: string[]; ind?: IndicatorId; from?: number; to?: number; pop?: EconEvent };
}) {
  const years = panel.anios;
  const lastYear = years[years.length - 1];
  const [sel, setSelected] = useState<string[]>(initial?.sel ?? PRESETS.big);
  const [ind, setInd] = useState<IndicatorId>(initial?.ind ?? "pib_crecimiento");
  const [from, setFrom] = useState(initial?.from ?? 1980);
  const [to, setTo] = useState(initial?.to ?? lastYear);
  const [cats, setCats] = useState<EventCat[]>(events.categorias.map((c) => c.id));
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [pop, setPop] = useState<EconEvent | null>(initial?.pop ?? null);
  const chartRef = useRef<HTMLDivElement>(null);

  const indicator = panel.indicadores.find((i) => i.id === ind) as Indicator;
  const name = (iso3: string) => {
    const c = meta.paises.find((p) => p.iso3 === iso3);
    return c ? (lang === "en" ? c.en : c.es) : iso3;
  };
  const i0 = years.indexOf(from);
  const i1 = years.indexOf(to);
  const span = years.slice(i0, i1 + 1);
  const series: Series = (iso3, id = ind) => (panel.datos[iso3]?.[id] ?? []).slice(i0, i1 + 1);
  const colorOf = (iso3: string) => PALETTE[sel.indexOf(iso3)] ?? PALETTE[0];

  const choose = (next: string[]) => {
    setSelected(next.slice(0, MAX));
    // La última economía elegida viaja al juego y al origen móvil, si tiene serie anual.
    const last = next[next.length - 1];
    if (last && meta.paises.find((c) => c.iso3 === last)?.anual) setSel({ iso3: last });
  };
  const toggle = (iso3: string) =>
    choose(sel.includes(iso3) ? sel.filter((x) => x !== iso3) : sel.length >= MAX ? [...sel.slice(1), iso3] : [...sel, iso3]);

  // Eventos de las economías elegidas y de la región, del tipo elegido; se dibujan los del
  // período, numerados en ese orden.
  const eligible = events.eventos.filter((e) => cats.includes(e.cat) && (e.iso3 === "LATAM" || sel.includes(e.iso3)));
  const visible = eligible.filter((e) => e.anio >= from && e.anio <= to);
  const eventNo = new Map(visible.map((e, k) => [e, k + 1]));

  const thin = sel
    .map((iso3) => ({ iso3, n: series(iso3).filter((v) => v != null).length }))
    .filter((c) => c.n < span.length / 2);

  /** Enfoca el período del evento (seis años a cada lado) y abre su resumen. */
  const focus = (e: EconEvent) => {
    setFrom(Math.max(years[0], e.anio - 6));
    setTo(Math.min(lastYear, e.anio + 6));
    if (e.iso3 !== "LATAM" && !sel.includes(e.iso3)) toggle(e.iso3);
    setPop(e);
    chartRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const catName = (id: EventCat) => {
    const c = events.categorias.find((x) => x.id === id);
    return c ? (lang === "en" ? c.en : c.es) : id;
  };
  const months = copy.season.months;
  const when = (e: EconEvent) => `${e.mes ? `${months[e.mes - 1]} ` : ""}${e.anio}`;
  const where = (e: EconEvent) => (e.iso3 === "LATAM" ? copy.timeline.regional : name(e.iso3));
  const presetKeys = Object.keys(PRESETS) as (keyof typeof PRESETS)[];

  return (
    <div className="fl-board">
      {/* ---------------- barra de filtros, fija arriba en escritorio ---------------- */}
      <div className="fl-bar-filters">
        <MultiSelect
          label={copy.economies}
          summary={sel.length ? fill(copy.economiesBtn, { n: sel.length, max: MAX }) : copy.none}
          options={[...meta.paises]
            .sort((a, b) => name(a.iso3).localeCompare(name(b.iso3), lang))
            .map((c) => ({
              id: c.iso3,
              label: name(c.iso3),
              swatch: <span aria-hidden="true" className="inline-block h-[3px] w-4 shrink-0" style={{ background: sel.includes(c.iso3) ? colorOf(c.iso3).c : "var(--color-rule)" }} />,
            }))}
          selected={sel}
          onChange={choose}
          max={MAX}
          search={copy.search}
          actions={
            <button type="button" className="fl-link" onClick={() => choose([])}>
              {copy.clear}
            </button>
          }
        />
        <label className="fl-field">
          <span>{copy.presetsLabel}</span>
          <select
            value={presetKeys.find((k) => PRESETS[k].join() === sel.join()) ?? ""}
            onChange={(e) => e.target.value && choose(PRESETS[e.target.value as keyof typeof PRESETS])}
          >
            <option value="">{copy.custom}</option>
            {presetKeys.map((k) => (
              <option key={k} value={k}>
                {copy.presets[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="fl-field">
          <span>{copy.indicator}</span>
          <select value={ind} onChange={(e) => setInd(e.target.value as IndicatorId)}>
            {panel.indicadores.map((i) => (
              <option key={i.id} value={i.id}>
                {lang === "en" ? i.en : i.es}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="fl-field">
          <legend>{copy.period}</legend>
          <div className="flex items-center gap-1.5">
            <select aria-label={copy.from} value={from} onChange={(e) => setFrom(Math.min(Number(e.target.value), to - 5))}>
              {years.filter((y) => y <= to - 5).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span aria-hidden="true" className="text-muted">–</span>
            <select aria-label={copy.to} value={to} onChange={(e) => setTo(Math.max(Number(e.target.value), from + 5))}>
              {years.filter((y) => y >= from + 5).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </fieldset>
        <MultiSelect
          label={copy.eventTypes}
          summary={fill(copy.eventTypesBtn, { n: cats.length, total: events.categorias.length })}
          options={events.categorias.map((c) => ({ id: c.id, label: lang === "en" ? c.en : c.es }))}
          selected={cats}
          onChange={(ids) => setCats(ids as EventCat[])}
          actions={
            <>
              <button type="button" className="fl-link" onClick={() => setCats(events.categorias.map((c) => c.id))}>
                {copy.all}
              </button>
              <button type="button" className="fl-link" onClick={() => setCats([])}>
                {copy.clear}
              </button>
            </>
          }
        />
        <label className="fl-field fl-field-wide">
          <span>{copy.goTo}</span>
          <select
            value={pop ? String(events.eventos.indexOf(pop)) : ""}
            onChange={(e) => {
              const ev = events.eventos[Number(e.target.value)];
              if (ev) focus(ev);
            }}
          >
            <option value="">{copy.goToPlaceholder}</option>
            {eligible.map((e) => {
              const i = events.eventos.indexOf(e);
              return (
                <option key={i} value={i}>
                  {e.anio} · {where(e)} · {lang === "en" ? e.titulo_en : e.titulo_es}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {thin.length > 0 && (
        <p className="mt-2 text-[14px] text-muted">
          {fill(copy.missing, { names: thin.map((c) => `${name(c.iso3)} (${fill(copy.yearsOf, { n: c.n, total: span.length })})`).join(", ") })}
        </p>
      )}

      <Kpis copy={copy} lang={lang} ind={ind} sel={sel} series={series} span={span} name={name} />

      {/* ---------------- la grilla de visuales ---------------- */}
      <div className="fl-grid">
        <Tile
          className="lg:col-span-8"
          title={<>{copy.chart.title} · {lang === "en" ? indicator.en : indicator.es} <span className="fl-unit">({lang === "en" ? indicator.unidad_en : indicator.unidad_es})</span></>}
          hint={copy.chart.hint}
        >
          <div ref={chartRef}>
            <LineChart
              copy={copy} lang={lang} indicator={indicator} sel={sel} span={span} series={series} colorOf={colorOf} name={name}
              events={visible} eventNo={eventNo} hoverYear={hoverYear} setHoverYear={setHoverYear}
              pop={pop} setPop={setPop} focus={focus} when={when} where={where} catName={catName}
            />
          </div>
        </Tile>

        <Tile className="lg:col-span-4" title={copy.timeline.title} hint={copy.timeline.note}>
          {visible.length === 0 ? (
            <p className="text-[14px] text-muted">{copy.timeline.empty}</p>
          ) : (
            <ol className="fl-timeline">
              {visible.map((e) => (
                <li key={`${e.iso3}-${e.anio}-${e.cat}`}>
                  <button type="button" onClick={() => focus(e)} className="fl-tl-item" aria-pressed={pop === e}>
                    <span className="fl-tl-no">{eventNo.get(e)}</span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold tracking-[0.05em] text-muted uppercase">
                        {when(e)} · {where(e)}
                      </span>
                      <span className="block text-[14px] leading-[1.4] font-semibold text-ink">{lang === "en" ? e.titulo_en : e.titulo_es}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Tile>


        <Tile className="lg:col-span-8" title={copy.heat.title} hint={copy.heat.hint}>
          <Heatmap copy={copy} lang={lang} meta={meta} indicator={indicator} sel={sel} span={span} series={series} toggle={toggle} name={name} colorOf={colorOf} events={visible} hoverYear={hoverYear} setHoverYear={setHoverYear} />
        </Tile>

        <Tile className="lg:col-span-4" title={copy.scatter.title} hint={copy.scatter.hint}>
          <Scatter copy={copy} lang={lang} meta={meta} indicator={indicator} sel={sel} series={series} toggle={toggle} colorOf={colorOf} />
        </Tile>

        <Tile className="lg:col-span-5" title={copy.table.title} hint={copy.table.hint}>
          <EconomyTable copy={copy} lang={lang} meta={meta} indicator={indicator} sel={sel} series={series} span={span} toggle={toggle} colorOf={colorOf} name={name} />
        </Tile>

        <Seasonality copy={copy} lang={lang} ise={ise} />

      </div>

      <p className="mt-4 text-[14px] text-muted">{copy.source}</p>
    </div>
  );
}

// ================================================================ indicadores

function Kpis({ copy, lang, ind, sel, series, span, name }: {
  copy: Copy; lang: string; ind: IndicatorId; sel: string[]; series: Series; span: number[]; name: (iso3: string) => string;
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
    <dl className="fl-kpis" aria-live="polite">
      {tiles.map((t) => (
        <div key={t.label} className="fl-kpi">
          <dt className="text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">{t.label}</dt>
          <dd className="mt-1.5 font-figure text-[clamp(22px,2.2vw,28px)] leading-none text-ink">{t.value}</dd>
          <dd className="mt-1.5 text-[14px] leading-[1.35] text-body">{t.note}</dd>
        </div>
      ))}
    </dl>
  );
}

// ================================================================ la serie

function LineChart(p: {
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; span: number[]; series: Series;
  colorOf: (iso3: string) => Color; name: (iso3: string) => string;
  events: EconEvent[]; eventNo: Map<EconEvent, number>; hoverYear: number | null; setHoverYear: (y: number | null) => void;
  pop: EconEvent | null; setPop: (e: EconEvent | null) => void; focus: (e: EconEvent) => void;
  when: (e: EconEvent) => string; where: (e: EconEvent) => string; catName: (c: EventCat) => string;
}) {
  const { indicator, sel, span, series, lang, copy, pop, setPop } = p;
  const W = 760, H = 360, P = { l: 52, r: 110, t: 58, b: 28 };
  const tf = indicator.log ? symlog : (v: number) => v;
  const vals = sel.flatMap((iso3) => series(iso3)).filter((v): v is number => v != null);
  let lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  if (indicator.id !== "pib_per_capita") lo = Math.min(lo, 0);
  const pad = (tf(hi) - tf(lo)) * 0.06 || 1;
  const d0 = tf(lo) - pad, d1 = tf(hi) + pad;
  const x = lin(span[0], span[span.length - 1], P.l, W - P.r);
  const y = (v: number) => lin(d0, d1, H - P.b, P.t)(tf(v));
  const ticks = (indicator.log ? logTicks(symexp(d0), symexp(d1)) : niceTicks(d0, d1, 5)).filter((v) => {
    const u = tf(v);
    return u >= d0 && u <= d1;
  });
  const svg = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; w: number } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // El resumen del evento se cierra con Escape o tocando fuera; al abrirse, el foco va a él.
  useEffect(() => {
    if (!pop) return;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPop(null);
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!t.closest?.(".fl-pop, [data-event], .fl-tl-item, .fl-bar-filters")) setPop(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDoc);
    };
  }, [pop, setPop]);

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
      return k >= 0 ? { iso3, y: y(s[k] as number) } : null;
    })
    .filter((e): e is { iso3: string; y: number } => e != null)
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
  const byYear = new Map<number, EconEvent[]>();
  p.events.forEach((e) => byYear.set(e.anio, [...(byYear.get(e.anio) ?? []), e]));

  // El resumen se ancla sobre la línea del evento, dentro del recuadro.
  const popIn = pop && pop.anio >= span[0] && pop.anio <= span[span.length - 1] ? pop : null;
  const popLeftPct = popIn ? (x(popIn.anio) / W) * 100 : 0;

  return (
    <div className="relative">
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
            <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
              {t}
            </text>
          ))}
          {/* eventos: línea punteada y marcadores numerados; tocarlos abre el resumen */}
          {[...byYear.entries()].map(([yr, es]) => {
            const open = pop != null && es.includes(pop);
            return (
              <g key={yr} data-event onClick={() => setPop(es[0])} style={{ cursor: "pointer" }}>
                <line x1={x(yr)} x2={x(yr)} y1={P.t - 4} y2={H - P.b} stroke="transparent" strokeWidth="14" />
                <line x1={x(yr)} x2={x(yr)} y1={P.t - 4} y2={H - P.b} stroke={open ? "var(--color-cold)" : "var(--color-control)"} strokeWidth={open ? 2 : 1} strokeDasharray="3 4" />
                {es.slice(0, 3).map((e, j) => {
                  const on = pop === e;
                  return (
                    <g key={j} data-event onClick={(ev) => { ev.stopPropagation(); setPop(e); }}>
                      <circle cx={x(yr)} cy={P.t - 14 - j * 17} r={8.5} fill={on ? "var(--color-cold)" : "var(--color-paper)"} stroke="var(--color-cold)" strokeWidth="1.5" />
                      <text x={x(yr)} y={P.t - 10 - j * 17} textAnchor="middle" fill={on ? "var(--color-paper)" : "var(--color-cold)"} style={TXT(10.5)} fontWeight={700}>
                        {p.eventNo.get(e)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          {sel.map((iso3) => {
            const col = p.colorOf(iso3);
            return <path key={iso3} d={path(series(iso3))} fill="none" stroke={col.c} strokeWidth="2" strokeDasharray={col.d || undefined} strokeLinejoin="round" pointerEvents="none" />;
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

      {tip && hy != null && !popIn && (
        <div className="fl-tip" style={tip.x > tip.w * 0.55 ? { right: tip.w - tip.x + 14, top: tip.y + 14 } : { left: tip.x + 14, top: tip.y + 14 }} role="status">
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
        </div>
      )}

      {popIn && (
        <div
          className="fl-pop"
          role="dialog"
          aria-labelledby="fl-pop-title"
          style={popLeftPct > 55 ? { right: `${100 - popLeftPct + 1.5}%` } : { left: `${popLeftPct + 1.5}%` }}
        >
          <div className="flex items-start gap-3">
            <span className="fl-tl-no">{p.eventNo.get(popIn)}</span>
            <div className="min-w-0 grow">
              <p className="text-[12.5px] font-semibold tracking-[0.05em] text-muted uppercase">
                {p.when(popIn)} · {p.where(popIn)} · {p.catName(popIn.cat)}
              </p>
              <p id="fl-pop-title" className="mt-1 text-[15px] leading-[1.35] font-semibold text-ink">
                {lang === "en" ? popIn.titulo_en : popIn.titulo_es}
              </p>
            </div>
            <button ref={closeBtn} type="button" onClick={() => setPop(null)} className="fl-pop-close" aria-label={copy.close}>
              ×
            </button>
          </div>
          <p className="mt-2 text-[14px] leading-[1.6] text-body">{lang === "en" ? popIn.texto_en : popIn.texto_es}</p>
          <button type="button" onClick={() => p.focus(popIn)} className="mt-2 text-[14px] text-cold underline underline-offset-4 hover:decoration-2">
            {copy.timeline.focus} →
          </button>
        </div>
      )}
    </div>
  );
}

// ================================================================ tabla de economías

type Point = { v: number; y: number };
type Row = { iso3: string; name: string; mean: number; sd: number; min: Point | null; max: Point | null };

function EconomyTable({ copy, lang, meta, indicator, sel, series, span, toggle, colorOf, name }: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[]; series: Series; span: number[];
  toggle: (iso3: string) => void; colorOf: (iso3: string) => Color; name: (iso3: string) => string;
}) {
  const rows: Row[] = meta.paises.map((c) => {
    const s = series(c.iso3);
    const st = stats(s);
    let min: Point | null = null, max: Point | null = null;
    s.forEach((v, k) => {
      if (v == null) return;
      if (!min || v < min.v) min = { v, y: span[k] };
      if (!max || v > max.v) max = { v, y: span[k] };
    });
    return { iso3: c.iso3, name: name(c.iso3), mean: st.mean, sd: st.sd, min, max };
  });
  // Barra de datos en la columna del promedio, como en una tabla de BI.
  const tf = indicator.log ? symlog : (v: number) => v;
  const fin = rows.map((r) => r.mean).filter(Number.isFinite);
  const lo = Math.min(0, ...fin.map(tf)), hi = Math.max(0, ...fin.map(tf));
  const pct = (v: number) => ((tf(v) - lo) / (hi - lo || 1)) * 100;
  const zero = pct(0);
  const num = (v: number) => (Number.isFinite(v) ? v : null);
  const yr = (pt: Point) => <span className="text-muted">’{String(pt.y).slice(2)}</span>;

  const cols: Column<Row>[] = [
    {
      key: "name", label: copy.table.economy, sort: (r) => r.name,
      render: (r) => (
        <span className={`flex items-center gap-2 ${sel.includes(r.iso3) ? "font-semibold text-ink" : "text-body"}`}>
          <span aria-hidden="true" className="inline-block h-[3px] w-3 shrink-0" style={{ background: sel.includes(r.iso3) ? colorOf(r.iso3).c : "transparent" }} />
          {r.name}
        </span>
      ),
    },
    {
      key: "mean", label: copy.table.mean, align: "right", sort: (r) => num(r.mean),
      render: (r) => (
        <span className="fl-databar">
          <span aria-hidden="true" className="fl-databar-track">
            {Number.isFinite(r.mean) && (
              <span className="fl-databar-bar" style={{ left: `${Math.min(zero, pct(r.mean))}%`, width: `${Math.abs(pct(r.mean) - zero)}%`, background: sel.includes(r.iso3) ? colorOf(r.iso3).c : "var(--color-coldline)" }} />
            )}
          </span>
          <span className="fl-databar-num">{fmt(lang, r.mean, indicator.id)}</span>
        </span>
      ),
    },
    { key: "sd", label: copy.table.vol, align: "right", sort: (r) => num(r.sd), render: (r) => fmt(lang, r.sd, indicator.id) },
    { key: "min", label: copy.table.min, align: "right", className: "whitespace-nowrap", sort: (r) => r.min?.v ?? null, render: (r) => (r.min ? <>{fmt(lang, r.min.v, indicator.id)} {yr(r.min)}</> : "—") },
    { key: "max", label: copy.table.max, align: "right", className: "whitespace-nowrap", sort: (r) => r.max?.v ?? null, render: (r) => (r.max ? <>{fmt(lang, r.max.v, indicator.id)} {yr(r.max)}</> : "—") },
  ];
  return (
    <div className="fl-scroll">
      <SortTable
        rows={rows}
        columns={cols}
        rowKey={(r) => r.iso3}
        initial={{ key: "mean", dir: "desc" }}
        caption={copy.table.title}
        minWidth={340}
        rowClass={(r) => (sel.includes(r.iso3) ? "fl-row-on" : "")}
        onRow={(r) => toggle(r.iso3)}
      />
    </div>
  );
}

// ================================================================ dispersión

function Scatter({ copy, lang, meta, indicator, sel, series, toggle, colorOf }: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[]; series: Series;
  toggle: (iso3: string) => void; colorOf: (iso3: string) => Color;
}) {
  const W = 420, H = 360, P = { l: 52, r: 16, t: 14, b: 44 };
  const pts = meta.paises
    .map((c) => ({ iso3: c.iso3, ...stats(series(c.iso3)) }))
    .filter((d) => Number.isFinite(d.mean) && Number.isFinite(d.sd));
  const tf = indicator.log ? symlog : (v: number) => v;
  const xs = pts.map((d) => tf(d.sd)), ys = pts.map((d) => tf(d.mean));
  // Se rotulan las elegidas y los extremos (dos arriba, dos abajo, las dos más volátiles):
  // rotular las veinte amontonaba el centro hasta no leerse ninguna.
  const byMean = [...pts].sort((a, b) => a.mean - b.mean).map((d) => d.iso3);
  const bySd = [...pts].sort((a, b) => b.sd - a.sd).map((d) => d.iso3);
  const labelled = new Set([...sel, ...byMean.slice(0, 2), ...byMean.slice(-2), ...bySd.slice(0, 2)]);
  const x1 = Math.max(...xs, 1) * 1.08;
  const y0 = Math.min(...ys, 0), y1 = Math.max(...ys, 0) + (Math.max(...ys) - Math.min(...ys, 0)) * 0.08;
  const x = (v: number) => lin(0, x1, P.l, W - P.r)(tf(v));
  const y = (v: number) => lin(y0, y1, H - P.b, P.t)(tf(v));
  const yt = indicator.log ? logTicks(symexp(y0), symexp(y1)) : niceTicks(y0, y1, 5);
  const xt = indicator.log ? logTicks(0, symexp(x1)).filter((v) => v >= 0) : niceTicks(0, x1, 4);
  return (
    <ScaleAware base={W}>
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
  );
}

// ================================================================ mapa de calor

const DIVERGENT = ["--atlas-neg-3", "--atlas-neg-2", "--atlas-neg-1", "--atlas-mid", "--atlas-pos-1", "--atlas-pos-2", "--atlas-pos-3"];
const SEQUENTIAL = ["--atlas-seq-0", "--atlas-seq-1", "--atlas-seq-2", "--atlas-seq-3", "--atlas-seq-4"];

function Heatmap(p: {
  copy: Copy; lang: string; meta: Meta; indicator: Indicator; sel: string[]; span: number[]; series: Series;
  toggle: (iso3: string) => void; name: (iso3: string) => string; colorOf: (iso3: string) => Color;
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
  const scale = diverging ? DIVERGENT : SEQUENTIAL;
  const color = (v: number | null) => {
    if (v == null) return "var(--atlas-void)";
    const u = Math.min(1, Math.max(0, (tf(v) - lo) / (hi - lo || 1)));
    return `var(${scale[Math.min(scale.length - 1, Math.floor(u * scale.length))]})`;
  };
  const evKey = new Set(p.events.map((e) => `${e.iso3}-${e.anio}`));
  const regional = new Set(p.events.filter((e) => e.iso3 === "LATAM").map((e) => e.anio));
  const [hover, setHover] = useState<{ iso3: string; k: number; x: number; y: number; w: number } | null>(null);

  const W = 760, L = 120, T = 12, B = 24, R = 6, rowH = 14;
  const H = T + rows.length * rowH + B;
  const cw = (W - L - R) / span.length;
  const every = span.length > 40 ? 10 : span.length > 16 ? 5 : 1;
  const hk = p.hoverYear != null ? span.indexOf(p.hoverYear) : -1;
  const hr = hover ? rows.findIndex((c) => c.iso3 === hover.iso3) : -1;

  const svg = useRef<SVGSVGElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const vx = ((e.clientX - b.left) / b.width) * W, vy = ((e.clientY - b.top) / b.height) * H;
    const k = Math.floor((vx - L) / cw), r = Math.floor((vy - T) / rowH);
    if (k >= 0 && k < span.length && r >= 0 && r < rows.length) {
      p.setHoverYear(span[k]);
      setHover({ iso3: rows[r].iso3, k, x: e.clientX - b.left, y: e.clientY - b.top, w: b.width });
    } else setHover(null);
  };

  return (
    <div className="relative">
      <ScaleAware base={W}>
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full touch-pan-y"
          role="img"
          aria-label={`${p.copy.heat.title}: ${lang === "en" ? indicator.en : indicator.es}, ${span[0]}–${span[span.length - 1]}`}
          onPointerMove={onMove}
          onPointerLeave={() => { setHover(null); p.setHoverYear(null); }}
        >
          {rows.map((c, r) => {
            const s = p.series(c.iso3);
            const on = p.sel.includes(c.iso3);
            const yy = T + r * rowH;
            return (
              <g key={c.iso3}>
                <g onClick={() => p.toggle(c.iso3)} style={{ cursor: "pointer" }}>
                  <rect x={0} y={yy} width={L - 6} height={rowH} fill="transparent" />
                  {on && <rect x={L - 11} y={yy + 3} width={3} height={rowH - 6} fill={p.colorOf(c.iso3).c} />}
                  <text x={L - 16} y={yy + rowH / 2 + 4} textAnchor="end" fill={on ? "var(--color-ink)" : "var(--color-muted)"} style={TXT(11.5)} fontWeight={on ? 600 : 400}>
                    {p.name(c.iso3)}
                  </text>
                </g>
                {s.map((v, k) => (
                  <rect key={k} x={L + k * cw + 0.5} y={yy + 0.5} width={Math.max(0.5, cw - 1)} height={rowH - 1} fill={color(v)} />
                ))}
                {s.map((_, k) =>
                  evKey.has(`${c.iso3}-${span[k]}`) ? (
                    <circle key={`e${k}`} cx={L + k * cw + cw / 2} cy={yy + rowH / 2} r={Math.min(2.6, cw / 3)} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1" />
                  ) : null,
                )}
              </g>
            );
          })}
          {/* eventos regionales: una marca sobre la columna */}
          {span.map((yr, k) => (regional.has(yr) ? <path key={yr} d={`M${L + k * cw + cw / 2 - 3},${T - 8}L${L + k * cw + cw / 2 + 3},${T - 8}L${L + k * cw + cw / 2},${T - 3}Z`} fill="var(--color-cold)" /> : null))}
          {/* guías de fila y columna al pasar el cursor */}
          {hk >= 0 && <rect x={L + hk * cw} y={T} width={cw} height={rows.length * rowH} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" pointerEvents="none" />}
          {hr >= 0 && <rect x={L} y={T + hr * rowH} width={W - L - R} height={rowH} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" pointerEvents="none" />}
          {span.map((yr, k) =>
            yr % every === 0 ? (
              <text key={yr} x={L + k * cw + cw / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>
                {yr}
              </text>
            ) : null,
          )}
        </svg>
      </ScaleAware>
      {hover && (
        <div className="fl-tip" role="status" style={hover.x > hover.w * 0.55 ? { right: hover.w - hover.x + 14, top: hover.y + 14 } : { left: hover.x + 14, top: hover.y + 14 }}>
          <b className="block text-ink">{p.name(hover.iso3)} · {span[hover.k]}</b>
          <span className="text-body">{(() => { const v = p.series(hover.iso3)[hover.k]; return v == null ? p.copy.heat.noData : fmt(lang, v, indicator.id, true); })()}</span>
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
        <span>{fmt(lang, indicator.log ? symexp(lo) : lo, indicator.id, true)}</span>
        <span className="fl-legend" aria-hidden="true">
          {scale.map((t) => (
            <span key={t} style={{ background: `var(${t})` }} />
          ))}
        </span>
        <span>{fmt(lang, indicator.log ? symexp(hi) : hi, indicator.id, true)}</span>
        <span className="ml-3 inline-block h-2.5 w-4" style={{ background: "var(--atlas-void)" }} aria-hidden="true" />
        <span>{p.copy.heat.noData}</span>
        <span className="ml-3 inline-block size-2.5 rounded-full border border-ink bg-paper" aria-hidden="true" />
        <span>{p.copy.heat.eventDot}</span>
      </div>
    </div>
  );
}

// ================================================================ estacionalidad

function Seasonality({ copy, lang, ise }: { copy: Copy; lang: string; ise: Ise }) {
  const [sid, setSid] = useState("ise");
  const [view, setView] = useState<"years" | "profile">("years");
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
  const months = copy.season.months;

  const W = 760, H = 300, P = { l: 48, r: 56, t: 12, b: 26 };
  const vals = picked.flatMap((yr) => byYear.get(yr) ?? []).filter((v): v is number => v != null);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.08 || 1;
  const x = lin(0, 11, P.l, W - P.r);
  const y = lin(lo - pad, hi + pad, H - P.b, P.t);
  const latest = Math.max(...picked);
  const order = [...picked].sort((a, b) => a - b);
  const shade = (yr: number) => (order.length > 1 ? 0.3 + (0.7 * order.indexOf(yr)) / (order.length - 1) : 1);

  const pmax = Math.max(...profile.filter(Number.isFinite).map(Math.abs), 1);
  const px = lin(0, 12, P.l, W - P.r);
  const py = lin(-pmax * 1.15, pmax * 1.15, H - P.b, P.t);
  const bw = (W - P.l - P.r) / 12 - 8;

  return (
    <Tile
      className="lg:col-span-7"
      title={copy.season.title}
      hint={copy.season.why}
      tools={
        <div className="atlas-views" role="group" aria-label={copy.season.title}>
          <button type="button" aria-pressed={view === "years"} onClick={() => setView("years")}>{copy.season.viewYears}</button>
          <button type="button" aria-pressed={view === "profile"} onClick={() => setView("profile")}>{copy.season.viewProfile}</button>
        </div>
      }
    >
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <label className="fl-field">
          <span>{copy.season.series}</span>
          <select value={sid} onChange={(e) => setSid(e.target.value)}>
            {ise.series.map((x) => (
              <option key={x.id} value={x.id}>
                {lang === "en" ? x.en : x.es}
              </option>
            ))}
          </select>
        </label>
        {view === "years" && (
          <MultiSelect
            label={copy.season.years}
            summary={order.join(", ")}
            options={[...allYears].reverse().map((yr) => ({ id: String(yr), label: String(yr) }))}
            selected={picked.map(String)}
            onChange={(ids) => ids.length && setPicked(ids.map(Number))}
            max={6}
          />
        )}
      </div>
      <ScaleAware base={W} className="mt-3">
        {view === "years" ? (
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.season.level}: ${order.join(", ")}`}>
            {niceTicks(lo - pad, hi + pad, 4).map((v) => (
              <g key={v}>
                <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="var(--color-rule)" />
                <text x={P.l - 7} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{v}</text>
              </g>
            ))}
            {months.map((m, i) => (
              <text key={m} x={x(i)} y={H - 7} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>{m}</text>
            ))}
            {order.map((yr) => {
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
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={copy.season.profile}>
            <line x1={P.l} x2={W - P.r} y1={py(0)} y2={py(0)} stroke="var(--color-control)" />
            {niceTicks(-pmax, pmax, 4).map((v) => (
              <text key={v} x={P.l - 7} y={py(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{v > 0 ? `+${v}` : String(v).replace("-", "−")}</text>
            ))}
            {profile.map((v, i) =>
              Number.isFinite(v) ? (
                <g key={i}>
                  <rect x={px(i) + 4} y={Math.min(py(v), py(0))} width={bw} height={Math.abs(py(v) - py(0))} fill={v >= 0 ? "var(--color-cold)" : "var(--color-coldline)"} />
                  <text x={px(i) + 4 + bw / 2} y={H - 7} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>{months[i]}</text>
                </g>
              ) : null,
            )}
          </svg>
        )}
      </ScaleAware>
      <p className="mt-2 text-[14px] text-muted">
        {view === "years" ? copy.season.level : `${copy.season.profileNote.replace(/\.$/, "")} (${full[0]}–${full[full.length - 1]}).`}
      </p>
    </Tile>
  );
}
