import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { mailtoHref } from "@/lib/config/contact";

export default function Footer({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  // Sin año: se congelaba en el build y desde el 1 de enero hasta el siguiente
  // despliegue el pie decía el anterior. Un «©» sin año es válido.
  return (
    <footer className="border-t border-rule py-9">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 text-[14px] text-body">
        <span>
          © {dict.footer.left}
        </span>
        {/* El pie no llevaba ninguna forma de contacto, en las cinco rutas. Quien
            llega al fondo de una página de proyecto y decide escribir tenía que
            volver a la portada a buscar la dirección. */}
        <a
          href={mailtoHref(dict)}
          className="break-all text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
        >
          {dict.profile.email}
        </a>
        <span lang={lang}>{dict.footer.right}</span>
        {/* Por debajo de 768 px la barra pierde sus tres enlaces, incluido el CV:
            desde una página de proyecto en un teléfono no había ruta al PDF salvo
            volver a la portada y desplazarse. PRODUCT.md dice que el PDF es el
            artefacto que sobrevive a la visita. El pie está en las ocho rutas y en
            los dos anchos, y ya era contenido del diccionario. */}
        <nav aria-label={dict.nav.links[1].label} className="flex w-full flex-wrap gap-x-6 gap-y-2 border-t border-rulesoft pt-4">
          <a href={dict.cv.downloadHref} download className="font-medium text-cold hover:underline">
            {dict.cv.download}
          </a>
          <Link href={`/${lang}/historia`} prefetch={false} className="hover:text-cold hover:underline">
            {dict.nav.links[1].label}
          </Link>
          <Link href={`/${lang}/cv`} prefetch={false} className="hover:text-cold hover:underline">
            {dict.nav.links[2].label}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
