// ============================================================
// Paridad del diccionario — `npm run check:dict`
//
// El invariante del repositorio es que `es` y `en` tienen exactamente la misma
// forma. `tsc` ya cubre una parte, pero deja DOS huecos reales:
//
//   1. Las LONGITUDES DE ARRAY. `disclosures.items` está tipado como "array de
//      ese objeto", así que añadir una divulgación en español y no en inglés
//      compila sin una queja y publica una lista más corta en el otro idioma.
//      Nada lo atrapa hasta que alguien lee la página en inglés.
//   2. Cuando sí falla, `tsc` señala el COMPONENTE QUE CONSUME la clave, no el
//      hueco. Este script señala la ruta exacta: `cv.experience[2].bullets`.
//
// Falla con código 1 y la lista completa, no con el primer problema: si faltan
// cinco claves conviene verlas todas de una vez.
// ============================================================
import { dictionaries } from "../lib/dictionaries";

type Problem = { path: string; detail: string };
const problems: Problem[] = [];

const kind = (v: unknown) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);

function walk(es: unknown, en: unknown, path: string) {
  const ke = kind(es);
  const kn = kind(en);

  if (ke !== kn) {
    problems.push({ path, detail: `en \`es\` es ${ke} y en \`en\` es ${kn}` });
    return;
  }

  if (ke === "array") {
    const a = es as unknown[];
    const b = en as unknown[];
    if (a.length !== b.length) {
      // El hallazgo que `tsc` no puede hacer.
      problems.push({ path, detail: `\`es\` tiene ${a.length} elemento(s) y \`en\` tiene ${b.length}` });
      return;
    }
    a.forEach((_, i) => walk(a[i], b[i], `${path}[${i}]`));
    return;
  }

  if (ke === "object") {
    const a = es as Record<string, unknown>;
    const b = en as Record<string, unknown>;
    for (const k of Object.keys(a)) {
      if (!(k in b)) {
        problems.push({ path: `${path}.${k}`, detail: "falta en `en`" });
        continue;
      }
      walk(a[k], b[k], `${path}.${k}`);
    }
    for (const k of Object.keys(b)) {
      if (!(k in a)) problems.push({ path: `${path}.${k}`, detail: "falta en `es`" });
    }
    return;
  }

  // Una cadena vacía es una clave que existe para el tipo y no existe para el
  // lector: el hueco se ve en la página, no en el build.
  if (ke === "string" && (es as string).trim() === "") {
    problems.push({ path, detail: "cadena vacía en `es`" });
  }
  if (kn === "string" && (en as string).trim() === "") {
    problems.push({ path, detail: "cadena vacía en `en`" });
  }
}

walk(dictionaries.es, dictionaries.en, "");

if (problems.length === 0) {
  console.log("✓ diccionario: `es` y `en` tienen la misma forma");
  process.exit(0);
}

console.error(`✗ diccionario: ${problems.length} problema(s) de paridad\n`);
for (const p of problems) console.error(`  ${p.path || "(raíz)"} — ${p.detail}`);
console.error("\nEdita el bloque de lib/content/ que toque y vuelve a correr `npm run check:dict`.");
process.exit(1);
