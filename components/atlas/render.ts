/* ============================================================================
   THE ATLAS, DRAWN BY HAND

   Three views of one dataset: flat, raised, and municipal. The drawing lives
   outside React on purpose. The municipal view puts about 5,600 nodes on the
   page, and hovering a unit has to repaint a label and two bars, not reconcile
   a tree that size. So React owns the controls and this module owns the SVG:
   it builds once per (level, indicator, year, filter, view) and then patches
   text and attributes on nodes that already exist.

   The geometry, the palette and the honesty rules are the same ones the
   research repository publishes; this is the same map wearing the sheet's
   clothes.
   ============================================================================ */

import { geoMercator, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { descending, extent, max, median, rollups } from "d3-array";
import { scaleLinear } from "d3-scale";
import { interpolateLab } from "d3-interpolate";
import { color as toColor } from "d3-color";
import { feature } from "topojson-client";
import type { AtlasCopy, Indicator, Level, Series, Topology, View } from "./types";

/* {n} {total} {ind} {y} {name} filled from the dictionary's templates. */
const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

/* ---------------------------------------------------------------- constants */

const CANVAS = { width: 660, frame: 700, top: 54, pad: 14 };

/* Layers and step of the block, in canvas units. The side is a stack of copies of
   the same outline, so the step has to stay under a point or the edge combs;
   depth comes from more layers, never from longer steps. */
const RELIEF: Record<View, { layers: number; step: number }> = {
  plano: { layers: 0, step: 0 },
  relieve: { layers: 26, step: 1.2 },
  municipios: { layers: 4, step: 1.6 },
};

/* The archipelago (DIVIPOLA 88) is drawn apart and does not count for the frame:
   700 km of sea would shrink Colombia by a fifth to draw a dot. */
const isInsular = (id: string) => String(id).slice(0, 2) === "88";

/* ------------------------------------------------------------------ helpers */

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | null> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null) node.setAttribute(k, String(v));
  return node;
}

function htmlEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

/* One place reads the design token, so the map, the legend and the bars always
   share the same steps. */
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const RAMPS = {
  divergente: () =>
    ["--atlas-neg-3", "--atlas-neg-2", "--atlas-neg-1", "--atlas-mid", "--atlas-pos-1", "--atlas-pos-2", "--atlas-pos-3"].map(token),
  secuencial: () => ["--atlas-seq-0", "--atlas-seq-1", "--atlas-seq-2", "--atlas-seq-3", "--atlas-seq-4"].map(token),
};

/* --------------------------------------------------------------- focus bus */

type FocusState = { id: string | null; pinned: boolean };

function makeFocus() {
  const listeners = new Set<(s: FocusState) => void>();
  let pinned: string | null = null;
  let hovered: string | null = null;
  let last: FocusState = { id: null, pinned: false };
  let queued = false;

  const emit = () => {
    queued = false;
    const id = hovered ?? pinned;
    const state: FocusState = { id, pinned: id !== null && id === pinned };
    if (state.id === last.id && state.pinned === last.pinned) return;
    last = state;
    for (const f of listeners) f(state);
  };
  const ask = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(emit);
    }
  };

  return {
    pinnedId: () => pinned,
    /* Hovering does not clear the pin: it covers it while it lasts. Leaving the map
       brings the pinned unit back, which is what makes a click worth making. */
    hover(id: string | null) {
      if (hovered === id) return;
      hovered = id;
      ask();
    },
    togglePin(id: string) {
      pinned = pinned === id ? null : id;
      hovered = null;
      ask();
    },
    listen(f: (s: FocusState) => void) {
      listeners.add(f);
      f(last);
      return () => listeners.delete(f);
    },
  };
}

/* --------------------------------------------------------------- projection */

export type Projection = ReturnType<typeof buildProjection>;

/* Decoded and projected once per level. Changing year, indicator or view only
   changes colours and one matrix; decoding 1,121 municipalities again on every
   change would be the most expensive thing on the page and buys nothing. */
