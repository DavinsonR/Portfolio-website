import type { MetadataRoute } from "next";
import { locales } from "@/lib/dictionaries";
import { SITE } from "@/lib/config/site";

const ROUTES = ["", "/cv", "/projects/credit-risk", "/projects/trading-sim", "/projects/powerbi", "/projects/tracking", "/research/fintech-inclusion", "/labs/macro-forecast", "/historia"];

/** Un sitio de nueve rutas por idioma no necesita un sitemap para existir, pero
 *  sí para que el buscador sepa que /es y /en son la misma página en dos idiomas. */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) =>
    ROUTES.map((route) => ({
      url: `${SITE}/${lang}${route}`,
      // Sin `lastModified`: era `new Date()` en cada build, idéntico en las 16
      // URL, y una fecha que siempre dice «hoy» es exactamente la señal que el
      // buscador aprende a ignorar. Omitirla es más honesto que inventarla.
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
