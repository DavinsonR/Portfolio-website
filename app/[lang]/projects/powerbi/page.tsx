import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import {
  TABLES, RELATIONSHIPS, MEASURES, PAGES, VISUAL_COUNT, PBI_SOURCE_COMMIT, pbiUrl, measuresOf, type PbiVisual,
} from "@/lib/data/powerbi-model";
import { reportShot } from "@/lib/data/powerbi-shots";
import StatusPill from "@/components/StatusPill";
import BackLink from "@/components/BackLink";
import ContactBand from "@/components/ContactBand";
import ModelDiagram from "@/components/powerbi/ModelDiagram";
import MeasureCatalogue from "@/components/powerbi/MeasureCatalogue";
import { alternates, social } from "@/lib/config/alternates";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.powerbi.metaTitle,
    description: dict.powerbi.metaDesc,
    alternates: alternates(lang, "/projects/powerbi"),
    ...social(lang, "/projects/powerbi", {
      title: dict.powerbi.metaTitle,
      description: dict.powerbi.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

const wrap = "mx-auto max-w-[980px] px-6";
const label = "text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function PowerBiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.powerbi;

  // Every figure in the band is derived from the catalogue, never typed.
  const facts = [
    { value: TABLES.length, label: t.facts.tables, href: pbiUrl.tablesDir },
    { value: RELATIONSHIPS.length, label: t.facts.relationships, href: pbiUrl.relationships },
    { value: MEASURES.length, label: t.facts.measures, href: pbiUrl.table("combination_analysis") },
    { value: VISUAL_COUNT, label: t.facts.visuals, href: pbiUrl.pagesDir },
  ];

  return (
    <main id="main" tabIndex={-1}>
      {/* ================= HERO ================= */}
      <header className="border-b border-rule">
        <div className={wrap}>
          <div className="pt-20 pb-12">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <BackLink href={`/${lang}`} label={dict.nav.backHome} />
              <StatusPill status="live" text={t.pill} />
            </div>
            <p className={label}>{t.kicker}</p>
            <h1 className="mt-3 max-w-[820px] font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
              {t.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-[15.5px] leading-[1.75]">{t.intro}</p>
            <p className="mt-3 max-w-[680px] text-[14px] text-muted">
              {t.sourceLine}{" "}
              <a href={pbiUrl.commit} {...ext} className="text-cold hover:underline">
                {PBI_SOURCE_COMMIT.short}
              </a>{" "}
              ({PBI_SOURCE_COMMIT.date}) {t.sourceTail}
            </p>
          </div>
        </div>

        {/* figures band — the same instrument as the front page, derived from the data file */}
        <div className="border-t-2 border-cold bg-coldsoft">
          <div className={wrap}>
            {/* Lista simple, no `<dl>`: el ancla envolvía `<dt>` y `<dd>` y no es
                padre válido de ninguno, así que el par término/definición no se
                exponía. Misma banda, mismo objetivo de clic, marcado válido. */}
            <ul className="grid grid-cols-2 py-6 lg:grid-cols-4">
              {facts.map((f, i) => (
                <li
                  key={f.label}
                  data-reveal
                  className="reveal border-coldline py-2 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
                  style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                >
                  <a href={f.href} {...ext} className="lift group block">
                    <span className="block font-figure text-[clamp(28px,3.8vw,40px)] leading-none text-ink group-hover:text-cold">
                      {f.value}
                    </span>
                    <span className="block mt-2 max-w-[26ch] text-[14px] leading-[1.4] font-medium text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 group-hover:decoration-[2.5px]">
                      {f.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ================= MODEL ================= */}
      <section id="modelo" className="scroll-mt-[72px] border-b border-rule py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.model.label}</p>
          <h2 data-reveal className="reveal mt-3 max-w-[26ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink" style={{ "--d": "60ms" } as React.CSSProperties}>
            {t.model.title}
          </h2>
          <p data-reveal className="reveal mt-3 max-w-[68ch] text-[15px] leading-[1.7]" style={{ "--d": "110ms" } as React.CSSProperties}>
            {t.model.desc}
          </p>

          <div data-reveal className="reveal mt-8 border-t border-rule pt-6">
            <ModelDiagram labels={{ diagramTitle: t.model.diagramTitle, legend: t.model.legend, headers: t.model.headers }} />
          </div>

          <h3 className="mt-8 font-display text-[19px] font-bold tracking-[-0.015em] text-ink">{t.model.headers.relationships}</h3>
          <ul id="pbi-relationships" className="mt-3">
            {RELATIONSHIPS.map((r) => (
              <li key={r.name} className="flex flex-wrap items-baseline gap-x-3 border-t border-rulesoft py-2.5 text-[14.5px]">
                <a href={pbiUrl.relationships} {...ext} className="font-semibold text-ink hover:text-cold">{r.name}</a>
                <span className="text-body">{r.from}.{r.column} → {r.to}.{r.column}</span>
                <span className="text-[14px] text-muted">{t.model.relationshipLine}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-display text-[19px] font-bold tracking-[-0.015em] text-ink">{t.model.headers.table}s</h3>
          <dl className="mt-3">
            {TABLES.map((tb, i) => (
              <div
                key={tb.name}
                data-reveal
                className="reveal grid gap-x-6 gap-y-1 border-t border-rule py-4 first:border-t-2 first:border-ink sm:grid-cols-[220px_1fr]"
                style={{ "--d": `${i * 50}ms` } as React.CSSProperties}
              >
                <dt>
                  <a href={pbiUrl.table(tb.name)} {...ext} className="text-[15px] font-semibold text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold">
                    {tb.name}
                  </a>
                  <p className="mt-1 text-[12.5px] tracking-[0.07em] text-muted uppercase">{t.model.legend[tb.role]}</p>
                </dt>
                <dd className="text-[14.5px] leading-[1.6] text-body">
                  <span className="text-ink">{t.model.grain[tb.name]}</span>
                  <span className="text-muted"> · {t.model.headers.source.toLowerCase()} {tb.source}</span>
                  <span className="text-muted"> · {tb.columns.length} {t.model.headers.columns}</span>
                  {measuresOf(tb.name).length > 0 && (
                    <span className="text-cold"> · {measuresOf(tb.name).length} {t.model.headers.measures}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= MEASURES ================= */}
      <section id="medidas" className="scroll-mt-[72px] border-b border-rule py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.measures.label}</p>
          <h2 data-reveal className="reveal mt-3 max-w-[26ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink" style={{ "--d": "60ms" } as React.CSSProperties}>
            {t.measures.title}
          </h2>
          <p data-reveal className="reveal mt-3 max-w-[68ch] text-[15px] leading-[1.7]" style={{ "--d": "110ms" } as React.CSSProperties}>
            {t.measures.desc}
          </p>
          <div data-reveal className="reveal mt-8">
            <MeasureCatalogue labels={{ headers: t.measures.headers, meaning: t.measures.meaning, measuresWord: t.model.headers.measures }} />
          </div>
        </div>
      </section>

      {/* ================= PAGES ================= */}
      <section id="paginas" className="scroll-mt-[72px] border-b border-rule py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.pages.label}</p>
          <h2 data-reveal className="reveal mt-3 max-w-[26ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink" style={{ "--d": "60ms" } as React.CSSProperties}>
            {t.pages.title}
          </h2>
          <p data-reveal className="reveal mt-3 max-w-[68ch] text-[15px] leading-[1.7]" style={{ "--d": "110ms" } as React.CSSProperties}>
            {t.pages.desc}
          </p>

          {PAGES.map((p, i) => {
            const shot = reportShot(p.id);
            const visuals: readonly PbiVisual[] = p.visuals;
            return (
              <article key={p.id} data-reveal className="reveal mt-10 border-t border-rule pt-6 first:border-t-2 first:border-ink" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-[19px] font-bold tracking-[-0.015em] text-ink">
                    <a href={pbiUrl.page(p.id)} {...ext} className="hover:text-cold">{p.displayName}</a>
                  </h3>
                  <span className="text-[12.5px] tracking-[0.07em] text-muted uppercase">{p.visuals.length} {t.pages.visualsWord}</span>
                </div>
                <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.7]">{t.pages.summary[p.id]}</p>

                {shot ? (
                  <figure className="mt-5">
                    <Image src={shot.src} width={shot.width} height={shot.height} unoptimized alt={`${t.pages.shotAlt} ${p.displayName}`} className="w-full border border-rule" />
                    <figcaption className="mt-2 text-[14px] text-muted">{p.displayName} · {t.pages.shotCaption}</figcaption>
                  </figure>
                ) : (
                  <p className="mt-4 text-[14px] text-muted">{t.pages.noShot}</p>
                )}

                <ol className="mt-4">
                  {visuals.map((v) => (
                    <li key={v.id} className="grid gap-x-5 gap-y-0.5 border-t border-rulesoft py-2.5 text-[14.5px] sm:grid-cols-[120px_1fr]">
                      <span className="text-[12.5px] tracking-[0.07em] text-cold uppercase">{t.pages.types[v.type]}</span>
                      <span>
                        <a href={pbiUrl.visual(p.id, v.id)} {...ext} className="text-ink hover:text-cold">
                          {v.title ?? v.id}
                        </a>
                        <span className="block text-[14px] text-muted">{v.fields.join(" · ")}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= LICENSING ================= */}
      <section id="licencia" className="scroll-mt-[72px] py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.licensing.label}</p>
          <h2 data-reveal className="reveal mt-3 max-w-[26ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink" style={{ "--d": "60ms" } as React.CSSProperties}>
            {t.licensing.title}
          </h2>
          <p data-reveal className="reveal mt-3 max-w-[70ch] text-[15px] leading-[1.7]" style={{ "--d": "110ms" } as React.CSSProperties}>
            {t.licensing.body}
          </p>
          <ol className="mt-6 max-w-[70ch]">
            {t.licensing.steps.map((s, i) => (
              <li key={i} className="grid grid-cols-[32px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3 text-[14.5px] leading-[1.6]">
                <span className="font-figure text-[20px] leading-none text-cold">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a href={pbiUrl.pbip} {...ext} className="lift rounded-[3px] bg-cold px-5 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90">
              {t.licensing.ctaPbip}
            </a>
            <a href={pbiUrl.folder} {...ext} className="rounded-[3px] border border-control px-5 py-3 text-[14px] text-ink transition-colors hover:border-cold">
              {t.licensing.ctaFolder}
            </a>
            <a href={pbiUrl.readme} {...ext} className="px-1 py-3 text-[14px] font-medium text-cold hover:underline">
              {t.licensing.ctaReadme}
            </a>
          </div>
          <p className="mt-10 border-t border-rule pt-5">
            <Link href={`/${lang}`} className="text-[14px] font-semibold text-cold hover:underline">
              {t.backCta}
            </Link>
          </p>
        </div>
      </section>

      {/* Cerraba en «volver al inicio» o en GitHub: justo donde el lector está
          más convencido. La banda es la misma de /historia. */}
      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
