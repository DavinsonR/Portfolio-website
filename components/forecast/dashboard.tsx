"use client";

/* El panorama: un tablero descriptivo de América Latina, con su pronóstico.

   Se lee como un tablero de BI: una barra de filtros fija arriba y una grilla de
   visuales. El filtro de economías manda en TODO: con seis elegidas, cada visual muestra
   esas seis; sin ninguna, muestra las veinte (y la serie añade la mediana de la región).
   El pronóstico 2026–2027 es el AR(1) del laboratorio con bandas al 80 y 95 %, y su
   cobertura medida en el backtest va al lado (D-008 del laboratorio).

   Reglas del sitio que se mantienen: cifras en tinta o azul, sin ámbar; recuadros planos
   con regla y sin sombras; cada economía se distingue por color Y trazo; los textos de los
   SVG miden 12 px en pantalla (ScaleAware); todo gráfico lleva el título de sus ejes. */

import { useEffect, useRef, useState } from "react";
import ScaleAware from "@/components/ScaleAware";
import type { LabCopy } from "@/lib/content/forecast";
import {
  loadEvents,
  loadForecast,
  loadMeta,
  loadPanel,
  stats,
  symexp,
  symlog,
  type EconEvent,
  type EconomyForecast,
  type EventCat,
  type Events,
  type Forecast,
  type Indicator,
  type IndicatorId,
  type Meta,
  type Panel,
} from "@/lib/data/forecast-lab";
import { setSel } from "./store";
import { MultiSelect, SortTable, Tile, useWidth, type Column } from "./ui";
import { useLoadAll } from "./useLoad";

type Copy = LabCopy["dash"];
type Series = (iso3: string, id?: IndicatorId) => (number | null)[];
type Color = { c: string; d: string; w: number; o: number };

const PRESETS: Record<keyof Copy["presets"], string[]> = {
  big: ["ARG", "BRA", "CHL", "COL", "MEX", "PER"],
  andes: ["BOL", "COL", "ECU", "PER", "VEN"],
  south: ["ARG", "BRA", "CHL", "PRY", "URY"],
  central: ["CRI", "GTM", "HND", "NIC", "PAN", "SLV"],
  caribbean: ["CUB", "DOM", "HTI", "MEX"],
};

// Seis voces que ya existen en el sistema; la quinta y la sexta se separan por trazo. De la
// séptima en adelante, y con «todas», las líneas van en gris fino: son contexto, no foco.
const PALETTE: Color[] = [
  { c: "var(--color-cold)", d: "", w: 2.2, o: 1 },
  { c: "var(--color-building)", d: "", w: 2.2, o: 1 },
  { c: "var(--color-pos)", d: "", w: 2.2, o: 1 },
  { c: "var(--color-neg)", d: "", w: 2.2, o: 1 },
  { c: "var(--color-ink)", d: "7 4", w: 2.2, o: 1 },
  { c: "var(--color-muted)", d: "2 4", w: 2.2, o: 1 },
];
const CONTEXT: Color = { c: "var(--color-muted)", d: "", w: 1.1, o: 0.45 };

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
const pct = (lang: string, v: number) => `${new Intl.NumberFormat(lang === "en" ? "en-US" : "es-CO", { maximumFractionDigits: 0 }).format(v * 100)} %`;

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

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Título del eje Y, girado, a la izquierda del gráfico. */
const YTitle = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text transform={`translate(${x},${y}) rotate(-90)`} textAnchor="middle" fill="var(--color-muted)" style={TXT(12)}>
    {text}
  </text>
);

// ================================================================ contenedor

export default function Dashboard({ copy, lang }: { copy: LabCopy; lang: string }) {
  const { data, failed, retry } = useLoadAll({ meta: loadMeta, panel: loadPanel, events: loadEvents, forecast: loadForecast }, "panorama");
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
  return <Board copy={copy.dash} lang={lang} meta={data.meta} panel={data.panel} events={data.events} forecast={data.forecast} />;
}

// ================================================================ el tablero

/** Exportado para la prueba de humo (tests/forecast-dashboard.test.ts): se renderiza con los
 *  JSON reales y cada métrica, sin navegador. */