export function buildProjection(topology: Topology) {
  const objectName = Object.keys(topology.objects)[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collection = feature(topology as any, (topology.objects as any)[objectName]) as unknown as {
    features: GeoFeature[];
  };
  const features = collection.features;
  const mainland = { type: "FeatureCollection", features: features.filter((f) => !isInsular(f.properties.id)) };
  const projection = geoMercator().fitSize(
    [CANVAS.width, CANVAS.frame - CANVAS.top],
    collection as unknown as GeoPermissibleObjects,
  );
  const path = geoPath(projection);
  return { features, path, projection, mainland: mainland as unknown as GeoPermissibleObjects };
}

export type GeoFeature = {
  type: "Feature";
  properties: { id: string };
  geometry: unknown;
};

/* ------------------------------------------------------------- view geometry

   One affine matrix turns, flattens and fits the country. Turning a frame that was
   already fitted pushes the map out of it — Colombia turned 28 degrees is about
   780 units wide on a canvas of 660 — so the fitting scale is computed on the
   corners that have already been transformed. The same matrix serves the map and
   the labels, which live outside the tilted group.                             */

function viewGeometry(view: View, projection: Projection, focusFeatures: GeoFeature[]) {
  const { width, frame, top, pad } = CANVAS;
  const relief = RELIEF[view];
  const angle = ((view === "municipios" ? -28 : view === "relieve" ? -17 : 0) * Math.PI) / 180;
  const ky = view === "municipios" ? 0.66 : view === "relieve" ? 0.74 : 1;
  /* SVG: x' = a·x + c·y + e ; y' = b·x + d·y + f. This is flatten(ky) ∘ turn(angle). */
  const [a, b, c, d] = [Math.cos(angle), ky * Math.sin(angle), -Math.sin(angle), ky * Math.cos(angle)];

  const bounds = projection.path.bounds({
    type: "FeatureCollection",
    features: focusFeatures,
  } as unknown as GeoPermissibleObjects);
  const [[x0, y0], [x1, y1]] = bounds;
  const corners = ([[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as [number, number][]).map(([x, y]) => [
    a * x + c * y,
    b * x + d * y,
  ]);
  const X = extent(corners, (q) => q[0]) as [number, number];
  const Y = extent(corners, (q) => q[1]) as [number, number];

  /* Room reserved above: the block plus the extra lift of a raised unit, or the north runs off. */
  const lift = (relief.layers + 4) * relief.step;
  const s = Math.min((width - 2 * pad) / (X[1] - X[0]), (frame - top - lift - pad) / (Y[1] - Y[0]));
  const content = s * (Y[1] - Y[0]);
  /* The canvas is cropped to its content on both axes: Colombia is taller than it is
     wide, and a square frame spent a third of the width on margin. The 430 floor is
     what the legend needs to sit on one line. */
  const canvasWidth = Math.max(430, s * (X[1] - X[0]) + 2 * pad);
  const [A, B, C, D] = [a * s, b * s, c * s, d * s];
  const E = canvasWidth / 2 - (s * (X[0] + X[1])) / 2;
  const F = lift - s * Y[0];
  const det = A * D - B * C;

  return {
    width: canvasWidth,
    height: top + lift + content + pad,
    top,
    scale: s,
    layers: relief.layers,
    step: relief.step,
    linear: [A, B, C, D] as [number, number, number, number],
    matrix: `matrix(${[A, B, C, D, E, F].map((v) => v.toFixed(4)).join(",")})`,
    toScreen: (q: [number, number]) => [A * q[0] + C * q[1] + E, B * q[0] + D * q[1] + F] as [number, number],
    /* A shift that comes out straight up on screen. Inside the tilted group "up" is no
       longer (0,−1): solve M·v = (0,−px) or the block leans with the turn. */
    up: (px: number) => [(C * px) / det, (-A * px) / det] as [number, number],
  };
}

/* ----------------------------------------------------------------- rendering */

export type RenderOptions = {
  meta: { islas_descartadas: Record<string, number> };
  series: Series;
  departmentNames: Map<string, string>;
  projection: Projection;
  level: Level;
  view: View;
  indicator: Indicator;
  year: number;
  group: string;
  copy: AtlasCopy;
  locale: string;
  onDrillDown: (departmentName: string) => void;
};

export type Slots = { left: HTMLElement; map: HTMLElement; right: HTMLElement };

export function renderAtlas(slots: Slots, o: RenderOptions): () => void {
  const { series, projection, indicator, copy } = o;
  const yearIndex = Math.max(0, series.anios.indexOf(o.year));
  const values = series.series[indicator.id]?.[yearIndex] ?? [];
  const position = new Map(series.ids.map((id, i) => [id, i]));

  const groupOf: (string | null | undefined)[] =
    o.level === "departamento"
      ? (series.region ?? [])
      : (series.dpto_ccdgo ?? []).map((c) => (c ? (o.departmentNames.get(c) ?? c) : null));
  const inGroup = (i: number) => o.group === copy.all || groupOf[i] === o.group;

  const fmt = numberFormat(o.locale, indicator);
  const focus = makeFocus();
  const cleanups: Array<() => void> = [];

  /* --- colour scale. Diverging is symmetric around zero so the same colour means the
     same distance to the centre on both sides; sequential runs min to max observed. */
  const visible = values.filter((v, i) => v !== null && inGroup(i)) as number[];
  const paint = buildScale(visible, indicator);

  const focusFeatures = projection.features.filter((f) => {
    if (isInsular(f.properties.id)) return false;
    if (o.group === copy.all) return true;
    const i = position.get(f.properties.id);
    return i !== undefined && inGroup(i);
  });
  const geo = viewGeometry(o.view, projection, focusFeatures.length ? focusFeatures : (projection.mainland as unknown as { features: GeoFeature[] }).features);

  slots.left.replaceChildren();
  slots.map.replaceChildren();
  slots.right.replaceChildren();

  cleanups.push(drawMap(slots.map, { ...o, geo, values, position, inGroup, paint, fmt, focus, yearIndex }));
  cleanups.push(drawLeftRail(slots.left, { ...o, values, position, inGroup, fmt, focus, yearIndex }));
  cleanups.push(drawRightRail(slots.right, { ...o, values, groupOf, inGroup, paint, fmt, focus }));

  return () => cleanups.forEach((f) => f());
}

function numberFormat(locale: string, indicator: Indicator) {
  const signed = indicator.decimales >= 3;
  const digits = indicator.decimales === 0 ? 0 : 2;
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  });
  return (v: number) => nf.format(v);
}

function buildScale(visible: number[], indicator: Indicator) {
  if (!visible.length) return () => token("--atlas-void");
  if (indicator.escala === "divergente") {
    const m = (max(visible, Math.abs) as number) || 1;
    const stops = Array.from({ length: 7 }, (_, i) => -m + (2 * m * i) / 6);
    return scaleLinear<string>().domain(stops).range(RAMPS.divergente()).clamp(true).interpolate(interpolateLab);
  }
  const [lo, hi] = extent(visible) as [number, number];
  const ramp = RAMPS.secuencial();
  return scaleLinear<string>()
    .domain(ramp.map((_, i) => lo + ((hi - lo) * i) / (ramp.length - 1)))
    .range(ramp)
    .clamp(true)
    .interpolate(interpolateLab);
}

/* -------------------------------------------------------------------- map */

type MapArgs = RenderOptions & {
  geo: ReturnType<typeof viewGeometry>;
  values: (number | null)[];
  position: Map<string, number>;
  inGroup: (i: number) => boolean;
  paint: (v: number) => string;
  fmt: (v: number) => string;
  focus: ReturnType<typeof makeFocus>;
  yearIndex: number;
};

function drawMap(host: HTMLElement, o: MapArgs): () => void {
  const { geo, series, projection, indicator, values, position, inGroup, paint, fmt, focus, copy } = o;
  const { width, height, top } = geo;
  const path = projection.path;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": `${indicator.etiqueta}, ${o.year}`,
  });
  svg.style.display = "block";
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.maxHeight = "78vh";

  const frame = svgEl("g", { transform: `translate(0,${top})` });
  const layer = svgEl("g", { transform: geo.matrix });
  frame.append(layer);
  svg.append(frame);

  const strokeOf = (px: number) => px / geo.scale;
  const colourOf = (i: number | undefined) =>
    i === undefined || values[i] === null ? token("--atlas-void") : inGroup(i) ? paint(values[i] as number) : token("--atlas-void");
  /* The side carries the face colour darkened, not a translucent black: twenty-six
     copies of a black at 34% add up to solid black and the block reads as a hole. */
  const sideOf = (i: number | undefined) => {
    const c = toColor(colourOf(i));
    return c ? c.darker(0.85).formatHex() : token("--color-rule");
  };

  const LAYERS = geo.layers;
  const STEP = geo.step;
  const up = geo.up(1);
  const blockHeight = (LAYERS + 1) * STEP;

  if (LAYERS) {
    const defs = svgEl("defs");
    projection.features.forEach((f, k) => {
      const d = path(f as unknown as GeoPermissibleObjects);
      if (d) defs.append(svgEl("path", { id: `pz-${k}`, d }));
    });
    svg.append(defs);
  }

  /* --- The archipelago, off scale. San Andrés is 700 km out and 26 km²: inside the
     frame it costs a fifth of the width to draw a dot, and inside a proportional inset
     what fills the box is the sea between the two islands. So its outline is not drawn:
     a labelled chip carries its colour, and the unit stays alive to hover and click. */
  const insular = projection.features.filter((f) => isInsular(f.properties.id));
  const CHIP = { size: 13, row: 18 };
  const chipBox = { x: 10, y: height - top - (insular.length * CHIP.row + 8) };
  let insularGroup: SVGGElement | null = null;
  if (insular.length) {
    insularGroup = svgEl("g");
    const caption = svgEl("text", { x: chipBox.x, y: chipBox.y - 5, "font-size": 9.5, fill: token("--color-muted") });
    caption.textContent = copy.offScale;
    insularGroup.append(caption);
    frame.append(insularGroup);
  }
  const insularIndex = new Map(insular.map((f, k) => [f.properties.id, k]));

  type Piece = { f: GeoFeature; k: number; id: string; chip: number | undefined; centre: [number, number] };
  const pieces: Piece[] = projection.features.map((f, k) => {
    const chip = insularIndex.get(f.properties.id);
    const inChip = chip !== undefined;
    const c = path.centroid(f as unknown as GeoPermissibleObjects) as [number, number];
    return {
      f,
      k,
      id: f.properties.id,
      chip,
      centre: inChip ? [chipBox.x + CHIP.size / 2, chipBox.y + chip * CHIP.row + CHIP.size / 2] : geo.toScreen(c),
    };
  });
  const pieceOf = new Map(pieces.map((p) => [p.id, p]));
  const opacityOf = (id: string) => {
    const i = position.get(id);
    return o.group === copy.all || (i !== undefined && inGroup(i)) ? 1 : 0.32;
  };

  /* Painting order: back to front ON SCREEN, which with the turn is no longer north to
     south. A raised unit must be covered by the one in front, so that one is painted after. */
  const mainland = pieces.filter((p) => p.chip === undefined).sort((a, b) => a.centre[1] - b.centre[1]);
  for (const p of mainland) {
    const g = svgEl("g", { class: "unit", "data-id": p.id, opacity: opacityOf(p.id) });
    if (LAYERS) {
      const side = sideOf(position.get(p.id));
      for (let c = LAYERS; c >= 1; c--) {
        g.append(svgEl("use", { href: `#pz-${p.k}`, x: c * STEP * up[0], y: c * STEP * up[1], fill: side }));
      }
    }
    const faceAttrs: Record<string, string | number | null> = {
      class: "face",
      fill: colourOf(position.get(p.id)),
      stroke: token("--color-paper"),
      "stroke-width": strokeOf(o.level === "departamento" ? 0.7 : 0.22),
    };
    if (LAYERS) {
      g.append(svgEl("use", { ...faceAttrs, href: `#pz-${p.k}`, x: (LAYERS + 1) * STEP * up[0], y: (LAYERS + 1) * STEP * up[1] }));
    } else {
      g.append(svgEl("path", { ...faceAttrs, d: path(p.f as unknown as GeoPermissibleObjects) }));
    }
    layer.append(g);
  }

  if (insularGroup) {
    for (const p of pieces.filter((x) => x.chip !== undefined)) {
      const i = position.get(p.id);
      const g = svgEl("g", { class: "unit", "data-id": p.id, opacity: opacityOf(p.id) });
      g.append(
        svgEl("rect", {
          class: "face",
          rx: 2,
          x: chipBox.x,
          y: chipBox.y + (p.chip as number) * CHIP.row,
          width: CHIP.size,
          height: CHIP.size,
          fill: colourOf(i),
          stroke: token("--color-rule"),
          "stroke-width": 0.6,
        }),
      );
      const name = i === undefined ? p.id : series.nombres[i];
      const label = svgEl("text", {
        x: chipBox.x + CHIP.size + 6,
        y: chipBox.y + (p.chip as number) * CHIP.row + CHIP.size - 2.5,
        "font-size": 10,
        fill: token("--color-body"),
      });
      label.textContent = name.length > 30 ? name.slice(0, 29) + "…" : name;
      g.append(label);
      insularGroup.append(g);
    }
  }

  /* --- Capital names in the municipal view: 1,123 labels do not fit, so only the
     departmental capitals are set and the one that would collide is dropped. */
  if (o.view === "municipios" && series.es_capital) {
    const placed: Array<{ x: number; y: number; w: number; h: number }> = [];
    const names = svgEl("g", { "pointer-events": "none" });
    const capitals = pieces
      .map((p) => ({ ...p, i: position.get(p.id) }))
      .filter((p) => p.chip === undefined && p.i !== undefined && series.es_capital?.[p.i] === true && inGroup(p.i))
      .sort((a, b) => a.centre[1] - b.centre[1]);
    for (const c of capitals) {
      const x = c.centre[0];
      const y = c.centre[1] - blockHeight;
      const name = series.nombres[c.i as number];
      const box = { x: x - 4, y: y - 9, w: name.length * 5.6 + 16, h: 15 };
      if (placed.some((q) => !(box.x > q.x + q.w || box.x + box.w < q.x || box.y > q.y + q.h || box.y + box.h < q.y))) continue;
      placed.push(box);
      names.append(
        svgEl("circle", { cx: x, cy: y, r: 2, fill: token("--color-ink"), stroke: token("--color-paper"), "stroke-width": 1 }),
      );
      const t = svgEl("text", {
        x: x + 5,
        y: y + 3.5,
        "font-size": 10,
        fill: token("--color-body"),
        stroke: token("--color-paper"),
        "stroke-width": 2.6,
        "paint-order": "stroke",
      });
      t.textContent = name;
      names.append(t);
    }
    frame.append(names);
  }

  /* --- Mark of the pinned unit. The dot and the stem are geometry and stay in the SVG;
     the name is HTML above the map, because inside the SVG the text shrinks with the
     canvas and at 0.6 scale a 13-point name reads at 8. It hangs off the unit and not
     off a corner: the top corner belongs to the legend and there the two collide. */
  const markLayer = svgEl("g", { "pointer-events": "none", opacity: 0 });
  const stem = svgEl("line", { stroke: token("--color-ink"), "stroke-width": 1 });
  const dot = svgEl("circle", { r: 2.5, fill: token("--color-ink") });
  markLayer.append(stem, dot);
  svg.append(markLayer);

  /* The legend sits on an opaque band: when the frame closes in on a filter the
     neighbours bleed upward and without the band the ramp reads over the map. */
  const band = svgEl("g");
  band.append(svgEl("rect", { x: 0, y: 0, width, height: top - 4, fill: token("--color-paper") }));
  band.append(legend(width - 8, indicator, paint, fmt, o.year, copy));
  svg.append(band);

  /* --- Interaction. One listener on the container instead of one per unit: with 1,121
     municipalities that would be 1,121 live closures the browser has to check. */
  const wrap = htmlEl("div");
  wrap.style.position = "relative";
  wrap.append(svg);
  host.append(wrap);

  const tip = htmlEl("div", { class: "atlas-tip" });
  const card = htmlEl("div", { class: "atlas-card" });
  card.hidden = true;
  const drill = htmlEl("button", { type: "button", class: "atlas-drill" });
  drill.hidden = true;
  wrap.append(tip, card, drill);

  const idFrom = (e: Event) => {
    const target = e.target as Element | null;
    const g = target?.closest?.("g.unit");
    return g ? g.getAttribute("data-id") : null;
  };

  const onMove = (e: PointerEvent) => {
    const id = idFrom(e);
    focus.hover(id);
    if (id === null || id === focus.pinnedId()) {
      tip.style.opacity = "0";
      return;
    }
    const i = position.get(id);
    const v = i === undefined ? null : values[i];
    tip.style.opacity = "1";
    tip.replaceChildren(
      htmlEl("strong", {}, i === undefined ? id : series.nombres[i]),
      htmlEl("span", {}, `${indicator.etiqueta}, ${o.year}`),
      htmlEl("b", {}, v === null ? copy.noData : fmt(v as number)),
    );
    const box = wrap.getBoundingClientRect();
    tip.style.left = `${Math.min(e.clientX - box.left + 14, box.width - 230)}px`;
    tip.style.top = `${e.clientY - box.top + 12}px`;
  };
  const onLeave = () => {
    tip.style.opacity = "0";
    focus.hover(null);
  };
  const onClick = (e: MouseEvent) => {
    const id = idFrom(e);
    if (id !== null) focus.togglePin(id);
  };
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerleave", onLeave);
  svg.addEventListener("click", onClick);

  /* --- Raising the focused unit. Only one group's attributes are touched; the map is
     never redrawn. */
  let raised: string | null = null;
  const stop = focus.listen(({ id, pinned }) => {
    if (raised !== null && raised !== id) {
      const g = frame.querySelector(`g.unit[data-id="${CSS.escape(raised)}"]`);
      if (g) {
        g.removeAttribute("transform");
        const face = g.querySelector(".face");
        face?.setAttribute("stroke", token("--color-paper"));
        face?.setAttribute("stroke-width", String(strokeOf(o.level === "departamento" ? 0.7 : 0.22)));
      }
    }
    raised = id;
    markLayer.setAttribute("opacity", "0");
    card.hidden = true;
    drill.hidden = true;
    if (pinned) tip.style.opacity = "0";
    if (id === null) return;

    const g = frame.querySelector(`g.unit[data-id="${CSS.escape(id)}"]`) as SVGGElement | null;
    if (!g) return;
    g.parentNode?.appendChild(g);
    const flat = !g.querySelector("use.face") && !LAYERS ? true : g.querySelector("rect.face") !== null;
    /* Raise half the side: less is indistinguishable from a still block, more peels it
       off the country. */
    const lift = flat || !LAYERS ? 0 : (pinned ? 0.5 : 0.22) * LAYERS * STEP;
    if (lift) g.setAttribute("transform", `translate(${lift * up[0]},${lift * up[1]})`);
    const face = g.querySelector(".face");
    face?.setAttribute("stroke", token("--color-ink"));
    face?.setAttribute("stroke-width", String(strokeOf(1.1)));

    const i = position.get(id);
    if (i === undefined || !pinned) return;

    const piece = pieceOf.get(id);
    const [ax, ay0] = piece ? piece.centre : [width / 2, height / 2];
    const ay = ay0 + top - (piece && piece.chip !== undefined ? 0 : blockHeight + lift);
    stem.setAttribute("x1", String(ax));
    stem.setAttribute("y1", String(ay));
    stem.setAttribute("x2", String(ax));
    stem.setAttribute("y2", String(ay - 14));
    dot.setAttribute("cx", String(ax));
    dot.setAttribute("cy", String(ay));
    markLayer.setAttribute("opacity", "1");
    svg.appendChild(markLayer);

    const v = values[i];
    const body = v === null ? copy.noDataYear : `${indicator.etiqueta}: ${fmt(v as number)}`;
    card.replaceChildren(htmlEl("strong", {}, series.nombres[i]), htmlEl("span", {}, body));
    card.hidden = false;

    /* From canvas to screen: the card is placed in real pixels and kept inside the map. */
    const rSvg = svg.getBoundingClientRect();
    const rWrap = wrap.getBoundingClientRect();
    const k = rSvg.width / width;
    const cardTop = rSvg.top - rWrap.top + ay * k;
    /* Above the unit, unless the unit already sits against the top edge: then below, or
       the card would cover exactly what has just been raised. */
    const tooHigh = cardTop < card.offsetHeight + 26;
    card.style.left = `${Math.max(4, Math.min(rWrap.width - card.offsetWidth - 4, rSvg.left - rWrap.left + ax * k - card.offsetWidth / 2))}px`;
    card.style.top = `${Math.max(4, cardTop + (tooHigh ? 16 : -18 * k - card.offsetHeight))}px`;

    if (o.level === "departamento") {
      drill.textContent = fill(copy.drillDown, { name: series.nombres[i] });
      drill.hidden = false;
      drill.onclick = () => o.onDrillDown(series.nombres[i]);
    }
  });

  return () => {
    stop();
    svg.removeEventListener("pointermove", onMove);
    svg.removeEventListener("pointerleave", onLeave);
    svg.removeEventListener("click", onClick);
  };
}

