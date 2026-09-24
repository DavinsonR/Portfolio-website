// ============================================================
// La página de crédito tiene su propia CSP, y la CSP es del documento: si se
// llega con navegación de cliente, el runtime del simulador queda bloqueado
// (producción, 24 sep 2026). Estas pruebas fijan qué rutas fuerzan la carga
// completa y cómo se decide si el documento actual ya tiene esa política.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DOCUMENT_ROUTE, documentHasScorerPolicy } from "../lib/config/document-routes";

const BASE = "https://davirson.com/es";

test("la ruta de crédito en los dos idiomas fuerza la carga del documento", () => {
  for (const p of ["/en/projects/credit-risk", "/es/projects/credit-risk", "/es/projects/credit-risk/"]) {
    assert.ok(DOCUMENT_ROUTE.test(p), p);
  }
  for (const p of ["/es", "/en/projects/trading-sim", "/es/projects/credit-risk-demo", "/fr/projects/credit-risk"]) {
    assert.ok(!DOCUMENT_ROUTE.test(p), p);
  }
});

test("el documento tiene la política solo si se CARGÓ desde la página de crédito", () => {
  // Se cargó la portada y Next navegó en el cliente: la barra dice crédito, el
  // documento es la portada. Este es exactamente el caso que falló.
  assert.equal(documentHasScorerPolicy("https://davirson.com/es", BASE), false);
  assert.equal(documentHasScorerPolicy("https://davirson.com/es/projects/credit-risk", BASE), true);
  // Un ancla o una consulta no cambian la ruta del documento.
  assert.equal(documentHasScorerPolicy("https://davirson.com/en/projects/credit-risk?x=1#demo", BASE), true);
  assert.equal(documentHasScorerPolicy(undefined, BASE), false);
});

test("next.config.ts abre la CSP exactamente en las rutas que DOCUMENT_ROUTE fuerza", () => {
  const cfg = fs.readFileSync("next.config.ts", "utf8");
  assert.ok(cfg.includes('const scorer = "(?:en|es)/projects/credit-risk";'), "cambió la ruta de la CSP del simulador");
  assert.ok(cfg.includes("source: `/:lang(en|es)/projects/credit-risk`"), "cambió la regla de la CSP del simulador");
});
