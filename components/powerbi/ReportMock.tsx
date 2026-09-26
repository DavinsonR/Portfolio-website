// ============================================================
// Las cuatro páginas del informe, dibujadas (auditoría de diseño DP-02).
//
// La página de Power BI no enseñaba el informe: solo un inventario de visuales
// leído del PBIR. Hasta que existan las capturas exportadas desde Power BI
// Desktop (public/powerbi/<página>.png, que `reportShot` detecta solo y
// sustituye a esta maqueta), cada página se dibuja aquí con la MISMA
// disposición del PBIR y los MISMOS datos que el modelo lee del warehouse:
// la instantánea del índice y la serie de SPY que el sitio ya versiona. Los
// títulos de los visuales son los del PBIR, tal cual, en inglés.
//
// Componente de servidor: SVG ya pintado, sin JavaScript.
// ============================================================
import type { PbiPageId } from "@/lib/data/powerbi-model";
import { labSnapshotData } from "@/lib/data/lab-snapshot";
import serie from "@/public/trading-sim-snapshot/showcase-series.json";

const nf = (lang: string, d = 0) =>
  new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (lang: string, v: number, d = 1) =>
  new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { style: "percent", minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

function Card({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[6px] border border-rule bg-paper px-3 py-2.5">
      <p className="font-figure text-[22px] leading-none text-ink">{value}</p>
      <p className="mt-1 text-[12px] text-muted">{label}</p>
    </div>
  );
}

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] border border-rule bg-paper p-3">
      <p className="mb-2 text-[14px] font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}

