import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import TradingSimDashboard from "@/components/trading/TradingSimDashboard";
import LabText from "@/components/trading/LabText";
import { labSnapshot, labSnapshotOverfitting } from "@/lib/data/lab-snapshot";
import { TRADING_SIM_REPO } from "@/lib/data/trading-sim";
import StatusPill from "@/components/StatusPill";
import BackLink from "@/components/BackLink";
import ContactBand from "@/components/ContactBand";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.tradingSim.metaTitle,
    description: dict.tradingSim.metaDesc,
    alternates: alternates(lang, "/projects/trading-sim"),
    ...social(lang, "/projects/trading-sim", {
      title: dict.tradingSim.metaTitle,
      description: dict.tradingSim.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

export default async function TradingSimPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.tradingSim;
  const wrap = "max-w-[980px] mx-auto px-6";

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(dict, lang, "/projects/trading-sim", { title: t.metaTitle, description: t.metaDesc }, { type: "SoftwareSourceCode", codeRepository: TRADING_SIM_REPO, programmingLanguage: "Python" })) }}
      />
      {/* ================= HERO ================= */}
      <header className="pt-20 pb-14">
        <div className={wrap}>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <BackLink href={`/${lang}`} label={dict.nav.backHome} />
            <StatusPill status="building" />
          </div>
          {/* Iba a 50px con peso 500: más grande y más ligero que el nombre de la
              persona en la portada (44px/800), y ninguno de los dos valores
              existe en la escala del sistema. Paso Display. */}
          {/* El titular lleva la cifra que cambia cada noche: sale de la
              instantánea en el build y del índice vivo en el navegador, nunca
              del diccionario (ver lib/data/lab-stats.ts). */}
          <h1 className="max-w-[820px] font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
            <LabText template={t.title} initial={labSnapshot} lang={lang} />
          </h1>
          <p className="mt-5 text-[15.5px] leading-[1.75] max-w-[680px]">{t.intro}</p>
          <p className="mt-3 text-[14px] text-muted max-w-[680px]">{t.pipelineLine}</p>
        </div>
      </header>

      {/* ================= DASHBOARD ================= */}
      {/* El panel inyecta sus `h3` al hidratar, entre el `h1` y el primer `h2`
          de la página: el orden final era h1 → h3. La sección declara el suyo. */}
      <section className="pb-16" aria-labelledby="ts-lab">
        <div className={wrap}>
          <h2 id="ts-lab" className="sr-only">
            {t.explorer.windowTitle}
          </h2>
          <TradingSimDashboard dict={t} lang={lang} initialOverfitting={labSnapshotOverfitting} />
        </div>
      </section>

      {/* ================= METODOLOGÍA ================= */}
      <section className="py-16 border-t border-rulesoft">
        <div className={wrap}>
          <h2 className="font-display text-[clamp(23px,2.9vw,31px)] font-bold text-ink mb-2.5">{t.method.title}</h2>
          <p className="text-[14px] leading-[1.7] max-w-[620px] mb-8">{t.method.desc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.method.items.map((m) => (
              <div key={m.title} className="border-t border-rule pt-5">
                <p className="text-[14px] text-cold mb-2">{m.title}</p>
                <p className="text-[14px] leading-[1.7]">{m.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href={TRADING_SIM_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] px-5 py-3 rounded-[3px] bg-cold text-paper font-semibold hover:opacity-90 transition-opacity"
            >
              {t.method.repoCta}
            </a>
            <Link
              href={`/${lang}`}
              className="text-[14px] px-5 py-3 rounded-[3px] border border-control text-ink hover:border-cold transition-colors"
            >
              {t.method.backCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THE 89 TESTS, ITEMISED ===== */}
      <section id="calidad" className="scroll-mt-[72px] border-t border-rule py-16">
        <div className={wrap}>
          <p
            data-reveal
            className="reveal text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase"
          >
            {dict.quality.label}
          </p>
          <h2
            data-reveal
            className="reveal mt-3 max-w-[24ch] font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            {dict.quality.title}
          </h2>
          <p
            data-reveal
            className="reveal mt-3 max-w-[68ch] text-[15px] leading-[1.7]"
            style={{ "--d": "110ms" } as React.CSSProperties}
          >
            {dict.quality.desc}
          </p>

          <dl className="mt-9">
            {dict.quality.rows.map((r, i) => (
              <div
                key={r.name}
                data-reveal
                className="reveal grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-rule py-4 first:border-t-2 first:border-ink sm:grid-cols-[64px_180px_1fr]"
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                {/* <dt> primero: el modelo de contenido de <dl> es término y luego sus
                    definiciones, y con la cifra delante el «89» no quedaba asociado a
                    nada (1.3.1). En pantalla el número sigue yendo primero, con `order`. */}
                <dt className="order-2 text-[14.5px] font-semibold text-ink">{r.name}</dt>
                <dd className="order-1 font-figure text-[26px] leading-none text-cold">{r.n}</dd>
                <dd className="order-3 col-span-2 mt-1 max-w-[70ch] text-[14.5px] leading-[1.65] text-body sm:col-span-1 sm:mt-0">
                  {r.what}
                </dd>
              </div>
            ))}
          </dl>

          <p
            data-reveal
            className="reveal mt-6 border-t border-rule pt-5 text-[14.5px] leading-[1.65] text-body"
          >
            {dict.quality.note}
          </p>
        </div>
      </section>

      {/* Cerraba en «volver al inicio» o en GitHub: justo donde el lector está
          más convencido. La banda es la misma de /historia. */}
      <ContactBand dict={dict} lang={lang} wrap={wrap} />
    </main>
  );
}
