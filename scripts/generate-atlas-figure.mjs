// ============================================================
// Genera la figura estática del atlas para la portada.
//
// Por qué existe. El atlas interactivo arranca a 2.820px de una página de
// 7.489 en escritorio y a 4.608 de 12.349 en móvil — cinco pantallas y media —
// dentro de una ruta que ya está a dos clics de la portada. Es el artefacto más
// bonito del sitio y no lo ve nadie. Llevarlo entero a la portada cuesta 257 KB
// de JSON (92 KB comprimidos) más d3 y topojson, y se disparan al hidratar
// aunque el lector no baje nunca. Esta figura son ~11 KB comprimidos, cero
// JavaScript, y se imprime.
//
// Qué dibuja. El índice compuesto en 2018 y en 2025, en la MISMA escala. El
// índice está estandarizado contra 2018: ese año 17 de 32 departamentos están
// bajo cero y en 2025 solo queda uno (las medianas exactas, en ATLAS_FIGURE).
// Todo el país subió. Esa deriva común es exactamente la razón de que el
// coeficiente se caiga a cero al añadir efectos de tiempo — la especificación
// ingenua la recoge y publica un coeficiente muy significativo que no
// significa nada (la cifra vive en lib/data/thesis-results.ts).
// Escalar cada mapa contra sí mismo escondería el hallazgo, así que la escala
// es una sola para los dos paneles.
//
// Los colores salen como `var(--atlas-*)`, los mismos tokens que el atlas
// interactivo: el SVG es estático pero sigue el tema, y las dos superficies no
// pueden desincronizarse porque leen la misma rampa.
//
// El trazo va en `--color-coldline` y no en papel. Sobre la banda fría el tono
// neutro de la rampa (#edf0f3) y el fondo (#e6eef7) se diferencian en 1,05:1:
// con límites blancos, el panel de 2018 —que es casi todo neutro— desaparecía
// de la página. La línea es lo que mantiene el país dibujado cuando el relleno
// no lo hace.
//
// Se ejecuta a mano con `npm run atlas` y su salida se versiona, igual que el
// `.tex` y el `.pdf` del CV: el build no depende de la red ni de este script.
// ============================================================
import { geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ATLAS = path.join(ROOT, "public", "atlas");
const OUT = path.join(ROOT, "lib", "generated", "atlas-figure.ts");

/** Ancho de cada panel. Dos caben en la medida de 1080px con aire de sobra, y a
 *  este tamaño la tolerancia de simplificación de abajo es invisible. */
const W = 300;
const H = 380;
const GAP = 44;
const TOP = 26;
/** Píxeles de desvío máximo permitido al simplificar. Sobre un panel de 300px
 *  el ojo no distingue el contorno del original y los puntos caen de 29.781 a
 *  unos 1.500. */
const TOL = 0.8;

const RAMP = [
  "--atlas-neg-3",
  "--atlas-neg-2",
  "--atlas-neg-1",
  "--atlas-mid",
  "--atlas-pos-1",
  "--atlas-pos-2",
  "--atlas-pos-3",
];

const read = (f) => JSON.parse(fs.readFileSync(path.join(ATLAS, f), "utf8"));

/** Douglas-Peucker sobre coordenadas YA proyectadas, es decir en píxeles de la
 *  figura final. Simplificar en grados no sirve: el mismo error angular pesa
 *  distinto arriba y abajo del mapa. */
function simplify(points, tol) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    if (j - i < 2) continue;
    const [x1, y1] = points[i];
    const [x2, y2] = points[j];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    let best = -1;
    let bi = -1;
    for (let k = i + 1; k < j; k++) {
      const [x, y] = points[k];
      // Un anillo es cerrado: su primer y su último punto coinciden y la recta
      // entre ambos es degenerada. Ahí la distancia útil es al propio vértice,
      // no a una recta que no existe — sin esta rama el algoritmo se queda con
      // dos puntos por anillo y el mapa sale vacío.
      const d =
        len < 1e-6
          ? Math.hypot(x - x1, y - y1)
          : Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / len;
      if (d > best) {
        best = d;
        bi = k;
      }
    }
    if (best > tol) {
      keep[bi] = 1;
      stack.push([i, bi], [bi, j]);
    }
  }
  return points.filter((_, k) => keep[k]);
}

