/* El laboratorio de pronóstico lee public/forecast-lab/*.json, que genera otro
   repositorio. Tres cosas pueden romperse en silencio:

   1. El contrato: una serie con un pronóstico de menos corre cada punto un período, y
      el gráfico dibuja el error de 2021 sobre 2020 sin que nada se queje.
   2. La aritmética de períodos: «2006Q1» + 4 tiene que ser «2007Q1», no «2006Q5».
   3. Las cifras escritas a mano en lib/content/forecast.ts (0,86; 17 de 20; 4 de 18):
      si el laboratorio se vuelve a correr y cambian, la página mentiría con los datos
      nuevos a su lado. Aquí se derivan de los JSON y se comparan con el texto. */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { nOrigins, periodLabel, regimeOf, relMae, type Meta, type Series, type Summary } from "../lib/data/forecast-lab";
import { forecast } from "../lib/content/forecast";

const DIR = path.join(process.cwd(), "public", "forecast-lab");
const read = <T,>(f: string) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as T;
const meta = read<Meta>("meta.json");
const summary = read<Summary>("resumen.json");
const series = { anual: read<Series[]>("series_anual.json"), trimestral: read<Series[]>("series_trimestral.json") };

test("la aritmética de períodos cruza años y trimestres", () => {
  assert.equal(periodLabel("1961", 59), "2020");
  assert.equal(periodLabel("2006Q1", 4), "2007Q1");
  assert.equal(periodLabel("2006Q3", 2), "2007Q1");
  assert.equal(regimeOf("2020Q2", meta.ruptura), "ruptura");
  assert.equal(regimeOf("2022", meta.ruptura), "calma");
});

test("cada serie trae un pronóstico por origen y por modelo, ni uno más ni uno menos", () => {
  for (const [freq, list] of Object.entries(series)) {
    assert.ok(list.length > 0, `${freq}: sin series`);
    for (const s of list) {
      const n = nOrigins(s);
      assert.ok(n > 8, `${freq}/${s.iso3}: ${n} orígenes`);
      for (const m of meta.modelos) {
        assert.equal(s.pron[m.id]?.length, n, `${freq}/${s.iso3}/${m.id}: ${s.pron[m.id]?.length} pronósticos para ${n} orígenes`);
      }
      // El ingenuo es, por definición, el último dato: si no coincide, la serie está corrida.
      for (let j = 0; j < n; j++) {
        const g = s.pron.naive[j];
        const last = s.y[s.o0 + j - 1];
        if (g != null && last != null) assert.ok(Math.abs(g - last) < 0.011, `${freq}/${s.iso3}: ingenuo corrido en el origen ${j}`);
      }
    }
  }
});

test("las economías trimestrales de meta son exactamente las que tienen serie", () => {
  const conSerie = series.trimestral.map((s) => s.iso3).sort();
  const enMeta = meta.paises.filter((p) => p.trimestral).map((p) => p.iso3).sort();
  assert.deepEqual(enMeta, conSerie);
  const anuales = series.anual.map((s) => s.iso3).sort();
  assert.deepEqual(meta.paises.filter((p) => p.anual).map((p) => p.iso3).sort(), anuales);
});

test("el ingenuo contra sí mismo vale 1, y el cociente usa los mismos orígenes", () => {
  const col = series.anual.find((s) => s.iso3 === "COL");
  assert.ok(col);
  assert.equal(relMae(col, "naive"), 1);
  assert.ok(Number.isFinite(relMae(col, "ar1")));
});

test("las cifras escritas en la página salen de los datos que la página muestra", () => {
  for (const lang of ["es", "en"] as const) {
    const t = forecast[lang].forecastLab;
    const dec = lang === "es" ? "," : ".";

    // 0,86 / 0.862: la mediana del AR(1) en calma, anual
    const ar1 = summary.agregado.anual.find((r) => r.id === "ar1");
    assert.ok(ar1?.calma.mediana != null);
    const med2 = ar1.calma.mediana.toFixed(2).replace(".", dec);
    const med3 = ar1.calma.mediana.toFixed(3).replace(".", dec);
    assert.equal(t.figures[1].value, med2, `${lang}: la cifra del AR(1)`);
    assert.ok(t.verdict.stat.startsWith(med3), `${lang}: el veredicto dice ${t.verdict.stat}, los datos ${med3}`);
    assert.ok(t.verdict.stat.includes(`${series.anual.length} econom`), `${lang}: el veredicto cuenta ${series.anual.length} economías anuales`);

    // 17 de 20: economías con cero años al exigir las 33 variables
    const cero = summary.frontera.filter((f) => f.completos[32] === 0).length;
    const total = summary.frontera.length;
    assert.equal(t.figures[3].value, `${cero} ${lang === "es" ? "de" : "of"} ${total}`, `${lang}: la frontera`);

    // 20: economías con alguna serie (anual o trimestral); la nota dice cuántas anuales
    const conSerie = new Set([...series.anual, ...series.trimestral].map((s) => s.iso3));
    assert.equal(t.figures[0].value, String(conSerie.size), `${lang}: economías`);
    assert.ok(t.figures[0].note.startsWith(String(series.anual.length)), `${lang}: la nota dice ${t.figures[0].note}, las anuales son ${series.anual.length}`);

    // 4 de 18: el contador del widget de Holm lo calcula; aquí se fija que haya 18 filas,
    // porque el interruptor dice «18 comparaciones».
    assert.equal(summary.holm.length, 18, "el interruptor de Holm habla de 18 comparaciones");
    assert.match(t.lab.holm.switch, /18/);
  }
});

