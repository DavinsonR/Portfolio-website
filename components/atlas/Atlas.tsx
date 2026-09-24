"use client";

/* The atlas lives inside the project page, not on a site of its own. React owns the
   controls and the loading states; the drawing is handed to render.ts, which patches an
   SVG it built itself. The reason is the municipal view: 1,121 units become about 5,600
   nodes, and hovering one has to repaint a label and two bars, not reconcile a tree of
   that size. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Projection } from "./render";

/* El renderizador (d3-geo, d3-scale, topojson y sus ~1.000 líneas: 66 KB
   crudos, 22,5 KB br) bajaba con la página aunque sus datos sí esperaban a
   la puerta de 600 px — la mitad de FALLO-30 que quedó abierta. Ahora el
   módulo se pide en el mismo lugar que los JSON. Una sola promesa por sesión. */
type Renderer = typeof import("./render");
let rendererPromise: Promise<Renderer> | null = null;
const loadRenderer = () => (rendererPromise ??= import("./render"));
import type { AtlasCopy, AtlasMeta, ForecastInfo, Indicator, Level, Series, Topology, View } from "./types";

const BASE = "/atlas";
const LEVEL_OF: Record<View, Level> = { plano: "departamento", relieve: "departamento", municipios: "municipio" };

type Bundle = { series: Series; topology: Topology; projection: Projection };

/* The forecast group (D-36). It lives only at department level and only in the projected
   years; the other three groups live only in the observed ones. */
const FORECAST = "proyeccion";
const DEFAULT_INDICATOR = "iif_compuesto";
const WIDTH_ID = "intervalo_ancho_proy";
const GROUPS = ["indice", "variable", "contexto", FORECAST] as const;

/* The year that exists for this group and is closest to the one asked for; on a tie, the
   later one. Changing group reads the year through this instead of correcting it in state. */
const nearest = (years: number[], want: number | null) =>
  years.length === 0
    ? null
    : want === null
      ? years[years.length - 1]
      : years.reduce((best, y) => (Math.abs(y - want) <= Math.abs(best - want) ? y : best), years[0]);

async function loadJSON<T>(file: string): Promise<T> {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return (await res.json()) as T;
}

