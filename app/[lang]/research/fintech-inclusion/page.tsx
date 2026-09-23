import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, THESIS_REPO } from "@/lib/dictionaries";
import StatusPill from "@/components/StatusPill";
import BackLink from "@/components/BackLink";
import ContactBand from "@/components/ContactBand";
import SectionNav from "@/components/SectionNav";
import Atlas from "@/components/atlas/Atlas";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.thesis.metaTitle,
    description: dict.thesis.metaDesc,
    alternates: alternates(lang, "/research/fintech-inclusion"),
    ...social(lang, "/research/fintech-inclusion", {
      title: dict.thesis.metaTitle,
      description: dict.thesis.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

/* The whole project lives on this page: there is no separate site to click through to.
   Technical content end to end, so the only accent here is the cold one — amber stays
   reserved for human content. Figures are set as written (no CountUp): "2018–2025" is a
   range, not a count, and a p-value is a reading, not a score. */
const wrap = "mx-auto max-w-[980px] px-6";
const prose = "max-w-[74ch]";
const label = "text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase";
const heading =
  "mt-3 max-w-[28ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink";
const section = "scroll-mt-[118px] border-b border-rule py-16";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const delay = (i: number) => ({ "--d": `${i * 60}ms` }) as React.CSSProperties;

export default async function ThesisPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.thesis;

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(dict, lang, "/research/fintech-inclusion", { title: t.metaTitle, description: t.metaDesc }, { type: "ScholarlyArticle", codeRepository: THESIS_REPO })) }}
      />
      {/* ================= HERO ================= */}
      <header className="border-b border-rule">
        <div className={wrap}>
          <div className="pt-20 pb-12">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <BackLink href={`/${lang}`} label={dict.nav.backHome} />
              <StatusPill status="research" text={t.pill} />
            </div>
            <p className={label}>{t.kicker}</p>
            <h1 className="mt-3 max-w-[30ch] text-balance font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
              {t.title}
            </h1>
            <p className="mt-4 max-w-[70ch] text-[15.5px] leading-[1.7] text-ink">{t.subtitle}</p>
            <p className="mt-3 text-[14px] text-body">{t.degree}</p>
            <p className="mt-1 text-[14px] text-muted">{t.timeline}</p>
          </div>
        </div>

        {/* figures band — each figure lands on the section that states it */}
        <div className="border-t-2 border-cold bg-coldsoft">
          <div className={wrap}>
            {/* Lista simple, no `<dl>`: el ancla envolvía `<dt>` y `<dd>` y no es
                padre válido de ninguno, así que el par término/definición no se
                exponía. Misma banda, mismo objetivo de clic, marcado válido. */}
            <ul className="grid grid-cols-2 py-6 lg:grid-cols-4">
              {t.figures.map((f, i) => (
                <li
                  key={f.label}
                  data-reveal
                  className="reveal border-coldline py-2 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
                  style={delay(i + 1)}
                >
                  <a href={f.href} className="lift group block">
                    <span className="block font-figure text-[clamp(28px,3.8vw,40px)] leading-none text-ink group-hover:text-cold">
                      {f.value}
                    </span>
                    <span className="block mt-2 max-w-[26ch] text-[14px] leading-[1.4] font-medium text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 group-hover:decoration-[2.5px]">
                      {f.label}
                    </span>
                  </a>
                  <p className="mt-1 text-[14px] text-body">{f.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <SectionNav items={t.nav} label={t.metaTitle} wrap={wrap} />

      {/* ================= ABSTRACT ================= */}
      <section id="resumen" className={section}>
        <div className={wrap}>
          {/* La SectionNav lleva aquí, y un destino sin encabezado deja al lector
              sin confirmación de haber llegado (2.4.6). Mismo paso que las demás. */}
          <h2 data-reveal className={`reveal ${heading} mt-0`}>{t.abstract.label}</h2>
          <p data-reveal className={`reveal mt-5 ${prose} text-[16px] leading-[1.8] text-body`} style={delay(1)}>
            {t.abstract.body}
          </p>
        </div>
      </section>

      {/* El atlas sube por delante de datos, índice y econometría. Arrancaba a
          2.820px de una página de 7.489 en escritorio y a 4.608 de 12.349 en el
          teléfono —cinco pantallas y media— cuando es la razón de estar en esta
          página: quien llega aquí desde la figura de la portada viene a ver el
          mapa, no a leer la construcción del índice antes de llegar a él. La
          navegación de sección se reordena con él. */}
      {/* ================= ATLAS — the map is the figure this page is built around ====== */}
      <section id="atlas" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.atlas.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.atlas.title}</h2>
          <p data-reveal className={`reveal mt-4 ${prose} text-[15px] leading-[1.75] text-body`} style={delay(2)}>
            {t.atlas.body}
          </p>

          <div className="mt-9">
            <Atlas copy={t.atlasCopy} locale={lang === "en" ? "en-US" : "es-CO"} />
          </div>

          <ul className="mt-9 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {t.atlas.notes.map((n, i) => (
              <li key={i} className="border-t border-rulesoft pt-4 text-[14px] leading-[1.65] text-body">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= DATA ================= */}
      <section id="datos" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.data.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.data.title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {t.data.items.map((m, i) => (
              <div key={m.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{m.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INDEX ================= */}
      <section id="metodo" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.method.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.method.title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {t.method.items.map((m, i) => (
              <div key={m.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{m.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESULTS — the verdict, in the cold band, then the evidence ===== */}
      <section id="resultados" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.results.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.results.title}</h2>

          <div data-reveal className="reveal mt-8 border-y border-cold bg-coldsoft px-6 py-7" style={delay(2)}>
            <p className="max-w-[34ch] text-balance font-display text-[clamp(20px,2.6vw,27px)] leading-[1.25] font-bold tracking-[-0.015em] text-ink">
              {t.results.headline}
            </p>
            <p className="mt-4 font-figure text-[clamp(22px,3vw,30px)] leading-none text-cold">{t.results.stat}</p>
            <p className="mt-5 max-w-[74ch] text-[15px] leading-[1.7] text-ink">{t.results.body}</p>
          </div>

          {/* the table: the number the band only summarises */}
          <div tabIndex={0} role="region" aria-label={t.results.label} className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[14px]">
              <thead>
                <tr className="border-b-2 border-ink text-left text-[12.5px] font-semibold tracking-[0.06em] text-muted uppercase">
                  <th className="py-2 pr-4 font-semibold">{t.results.tableHead.spec}</th>
                  <th className="py-2 pr-4 text-right font-semibold">{t.results.tableHead.coef}</th>
                  <th className="py-2 pr-4 text-right font-semibold">{t.results.tableHead.se}</th>
                  <th className="py-2 pr-4 text-right font-semibold">{t.results.tableHead.p}</th>
                  <th className="py-2 text-right font-semibold">{t.results.tableHead.n}</th>
                </tr>
              </thead>
              <tbody>
                {t.results.rows.map((r) => (
                  <tr key={r.spec} className="border-b border-rulesoft">
                    <td className="py-2.5 pr-4 text-ink">{r.spec}</td>
                    <td className="py-2.5 pr-4 text-right font-figure text-[16px] text-ink">{r.coef}</td>
                    <td className="py-2.5 pr-4 text-right text-body">{r.se}</td>
                    <td className="py-2.5 pr-4 text-right text-body">{r.p}</td>
                    <td className="py-2.5 text-right text-body">{r.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* three readings that carry the inference */}
          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3">
            {t.results.tiles.map((f, i) => (
              <div key={f.label} data-reveal className="reveal border-t border-rule pt-4" style={delay(i)}>
                <dd className="font-figure text-[clamp(26px,3.2vw,34px)] leading-none text-ink">{f.value}</dd>
                <dt className="mt-2 text-[14px] leading-[1.4] font-medium text-ink">{f.label}</dt>
                <p className="mt-1 text-[14px] leading-[1.55] text-body">{f.note}</p>
              </div>
            ))}
          </dl>

          <ul className="mt-9 max-w-[92ch]">
            {t.results.reading.map((r, i) => (
              <li
                key={i}
                data-reveal
                className="reveal grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-4 text-[14.5px] leading-[1.7] text-body first:border-t-2 first:border-ink"
                style={delay(i)}
              >
                <span className="font-figure text-[18px] leading-none text-cold">{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= DECISIONS ================= */}
      <section id="decisiones" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.decisions.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.decisions.title}</h2>
          <p data-reveal className={`reveal mt-4 ${prose} text-[15px] leading-[1.75] text-body`} style={delay(2)}>
            {t.decisions.body}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {t.decisions.items.map((d, i) => (
              <div key={d.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{d.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REPRODUCE ================= */}
      <section id="reproducir" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.reproduce.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.reproduce.title}</h2>
          <ol className="mt-8 max-w-[92ch]">
            {t.reproduce.steps.map((s, i) => (
              <li
                key={s.cmd}
                data-reveal
                className="reveal grid grid-cols-1 items-baseline gap-x-8 border-t border-rulesoft py-4 md:grid-cols-[minmax(0,24ch)_1fr]"
                style={delay(i)}
              >
                <code className="text-[14px] font-semibold text-cold">{s.cmd}</code>
                <p className="mt-1.5 text-[14.5px] leading-[1.7] text-body md:mt-0">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[80ch] text-[14px] leading-[1.7] text-muted">{t.reproduce.note}</p>
        </div>
      </section>

      {/* ================= STATUS + REPO ================= */}
      <section className="py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.status.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.status.title}</h2>
          <ol className="mt-6 max-w-[80ch]">
            {t.status.items.map((s, i) => (
              <li
                key={i}
                className="grid grid-cols-[32px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3 text-[14.5px] leading-[1.65] first:border-t-2 first:border-ink"
              >
                <span className="font-figure text-[20px] leading-none text-cold">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href={THESIS_REPO}
              {...ext}
              className="lift rounded-[3px] bg-cold px-5 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {t.repoCta}
            </a>
            <Link href={`/${lang}`} className="rounded-[3px] border border-control px-5 py-3 text-[14px] text-ink transition-colors hover:border-cold">
              {t.backCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Cerraba en «volver al inicio» o en GitHub: justo donde el lector está
          más convencido. La banda es la misma de /historia. */}
      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
