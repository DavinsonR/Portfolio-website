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

/** Una URL puede estar en DOS sitios de un PDF, y hay que mirar los dos.
 *
 *  1. Dentro de un `stream` con FlateDecode — el texto visible de la página.
 *  2. En los bytes sin comprimir, dentro de una anotación `/URI (...)`: así es
 *     como `hyperref` guarda el destino de un enlace.
 *
 *  Cuál de los dos lleva la URL **depende del motor**, y esta comprobación se
 *  escribió mirando solo el primero. Al recompilar con pdfLaTeX el texto pasó a
 *  ir con una fuente Type1 subsetada —códigos de glifo, no ASCII— y el chequeo
 *  dio un falso negativo con el PDF ya correcto: las tres URL estaban ahí, en
 *  las anotaciones. Un chequeo que depende del motor no comprueba nada.
 *
 *  Los streams que no se dejan descomprimir (imágenes, fuentes) se ignoran. */
function pdfHaystack(file: string): string {
  const raw = fs.readFileSync(file);
  const out: string[] = [raw.toString("latin1")]; // (2) anotaciones y objetos en claro
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(out[0]))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end === -1) continue;
    try {
      out.push(zlib.inflateSync(raw.subarray(start, end)).toString("latin1")); // (1)
    } catch {
      /* no es texto comprimido */
    }
  }
  return out.join("\n");
}

const problems: string[] = [];

for (const name of fs.readdirSync(PUBLIC).filter((f) => /\.(tex|pdf)$/.test(f))) {
  const file = path.join(PUBLIC, name);
  const text = name.endsWith(".pdf") ? pdfHaystack(file) : fs.readFileSync(file, "utf8");

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

  // FALLO-32: comandos de LaTeX que perdieron su barra invertida.
  //
  // El generador construye el `.tex` con plantillas de JavaScript, donde `\s` es
  // `s`, `\h` es `h` y `\t` es un TABULADOR. Cuatro líneas se escribieron con
  // barras simples y el PDF publicó `small hrefmailto:…` durante meses, en los
  // dos idiomas. Ni `tsc` ni LaTeX se quejan: el resultado es LaTeX válido.
  //
  // Dos señales, las dos baratas y sin falsos positivos aquí: un nombre de
  // comando pegado a `{` sin barra delante, y un tabulador literal — el
  // generador indenta con espacios y nunca emite uno a propósito.
  if (name.endsWith(".tex")) {
    const naked = [
      ...text.matchAll(/(^|[^\\A-Za-z])(small|large|href|textbf|textit|itshape|color|textperiodcentered)\{/g),
    ].map((x) => x[2]);
    if (naked.length) {
      problems.push(
        `${name} — \\${naked[0]} perdió su barra invertida (${naked.length} caso/s). ` +
          `En scripts/generate-cv-latex.ts las barras van DOBLES dentro de una plantilla.`,
      );
    }
    if (text.includes("\t")) {
      problems.push(
        `${name} — tiene un tabulador literal, que suele ser un \\, escrito con barra simple ` +
          `en una plantilla de JavaScript (\\t). Revisa scripts/generate-cv-latex.ts.`,
      );
    }
  }
}

if (problems.length === 0) {
  console.log(`✓ artefactos del CV: los .tex y los .pdf apuntan a ${HOST}`);
  process.exit(0);
}

console.error(`✗ artefactos del CV: ${problems.length} problema(s)\n`);
for (const p of problems) console.error(`  ${p}`);
process.exit(1);
