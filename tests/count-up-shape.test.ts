// ============================================================
// `CountUp` parte cada cifra con una regex (SHAPE): prefijo, dígitos y sufijo.
// Si un valor del diccionario no encaja —«15+», «95 M», «1.392»— el contador
// no anima, o peor, pierde el sufijo. Se prueba contra los valores REALES del
// diccionario en los dos idiomas, no contra ejemplos inventados.
//
// Sin framework: `node --test` y `node:assert`, cargados por tsx. Es la misma
// disciplina que las cinco comprobaciones: cero dependencias nuevas.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { SHAPE } from "../components/CountUp";
import { dictionaries } from "../lib/dictionaries";

for (const lang of ["es", "en"] as const) {
  const d = dictionaries[lang];
  const values = [...d.sheet.metrics.map((m) => m.value), ...d.cv.facts.map((f) => f.value)];

  test(`${lang}: cada cifra de la portada y del CV encaja en SHAPE y conserva su forma`, () => {
    assert.ok(values.length >= 8, `pocos valores (${values.length})`);
    for (const v of values) {
      const m = SHAPE.exec(v);
      assert.ok(m, `«${v}» no encaja en SHAPE`);
      const [, pre, digits, post] = m;
      assert.equal(pre + digits + post, v, `«${v}» no se reconstruye entero`);
      const n = Number(digits.replace(/[.,]/g, ""));
      assert.ok(Number.isFinite(n) && n > 0, `«${v}» no da un número positivo (${n})`);
    }
  });
}
