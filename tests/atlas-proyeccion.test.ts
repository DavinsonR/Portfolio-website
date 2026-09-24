// ============================================================
// La capa de proyección del atlas (tesis, ADR-019 a ADR-023) contra los JSON REALES de
// public/atlas: si la tesis re-exporta y cambia algo que el sitio afirma, falla aquí y no
// en producción. Sin framework: `node --test` y `node:assert`, cargados por tsx.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aniosDelGrupo, enPorCiento, esAnclada, fechaCorte, lecturaEscenario, mesesDesde, ANCHO, EN_FRACCION } from "../components/atlas/proyeccion";
import type { AtlasMeta, Series } from "../components/atlas/types";
import { projects } from "../lib/content/projects";

const leer = <T>(f: string) => JSON.parse(readFileSync(`public/atlas/${f}`, "utf8")) as T;
const serie = leer<Series>("series_departamento.json");
const meta = leer<AtlasMeta>("atlas_meta.json");
const proy = serie.anios_proyectados ?? [];

test("los años se reparten sin solaparse: medidos para el índice, proyectados para la proyección", () => {
  assert.ok(proy.length > 0, "la exportación ya no trae años proyectados");
  const medidos = aniosDelGrupo(serie.anios, proy, false);
  const proyectados = aniosDelGrupo(serie.anios, proy, true);
  assert.deepEqual([...medidos, ...proyectados], serie.anios);
  assert.ok(Math.max(...medidos) < Math.min(...proyectados));
  // sin capa de proyección, todo es medido
  assert.deepEqual(aniosDelGrupo([2020, 2021], undefined, false), [2020, 2021]);
});

test("ningún indicador medido tiene valor en un año proyectado, y cada proyección solo ahí", () => {
  for (const ind of meta.indicadores.departamento) {
    const m = serie.series[ind.id];
    assert.ok(m, `falta la serie ${ind.id}`);
    serie.anios.forEach((a, k) => {
      const con = (m[k] ?? []).some((v) => v !== null);
      const esProy = proy.includes(a);
      if (ind.grupo === "proyeccion") assert.equal(con, esProy, `${ind.id} ${a}`);
      else if (esProy) assert.equal(con, false, `${ind.id} tiene valor en ${a}, que es proyectado`);
    });
  }
});

test("ninguna proyección viaja sin su ancho de intervalo (ADR-022, decisión 6)", () => {
  const anchos = serie.series[ANCHO];
  assert.ok(anchos, "falta intervalo_ancho_proy");
  for (const a of proy) {
    const fila = anchos[serie.anios.indexOf(a)];
    const proyectado = serie.series.crecimiento_pib_real_proy[serie.anios.indexOf(a)];
    fila.forEach((w, i) => {
      if (proyectado[i] !== null) assert.ok(w !== null && w > 0, `${serie.nombres[i]} ${a} sin ancho`);
    });
  }
});

test("el crecimiento por habitante medido pasa a por ciento, una sola vez", () => {
  const conv = enPorCiento(serie);
  for (const id of EN_FRACCION) {
    const antes = serie.series[id].flat().filter((v): v is number => v !== null);
    const despues = conv.series[id].flat().filter((v): v is number => v !== null);
    if (antes.every((v) => Math.abs(v) < 1)) {
      despues.forEach((v, k) => assert.ok(Math.abs(v - antes[k] * 100) < 1e-9));
    } else assert.deepEqual(despues, antes);
    // idempotente: convertir lo convertido no lo toca
    assert.deepEqual(enPorCiento(conv).series[id], conv.series[id]);
  }
  // mismo orden de magnitud que el proyectado: medianas de 2025 y 2026 a menos de 10 pp
  const med = (xs: (number | null)[]) => {
    const v = xs.filter((x): x is number => x !== null).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  };
  const k25 = serie.anios.indexOf(Math.min(...proy) - 1);
  const k26 = serie.anios.indexOf(Math.min(...proy));
  const medido = med(conv.series.crecimiento_pib_real_pc[k25]);
  const proyectado = med(conv.series.crecimiento_pib_real_pc_proy[k26]);
  assert.ok(Math.abs(medido - proyectado) < 10);
  // y la conversión ocurrió de verdad: en fracción, la mediana medida sería menor que 0,1
  assert.ok(Math.abs(medido) >= 0.1, `el crecimiento por habitante medido sigue en fracción (${medido})`);
});

test("el ancla solo se atribuye a las series ancladas", () => {
  const ids = meta.indicadores.departamento.filter((i) => i.grupo === "proyeccion").map((i) => i.id);
  assert.deepEqual(ids.filter(esAnclada).sort(), ["crecimiento_pib_real_pc_proy", "crecimiento_pib_real_proy"]);
});

test("la lectura del escenario solo acompaña a las series ancladas, y sin la edad congelada", () => {
  const lectura = serie.proyeccion?.escenario?.lectura;
  assert.ok(lectura, "la exportación ya no trae escenario.lectura");
  assert.equal(lecturaEscenario("crecimiento_pib_real_proy_sin_anclar", lectura), null);
  assert.equal(lecturaEscenario(ANCHO, lectura), null);
  const anclada = lecturaEscenario("crecimiento_pib_real_proy", lectura);
  assert.ok(anclada && !/meses de antigüedad/.test(anclada), "la edad congelada sigue en la lectura");
});

test("la edad del ancla se mide desde su corte, no desde la exportación", () => {
  const a = serie.proyeccion?.ancla;
  assert.ok(a?.fecha_corte, "la exportación no trae el corte del ancla");
  assert.ok(fechaCorte(a.fecha_corte) !== null, `el corte ${a.fecha_corte} ya no es AAAA-MM-DD`);
  assert.equal(fechaCorte("mayo 2025"), null);
  const m = mesesDesde("2025-05-15", Date.parse("2026-09-24T00:00:00Z"));
  assert.ok(m !== null && Math.abs(m - 16.3) < 0.1, `edad ${m}`);
  assert.equal(mesesDesde("fecha rota", Date.now()), null);
  assert.equal(mesesDesde("2030-01-01", Date.parse("2026-01-01T00:00:00Z")), null);
});

test("lo que la nota afirma de Meta y Amazonas sigue siendo cierto en cada año proyectado", () => {
  const anchos = serie.series[ANCHO];
  const iMeta = serie.nombres.findIndex((n) => n === "Meta");
  const iAmaz = serie.nombres.findIndex((n) => n === "Amazonas");
  assert.ok(iMeta >= 0 && iAmaz >= 0);
  for (const a of proy) {
    const fila = anchos[serie.anios.indexOf(a)].map((w, i) => ({ w: w as number, i })).filter((d) => d.w !== null);
    const orden = [...fila].sort((x, y) => y.w - x.w).map((d) => d.i);
    assert.equal(orden[orden.length - 1], iAmaz, `${a}: Amazonas ya no es el más estrecho`);
    assert.ok(orden.indexOf(iMeta) < 5, `${a}: Meta ya no está entre los cinco más anchos`);
  }
  // «80 %» está escrito a mano en la nota, la etiqueta y el pie del ancho
  assert.equal(serie.proyeccion?.nivel_intervalo, 0.8, "cambió el nivel del intervalo: actualizar el «80 %» del diccionario");
  // y la nota lo dice igual en los dos idiomas
  for (const lang of ["es", "en"] as const) {
    const foot = projects[lang].thesis.atlasCopy.projectedFoot;
    assert.match(foot, /3[,.]2/);
    assert.match(foot, /0[,.]07/);
  }
});