export default function Atlas({ copy, locale }: { copy: AtlasCopy; locale: string }) {
  const [meta, setMeta] = useState<AtlasMeta | null>(null);
  const [bundles, setBundles] = useState<Partial<Record<Level, Bundle>>>({});
  const [failed, setFailed] = useState(false);
  /* Los 258 KB del nivel departamental (92 comprimidos) se pedían en cuanto
     hidrataba la página, bajara o no el lector hasta el mapa. El nivel municipal
     sí estaba diferido; este no. La puerta se abre 600px antes de que el mapa
     entre en pantalla, así que para quien scrollea ya está cargado, y para quien
     nunca llega no se pide nunca. Sin IntersectionObserver se abre de inmediato:
     un navegador viejo debe ver el mapa, no un hueco. */
  // El estado nace abierto donde no hay observador: eso es derivable en el
  // render y no hace falta un efecto que lo escriba después.
  const [near, setNear] = useState(() => typeof IntersectionObserver === "undefined");
  const shell = useRef<HTMLElement>(null);

  const [view, setView] = useState<View>("plano");
  const [indicatorId, setIndicatorId] = useState(DEFAULT_INDICATOR);
  const [year, setYear] = useState<number | null>(null);
  const [group, setGroup] = useState(copy.all);

  const level = LEVEL_OF[view];
  const bundle = bundles[level];

  const left = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);

  /* Departmental data comes with the section; the municipal geometry is 1.2 MB and only
     loads when someone actually asks for municipalities. */
  const renderer = useRef<Renderer | null>(null);
  const ensure = useCallback(async (want: Level) => {
    const file = want === "departamento" ? "departamentos" : "municipios";
    const [series, topology, r] = await Promise.all([
      loadJSON<Series>(`series_${want}.json`),
      loadJSON<Topology>(`geo_${file}.json`),
      loadRenderer(),
    ]);
    renderer.current = r;
    return { series, topology, projection: r.buildProjection(topology) };
  }, []);

  useEffect(() => {
    if (near) return;
    const el = shell.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (!near) return;
    let alive = true;
    (async () => {
      try {
        const [m, dep] = await Promise.all([loadJSON<AtlasMeta>("atlas_meta.json"), ensure("departamento")]);
        if (!alive) return;
        setMeta(m);
        setBundles((b) => ({ ...b, departamento: dep }));
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [ensure, near]);

  /* El segundo efecto también espera a la puerta. Sin esto pedía el nivel
     departamental por su cuenta en el montaje —`bundles[level]` está vacío y
     `failed` es falso—, así que la carga diferida del efecto de arriba no
     evitaba nada: los 258 KB salían igual. Y como el primer efecto ya trae
     `departamento`, este arranca duplicando esa misma pareja de ficheros hasta
     que el estado llega; la condición de nivel lo corta. */
  useEffect(() => {
    if (!near || bundles[level] || failed) return;
    if (level === "departamento" && !meta) return;
    let alive = true;
    (async () => {
      try {
        const b = await ensure(level);
        if (alive) setBundles((prev) => ({ ...prev, [level]: b }));
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [level, bundles, ensure, failed, near, meta]);

  const departmentNames = useMemo(() => {
    const dep = bundles.departamento?.series;
    return new Map((dep?.ids ?? []).map((id, i) => [id, dep!.nombres[i]]));
  }, [bundles.departamento]);

  const indicators: Indicator[] = useMemo(() => meta?.indicadores[level] ?? [], [meta, level]);
  /* Read through, like the year: the forecast has no municipal series, so asking for it
     at municipal level draws the composite index and the selector shows exactly that. */
  const indicator = useMemo(
    () =>
      indicators.find((i) => i.id === indicatorId) ??
      indicators.find((i) => i.id === DEFAULT_INDICATOR) ??
      indicators[0],
    [indicators, indicatorId],
  );
  const isForecast = indicator?.grupo === FORECAST;
  /* The forecast options stay visible at municipal level, disabled, so the reader learns
     the layer exists and where to find it instead of watching it vanish. */
  const forecastOptions: Indicator[] = useMemo(
    () => (level === "municipio" ? (meta?.indicadores.departamento ?? []).filter((i) => i.grupo === FORECAST) : []),
    [meta, level],
  );

  const groups = useMemo(() => {
    if (!bundle) return [];
    const s = bundle.series;
    const labels =
      level === "departamento"
        ? (s.region ?? [])
        : (s.dpto_ccdgo ?? []).map((c) => (c ? (departmentNames.get(c) ?? c) : null));
    return Array.from(new Set(labels.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "es"));
  }, [bundle, level, departmentNames]);

  /* Switching level changes what exists. The choice is not corrected in state — that would
     be a second render for nothing — it is read through: what the map draws is always the
     nearest thing that exists, and the control shows exactly that. */
  /* Years belong to the group (D-36): the observed ones for the index, its variables and
     the context; `anios_proyectados` for the forecast. The slider only walks the years
     where the active layer has a value, so no year of it draws an empty map. */
  const { observed, projected } = useMemo(() => {
    const all = bundle?.series.anios ?? [];
    const ahead = new Set(bundle?.series.anios_proyectados ?? []);
    return { observed: all.filter((y) => !ahead.has(y)), projected: all.filter((y) => ahead.has(y)) };
  }, [bundle]);
  const years = isForecast && projected.length ? projected : observed;
  /* With nothing chosen yet the atlas opens on the last OBSERVED year: with the forecast
     layer `anios` ends in 2028, where the index has no value. Once a year is chosen, a
     change of group lands on the nearest year that group has (2025 -> 2026 and back). */
  const activeYear = nearest(years, year ?? observed[observed.length - 1] ?? null);
  const forecastInfo: ForecastInfo | undefined = isForecast ? bundle?.series.proyeccion : undefined;
  const activeGroup = group === copy.all || groups.includes(group) ? group : copy.all;

  const onDrillDown = useCallback((name: string) => {
    setGroup(name);
    setView("municipios");
  }, []);

  const ready = Boolean(meta && bundle && indicator && activeYear !== null);

  useEffect(() => {
    if (!meta || !bundle || !indicator || activeYear === null) return;
    if (!left.current || !map.current || !right.current) return;
    if (!bundle.series.series[indicator.id]) return;
    // `ensure` esperó al módulo antes de dejar un bundle en estado: aquí ya está.
    const r = renderer.current;
    if (!r) return;
    const stop = r.renderAtlas(
      { left: left.current, map: map.current, right: right.current },
      {
        meta,
        series: bundle.series,
        departmentNames,
        projection: bundle.projection,
        level,
        view,
        indicator,
        year: activeYear,
        years,
        group: activeGroup,
        copy,
        locale,
        onDrillDown,
      },
    );
    return stop;
  }, [meta, bundle, indicator, activeYear, years, activeGroup, view, level, departmentNames, copy, locale, onDrillDown]);

  return (
    <section ref={shell} className="atlas">
      <div className="atlas-bar">
        <fieldset className="atlas-field">
          <legend>{copy.viewLabel}</legend>
          {/* El <fieldset>/<legend> ya agrupa y nombra: un role="group" con el
              mismo nombre encima lo anunciaba dos veces. */}
          <div className="atlas-views">
            {(["plano", "relieve", "municipios"] as View[]).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {copy.views[v]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="atlas-field">
          <span>{copy.indicatorLabel}</span>
          <select
            value={indicator?.id ?? ""}
            onChange={(e) => setIndicatorId(e.target.value)}
            disabled={!indicators.length}
            aria-describedby={forecastOptions.length ? "atlas-forecast-municipal" : undefined}
          >
            {GROUPS.map((g) => {
              const items = indicators.filter((i) => i.grupo === g);
              const off = !items.length && g === FORECAST ? forecastOptions : [];
              if (!items.length && !off.length) return null;
              return (
                <optgroup key={g} label={copy.groups[g]} disabled={off.length ? true : undefined}>
                  {(items.length ? items : off).map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.etiqueta}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          {forecastOptions.length ? (
            <small id="atlas-forecast-municipal" className="atlas-hint">
              {copy.forecast.municipalOnly}
            </small>
          ) : null}
        </label>

        <label className="atlas-field">
          <span>{copy.yearLabel}</span>
          <span className="atlas-range">
            <input
              type="range"
              min={years[0] ?? 0}
              max={years[years.length - 1] ?? 0}
              step={1}
              value={activeYear ?? 0}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={!years.length}
            />
            <output>{activeYear ?? ""}</output>
          </span>
        </label>

        <label className="atlas-field">
          <span>{level === "departamento" ? copy.regionLabel : copy.departmentLabel}</span>
          <select value={activeGroup} onChange={(e) => setGroup(e.target.value)} disabled={!groups.length}>
            {[copy.all, ...groups].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      {forecastInfo && indicator ? (
        <ForecastNote info={forecastInfo} copy={copy.forecast} locale={locale} widthLayer={indicator.id === WIDTH_ID} />
      ) : null}

      {failed ? (
        <p className="atlas-state" role="alert">{copy.failed}</p>
      ) : !ready ? (
        <p className="atlas-state" role="status">{copy.loading}</p>
      ) : null}

      <div className="atlas-canvas" data-hidden={failed ? "yes" : undefined}>
        <div ref={left} className="atlas-rail" />
        <div ref={map} className="atlas-map" />
        <div ref={right} className="atlas-rail" />
      </div>

      {/* La CC BY-SA 4.0 exige la atribución en el medio donde se publica el
          material adaptado (§3.a.1) y que el derivado lleve la misma licencia
          (§3.b). `meta.fuente` llevaba la atribución escrita desde el principio
          y se quedaba en el JSON: el mapa se publicaba sin ella. */}
      {meta ? (
        <footer className="atlas-credit">
          <p>
            <strong>{copy.sourceLabel}:</strong> {meta.fuente}
          </p>
          <p>
            {copy.licenceLabel}{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer">
              {copy.licenceName}
            </a>
            .{" "}
            {/* Las notas vienen del export del pipeline y solo existen en español.
                Sin `lang`, un lector de pantalla las pronuncia como inglés en /en. */}
            <span lang="es">
              {meta.nota} {meta.nota_geometria}
            </span>
          </p>
        </footer>
      ) : null}
    </section>
  );
}

/* The note that travels with the forecast (D-36, thesis ADR-022 and ADR-023). Every figure
   in it is read from `proyeccion` in the series JSON and formatted here; a key the export
   does not publish drops its sentence instead of being guessed. It is fixed, not a tooltip:
   whoever looks at the map has to be told it is a scenario without asking for it. */
function ForecastNote({
  info,
  copy,
  locale,
  widthLayer,
}: {
  info: ForecastInfo;
  copy: AtlasCopy["forecast"];
  locale: string;
  widthLayer: boolean;
}) {
  const fill = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  const num = (v: number, digits: number) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
  const pct = (v: number) => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(v);
  const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

  const { ancla, backtest } = info;
  const sentences: string[] = [];
  if (ancla?.fuente && ancla.fecha_corte) {
    const d = new Date(`${ancla.fecha_corte}T00:00:00Z`);
    const date = Number.isNaN(d.getTime())
      ? ancla.fecha_corte
      : new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(d);
    sentences.push(fill(copy.anchor, { source: ancla.fuente, date }));
  }
  if (ancla?.vencida && finite(ancla.antiguedad_meses) && finite(ancla.antiguedad_maxima_meses)) {
    sentences.push(fill(copy.anchorAge, { months: Math.floor(ancla.antiguedad_meses), max: ancla.antiguedad_maxima_meses }));
  }
  sentences.push(copy.scenario);
  const won = backtest?.origenes_ganados;
  const total = backtest?.n_origenes;
  const p = backtest?.dm_p;
  if (finite(won) && finite(total) && finite(p)) {
    sentences.push(fill(copy.backtest, { won, n: total, p: num(p, 2) }));
  }
  const nominal = backtest?.cobertura_intervalo_nominal ?? info.nivel_intervalo;
  const empirical = backtest?.cobertura_intervalo_empirica;
  if (finite(empirical) && finite(nominal)) {
    sentences.push(fill(copy.coverage, { nominal: pct(nominal), empirical: pct(empirical) }));
  }
  sentences.push(widthLayer ? copy.encodingWidth : copy.encoding);

  return (
    <div className="atlas-note" role="note">
      <strong>{copy.noteLabel}</strong>
      <p>{sentences.join(" ")}</p>
    </div>
  );
}