// ---------------------------------------------------------------- el panel

import { seasonalProfile, type Events, type Ise, type Panel } from "../lib/data/forecast-lab";

const panel = read<Panel>("panel.json");
const ise = read<Ise>("ise.json");
const events = read<Events>("eventos.json");

test("el panel: cada serie mide lo mismo que el eje de años, y cada economía tiene sus diez métricas", () => {
  for (const p of meta.paises) {
    const d = panel.datos[p.iso3];
    assert.ok(d, `${p.iso3}: sin datos en el panel`);
    for (const ind of panel.indicadores) {
      assert.equal(d[ind.id]?.length, panel.anios.length, `${p.iso3}/${ind.id}`);
    }
  }
});

test("el tramo roto de Honduras llega como faltante, no como cero (B-010)", () => {
  assert.ok(panel.defectos?.some((x) => x.iso3 === "HND"), "el panel declara el defecto");
  const g = panel.datos.HND.pib_crecimiento;
  for (let y = 1990; y <= 1999; y++) assert.equal(g[panel.anios.indexOf(y)], null, `HND ${y}`);
  assert.ok(g[panel.anios.indexOf(2005)] != null, "fuera del tramo el dato sigue");
});

test("los eventos caen dentro del panel, en economías que existen, y no llevan cifras de magnitud", () => {
  const cats = new Set(events.categorias.map((c) => c.id));
  const isos = new Set(meta.paises.map((p) => p.iso3));
  for (const e of events.eventos) {
    assert.ok(panel.anios.includes(e.anio), `${e.titulo_es}: ${e.anio} fuera del panel`);
    assert.ok(e.iso3 === "LATAM" || isos.has(e.iso3), `${e.titulo_es}: ${e.iso3}`);
    assert.ok(cats.has(e.cat), `${e.titulo_es}: categoría ${e.cat}`);
    for (const t of [e.texto_es, e.texto_en]) assert.ok(!t.includes("%"), `la magnitud la pone la serie: ${t}`);
  }
});

test("el ISE trae sus 16 series del mismo largo, y el perfil estacional suma cero", () => {
  assert.equal(ise.series.length, 16);
  const n = ise.series[0].v.length;
  for (const s of ise.series) assert.equal(s.v.length, n, s.id);
  const month = Number(ise.inicio.split("-")[1]);
  const prof = seasonalProfile(ise.series[0].v, month);
  assert.equal(prof.length, 12);
  assert.ok(prof.every(Number.isFinite));
  assert.ok(Math.abs(prof.reduce((a, b) => a + b, 0)) < 1e-6, "los desvíos frente al promedio del año suman cero");
});

// ---------------------------------------------------------------- el pronóstico (D-008 del laboratorio)

import type { Forecast } from "../lib/data/forecast-lab";
const fcData = read<Forecast>("pronostico.json");

test("el pronóstico llega hasta 2027 con bandas ordenadas y su cobertura medida", () => {
  assert.ok(fcData.economias.length >= 19, `${fcData.economias.length} economías`);
  for (const e of fcData.economias) {
    assert.equal(e.pronostico[e.pronostico.length - 1].anio, 2027, e.iso3);
    for (const f of e.pronostico) assert.ok(f.lo95 <= f.lo80 && f.lo80 <= f.media && f.media <= f.hi80 && f.hi80 <= f.hi95, `${e.iso3} ${f.anio}`);
    assert.ok(e.cobertura.c80 >= 0 && e.cobertura.c95 <= 1 && e.cobertura.c80 <= e.cobertura.c95, `${e.iso3}: cobertura`);
  }
  const r = fcData.cobertura_region;
  assert.ok(r.n > 500 && r.c95 > 0.8 && r.c95 <= 1, "la cobertura regional es una proporción medida sobre cientos de pronósticos");
});
