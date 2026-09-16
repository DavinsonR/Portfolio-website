// ============================================================
// SVG a mano, sin librería de gráficos y sin JavaScript en cliente.
//
// Las tres figuras de esta página son estáticas: no hay nada que explorar, hay algo
// que mirar. Renderizarlas en el servidor las deja legibles sin JS, dentro de la CSP
// estricta del sitio y sin un kilobyte de bundle.
//
// Los colores son tokens del tema, así que las marcas leen igual en papel y en
// oscuro. Donde la distinción importa —tramo previo contra posterior, cumple contra
// no cumple— la identidad la lleva la FORMA además del color: relleno hueco, línea
// punteada, etiqueta directa. Un gráfico que sólo funciona en color no funciona.
// ============================================================

import type { CliffPoint, EventPoint } from "@/lib/data/credit-risk";

const INK = "var(--color-ink)";
const BODY = "var(--color-body)";
const MUTED = "var(--color-muted)";
const RULE = "var(--color-rule)";
const COLD = "var(--color-cold)";
// Sin ambar. DESIGN.md lo reserva a contenido humano y de proposito, y una cifra
// en ambar es un defecto declarado: aqui todo dato viste azul institucional, tinta
// o los tokens de estado que ya existen (pos / neg).
const NEG = "var(--color-neg)";
const POS = "var(--color-pos)";

const mono =
  '"Source Serif 4", ui-serif, Georgia, serif';

// ------------------------------------------------------------ 1. el acantilado

