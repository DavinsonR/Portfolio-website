// ============================================================
// CONTENIDO DEL SITIO — fuente única de verdad (ES / EN)
//
// Este fichero ya no guarda texto: es la PUERTA. Ensambla los cuatro bloques de
// `lib/content/` y re-exporta sus tipos, de modo que todo el sitio siga
// importando de `@/lib/dictionaries` como siempre.
//
// PARA EDITAR TEXTOS, ve al bloque que toque:
//   lib/content/home.ts      portada: metadatos, navegación, la hoja, la mesa
//   lib/content/projects.ts  las cinco piezas de trabajo, una por página
//   lib/content/about.ts     trayectoria, herramientas, divulgaciones, contacto, pie, 404
//   lib/content/cv.ts        el CV — de aquí salen también el .tex y el PDF
//   lib/content/historia.ts  la trayectoria en primera persona
//   lib/content/error.ts     la frontera de error de cliente (cuatro cadenas)
//
// Eran 2.253 líneas en un solo archivo. El corte se hizo por rangos contiguos
// (`scripts/split-dictionaries.mjs`), y por eso el ORDEN DE LAS CLAVES que
// producen estos spreads es idéntico al de antes: se verificó comparando
// `JSON.stringify(dictionaries)` carácter a carácter antes y después.
// ============================================================

import { locales, profile, type Locale } from "./content/types";
import { home } from "./content/home";
import { projects } from "./content/projects";
import { about } from "./content/about";
import { cv } from "./content/cv";
import { historia } from "./content/historia";
import { errorPage } from "./content/error";

export { locales, profile, THESIS_REPO, TABLEAU_VIZ } from "./content/types";
export type {
  Locale,
  Status,
  Award,
  Metric,
  ProofRow,
  ProjectLink,
  AlsoRow,
  Education,
  CvProject,
} from "./content/types";

export const dictionaries = {
  // ==========================================================
  // ESPAÑOL
  // ==========================================================
  es: { profile, ...home.es, ...projects.es, ...about.es, ...cv.es, ...historia.es, ...errorPage.es },
  // ==========================================================
  // ENGLISH
  // ==========================================================
  en: { profile, ...home.en, ...projects.en, ...about.en, ...cv.en, ...historia.en, ...errorPage.en },
};

/** El invariante más importante del repositorio: `es` y `en` tienen exactamente
 *  la misma forma. `tsc` cubre las claves; las LONGITUDES DE ARRAY y las cadenas
 *  vacías no las ve, y de eso se encarga `npm run check:dict`. */
export type Dictionary = (typeof dictionaries)["es"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** El acceso por corchetes sobre el objeto literal alcanzaba la cadena de
 *  prototipos: `dictionaries["__proto__"]` devuelve `Object.prototype`, que es
 *  truthy, así que el `??` no saltaba y la página reventaba con un 500 en vez
 *  de degradar. La lista blanca es la única lectura correcta de un locale. */
export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries.es;
}
