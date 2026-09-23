import { locales } from "../dictionaries";

/** Canonical y hreflang por página.
 *
 *  Estaban declarados una sola vez en el layout, así que las cinco rutas de cada
 *  idioma anunciaban `/es` y `/en` — las portadas — como su propia traducción.
 *  Para el buscador, `/en/cv` decía "mi versión en español es la portada": el
 *  par se descarta y ninguna de las dos hereda la señal de la otra. El
 *  `alternates` tiene que viajar con la ruta, no con el layout.
 *
 *  `route` es la ruta sin idioma: "" para la portada, "/cv", "/projects/powerbi". */
export function alternates(lang: string, route = "") {
  return {
    canonical: `/${lang}${route}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${route}`])),
      "x-default": `/en${route}`,
    },
  };
}

/** OpenGraph por página.
 *
 *  Next **reemplaza** el objeto `openGraph`, no lo fusiona: una subpágina que no
 *  lo declaraba heredaba el del layout entero, con `og:url` apuntando a la
 *  portada y el título de la portada. Pegar `/en/cv` en LinkedIn daba la tarjeta
 *  de la portada, enlazando a la portada — justo en el canal por el que este
 *  sitio se reparte. Lo que sí se hereda bien (imagen, tipo, sitio) hay que
 *  volver a declararlo aquí, porque el reemplazo se lleva todo.
 *
 *  `type: "article"` en las subpáginas y `profile` solo en la portada: la
 *  portada es la persona; una página de proyecto es una pieza sobre ella. */
export function openGraph(
  lang: string,
  route: string,
  meta: { title: string; description: string; siteName: string },
) {
  return {
    type: "article" as const,
    url: `/${lang}${route}`,
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
    locale: lang === "es" ? "es_CO" : "en_US",
    // Facebook y LinkedIn usan esto para saber que existe la otra versión sin
    // descubrirla por su cuenta; sin él cada idioma era una entidad aislada.
    alternateLocale: lang === "es" ? "en_US" : "es_CO",
    images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: meta.title }],
  };
}

/** Tarjeta de Twitter / X por página — FALLO-29 otra vez, en el otro vocabulario.
 *
 *  `twitter` también se REEMPLAZA entero. El layout lo declaraba una vez con los
 *  textos de la portada y ninguna subpágina lo volvía a declarar, así que las
 *  catorce rutas que no son portada publicaban `twitter:title` y
 *  `twitter:description` de la portada — medido en producción el 23 sep 2026,
 *  con el `openGraph` de cada una ya correcto (FALLO-36). `check:routes` exige
 *  ahora que `twitter:title` coincida con `og:title` en cada ruta. */
export function twitter(lang: string, meta: { title: string; description: string }) {
  return {
    card: "summary_large_image" as const,
    title: meta.title,
    description: meta.description,
    images: [`/og-${lang}.png`],
  };
}

/** Las dos tarjetas de una vez: es lo que cada `generateMetadata` de subpágina
 *  esparce (`...social(lang, "/ruta", meta)`). Declarar solo una de las dos es
 *  exactamente el hueco que se acaba de cerrar. */
export function social(lang: string, route: string, meta: { title: string; description: string; siteName: string }) {
  return { openGraph: openGraph(lang, route, meta), twitter: twitter(lang, meta) };
}
