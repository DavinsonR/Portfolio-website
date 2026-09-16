import Link from "next/link";
import { dictionaries } from "@/lib/dictionaries";
import "./globals.css";

/** El 404 del sitio. Hay **uno solo** y atiende toda ruta sin match.
 *
 *  Medido, no supuesto: con `dynamicParams = false` en `app/[lang]/layout.tsx`,
 *  ni `/pricing` ni `/es/loquesea` entran en el segmento `[lang]`, así que un
 *  `app/[lang]/not-found.tsx` nunca se alcanzaría —se escribió, se midió que
 *  estaba muerto, y se borró—. Todo cae aquí.
 *
 *  Aquí no hay layout: el root layout vive dentro de `[lang]`, que es el patrón
 *  de i18n de App Router. Esta página importa su propia hoja de estilo y se
 *  pinta entera sola; tampoco hereda idioma, y por eso publica los dos.
 *
 *  El script de abajo lee el primer segmento de la URL y, solo si es `es` o
 *  `en`, fija `data-only` para que el CSS tache la otra mitad. En `/pricing` no
 *  fija nada y se quedan las dos, que es lo correcto: ahí el idioma del
 *  visitante es justo el dato que no existe. Sin JavaScript, se ven las dos. */
export const metadata = {
  title: "404 — Davirson Novoa",
  robots: { index: false, follow: false },
};

const PICK_LANG = `(function(){var s=location.pathname.split('/')[1],r=document.documentElement;if(s==='es'||s==='en'){r.lang=s;r.setAttribute('data-only',s);}})();`;

export default function NotFound() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PICK_LANG }} />
      <div className="font-sans antialiased bg-paper min-h-screen flex items-center py-20">
        <div className="max-w-[980px] w-full mx-auto px-6">
          <p className="font-figure text-[64px] leading-none font-semibold text-ink tabular-nums">
            404
          </p>

          <div className="mt-6 grid gap-10 border-t-2 border-rule pt-8 sm:grid-cols-2 sm:gap-12">
            {(["es", "en"] as const).map((lang) => {
              const t = dictionaries[lang].notFound;
              return (
                <div key={lang} lang={lang} className={lang === "es" ? "only-es" : "only-en"}>
                  <p className="text-[12.5px] font-semibold tracking-[0.11em] text-muted uppercase">
                    {lang === "es" ? "Español" : "English"}
                  </p>
                  <h2 className="mt-3 font-display text-[22px] leading-[1.15] font-extrabold tracking-[-0.02em] text-ink">
                    {t.title}
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-[1.7] text-body">{t.body}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={`/${lang}`}
                      className="rounded-[3px] bg-cold px-4 py-2 text-[14px] font-semibold text-paper hover:underline"
                    >
                      {t.home}
                    </Link>
                    <Link
                      href={`/${lang}/cv`}
                      className="text-[14px] font-medium text-cold hover:underline"
                    >
                      {t.cv}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
