// ============================================================
// Parte BITACORA_MAESTRA.md en docs/bitacora/ — se corre UNA vez.
//
// El original son 107 KB y 985 líneas de narrativa cronológica: el mejor activo
// del proyecto y su peor problema de acceso. Para encontrar una decisión hay
// que leer diecisiete anexos, y ningún agente puede cargarlo sin quemar medio
// contexto.
//
// El corte es MECÁNICO a propósito — se parte por los `^## `, no se reescribe
// una sola línea. Volver a teclear 107 KB introduce errores de transcripción en
// el único documento del repositorio cuyo valor es ser fiel a lo que pasó. Los
// índices (DECISIONES.md, FALLOS.md) sí se escriben a mano, pero solo enlazan.
//
//   node scripts/split-bitacora.mjs
// ============================================================
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "BITACORA_MAESTRA.md");
const OUT = path.join(ROOT, "docs", "bitacora");

const raw = fs.readFileSync(SRC, "utf8");
const lines = raw.split(/\r?\n/);

/** Índices de las líneas que abren una sección de nivel 2. */
const heads = [];
lines.forEach((l, i) => {
  if (/^## /.test(l)) heads.push(i);
});

/** El número de sesión sale del encabezado, que viene en dos formas según la
 *  época: `## ANEXO — SESIÓN 4 (...)` y `## Sesión 12 — ...`. */
function sessionNumber(heading) {
  const m = heading.match(/sesi[oó]n\s+(\d+)/i);
  return m ? Number(m[1]) : null;
}

function slug(heading) {
  return heading
    .replace(/^##\s*/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

fs.mkdirSync(OUT, { recursive: true });

// Las diez secciones numeradas del cuerpo v1.0 son una unidad: el documento
// fundacional. No se parten en diez ficheros de treinta líneas.
const firstAnnex = heads.find((i) => sessionNumber(lines[i]) !== null);
const foundation = lines.slice(0, firstAnnex).join("\n").trimEnd();

const written = [];
fs.writeFileSync(
  path.join(OUT, "00-fundacion.md"),
  `<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->\n\n${foundation}\n`,
  "utf8",
);
written.push({ file: "00-fundacion.md", title: "Documento fundacional (§1–§10)", n: 0 });

const annexStarts = heads.filter((i) => i >= firstAnnex);
annexStarts.forEach((start, k) => {
  const end = k + 1 < annexStarts.length ? annexStarts[k + 1] : lines.length;
  const heading = lines[start];
  const n = sessionNumber(heading);
  const name = n === null ? `${slug(heading)}.md` : `sesion-${String(n).padStart(2, "0")}.md`;
  const body = lines.slice(start, end).join("\n").trimEnd();
  fs.writeFileSync(
    path.join(OUT, name),
    `<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->\n\n${body}\n`,
    "utf8",
  );
  written.push({ file: name, title: heading.replace(/^##\s*/, ""), n: n ?? 999 });
});

// Comprobación de integridad: la suma de las partes tiene que llevarse todas
// las líneas del original. Si el corte pierde algo, aquí se ve.
const total = written.reduce(
  (acc, w) => acc + fs.readFileSync(path.join(OUT, w.file), "utf8").split("\n").length - 3,
  0,
);
console.log(`${written.length} ficheros en docs/bitacora/`);
console.log(`líneas: original ${lines.length}, repartidas ~${total}`);
for (const w of written.sort((a, b) => a.n - b.n)) console.log(`  ${w.file}  ${w.title.slice(0, 70)}`);