export function VocabularyCliff({
  points,
  lang,
  labels,
}: {
  points: CliffPoint[];
  lang: string;
  labels: { y: string; caption: string; unsupported: string };
}) {
  const W = 720;
  const H = 260;
  const P = { t: 18, r: 20, b: 34, l: 46 };
  const iw = W - P.l - P.r;
  const ih = H - P.t - P.b;
  const x = (i: number) => P.l + (iw * i) / Math.max(points.length - 1, 1);
  const y = (v: number) => P.t + ih * (1 - v);
  const bw = Math.min(30, (iw / points.length) * 0.62);

  const fmt = (v: number) => `${Math.round(v * 100)}${lang === "es" ? " %" : "%"}`;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={labels.caption}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke={RULE} strokeWidth={0.75} />
            <text
              x={P.l - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize={11}
              fill={MUTED}
              fontFamily={mono}
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {points.map((p, i) => {
          const h = ih * p.sinSoporte;
          const roto = p.sinSoporte > 0;
          return (
            <g key={p.fy}>
              <rect
                x={x(i) - bw / 2}
                y={y(p.sinSoporte)}
                width={bw}
                height={Math.max(h, roto ? 2 : 1.5)}
                fill={roto ? NEG : "none"}
                stroke={roto ? "none" : MUTED}
                strokeWidth={1}
                opacity={roto ? 0.92 : 1}
              />
              <text
                x={x(i)}
                y={H - P.b + 15}
                textAnchor="middle"
                fontSize={10.5}
                fill={MUTED}
                fontFamily={mono}
              >
                {String(p.fy).slice(2)}
              </text>
            </g>
          );
        })}

        {/* La etiqueta directa va sobre la primera cosecha rota y sobre la última:
            el salto se lee sin buscar en una leyenda. */}
        {[points.findIndex((p) => p.sinSoporte > 0), points.length - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={y(points[i].sinSoporte) - 7}
            textAnchor={i === points.length - 1 ? "end" : "middle"}
            fontSize={12}
            fill={INK}
            fontWeight={600}
            fontFamily={mono}
          >
            {fmt(points[i].sinSoporte)}
          </text>
        ))}

        <text x={P.l} y={12} fontSize={11} fill={MUTED}>
          {labels.y}
        </text>
      </svg>
      <figcaption className="text-[14px] leading-[1.65] text-muted mt-2">
        {labels.caption}
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------ 2. estudio de evento

export function EventStudy({
  points,
  threshold,
  lang,
  labels,
}: {
  points: EventPoint[];
  threshold: number;
  lang: string;
  labels: { y: string; band: string; pre: string; post: string; caption: string };
}) {
  const W = 720;
  const H = 300;
  const P = { t: 22, r: 24, b: 40, l: 56 };
  const iw = W - P.l - P.r;
  const ih = H - P.t - P.b;

  const vals = points.flatMap((p) => [p.lo, p.hi]);
  const lo = Math.min(...vals, -threshold) - 0.4;
  const hi = Math.max(...vals, threshold) + 0.4;
  const x = (i: number) => P.l + (iw * (i + 0.5)) / points.length;
  const y = (v: number) => P.t + ih * (1 - (v - lo) / (hi - lo));

  const baseIdx = points.findIndex((p) => p.fase === "base");
  const shockX = (x(baseIdx) + x(baseIdx + 1)) / 2;
  const ticks = [-2, -1, 0, 1, 2, 3].filter((t) => t >= lo && t <= hi);
  const fmt = (v: number) => (lang === "es" ? String(v).replace(".", ",") : String(v));

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={labels.caption}
      >
        {/* Banda del umbral económico, declarado antes de estimar. */}
        <rect
          x={P.l}
          y={y(threshold)}
          width={iw}
          height={y(-threshold) - y(threshold)}
          fill={COLD}
          opacity={0.07}
        />
        <text x={W - P.r - 2} y={y(threshold) - 5} textAnchor="end" fontSize={10.5} fill={MUTED}>
          {labels.band}
        </text>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={P.l}
              x2={W - P.r}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? MUTED : RULE}
              strokeWidth={t === 0 ? 1 : 0.75}
            />
            <text
              x={P.l - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize={11}
              fill={MUTED}
              fontFamily={mono}
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {/* El shock. Antes de esta línea, todo coeficiente debería ser cero. */}
        <line
          x1={shockX}
          x2={shockX}
          y1={P.t - 6}
          y2={P.t + ih}
          stroke={INK}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <text x={shockX - 6} y={P.t - 10} textAnchor="end" fontSize={10.5} fill={MUTED}>
          {labels.pre}
        </text>
        <text x={shockX + 6} y={P.t - 10} fontSize={10.5} fill={MUTED}>
          {labels.post}
        </text>

        {points.map((p, i) => {
          const fuera = Math.abs(p.gamma) >= threshold;
          const previo = p.fase === "previo";
          // Previo hueco, posterior relleno: la fase se lee sin color.
          return (
            <g key={p.anio}>
              <line
                x1={x(i)}
                x2={x(i)}
                y1={y(p.lo)}
                y2={y(p.hi)}
                stroke={fuera ? (previo ? NEG : INK) : MUTED}
                strokeWidth={1.25}
              />
              <circle
                cx={x(i)}
                cy={y(p.gamma)}
                r={4}
                fill={previo ? "var(--color-paper)" : fuera ? INK : MUTED}
                stroke={fuera ? (previo ? NEG : INK) : MUTED}
                strokeWidth={1.5}
              />
              <text
                x={x(i)}
                y={H - P.b + 16}
                textAnchor="middle"
                fontSize={10.5}
                fill={p.fase === "base" ? INK : MUTED}
                fontFamily={mono}
                fontWeight={p.fase === "base" ? 600 : 400}
              >
                {String(p.anio).slice(2)}
              </text>
            </g>
          );
        })}

        <text x={P.l} y={12} fontSize={11} fill={MUTED}>
          {labels.y}
        </text>
      </svg>
      <figcaption className="text-[14px] leading-[1.65] text-muted mt-2">
        {labels.caption}
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------ 3. el contrapeso

export function DecisionBalance({
  avoided,
  forgone,
  labels,
}: {
  avoided: number;
  forgone: number;
  labels: {
    avoided: string;
    forgone: string;
    avoidedValue: string;
    forgoneValue: string;
    caption: string;
  };
}) {
  const W = 720;
  const H = 150;
  const P = { t: 26, r: 20, b: 20, l: 20 };
  const iw = W - P.l - P.r;
  const max = Math.max(avoided, forgone);
  const bh = 34;

  const rows = [
    { v: avoided, label: labels.avoided, value: labels.avoidedValue, fill: POS, y: P.t },
    { v: forgone, label: labels.forgone, value: labels.forgoneValue, fill: COLD, y: P.t + bh + 26 },
  ];

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={labels.caption}
      >
        {rows.map((r) => (
          <g key={r.label}>
            <text x={P.l} y={r.y - 7} fontSize={12} fill={BODY}>
              {r.label}
            </text>
            <rect
              x={P.l}
              y={r.y}
              width={(iw * r.v) / max}
              height={bh}
              fill={r.fill}
              opacity={0.85}
            />
            <text
              x={P.l + (iw * r.v) / max - 10}
              y={r.y + bh / 2 + 6}
              textAnchor="end"
              fontSize={17}
              fill="var(--color-paper)"
              fontFamily={mono}
              fontWeight={600}
            >
              {r.value}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="text-[14px] leading-[1.65] text-muted mt-2">
        {labels.caption}
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------ 4. el gate que bloquea

export function FairnessGate({
  ratio,
  threshold,
  lang,
  labels,
}: {
  ratio: number;
  threshold: number;
  lang: string;
  labels: { scale: string; threshold: string; observed: string; caption: string };
}) {
  const W = 720;
  const H = 118;
  const P = { t: 40, r: 26, b: 28, l: 26 };
  const iw = W - P.l - P.r;
  const lo = 0.6;
  const hi = 1.0;
  const x = (v: number) => P.l + (iw * (v - lo)) / (hi - lo);
  const fmt = (v: number) => (lang === "es" ? v.toFixed(2).replace(".", ",") : v.toFixed(2));

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={labels.caption}
      >
        {/* Zona que no cumple: a la izquierda del umbral de cuatro quintos. */}
        <rect x={P.l} y={P.t} width={x(threshold) - P.l} height={16} fill={NEG} opacity={0.14} />
        <rect
          x={x(threshold)}
          y={P.t}
          width={W - P.r - x(threshold)}
          height={16}
          fill={POS}
          opacity={0.14}
        />
        <line x1={P.l} x2={W - P.r} y1={P.t + 8} y2={P.t + 8} stroke={RULE} strokeWidth={1} />

        {[0.6, 0.7, 0.8, 0.9, 1.0].map((t) => (
          <text
            key={t}
            x={x(t)}
            y={P.t + 34}
            textAnchor="middle"
            fontSize={10.5}
            fill={MUTED}
            fontFamily={mono}
          >
            {fmt(t)}
          </text>
        ))}

        <line
          x1={x(threshold)}
          x2={x(threshold)}
          y1={P.t - 14}
          y2={P.t + 22}
          stroke={INK}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text x={x(threshold) + 7} y={P.t - 18} fontSize={11.5} fill={INK} fontWeight={600}>
          {labels.threshold}
        </text>

        <circle cx={x(ratio)} cy={P.t + 8} r={7} fill={NEG} />
        <text
          x={x(ratio)}
          y={P.t - 18}
          textAnchor="end"
          fontSize={11.5}
          fill={NEG}
          fontWeight={600}
        >
          {labels.observed}
        </text>

        <text x={P.l} y={14} fontSize={11} fill={MUTED}>
          {labels.scale}
        </text>
      </svg>
      <figcaption className="text-[14px] leading-[1.65] text-muted mt-2">
        {labels.caption}
      </figcaption>
    </figure>
  );
}
