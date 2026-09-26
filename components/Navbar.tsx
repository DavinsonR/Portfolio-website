"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import ThemeToggle from "@/components/ThemeToggle";
import { ReadingProgress } from "@/components/Motion";

/** Este componente es de cliente solo por `usePathname`, y recibía el diccionario
 *  entero. Todo lo que cruza esa frontera se serializa dentro del HTML de cada
 *  página: 45.117 bytes del idioma completo — el CV, la tesis, el laboratorio, el
 *  catálogo de Power BI — para usar 508. La portada enviaba `profileText` y
 *  `atlasCopy` a un lector que nunca los ve. Ahora entra solo lo que se pinta. */
export default function Navbar({
  nav,
  mailHref,
  lang,
}: {
  nav: Dictionary["nav"];
  mailHref: string;
  lang: Locale;
}) {
  const pathname = usePathname();
  const otherLang = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(`/${lang}`, `/${otherLang}`) || `/${otherLang}`;
  const resolve = (href: string) => `/${lang}${href}`;

  return (
    <nav
      aria-label={nav.label}
      className="no-print sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-6 py-3.5">
        <Link
          href={`/${lang}`}
          className="min-w-0 truncate font-display text-[15px] font-semibold tracking-tight text-ink"
        >
          Davirson Novoa
        </Link>

        <div className="hidden items-center gap-7 text-[14px] font-medium text-body md:flex">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={resolve(l.href)}
              /* the rule under a link is drawn on approach, the way a reader
                 underlines a line in a printed sheet — no colour wash, no glow */
              className="relative py-1 transition-colors hover:text-cold after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-cold after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Language is a labelled control, not a dim glyph: the previous build
              hid it against the dark ground and reviewers never found it.
              El nombre accesible tiene que contener el texto visible (2.5.3), y
              antes era solo "Read in English": quien maneja por voz decía
              «pulsa EN» y no pasaba nada. */}
          <Link
            href={switchHref}
            // La barra es pegajosa: el enlace está siempre en pantalla y Next
            // precargaba la ruta entera del otro idioma (75 KB de RSC) en cada
            // página. Nadie lee las dos versiones.
            prefetch={false}
            title={nav.switchTitle}
            aria-label={`${nav.switchLabel} — ${nav.switchTitle}`}
            className="lift inline-flex h-9 items-center rounded-[3px] border border-coldline bg-coldsoft px-3 font-display text-[14px] font-semibold tracking-[0.06em] text-cold transition-colors hover:border-cold"
          >
            {nav.switchLabel}
          </Link>

          <ThemeToggle labels={{ light: nav.themeLight, dark: nav.themeDark }} />

          {/* Estaba oculto por debajo de 640px. En el teléfono la barra quedaba
              con el nombre, el idioma y el tema: el único control de conversión
              del sitio desaparecía justo en el dispositivo donde el enlace llega
              desde LinkedIn y donde escribir un correo cuesta dos toques. La
              alternativa era bajar 7.200px hasta el cierre. */}
          <a
            href={mailHref}
            className="lift inline-flex h-9 items-center rounded-[3px] bg-cold px-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 sm:px-4"
          >
            {nav.contact}
          </a>
        </div>
      </div>

      <ReadingProgress />
    </nav>
  );
}
