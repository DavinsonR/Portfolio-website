// ============================================================
// Las vistas previas de la vitrina de la portada: el MEJOR gráfico de cada
// proyecto, no un dibujo nuevo. Todo se pinta en el servidor (SVG o imagen):
// cero JavaScript propio y cero peticiones de datos.
//
//   series   la curva real de SPY: cinco estrategias contra comprar y mantener,
//            con la ventana ciega marcada (npm run snapshot la guarda)
//   event    el estudio de evento de credit-risk-mlops, el mismo componente de
//            su página
//   atlas    los dos mapas del índice, 2018 y 2025 (npm run atlas)
//   shot     el tablero del laboratorio de pronóstico, capturado en los dos
//            temas y los dos idiomas (scripts/capture-showcase.mjs)
//   star     la estrella del modelo semántico de Power BI
//   screen   dos pantallas reales del demo de JARVIS
//
// Ninguna cifra se inventa: cada gráfico dibuja un dato ya publicado en la
// página de su proyecto.
// ============================================================
import type { ShowcaseCard } from "@/lib/content/types";
import { EventStudy } from "@/components/credit-risk/Charts";
import { eventPoints, umbralPP } from "@/lib/data/credit-risk";
import { ATLAS_FIGURE } from "@/lib/generated/atlas-figure";
import serie from "@/public/trading-sim-snapshot/showcase-series.json";

