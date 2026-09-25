import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { MACRO_REPO } from "@/lib/content/forecast";
import ProjectHero from "@/components/project/ProjectHero";
import Preview from "@/components/showcase/Previews";
import ContactBand from "@/components/ContactBand";
import SectionNav from "@/components/SectionNav";
import Island from "@/components/forecast/Island";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";

const ROUTE = "/labs/macro-forecast";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.forecastLab;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
    alternates: alternates(lang, ROUTE),
    ...social(lang, ROUTE, { title: t.metaTitle, description: t.metaDesc, siteName: dict.profile.name }),
  };
}

/* El primer laboratorio del sitio. A diferencia de la tesis, que gira en torno a un
   mapa de Colombia, aquí el eje es el tiempo: la región entra como un conjunto de
   economías que se comparan, no como geografía. Cada sección trae una pieza que el
   lector mueve; el texto a su alrededor es de servidor y se lee sin JavaScript. Las
   piezas son islas perezosas (components/forecast/Island.tsx): lo que baja con el
   HTML es la puerta, no los gráficos. */
const wrap = "mx-auto max-w-[1080px] px-6";
const prose = "max-w-[74ch]";
const label = "text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase";
const heading =
  "mt-3 max-w-[30ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink";
const section = "scroll-mt-[118px] border-b border-rule py-16";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const delay = (i: number) => ({ "--d": `${i * 60}ms` }) as React.CSSProperties;

export default async function ForecastLabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.forecastLab;

  const intro = (id: string, s: { label: string; title: string; body: string }) => (
    <>
      <p data-reveal className={`reveal ${label}`}>{s.label}</p>
      <h2 id={`${id}-h`} data-reveal className={`reveal ${heading}`} style={delay(1)}>{s.title}</h2>
      <p data-reveal className={`reveal mt-4 ${prose} text-[15px] leading-[1.75] text-body`} style={delay(2)}>
        {s.body}
      </p>
    </>
  );

  const card = dict.work.cards.find((c) => c.href === "/labs/macro-forecast")!;

  const pieces = [
    { id: "juega", kind: "play", copy: t.play },
    { id: "backtest", kind: "backtest", copy: t.backtest },
    { id: "region", kind: "region", copy: t.region },
    { id: "frecuencia", kind: "frequency", copy: t.frequency },
    { id: "holm", kind: "holm", copy: t.holm },
  ] as const;

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageGraph(dict, lang, ROUTE, { title: t.metaTitle, description: t.metaDesc }, { type: "SoftwareSourceCode", codeRepository: MACRO_REPO, programmingLanguage: "Python" }),
          ),
        }}
      />
      {/* ================= HERO ================= */}
      <ProjectHero
        lang={lang}
        backLabel={dict.nav.backHome}
        status="live"
        pill={t.pill}
        kicker={t.kicker}
        title={t.title}
        lede={t.subtitle}
        meta={[t.meta, t.timeline]}
        ctas={[
          { href: "#panorama", label: t.ctaBoard, tone: "solid" },
          { href: "#juega", label: t.ctaPlay, tone: "outline" },
        ]}
        visual={<Preview card={card} lang={lang} />}
        visualCaption={card.caption}
        figures={t.figures.map((f) => ({ value: f.value, label: f.label, note: f.note, href: f.href }))}
      />

      <SectionNav items={t.nav} label={t.metaTitle} wrap={wrap} />

      {/* ================= PANORAMA — lo primero después de la entrada ================= */}
      <section id="panorama" aria-labelledby="panorama-h" className={section}>
        <div className={wrap}>{intro("panorama", t.dashboard)}</div>
        {/* El tablero usa todo el ancho útil: una grilla de visuales no cabe en una columna de lectura. */}
        <div className="mx-auto mt-8 max-w-[1440px] px-4 sm:px-6">
          <Island kind="dashboard" copy={t.lab} lang={lang} />
        </div>
      </section>

      {/* ================= LAS SEIS PIEZAS ================= */}
      {pieces.map((p) => (
        <section key={p.id} id={p.id} aria-labelledby={`${p.id}-h`} className={section}>
          <div className={wrap}>
            {intro(p.id, p.copy)}
            <div className="mt-9">
              <Island kind={p.kind} copy={t.lab} lang={lang} />
            </div>
          </div>
        </section>
      ))}

      {/* ================= VEREDICTO ================= */}
      <section id="veredicto" aria-labelledby="veredicto-h" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.verdict.label}</p>
          <h2 id="veredicto-h" data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.verdict.title}</h2>
          <div data-reveal className="reveal mt-8 border-y border-cold bg-coldsoft px-6 py-7" style={delay(2)}>
            <p className="max-w-[40ch] text-balance font-display text-[clamp(20px,2.6vw,27px)] leading-[1.25] font-bold tracking-[-0.015em] text-ink">
              {t.verdict.headline}
            </p>
            <p className="mt-4 font-figure text-[clamp(22px,3vw,30px)] leading-none text-cold">{t.verdict.stat}</p>
            <p className="mt-5 max-w-[80ch] text-[15px] leading-[1.7] text-ink">{t.verdict.body}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {[t.verdict.holds, t.verdict.not].map((block, b) => (
              <div key={block.label}>
                <h3 className={`text-[12.5px] font-semibold tracking-[0.09em] uppercase ${b === 0 ? "text-cold" : "text-muted"}`}>{block.label}</h3>
                <ol className="mt-3">
                  {block.items.map((s, i) => (
                    <li key={i} className="grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3 text-[14.5px] leading-[1.65] text-body first:border-t-2 first:border-ink">
                      <span className={`font-figure text-[18px] leading-none ${b === 0 ? "text-cold" : "text-muted"}`}>{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROTOCOLO ================= */}
      <section id="protocolo" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.method.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.method.title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {t.method.items.map((m, i) => (
              <div key={m.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{m.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REPRODUCIR ================= */}
      <section id="reproducir" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.reproduce.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.reproduce.title}</h2>
          <ol className="mt-8 max-w-[92ch]">
            {t.reproduce.steps.map((s, i) => (
              <li
                key={s.cmd}
                data-reveal
                className="reveal grid grid-cols-1 items-baseline gap-x-8 border-t border-rulesoft py-4 md:grid-cols-[minmax(0,36ch)_1fr]"
                style={delay(i)}
              >
                <code className="text-[14px] font-semibold break-words text-cold">{s.cmd}</code>
                <p className="mt-1.5 text-[14.5px] leading-[1.7] text-body md:mt-0">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[80ch] text-[14px] leading-[1.7] text-muted">{t.reproduce.note}</p>
        </div>
      </section>

      {/* ================= ESTADO ================= */}
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
            <a href={MACRO_REPO} {...ext} className="lift rounded-[3px] bg-cold px-5 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90">
              {t.repoCta}
            </a>
            <a href={`${MACRO_REPO}/blob/main/RESULTADOS_LATAM.md`} {...ext} className="rounded-[3px] border border-control px-5 py-3 text-[14px] text-ink transition-colors hover:border-cold">
              {t.resultsCta}
            </a>
            <Link href={`/${lang}`} className="rounded-[3px] border border-control px-5 py-3 text-[14px] text-ink transition-colors hover:border-cold">
              {t.backCta}
            </Link>
          </div>
        </div>
      </section>

      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