/* A continuous legend, always present, with zero marked when the scale diverges and a
   swatch for "no data" so absence is not read as the low end. */
function legend(
  width: number,
  indicator: Indicator,
  paint: (v: number) => string,
  fmt: (v: number) => string,
  year: number,
  copy: AtlasCopy,
): SVGGElement {
  const g = svgEl("g", { transform: "translate(4,8)" });
  const w = Math.min(300, width - 130);
  const h = 9;
  const y = 22;
  const domain = (paint as unknown as { domain?: () => number[] }).domain?.() ?? [0, 1];
  const [lo, hi] = [domain[0], domain[domain.length - 1]];
  const id = `atlas-grad-${indicator.id}`;
  const defs = svgEl("defs");
  const grad = svgEl("linearGradient", { id });
  for (let t = 0; t <= 1.0001; t += 0.05) {
    grad.append(svgEl("stop", { offset: `${t * 100}%`, "stop-color": paint(lo + t * (hi - lo)) }));
  }
  defs.append(grad);
  const title = svgEl("text", { x: 0, y: y - 8, fill: token("--color-body"), "font-size": 12.5, "font-weight": 600 });
  title.textContent = `${indicator.etiqueta} · ${year}`;
  g.append(defs, title);
  g.append(svgEl("rect", { x: 0, y, width: w, height: h, rx: 2, fill: `url(#${id})`, stroke: token("--color-rule") }));

  const x = scaleLinear().domain([lo, hi]).range([0, w]);
  const marks = indicator.escala === "divergente" ? [lo, 0, hi] : [lo, (lo + hi) / 2, hi];
  marks.forEach((m, i) => {
    const t = svgEl("text", {
      x: x(m),
      y: y + h + 12,
      "text-anchor": i === 0 ? "start" : i === marks.length - 1 ? "end" : "middle",
      fill: token("--color-muted"),
      "font-size": 10.5,
    });
    t.textContent = fmt(m);
    g.append(t);
  });

  const none = svgEl("g", { transform: `translate(${w + 18},${y})` });
  none.append(svgEl("rect", { width: h, height: h, rx: 2, fill: token("--atlas-void"), stroke: token("--color-rule") }));
  const nt = svgEl("text", { x: h + 6, y: h - 1, fill: token("--color-muted"), "font-size": 10.5 });
  nt.textContent = copy.noData;
  none.append(nt);
  g.append(none);
  return g;
}

