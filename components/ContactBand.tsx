import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { mailtoHref } from "@/lib/config/contact";

/** La banda ámbar de cierre: correo y CV.
 *
 *  Nació en `/historia` y allí era la única de la página. Las cinco páginas de
 *  proyecto terminaban en «volver al inicio» o en un enlace a GitHub: justo en
 *  el punto donde el lector acaba de leer entre 900 y 1.900 palabras de
 *  evidencia y está más convencido, lo único que se le ofrecía era irse. El
 *  texto es el mismo en las seis rutas —ya estaba escrito y traducido—; solo
 *  cambia la medida de la columna, que cada página pasa como `wrap`.
 *
 *  Ámbar y no azul porque esto es disponibilidad y contratación: contenido
 *  humano, la única reserva del acento cálido (DESIGN.md). */
export default function ContactBand({ dict, lang, wrap }: { dict: Dictionary; lang: Locale | string; wrap: string }) {
  const t = dict.historia;
  return (
    <section className="border-t-2 border-warm bg-warmsoft py-12" aria-labelledby="contact-band">
      <div className={wrap}>
        <h2
          id="contact-band"
          data-reveal
          className="reveal max-w-[26ch] font-display text-[clamp(22px,2.8vw,30px)] leading-[1.18] font-bold tracking-[-0.02em] text-ink"
        >
          {t.ctaTitle}
        </h2>
        <p data-reveal className="reveal mt-4 max-w-[62ch] text-[15.5px] text-body" style={{ "--d": "60ms" } as React.CSSProperties}>
          {t.ctaBody}
        </p>
        <div
          data-reveal
          className="reveal mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
          <a
            href={mailtoHref(dict)}
            className="lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
          >
            {t.ctaEmail}
          </a>
          <Link href={`/${lang}/cv`} className="text-[14.5px] font-medium text-cold hover:underline">
            {t.ctaCv}
          </Link>
        </div>
      </div>
    </section>
  );
}
