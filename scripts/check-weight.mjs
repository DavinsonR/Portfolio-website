// ============================================================
// Presupuesto de peso — `npm run check:weight` (después de `npm run build`)
//
// La quinta comprobación, con la misma filosofía que las cuatro anteriores: no
// declara el valor correcto, declara que el valor no puede moverse en silencio.
//
// Existe por IR-05: el renderizador del atlas (d3 + topojson, 66 KB crudos)
// bajaba con la página de la tesis aunque sus datos sí esperaban a la puerta de
// 600 px, y nada lo dijo durante semanas — el build estaba en verde. Un
// presupuesto que solo sube a mano, con un motivo escrito al lado, es lo que
// convierte «se coló un import» en un fallo del CI.
//
// Mide lo que el HTML de cada ruta referencia: los chunks de
// `/_next/static/chunks/*.js`, comprimidos con brotli, que es como viajan.
// Lee `.next/server/app/<ruta>.html`, así que corre tras el build.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/** Kilobytes brotli por ruta. Medido el 23 sep 2026 tras la sesión 22: la
 *  portada y las siete subpáginas referencian entre 155 y 162 KB br; el
 *  presupuesto deja ~6 % de aire. Subirlo es una decisión con motivo escrito
 *  en el commit, no un ajuste. */
const BUDGET_KB = 172;

const APP = path.join(process.cwd(), ".next", "server", "app");
const CHUNKS = path.join(process.cwd(), ".next", "static", "chunks");
if (!fs.existsSync(APP)) {
  console.error("✗ peso: no hay build en .next/. Corre `npm run build` antes.");
  process.exit(1);
}

const htmls = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html") && !e.name.startsWith("_")) htmls.push(p);
  }
};
walk(APP);
if (htmls.length === 0) {
  console.error("✗ peso: no se encontró ningún HTML prerenderizado en .next/server/app/ — ¿cambió el formato del build?");
  process.exit(1);
}

const brCache = new Map();
const br = (file) => {
  if (!brCache.has(file)) brCache.set(file, zlib.brotliCompressSync(fs.readFileSync(file)).length);
  return brCache.get(file);
};

const rows = [];
const failures = [];
for (const html of htmls) {
  const route = "/" + path.relative(APP, html).replace(/\\/g, "/").replace(/\.html$/, "");
  const src = fs.readFileSync(html, "utf8");
  const chunks = [...new Set([...src.matchAll(/src="\/_next\/static\/chunks\/([^"]+\.js)"/g)].map((m) => m[1]))];
  if (chunks.length === 0) {
    failures.push(`${route} — el HTML no referencia ningún chunk: o el formato cambió o la página no hidrata`);
    continue;
  }
  let total = 0;
  for (const c of chunks) {
    const f = path.join(CHUNKS, c);
    if (!fs.existsSync(f)) {
      failures.push(`${route} — referencia ${c} y no existe en .next/static/chunks/`);
      continue;
    }
    total += br(f);
  }
  const kb = total / 1024;
  rows.push({ route, chunks: chunks.length, kb });
  if (kb > BUDGET_KB) {
    failures.push(
      `${route} — ${kb.toFixed(1)} KB br en ${chunks.length} chunks, por encima del presupuesto de ${BUDGET_KB} KB. ` +
        `Si es a propósito, sube BUDGET_KB en scripts/check-weight.mjs y di por qué en el commit.`,
    );
  }
}

rows.sort((a, b) => b.kb - a.kb);
for (const r of rows) console.log(`  ${r.kb.toFixed(1).padStart(6)} KB br  ${String(r.chunks).padStart(2)} chunks  ${r.route}`);

if (failures.length) {
  console.error(`✗ peso: ${failures.length} fallo(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`✓ peso: ${rows.length} rutas dentro del presupuesto de ${BUDGET_KB} KB br (máximo ${rows[0].kb.toFixed(1)} KB)`);
