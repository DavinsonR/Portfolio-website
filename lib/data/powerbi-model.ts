// ============================================================
// Catálogo del modelo semántico Power BI "Medallion Insights".
//
// Copiado a mano de market-data-medallion/powerbi/ en el commit
// 23109f5d293d1090b70d266a7c5ffe93b67072eb (2026-08-20, "fix(powerbi):
// drop the native query"). HEAD lleva los mismos archivos. Las medidas
// enlazan a ese SHA con ancla de línea para que el enlace no se mueva;
// las tablas y páginas enlazan a main. Si la carpeta cambia, se recopia:
// la página nunca descarga nada en build ni en el navegador.
//
// Grano en vez de conteos de filas: los comentarios del TMDL traen cifras
// viejas (1.347 variantes, 45 activos) y el pipeline ya va por 1.392.
// ============================================================

export type PbiRole = "dim" | "fact" | "aggregate";

export type PbiTable = {
  name: string;
  role: PbiRole;
  source: string;
  columns: readonly string[];
};

export const TABLES = [
  {
    name: "dim_assets",
    role: "dim",
    source: "silver.dim_assets",
    columns: ["symbol", "asset_class", "region", "name", "has_volume", "fx_pair"],
  },
  {
    name: "combination_analysis",
    role: "fact",
    source: "gold.mart_combination_analysis",
    columns: [
      "symbol", "strategy", "strategy_kind", "n_components", "exposure", "total_return",
      "buy_hold_return", "excess_return", "sharpe", "max_drawdown", "n_trades",
      "is_excess_return", "oos_excess_return", "oos_excess_drop", "is_exposure",
      "oos_exposure", "beat_bh_full", "beat_bh_is", "beat_bh_oos", "executed_at", "split_ts",
    ],
  },
  {
    name: "asset_summary",
    role: "fact",
    source: "gold.mart_asset_summary",
    columns: ["symbol", "asset_class", "region", "latest_close", "return_30d", "volatility_30d", "last_candle_ts", "is_stale"],
  },
  {
    name: "fx_decomposition",
    role: "fact",
    source: "gold.mart_fx_decomposition",
    columns: ["symbol", "region", "fx_pair", "window_label", "usd_return", "fx_return", "local_return", "fx_drag_pp", "adr_end_ts"],
  },
  {
    name: "equity_curves",
    role: "fact",
    source: "gold.backtest_runs ⨝ gold.backtest_equity_curves",
    columns: ["symbol", "strategy", "ts", "equity", "buy_hold_equity"],
  },
  {
    name: "overfitting_summary",
    role: "aggregate",
    source: "gold.mart_overfitting_summary",
    columns: [
      "is_grand_total", "n_components", "n_variants", "n_beat_is", "n_beat_is_and_oos",
      "oos_survival_rate", "avg_exposure", "avg_excess_return", "avg_oos_excess_drop",
    ],
  },
  {
    name: "leaderboard",
    role: "aggregate",
    source: "gold.mart_strategy_leaderboard",
    columns: [
      "strategy", "strategy_kind", "n_components", "asset_class", "region", "is_grand_total",
      "n_backtests", "n_beat_buy_hold", "beat_rate", "avg_total_return", "avg_buy_hold_return",
      "avg_excess_return", "median_sharpe", "avg_max_drawdown", "oos_survival_rate",
    ],
  },
] as const satisfies readonly PbiTable[];

export type PbiTableName = (typeof TABLES)[number]["name"];

export type PbiRelationship = { name: string; from: PbiTableName; to: "dim_assets"; column: "symbol" };

export const RELATIONSHIPS = [
  { name: "assets_to_combinations", from: "combination_analysis", to: "dim_assets", column: "symbol" },
  { name: "assets_to_summary", from: "asset_summary", to: "dim_assets", column: "symbol" },
  { name: "assets_to_fx", from: "fx_decomposition", to: "dim_assets", column: "symbol" },
  { name: "assets_to_curves", from: "equity_curves", to: "dim_assets", column: "symbol" },
] as const satisfies readonly PbiRelationship[];

export type PbiMeasure = { name: string; table: PbiTableName; dax: string; format: string; line: number };

