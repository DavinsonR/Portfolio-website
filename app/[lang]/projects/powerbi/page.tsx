import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import {
  TABLES, RELATIONSHIPS, MEASURES, PAGES, VISUAL_COUNT, PBI_SOURCE_COMMIT, pbiUrl, measuresOf, type PbiVisual,
} from "@/lib/data/powerbi-model";
import { reportShot } from "@/lib/data/powerbi-shots";
import SectionNav from "@/components/SectionNav";
import ProjectHero from "@/components/project/ProjectHero";
import Preview from "@/components/showcase/Previews";
import ReportMock from "@/components/powerbi/ReportMock";
import ContactBand from "@/components/ContactBand";
import ModelDiagram from "@/components/powerbi/ModelDiagram";
import MeasureCatalogue from "@/components/powerbi/MeasureCatalogue";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";
import { TRADING_SIM_REPO } from "@/lib/data/trading-sim";

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
  const card = dict.work.cards.find((c) => c.href === "/projects/powerbi")!;

  // Every figure in the band is derived from the catalogue, never typed.
  const facts = [
    { value: TABLES.length, label: t.facts.tables, href: pbiUrl.tablesDir },
    { value: RELATIONSHIPS.length, label: t.facts.relationships, href: pbiUrl.relationships },
    { value: MEASURES.length, label: t.facts.measures, href: pbiUrl.table("combination_analysis") },
    { value: VISUAL_COUNT, label: t.facts.visuals, href: pbiUrl.pagesDir },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(dict, lang, "/projects/powerbi", { title: t.metaTitle, description: t.metaDesc }, { type: "SoftwareSourceCode", codeRepository: TRADING_SIM_REPO })) }}
      />
      {/* ================= HERO ================= */}
      <ProjectHero
        lang={lang}
        backLabel={dict.nav.backHome}
        status="live"
        pill={t.pill}
        kicker={t.kicker}
        title={t.title}
        lede={t.intro}
        meta={[
          <>
            {t.sourceLine}{" "}
            <a href={pbiUrl.commit} {...ext} className="text-cold hover:underline">{PBI_SOURCE_COMMIT.short}</a>{" "}
            ({PBI_SOURCE_COMMIT.date}) {t.sourceTail}
          </>,
        ]}
        ctas={[
          { href: "#paginas", label: t.hero.ctaModel, tone: "solid" },
          { href: pbiUrl.pbip, label: t.hero.ctaPbip, tone: "outline" },
        ]}
        visual={<Preview card={card} lang={lang} />}
        visualCaption={card.caption}
        figures={facts.map((f) => ({ value: String(f.value), label: f.label, href: f.href }))}
      />

      <SectionNav items={t.nav} label={t.metaTitle} wrap={wrap} />

      {/* ================= PAGES ================= */}
      <section id="paginas" className="scroll-mt-[118px] border-b border-rule py-16">
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

                <div className="mt-5">
                  {shot ? (
                    <figure className="m-0">
                      <img src={shot.src} width={shot.width} height={shot.height} loading="lazy" decoding="async" alt={`${t.pages.shotAlt} ${p.displayName}`} className="w-full rounded-[12px] border border-rule" />
                      <figcaption className="mt-2 text-[14px] text-muted">{p.displayName} · {t.pages.shotCaption}</figcaption>
                    </figure>
                  ) : (
                    <ReportMock page={p.id} lang={lang} pages={PAGES.map((x) => ({ id: x.id, name: x.displayName }))} note={t.pages.noShot} />
                  )}
                </div>

                {/* El inventario sigue, pero plegado: le sirve a quien lee PBIR,
                    y eran ~2.500 px de lista para todos los demás (DP-02). */}
                <details className="group mt-4 border-t border-rulesoft pt-3">
                  <summary className="cursor-pointer text-[14px] font-semibold text-cold">
                    {t.pages.inventory} · {p.visuals.length} {t.pages.visualsWord}
                  </summary>
                <ol className="mt-3">
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
                </details>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= MODEL ================= */}
      <section id="modelo" className="scroll-mt-[118px] border-b border-rule py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.model.label}</p>
          <h2 data-reveal className="reveal mt-3 max-w-[26ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink" style={{ "--d": "60ms" } as React.CSSProperties}>
            {t.model.title}
          </h2>
          <p data-reveal className="reveal mt-3 max-w-[68ch] text-[15px] leading-[1.7]" style={{ "--d": "110ms" } as React.CSSProperties}>
            {t.model.desc}
          </p>

          <div data-reveal className="reveal mt-8 border-t border-rule pt-6">
            {/* El diagrama pide 640 px: en el teléfono se cortaba (DP-03). Ahí
                va la estrella de la tarjeta, que escala; el detalle de cada
                tabla sigue en la lista de abajo. */}
            <div className="hidden sm:block">
              <ModelDiagram labels={{ diagramTitle: t.model.diagramTitle, legend: t.model.legend, headers: t.model.headers }} />
            </div>
            <div className="sm:hidden">
              <Preview card={card} lang={lang} />
            </div>
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
      <section id="medidas" className="scroll-mt-[118px] border-b border-rule py-16">
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

      {/* ================= LICENSING ================= */}
      <section id="licencia" className="scroll-mt-[118px] py-16">
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
        </div>
      </section>

      {/* Cerraba en «volver al inicio» o en GitHub: justo donde el lector está
          más convencido. La banda es la misma de /historia. */}
      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
