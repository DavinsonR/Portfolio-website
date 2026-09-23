import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { alternates, social } from "@/lib/config/alternates";
import BackLink from "@/components/BackLink";
import SectionNav from "@/components/SectionNav";
import ContactBand from "@/components/ContactBand";
import LabText from "@/components/trading/LabText";
import { labSnapshot } from "@/lib/data/lab-snapshot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.historia.metaTitle,
    description: dict.historia.metaDesc,
    alternates: alternates(lang, "/historia"),
    // Next REEMPLAZA el openGraph, no lo fusiona: sin esto la tarjeta de esta
    // página en LinkedIn sería la de la portada. `check:routes` lo exige.
    ...social(lang, "/historia", {
      title: dict.historia.metaTitle,
      description: dict.historia.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.historia;
  const wrap = "max-w-[980px] mx-auto px-6";
  /** Ancho de lectura. La prosa de esta página es lo único que hay, así que la
   *  medida manda: 66 caracteres es donde el ojo deja de perder el renglón. */
  const prose = "max-w-[64ch]";

  return (
    <main id="main" tabIndex={-1}>
      {/* ================= HERO ================= */}
      <header className="pt-20 pb-12">
        <div className={wrap}>
          <div className="mb-6">
            <BackLink href={`/${lang}`} label={dict.nav.backHome} />
          </div>
          <p className="text-[12.5px] font-semibold tracking-[0.11em] text-cold uppercase">
            {t.kicker}
          </p>
          <h1 className="mt-4 max-w-[900px] font-display text-[clamp(30px,4.6vw,46px)] leading-[1.06] font-extrabold tracking-[-0.03em] text-ink">
            {t.title}
          </h1>
          <p className={`mt-6 text-[16px] leading-[1.75] text-body ${prose}`}>{t.intro}</p>
          <p className="mt-5 text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
            {t.readTime}
          </p>
        </div>
      </header>

      <SectionNav
        wrap={wrap}
        label={t.navLabel}
        items={t.sections.map((s) => ({ id: s.id, label: s.nav }))}
      />

      {/* ================= LAS SIETE SECCIONES ================= */}
      <div className="pb-8">
        <div className={wrap}>
          {t.sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              // El resaltado de SectionNav asume este desplazamiento.
              className="scroll-mt-[118px] border-t border-rule pt-8 pb-12 first:border-t-2 first:border-ink"
            >
              <div data-reveal className="reveal" style={{ "--d": `${i * 40}ms` } as React.CSSProperties}>
                {/* El número en serif: es una cifra, y el serif de esta hoja
                    está reservado a las cifras y a la línea de veredicto. */}
                <p className="font-figure text-[20px] leading-none text-muted tabular-nums">{s.num}</p>
                <h2 className="mt-3 max-w-[30ch] font-display text-[clamp(22px,2.8vw,30px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
                  {s.title}
                </h2>

                <div className={`mt-5 flex flex-col gap-4 ${prose}`}>
                  {s.body.map((p) => (
                    <p key={p.slice(0, 40)} className="text-[15.5px] leading-[1.8] text-body">
                      <LabText template={p} initial={labSnapshot} lang={lang} />
                    </p>
                  ))}
                </div>

                {/* La tabla de la deriva. Es el argumento del resultado nulo en
                    tres filas: sin ella, «todo el país subió a la vez» es una
                    afirmación; con ella, es una medición. */}
                {"drift" in s && s.drift && (
                  <figure className="mt-7 max-w-[520px]">
                    <table className="w-full border-collapse text-[14px]">
                      <thead>
                        <tr className="border-b border-ink">
                          <th className="py-2 pr-4 text-left text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
                            {s.drift.colYear}
                          </th>
                          <th className="py-2 px-4 text-right text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
                            {s.drift.colMedian}
                          </th>
                          <th className="py-2 pl-4 text-right text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
                            {s.drift.colBelow}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.drift.rows.map((r) => (
                          <tr key={r.year} className="border-b border-rulesoft">
                            <td className="py-2.5 pr-4 font-figure text-[16px] text-ink tabular-nums">{r.year}</td>
                            <td className="py-2.5 px-4 text-right font-figure text-[16px] text-ink tabular-nums">{r.median}</td>
                            <td className="py-2.5 pl-4 text-right text-body tabular-nums">{r.below}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <figcaption className="mt-3 text-[14px] leading-[1.6] text-muted">
                      {s.drift.caption}
                    </figcaption>
                  </figure>
                )}

                {/* La línea de veredicto: serif, y con regla fría de 2px. Es la
                    frase que se recuerda de la sección, no un adorno. */}
                {"verdict" in s && s.verdict && (
                  <p className="mt-7 max-w-[54ch] border-l-2 border-coldline pl-5 font-figure text-[clamp(18px,2.1vw,22px)] leading-[1.45] text-ink">
                    {s.verdict}
                  </p>
                )}

                {"bodyAfter" in s && s.bodyAfter && (
                  <div className={`mt-6 flex flex-col gap-4 ${prose}`}>
                    {s.bodyAfter.map((p) => (
                      <p key={p.slice(0, 40)} className="text-[15.5px] leading-[1.8] text-body">
                        <LabText template={p} initial={labSnapshot} lang={lang} />
                      </p>
                    ))}
                  </div>
                )}

                {"proofHref" in s && s.proofHref && (
                  <p className="mt-6">
                    {s.proofHref.startsWith("http") ? (
                      <a
                        href={s.proofHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lift text-[14px] font-medium text-cold hover:underline"
                      >
                        {s.proofLabel} ↗
                      </a>
                    ) : (
                      <Link
                        href={`/${lang}${s.proofHref}`}
                        className="lift text-[14px] font-medium text-cold hover:underline"
                      >
                        {s.proofLabel} →
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ================= CIERRE =================
          Banda ámbar. Es la única de la página, y le corresponde: el acento
          cálido está reservado a contenido humano y de propósito, y esto es
          disponibilidad y contratación. Ninguna cifra de arriba lo lleva. */}
      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
