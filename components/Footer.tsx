import type { Dictionary, Locale } from "@/lib/dictionaries";
import { mailtoHref } from "@/lib/config/contact";

export default function Footer({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule py-9">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 text-[14px] text-body">
        <span>
          © {year} · {dict.footer.left}
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
      </div>
    </footer>
  );
}