export const MEASURES = [
  { name: "Variants Evaluated", table: "combination_analysis", dax: "COUNTROWS('combination_analysis')", format: "#,0", line: 6 },
  { name: "Winners In-Sample", table: "combination_analysis", dax: "CALCULATE([Variants Evaluated], 'combination_analysis'[beat_bh_is] = TRUE())", format: "#,0", line: 9 },
  { name: "Winners IS & OOS", table: "combination_analysis", dax: "CALCULATE([Variants Evaluated], 'combination_analysis'[beat_bh_is] = TRUE(), 'combination_analysis'[beat_bh_oos] = TRUE())", format: "#,0", line: 12 },
  { name: "OOS Survival Rate", table: "combination_analysis", dax: "DIVIDE([Winners IS & OOS], [Winners In-Sample])", format: "0.0%", line: 17 },
  { name: "Beat B&H % (full)", table: "combination_analysis", dax: "DIVIDE(CALCULATE([Variants Evaluated], 'combination_analysis'[beat_bh_full] = TRUE()), [Variants Evaluated])", format: "0.0%", line: 20 },
  { name: "Beat B&H % (OOS)", table: "combination_analysis", dax: "DIVIDE(CALCULATE([Variants Evaluated], 'combination_analysis'[beat_bh_oos] = TRUE()), [Variants Evaluated])", format: "0.0%", line: 23 },
  { name: "Avg Exposure", table: "combination_analysis", dax: "AVERAGE('combination_analysis'[exposure])", format: "0.0%", line: 26 },
  { name: "Avg Excess Return", table: "combination_analysis", dax: "AVERAGE('combination_analysis'[excess_return])", format: "+0.0%;-0.0%;0.0%", line: 29 },
  { name: "Avg OOS Excess Return", table: "combination_analysis", dax: "AVERAGE('combination_analysis'[oos_excess_return])", format: "+0.0%;-0.0%;0.0%", line: 32 },
  { name: "Median Sharpe", table: "combination_analysis", dax: "MEDIAN('combination_analysis'[sharpe])", format: "0.00", line: 35 },
  { name: "Zero-Trade Variants", table: "combination_analysis", dax: "CALCULATE([Variants Evaluated], 'combination_analysis'[n_trades] = 0)", format: "#,0", line: 38 },
  { name: "USD Return", table: "fx_decomposition", dax: "AVERAGE('fx_decomposition'[usd_return])", format: "+0.0%;-0.0%;0.0%", line: 7 },
  { name: "Local Return", table: "fx_decomposition", dax: "AVERAGE('fx_decomposition'[local_return])", format: "+0.0%;-0.0%;0.0%", line: 10 },
  { name: "FX Move", table: "fx_decomposition", dax: "AVERAGE('fx_decomposition'[fx_return])", format: "+0.0%;-0.0%;0.0%", line: 13 },
  { name: "FX Drag (pp)", table: "fx_decomposition", dax: "AVERAGE('fx_decomposition'[fx_drag_pp])", format: "+0.0%;-0.0%;0.0%", line: 16 },
  { name: "Strategy Equity", table: "equity_curves", dax: "AVERAGE('equity_curves'[equity])", format: "$#,0", line: 10 },
  { name: "Buy & Hold Equity", table: "equity_curves", dax: "AVERAGE('equity_curves'[buy_hold_equity])", format: "$#,0", line: 13 },
] as const satisfies readonly PbiMeasure[];

export type PbiMeasureName = (typeof MEASURES)[number]["name"];

export type PbiVisualType =
  | "card" | "slicer" | "tableEx" | "clusteredColumnChart" | "clusteredBarChart" | "scatterChart" | "lineChart";

export type PbiVisual = { id: string; type: PbiVisualType; title?: string; fields: readonly string[] };
export type PbiPage = { id: string; displayName: string; visuals: readonly PbiVisual[] };

