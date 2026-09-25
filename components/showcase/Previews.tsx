// ============================================================
// Las vistas previas de la vitrina de la portada. Una por proyecto, dibujada
// en el servidor como SVG: cero JavaScript, cero peticiones, y el mismo token
// de color que el resto de la hoja, así que el tema oscuro sale gratis.
//
// Ninguna cifra de aquí se inventa: cada gráfico dibuja un dato que ya está
// publicado en la página del proyecto (el embudo sale de la instantánea del
// laboratorio; el pronóstico, del resumen que publica el propio laboratorio).
// ============================================================
import type { ShowcaseCard } from "@/lib/content/types";
import type { LabStats } from "@/lib/data/lab-stats";
import resumen from "@/public/forecast-lab/resumen.json";
import LabText from "@/components/trading/LabText";

const VB = "0 0 320 180";
const svgClass = "block h-full w-full";
const label = "fill-muted text-[12px] font-semibold tracking-[0.06em]";

/* credit-risk: la pérdida evitada por el modelo contra el rechazo al azar.
   La razón 2,15 es la del repositorio (exports/web/resumen.json). */
function Credit({ l }: { l: string[] }) {
  const RATIO = 2.15;
  const full = 272;
  return (
    <svg viewBox={VB} className={svgClass} role="presentation" aria-hidden="true">
      <text x="24" y="50" className="fill-cold font-figure text-[46px] font-semibold">{l[3]}</text>
      <text x="24" y="72" className="fill-ink text-[12.5px] font-semibold">{l[2]}</text>
      <text x="24" y="100" className={label}>{l[0]}</text>
      <rect x="24" y="106" width={full / RATIO} height="20" rx="2" className="fill-control/60" />
      <text x="24" y="146" className={label}>{l[1]}</text>
      <rect x="24" y="152" width={full} height="20" rx="2" className="fill-cold" />
    </svg>
  );
}

/* market-data-medallion: el embudo de la honestidad, con las cifras de la
   instantánea que el build lee (lib/data/lab-snapshot.ts). */
function Funnel({ l, lab, lang }: { l: string[]; lab: LabStats; lang: string }) {
  // Los números van por LabText, igual que la cifra grande de la tarjeta: si el
  // navegador trae el índice vivo, los dos se actualizan juntos y no se
  // contradicen (el ancho de las barras se queda con la instantánea del build).
  const rows = [
    { v: lab.variants, k: "{variants}", t: l[0], c: "fill-control/50" },
    { v: lab.beatIs, k: "{beatIs}", t: l[1], c: "fill-cold/55" },
    { v: lab.survivors, k: "{survivors}", t: l[2], c: "fill-cold" },
  ];
  const W = 272;
  return (
    <svg viewBox={VB} className={svgClass} role="presentation" aria-hidden="true">
      {rows.map((r, i) => {
        // Raíz cuadrada: a escala lineal los 51 serían una raya invisible.
        // El rótulo va encima de la barra y no dentro: sobre el azul lleno no se lee.
        const w = Math.max(18, W * Math.sqrt(r.v / lab.variants));
        const y = 30 + i * 54;
        return (
          <g key={r.t}>
            <text x="160" y={y} textAnchor="middle" className="fill-ink text-[13px] font-bold">
              <LabText template={r.k} initial={lab} lang={lang} /> <tspan className="fill-muted font-medium">{r.t}</tspan>
            </text>
            <rect x={(320 - w) / 2} y={y + 7} width={w} height="20" rx="2" className={r.c} />
          </g>
        );
      })}
    </svg>
  );
}

/* Power BI: la estrella del modelo semántico — una dimensión, cuatro hechos
   relacionados y dos agregados sueltos (así lo dibuja la página del informe). */
function Star({ l }: { l: string[] }) {
  const facts = [
    [70, 38], [250, 38], [70, 142], [250, 142],
  ];
  return (
    <svg viewBox={VB} className={svgClass} role="presentation" aria-hidden="true">
      {facts.map(([x, y]) => (
        <line key={`${x}${y}`} x1="160" y1="90" x2={x} y2={y} className="stroke-cold/60" strokeWidth="1.5" />
      ))}
      {facts.map(([x, y]) => (
        <rect key={`r${x}${y}`} x={x - 34} y={y - 13} width="68" height="26" rx="2" className="fill-coldsoft stroke-cold" strokeWidth="1.2" />
      ))}
      <rect x="112" y="74" width="96" height="32" rx="2" className="fill-cold" />
      <text x="160" y="95" textAnchor="middle" className="fill-paper text-[12px] font-bold">{l[0]}</text>
      <text x="70" y="16" textAnchor="middle" className={label}>{l[1]}</text>
      <rect x="224" y="78" width="30" height="24" rx="2" className="fill-none stroke-control" strokeDasharray="3 3" />
      <rect x="262" y="78" width="30" height="24" rx="2" className="fill-none stroke-control" strokeDasharray="3 3" />
      <text x="258" y="118" textAnchor="middle" className={label}>{l[2]}</text>
    </svg>
  );
}

