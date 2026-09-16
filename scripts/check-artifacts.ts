// ============================================================
// Artefactos generados contra su fuente — `npm run check:artifacts`
//
// Este script existe por un fallo concreto, del 16 sep 2026: el sitio se mudó a
// davirson.com, `lib/site.ts` y los `.tex` se actualizaron, y los PDF se
// quedaron con el host anterior IMPRESO DENTRO. Los `.tex` decían una cosa y el
// PDF que el lector se descarga decía otra, y nada en el repositorio lo notaba
// porque un PDF es opaco: `grep` no lo ve, los streams van comprimidos.
//
// La regla que impone: todo artefacto del CV —fuente LaTeX y PDF— tiene que
// contener el host de `SITE`. Si el dominio cambia y el PDF no se recompila,
// esto falla en vez de publicarse.
//
// El `.tex` además se verifica en CI de otra forma, más fuerte: se regenera y
// se exige que no difiera del versionado (`npm run latex && git diff --exit-code`).
// Aquí se comprueba el PDF, que es lo que ningún diff puede mirar.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { SITE } from "../lib/site";

const PUBLIC = path.join(process.cwd(), "public");
const HOST = new URL(SITE).host;

/** El texto de un PDF vive en objetos `stream`, casi siempre con FlateDecode.
 *  Sin descomprimir, buscar una URL dentro da siempre cero — que es justo por
 *  lo que el desajuste pasó desapercibido. Los streams que no se dejan
 *  descomprimir (imágenes, fuentes incrustadas) se ignoran: no llevan texto. */
function pdfText(file: string): string {
  const raw = fs.readFileSync(file);
  const out: string[] = [];
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw.toString("latin1")))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end === -1) continue;
    try {
      out.push(zlib.inflateSync(raw.subarray(start, end)).toString("latin1"));
    } catch {
      /* no es texto comprimido */
    }
  }
  return out.join("\n");
}

const problems: string[] = [];

for (const name of fs.readdirSync(PUBLIC).filter((f) => /\.(tex|pdf)$/.test(f))) {
  const file = path.join(PUBLIC, name);
  const text = name.endsWith(".pdf") ? pdfText(file) : fs.readFileSync(file, "utf8");

  if (!text.includes(HOST)) {
    problems.push(
      `${name} — no menciona ${HOST}. ` +
        (name.endsWith(".pdf")
          ? "Recompílalo desde su .tex (Overleaf con pdfLaTeX, o `npm run cv` si hay un motor LaTeX)."
          : "Corre `npm run latex`."),
    );
    continue;
  }

  // Un host de este sitio que ya no es el actual. La demo de JARVIS vive en su
  // propio *.vercel.app y es otra aplicación: no entra aquí.
  const stale = [...text.matchAll(/proyecto-davirson[a-z0-9-]*\.vercel\.app/g)].map((x) => x[0]);
  if (stale.length) {
    problems.push(`${name} — sigue conteniendo el host anterior ${stale[0]} (${stale.length} vez/veces).`);
  }
}

if (problems.length === 0) {
  console.log(`✓ artefactos del CV: los .tex y los .pdf apuntan a ${HOST}`);
  process.exit(0);
}

console.error(`✗ artefactos del CV: ${problems.length} problema(s)\n`);
for (const p of problems) console.error(`  ${p}`);
process.exit(1);
