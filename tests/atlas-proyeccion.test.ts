// ============================================================
// La capa de proyección del atlas (D-36; tesis, ADR-019 a ADR-023) contra los JSON REALES
// de public/atlas: si la tesis re-exporta y cambia algo que el sitio da por hecho, falla
// aquí y no en producción. Sin framework: `node --test` y `node:assert`, cargados por tsx.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { enPorCiento, esAnclada, unidad, EN_FRACCION } from "../components/atlas/unidades";
import type { AtlasMeta, Series } from "../components/atlas/types";
import { projects } from "../lib/content/projects";

const leer = <T>(f: string) => JSON.parse(readFileSync(`public/atlas/${f}`, "utf8")) as T;
const serie = leer<Series>("series_departamento.json");
const meta = leer<AtlasMeta>("atlas_meta.json");
const proy = serie.anios_proyectados ?? [];
const ANCHO = "intervalo_ancho_proy";

test("cada indicador tiene valor solo en su tramo: medidos hasta el último dato, proyección después", () => {
  assert.ok(proy.length > 0, "la exportación ya no trae años proyectados");
  for (const ind of meta.indicadores.departamento) {
    const m = serie.series[ind.id];
    assert.ok(m, `falta la serie ${ind.id}`);
    serie.anios.forEach((a, k) => {
      const con = (m[k] ?? []).some((v) => v !== null);
      if (ind.grupo === "proyeccion") assert.equal(con, proy.includes(a), `${ind.id} ${a}`);
      else if (proy.includes(a)) assert.equal(con, false, `${ind.id} tiene valor en ${a}, que es proyectado`);
    });
  }
});

test("ninguna proyección viaja sin su ancho de intervalo (ADR-022, decisión 6)", () => {
  const anchos = serie.series[ANCHO];
  assert.ok(anchos, "falta intervalo_ancho_proy");
  for (const a of proy) {
    const k = serie.anios.indexOf(a);
    serie.series.crecimiento_pib_real_proy[k].forEach((v, i) => {
      if (v !== null) assert.ok(anchos[k][i] !== null && (anchos[k][i] as number) > 0, `${serie.nombres[i]} ${a} sin ancho`);
    });
  }
});

test("el crecimiento por habitante medido pasa a por ciento, una sola vez", () => {
  const conv = enPorCiento(serie);
  for (const id of EN_FRACCION) {
    const antes = serie.series[id].flat().filter((v): v is number => v !== null);
    const despues = conv.series[id].flat().filter((v): v is number => v !== null);
    if (antes.every((v) => Math.abs(v) < 1)) despues.forEach((v, k) => assert.ok(Math.abs(v - antes[k] * 100) < 1e-9));
    else assert.deepEqual(despues, antes);
    assert.deepEqual(enPorCiento(conv).series[id], conv.series[id], "convertir lo convertido lo cambia");
  }
  const med = (xs: (number | null)[]) => {
    const v = xs.filter((x): x is number => x !== null).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  };
  const k0 = serie.anios.indexOf(Math.min(...proy));
  const medido = med(conv.series.crecimiento_pib_real_pc[k0 - 1]);
  const proyectado = med(conv.series.crecimiento_pib_real_pc_proy[k0]);
  // misma unidad: en fracción la mediana medida sería menor que 0,1 y quedaría a más de un punto
  assert.ok(Math.abs(medido) >= 0.1, `el medido sigue en fracción (${medido})`);
  assert.ok(Math.abs(medido - proyectado) < 10);
});

test("el ancla y el escenario condicional solo acompañan a las series ancladas", () => {
  const ids = meta.indicadores.departamento.filter((i) => i.grupo === "proyeccion").map((i) => i.id);
  assert.ok(ids.includes("crecimiento_pib_real_proy_sin_anclar") && ids.includes(ANCHO));
  assert.deepEqual(ids.filter(esAnclada).sort(), ["crecimiento_pib_real_pc_proy", "crecimiento_pib_real_proy"]);
  // y la capa sin anclar tiene su propia frase, en los dos idiomas
  for (const lang of ["es", "en"] as const) {
    const f = projects[lang].thesis.atlasCopy.forecast;
    assert.ok(f.scenarioUnanchored && f.scenarioUnanchored !== f.scenario);
    assert.doesNotMatch(f.scenarioUnanchored, /condicional al ancla|conditional on the anchor/);
  }
});

test("cada cifra de crecimiento lleva «%» y el ancho «pp»; el resto, nada", () => {
  for (const ind of meta.indicadores.departamento) {
    const u = unidad(ind.id, "es-CO");
    if (ind.id === ANCHO) assert.equal(u, " pp");
    else if (ind.id.startsWith("crecimiento_")) assert.equal(u, " %");
    else assert.equal(u, "", `${ind.id} no debería llevar unidad añadida`);
  }
  assert.equal(unidad("crecimiento_pib_real_proy", "en-US"), "%");
});

test("el estado del proyecto ya no anuncia la proyección en el mapa como pendiente", () => {
  for (const lang of ["es", "en"] as const) {
    const texto = JSON.stringify(projects[lang].thesis);
    assert.doesNotMatch(texto, /Después: la proyección sobre el mapa|Next: the forecast on this page's map/);
  }
});

test("la fuente del ancla que exporta la tesis tiene nombre en los dos idiomas", () => {
  const fuente = serie.proyeccion?.ancla?.fuente;
  assert.ok(fuente, "la exportación no trae ancla.fuente");
  for (const lang of ["es", "en"] as const) {
    const nombres: Record<string, string> = projects[lang].thesis.atlasCopy.forecast.anchorSources;
    const nombre = nombres[fuente];
    assert.ok(nombre, `${lang}: sin nombre para «${fuente}»; añadirlo a anchorSources al re-exportar`);
  }
});