/* Pronóstico: el error de cada modelo sobre el del ingenuo (mediana, años de
   calma). Por debajo de 1 le gana. Datos: public/forecast-lab/resumen.json. */
type Fila = { modelo: string; id: string | null; calma: { mediana: number } };
// Nombre corto para que quepa a la izquierda de la barra; el completo está en el laboratorio.
const CORTO: Record<string, string> = { ar1: "AR(1)", arima: "ARIMA", lstm: "LSTM", rf: "Random Forest", comb: "Combinado" };
const IDS = Object.keys(CORTO);
const filas = ((resumen as unknown as { agregado: { anual: Fila[] } }).agregado.anual)
  .filter((f) => f.id && IDS.includes(f.id))
  .sort((a, b) => a.calma.mediana - b.calma.mediana);

function Forecast({ l, lang }: { l: string[]; lang: string }) {
  const n = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const x0 = 110;
  const scale = 170; // 1,0 = 170 px
  const one = x0 + scale;
  return (
    <svg viewBox={VB} className={svgClass} role="presentation" aria-hidden="true">
      {filas.map((f, i) => {
        const y = 14 + i * 28;
        const win = f.calma.mediana < 1;
        return (
          <g key={f.modelo}>
            <text x={x0 - 8} y={y + 15} textAnchor="end" className="fill-ink text-[12px] font-semibold">{CORTO[f.id!]}</text>
            <rect x={x0} y={y + 3} width={scale * f.calma.mediana} height="16" rx="2" className={win ? "fill-cold" : "fill-control/60"} />
            <text x={x0 + scale * f.calma.mediana + 4} y={y + 15} className="fill-muted text-[11px]">{n.format(f.calma.mediana)}</text>
          </g>
        );
      })}
      <line x1={one} y1="8" x2={one} y2="156" className="stroke-warm" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={one} y="172" textAnchor="middle" className="fill-warm text-[12px] font-semibold">{l[1]}</text>
    </svg>
  );
}

/* Tesis: 32 departamentos, en rojo los que quedan bajo la línea base de 2018.
   17 de 32 en 2018 y 1 de 32 en 2025 (la tabla de deriva de /historia). */
function Dots({ l }: { l: string[] }) {
  const grid = (ox: number, below: number) =>
    Array.from({ length: 32 }, (_, i) => (
      <circle
        key={i}
        cx={ox + (i % 8) * 16}
        cy={52 + Math.floor(i / 8) * 16}
        r="5.5"
        className={i < below ? "fill-neg" : "fill-cold"}
      />
    ));
  return (
    <svg viewBox={VB} className={svgClass} role="presentation" aria-hidden="true">
      <text x="24" y="32" className="fill-ink text-[14px] font-bold">{l[0]}</text>
      <text x="184" y="32" className="fill-ink text-[14px] font-bold">{l[1]}</text>
      {grid(30, 17)}
      {grid(190, 1)}
      <circle cx="30" cy="163" r="5.5" className="fill-neg" />
      <text x="42" y="167" className={label}>{l[2]}</text>
    </svg>
  );
}

export default function Preview({ card, lab, lang }: { card: ShowcaseCard; lab: LabStats; lang: string }) {
  const l = card.vizLabels;
  switch (card.viz) {
    case "credit": return <Credit l={l} />;
    case "funnel": return <Funnel l={l} lab={lab} lang={lang} />;
    case "star": return <Star l={l} />;
    case "forecast": return <Forecast l={l} lang={lang} />;
    case "dots": return <Dots l={l} />;
    case "screen":
      // Dos pantallas reales del demo. <img> y no next/image: el sitio es
      // estático y las capturas ya son WebP a su tamaño (mismo criterio que la
      // página de JARVIS).
      return (
        <div className="flex h-full justify-center gap-3">
          {["hoy", "finanzas"].map((f) => (
            <img
              key={f}
              src={`/tracking/${f}.webp`}
              width={393}
              height={800}
              loading="lazy"
              decoding="async"
              alt=""
              className="block h-full w-auto rounded-t-[6px] border border-b-0 border-rule object-cover object-top"
            />
          ))}
        </div>
      );
  }
}