const ringsOf = (g) =>
  g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];

function main() {
  const topo = read("geo_departamentos.json");
  const series = read("series_departamento.json");
  const meta = read("atlas_meta.json");

  const objectName = Object.keys(topo.objects)[0];
  const fc = feature(topo, topo.objects[objectName]);
  const projection = geoMercator().fitSize([W, H], fc);

  const indicatorId = "iif_compuesto";
  const indicator = meta.indicadores.departamento.find((i) => i.id === indicatorId);
  if (!indicator) throw new Error(`Indicador ${indicatorId} ausente en atlas_meta.json`);

  const years = series.anios;
  const table = series.series[indicatorId];
  if (!table) throw new Error(`Serie ${indicatorId} ausente en series_departamento.json`);
  // Desde la capa de proyección (ADR-019 a ADR-023 del repositorio de la
  // tesis), `anios` llega hasta 2028 y el índice no tiene valor en los años
  // proyectados: tomar «el último año» pintaba un panel vacío y una mediana
  // NaN. Los paneles salen del primer y el último año OBSERVADOS del índice.
  const projected = new Set(series.anios_proyectados ?? []);
  const observed = years
    .map((_, i) => i)
    .filter((i) => !projected.has(years[i]) && (table[i] ?? []).some((v) => v != null));
  if (observed.length < 2) throw new Error(`${indicatorId}: menos de dos años observados`);
  const pick = [observed[0], observed[observed.length - 1]];

  // Una escala, siete pasos, simétrica alrededor de cero — el índice es un
  // score estandarizado y el cero es real, no el centro del rango observado.
  const pooled = pick.flatMap((i) => table[i]).filter((v) => v != null);
  const m = Math.max(...pooled.map(Math.abs)) || 1;
  const cuts = Array.from({ length: RAMP.length - 1 }, (_, i) => -m + (2 * m * (i + 1)) / RAMP.length);
  const bucketOf = (v) => {
    if (v == null) return null;
    let i = 0;
    while (i < cuts.length && v > cuts[i]) i++;
    return i;
  };

  const pad = (id) => String(id).padStart(2, "0");

  // La geometría es la misma en los dos paneles: solo cambia el relleno. Next
  // serializa el árbol del servidor dos veces —una en el HTML y otra en el
  // payload de hidratación—, así que cada byte aquí se paga cuatro veces con
  // dos paneles. Los trazados se declaran una vez en <defs> y cada panel los
  // referencia con <use>, que hereda el fill del elemento que referencia.
  const shapes = [];
  for (const f of fc.features) {
    let d = "";
    for (const poly of ringsOf(f.geometry)) {
      for (const ring of poly) {
        const projected = ring.map((c) => projection(c)).filter(Boolean);
        const kept = simplify(projected, TOL);
        if (kept.length < 3) continue;
        d += "M" + kept.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join("L") + "Z";
      }
    }
    if (d) shapes.push({ id: pad(f.properties.id), d });
  }
  const defs = `<defs>${shapes.map((s) => `<path id="af-${s.id}" d="${s.d}"/>`).join("")}</defs>`;

  const panel = (yearIndex) => {
    const values = table[yearIndex];
    const byId = new Map(series.ids.map((id, k) => [pad(id), values[k]]));
    return shapes
      .map((s) => {
        const bucket = bucketOf(byId.get(s.id));
        const fill = bucket === null ? "var(--atlas-void)" : `var(${RAMP[bucket]})`;
        return `<use href="#af-${s.id}" fill="${fill}"/>`;
      })
      .join("");
  };

  const panels = pick.map((yearIndex) => ({ year: years[yearIndex], paths: panel(yearIndex) }));

  const width = W * 2 + GAP;
  const height = H + TOP;
  // `height` va en el ESTILO, no en el atributo. Como atributo SVG exige una
  // longitud —`auto` no lo es— y el navegador lo rechaza con
  // «<svg> attribute height: Expected length, "auto"» en la consola de la
  // portada. Se recupera solo, pero el estándar de verificación de este repo
  // es cero errores de consola, y un error tolerado enseña a ignorar la consola.
  // En CSS `height:auto` sí es válido y es exactamente lo que se quería: con el
  // `viewBox` puesto, el alto sale de la proporción. El atributo `style` lo
  // permite la CSP (`style-src-attr 'unsafe-inline'`), que existe justo para esto.
  const svg =
    `<svg viewBox="0 0 ${width} ${height}" width="100%" style="height:auto" role="img" aria-labelledby="atlas-figure-title" preserveAspectRatio="xMidYMid meet">` +
    `<title id="atlas-figure-title">TITLE_SLOT</title>` +
    defs +
    panels
      .map(
        (p, k) =>
          `<text x="${k * (W + GAP)}" y="14" font-size="12.5" font-weight="600" letter-spacing="0.09em" fill="var(--color-muted)">${p.year}</text>` +
          `<g transform="translate(${k * (W + GAP)},${TOP})" stroke="var(--color-control)" stroke-width="0.5" stroke-linejoin="round">${p.paths}</g>`,
      )
      .join("") +
    `</svg>`;

  // Cuántos departamentos están bajo la línea base de 2018 en cada panel: es la
  // cifra que sostiene el pie de la figura, y sale del dato, no del ojo.
  const below = pick.map((i) => table[i].filter((v) => v != null && v < 0).length);
  const counted = pick.map((i) => table[i].filter((v) => v != null).length);
  const medianOf = (i) => {
    const v = table[i].filter((x) => x != null).sort((a, b) => a - b);
    return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  };
  const medians = pick.map(medianOf);

  // La tabla de la deriva de /historia (§03): primer año, 2021 y último año
  // observados. Estaba escrita a mano en el diccionario y ya no coincidía con
  // los datos que esta misma figura pinta; ahora sale de aquí.
  const mid = observed.find((i) => years[i] === 2021) ?? observed[Math.floor(observed.length / 2)];
  const drift = [pick[0], mid, pick[1]].map((i) => ({
    year: years[i],
    median: Number(medianOf(i).toFixed(2)),
    below: table[i].filter((v) => v != null && v < 0).length,
    counted: table[i].filter((v) => v != null).length,
  }));

  const body = `// GENERADO POR scripts/generate-atlas-figure.mjs — no editar a mano.
// Se regenera con \`npm run atlas\` cuando cambien los datos de public/atlas/.
// El porqué de esta figura está en la cabecera de ese script.

export const ATLAS_FIGURE = {
  /** El \`<title>\` se inyecta en render desde el diccionario: el SVG es el mismo
   *  en los dos idiomas y su nombre accesible no puede serlo. */
  svg: ${JSON.stringify(svg)},
  ramp: ${JSON.stringify(RAMP)},
  years: ${JSON.stringify(panels.map((p) => p.year))},
  /** Departamentos por debajo de la línea base de 2018, y cuántos se midieron. */
  below: ${JSON.stringify(below)},
  counted: ${JSON.stringify(counted)},
  medians: ${JSON.stringify(medians.map((v) => Number(v.toFixed(2))))},
  /** La deriva que cuenta /historia: mediana y departamentos bajo cero por año. */
  drift: ${JSON.stringify(drift)},
  source: ${JSON.stringify(meta.fuente ?? "")},
  generatedAt: ${JSON.stringify(meta.generado_en ?? "")},
} as const;
`;

  fs.writeFileSync(OUT, body);
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(`✓ ${path.relative(ROOT, OUT)}`);
  console.log(
    `  ${panels.map((p) => p.year).join(" → ")} · ${shapes.length} departamentos · SVG ${kb(svg.length)} KB`,
  );
  console.log(
    `  bajo la base de 2018: ${below[0]}/${counted[0]} → ${below[1]}/${counted[1]} · mediana ${medians[0].toFixed(2)} → ${medians[1].toFixed(2)}`,
  );
}

main();
