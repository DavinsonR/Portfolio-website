import type { MetadataRoute } from "next";
import { dictionaries } from "@/lib/dictionaries";

/** El manifest existía en la CSP (`manifest-src 'self'`) y no existía en el
 *  sitio: la directiva no apuntaba a nada. Esto lo cierra y, de paso, le da
 *  identidad al icono cuando alguien guarda la página en el teléfono.
 *
 *  Un manifest **no tiene idioma**: es uno por origen. Por eso el nombre es el
 *  de la persona —que se escribe igual en los dos— y la descripción va en
 *  inglés, que es el idioma por defecto del sitio (ver `next.config.ts`).
 *  `start_url` es "/" y no "/en" para que el redirect decida, y no este archivo.
 *
 *  `display: "browser"` a propósito: esto es un documento que se lee y se
 *  imprime, no una aplicación. Abrirlo sin barra de direcciones le quitaría al
 *  lector la URL que el sitio entero le pide verificar. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: dictionaries.en.profile.name,
    short_name: "Davirson",
    description: dictionaries.en.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0f4c81",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
