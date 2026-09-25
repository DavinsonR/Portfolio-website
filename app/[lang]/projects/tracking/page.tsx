import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import ProjectHero from "@/components/project/ProjectHero";
import Preview from "@/components/showcase/Previews";
import ContactBand from "@/components/ContactBand";
import SectionNav from "@/components/SectionNav";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.tracking.metaTitle,
    description: dict.tracking.metaDesc,
    alternates: alternates(lang, "/projects/tracking"),
    // Sin esto la página hereda el `openGraph` del layout entero y su tarjeta en
    // LinkedIn es la de la portada, enlazando a la portada.
    ...social(lang, "/projects/tracking", {
      title: dict.tracking.metaTitle,
      description: dict.tracking.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

/* A product page, not a case study: the demo is the argument, so it gets the first
   section and a link in two places. Cold accent throughout — amber stays reserved for
   human content. The screenshots are the app's own, carrying the demo banner they were
   captured with, so nobody can mistake generated figures for someone's real finances. */
const wrap = "mx-auto max-w-[980px] px-6";
const prose = "max-w-[74ch]";
const label = "text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase";
const heading =
  "mt-3 max-w-[28ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink";
const section = "scroll-mt-[118px] border-b border-rule py-16";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const delay = (i: number) => ({ "--d": `${i * 60}ms` }) as React.CSSProperties;

export default async function TrackingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.tracking;
  const card = dict.work.cards.find((c) => c.href === "/projects/tracking")!;

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(dict, lang, "/projects/tracking", { title: t.metaTitle, description: t.metaDesc }, { type: "SoftwareApplication", url: t.demoUrl, applicationCategory: "LifestyleApplication" })) }}
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
        meta={[t.access, t.timeline]}
        ctas={[{ href: t.demoUrl, label: t.demo.cta, tone: "solid" }]}
        ctaNote={t.demo.ctaNote}
        visual={<Preview card={card} lang={lang} />}
        visualCaption={card.caption}
        figures={t.figures.map((f) => ({ value: f.value, label: f.label, note: f.note, href: f.href }))}
      />

      <SectionNav items={t.nav} label={t.metaTitle} wrap={wrap} />

      {/* ================= DEMO ================= */}
      <section id="demo" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.demo.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.demo.title}</h2>
          <p data-reveal className={`reveal mt-5 ${prose} text-[16px] leading-[1.8] text-body`} style={delay(2)}>
            {t.demo.body}
          </p>

          {/* the claim the whole design rests on, stated where it can be checked */}
          <div data-reveal className="reveal mt-8 border-y border-cold bg-coldsoft px-6 py-7" style={delay(3)}>
            <p className="max-w-[34ch] text-balance font-display text-[clamp(20px,2.6vw,27px)] leading-[1.25] font-bold tracking-[-0.015em] text-ink">
              {t.demo.ruleTitle}
            </p>
            <p className="mt-5 max-w-[74ch] text-[15px] leading-[1.7] text-ink">{t.demo.ruleBody}</p>
          </div>

          <h3 className="mt-12 font-display text-[clamp(20px,2.4vw,25px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
            {t.demo.shotsTitle}
          </h3>
          <p className="mt-1 text-[14px] text-muted">{t.demo.shotsNote}</p>
          <div className="-mx-6 mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4">
            {t.demo.shots.map((s, i) => (
              <figure key={s.file} data-reveal className="reveal w-[280px] shrink-0 snap-start sm:w-[320px]" style={delay(i)}>
                {/* <img> y no next/image: con `unoptimized` el componente no
                    convertía, ni redimensionaba, ni generaba srcset — solo enviaba
                    su runtime (4,8 KB br) por cada ruta con una imagen. Ya son WebP
                    con sus medidas. El <figcaption> nombra y describe la pantalla;
                    un alt que lo repite se oye dos veces: alt vacío. */}
                <img
                  src={`/tracking/${s.file}.webp`}
                  width={393}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  className="w-full rounded-[14px] border border-rule"
                />
                <figcaption className="mt-3">
                  <span className="text-[14.5px] font-semibold text-ink">{s.name}</span>
                  <span className="mt-1.5 block text-[14px] leading-[1.6] text-body">{s.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <h3 className="mt-12 font-display text-[clamp(20px,2.4vw,25px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
            {t.demo.personTitle}
          </h3>
          <ul className="mt-4 max-w-[92ch]">
            {t.demo.person.map((p, i) => (
              <li
                key={i}
                data-reveal
                className="reveal grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3.5 text-[14.5px] leading-[1.7] text-body first:border-t-2 first:border-ink"
                style={delay(i)}
              >
                <span className="font-figure text-[18px] leading-none text-cold">{i + 1}</span>
                <span>{p}</span>
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
            {t.decisions.items.slice(0, 3).map((d, i) => (
              <div key={d.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{d.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{d.body}</p>
              </div>
            ))}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer text-[14.5px] font-semibold text-cold">
              {t.more.replace("{n}", String(t.decisions.items.length - 3))}
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              {t.decisions.items.slice(3).map((d) => (
                <div key={d.title} className="border-t border-rule pt-5">
                  <p className="text-[14.5px] font-semibold text-ink">{d.title}</p>
                  <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{d.body}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ================= DATA ================= */}
      <section id="datos" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.data.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.data.title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {t.data.items.slice(0, 3).map((m, i) => (
              <div key={m.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{m.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{m.body}</p>
              </div>
            ))}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer text-[14.5px] font-semibold text-cold">
              {t.more.replace("{n}", String(t.data.items.length - 3))}
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              {t.data.items.slice(3).map((m) => (
                <div key={m.title} className="border-t border-rule pt-5">
                  <p className="text-[14.5px] font-semibold text-ink">{m.title}</p>
                  <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{m.body}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section id="procesos" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.process.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.process.title}</h2>
          <p data-reveal className={`reveal mt-4 ${prose} text-[15px] leading-[1.75] text-body`} style={delay(2)}>
            {t.process.body}
          </p>

          <ol className="mt-8 max-w-[92ch]">
            {t.process.gates.map((g, i) => (
              <li
                key={g.name}
                data-reveal
                className="reveal grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3 first:border-t-2 first:border-ink sm:grid-cols-[28px_minmax(0,22ch)_1fr]"
                style={delay(i)}
              >
                <span className="font-figure text-[18px] leading-none text-cold">{i + 1}</span>
                <span className="text-[14.5px] font-semibold text-ink">{g.name}</span>
                <span className="col-start-2 mt-1 text-[14.5px] leading-[1.65] text-body sm:col-start-3 sm:mt-0">
                  {g.detail}
                </span>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 font-display text-[clamp(20px,2.4vw,25px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
            {t.process.guardsTitle}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {t.process.guards.map((g, i) => (
              <div key={g.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{g.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECURITY ================= */}
      <section id="seguridad" className={section}>
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.security.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.security.title}</h2>
          <div className="mt-8 max-w-[92ch]">
            {t.security.items.map((s, i) => (
              <div
                key={s.title}
                data-reveal
                className="reveal border-t border-rulesoft py-5 first:border-t-2 first:border-ink"
                style={delay(i)}
              >
                <p className="text-[15px] font-semibold text-ink">{s.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.75] text-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATUS ================= */}
      <section id="estado" className="scroll-mt-[118px] py-16">
        <div className={wrap}>
          <p data-reveal className={`reveal ${label}`}>{t.status.label}</p>
          <h2 data-reveal className={`reveal ${heading}`} style={delay(1)}>{t.status.title}</h2>

          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-[19px] font-bold tracking-[-0.015em] text-ink">
                {t.status.liveTitle}
              </h3>
              <ul className="mt-4">
                {t.status.live.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3.5 text-[14.5px] leading-[1.7] text-body first:border-t-2 first:border-ink"
                  >
                    <span className="font-figure text-[18px] leading-none text-cold">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-[19px] font-bold tracking-[-0.015em] text-ink">
                {t.status.pendingTitle}
              </h3>
              <ul className="mt-4">
                {t.status.pending.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[28px_1fr] items-baseline gap-x-3 border-t border-rulesoft py-3.5 text-[14.5px] leading-[1.7] text-body first:border-t-2 first:border-ink"
                  >
                    <span className="font-figure text-[18px] leading-none text-cold">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 max-w-[80ch] text-[14px] leading-[1.7] text-muted">{t.status.note}</p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href={t.demoUrl}
              {...ext}
              className="lift rounded-[3px] bg-cold px-5 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {t.demo.cta}
            </a>
            <Link
              href={`/${lang}`}
              className="rounded-[3px] border border-control px-5 py-3 text-[14px] text-ink transition-colors hover:border-cold"
            >
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
