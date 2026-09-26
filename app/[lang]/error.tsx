"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { errorPage } from "@/lib/content/error";

/** Frontera de error del segmento `[lang]`: lo que se ve cuando un componente
 *  de cliente lanza durante el render — el laboratorio con un JSON de forma
 *  inesperada, el atlas, un `localStorage` bloqueado. Sin esto React subía el
 *  fallo a la pantalla genérica de Next y se llevaba la página entera, barra y
 *  pie incluidos; aquí la barra y el pie se quedan, porque el layout envuelve a
 *  esta frontera y no al revés.
 *
 *  Es un componente de CLIENTE por contrato de Next, así que no recibe
 *  `params`: el idioma se lee del primer segmento de la URL y, en la duda, se
 *  publica en inglés, que es el idioma por defecto del sitio. Importa
 *  `lib/content/error.ts` directamente y no `@/lib/dictionaries`: lo que importe
 *  un componente de cliente viaja en el bundle de TODAS las rutas. */
export default function LangError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] === "es" ? "es" : "en";
  const t = errorPage[lang].errorPage;

  return (
    <main id="main" lang={lang} className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <div className="max-w-[58ch] border-t-2 border-ink pt-8">
        <h1 className="font-display text-[clamp(22px,2.6vw,28px)] leading-[1.15] font-extrabold tracking-[-0.02em] text-ink">
          {t.title}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-body">{t.body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[3px] bg-cold px-4 py-2 text-[14px] font-semibold text-paper hover:underline"
          >
            {t.retry}
          </button>
          <Link href={`/${lang}`} className="text-[14px] font-medium text-cold hover:underline">
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
