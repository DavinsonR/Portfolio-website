// ============================================================
// TRADING SIM — tipos y acceso a datos
// El sitio sigue siendo 100% estático: estos JSON viven en el
// repo público del pipeline (market-data-medallion) y se leen
// client-side desde raw.githubusercontent.com. Cero backend.
// ============================================================

export const TRADING_SIM_REPO = "https://github.com/DavinsonR/market-data-medallion";

const RAW = "https://raw.githubusercontent.com/DavinsonR/market-data-medallion/main/exports";
export const INDEX_URL = `${RAW}/index.json`;
export const symbolUrl = (symbol: string) => `${RAW}/backtests/${encodeURIComponent(symbol)}.json`;

/** Lectura con tiempo límite.
 *
 *  Sin él, una red corporativa que bloquea raw.githubusercontent.com sin cerrar
 *  la conexión deja el panel en "cargando…" para siempre — el peor estado
 *  posible, porque parece que el sitio está roto sin decirlo. Con límite, la
 *  página muestra el error y ofrece reintentar. */
export async function fetchJson<T>(url: string, timeoutMs = 12000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---- formas del export (deben calzar con pipeline/export.py) ----

export type OverfittingRow = {
  is_grand_total: boolean;
  n_components: number | null;
  n_variants: number;
  n_beat_is: number;
  n_beat_is_and_oos: number;
  share_beat_oos: number | null;
  oos_survival_rate: number | null;
  avg_exposure: number | null;
};

export type LeaderboardRow = {
  strategy: string;
  strategy_kind: string;
  n_components: number;
  asset_class: string;
  region: string;
  is_grand_total: boolean;
  n_backtests: number;
  n_beat_buy_hold: number;
  beat_rate: number | null;
  avg_total_return: number | null;
  avg_buy_hold_return: number | null;
  avg_excess_return: number | null;
  median_sharpe: number | null;
};

export type AssetStrategy = {
  strategy: string;
  total_return: number | null;
  buy_hold_return: number | null;
  excess_return: number | null;
  max_drawdown: number | null;
  sharpe: number | null;
  n_trades: number | null;
  win_rate: number | null;
};

export type AssetCombo = {
  strategy: string;
  n_components: number;
  exposure: number | null;
  total_return: number | null;
  buy_hold_return: number | null;
  excess_return: number | null;
  is_excess_return: number | null;
  oos_excess_return: number | null;
  beat_bh_full: boolean | null;
  beat_bh_oos: boolean | null;
  sharpe: number | null;
  max_drawdown: number | null;
  n_trades: number | null;
};

export type AssetSummary = {
  latest_close: number | null;
  return_30d: number | null;
  volatility_30d: number | null;
  last_candle_ts: string | null;
  is_stale: boolean | null;
};

export type IndexAsset = {
  symbol: string;
  name: string;
  asset_class: "crypto" | "equity" | "fx";
  region: string;
  fx_pair?: string | null;
  summary: AssetSummary | null;
  strategies: AssetStrategy[];
  combinations?: AssetCombo[];
  n_combinations?: number;
};

export type IngestRun = {
  source: string;
  symbol: string;
  status: string;
  rows_fetched: number | null;
  rows_inserted: number | null;
  finished_at: string | null;
};

export type FxDecompRow = {
  symbol: string;
  fx_pair: string;
  region?: string;
  window_label: string;
  usd_return: number | null;
  fx_return: number | null;
  local_return: number | null;
  fx_drag_pp: number | null;
};

export type IndexData = {
  generated_at: string;
  assets: IndexAsset[];
  leaderboard: LeaderboardRow[];
  overfitting?: { by_n_components?: OverfittingRow[]; overall?: OverfittingRow } | null;
  fx_decomposition?: FxDecompRow[] | null;
  pipeline: {
    recent_ingest_runs: IngestRun[];
    totals: { assets: number; backtests: number; bronze_rows: number; sources: number };
  };
};

export type SymbolBacktest = {
  strategy: string;
  params: Record<string, unknown>;
  metrics: {
    total_return: number | null;
    cagr: number | null;
    buy_hold_return: number | null;
    max_drawdown: number | null;
    sharpe: number | null;
    win_rate: number | null;
    excess_return: number | null;
    n_trades: number | null;
    n_bars: number | null;
  };
  equity_curve: [string, number, number][]; // [fecha ISO, equity, buy & hold]
};

export type SymbolData = {
  symbol: string;
  name: string;
  asset_class: string;
  region: string;
  generated_at: string;
  split_ts?: string | null;
  backtests: SymbolBacktest[];
  combinations?: AssetCombo[];
};

// ---- formato de números (ES usa coma decimal) ----

const locale = (lang: string) => (lang === "es" ? "es-CO" : "en-US");

export function pct(lang: string, v: number | null | undefined, digits = 1, signed = false): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat(locale(lang), {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(v);
}

export function num(lang: string, v: number | null | undefined, digits = 2): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat(locale(lang), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
}

export function money(lang: string, v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat(locale(lang), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: v >= 1000 ? 0 : 2,
  }).format(v);
}

export function compactMoney(lang: string, v: number): string {
  return new Intl.NumberFormat(locale(lang), {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);
}