/* ---------------------------------------------------------------- series */
function Series({ l, lang }: { l: string[]; lang: string }) {
  const W = 640, H = 300, P = { t: 18, r: 16, b: 30, l: 16 };
  const all = [...serie.buyHold, ...serie.strategies.flatMap((s) => s.equity)];
  const lo = Math.min(...all) * 0.97, hi = Math.max(...all) * 1.02;
  const n = serie.dates.length;
  const x = (i: number) => P.l + ((W - P.l - P.r) * i) / (n - 1);
  const y = (v: number) => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo));
  const d = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const split = serie.split_ts ? serie.dates.findIndex((t) => t >= serie.split_ts!.slice(0, 10)) : -1;
  const years = serie.dates
    .map((t, i) => [t.slice(0, 4), i] as const)
    .filter(([yr], i, a) => i === 0 || a[i - 1][0] !== yr);
  const fmtK = (v: number) => new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { maximumFractionDigits: 0 }).format(v);
  const lastBh = serie.buyHold[n - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
      {split > 0 && (
        <>
          <rect x={x(split)} y={P.t} width={W - P.r - x(split)} height={H - P.t - P.b} className="fill-cold/10" />
          <text x={x(split) + 8} y={H - P.b - 10} className="fill-cold text-[13px] font-semibold">{l[2]}</text>
        </>
      )}
      {years.map(([yr, i]) => (
        <text key={yr} x={x(i)} y={H - 8} className="fill-muted text-[12.5px]">{yr}</text>
      ))}
      {serie.strategies.map((s, k) => (
        <path
          key={s.strategy}
          d={d(s.equity)}
          pathLength={1}
          className="draw-in fill-none stroke-cold"
          strokeOpacity={0.35 + k * 0.1}
          strokeWidth={1.5}
          style={{ "--d": `${250 + k * 140}ms` } as React.CSSProperties}
        />
      ))}
      <path d={d(serie.buyHold)} pathLength={1} className="draw-in fill-none stroke-ink" strokeWidth={2.6} />
      <circle cx={x(n - 1)} cy={y(lastBh)} r={4.5} className="fill-ink" />
      <text x={x(n - 1) - 8} y={y(lastBh) - 12} textAnchor="end" className="fill-ink text-[13px] font-bold">
        {l[0]} · {fmtK(lastBh)}
      </text>
      <text x={P.l + 4} y={P.t + 16} className="fill-muted text-[13px] font-semibold">{l[1]}</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- star */
function Star({ l }: { l: string[] }) {
  // Las cuatro tablas de hechos del modelo (lib/data/powerbi-model.ts).
  const facts = [[110, 58, "combination_analysis"], [530, 58, "asset_summary"], [110, 242, "fx_decomposition"], [530, 242, "equity_curves"]] as const;
  return (
    <svg viewBox="0 0 640 300" className="block h-auto w-full" aria-hidden="true">
      {facts.map(([x, y], i) => (
        <line
          key={`l${i}`}
          x1="320" y1="150" x2={x} y2={y}
          pathLength={1}
          className="draw-in stroke-cold/60"
          strokeWidth="2"
          style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
        />
      ))}
      {facts.map(([x, y, name], i) => (
        <g key={`r${i}`}>
          <rect x={x - 80} y={y - 22} width="160" height="44" rx="6" className="fill-paper stroke-cold" strokeWidth="1.5" />
          <text x={x} y={y + 5} textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{name}</text>
        </g>
      ))}
      <rect x="236" y="124" width="168" height="52" rx="8" className="fill-cold" />
      <text x="320" y="156" textAnchor="middle" className="fill-paper text-[17px] font-bold">{l[0]}</text>
      <text x="110" y="20" textAnchor="middle" className="fill-muted text-[13px] font-semibold tracking-[0.06em]">{l[1]}</text>
      <rect x="440" y="132" width="44" height="36" rx="5" className="fill-none stroke-control" strokeDasharray="4 4" />
      <rect x="498" y="132" width="44" height="36" rx="5" className="fill-none stroke-control" strokeDasharray="4 4" />
      <text x="491" y="192" textAnchor="middle" className="fill-muted text-[13px] font-semibold tracking-[0.06em]">{l[2]}</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- atlas */
function Atlas({ l }: { l: string[] }) {
  // El SVG generado trae role="img" y un <title>: aquí es decorativo (la
  // tarjeta ya se nombra con su texto), así que se le quitan los dos.
  const svg = ATLAS_FIGURE.svg
    .replace(/<title[^>]*>TITLE_SLOT<\/title>/, "")
    .replace('role="img" aria-labelledby="atlas-figure-title"', 'aria-hidden="true"');
  return (
    <div>
      {/* Contenido propio, generado en build desde los JSON del repo. */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span aria-hidden="true" className="flex overflow-hidden rounded-[3px]">
          {ATLAS_FIGURE.ramp.map((token) => (
            <span key={token} className="h-2.5 w-5" style={{ background: `var(${token})` }} />
          ))}
        </span>
        <span className="text-[14px] text-muted">{l[0]} · {l[1]} · {l[2]}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- shot */
function Shot({ lang }: { lang: string }) {
  const f = lang === "es" ? "es" : "en";
  // Viajan las dos capturas y una se oculta por tema (.only-light/.only-dark en
  // globals.css, con los mismos selectores que los tokens del tema).
  return (
    <>
      {(["light", "dark"] as const).map((t) => (
        <img
          key={t}
          src={`/showcase/forecast-${f}-${t}.webp`}
          width={1400}
          height={512}
          loading="lazy"
          decoding="async"
          alt=""
          className={`only-${t} h-auto w-full rounded-[8px] border border-rule`}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- screen */
function Screens() {
  return (
    <div className="flex justify-center gap-4">
      {["hoy", "finanzas"].map((f, i) => (
        <img
          key={f}
          src={`/tracking/${f}.webp`}
          width={393}
          height={800}
          loading="lazy"
          decoding="async"
          alt=""
          className={`block h-[320px] w-auto rounded-[14px] border border-rule object-cover object-top sm:h-[360px] ${i ? "mt-8" : ""}`}
        />
      ))}
    </div>
  );
}

export default function Preview({ card, lang }: { card: ShowcaseCard; lang: string }) {
  const l = card.vizLabels;
  switch (card.viz) {
    case "series": return <Series l={l} lang={lang} />;
    case "event":
      return (
        <div aria-hidden="true" className="[&_figcaption]:hidden [&_figure]:my-0">
          <EventStudy
            points={eventPoints}
            threshold={umbralPP}
            lang={lang}
            labels={{ y: l[0], band: l[1], pre: l[2], post: l[3], caption: "" }}
          />
        </div>
      );
    case "atlas": return <Atlas l={l} />;
    case "shot": return <Shot lang={lang} />;
    case "star": return <Star l={l} />;
    case "screen": return <Screens />;
  }
}
