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
    images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: meta.title }],
  };
}
