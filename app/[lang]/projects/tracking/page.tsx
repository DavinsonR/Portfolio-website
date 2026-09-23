import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import StatusPill from "@/components/StatusPill";
import BackLink from "@/components/BackLink";
import ContactBand from "@/components/ContactBand";
import SectionNav from "@/components/SectionNav";
import { alternates, social } from "@/lib/config/alternates";

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
            <h1 className="mt-3 max-w-[30ch] text-balance font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
              {t.title}
            </h1>
            <p className="mt-4 max-w-[70ch] text-[15.5px] leading-[1.7] text-ink">{t.subtitle}</p>
            <p className="mt-3 text-[14px] text-body">{t.access}</p>
            <p className="mt-1 text-[14px] text-muted">{t.timeline}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={t.demoUrl}
                {...ext}
                className="lift rounded-[3px] bg-cold px-5 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {t.demo.cta}
              </a>
              <span className="text-[14px] text-muted">{t.demo.ctaNote}</span>
            </div>
          </div>
        </div>

        {/* figures band — each figure lands on the section that states it */}
        <div className="border-t-2 border-cold bg-coldsoft">
          <div className={wrap}>
            {/* Lista simple, no `<dl>`: el ancla envolvía `<dt>` y `<dd>` y no es
                padre válido de ninguno de los dos. */}
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
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {t.demo.shots.map((s, i) => (
              <figure key={s.file} data-reveal className="reveal" style={delay(i)}>
                <Image
                  src={`/tracking/${s.file}.webp`}
                  width={393}
                  height={800}
                  unoptimized
                  // El <figcaption> ya nombra y describe la pantalla; un alt que lo
                  // repite se oye dos veces. Imagen descrita por su pie: alt vacío.
                  alt=""
                  className="w-full border border-rule"
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
            {t.decisions.items.map((d, i) => (
              <div key={d.title} data-reveal className="reveal border-t border-rule pt-5" style={delay(i)}>
                <p className="text-[14.5px] font-semibold text-ink">{d.title}</p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-body">{d.body}</p>
              </div>
            ))}
          </div>
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
