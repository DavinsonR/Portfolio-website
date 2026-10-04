import type { MetadataRoute } from "next";
import { locales } from "@/lib/dictionaries";
import { SITE } from "@/lib/config/site";

const ROUTES = ["", "/cv", "/projects/credit-risk", "/projects/trading-sim", "/projects/powerbi", "/projects/tracking", "/research/fintech-inclusion", "/labs/macro-forecast", "/historia"];

/** Fecha del build, una sola vez por despliegue. Lo que cambia el sitio llega con un
 *  despliegue, así que es la fecha más cercana a «última modificación» que se puede
 *  afirmar sin leer git en el build. */
const BUILD_DATE = new Date();

/** Un sitio de nueve rutas por idioma no necesita un sitemap para existir, pero
 *  sí para que el buscador sepa que /es y /en son la misma página en dos idiomas. */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) =>
    ROUTES.map((route) => ({
      url: `${SITE}/${lang}${route}`,
      // Fecha del build, no de cada ruta: idéntica en las 18 URL. Google la ignora
      // cuando siempre dice «hoy»; sirve a las herramientas que enseñan «actualizado».
      lastModified: BUILD_DATE,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}${route}`])),
          // Las páginas lo emiten; el sitemap no lo hacía, y decían cosas distintas.
          "x-default": `${SITE}/en${route}`,
        },
      },
    })),
  );
}
