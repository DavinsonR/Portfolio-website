"use client";

// ============================================================
// Hand-built SVG, no chart library. Colors are theme tokens, so the
// same marks read correctly on paper and in the dark theme:
//   series    = the institutional blue that owns the sheet's bands
//   benchmark = muted ink, dashed — its identity is carried by FORM
//               (dash + legend + direct labels), so it survives
//               grayscale printing and color-vision deficiency.
// Text always wears text tokens, never the series color.
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { compactMoney, money } from "@/lib/data/trading-sim";

export const CHART = {
  series: "var(--color-cold)",
  benchmark: "var(--color-muted)",
  grid: "var(--color-rule)",
  surface: "var(--color-paper)",
};

// ---------- curva de equity: estrategia vs buy & hold ----------

type EquityChartProps = {
  points: [string, number, number][];
  lang: string;
  splitDate?: string | null;
  labels: {
    strategy: string;
    benchmark: string;
    split: string;
    tableToggle: string;
    date: string;
  };
};

const W = 720;
const H = 280;
const PAD = { top: 14, right: 88, bottom: 26, left: 52 };

export function EquityChart({ points, lang, splitDate, labels }: EquityChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const benchRef = useRef<SVGPathElement>(null);
  const seriesRef = useRef<SVGPathElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geom = useMemo(() => {
    const values = points.flatMap((p) => [p[1], p[2]]);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    const y = (v: number) =>
      PAD.top + (H - PAD.top - PAD.bottom) * (1 - (v - lo - span * -0.04) / (span * 1.08));
    const x = (i: number) =>
      PAD.left + ((W - PAD.left - PAD.right) * i) / Math.max(points.length - 1, 1);
    const path = (k: 1 | 2) =>
      points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join("");
    // 4 ticks "bonitos" del eje Y
    const step = niceStep(span / 3);
    const first = Math.ceil(lo / step) * step;
    const ticks: number[] = [];
    for (let v = first; v <= hi; v += step) ticks.push(v);
    const splitIdx = splitDate ? points.findIndex((p) => p[0] >= splitDate.slice(0, 10)) : -1;
    return { x, y, path, ticks, splitIdx };
  }, [points, splitDate]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the plot is drawn, not revealed: benchmark first, strategy landing last
    const draw = (el: SVGPathElement | null, delay: number) => {
      if (!el) return;
      el.getAnimations().forEach((a) => a.cancel());
      const len = el.getTotalLength();
      if (!len) return;
      el.style.strokeDasharray = String(len);
      el.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 1300, delay, easing: "cubic-bezier(0.33, 1, 0.68, 1)", fill: "both" }
      );
    };
    draw(benchRef.current, 0);
    draw(seriesRef.current, 180);
  }, [points]);

  if (points.length < 2) return null;

  const last = points[points.length - 1];
  const endStrategyY = geom.y(last[1]);
  const endBenchY = geom.y(last[2]);
  // anti-colisión de etiquetas finales: si chocan, se separan
  const collide = Math.abs(endStrategyY - endBenchY) < 16;
  const labelStrategyY = collide ? Math.min(endStrategyY, endBenchY) - 2 : endStrategyY;
  const labelBenchY = collide ? Math.max(endStrategyY, endBenchY) + 12 : endBenchY;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = ((e.clientX - rect.left) / rect.width) * W;
    const t = (fx - PAD.left) / (W - PAD.left - PAD.right);
    const idx = Math.round(t * (points.length - 1));
    setHover(idx >= 0 && idx < points.length ? idx : null);
  };

  const h = hover !== null ? points[hover] : null;
  const hoverLeftPct = h ? (geom.x(hover!) / W) * 100 : 0;

  return (
    <div ref={wrapRef} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none"
        role="img"
        aria-label={`${labels.strategy} vs ${labels.benchmark}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* grid horizontal hairline + ticks Y en token de texto */}
        {geom.ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={geom.y(v)} y2={geom.y(v)} stroke={CHART.grid} strokeWidth="1" />
            <text x={PAD.left - 8} y={geom.y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--color-muted)">
              {compactMoney(lang, v)}
            </text>
          </g>
        ))}

        {/* marcador del corte train/validación */}
        {geom.splitIdx > 0 && (
          <g>
            <line
              x1={geom.x(geom.splitIdx)} x2={geom.x(geom.splitIdx)}
              y1={PAD.top} y2={H - PAD.bottom}
              stroke="var(--color-rule)" strokeWidth="1"
            />
            <text x={geom.x(geom.splitIdx) + 5} y={PAD.top + 9} fontSize="9.5" fill="var(--color-muted)">
              {labels.split}
            </text>
          </g>
        )}

        {/* benchmark: referencia punteada (identidad por forma, no por matiz) */}
        <path ref={benchRef} d={geom.path(2)} fill="none" stroke={CHART.benchmark} strokeWidth="2" strokeDasharray="5 6" strokeLinejoin="round" strokeLinecap="round" />
        {/* estrategia: serie única */}
        <path ref={seriesRef} d={geom.path(1)} fill="none" stroke={CHART.series} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* puntos finales con anillo de superficie + etiquetas directas */}
        <circle cx={geom.x(points.length - 1)} cy={endBenchY} r="4" fill={CHART.benchmark} stroke={CHART.surface} strokeWidth="2" />
        <circle cx={geom.x(points.length - 1)} cy={endStrategyY} r="4" fill={CHART.series} stroke={CHART.surface} strokeWidth="2" />
        <text x={W - PAD.right + 10} y={labelStrategyY + 3.5} fontSize="10.5" fill="var(--color-ink)">
          {compactMoney(lang, last[1])}
        </text>
        <text x={W - PAD.right + 10} y={labelBenchY + 3.5} fontSize="10.5" fill="var(--color-body)">
          {compactMoney(lang, last[2])}
        </text>

        {/* fechas: inicio / fin */}
        <text x={PAD.left} y={H - 8} fontSize="10" fill="var(--color-muted)">{points[0][0]}</text>
        <text x={W - PAD.right} y={H - 8} textAnchor="end" fontSize="10" fill="var(--color-muted)">{last[0]}</text>

        {/* capa hover: crosshair + anillos */}
        {h && (
          <g pointerEvents="none">
            <line x1={geom.x(hover!)} x2={geom.x(hover!)} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--color-cold)" strokeOpacity="0.4" strokeWidth="1" />
            <circle cx={geom.x(hover!)} cy={geom.y(h[2])} r="4.5" fill={CHART.benchmark} stroke={CHART.surface} strokeWidth="2" />
            <circle cx={geom.x(hover!)} cy={geom.y(h[1])} r="4.5" fill={CHART.series} stroke={CHART.surface} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* tooltip HTML.
          Llevaba `role="status"`: una región viva educada que se reescribía en
          cada `pointermove` e inundaba la cola de anuncios de un lector de
          pantalla, sin que ese lector pudiera activarla nunca (es
          `pointer-events: none` y no tiene disparador de teclado). El
          equivalente no visual real ya existe: la tabla de datos del `<details>`
          de más abajo. */}
      {h && (
        <div
          className="pointer-events-none absolute top-2 z-10 border border-ink bg-paper px-3 py-2 text-[14px] leading-relaxed"
          style={{ left: `min(max(${hoverLeftPct}%, 8%), 72%)`, transform: "translateX(-50%)" }}
        >
          <p className="text-muted">{h[0]}</p>
          <p className="text-ink">
            <span className="mr-1.5 inline-block h-[2px] w-3 align-middle" style={{ background: CHART.series }} />
            {labels.strategy}: {money(lang, h[1])}
          </p>
          <p className="text-body">
            <span className="mr-1.5 inline-block w-3 border-t-2 border-dashed align-middle" style={{ borderColor: CHART.benchmark }} />
            {labels.benchmark}: {money(lang, h[2])}
          </p>
        </div>
      )}

      {/* vista tabla (accesibilidad): muestreo trimestral */}
      <details className="mt-2">
        <summary className="cursor-pointer text-[14px] text-muted hover:text-body">{labels.tableToggle}</summary>
        <div className="mt-2 max-h-48 overflow-y-auto rounded border border-rulesoft">
          <table className="w-full text-[14px]">
            <thead className="sticky top-0 bg-band2 text-muted">
              <tr>
                <th className="px-2 py-1 text-left font-normal">{labels.date}</th>
                <th className="px-2 py-1 text-right font-normal">{labels.strategy}</th>
                <th className="px-2 py-1 text-right font-normal">{labels.benchmark}</th>
              </tr>
            </thead>
            <tbody className="text-body">
              {points.filter((_, i) => i % 30 === 0 || i === points.length - 1).map((p) => (
                <tr key={p[0]} className="border-t border-rulesoft">
                  <td className="px-2 py-1">{p[0]}</td>
                  <td className="px-2 py-1 text-right">{money(lang, p[1])}</td>
                  <td className="px-2 py-1 text-right">{money(lang, p[2])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function niceStep(rough: number): number {
  const mag = 10 ** Math.floor(Math.log10(Math.abs(rough) || 1));
  const n = rough / mag;
  return (n >= 5 ? 10 : n >= 2 ? 5 : n >= 1 ? 2 : 1) * mag;
}

// ---------- barras horizontales (magnitud, una sola serie) ----------

export type BarRow = { label: string; value: number; display: string; note?: string };

export function HBars({ rows, max }: { rows: BarRow[]; max?: number }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 0.0001);
  return (
    <div className="space-y-2.5">
      {rows.map((r) => {
        const w = Math.max((r.value / top) * 100, 0);
        return (
          <div key={r.label} data-reveal className="reveal group">
            <div className="mb-1 flex items-baseline justify-between text-[14px]">
              <span className="text-body">{r.label}</span>
              <span className="text-ink">
                {r.display}
                {r.note && <span className="ml-2 text-muted">{r.note}</span>}
              </span>
            </div>
            <div className="h-[14px] rounded-[3px] bg-rule">
              <div
                className="bar-in h-full rounded-[1px] transition-all duration-500"
                style={{ width: `${Math.max(w, r.value > 0 ? 1.5 : 0.4)}%`, background: CHART.series, opacity: r.value === 0 ? 0.25 : 1 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- embudo: 1.347 → 349 → 40 ----------

export function Funnel({ stages }: { stages: { label: string; value: number; display: string }[] }) {
  const top = Math.max(...stages.map((s) => s.value), 1);
  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const w = Math.max((s.value / top) * 100, 2.4);
        return (
          <div key={s.label} data-reveal className="reveal" style={{ "--d": `${i * 110}ms` } as React.CSSProperties}>
            <div className="mb-1 flex items-baseline gap-3 text-[14px]">
              <span className="text-ink text-[14px] font-semibold">{s.display}</span>
              <span className="text-body">{s.label}</span>
            </div>
            <div className="h-[22px] rounded-[3px] bg-rule">
              <div
                className="bar-in h-full rounded-[1px] transition-all duration-700"
                style={{ width: `${w}%`, background: CHART.series, opacity: 1 - i * 0.18, "--d": `${i * 110 + 90}ms` } as React.CSSProperties}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
