/* Prueba de humo del panorama: renderiza el tablero entero en Node, con los JSON reales,
   para cada una de las diez métricas y con filtros extremos. No mira píxeles; exige que
   ninguna vista reviente y que ningún número se pinte como NaN, Infinity o «undefined».
   Existe porque el panel es una isla perezosa que un navegador oculto nunca abre: sin
   esta prueba, un fallo en una métrica rara (la inflación en escala logarítmica, una
   economía sin datos) solo se vería en producción. */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Board } from "../components/forecast/dashboard";
import { forecast } from "../lib/content/forecast";
import type { Events, IndicatorId, Ise, Meta, Panel } from "../lib/data/forecast-lab";

const DIR = path.join(process.cwd(), "public", "forecast-lab");
const read = <T,>(f: string) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as T;
const meta = read<Meta>("meta.json");
const panel = read<Panel>("panel.json");
const events = read<Events>("eventos.json");
const ise = read<Ise>("ise.json");

const render = (lang: "es" | "en", initial: Parameters<typeof Board>[0]["initial"]) =>
  renderToString(
    createElement(Board, { copy: forecast[lang].forecastLab.lab.dash, lang, meta, panel, events, ise, initial }),
  );

const bad = /NaN|Infinity|undefined|\[object Object\]/;

test("cada métrica se dibuja sin un solo NaN, en los dos idiomas", () => {
  for (const ind of panel.indicadores.map((i) => i.id as IndicatorId)) {
    for (const lang of ["es", "en"] as const) {
      const html = render(lang, { ind });
      const hit = html.match(bad);
      assert.equal(hit, null, `${lang}/${ind}: «${hit?.[0]}» cerca de ${html.slice(Math.max(0, (hit?.index ?? 0) - 80), (hit?.index ?? 0) + 40)}`);
      assert.ok(html.includes("<svg"), `${lang}/${ind}: sin gráficos`);
    }
  }
});

test("filtros extremos: una sola economía, un período corto, y economías sin datos de la métrica", () => {
  const cases: Parameters<typeof Board>[0]["initial"][] = [
    { sel: ["COL"], ind: "pib_crecimiento", from: 2015, to: 2020 },
    { sel: ["ARG", "VEN"], ind: "inflacion_ipc" }, // sin inflación en el Banco Mundial
    { sel: ["HND"], ind: "pib_crecimiento", from: 1990, to: 1999 }, // el tramo enmascarado (B-010)
    { sel: ["CUB", "HTI", "NIC", "PAN", "SLV", "URY"], ind: "desempleo", from: 1960, to: 1980 },
  ];
  for (const c of cases) {
    const html = render("es", c);
    assert.equal(html.match(bad), null, JSON.stringify(c));
  }
});

test("la cobertura parcial se dice en vez de dibujar una línea corta en silencio", () => {
  const html = render("es", { sel: ["ARG", "VEN"], ind: "inflacion_ipc", from: 1980, to: 2025 });
  assert.ok(html.includes("Cobertura incompleta"), "falta el aviso de cobertura");
  assert.ok(html.includes("Argentina (7 de 46 años)"), "el aviso dice cuántos años hay");
});

test("los eventos del período elegido aparecen en la cronología y en el gráfico", () => {
  const html = render("es", { sel: ["ARG"], ind: "pib_crecimiento", from: 1998, to: 2004 });
  assert.ok(html.includes("Corralito"), "el corralito de 2001 debe estar en la cronología de Argentina 1998–2004");
});

test("tocar un evento abre su resumen: fecha, economía, tipo y el texto completo", () => {
  const corralito = events.eventos.find((e) => e.iso3 === "ARG" && e.anio === 2001);
  assert.ok(corralito, "el corralito está en la cronología");
  const html = render("es", { sel: ["ARG"], from: 1995, to: 2007, pop: corralito });
  assert.ok(html.includes('role="dialog"'), "el resumen es un diálogo");
  assert.ok(html.includes(corralito.texto_es.slice(0, 40)), "con el texto del evento");
  assert.ok(html.includes("Dic 2001"), "y su fecha con el mes");
});

// ---------------------------------------------------------------- la tabla ordenable

import { SortTable } from "../components/forecast/ui";

test("la tabla ordena por la columna pedida y deja los nulos al final, en los dos sentidos", () => {
  const rows = [{ id: "a", v: 2 }, { id: "b", v: null }, { id: "c", v: 5 }, { id: "d", v: -1 }];
  const cols = [
    { key: "id", label: "id", sort: (r: (typeof rows)[number]) => r.id, render: (r: (typeof rows)[number]) => r.id },
    { key: "v", label: "v", sort: (r: (typeof rows)[number]) => r.v, render: (r: (typeof rows)[number]) => `<${r.id}>` },
  ];
  const order = (dir: "asc" | "desc") => {
    const html = renderToString(createElement(SortTable<(typeof rows)[number]>, { rows, columns: cols, rowKey: (r) => r.id, initial: { key: "v", dir } }));
    return [...html.matchAll(/&lt;([a-z])&gt;/g)].map((m) => m[1]).join("");
  };
  assert.equal(order("desc"), "cadb");
  assert.equal(order("asc"), "dacb");
  const html = renderToString(createElement(SortTable<(typeof rows)[number]>, { rows, columns: cols, rowKey: (r) => r.id, initial: { key: "v", dir: "desc" } }));
  assert.ok(html.includes('aria-sort="descending"'), "la cabecera dice cómo está ordenada");
});
