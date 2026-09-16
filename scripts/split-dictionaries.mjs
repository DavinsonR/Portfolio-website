// ============================================================
// Parte lib/dictionaries.ts en lib/content/ — se corre UNA vez.
//
// 2.253 líneas y 164 KB en un archivo: es el único punto del código donde el
// desorden era real. Quien viene a cambiar una frase de la página de trading
// carga el CV entero, y dos ediciones en bloques distintos chocan en el mismo
// archivo.
//
// EL CORTE ES MECÁNICO Y POR RANGOS CONTIGUOS. Contiguos a propósito: así el
// ORDEN DE LAS CLAVES se conserva exactamente al volver a ensamblar con
// spreads, y eso permite probar que no se perdió nada comparando
// `JSON.stringify(dictionaries)` antes y después. Agrupar por tema habría
// mezclado el orden y esa prueba dejaría de valer.
//
// No se re-indenta ni se reformatea una línea: hay literales de plantilla en el
// diccionario y cambiarles la sangría les cambiaría el contenido.
//
//   node scripts/split-dictionaries.mjs
// ============================================================
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "lib", "dictionaries.ts");
const OUT = path.join(ROOT, "lib", "content");

const lines = fs.readFileSync(SRC, "utf8").split(/\r?\n/);

/** Índice (base 0) de la línea que abre un bloque `    nombre: {` de primer
 *  nivel dentro de `es:` o `en:`, buscando desde `from`. */
const openers = (from, to) => {
  const out = [];
  for (let i = from; i < to; i++) {
    const m = lines[i].match(/^ {4}([a-zA-Z][a-zA-Z0-9]*): \{$/);
    if (m) out.push({ name: m[1], line: i });
  }
  return out;
};

const lineOf = (re, from = 0) => lines.findIndex((l, i) => i >= from && re.test(l));

const esStart = lineOf(/^ {2}es: \{$/);
const enStart = lineOf(/^ {2}en: \{$/);
const esEnd = lineOf(/^ {2}\},$/, esStart); // cierra `es:`
const enEnd = lineOf(/^ {2}\},$/, enStart); // cierra `en:`

const esBlocks = openers(esStart, esEnd);
const enBlocks = openers(enStart, enEnd);

if (esBlocks.map((b) => b.name).join() !== enBlocks.map((b) => b.name).join()) {
  throw new Error("es y en no tienen los mismos bloques en el mismo orden");
}

/** Los cuatro grupos, definidos por el PRIMER bloque de cada uno. Son rangos
 *  contiguos del original, de arriba abajo, como se lee la página. */
const GROUPS = [
  { file: "home", first: "meta", title: "La portada: metadatos, navegación, la hoja y la mesa de trabajo" },
  { file: "projects", first: "creditRisk", title: "Las cinco piezas de trabajo, una por página" },
  { file: "about", first: "track", title: "Trayectoria, herramientas, divulgaciones, contacto, pie y 404" },
  { file: "cv", first: "cv", title: "El CV — de aquí salen también el .tex y el PDF" },
];

/** Rango de líneas [desde, hasta) que ocupa un grupo dentro de un idioma. */
function range(blocks, endLine, gi) {
  const start = blocks.find((b) => b.name === GROUPS[gi].first).line;
  const next = GROUPS[gi + 1];
  const end = next ? blocks.find((b) => b.name === next.first).line : endLine;
  return [start, end];
}

fs.mkdirSync(OUT, { recursive: true });

const HEAD = `// ============================================================
// GENERADO POR scripts/split-dictionaries.mjs — pero SÍ se edita a mano.
// Este es el sitio donde se cambian los textos del sitio, en los dos idiomas.
// El script solo hizo el corte inicial; no hay que volver a correrlo.
//
// INVARIANTE: \`es\` y \`en\` tienen exactamente la misma forma, incluidas las
// longitudes de los arrays. \`npm run check:dict\` es quien lo prueba — \`tsc\`
// no ve una lista más corta en un idioma.
// ============================================================`;

const imports = [];
GROUPS.forEach((g, gi) => {
  const [es0, es1] = range(esBlocks, esEnd, gi);
  const [en0, en1] = range(enBlocks, enEnd, gi);
  const body =
    `${HEAD}\n// ${g.title}\n\nexport const ${g.file} = {\n  es: {\n` +
    lines.slice(es0, es1).join("\n") +
    `\n  },\n  en: {\n` +
    lines.slice(en0, en1).join("\n") +
    `\n  },\n};\n`;
  fs.writeFileSync(path.join(OUT, `${g.file}.ts`), body, "utf8");
  imports.push(g.file);
  console.log(`  lib/content/${g.file}.ts  ${es1 - es0 + (en1 - en0)} líneas`);
});

console.log(`\nEnsamblar en lib/dictionaries.ts con:`);
console.log(`  es: { profile, ${imports.map((i) => `...${i}.es`).join(", ")} },`);
console.log(`  en: { profile, ${imports.map((i) => `...${i}.en`).join(", ")} },`);