/* --------------------------------------------------------------- left rail */

type RailArgs = RenderOptions & {
  values: (number | null)[];
  position: Map<string, number>;
  inGroup: (i: number) => boolean;
  fmt: (v: number) => string;
  focus: ReturnType<typeof makeFocus>;
  yearIndex: number;
};

function drawLeftRail(host: HTMLElement, o: RailArgs): () => void {
  const { series, indicator, values, inGroup, fmt, focus, copy, yearIndex } = o;

  /* --- Headline. The median, not the mean: municipal value added per head and municipal
     access have real extremes two orders of magnitude apart, and a mean would follow them. */
  const withData = values.map((v, i) => ({ v, i })).filter((d) => d.v !== null && inGroup(d.i));
  const med = withData.length ? (median(withData, (d) => d.v as number) as number) : null;

  const blockA = block(host, copy.medianLabel);
  const figure = htmlEl("div", { class: "atlas-figure" }, med === null ? "—" : fmt(med));
  const unitName = htmlEl("div", { class: "atlas-unit" });
  const footText = fill(copy.medianFoot, {
    n: withData.length,
    total: series.ids.length,
    ind: indicator.etiqueta.toLowerCase(),
    y: o.year,
  });
  const foot = htmlEl("p", { class: "atlas-foot" }, footText);
  blockA.append(figure, unitName, foot);

  /* --- Evolution: the median year by year, with the focused unit's line above it. They
     share an axis because they are the same magnitude. */
  const blockB = block(host, copy.evolutionLabel);
  const w = 236;
  const h = 74;
  const m = { t: 6, r: 6, b: 15, l: 6 };
  const spark = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", role: "img", "aria-label": copy.evolutionLabel });
  spark.style.height = "auto";
  spark.style.display = "block";
  const matrix = series.series[indicator.id] ?? [];
  const medians = series.anios.map((_, k) => {
    const row = matrix[k] ?? [];
    const vs = row.map((v, i) => ({ v, i })).filter((d) => d.v !== null && inGroup(d.i)).map((d) => d.v as number);
    return vs.length ? (median(vs) as number) : null;
  });
  const all = matrix.flat().filter((v) => v !== null) as number[];
  const x = scaleLinear().domain(extent(series.anios) as [number, number]).range([m.l, w - m.r]);
  const y = scaleLinear().domain((extent(all) as [number, number]) ?? [0, 1]).nice().range([h - m.b, m.t]);
  const line = (row: (number | null)[]) =>
    series.anios
      .map((a, k) => (row[k] === null || row[k] === undefined ? null : `${x(a).toFixed(1)},${y(row[k] as number).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");
  if (indicator.escala === "divergente" && y.domain()[0] < 0) {
    spark.append(svgEl("line", { x1: m.l, x2: w - m.r, y1: y(0), y2: y(0), stroke: token("--color-rule"), "stroke-width": 1 }));
  }
  spark.append(
    svgEl("polyline", { points: line(medians), fill: "none", stroke: token("--color-muted"), "stroke-width": 1.6 }),
  );
  const focusLine = svgEl("polyline", { fill: "none", stroke: token("--color-cold"), "stroke-width": 2.2, opacity: 0 });
  spark.append(focusLine);
  spark.append(
    svgEl("circle", { r: 3, cx: x(o.year), cy: y(medians[yearIndex] ?? y.domain()[0]), fill: token("--color-ink") }),
  );
  const first = svgEl("text", { x: m.l, y: h - 4, "font-size": 10, fill: token("--color-muted") });
  first.textContent = String(series.anios[0]);
  const last = svgEl("text", { x: w - m.r, y: h - 4, "font-size": 10, "text-anchor": "end", fill: token("--color-muted") });
  last.textContent = String(series.anios[series.anios.length - 1]);
  spark.append(first, last);
  blockB.append(spark);

  /* --- The three dimensions plus the composite, as bars from zero. They are standardised
     scores in the same unit and with polarity: a bar from zero is the shape they deserve.
     They are coloured by sign alone, not with the map's ramp, because that ramp is built
     on whichever indicator is selected and here the domain is another one. */
  const DIMS = [
    { id: "iif_compuesto", label: copy.dimensions.compuesto },
    { id: "iif_acceso", label: copy.dimensions.acceso },
    { id: "iif_uso", label: copy.dimensions.uso },
    { id: "iif_profundidad", label: copy.dimensions.profundidad },
  ].filter((d) => series.series[d.id]);

  const blockC = block(host, copy.dimensionsLabel);
  const wd = 236;
  const rowH = 21;
  const hd = DIMS.length * rowH + 14;
  const bars = svgEl("svg", { viewBox: `0 0 ${wd} ${hd}`, width: "100%", role: "img", "aria-label": copy.dimensionsLabel });
  bars.style.height = "auto";
  bars.style.display = "block";
  const maxDim =
    (max(DIMS, (d) => max((series.series[d.id][yearIndex] ?? []).filter((v) => v !== null) as number[], Math.abs)) as number) || 1;
  const xd = scaleLinear().domain([-maxDim, maxDim]).range([56, wd - 34]);
  bars.append(svgEl("line", { x1: xd(0), x2: xd(0), y1: 2, y2: hd - 12, stroke: token("--color-rule"), "stroke-width": 1 }));
  const rows = DIMS.map((d, k) => {
    const yy = k * rowH + 4;
    const label = svgEl("text", { x: 0, y: yy + 10, "font-size": 11, fill: token("--color-body") });
    label.textContent = d.label;
    const bar = svgEl("rect", { y: yy + 2, height: 9, rx: 2 });
    const num = svgEl("text", {
      x: wd,
      y: yy + 10,
      "font-size": 10.5,
      "text-anchor": "end",
      fill: token("--color-ink"),
    });
    bars.append(label, bar, num);
    return { d, bar, num };
  });
  const zero = svgEl("text", { x: xd(0), y: hd - 2, "font-size": 9.5, "text-anchor": "middle", fill: token("--color-muted") });
  zero.textContent = "0";
  bars.append(zero);
  blockC.append(bars);

  const signed = new Intl.NumberFormat(o.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" });
  const paintDims = (idx: number | null) => {
    for (const r of rows) {
      const row = series.series[r.d.id][yearIndex] ?? [];
      const v =
        idx === null
          ? (median(row.map((v2, i) => ({ v2, i })).filter((p) => p.v2 !== null && inGroup(p.i)).map((p) => p.v2 as number)) ?? null)
          : row[idx];
      if (v === null || v === undefined || Number.isNaN(v)) {
        r.bar.setAttribute("width", "0");
        r.num.textContent = "—";
      } else {
        r.bar.setAttribute("x", String(Math.min(xd(0), xd(v))));
        r.bar.setAttribute("width", String(Math.max(1.5, Math.abs(xd(v) - xd(0)))));
        r.bar.setAttribute("fill", v < 0 ? token("--color-neg") : token("--color-cold"));
        r.num.textContent = signed.format(v);
      }
    }
  };

  return focus.listen(({ id }) => {
    const idx = id === null ? null : series.ids.indexOf(id);
    if (idx === null || idx < 0) {
      figure.textContent = med === null ? "—" : fmt(med);
      unitName.textContent = "";
      foot.textContent = footText;
      focusLine.setAttribute("opacity", "0");
      paintDims(null);
      return;
    }
    const v = values[idx];
    figure.textContent = v === null ? "—" : fmt(v);
    unitName.textContent = series.nombres[idx];
    foot.textContent = v === null ? copy.noDataYear : `${indicator.etiqueta}, ${o.year}`;
    focusLine.setAttribute("opacity", "1");
    focusLine.setAttribute("points", line(matrix.map((row) => row[idx])));
    paintDims(idx);
  });
}

function block(host: HTMLElement, title: string) {
  const b = htmlEl("div", { class: "atlas-block" });
  b.append(htmlEl("h3", {}, title));
  host.append(b);
  return b;
}

/* -------------------------------------------------------------- right rail */

type ContextArgs = RenderOptions & {
  values: (number | null)[];
  groupOf: (string | null | undefined)[];
  inGroup: (i: number) => boolean;
  paint: (v: number) => string;
  fmt: (v: number) => string;
  focus: ReturnType<typeof makeFocus>;
};

function drawRightRail(host: HTMLElement, o: ContextArgs): () => void {
  const { series, indicator, values, groupOf, inGroup, paint, fmt, focus, copy } = o;

  /* --- Share by region. Computed over ALL units and dimming those outside the filter:
     its job is to place the selection in the country, so recomputing it inside the filter
     would leave it with nothing to say. */
  const blockA = block(host, o.level === "departamento" ? copy.byRegionLabel : copy.byDepartmentLabel);
  const byGroup = rollups(
    series.ids
      .map((_, i) => ({ g: groupOf[i], v: values[i] }))
      .filter((p) => p.v !== null && p.g) as Array<{ g: string; v: number }>,
    (vs) => median(vs, (p) => p.v) as number,
    (p) => p.g,
  )
    .sort((a, b) => descending(a[1], b[1]))
    .slice(0, 12);

  const wr = 250;
  const hf = 19;
  const hr = byGroup.length * hf + 6;
  const svg = svgEl("svg", {
    viewBox: `0 0 ${wr} ${hr}`,
    width: "100%",
    role: "img",
    "aria-label": o.level === "departamento" ? copy.byRegionLabel : copy.byDepartmentLabel,
  });
  svg.style.height = "auto";
  svg.style.display = "block";
  const maxAbs = (max(byGroup, (d) => Math.abs(d[1])) as number) || 1;
  const xr =
    indicator.escala === "divergente"
      ? scaleLinear().domain([-maxAbs, maxAbs]).range([92, wr - 30])
      : scaleLinear().domain([0, max(byGroup, (d) => d[1]) as number]).range([92, wr - 30]);
  byGroup.forEach((d, k) => {
    const y = k * hf + 2;
    const inside = o.group === copy.all || o.group === d[0];
    // Fuera del filtro: `muted`, no opacidad — body al 40 % sobre papel daba 1,99:1
    // y el nombre de la región sigue siendo información (DA-07).
    const name = svgEl("text", { x: 0, y: y + 10, "font-size": 10.5, fill: token(inside ? "--color-body" : "--color-muted") });
    name.textContent = d[0].length > 15 ? d[0].slice(0, 14) + "…" : d[0];
    svg.append(name);
    svg.append(
      svgEl("rect", {
        y: y + 2,
        height: 9,
        rx: 2,
        x: Math.min(xr(0), xr(d[1])),
        width: Math.max(1.5, Math.abs(xr(d[1]) - xr(0))),
        fill: paint(d[1]),
        opacity: inside ? 1 : 0.35,
      }),
    );
    const num = svgEl("text", {
      x: wr,
      y: y + 10,
      "font-size": 10,
      "text-anchor": "end",
      fill: token(inside ? "--color-ink" : "--color-muted"),
    });
    num.textContent = fmt(d[1]);
    svg.append(num);
  });
  blockA.append(svg);

  /* --- The ranking, which doubles as the table view: it gives the exact number that the
     colour only hints at, which is what a continuous scale with clear steps demands. */
  const rows = series.ids
    .map((id, i) => ({ id, name: series.nombres[i], value: values[i], i }))
    .filter((r) => r.value !== null && inGroup(r.i))
    .sort((a, b) => descending(a.value as number, b.value as number));
  const top = 12;
  const shown: Array<(typeof rows)[number] | null> =
    rows.length <= top + 5 ? rows : [...rows.slice(0, top), null, ...rows.slice(-4)];
  const barWidth = scaleLinear()
    .domain([min0(rows), (max(rows, (r) => r.value as number) as number) ?? 1])
    .range([0, 52])
    .clamp(true);

  const blockB = block(host, fill(copy.rankingLabel, { n: rows.length }));
  const table = htmlEl("table", { class: "atlas-table" });
  const cols = htmlEl("colgroup");
  for (const w of ["46px", "auto", "68px", "54px"]) {
    const c = document.createElement("col");
    c.style.width = w;
    cols.append(c);
  }
  const thead = htmlEl("thead");
  const htr = htmlEl("tr");
  for (const h of [copy.rankingHead.rank, copy.rankingHead.unit, copy.rankingHead.value, ""]) htr.append(htmlEl("th", {}, h));
  thead.append(htr);
  const tbody = htmlEl("tbody");
  const domRows = new Map<string, HTMLTableRowElement>();
  shown.forEach((r) => {
    const tr = htmlEl("tr");
    if (r === null) {
      const td = htmlEl("td", { colspan: "4", class: "atlas-gap" }, fill(copy.moreUnits, { n: rows.length - top - 4 }));
      tr.append(td);
      tbody.append(tr);
      return;
    }
    tr.setAttribute("data-id", r.id);
    /* Sin role="button" en la fila: una fila que se anuncia como botón deja de
       anunciarse como fila, y las celdas pierden su encabezado (WCAG 1.3.1). La
       primera versión sacó de ahí la conclusión «entonces nada» y la fila era
       focalizable y accionable sin rol ni estado: pulsar Enter cambiaba el mapa y
       el lector de pantalla no oía nada (DA-16). El control es un botón DENTRO
       de la celda del nombre, con aria-pressed, que es lo que de verdad alterna;
       la fila sigue siendo fila y conserva sus encabezados. */
    tr.addEventListener("pointerenter", () => focus.hover(r.id));
    tr.addEventListener("pointerleave", () => focus.hover(null));
    tr.append(htmlEl("td", { class: "num muted" }, String(rows.indexOf(r) + 1)));
    const btn = htmlEl("button", { type: "button", class: "atlas-rowbtn", "aria-pressed": "false" }, r.name);
    btn.addEventListener("click", () => focus.togglePin(r.id));
    const nameTd = htmlEl("td");
    nameTd.append(btn);
    tr.append(nameTd);
    tr.append(htmlEl("td", { class: "num" }, fmt(r.value as number)));
    const pill = htmlEl("td");
    const span = htmlEl("span", { class: "atlas-pill" });
    span.style.width = `${Math.max(2, barWidth(r.value as number))}px`;
    span.style.background = paint(r.value as number);
    pill.append(span);
    tr.append(pill);
    tbody.append(tr);
    domRows.set(r.id, tr);
  });
  table.append(cols, thead, tbody);
  blockB.append(table);

  return focus.listen(({ id }) => {
    for (const [k, tr] of domRows) {
      if (k === id) tr.setAttribute("data-active", "yes");
      else tr.removeAttribute("data-active");
      tr.querySelector("button")?.setAttribute("aria-pressed", k === id ? "true" : "false");
    }
  });
}

const min0 = (rows: Array<{ value: number | null }>) =>
  Math.min(0, ...rows.map((r) => r.value as number).filter((v) => Number.isFinite(v)));
