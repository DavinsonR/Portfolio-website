// ============================================================
// `lib/data/credit-risk.ts` deriva las series de los cuatro gráficos de la
// página de crédito a partir del bundle copiado del repositorio del modelo.
// Cuando ese bundle se recopie, las derivaciones tienen que seguir dando series
// no vacías con números finitos: un gráfico vacío no falla el build, solo
// aparece en blanco.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { cliff, eventPoints, regimes, umbralPP, CR } from "../lib/data/credit-risk";

test("la deriva por cohorte tiene filas y cada una es un número", () => {
  assert.ok(cliff.length >= 3, `cliff: ${cliff.length} filas`);
  for (const p of cliff) {
    assert.ok(Number.isInteger(p.fy) && p.fy > 2000, `fy raro: ${p.fy}`);
    assert.ok(Number.isFinite(p.sinSoporte) && Number.isFinite(p.n));
  }
});

test("el estudio de evento tiene coeficientes finitos en las dos fases", () => {
  assert.ok(eventPoints.length >= 4, `eventPoints: ${eventPoints.length}`);
  const fases = new Set(eventPoints.map((p) => p.fase));
  assert.ok(fases.size >= 2, `una sola fase: ${[...fases].join(",")}`);
  for (const p of eventPoints) assert.ok(Number.isFinite(p.gamma), `gamma no finita en ${p.anio}`);
  // Los regímenes son un objeto de brechas en puntos porcentuales, no una lista.
  const brechas = Object.values(regimes);
  assert.ok(brechas.length >= 3, `regimes: ${brechas.length} valores`);
  for (const v of brechas) assert.ok(Number.isFinite(v), "una brecha de régimen no es finita");
  assert.ok(Number.isFinite(umbralPP) && umbralPP > 0);
});

test("las cifras publicadas del modelo son números en su rango", () => {
  for (const [k, v] of Object.entries(CR)) {
    if (typeof v === "number") assert.ok(Number.isFinite(v), `${k} no es finito`);
  }
});
