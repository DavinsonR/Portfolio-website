// ============================================================
// Las cifras del laboratorio se derivan (sesión 19). Esto prueba la derivación
// y el relleno de plantillas contra la instantánea versionada y contra casos
// sintéticos: si «una de cada N» redondea mal, el titular miente con precisión.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fillLab, hasLabVars, labStatsFrom, labValues } from "../lib/data/lab-stats";

const snapshot = JSON.parse(fs.readFileSync("public/trading-sim-snapshot/index.json", "utf8"));

test("la instantánea versionada trae el total y produce cuatro números coherentes", () => {
  const s = labStatsFrom(snapshot);
  assert.ok(s, "sin overfitting.overall en la instantánea");
  assert.ok(s.variants > 1000 && s.survivors > 0 && s.survivors < s.beatIs && s.beatIs < s.variants);
  assert.ok(s.survivalRate > 0 && s.survivalRate < 1);
});

test("«una de cada N» redondea la tasa y se escribe con letra en los dos idiomas", () => {
  const base = { variants: 1392, beatIs: 346, survivors: 45, survivalRate: 0.13 };
  assert.equal(labValues(base, "es").oneIn, "ocho");
  assert.equal(labValues(base, "en").oneIn, "eight");
  assert.equal(labValues({ ...base, survivalRate: 0.148 }, "es").oneIn, "siete");
  assert.equal(labValues(base, "es").eliminated, "1.347");
  assert.equal(labValues(base, "en").eliminated, "1,347");
});

test("fillLab rellena las variables y deja intacto lo que no las tiene", () => {
  const s = { variants: 1392, beatIs: 346, survivors: 45, survivalRate: 0.13 };
  assert.equal(fillLab("{variants} entraron. Sobrevivieron {survivors}.", s, "es"), "1.392 entraron. Sobrevivieron 45.");
  assert.equal(fillLab("only one in {oneIn} kept winning", s, "en"), "only one in eight kept winning");
  assert.equal(fillLab("sin variables", s, "es"), "sin variables");
  assert.equal(hasLabVars("{survivors}"), true);
  assert.equal(hasLabVars("nada"), false);
});

test("sin total no hay cifras: null, no un cero disfrazado", () => {
  assert.equal(labStatsFrom({ overfitting: null }), null);
  assert.equal(labStatsFrom(undefined), null);
});
