/**
 * ¿Dice el sitio la misma cifra en todos los sitios donde la dice?
 *
 * La cuarta comprobación, y existe por un fallo medido: durante semanas la
 * portada afirmó en su tarjeta «95 M registros modelados — 1,96 M SBA + 93,4 M
 * HMDA» y, cuatro párrafos más abajo en la MISMA página, «1,96 millones de
 * préstamos SBA y 62,4 millones de solicitudes HMDA». Las tres comprobaciones
 * que ya existían pasaron en verde las dos veces, y con razón:
 *
 *   · `check:dict` compara la FORMA de `es` y `en` — claves, longitudes de
 *     array, cadenas vacías. Nunca los valores. Una cifra puede divergir entre
 *     idiomas, o entre la tarjeta y la prosa del mismo idioma, sin que se note.
 *   · `check:artifacts` mira dentro de los PDF, pero sólo busca el host.
 *   · `check:routes` comprueba que la página responde, no lo que dice.
 *
 * Es el mismo patrón que FALLO-31: opaco para las pruebas que había.
 *
 * DISEÑO: aquí NO se declaran los valores correctos. Copiar «93,4» a este
 * archivo crearía un segundo sitio que se desincroniza igual que el primero —
 * exactamente el defecto que se intenta cerrar. Lo que se declara es qué
 * cifras TIENEN QUE SER CONSISTENTES; los valores los deriva del contenido y
 * sólo falla cuando encuentra desacuerdo.
 *
 * Y cuando una cifra legítimamente tiene dos valores —HMDA los tiene: 62,4 M es
 * la muestra del modelo y 93,4 M la ventana del estudio de evento, separadas a
 * propósito en el repositorio— hay que DECLARARLO aquí con su motivo. Eso
 * convierte «se me escapó» en «lo escribí a mano y dije por qué».
 */

import fs from "node:fs";
import path from "node:path";

type Claim = {
  /** Nombre para el informe. */
  name: string;
  /** Un grupo de captura, y tiene que ser el número. */
  pattern: RegExp;
  /**
   * Cuántos valores distintos se admiten y por qué. Sin esto, uno.
   * Declarar más de uno es una decisión, no un descuido: va con su motivo.
   */
  allow?: { values: number[]; why: string };
};

const CLAIMS: Claim[] = [
  {
    name: "solicitudes HMDA",
    pattern: /([\d.,]+)\s*(?:M\b|millones|million)?\s*(?:de\s+)?(?:solicitudes\s+)?(?:HMDA|applications)/gi,
    allow: {
      values: [62.4, 93.4],
      why:
        "62,4 M (FY2020-2024) es la muestra del modelo de acceso; 93,4 M (FY2018-2025) es la ventana del " +
        "estudio de evento. El repositorio las declara por separado en config.yaml a propósito, para que " +
        "ampliar la segunda no pueda mover las cifras de la primera. No se pueden sumar: la primera está " +
        "dentro de la segunda.",
    },
  },
  {
    name: "préstamos SBA",
    pattern: /([\d.,]+)\s*(?:M\b|millones|million)\s*(?:de\s+)?(?:préstamos|loans)\s*SBA/gi,
  },
  {
    name: "AUC",
    pattern: /AUC\s*(?:de\s*)?([01][.,]\d{3,4})/gi,
    allow: {
      values: [0.7005, 0.9461],
      why:
        "0,7005 es el modelo que quedó en producción. 0,9461 fue la primera medición, y era una fuga de " +
        "datos: `TermInMonths` se sobrescribe al liquidarse el préstamo, así que el campo llevaba dentro " +
        "el resultado. Las dos se publican a propósito — la segunda es el hallazgo, no un error de copia.",
    },
  },
  {
    name: "error de calibración",
    pattern: /(?:calibración|calibration error)\s*(?:de\s*)?([01][.,]\d{3,4})/gi,
  },
  {
    name: "razón de impacto dispar",
    pattern: /(?:impacto dispar|disparate impact)[^.]{0,40}?([01][.,]\d{3,4})/gi,
  },
  {
    name: "municipios del atlas",
    pattern: /([\d.,]+)\s*(?:municipios|municipalities)/gi,
  },
  {
    name: "variantes de estrategia",
    pattern: /([\d.,]+)\s*(?:variantes|strategy variants|strategies put to the test|estrategias de trading)/gi,
    allow: {
      values: [1392, 1300],
      why:
        "1.392 es el número exacto de variantes evaluadas; «más de 1.300» es el redondeo a la baja que " +
        "usan dos titulares. Redondear hacia abajo no infla nada, así que las dos formas son honestas.",
    },
  },
  {
    name: "pruebas de calidad de datos",
    pattern: /([\d.,]+)\s*(?:pruebas de (?:calidad|datos)|quality tests|automated data tests)/gi,
  },
  {
    name: "fuentes públicas",
    pattern: /([\d.,]+|[Dd]iecinueve|[Nn]ineteen)\s*(?:fuentes públicas|public sources)/gi,
  },
  // «fallos de la bitácora» dejó de ser una afirmación con cifra en la sesión
  // 18: el «35» se escribía a mano y caducaba solo cada vez que se arreglaba
  // algo — el día que llegó el 36 el sitio mentía sin que nadie lo tocara. El
  // texto ahora enlaza a docs/FALLOS.md y no cuenta.
  {
    name: "países en alcance",
    pattern: /(?:más de\s*|15\+|)([\d.,]+)\+?\s*(?:países|countries)/gi,
  },
];

