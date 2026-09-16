import { TABLES, RELATIONSHIPS, measuresOf, pbiUrl, type PbiTable } from "@/lib/data/powerbi-model";

/* The semantic model as a picture: one dimension on the left, the four fact
   tables it keys on the right, the two stand-alone aggregates below a hairline.
   Every colour is a token, so the drawing re-inks itself in dark mode and in
   print. The picture never holds information the list beside it does not:
   the relationships list under it is the accessible description. */

type Labels = {
  diagramTitle: string;
  legend: { dim: string; fact: string; aggregate: string };
  headers: { measures: string; columns: string };
};

const W = 200;
const H = 64;
const DIM = { x: 40, y: 150 };
const FACT_X = 360;
const FACT_Y: Record<string, number> = { combination_analysis: 20, asset_summary: 110, fx_decomposition: 200, equity_curves: 290 };
const AGG = { y: 392, xs: { overfitting_summary: 40, leaderboard: 280 } as Record<string, number> };

function Node({ t, x, y, labels }: { t: PbiTable; x: number; y: number; labels: Labels }) {
  const n = measuresOf(t.name as (typeof TABLES)[number]["name"]).length;
  const role = labels.legend[t.role];
  const detail = n > 0 ? `${role} · ${n} ${labels.headers.measures}` : `${role} · ${t.columns.length} ${labels.headers.columns}`;
  const isDim = t.role === "dim";
  return (
    <a href={pbiUrl.table(t.name as (typeof TABLES)[number]["name"])} target="_blank" rel="noopener noreferrer">
      <g>
        <rect
          x={x}
          y={y}
          width={W}
          height={H}
          fill="var(--color-paper)"
          stroke={isDim ? "var(--color-cold)" : "var(--color-rule)"}
          strokeWidth={isDim ? 2 : 1}
          strokeDasharray={t.role === "aggregate" ? "5 4" : undefined}
        />
        <text x={x + 14} y={y + 27} fontSize={14} fontWeight={600} fill="var(--color-ink)">
          {t.name}
        </text>
        <text x={x + 14} y={y + 48} fontSize={12} fill={n > 0 ? "var(--color-cold)" : "var(--color-muted)"}>
          {detail}
        </text>
      </g>
    </a>
  );
}

export default function ModelDiagram({ labels }: { labels: Labels }) {
  const dim = TABLES.find((t) => t.role === "dim")!;
  const facts = TABLES.filter((t) => t.role === "fact");
  const aggs = TABLES.filter((t) => t.role === "aggregate");
  const dimRight = { x: DIM.x + W, y: DIM.y + H / 2 };

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 760 470"
        role="img"
        aria-labelledby="pbi-diagram-title"
        aria-describedby="pbi-relationships"
        className="w-full min-w-[640px] max-w-[760px]"
      >
        <title id="pbi-diagram-title">{labels.diagramTitle}</title>

        {/* edges: one elbow per relationship, drawn before the nodes so the boxes sit on top */}
        {RELATIONSHIPS.map((r) => {
          const y = FACT_Y[r.from] + H / 2;
          const midX = 300;
          return (
            <g key={r.name} stroke="var(--color-cold)" strokeWidth={1.5} fill="none">
              <path d={`M${dimRight.x},${dimRight.y} H${midX} V${y} H${FACT_X}`} />
            </g>
          );
        })}
        {/* cardinality: one asset, many rows */}
        <text x={dimRight.x + 6} y={dimRight.y - 6} fontSize={12} fill="var(--color-muted)">
          1
        </text>
        {RELATIONSHIPS.map((r) => (
          <text key={`${r.name}-n`} x={FACT_X - 12} y={FACT_Y[r.from] + H / 2 - 6} fontSize={12} fill="var(--color-muted)">
            n
          </text>
        ))}

        <Node t={dim} x={DIM.x} y={DIM.y} labels={labels} />
        {facts.map((t) => (
          <Node key={t.name} t={t} x={FACT_X} y={FACT_Y[t.name]} labels={labels} />
        ))}

        <line x1={40} y1={372} x2={720} y2={372} stroke="var(--color-rule)" strokeDasharray="4 6" />
        {aggs.map((t) => (
          <Node key={t.name} t={t} x={AGG.xs[t.name]} y={AGG.y} labels={labels} />
        ))}
        <text x={520} y={AGG.y + 38} fontSize={12} fill="var(--color-muted)" letterSpacing="0.08em">
          {labels.legend.aggregate.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