/* barras verticales simples, en SVG */
function Columns({ rows, fmt }: { rows: { k: string; v: number }[]; fmt: (v: number) => string }) {
  const max = Math.max(...rows.map((r) => r.v), 0.0001);
  const W = 300, H = 130, bw = W / rows.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 34}`} className="block h-auto w-full" aria-hidden="true">
      {rows.map((r, i) => {
        const h = (H - 16) * (r.v / max);
        return (
          <g key={r.k}>
            <rect x={i * bw + bw * 0.2} y={H - h} width={bw * 0.6} height={h} rx="2" className="fill-cold" />
            <text x={i * bw + bw / 2} y={H - h - 4} textAnchor="middle" className="fill-ink text-[11px]">{fmt(r.v)}</text>
            <text x={i * bw + bw / 2} y={H + 16} textAnchor="middle" className="fill-muted text-[11px]">{r.k}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Verdict({ lang }: { lang: string }) {
  const o = labSnapshotData.overfitting!;
  const t = o.overall!;
  const by = (o.by_n_components ?? []).filter((r) => !r.is_grand_total);
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card value={nf(lang).format(t.n_variants)} label="Variants Evaluated" />
        <Card value={nf(lang).format(t.n_beat_is)} label="Winners In-Sample" />
        <Card value={nf(lang).format(t.n_beat_is_and_oos)} label="Winners IS & OOS" />
        <Card value={pct(lang, t.oos_survival_rate ?? 0)} label="OOS Survival Rate" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tile title="Out-of-sample survival by number of combined signals">
          <Columns rows={by.map((r) => ({ k: String(r.n_components), v: r.oos_survival_rate ?? 0 }))} fmt={(v) => pct(lang, v, 0)} />
        </Tile>
        <Tile title="Time in market collapses as signals are ANDed">
          <Columns rows={by.map((r) => ({ k: String(r.n_components), v: r.avg_exposure ?? 0 }))} fmt={(v) => pct(lang, v, 0)} />
        </Tile>
      </div>
    </div>
  );
}

function Explorer({ lang }: { lang: string }) {
  const pts = labSnapshotData.assets.flatMap((a) => a.combinations ?? []).filter((c) => c.oos_excess_return != null);
  const W = 420, H = 200, P = 28;
  const ys = pts.map((p) => p.oos_excess_return as number);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const x = (v: number) => P + (W - 2 * P) * v;
  const y = (v: number) => H - P - (H - 2 * P) * ((v - y0) / (y1 - y0 || 1));
  const lb = labSnapshotData.leaderboard.filter((r) => r.is_grand_total && r.strategy_kind === "single").sort((a, b) => (b.beat_rate ?? 0) - (a.beat_rate ?? 0));
  return (
    <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
      <Tile title="Exposure vs out-of-sample excess (each dot = a strategy)">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
          <line x1={P} x2={W - P} y1={y(0)} y2={y(0)} className="stroke-muted" strokeDasharray="3 3" />
          {pts.map((p, i) => (
            <circle key={i} cx={x(p.exposure ?? 0)} cy={y(p.oos_excess_return as number)} r="2.6" className={p.beat_bh_oos ? "fill-cold" : "fill-control/50"} />
          ))}
          <text x={W - P} y={H - 8} textAnchor="end" className="fill-muted text-[11px]">[Avg Exposure] →</text>
        </svg>
      </Tile>
      <Tile title="Leaderboard (the 5 strategies)">
        <table className="w-full text-[12px]">
          <tbody>
            {lb.map((r) => (
              <tr key={r.strategy} className="border-t border-rulesoft">
                <td className="py-1.5 text-ink">{r.strategy}</td>
                <td className="py-1.5 text-right text-body">{pct(lang, r.beat_rate ?? 0, 0)}</td>
                <td className="py-1.5 text-right text-muted">{nf(lang, 2).format(r.median_sharpe ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tile>
    </div>
  );
}

function Fx({ lang }: { lang: string }) {
  const rows = (labSnapshotData.fx_decomposition ?? [])
    .filter((r) => r.window_label === "365d")
    .map((r) => ({ symbol: r.symbol, fx_drag_pp: r.fx_drag_pp ?? 0 }))
    .sort((a, b) => b.fx_drag_pp - a.fx_drag_pp);
  const max = Math.max(...rows.map((r) => Math.abs(r.fx_drag_pp)));
  const avg = rows.reduce((n, r) => n + r.fx_drag_pp, 0) / rows.length;
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
      <div className="grid content-start gap-3">
        <Card value={`${nf(lang, 1).format(avg * 100)} pp`} label="FX Drag (pp) · 365d" />
        <div className="flex flex-wrap gap-1.5">
          {["30d", "90d", "365d", "full"].map((w) => (
            <span key={w} className={`rounded-[4px] border px-2 py-0.5 text-[12px] ${w === "365d" ? "border-cold bg-cold text-paper" : "border-rule text-muted"}`}>{w}</span>
          ))}
        </div>
      </div>
      <Tile title="What the currency did to the USD investor, by ADR">
        <div className="grid gap-1">
          {rows.map((r) => (
            <div key={r.symbol} className="grid grid-cols-[44px_1fr_52px] items-center gap-2 text-[12px]">
              <span className="text-ink">{r.symbol}</span>
              <span className="h-2.5 rounded-[2px] bg-rulesoft">
                <span className={`block h-full rounded-[2px] ${r.fx_drag_pp >= 0 ? "bg-cold" : "bg-neg"}`} style={{ width: `${(Math.abs(r.fx_drag_pp) / max) * 100}%` }} />
              </span>
              <span className="text-right text-muted">{nf(lang, 1).format(r.fx_drag_pp * 100)}</span>
            </div>
          ))}
        </div>
      </Tile>
    </div>
  );
}

function Curves() {
  const W = 620, H = 200, P = 12;
  const s = serie.strategies.find((x) => x.strategy === "fibonacci") ?? serie.strategies[0];
  const all = [...serie.buyHold, ...s.equity];
  const lo = Math.min(...all), hi = Math.max(...all), n = serie.dates.length;
  const x = (i: number) => P + ((W - 2 * P) * i) / (n - 1);
  const y = (v: number) => P + (H - 2 * P) * (1 - (v - lo) / (hi - lo));
  const d = (v: number[]) => v.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join("");
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {[serie.symbol, s.strategy].map((v) => (
          <span key={v} className="rounded-[4px] border border-rule bg-paper px-2.5 py-1 text-[12px] text-ink">{v} ▾</span>
        ))}
      </div>
      <Tile title="Strategy vs buy & hold — pick one asset and one strategy">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
          <path d={d(serie.buyHold)} className="fill-none stroke-ink" strokeWidth="2" />
          <path d={d(s.equity)} className="fill-none stroke-cold" strokeWidth="2" />
        </svg>
        <p className="mt-1 text-[12px] text-muted">— [Buy &amp; Hold Equity] · <span className="text-cold">— [Strategy Equity]</span></p>
      </Tile>
    </div>
  );
}

export default function ReportMock({ page, lang, pages, note }: {
  page: PbiPageId; lang: string; pages: { id: PbiPageId; name: string }[]; note: string;
}) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-[12px] border border-rule bg-band">
        <div className="flex items-center justify-between border-b border-rule bg-paper px-4 py-2">
          <span className="text-[12.5px] font-semibold text-ink">Medallion Insights</span>
          <span className="text-[12px] text-muted">Power BI · PBIP</span>
        </div>
        <div className="p-3 sm:p-4">
          {page === "verdict" && <Verdict lang={lang} />}
          {page === "explorer" && <Explorer lang={lang} />}
          {page === "fx" && <Fx lang={lang} />}
          {page === "curves" && <Curves />}
        </div>
        <div className="flex flex-wrap gap-px border-t border-rule bg-rule">
          {pages.map((p) => (
            <span key={p.id} className={`px-3 py-1.5 text-[12px] ${p.id === page ? "bg-paper font-semibold text-cold" : "bg-band text-muted"}`}>{p.name}</span>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-[14px] text-muted">{note}</figcaption>
    </figure>
  );
}
