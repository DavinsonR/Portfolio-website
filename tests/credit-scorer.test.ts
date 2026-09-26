// ============================================================
// El simulador de la página de credit-risk-mlops reimplementa el contrato de
// serving en TypeScript. Estas pruebas fijan esa reimplementación contra el
// contrato real (`public/credit-risk-demo/contract.json`) y contra la demo
// publicada, que es la otra copia del mismo contrato dentro de este sitio: si
// alguien cambia una banda o la severidad en un lado y no en el otro, la página
// y la demo darían números distintos para el mismo préstamo sin que nada fallara.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BANDS,
  DEFAULTS,
  LGD,
  OUT_OF_CONTRACT_AGE,
  band,
  bandPosition,
  calibrate,
  encode,
  expectedLoss,
  unknownFields,
  type Contract,
} from "../lib/data/credit-scorer";

const contract: Contract = JSON.parse(fs.readFileSync("public/credit-risk-demo/contract.json", "utf8"));
const demo = fs.readFileSync("public/credit-risk-demo/index.html", "utf8");

test("los valores típicos son todos parte del vocabulario de entrenamiento", () => {
  assert.deepEqual(unknownFields(DEFAULTS, contract), []);
  for (const name of contract.categorical) {
    assert.ok(name in DEFAULTS, `DEFAULTS no trae ${name}`);
  }
});

test("encode sigue el orden del contrato y deriva las dos numéricas", () => {
  const row = encode(DEFAULTS, contract);
  assert.equal(row.length, contract.feature_order.length);
  const at = (name: string) => row[contract.feature_order.indexOf(name)];
  assert.equal(at("gross_approval"), 250000);
  assert.ok(Math.abs(at("guarantee_pct") - 0.75) < 1e-6);
  assert.ok(Math.abs(at("log_gross_approval") - Math.log(250000)) < 1e-4);
  assert.equal(at("naics_sector"), contract.categories.naics_sector.indexOf("72"));
  assert.equal(at("has_franchise"), contract.categories.has_franchise.indexOf("0"));
});

test("una categoría fuera del contrato se codifica como desconocida y se declara", () => {
  const p = { ...DEFAULTS, business_age: OUT_OF_CONTRACT_AGE };
  assert.ok(!contract.categories.business_age.includes(OUT_OF_CONTRACT_AGE));
  const row = encode(p, contract);
  assert.equal(row[contract.feature_order.indexOf("business_age")], contract.unknown_code);
  assert.deepEqual(unknownFields(p, contract), ["business_age"]);
});

test("un monto de cero no divide por cero: las derivadas quedan como faltantes", () => {
  const row = encode({ ...DEFAULTS, gross_approval: 0 }, contract);
  assert.ok(Number.isNaN(row[contract.feature_order.indexOf("guarantee_pct")]));
  assert.ok(Number.isNaN(row[contract.feature_order.indexOf("log_gross_approval")]));
});

test("la calibración es monótona y desplaza en la dirección del contrato", () => {
  const xs = [0.01, 0.05, 0.1, 0.3, 0.7];
  const ys = xs.map((x) => calibrate(x, contract));
  for (let i = 1; i < ys.length; i++) assert.ok(ys[i] > ys[i - 1]);
  assert.equal(Math.sign(ys[2] - xs[2]), Math.sign(contract.calibrator_shift));
});

test("las bandas cortan donde dice la API, y una PD de 1 cae en E", () => {
  assert.equal(band(0.029), "A");
  assert.equal(band(0.03), "B");
  assert.equal(band(0.119), "C");
  assert.equal(band(0.2), "E");
  assert.equal(band(1), "E");
});

test("la posición en la escala es creciente, empieza en 0 y se satura en 1", () => {
  const ps = [0, 0.01, 0.03, 0.05, 0.12, 0.19, 0.3, 0.4, 0.9];
  const xs = ps.map(bandPosition);
  assert.equal(xs[0], 0);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] >= xs[i - 1], `no crece en ${ps[i]}`);
  assert.equal(bandPosition(0.4), 1);
  assert.equal(bandPosition(0.9), 1);
  assert.equal(bandPosition(0.03), 1 / BANDS.length);
});

test("la pérdida esperada se reparte entera entre la SBA y el banco", () => {
  const l = expectedLoss(0.1, DEFAULTS);
  assert.ok(Math.abs(l.total - 0.1 * LGD * 250000) < 1e-6);
  assert.ok(Math.abs(l.sba + l.lender - l.total) < 1e-6);
  assert.ok(Math.abs(l.share - 0.75) < 1e-12);
});

test("las bandas y la severidad coinciden con la demo publicada", () => {
  const m = demo.match(/const BANDS = (\[\[.*?\]\]);/);
  assert.ok(m, "no encuentro BANDS en public/credit-risk-demo/index.html");
  const demoBands = JSON.parse(m[1]) as [number, string][];
  assert.deepEqual(demoBands, BANDS.map(([t, l]) => [t, l]));
  const lgd = demo.match(/const lgd = ([\d.]+);/);
  assert.ok(lgd, "no encuentro la severidad en la demo");
  assert.equal(Number(lgd[1]), LGD);
});
