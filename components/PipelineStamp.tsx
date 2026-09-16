"use client";

import { useEffect, useState } from "react";
import { INDEX_URL, fetchJson } from "@/lib/data/trading-sim";

/** Proof, not prose.
 *
 *  This used to print `generated_at` — the moment the EXPORT was written. For
 *  four nights that number was fresh while the data behind it was four days
 *  old: every ingestion had been refused 403 and the pipeline published anyway
 *  (FALLO-26). A stamp that reports its own liveness rather than the data's is
 *  worse than no stamp, because it looks like evidence.
 *
 *  So it now reports the newest candle in the warehouse, and says plainly when
 *  the pipeline has stalled — reusing the warehouse's own definition of stale
 *  (`now() - last_candle_ts > 3 days`, mart_asset_summary.sql) rather than
 *  inventing a second one that could disagree with it.
 *
 *  It never falls back to a fabricated date: when the fetch fails it degrades
 *  to the static wording. */
export default function PipelineStamp({
  label,
  stalledLabel,
  fallback,
  lang,
}: {
  label: string;
  stalledLabel: string;
  fallback: string;
  lang: string;
}) {
  const [state, setState] = useState<{ date: string; stalled: boolean } | null>(null);

  useEffect(() => {
    let alive = true;
    fetchJson<{ assets?: { summary?: { last_candle_ts?: string | null; is_stale?: boolean | null } | null }[] }>(INDEX_URL)
      .then((d) => {
        if (!alive || !Array.isArray(d.assets)) return;

        const summaries = d.assets.map((a) => a.summary).filter((s): s is NonNullable<typeof s> => !!s);
        const stamps = summaries
          .map((s) => s.last_candle_ts)
          .filter((t): t is string => typeof t === "string" && t.length > 0);
        if (!stamps.length) return;

        const newest = stamps.reduce((a, b) => (a > b ? a : b));
        // One stale asset is a delisting; most of them stale is a stopped pipeline.
        const stale = summaries.filter((s) => s.is_stale).length;
        const stalled = summaries.length > 0 && stale > summaries.length / 2;

        setState({
          date: new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(newest)),
          stalled,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [lang]);

  if (!state) {
    return (
      <span className="inline-flex items-center gap-2 text-[14px] text-muted">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
        </span>
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-[14px] ${state.stalled ? "text-neg" : "text-muted"}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {/* a stopped pipeline gets a still square, not a pulsing dot: the mark
            itself has to stop moving, or the page keeps signalling life */}
        {state.stalled ? (
          <span className="inline-flex h-2 w-2 bg-neg" />
        ) : (
          <>
            <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </>
        )}
      </span>
      {state.stalled ? stalledLabel : label} {state.date}
    </span>
  );
}