const PALABRAS: Record<string, number> = {
  diecinueve: 19,
  nineteen: 19,
};

/** «1,96» en español y «1.96» en inglés son el mismo número. */
function parseNum(raw: string, locale: "es" | "en"): number | null {
  const palabra = PALABRAS[raw.toLowerCase()];
  if (palabra !== undefined) return palabra;

  const milesSep = locale === "es" ? "." : ",";
  const decSep = locale === "es" ? "," : ".";
  const limpio = raw.split(milesSep).join("").replace(decSep, ".");
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

/** Corta el archivo en su mitad `es` y su mitad `en`. */
function porIdioma(src: string): { es: string; en: string } {
  const i = src.indexOf("\n  en: {");
  if (i < 0) return { es: src, en: "" };
  return { es: src.slice(0, i), en: src.slice(i) };
}

const DIR = path.join(process.cwd(), "lib", "content");
const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith(".ts") && f !== "types.ts");

type Hallazgo = { valor: number; crudo: string; archivo: string; locale: string; ctx: string };
const porClaim = new Map<string, Hallazgo[]>();

for (const f of archivos) {
  const src = fs.readFileSync(path.join(DIR, f), "utf-8");
  const mitades = porIdioma(src);

  for (const [locale, texto] of Object.entries(mitades) as ["es" | "en", string][]) {
    if (!texto) continue;
    for (const claim of CLAIMS) {
      const re = new RegExp(claim.pattern.source, claim.pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(texto)) !== null) {
        // Sin un dígito y sin ser un número escrito con letra, no es una cifra:
        // `municipios: "Municipalities"` es una etiqueta de la interfaz, y casaba.
        const esPalabra = PALABRAS[m[1].toLowerCase()] !== undefined;
        if (!esPalabra && !/\d/.test(m[1])) continue;
        const valor = parseNum(m[1], locale);
        if (valor === null) continue;
        const desde = Math.max(0, m.index - 30);
        const ctx = texto.slice(desde, m.index + m[0].length + 20).replace(/\s+/g, " ").trim();
        if (!porClaim.has(claim.name)) porClaim.set(claim.name, []);
        porClaim.get(claim.name)!.push({ valor, crudo: m[1], archivo: f, locale, ctx });
      }
    }
  }
}

const problemas: string[] = [];

for (const claim of CLAIMS) {
  const hallazgos = porClaim.get(claim.name) ?? [];
  if (hallazgos.length === 0) {
    problemas.push(
      `«${claim.name}»: el patrón no encontró NADA. O la cifra desapareció del sitio, o el patrón se ` +
        `quedó viejo — las dos cosas hay que mirarlas, porque una comprobación que no mide nada pasa en verde.`,
    );
    continue;
  }

  const distintos = [...new Set(hallazgos.map((h) => h.valor))].sort((a, b) => a - b);
  const permitidos = claim.allow?.values ?? [];

  const inesperados = distintos.filter((v) => !permitidos.includes(v));
  const ok = permitidos.length > 0 ? inesperados.length === 0 : distintos.length === 1;

  if (!ok) {
    const lista = distintos
      .map((v) => {
        const d = hallazgos.filter((h) => h.valor === v);
        const dónde = d.map((h) => `${h.archivo}:${h.locale}`).join(", ");
        return `      ${v}  en ${dónde}\n        «${d[0].ctx}»`;
      })
      .join("\n");
    problemas.push(
      `«${claim.name}» aparece con ${distintos.length} valores distintos:\n${lista}\n` +
        `      Si es un error, corrígelo. Si las dos cifras son ciertas y describen cosas distintas, ` +
        `declara el par en CLAIMS con su motivo — a mano, y diciendo por qué.`,
    );
  }

  // Y aunque el valor sea único o esté permitido: `es` y `en` tienen que
  // coincidir. Esto es lo que `check:dict` no puede ver.
  const es = new Set(hallazgos.filter((h) => h.locale === "es").map((h) => h.valor));
  const en = new Set(hallazgos.filter((h) => h.locale === "en").map((h) => h.valor));
  if (es.size > 0 && en.size > 0) {
    const soloEs = [...es].filter((v) => !en.has(v));
    const soloEn = [...en].filter((v) => !es.has(v));
    if (soloEs.length || soloEn.length) {
      problemas.push(
        `«${claim.name}» no cuadra entre idiomas:` +
          (soloEs.length ? ` sólo en español ${soloEs.join(", ")};` : "") +
          (soloEn.length ? ` sólo en inglés ${soloEn.join(", ")};` : "") +
          ` un lector que cambia de idioma ve otra cifra.`,
      );
    }
  }
}

if (problemas.length > 0) {
  console.error(`✗ cifras: ${problemas.length} problema(s)\n`);
  for (const p of problemas) console.error(`  ${p}\n`);
  process.exit(1);
}

const total = [...porClaim.values()].reduce((a, h) => a + h.length, 0);
console.log(
  `✓ cifras: ${CLAIMS.length} afirmaciones, ${total} menciones, consistentes entre sí y entre es/en`,
);
