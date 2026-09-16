"use client";

// ============================================================
// TRADING SIM — dashboard interactivo.
// Lee los JSON publicados por el pipeline (market-data-medallion)
// desde raw.githubusercontent.com, client-side. El sitio sigue
// siendo estático; los datos se refrescan solos con el cron diario.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import {
  INDEX_URL,
  TRADING_SIM_REPO,
  symbolUrl,
  fetchJson,
  pct,
  num,
  type IndexData,
  type IndexAsset,
  type SymbolData,
  type AssetCombo,
} from "@/lib/data/trading-sim";
import { EquityChart, Funnel, HBars, CHART } from "@/components/trading/Charts";

type Dict = Dictionary["tradingSim"];

const REGION_ORDER = ["global", "us", "latam", "emerging"] as const;

export default function TradingSimDashboard({ dict, lang }: { dict: Dict; lang: string }) {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [indexError, setIndexError] = useState(false);
  const [symbol, setSymbol] = useState("BTC-USD");
  const [strategy, setStrategy] = useState("macd");
  const [fetchedSymbol, setFetchedSymbol] = useState<SymbolData | null>(null);
  const [symbolCache] = useState(() => new Map<string, SymbolData>());
  const [symbolLoading, setSymbolLoading] = useState(false);

  // Un acierto de caché es un valor derivable en el render: copiarlo a estado con
  // un efecto provocaba un segundo render por cada cambio de activo.
  const symbolData: SymbolData | null =
    symbolCache.get(symbol) ?? (fetchedSymbol?.symbol === symbol ? fetchedSymbol : null);

  const loadIndex = useCallback(() => {
    fetchJson<IndexData>(INDEX_URL)
      .then((d) => setIndex(d))
      .catch(() => setIndexError(true));
  }, []);

  // El botón de reintentar sí puede limpiar el error: viene de un clic, no del montaje.
  const retryIndex = useCallback(() => {
    setIndexError(false);
    loadIndex();
  }, [loadIndex]);

  useEffect(loadIndex, [loadIndex]);

  useEffect(() => {
    if (symbolCache.has(symbol)) return;
    let alive = true;
    // Marcar "cargando" antes de disparar la petición es el arranque de un trabajo
    // externo, no un valor derivable: sin esto el panel se queda con el activo
    // anterior en pantalla mientras llega el nuevo, sin decir que está cargando.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSymbolLoading(true);
    fetchJson<SymbolData>(symbolUrl(symbol))
      .then((d) => {
        symbolCache.set(symbol, d);
        if (alive) setFetchedSymbol(d);
      })
      .catch(() => alive && setFetchedSymbol(null))
      .finally(() => alive && setSymbolLoading(false));
    return () => {
      alive = false;
    };
  }, [symbol, symbolCache]);

  // ---- derivados del índice ----
  const funnel = useMemo(() => {
    const rows = index?.overfitting?.by_n_components ?? [];
    // The export carries the grand total under its own `overall` key; older
    // shapes kept it as a flagged row inside the array. Accept both, so a
    // schema change upstream degrades to stale-but-correct, never to dashes.
    const total = index?.overfitting?.overall ?? rows.find((r) => r.is_grand_total);
    const byN = rows.filter((r) => !r.is_grand_total && r.n_components != null);
    return { total, byN };
  }, [index]);

  const singlesLeaderboard = useMemo(
    () =>
      (index?.leaderboard ?? [])
        .filter((r) => r.is_grand_total && r.strategy_kind === "single")
        .sort((a, b) => (b.avg_excess_return ?? -9) - (a.avg_excess_return ?? -9)),
    [index]
  );

  const fx365 = useMemo(
    () =>
      (index?.fx_decomposition ?? [])
        .filter((r) => r.window_label === "365d" && r.usd_return != null)
        .sort((a, b) => (b.fx_drag_pp ?? -9) - (a.fx_drag_pp ?? -9)),
    [index]
  );

  const assetGroups = useMemo(() => {
    const withData = (index?.assets ?? []).filter((a) => a.summary);
    return REGION_ORDER.map((region) => ({
      region,
      assets: withData.filter((a) => a.region === region),
    })).filter((g) => g.assets.length > 0);
  }, [index]);

  const currentBacktest = useMemo(
    () => symbolData?.backtests.find((b) => b.strategy === strategy) ?? symbolData?.backtests[0] ?? null,
    [symbolData, strategy]
  );

  const combos = useMemo<AssetCombo[]>(() => {
    const list = symbolData?.combinations ?? [];
    return [...list].sort(
      (a, b) => (b.oos_excess_return ?? -Infinity) - (a.oos_excess_return ?? -Infinity)
    );
  }, [symbolData]);

  /* ---- estados de carga ----
     El sistema quitó las tarjetas de las tres superficies durante la revisión y
     llama defecto a un contenedor con borde, redondeado y flotando sobre un
     fondo teñido. Estos dos eran justamente eso, y el de error es el que **se
     ve** cuando `raw.githubusercontent.com` está bloqueado — la red de un banco
     o una aseguradora, es decir, el lector de más valor de esta página. Pasan a
     ser bloques abiertos: regla de 2px arriba, fondo de banda, esquinas rectas.
     `animate-pulse` también sale: es un esqueleto de aplicación web y aquí el
     registro es la imprenta — una hoja no palpita. */
  if (indexError)
    return (
      <div className="border-t-2 border-ink bg-band px-5 py-8 text-center">
        <p className="text-[14px] text-body">{dict.error}</p>
        <button
          onClick={retryIndex}
          className="mt-4 rounded-[3px] border border-control px-4 py-2 text-[14px] transition-colors hover:border-cold hover:text-cold"
        >
          {dict.retry}
        </button>
      </div>
    );

  if (!index)
    return (
      <div className="border-t-2 border-ink bg-band px-5 py-8">
        <p className="text-[14px] text-muted">{dict.loading}</p>
        <div className="mt-4 space-y-2.5">
          {[80, 60, 72].map((w, i) => (
            <div key={i} className="h-[14px] bg-rule" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );

  const total = funnel.total;
  const generated = index.generated_at?.slice(0, 10);

  return (
    <div className="space-y-14">
      {/* ============ 1. EL VEREDICTO — stat tiles + embudo ============ */}
      <section aria-labelledby="ts-verdict">
        <div className="mb-8 grid grid-cols-2 border-t-2 border-cold lg:grid-cols-4">
          {[
            { label: dict.stats.variants, value: num(lang, total?.n_variants ?? null, 0) },
            { label: dict.stats.beatIs, value: num(lang, total?.n_beat_is ?? null, 0) },
            { label: dict.stats.survivors, value: num(lang, total?.n_beat_is_and_oos ?? null, 0) },
            { label: dict.stats.survival, value: pct(lang, total?.oos_survival_rate ?? null, 1), hero: true },
          ].map((s) => (
            <div key={s.label} className="border-t border-rule pt-5">
              <p className="text-[12.5px] tracking-[0.1em] uppercase text-muted">{s.label}</p>
              <p className={`font-display font-medium text-ink mt-2 ${s.hero ? "text-[34px]" : "text-[26px]"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-rule pt-7">
          <h3 id="ts-verdict" className="font-display text-[18px] font-medium text-ink mb-1.5">{dict.funnel.title}</h3>
          <p className="text-[14px] leading-[1.7] max-w-[620px] mb-6">{dict.funnel.desc}</p>
          <Funnel
            stages={[
              { label: dict.funnel.stageAll, value: total?.n_variants ?? 0, display: num(lang, total?.n_variants ?? 0, 0) },
              { label: dict.funnel.stageIs, value: total?.n_beat_is ?? 0, display: num(lang, total?.n_beat_is ?? 0, 0) },
              { label: dict.funnel.stageBoth, value: total?.n_beat_is_and_oos ?? 0, display: num(lang, total?.n_beat_is_and_oos ?? 0, 0) },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. SUPERVIVENCIA Y EXPOSICIÓN por nº de señales ============ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border-t border-rule pt-7">
          <h3 className="font-display text-[16.5px] font-medium text-ink mb-1.5">{dict.survivalChart.title}</h3>
          <p className="text-[14px] leading-[1.65] mb-6">{dict.survivalChart.desc}</p>
          <HBars
            max={0.2}
            rows={funnel.byN.map((r) => ({
              label: `${r.n_components} ${r.n_components === 1 ? dict.signalOne : dict.signalMany}`,
              value: r.oos_survival_rate ?? 0,
              display: r.oos_survival_rate == null ? dict.exposureChart.never : pct(lang, r.oos_survival_rate, 1),
            }))}
          />
        </div>
        <div className="border-t border-rule pt-7">
          <h3 className="font-display text-[16.5px] font-medium text-ink mb-1.5">{dict.exposureChart.title}</h3>
          <p className="text-[14px] leading-[1.65] mb-6">{dict.exposureChart.desc}</p>
          <HBars
            max={0.45}
            rows={funnel.byN.map((r) => ({
              label: `${r.n_components} ${r.n_components === 1 ? dict.signalOne : dict.signalMany}`,
              value: r.avg_exposure ?? 0,
              display: pct(lang, r.avg_exposure, 1),
              note: (r.avg_exposure ?? 0) === 0 ? dict.exposureChart.never : undefined,
            }))}
          />
        </div>
      </section>

      {/* ============ 3. EXPLORADOR — 45 activos, curvas reales ============ */}
      <section className="border-t-2 border-ink bg-band">
        <div className="flex items-center gap-2 border-b border-rule bg-band px-4 py-3">
          <span className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
            {dict.explorer.windowTitle} — {symbol}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <label className="text-[12.5px] text-muted uppercase tracking-[0.1em]" htmlFor="ts-asset">
              {dict.explorer.assetLabel}
            </label>
            <select
              id="ts-asset"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded-[3px] border border-control bg-paper px-3 py-2 text-[14px] text-ink focus:border-cold"
            >
              {assetGroups.map((g) => (
                <optgroup key={g.region} label={dict.regions[g.region as keyof Dict["regions"]] ?? g.region}>
                  {g.assets.map((a: IndexAsset) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Esto era role="tablist" + role="tab" sin aria-controls, sin tabpanel,
              sin roving tabindex y sin flechas: el lector anunciaba "pestaña 1 de N",
              el usuario pulsaba las flechas y no pasaba nada. Son botones que
              alternan un estado, y aria-pressed es exactamente eso. */}
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={dict.explorer.strategyLabel}>
            {(symbolData?.backtests ?? []).map((b) => (
              <button
                key={b.strategy}
                type="button"
                aria-pressed={b.strategy === (currentBacktest?.strategy ?? "")}
                onClick={() => setStrategy(b.strategy)}
                className={`text-[14px] px-3.5 py-1.5 rounded-[3px] border transition-colors ${
                  b.strategy === (currentBacktest?.strategy ?? "")
                    ? "border-cold text-paper bg-cold font-semibold"
                    : "border-control text-body hover:border-cold hover:text-ink"
                }`}
              >
                {b.strategy}
              </button>
            ))}
          </div>

          {symbolLoading && <p className="py-16 text-center text-[14px] text-muted">{dict.loading}</p>}

          {!symbolLoading && currentBacktest && (
            <>
              {/* leyenda: obligatoria con 2 series */}
              <div className="flex items-center gap-5 mb-3 text-[14px]">
                <span className="flex items-center gap-2 text-ink">
                  <span className="inline-block h-[2px] w-5" style={{ background: CHART.series }} />
                  {currentBacktest.strategy}
                </span>
                <span className="flex items-center gap-2 text-body">
                  <span className="inline-block w-5 border-t-2 border-dashed" style={{ borderColor: CHART.benchmark }} />
                  {dict.explorer.benchmark}
                </span>
              </div>

              <EquityChart
                points={currentBacktest.equity_curve}
                lang={lang}
                splitDate={symbolData?.split_ts ?? null}
                labels={{
                  strategy: currentBacktest.strategy,
                  benchmark: dict.explorer.benchmark,
                  split: dict.explorer.splitMarker,
                  tableToggle: dict.explorer.tableToggle,
                  date: dict.explorer.date,
                }}
              />

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: dict.metrics.ret, v: pct(lang, currentBacktest.metrics.total_return, 1, true) },
                  { label: dict.metrics.bh, v: pct(lang, currentBacktest.metrics.buy_hold_return, 1, true) },
                  { label: dict.metrics.dd, v: pct(lang, currentBacktest.metrics.max_drawdown, 1) },
                  { label: dict.metrics.sharpe, v: num(lang, currentBacktest.metrics.sharpe, 2) },
                  { label: dict.metrics.trades, v: num(lang, currentBacktest.metrics.n_trades, 0) },
                  { label: dict.metrics.win, v: pct(lang, currentBacktest.metrics.win_rate, 0) },
                ].map((m) => (
                  <div key={m.label} className="border-t border-rule pt-2">
                    <p className="text-[12.5px] uppercase tracking-[0.08em] text-muted">{m.label}</p>
                    <p className="text-[14px] text-ink mt-1">{m.v}</p>
                  </div>
                ))}
              </div>

              {/* combinaciones del activo */}
              {combos.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-display text-[15px] font-medium text-ink mb-1">
                    {dict.combos.title.replace("{n}", String(combos.length))}
                  </h4>
                  <p className="text-[14px] leading-[1.6] mb-4 max-w-[640px]">{dict.combos.desc}</p>
                  <div className="max-h-[340px] overflow-y-auto border-t border-rule">
                    <table className="w-full text-[14px]">
                      <thead className="sticky top-0 bg-band2 text-muted text-left">
                        <tr>
                          <th className="px-3 py-2 font-normal">{dict.combos.strategy}</th>
                          <th className="px-3 py-2 font-normal text-right">{dict.combos.exposure}</th>
                          <th className="px-3 py-2 font-normal text-right">{dict.combos.excess}</th>
                          <th className="px-3 py-2 font-normal text-right">{dict.combos.oosExcess}</th>
                          <th className="px-3 py-2 font-normal text-center">{dict.combos.survived}</th>
                        </tr>
                      </thead>
                      <tbody className="text-body">
                        {combos.map((c) => {
                          const dead = (c.n_trades ?? 0) === 0;
                          return (
                            <tr key={c.strategy} className={`border-t border-rulesoft ${dead ? "opacity-45" : ""}`}>
                              <td className="px-3 py-1.5 text-ink">{c.strategy}</td>
                              <td className="px-3 py-1.5 text-right">{pct(lang, c.exposure, 1)}</td>
                              <td className="px-3 py-1.5 text-right">{pct(lang, c.excess_return, 1, true)}</td>
                              <td className="px-3 py-1.5 text-right">{pct(lang, c.oos_excess_return, 1, true)}</td>
                              <td className="px-3 py-1.5 text-center">
                                {dead ? dict.combos.zeroTrades : c.beat_bh_oos ? dict.combos.yes : dict.combos.no}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {!symbolLoading && !currentBacktest && (
            <p className="text-[14px] text-muted py-12 text-center">{dict.explorer.noData}</p>
          )}
        </div>
      </section>

      {/* ============ 4. LEADERBOARD de estrategias individuales ============ */}
      <section className="border-t border-rule pt-7">
        <h3 className="font-display text-[18px] font-medium text-ink mb-1.5">{dict.leaderboard.title}</h3>
        <p className="text-[14px] leading-[1.7] max-w-[620px] mb-5">{dict.leaderboard.desc}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[14px]">
            <thead className="text-muted text-left">
              <tr className="border-b border-rule">
                <th className="px-3 py-2 font-normal">{dict.leaderboard.strategy}</th>
                <th className="px-3 py-2 font-normal text-right">{dict.leaderboard.beat}</th>
                <th className="px-3 py-2 font-normal text-right">{dict.leaderboard.avgReturn}</th>
                <th className="px-3 py-2 font-normal text-right">{dict.leaderboard.avgBh}</th>
                <th className="px-3 py-2 font-normal text-right">{dict.leaderboard.excess}</th>
                <th className="px-3 py-2 font-normal text-right">{dict.leaderboard.sharpe}</th>
              </tr>
            </thead>
            <tbody className="text-body">
              {singlesLeaderboard.map((r) => (
                <tr key={r.strategy} className="border-b border-rulesoft">
                  <td className="px-3 py-2 text-ink">{r.strategy}</td>
                  <td className="px-3 py-2 text-right">
                    {num(lang, r.n_beat_buy_hold, 0)}/{num(lang, r.n_backtests, 0)} ({pct(lang, r.beat_rate, 0)})
                  </td>
                  <td className="px-3 py-2 text-right">{pct(lang, r.avg_total_return, 1, true)}</td>
                  <td className="px-3 py-2 text-right">{pct(lang, r.avg_buy_hold_return, 1, true)}</td>
                  <td className="px-3 py-2 text-right">{pct(lang, r.avg_excess_return, 1, true)}</td>
                  <td className="px-3 py-2 text-right">{num(lang, r.median_sharpe, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ 5. DESCOMPOSICIÓN CAMBIARIA (ADRs Latam) ============ */}
      {fx365.length > 0 && (
        <section className="border-t border-rule pt-7">
          <h3 className="font-display text-[18px] font-medium text-ink mb-1.5">{dict.fx.title}</h3>
          <p className="text-[14px] leading-[1.7] max-w-[660px] mb-2">{dict.fx.desc}</p>
          <p className="text-[14px] text-muted mb-5">{dict.fx.formula}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[14px]">
              <thead className="text-muted text-left">
                <tr className="border-b border-rule">
                  <th className="px-3 py-2 font-normal">{dict.fx.asset}</th>
                  <th className="px-3 py-2 font-normal">{dict.fx.pair}</th>
                  <th className="px-3 py-2 font-normal text-right">{dict.fx.usd}</th>
                  <th className="px-3 py-2 font-normal text-right">{dict.fx.local}</th>
                  <th className="px-3 py-2 font-normal text-right">{dict.fx.fxMove}</th>
                  <th className="px-3 py-2 font-normal text-right">{dict.fx.drag}</th>
                </tr>
              </thead>
              <tbody className="text-body">
                {fx365.map((r) => (
                  <tr key={r.symbol} className="border-b border-rulesoft">
                    <td className="px-3 py-2 text-ink">{r.symbol}</td>
                    <td className="px-3 py-2">{r.fx_pair}</td>
                    <td className="px-3 py-2 text-right">{pct(lang, r.usd_return, 1, true)}</td>
                    <td className="px-3 py-2 text-right">{pct(lang, r.local_return, 1, true)}</td>
                    <td className="px-3 py-2 text-right">{pct(lang, r.fx_return, 1, true)}</td>
                    <td className="px-3 py-2 text-right text-ink">
                      {r.fx_drag_pp == null ? "—" : `${(r.fx_drag_pp * 100).toFixed(1).replace(".", lang === "es" ? "," : ".")} pp`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-[1.6] text-muted mt-4 max-w-[660px]">{dict.fx.note}</p>
        </section>
      )}

      {/* ============ 6. SALUD DEL PIPELINE ============ */}
      <section className="border-t-2 border-ink bg-band">
        <div className="flex items-center gap-2 border-b border-rule bg-band px-4 py-3">
          <span className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{dict.health.windowTitle}</span>
        </div>
        <div className="p-6 text-[14px] leading-[1.9]">
          <p className="text-muted">
            {dict.health.totals
              .replace("{assets}", num(lang, index.pipeline.totals.assets, 0))
              .replace("{candles}", num(lang, index.pipeline.totals.bronze_rows, 0))
              .replace("{backtests}", num(lang, index.pipeline.totals.backtests, 0))
              .replace("{date}", generated ?? "—")}
          </p>
          <div className="mt-3 space-y-0.5">
            {index.pipeline.recent_ingest_runs.slice(0, 8).map((r, i) => (
              <p key={i} className="text-body">
                <span className="text-muted">{r.finished_at?.slice(5, 16).replace("T", " ") ?? "—"}</span>{" "}
                <span className="text-cold">{r.source}</span>/{r.symbol}{" "}
                {r.status === "success" ? (
                  <span className="text-live">ok</span>
                ) : (
                  <span className="text-building">deferred</span>
                )}{" "}
                <span className="text-muted">+{r.rows_inserted ?? 0}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <p className="text-[14px] text-muted">
        {dict.updated} {generated} ·{" "}
        <a href={TRADING_SIM_REPO} target="_blank" rel="noopener noreferrer" className="text-cold hover:underline">
          {dict.repoCta}
        </a>
      </p>
    </div>
  );
}
