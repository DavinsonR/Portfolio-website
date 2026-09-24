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
import type { AtlasCopy, AtlasMeta, Indicator, Level, Series, Topology, View } from "./types";

const BASE = "/atlas";
const LEVEL_OF: Record<View, Level> = { plano: "departamento", relieve: "departamento", municipios: "municipio" };

type Bundle = { series: Series; topology: Topology; projection: Projection };

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
  const [indicatorId, setIndicatorId] = useState("iif_compuesto");
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
  const indicator = useMemo(
    () => indicators.find((i) => i.id === indicatorId) ?? indicators[0],
    [indicators, indicatorId],
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
  const years = useMemo(() => bundle?.series.anios ?? [], [bundle]);
  /* The default is the last OBSERVED year: with the forecast layer `anios` ends in 2028,
     where the index has no value, and opening there drew an empty map. */
  const lastObserved = useMemo(() => {
    const projected = new Set(bundle?.series.anios_proyectados ?? []);
    const observed = years.filter((y) => !projected.has(y));
    return observed[observed.length - 1] ?? years[years.length - 1] ?? null;
  }, [bundle, years]);
  const activeYear = year !== null && years.includes(year) ? year : lastObserved;
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
        group: activeGroup,
        copy,
        locale,
        onDrillDown,
      },
    );
    return stop;
  }, [meta, bundle, indicator, activeYear, activeGroup, view, level, departmentNames, copy, locale, onDrillDown]);

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
          <select value={indicator?.id ?? ""} onChange={(e) => setIndicatorId(e.target.value)} disabled={!indicators.length}>
            {(["indice", "variable", "contexto"] as const).map((g) => {
              const items = indicators.filter((i) => i.grupo === g);
              if (!items.length) return null;
              return (
                <optgroup key={g} label={copy.groups[g]}>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.etiqueta}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
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