export function Board({ copy, lang, meta, panel, events, forecast, initial }: {
  copy: Copy; lang: string; meta: Meta; panel: Panel; events: Events; forecast: Forecast;
  initial?: { sel?: string[]; ind?: IndicatorId; from?: number; to?: number; pop?: EconEvent };
}) {
  const years = panel.anios;
  const lastYear = years[years.length - 1];
  const [sel, setSelected] = useState<string[]>(initial?.sel ?? PRESETS.big);
  const [ind, setInd] = useState<IndicatorId>(initial?.ind ?? "pib_crecimiento");
  const [from, setFrom] = useState(initial?.from ?? 1990);
  const [to, setTo] = useState(initial?.to ?? lastYear);
  const [cats, setCats] = useState<EventCat[]>(events.categorias.map((c) => c.id));
  const [showFc, setShowFc] = useState(true);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [pop, setPop] = useState<EconEvent | null>(initial?.pop ?? null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const indicator = panel.indicadores.find((i) => i.id === ind) as Indicator;
  const name = (iso3: string) => {
    const c = meta.paises.find((p) => p.iso3 === iso3);
    return c ? (lang === "en" ? c.en : c.es) : iso3;
  };
  const byName = (a: string, b: string) => name(a).localeCompare(name(b), lang);
  const all = meta.paises.map((p) => p.iso3).sort(byName);
  const allMode = sel.length === 0;
  // Lo que el filtro deja ver en todos los visuales: la selección, o las veinte si no hay.
  const shown = allMode ? all : sel;

  const i0 = years.indexOf(from);
  const i1 = years.indexOf(to);
  const span = years.slice(i0, i1 + 1);
  const series: Series = (iso3, id = ind) => (panel.datos[iso3]?.[id] ?? []).slice(i0, i1 + 1);
  const colorOf = (iso3: string): Color => {
    const k = sel.indexOf(iso3);
    return k >= 0 && k < PALETTE.length ? PALETTE[k] : CONTEXT;
  };

  const choose = (next: string[]) => {
    setSelected(next);
    // La última economía elegida viaja al juego y al origen móvil, si tiene serie anual.
    const last = next[next.length - 1];
    if (last && meta.paises.find((c) => c.iso3 === last)?.anual) setSel({ iso3: last });
  };
  const toggle = (iso3: string) => choose(sel.includes(iso3) ? sel.filter((x) => x !== iso3) : [...sel, iso3]);

  // Eventos del tipo elegido: los de la región siempre; los nacionales, solo de las economías
  // elegidas (con las veinte a la vista, treinta marcadores no se leerían).
  const eligible = events.eventos.filter((e) => cats.includes(e.cat) && (e.iso3 === "LATAM" || (!allMode && sel.includes(e.iso3))));
  const visible = eligible.filter((e) => e.anio >= from && e.anio <= to);
  const eventNo = new Map(visible.map((e, k) => [e, k + 1]));

  const thin = shown
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
  const fcOf = (iso3: string) => forecast.economias.find((e) => e.iso3 === iso3);
  // El pronóstico se dibuja en la serie solo para el crecimiento y si el período llega al final.
  const fcOn = showFc && ind === "pib_crecimiento" && to === lastYear;
  const indName = lang === "en" ? indicator.en : indicator.es;
  const indUnit = lang === "en" ? indicator.unidad_en : indicator.unidad_es;

  return (
    <div className="fl-board">
      {/* ---------------- barra de filtros, fija arriba en escritorio ---------------- */}
      <div className="fl-bar-filters" data-open={filtersOpen}>
        {/* En el teléfono la barra ocupaba una pantalla entera: se pliega en un resumen. */}
        <button type="button" className="fl-filters-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((v) => !v)}>
          <span className="min-w-0 truncate">
            <b className="font-semibold">{copy.filters}</b> · {allMode ? fill(copy.allEconomies, { n: all.length }) : fill(copy.economiesBtn, { n: sel.length })} · {indName} · {from}–{to}
          </span>
          <span aria-hidden="true">{filtersOpen ? "▴" : "▾"}</span>
        </button>
        <div className="fl-filters-body">
        <MultiSelect
          label={copy.economies}
          summary={allMode ? fill(copy.allEconomies, { n: all.length }) : fill(copy.economiesBtn, { n: sel.length })}
          options={all.map((iso3) => ({
            id: iso3,
            label: name(iso3),
            swatch: <span aria-hidden="true" className="inline-block h-[3px] w-4 shrink-0" style={{ background: sel.includes(iso3) ? colorOf(iso3).c : "var(--color-rule)" }} />,
          }))}
          selected={sel}
          onChange={choose}
          search={copy.search}
          actions={
            <button type="button" className="fl-link" onClick={() => choose([])}>
              {copy.clearAll}
            </button>
          }
        />
        <label className="fl-field">
          <span>{copy.presetsLabel}</span>
          <select
            value={allMode ? "__all" : (presetKeys.find((k) => PRESETS[k].join() === sel.join()) ?? "")}
            onChange={(e) => (e.target.value === "__all" ? choose([]) : e.target.value && choose(PRESETS[e.target.value as keyof typeof PRESETS]))}
          >
            <option value="">{copy.custom}</option>
            <option value="__all">{fill(copy.allEconomies, { n: all.length })}</option>
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
            {events.eventos
              .filter((e) => cats.includes(e.cat))
              .map((e) => {
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
      </div>

      {thin.length > 0 && (
        <p className="mt-2 text-[14px] text-muted">
          {fill(copy.missing, { names: thin.map((c) => `${name(c.iso3)} (${fill(copy.yearsOf, { n: c.n, total: span.length })})`).join(", ") })}
        </p>
      )}

      <Kpis copy={copy} lang={lang} ind={ind} shown={shown} series={series} span={span} name={name} />

      {/* ---------------- la grilla de visuales ---------------- */}
      <div className="fl-grid">
        <Tile
          className="lg:col-span-12"
          title={<>{copy.chart.title} · {indName} <span className="fl-unit">({indUnit})</span></>}
          hint={copy.chart.hint}
          tools={
            ind === "pib_crecimiento" ? (
              <button type="button" role="switch" aria-checked={showFc} onClick={() => setShowFc((v) => !v)} className="fl-switch">
                <span className="fl-switch-track" aria-hidden="true">
                  <span className="fl-switch-knob" />
                </span>
                <span className="text-[14px] text-ink">{copy.forecast.toggle}</span>
              </button>
            ) : undefined
          }
        >
          <div ref={chartRef}>
            <LineChart
              copy={copy} lang={lang} indicator={indicator} sel={sel} shown={shown} allMode={allMode} span={span} series={series}
              colorOf={colorOf} name={name} events={visible} eventNo={eventNo} hoverYear={hoverYear} setHoverYear={setHoverYear}
              pop={pop} setPop={setPop} focus={focus} when={when} where={where} catName={catName}
              forecast={fcOn ? forecast : null}
            />
          </div>
        </Tile>

        <ForecastTile copy={copy} lang={lang} forecast={forecast} shown={shown} sel={sel} name={name} colorOf={colorOf} fcOf={fcOf} panel={panel} />

        <Tile className="lg:col-span-8" title={`${copy.heat.title} · ${indName}`} hint={copy.heat.hint}>
          <Heatmap copy={copy} lang={lang} indicator={indicator} sel={sel} rows={shown} span={span} series={series} toggle={toggle} name={name} colorOf={colorOf} events={visible} hoverYear={hoverYear} setHoverYear={setHoverYear} />
        </Tile>

        <Tile className="lg:col-span-4" title={copy.scatter.title} hint={copy.scatter.hint}>
          <Scatter copy={copy} lang={lang} indicator={indicator} sel={sel} shown={shown} series={series} toggle={toggle} colorOf={colorOf} />
        </Tile>

        <Tile className="lg:col-span-12" title={`${fill(copy.table.title, { n: shown.length })} · ${indName}`} hint={copy.table.hint}>
          <EconomyTable copy={copy} lang={lang} indicator={indicator} sel={sel} shown={shown} series={series} span={span} toggle={toggle} colorOf={colorOf} name={name} />
        </Tile>
      </div>

      <p className="mt-4 text-[14px] text-muted">{copy.source}</p>
    </div>
  );
}

// ================================================================ indicadores

function Kpis({ copy, lang, ind, shown, series, span, name }: {
  copy: Copy; lang: string; ind: IndicatorId; shown: string[]; series: Series; span: number[]; name: (iso3: string) => string;
}) {
  const all: number[] = [];
  let worst: { v: number; iso3: string; y: number } | null = null;
  let best: { v: number; iso3: string; y: number } | null = null;
  const sds: number[] = [];
  for (const iso3 of shown) {
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
  for (const iso3 of shown) for (const v of series(iso3, "pib_crecimiento")) if (v != null) { total++; if (v < 0) falls++; }
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

// ================================================================ la serie (el gráfico principal)

function LineChart(p: {
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; shown: string[]; allMode: boolean; span: number[]; series: Series;
  colorOf: (iso3: string) => Color; name: (iso3: string) => string;
  events: EconEvent[]; eventNo: Map<EconEvent, number>; hoverYear: number | null; setHoverYear: (y: number | null) => void;
  pop: EconEvent | null; setPop: (e: EconEvent | null) => void; focus: (e: EconEvent) => void;
  when: (e: EconEvent) => string; where: (e: EconEvent) => string; catName: (c: EventCat) => string;
  forecast: Forecast | null;
}) {
  const { indicator, sel, shown, allMode, span, series, lang, copy, pop, setPop } = p;
  const [wrap, cw] = useWidth<HTMLDivElement>(1100);
  const W = Math.max(300, cw);
  const narrow = W < 640;
  const H = narrow ? 330 : 440;
  const P = narrow ? { l: 50, r: 46, t: 52, b: 46 } : { l: 70, r: 150, t: 60, b: 48 };
  const tf = indicator.log ? symlog : (v: number) => v;

  // Con pronóstico, el eje llega hasta el último año pronosticado y las bandas entran en la escala.
  const fcs = (p.forecast ? sel.slice(0, PALETTE.length).map((iso3) => p.forecast!.economias.find((e) => e.iso3 === iso3)) : []).filter(
    (e): e is EconomyForecast => e != null,
  );
  const xEnd = fcs.length ? Math.max(span[span.length - 1], ...fcs.flatMap((e) => e.pronostico.map((f) => f.anio))) : span[span.length - 1];

  // La mediana de lo que está a la vista: con las veinte es la referencia regional.
  const med = span.map((_, k) => median(shown.map((iso3) => series(iso3)[k]).filter((v): v is number => v != null)));

  const vals = [
    ...shown.flatMap((iso3) => series(iso3)),
    ...fcs.flatMap((e) => e.pronostico.flatMap((f) => [f.lo95, f.hi95])),
  ].filter((v): v is number => v != null && Number.isFinite(v));
  let lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  if (indicator.id !== "pib_per_capita") lo = Math.min(lo, 0);
  const pad = (tf(hi) - tf(lo)) * 0.04 || 1;
  const d0 = tf(lo) - pad, d1 = tf(hi) + pad;
  const x = lin(span[0], xEnd, P.l, W - P.r);
  const y = (v: number) => lin(d0, d1, H - P.b, P.t)(tf(v));
  // Grilla fina: el crecimiento se mueve en pocos puntos y una grilla cada 10 no deja leerlo.
  const ticks = (indicator.log ? logTicks(symexp(d0), symexp(d1)) : niceTicks(d0, d1, narrow ? 7 : 14)).filter((v) => {
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
      if (!t.closest?.(".fl-pop, [data-event], .fl-bar-filters")) setPop(null);
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

  // Etiquetas al final: las economías con color y, con todas a la vista, la mediana.
  const labelled = allMode ? [] : sel.slice(0, PALETTE.length);
  const ends = labelled
    .map((iso3) => {
      const fc = fcs.find((e) => e.iso3 === iso3);
      if (fc) {
        const f = fc.pronostico[fc.pronostico.length - 1];
        return { key: iso3, text: narrow ? iso3 : p.name(iso3), color: p.colorOf(iso3).c, x: x(f.anio), y: y(f.media) };
      }
      const s = series(iso3);
      let k = s.length - 1;
      while (k >= 0 && s[k] == null) k--;
      return k >= 0 ? { key: iso3, text: narrow ? iso3 : p.name(iso3), color: p.colorOf(iso3).c, x: x(span[k]), y: y(s[k] as number) } : null;
    })
    .filter((e): e is { key: string; text: string; color: string; x: number; y: number } => e != null);
  if (allMode) {
    let k = med.length - 1;
    while (k >= 0 && med[k] == null) k--;
    if (k >= 0) ends.push({ key: "__med", text: narrow ? "Med." : copy.median, color: "var(--color-ink)", x: x(span[k]), y: y(med[k] as number) });
  }
  ends.sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 17) ends[k].y = ends[k - 1].y + 17;

  const onMove = (e: React.PointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const vx = ((e.clientX - b.left) / b.width) * W;
    const yr = Math.round(lin(P.l, W - P.r, span[0], xEnd)(vx));
    if (yr >= span[0] && yr <= xEnd) {
      p.setHoverYear(yr);
      setTip({ x: e.clientX - b.left, y: e.clientY - b.top, w: b.width });
    }
  };

  const hy = p.hoverYear != null && p.hoverYear >= span[0] && p.hoverYear <= xEnd ? p.hoverYear : null;
  const k = hy != null ? span.indexOf(hy) : -1;
  const byYear = new Map<number, EconEvent[]>();
  p.events.forEach((e) => byYear.set(e.anio, [...(byYear.get(e.anio) ?? []), e]));

  const popIn = pop && pop.anio >= span[0] && pop.anio <= span[span.length - 1] ? pop : null;
  const popLeftPct = popIn ? (x(popIn.anio) / W) * 100 : 0;
  const lastData = span[span.length - 1];
  const xt = niceTicks(span[0], xEnd, narrow ? 4 : 10).filter((t) => Number.isInteger(t));
  const stack = narrow ? 2 : 3;

  return (
    <div ref={wrap} className="relative">
      <ScaleAware base={W}>
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full touch-pan-y"
          role="img"
          aria-label={`${lang === "en" ? indicator.en : indicator.es}, ${span[0]}–${xEnd}: ${allMode ? copy.median : sel.map(p.name).join(", ")}`}
          onPointerMove={onMove}
          onPointerLeave={() => { p.setHoverYear(null); setTip(null); }}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} strokeWidth={v === 0 ? 1.4 : 1} />
              <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>
                {fmt(lang, v, indicator.id)}
              </text>
            </g>
          ))}
          {xt.map((t) => (
            <text key={t} x={x(t)} y={H - P.b + 18} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
              {t}
            </text>
          ))}
          <YTitle x={14} y={(P.t + H - P.b) / 2} text={narrow ? (lang === "en" ? indicator.unidad_en : indicator.unidad_es) : `${lang === "en" ? indicator.en : indicator.es} (${lang === "en" ? indicator.unidad_en : indicator.unidad_es})`} />
          <text x={(P.l + W - P.r) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>
            {copy.year}
          </text>

          {/* el tramo pronosticado, sombreado y rotulado */}
          {fcs.length > 0 && (
            <g pointerEvents="none">
              <rect x={x(lastData)} y={P.t} width={x(xEnd) - x(lastData)} height={H - P.b - P.t} fill="var(--color-band)" />
              <line x1={x(lastData)} x2={x(lastData)} y1={P.t} y2={H - P.b} stroke="var(--color-control)" strokeDasharray="2 3" />
              <text x={narrow ? W - 2 : x(lastData) + 6} y={P.t + 14} textAnchor={narrow ? "end" : "start"} fill="var(--color-muted)" style={TXT(11.5)}>
                {narrow ? copy.forecast.zone : `${copy.forecast.zone} →`}
              </text>
            </g>
          )}

          {/* eventos: línea punteada y marcadores numerados; tocarlos abre el resumen */}
          {[...byYear.entries()].map(([yr, es]) => {
            const open = pop != null && es.includes(pop);
            return (
              <g key={yr} data-event onClick={() => setPop(es[0])} style={{ cursor: "pointer" }}>
                <line x1={x(yr)} x2={x(yr)} y1={P.t - 4} y2={H - P.b} stroke="transparent" strokeWidth="14" />
                <line x1={x(yr)} x2={x(yr)} y1={P.t - 4} y2={H - P.b} stroke={open ? "var(--color-cold)" : "var(--color-control)"} strokeWidth={open ? 2 : 1} strokeDasharray="3 4" />
                {es.slice(0, stack).map((e, j) => {
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

          {/* bandas del pronóstico: 95 % más clara, 80 % más oscura, desde el último dato */}
          {fcs.map((fc) => {
            const col = p.colorOf(fc.iso3).c;
            const pts = [{ anio: fc.ultimo_anio, lo80: fc.ultimo, hi80: fc.ultimo, lo95: fc.ultimo, hi95: fc.ultimo, media: fc.ultimo }, ...fc.pronostico];
            const band = (lo2: "lo80" | "lo95", hi2: "hi80" | "hi95") =>
              pts.map((f, i) => `${i ? "L" : "M"}${x(f.anio).toFixed(1)},${y(f[hi2]).toFixed(1)}`).join("") +
              [...pts].reverse().map((f) => `L${x(f.anio).toFixed(1)},${y(f[lo2]).toFixed(1)}`).join("") + "Z";
            return (
              <g key={fc.iso3} pointerEvents="none">
                <path d={band("lo80", "hi80")} fill={col} opacity="0.16" />
                <path d={pts.map((f, i) => `${i ? "L" : "M"}${x(f.anio).toFixed(1)},${y(f.media).toFixed(1)}`).join("")} fill="none" stroke={col} strokeWidth="2" strokeDasharray="5 4" />
                {fc.pronostico.map((f) => <circle key={f.anio} cx={x(f.anio)} cy={y(f.media)} r={3.5} fill="var(--color-paper)" stroke={col} strokeWidth="2" />)}
              </g>
            );
          })}

          {/* primero el contexto gris, encima las elegidas, y la mediana si están todas */}
          {shown
            .filter((iso3) => p.colorOf(iso3) === CONTEXT)
            .map((iso3) => (
              <path key={iso3} d={path(series(iso3))} fill="none" stroke={CONTEXT.c} strokeWidth={CONTEXT.w} opacity={CONTEXT.o} strokeLinejoin="round" pointerEvents="none" />
            ))}
          {sel.slice(0, PALETTE.length).map((iso3) => {
            const col = p.colorOf(iso3);
            return <path key={iso3} d={path(series(iso3))} fill="none" stroke={col.c} strokeWidth={col.w} strokeDasharray={col.d || undefined} strokeLinejoin="round" pointerEvents="none" />;
          })}
          {allMode && <path d={path(med)} fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinejoin="round" pointerEvents="none" />}
          {ends.map((e) => (
            <text key={e.key} x={Math.min(e.x, W - P.r) + 10} y={e.y + 4} fill={e.color} style={TXT()} fontWeight={600}>
              {e.text}
            </text>
          ))}
          {hy != null && (
            <g pointerEvents="none">
              <line x1={x(hy)} x2={x(hy)} y1={P.t} y2={H - P.b} stroke="var(--color-ink)" strokeWidth="1" />
              {k >= 0 &&
                sel.slice(0, PALETTE.length).map((iso3) => {
                  const v = series(iso3)[k];
                  return v != null ? <circle key={iso3} cx={x(hy)} cy={y(v)} r={4} fill={p.colorOf(iso3).c} stroke="var(--color-paper)" strokeWidth="1.5" /> : null;
                })}
            </g>
          )}
        </svg>
      </ScaleAware>

      {tip && hy != null && !popIn && (
        <div className="fl-tip" style={tip.x > tip.w * 0.55 ? { right: tip.w - tip.x + 14, top: tip.y + 14 } : { left: tip.x + 14, top: tip.y + 14 }} role="status">
          <b className="block text-ink">{hy}{hy > lastData ? ` · ${copy.forecast.zone}` : ""}</b>
          {(allMode ? [] : sel.slice(0, 8))
            .map((iso3) => {
              if (hy > lastData) {
                const f = fcs.find((e) => e.iso3 === iso3)?.pronostico.find((q) => q.anio === hy);
                return { iso3, v: f?.media ?? null, band: f ? `${fmt(lang, f.lo95, indicator.id)} ${copy.forecast.to} ${fmt(lang, f.hi95, indicator.id)}` : null };
              }
              return { iso3, v: series(iso3)[k], band: null };
            })
            .sort((a, b) => (b.v ?? -Infinity) - (a.v ?? -Infinity))
            .map(({ iso3, v, band }) => (
              <span key={iso3} className="flex items-center gap-2 text-body">
                <span className="inline-block h-[3px] w-3" style={{ background: p.colorOf(iso3).c }} aria-hidden="true" />
                {p.name(iso3)}
                <b className="ml-auto pl-3 font-semibold text-ink">{fmt(lang, v, indicator.id)}</b>
                {band && <span className="text-muted">({band})</span>}
              </span>
            ))}
          {allMode && k >= 0 && (
            <span className="flex items-center gap-2 text-body">
              {copy.median}
              <b className="ml-auto pl-3 font-semibold text-ink">{fmt(lang, med[k], indicator.id)}</b>
            </span>
          )}
        </div>
      )}

      {popIn && (
        <div className="fl-pop" role="dialog" aria-labelledby="fl-pop-title" style={narrow ? { left: "3%", right: "3%", width: "auto" } : popLeftPct > 55 ? { right: `${100 - popLeftPct + 1.5}%` } : { left: `${popLeftPct + 1.5}%` }}>
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

// ================================================================ el pronóstico 2026–2027

function ForecastTile({ copy, lang, forecast, shown, sel, name, colorOf, fcOf, panel }: {
  copy: Copy; lang: string; forecast: Forecast; shown: string[]; sel: string[];
  name: (iso3: string) => string; colorOf: (iso3: string) => Color; fcOf: (iso3: string) => EconomyForecast | undefined; panel: Panel;
}) {
  const available = shown.filter((iso3) => fcOf(iso3));
  const [focusIso, setFocusIso] = useState<string | null>(null);
  const focus = focusIso && available.includes(focusIso) ? focusIso : (available.find((i) => sel.includes(i)) ?? available[0] ?? null);
  const fc = focus ? fcOf(focus) : undefined;
  const r = forecast.cobertura_region;
  // Los años que se pronostican para la mayoría (2026 y 2027); Cuba, con su último dato en
  // 2024, trae además 2025 y se lee en su gráfico.
  const years = [...new Set(forecast.economias.flatMap((e) => e.pronostico.map((f) => f.anio)))].filter((yr) => yr > 2025).sort();

  const rows = available.map((iso3) => fcOf(iso3)!);
  const at = (e: EconomyForecast, yr: number) => e.pronostico.find((f) => f.anio === yr);
  const band = (f: { lo95: number; hi95: number } | undefined) =>
    f ? `${fmt(lang, f.lo95, "pib_crecimiento")} ${copy.forecast.to} ${fmt(lang, f.hi95, "pib_crecimiento")}` : "—";

  const cols: Column<EconomyForecast>[] = [
    {
      key: "name", label: copy.table.economy, sort: (e) => name(e.iso3),
      render: (e) => (
        <span className={`flex items-center gap-2 ${e.iso3 === focus ? "font-semibold text-ink" : "text-body"}`}>
          <span aria-hidden="true" className="inline-block h-[3px] w-3 shrink-0" style={{ background: sel.includes(e.iso3) && colorOf(e.iso3) !== CONTEXT ? colorOf(e.iso3).c : "transparent" }} />
          {name(e.iso3)}
        </span>
      ),
    },
    { key: "last", label: copy.forecast.last, align: "right", className: "whitespace-nowrap", sort: (e) => e.ultimo, render: (e) => <>{fmt(lang, e.ultimo, "pib_crecimiento")} <span className="text-muted">’{String(e.ultimo_anio).slice(2)}</span></> },
    ...years.map((yr): Column<EconomyForecast> => ({
      key: `y${yr}`, label: String(yr), align: "right", sort: (e) => at(e, yr)?.media ?? null,
      render: (e) => (
        <span className="whitespace-nowrap">
          <b className="font-semibold text-ink">{fmt(lang, at(e, yr)?.media, "pib_crecimiento")}</b>
          <span className="block text-muted sm:ml-1 sm:inline">({band(at(e, yr))})</span>
        </span>
      ),
    })),
    { key: "cov", label: copy.forecast.coverage, align: "right", sort: (e) => e.cobertura.c95, render: (e) => <span className={e.cobertura.c95 < 0.85 ? "font-semibold text-neg" : "text-body"}>{pct(lang, e.cobertura.c95)}</span> },
  ];
  const title = fill(copy.forecast.title, { from: years[0], to: years[years.length - 1] });

  return (
    <Tile className="lg:col-span-12" title={title} hint={fill(copy.forecast.hint, { c95: pct(lang, r.c95), c80: pct(lang, r.c80), n: r.n })}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)]">
        <div className="min-w-0">
          <label className="fl-field max-w-[280px]">
            <span>{copy.forecast.economy}</span>
            <select value={focus ?? ""} onChange={(e) => setFocusIso(e.target.value)}>
              {available.map((iso3) => (
                <option key={iso3} value={iso3}>
                  {name(iso3)}
                </option>
              ))}
            </select>
          </label>
          {fc && focus && (
            <FanChart copy={copy} lang={lang} fc={fc} hist={panel.datos[focus]?.pib_crecimiento ?? []} years={panel.anios}
              color={sel.includes(focus) && colorOf(focus) !== CONTEXT ? colorOf(focus).c : "var(--color-cold)"} name={name(focus)} />
          )}
          {fc && focus && (
            <p className="mt-2 text-[14px] leading-[1.55] text-body">
              {fill(copy.forecast.coverageNote, { name: name(focus), pct: pct(lang, fc.cobertura.c95), n: fc.cobertura.n })}
              {fc.cobertura.c95 < 0.85 && <b className="font-semibold text-neg"> {copy.forecast.lowCoverage}</b>}
            </p>
          )}
        </div>
        <div className="min-w-0">
          <SortTable rows={rows} columns={cols} rowKey={(e) => e.iso3} initial={{ key: `y${years[0]}`, dir: "desc" }} caption={title} minWidth={340}
            rowClass={(e) => (e.iso3 === focus ? "fl-row-on" : "")} onRow={(e) => setFocusIso(e.iso3)} />
        </div>
      </div>
      <p className="mt-3 text-[14px] leading-[1.55] text-muted">{copy.forecast.disclaimer}</p>
    </Tile>
  );
}

function FanChart({ copy, lang, fc, hist, years, color, name }: {
  copy: Copy; lang: string; fc: EconomyForecast; hist: (number | null)[]; years: number[]; color: string; name: string;
}) {
  const [wrap, cw] = useWidth<HTMLDivElement>(700);
  const W = Math.max(300, cw);
  const narrow = W < 560;
  const H = narrow ? 290 : 340;
  const P = narrow ? { l: 50, r: 16, t: 26, b: 46 } : { l: 62, r: 24, t: 26, b: 46 };
  const y0 = fc.ultimo_anio - (narrow ? 10 : 15);
  const pts = years
    .map((yr, i) => ({ yr, v: hist[i] }))
    .filter((d): d is { yr: number; v: number } => d.yr >= y0 && d.yr <= fc.ultimo_anio && d.v != null);
  const end = fc.pronostico[fc.pronostico.length - 1].anio;
  const vals = [...pts.map((d) => d.v), ...fc.pronostico.flatMap((f) => [f.lo95, f.hi95]), 0];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.06;
  const x = lin(y0, end, P.l, W - P.r);
  const y = lin(lo - pad, hi + pad, H - P.b, P.t);
  const ticks = niceTicks(lo - pad, hi + pad, narrow ? 6 : 10);
  const chain = [{ anio: fc.ultimo_anio, media: fc.ultimo, lo80: fc.ultimo, hi80: fc.ultimo, lo95: fc.ultimo, hi95: fc.ultimo }, ...fc.pronostico];
  const band = (a: "lo80" | "lo95", b: "hi80" | "hi95") =>
    chain.map((f, i) => `${i ? "L" : "M"}${x(f.anio)},${y(f[b])}`).join("") + [...chain].reverse().map((f) => `L${x(f.anio)},${y(f[a])}`).join("") + "Z";
  const line = pts.map((d, i) => `${i ? "L" : "M"}${x(d.yr)},${y(d.v)}`).join("");
  return (
    <div ref={wrap} className="mt-3">
      <ScaleAware base={W}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${copy.forecast.fanLabel}: ${name}`}>
          <rect x={x(fc.ultimo_anio)} y={P.t} width={x(end) - x(fc.ultimo_anio)} height={H - P.b - P.t} fill="var(--color-band)" />
          {ticks.map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--color-control)" : "var(--color-rule)"} strokeWidth={v === 0 ? 1.4 : 1} />
              <text x={P.l - 8} y={y(v) + 4} textAnchor="end" fill="var(--color-muted)" style={TXT()}>{fmt(lang, v, "pib_crecimiento")}</text>
            </g>
          ))}
          {niceTicks(y0, end, narrow ? 4 : 6).filter(Number.isInteger).map((t) => (
            <text key={t} x={x(t)} y={H - P.b + 18} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{t}</text>
          ))}
          <YTitle x={14} y={(P.t + H - P.b) / 2} text={narrow ? "%" : copy.forecast.axisY} />
          <text x={(P.l + W - P.r) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{copy.year}</text>
          <path d={band("lo95", "hi95")} fill={color} opacity="0.14" />
          <path d={band("lo80", "hi80")} fill={color} opacity="0.26" />
          <path d={line} fill="none" stroke={color} strokeWidth="2.2" />
          <path d={chain.map((f, i) => `${i ? "L" : "M"}${x(f.anio)},${y(f.media)}`).join("")} fill="none" stroke={color} strokeWidth="2.2" strokeDasharray="5 4" />
          {fc.pronostico.map((f, i) => {
            const above = i % 2 === 0;
            return (
              <g key={f.anio}>
                <circle cx={x(f.anio)} cy={y(f.media)} r={4} fill="var(--color-paper)" stroke={color} strokeWidth="2" />
                <text x={x(f.anio)} y={above ? y(f.hi95) - 7 : y(f.lo95) + 16} textAnchor="end" fill="var(--color-ink)" style={TXT()} fontWeight={600}>
                  {f.anio}: {fmt(lang, f.media, "pib_crecimiento", true)}
                </text>
              </g>
            );
          })}
        </svg>
      </ScaleAware>
      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-body">
        <li className="flex items-center gap-2"><span className="inline-block h-[2px] w-5" style={{ background: color }} aria-hidden="true" />{copy.forecast.history}</li>
        <li className="flex items-center gap-2"><span className="inline-block h-0 w-5 border-t-2 border-dashed" style={{ borderColor: color }} aria-hidden="true" />{copy.forecast.mean}</li>
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-5 rounded-[2px]" style={{ background: color, opacity: 0.45 }} aria-hidden="true" />{copy.forecast.band80}</li>
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-5 rounded-[2px]" style={{ background: color, opacity: 0.2 }} aria-hidden="true" />{copy.forecast.band95}</li>
      </ul>
    </div>
  );
}

// ================================================================ tabla de economías

type Point = { v: number; y: number };
type Row = { iso3: string; name: string; mean: number; sd: number; min: Point | null; max: Point | null; last: Point | null };

function EconomyTable({ copy, lang, indicator, sel, shown, series, span, toggle, colorOf, name }: {
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; shown: string[]; series: Series; span: number[];
  toggle: (iso3: string) => void; colorOf: (iso3: string) => Color; name: (iso3: string) => string;
}) {
  const rows: Row[] = shown.map((iso3) => {
    const s = series(iso3);
    const st = stats(s);
    let min: Point | null = null, max: Point | null = null, last: Point | null = null;
    s.forEach((v, k) => {
      if (v == null) return;
      if (!min || v < min.v) min = { v, y: span[k] };
      if (!max || v > max.v) max = { v, y: span[k] };
      last = { v, y: span[k] };
    });
    return { iso3, name: name(iso3), mean: st.mean, sd: st.sd, min, max, last };
  });
  // Barra de datos en la columna del promedio, como en una tabla de BI.
  const tf = indicator.log ? symlog : (v: number) => v;
  const fin = rows.map((r) => r.mean).filter(Number.isFinite);
  const lo = Math.min(0, ...fin.map(tf)), hi = Math.max(0, ...fin.map(tf));
  const pc = (v: number) => ((tf(v) - lo) / (hi - lo || 1)) * 100;
  const zero = pc(0);
  const num = (v: number) => (Number.isFinite(v) ? v : null);
  const yr = (pt: Point) => <span className="text-muted">’{String(pt.y).slice(2)}</span>;
  const colored = (iso3: string) => sel.includes(iso3) && colorOf(iso3) !== CONTEXT;

  const cols: Column<Row>[] = [
    {
      key: "name", label: copy.table.economy, sort: (r) => r.name,
      render: (r) => (
        <span className={`flex items-center gap-2 ${sel.includes(r.iso3) ? "font-semibold text-ink" : "text-body"}`}>
          <span aria-hidden="true" className="inline-block h-[3px] w-3 shrink-0" style={{ background: colored(r.iso3) ? colorOf(r.iso3).c : "transparent" }} />
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
              <span className="fl-databar-bar" style={{ left: `${Math.min(zero, pc(r.mean))}%`, width: `${Math.abs(pc(r.mean) - zero)}%`, background: colored(r.iso3) ? colorOf(r.iso3).c : "var(--color-coldline)" }} />
            )}
          </span>
          <span className="fl-databar-num">{fmt(lang, r.mean, indicator.id)}</span>
        </span>
      ),
    },
    { key: "sd", label: copy.table.vol, align: "right", sort: (r) => num(r.sd), render: (r) => fmt(lang, r.sd, indicator.id) },
    { key: "min", label: copy.table.min, align: "right", className: "whitespace-nowrap", sort: (r) => r.min?.v ?? null, render: (r) => (r.min ? <>{fmt(lang, r.min.v, indicator.id)} {yr(r.min)}</> : "—") },
    { key: "max", label: copy.table.max, align: "right", className: "whitespace-nowrap", sort: (r) => r.max?.v ?? null, render: (r) => (r.max ? <>{fmt(lang, r.max.v, indicator.id)} {yr(r.max)}</> : "—") },
    { key: "last", label: copy.table.last, align: "right", className: "whitespace-nowrap", sort: (r) => r.last?.v ?? null, render: (r) => (r.last ? <>{fmt(lang, r.last.v, indicator.id)} {yr(r.last)}</> : "—") },
  ];
  return (
    <SortTable
      rows={rows}
      columns={cols}
      rowKey={(r) => r.iso3}
      initial={{ key: "mean", dir: "desc" }}
      caption={fill(copy.table.title, { n: rows.length })}
      minWidth={560}
      rowClass={(r) => (sel.includes(r.iso3) ? "fl-row-on" : "")}
      onRow={(r) => toggle(r.iso3)}
    />
  );
}

// ================================================================ dispersión

function Scatter({ copy, lang, indicator, sel, shown, series, toggle, colorOf }: {
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; shown: string[]; series: Series;
  toggle: (iso3: string) => void; colorOf: (iso3: string) => Color;
}) {
  const W = 420, H = 380, P = { l: 64, r: 16, t: 14, b: 48 };
  const pts = shown
    .map((iso3) => ({ iso3, ...stats(series(iso3)) }))
    .filter((d) => Number.isFinite(d.mean) && Number.isFinite(d.sd));
  const tf = indicator.log ? symlog : (v: number) => v;
  const xs = pts.map((d) => tf(d.sd)), ys = pts.map((d) => tf(d.mean));
  // Con pocas a la vista se rotulan todas; con las veinte, las elegidas y los extremos.
  const byMean = [...pts].sort((a, b) => a.mean - b.mean).map((d) => d.iso3);
  const bySd = [...pts].sort((a, b) => b.sd - a.sd).map((d) => d.iso3);
  const labelled = new Set(pts.length <= 8 ? pts.map((d) => d.iso3) : [...sel, ...byMean.slice(0, 2), ...byMean.slice(-2), ...bySd.slice(0, 2)]);
  const x1 = Math.max(...xs, 1) * 1.1;
  const y0 = Math.min(...ys, 0), y1 = Math.max(...ys, 0) + (Math.max(...ys, 0) - Math.min(...ys, 0)) * 0.1;
  const x = (v: number) => lin(0, x1, P.l, W - P.r)(tf(v));
  const y = (v: number) => lin(y0, y1, H - P.b, P.t)(tf(v));
  const yt = indicator.log ? logTicks(symexp(y0), symexp(y1)) : niceTicks(y0, y1, 8);
  const xt = indicator.log ? logTicks(0, symexp(x1)).filter((v) => v >= 0) : niceTicks(0, x1, 5);
  const lab = pts.filter((q) => labelled.has(q.iso3)).map((d) => ({ iso3: d.iso3, px: x(d.sd), py: y(d.mean) }));
  const leftOf = new Set(
    lab
      .filter((a) => lab.some((b) => b !== a && Math.abs(b.py - a.py) < 14 && b.px - a.px < 56 && (b.px > a.px || (b.px === a.px && b.iso3 > a.iso3))))
      .map((a) => a.iso3),
  );
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
        <YTitle x={16} y={(P.t + H - P.b) / 2} text={copy.scatter.y} />
        <text x={(P.l + W - P.r) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{copy.scatter.x}</text>
        {pts.map((d) => {
          const on = sel.includes(d.iso3);
          const col = colorOf(d.iso3);
          return (
            <g key={d.iso3} onClick={() => toggle(d.iso3)} style={{ cursor: "pointer" }}>
              <circle cx={x(d.sd)} cy={y(d.mean)} r={on ? 6.5 : 4.5} fill={on && col !== CONTEXT ? col.c : "var(--color-coldline)"} stroke={on ? "var(--color-paper)" : "none"} strokeWidth="1.5" />
              {labelled.has(d.iso3) && (
                <text x={x(d.sd) + (leftOf.has(d.iso3) ? -8 : 8)} y={y(d.mean) + 4} textAnchor={leftOf.has(d.iso3) ? "end" : "start"} fill={on ? "var(--color-ink)" : "var(--color-muted)"} style={TXT(on ? 12 : 11)} fontWeight={on ? 600 : 400}>
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
  copy: Copy; lang: string; indicator: Indicator; sel: string[]; rows: string[]; span: number[]; series: Series;
  toggle: (iso3: string) => void; name: (iso3: string) => string; colorOf: (iso3: string) => Color;
  events: EconEvent[]; hoverYear: number | null; setHoverYear: (y: number | null) => void;
}) {
  const { indicator, span, lang, rows } = p;
  const tf = indicator.log ? symlog : (v: number) => v;
  const all = rows.flatMap((iso3) => p.series(iso3)).filter((v): v is number => v != null).map(tf);
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

  const [wrap, widthNow] = useWidth<HTMLDivElement>(760);
  const W = Math.max(300, widthNow);
  const narrow = W < 560;
  const L = narrow ? 44 : 120, T = 12, B = 44, R = 6;
  const rowH = rows.length <= 8 ? 26 : narrow ? 16 : 14; // con pocas economías, filas más altas
  const H = T + rows.length * rowH + B;
  const cw = (W - L - R) / span.length;
  const every = span.length > 40 || (narrow && span.length > 16) ? 10 : span.length > 16 ? 5 : 1;
  const hk = p.hoverYear != null ? span.indexOf(p.hoverYear) : -1;
  const hr = hover ? rows.indexOf(hover.iso3) : -1;

  const svg = useRef<SVGSVGElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const vx = ((e.clientX - b.left) / b.width) * W, vy = ((e.clientY - b.top) / b.height) * H;
    const k = Math.floor((vx - L) / cw), r = Math.floor((vy - T) / rowH);
    if (k >= 0 && k < span.length && r >= 0 && r < rows.length) {
      p.setHoverYear(span[k]);
      setHover({ iso3: rows[r], k, x: e.clientX - b.left, y: e.clientY - b.top, w: b.width });
    } else setHover(null);
  };

  return (
    <div ref={wrap} className="relative">
      <ScaleAware base={W}>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block w-full touch-pan-y" role="img"
          aria-label={`${p.copy.heat.title}: ${lang === "en" ? indicator.en : indicator.es}, ${span[0]}–${span[span.length - 1]}`}
          onPointerMove={onMove} onPointerLeave={() => { setHover(null); p.setHoverYear(null); }}>
          {rows.map((iso3, r) => {
            const s = p.series(iso3);
            const on = p.sel.includes(iso3);
            const col = p.colorOf(iso3);
            const yy = T + r * rowH;
            return (
              <g key={iso3}>
                <g onClick={() => p.toggle(iso3)} style={{ cursor: "pointer" }}>
                  <rect x={0} y={yy} width={L - 6} height={rowH} fill="transparent" />
                  {on && col !== CONTEXT && <rect x={L - 11} y={yy + 3} width={3} height={rowH - 6} rx={1} fill={col.c} />}
                  <text x={L - 16} y={yy + rowH / 2 + 4} textAnchor="end" fill={on ? "var(--color-ink)" : "var(--color-muted)"} style={TXT(11.5)} fontWeight={on ? 600 : 400}>
                    {narrow ? iso3 : p.name(iso3)}
                  </text>
                </g>
                {s.map((v, k) => <rect key={k} x={L + k * cw + 0.5} y={yy + 0.5} width={Math.max(0.5, cw - 1)} height={rowH - 1} rx={1.5} fill={color(v)} />)}
                {s.map((_, k) =>
                  evKey.has(`${iso3}-${span[k]}`) ? (
                    <circle key={`e${k}`} cx={L + k * cw + cw / 2} cy={yy + rowH / 2} r={Math.min(2.8, cw / 3)} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1" />
                  ) : null,
                )}
              </g>
            );
          })}
          {span.map((yr, k) => (regional.has(yr) ? <path key={yr} d={`M${L + k * cw + cw / 2 - 3},${T - 8}L${L + k * cw + cw / 2 + 3},${T - 8}L${L + k * cw + cw / 2},${T - 3}Z`} fill="var(--color-cold)" /> : null))}
          {hk >= 0 && <rect x={L + hk * cw} y={T} width={cw} height={rows.length * rowH} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" pointerEvents="none" />}
          {hr >= 0 && <rect x={L} y={T + hr * rowH} width={W - L - R} height={rowH} fill="none" stroke="var(--color-ink)" strokeWidth="1.2" pointerEvents="none" />}
          {span.map((yr, k) =>
            yr % every === 0 ? (
              <text key={yr} x={L + k * cw + cw / 2} y={T + rows.length * rowH + 16} textAnchor="middle" fill="var(--color-muted)" style={TXT(11)}>{yr}</text>
            ) : null,
          )}
          <text x={L + (W - L - R) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" style={TXT()}>{p.copy.year}</text>
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
          {scale.map((t) => <span key={t} style={{ background: `var(${t})` }} />)}
        </span>
        <span>{fmt(lang, indicator.log ? symexp(hi) : hi, indicator.id, true)}</span>
        <span className="ml-3 inline-block h-2.5 w-4 rounded-[2px]" style={{ background: "var(--atlas-void)" }} aria-hidden="true" />
        <span>{p.copy.heat.noData}</span>
        <span className="ml-3 inline-block size-2.5 rounded-full border border-ink bg-paper" aria-hidden="true" />
        <span>{p.copy.heat.eventDot}</span>
      </div>
    </div>
  );
}