export const PAGES = [
  {
    id: "verdict",
    displayName: "The Verdict",
    visuals: [
      { id: "cardVariants", type: "card", fields: ["[Variants Evaluated]"] },
      { id: "cardWinnersIS", type: "card", fields: ["[Winners In-Sample]"] },
      { id: "cardSurvivors", type: "card", fields: ["[Winners IS & OOS]"] },
      { id: "cardSurvival", type: "card", fields: ["[OOS Survival Rate]"] },
      { id: "survivalByN", type: "clusteredColumnChart", title: "Out-of-sample survival by number of combined signals", fields: ["combination_analysis.n_components", "[OOS Survival Rate]"] },
      { id: "exposureByN", type: "clusteredColumnChart", title: "Time in market collapses as signals are ANDed", fields: ["combination_analysis.n_components", "[Avg Exposure]"] },
      { id: "verdictTable", type: "tableEx", title: "The honesty funnel, row by row", fields: ["overfitting_summary.n_components", "overfitting_summary.n_variants", "overfitting_summary.n_beat_is", "overfitting_summary.n_beat_is_and_oos", "overfitting_summary.oos_survival_rate", "overfitting_summary.avg_exposure"] },
    ],
  },
  {
    id: "explorer",
    displayName: "Strategy Explorer",
    visuals: [
      { id: "slRegion", type: "slicer", fields: ["dim_assets.region"] },
      { id: "slClass", type: "slicer", fields: ["dim_assets.asset_class"] },
      { id: "slKind", type: "slicer", fields: ["combination_analysis.strategy_kind"] },
      { id: "cardBeatOOS", type: "card", fields: ["[Beat B&H % (OOS)]"] },
      { id: "scatterExposure", type: "scatterChart", title: "Exposure vs out-of-sample excess (each dot = a strategy)", fields: ["combination_analysis.strategy", "[Avg Exposure]", "[Avg OOS Excess Return]"] },
      { id: "lbTable", type: "tableEx", title: "Leaderboard (filter is_grand_total = True for the 5-strategy view)", fields: ["leaderboard.strategy", "leaderboard.n_backtests", "leaderboard.beat_rate", "leaderboard.avg_excess_return", "leaderboard.median_sharpe", "leaderboard.oos_survival_rate"] },
      { id: "comboTable", type: "tableEx", title: "Every variant", fields: ["combination_analysis.symbol", "combination_analysis.strategy", "combination_analysis.n_components", "combination_analysis.exposure", "combination_analysis.excess_return", "combination_analysis.oos_excess_return", "combination_analysis.beat_bh_oos"] },
    ],
  },
  {
    id: "fx",
    displayName: "FX Decomposition",
    visuals: [
      { id: "slWindow", type: "slicer", fields: ["fx_decomposition.window_label"] },
      { id: "cardDrag", type: "card", fields: ["[FX Drag (pp)]"] },
      { id: "dragByAdr", type: "clusteredBarChart", title: "What the currency did to the USD investor, by ADR", fields: ["fx_decomposition.symbol", "[FX Drag (pp)]"] },
      { id: "fxTable", type: "tableEx", title: "(1 + r_USD) x (1 + r_FX) = (1 + r_local)", fields: ["fx_decomposition.symbol", "fx_decomposition.fx_pair", "[USD Return]", "[Local Return]", "[FX Move]", "[FX Drag (pp)]"] },
    ],
  },
  {
    id: "curves",
    displayName: "Equity Curves",
    visuals: [
      { id: "slSymbol", type: "slicer", fields: ["dim_assets.symbol"] },
      { id: "slStrategy", type: "slicer", fields: ["equity_curves.strategy"] },
      { id: "curveChart", type: "lineChart", title: "Strategy vs buy & hold — pick one asset and one strategy", fields: ["equity_curves.ts", "[Strategy Equity]", "[Buy & Hold Equity]"] },
    ],
  },
] as const satisfies readonly PbiPage[];

export type PbiPageId = (typeof PAGES)[number]["id"];

export const VISUAL_COUNT = PAGES.reduce((n, p) => n + p.visuals.length, 0);

export const PBI_SOURCE_COMMIT = {
  sha: "23109f5d293d1090b70d266a7c5ffe93b67072eb",
  short: "23109f5",
  date: "2026-08-20",
} as const;

const REPO = "https://github.com/DavinsonR/market-data-medallion";
const BLOB = `${REPO}/blob/main/powerbi`;
const TREE = `${REPO}/tree/main/powerbi`;
const PIN = `${REPO}/blob/${PBI_SOURCE_COMMIT.sha}/powerbi`;

export const pbiUrl = {
  repo: REPO,
  folder: TREE,
  commit: `${REPO}/commit/${PBI_SOURCE_COMMIT.sha}`,
  pbip: `${BLOB}/MedallionInsights.pbip`,
  readme: `${BLOB}/README.md`,
  relationships: `${BLOB}/MedallionInsights.SemanticModel/definition/relationships.tmdl`,
  tablesDir: `${TREE}/MedallionInsights.SemanticModel/definition/tables`,
  pagesDir: `${TREE}/MedallionInsights.Report/definition/pages`,
  table: (t: PbiTableName) => `${BLOB}/MedallionInsights.SemanticModel/definition/tables/${t}.tmdl`,
  measure: (m: PbiMeasure) =>
    `${PIN}/MedallionInsights.SemanticModel/definition/tables/${m.table}.tmdl#L${m.line}`,
  page: (p: PbiPageId) => `${BLOB}/MedallionInsights.Report/definition/pages/${p}/page.json`,
  visual: (p: PbiPageId, v: string) =>
    `${BLOB}/MedallionInsights.Report/definition/pages/${p}/visuals/${v}/visual.json`,
};

export const measuresOf = (t: PbiTableName) => MEASURES.filter((m) => m.table === t);
