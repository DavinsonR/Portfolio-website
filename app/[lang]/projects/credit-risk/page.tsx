import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import StatusPill from "@/components/StatusPill";
import {
  DecisionBalance,
  EventStudy,
  FairnessGate,
  VocabularyCliff,
} from "@/components/credit-risk/Charts";
import { alternates, openGraph } from "@/lib/config/alternates";
import {
  CR,
  cliff,
  compactUSD,
  demoHref,
  eventPoints,
  gateThreshold,
  money,
  num,
  pct,
  pp,
  regimes,
  umbralPP,
} from "@/lib/data/credit-risk";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.creditRisk.metaTitle,
    description: dict.creditRisk.metaDesc,
    alternates: alternates(lang, "/projects/credit-risk"),
    openGraph: openGraph(lang, "/projects/credit-risk", {
      title: dict.creditRisk.metaTitle,
      description: dict.creditRisk.metaDesc,
      siteName: dict.profile.name,
    }),
  };
}

export default async function CreditRiskPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.creditRisk;
  const wrap = "max-w-[980px] mx-auto px-6";
  const h2 = "font-display text-[clamp(23px,2.9vw,31px)] font-bold text-ink mb-3";

  const ultima = cliff[cliff.length - 1];
  const cob = CR.vocabulario.cobertura;
  const umbralEquidad = gateThreshold("hmda:disparate_impact", 0.8);

  const regimenRows = [
    { label: t.event.regimes.pre, v: regimes.prepandemia_pp },
    { label: t.event.regimes.boom, v: regimes.auge_pp },
    { label: t.event.regimes.post, v: regimes.post_pp },
  ];

  return (
    <main id="main" tabIndex={-1}>
      {/* ================= HERO ================= */}
      <header className="pt-20 pb-12">
        <div className={wrap}>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <BackLink href={`/${lang}`} label={dict.nav.backHome} />
            <StatusPill status="live" />
          </div>
          <p className="text-[12.5px] uppercase tracking-[0.1em] text-muted mb-3">{t.kicker}</p>
          <h1 className="max-w-[820px] font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
            {t.title}
          </h1>
          <p className="mt-5 text-[15.5px] leading-[1.75] max-w-[700px]">{t.intro}</p>
          <p className="mt-3 text-[14px] text-muted max-w-[700px]">{t.pipelineLine}</p>
        </div>
      </header>

      {/* ================= DEMO ================= */}
      <section className="py-12 bg-band border-t-2 border-cold" aria-labelledby="cr-demo">
        <div className={wrap}>
          <h2 id="cr-demo" className="font-display text-[19px] font-bold text-ink mb-2">
            {t.demo.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[660px]">{t.demo.body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {/* Salida del árbol de Next a un estático de `public/`: <a>, no <Link>. */}
            <a
              href={demoHref(lang)}
              className="inline-flex items-center border border-ink bg-ink text-paper px-4 py-2 text-[14px] font-medium hover:opacity-90"
            >
              {t.demo.cta}
            </a>
            <span className="text-[14px] text-muted">{t.demo.note}</span>
          </div>
        </div>
      </section>

      {/* ================= EL ACANTILADO ================= */}
      <section className="py-14 border-t border-rulesoft" aria-labelledby="cr-cliff">
        <div className={wrap}>
          <h2 id="cr-cliff" className={h2}>
            {t.cliff.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.cliff.lede}</p>

          <VocabularyCliff
            points={cliff}
            lang={lang}
            labels={{
              y: t.cliff.y,
              caption: t.cliff.caption,
              unsupported: t.cliff.y,
            }}
          />

          <p className="text-[15px] leading-[1.75] max-w-[680px] border-l-2 border-neg pl-4">
            {t.cliff.punch}
          </p>

          <h3 className="font-display text-[19px] font-bold text-ink mt-10 mb-2">
            {t.cliff.fixTitle}
          </h3>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.cliff.fixBody}</p>

          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { k: t.cliff.fixCost, v: num(CR.vocabulario.costo_auc, lang), tone: "text-body" },
              { k: t.cliff.fixCoverage, v: pp(cob.recuperado_pp, lang, 1), tone: "text-pos" },
              { k: t.cliff.fixResidual, v: pct(cob.sin_origen, lang), tone: "text-neg" },
            ].map((s) => (
              <div key={s.k} className="border-t border-rule pt-4">
                <dt className="text-[14px] text-muted mb-1">{s.k}</dt>
                <dd className={`font-figure text-[30px] leading-none ${s.tone}`}>{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-[14px] leading-[1.7] text-muted max-w-[680px]">
            {t.cliff.fixNote}
          </p>
          <p className="mt-2 text-[14px] text-muted">
            FY{cob.fy_desde}–{cob.fy_hasta} · {pct(cob.soportado_crudo, lang)} →{" "}
            {pct(cob.soportado_armonizado, lang)} · AUC {num(CR.vocabulario.auc_crudo, lang)} →{" "}
            {num(CR.vocabulario.auc_armonizado, lang)} ·{" "}
            {lang === "es" ? "última cosecha" : "latest cohort"} FY{ultima.fy} (
            {ultima.n.toLocaleString(lang)}{" "}
            {lang === "es" ? "préstamos, año en curso" : "loans, year in progress"}):{" "}
            {pct(ultima.sinSoporte, lang)}
          </p>
        </div>
      </section>

      {/* ================= DINERO ================= */}
      <section className="py-14 border-t border-rulesoft" aria-labelledby="cr-money">
        <div className={wrap}>
          <h2 id="cr-money" className={h2}>
            {t.money.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.money.lede}</p>
          <DecisionBalance
            avoided={money.avoided}
            forgone={money.forgone}
            labels={{
              avoided: t.money.avoided,
              forgone: t.money.forgone,
              avoidedValue: compactUSD(money.avoided, lang),
              forgoneValue: compactUSD(money.forgone, lang),
              caption: t.money.caption,
            }}
          />
          <p className="text-[14px] text-muted">
            FY{money.window[0]}–{money.window[1]} · {money.loans.toLocaleString(lang)}{" "}
            {lang === "es" ? "préstamos" : "loans"} ·{" "}
            {lang === "es" ? "absorbido por la SBA" : "absorbed by the SBA"}{" "}
            {compactUSD(money.absorbedBySBA, lang)}
          </p>
        </div>
      </section>

      {/* ================= EL GATE ================= */}
      <section className="py-14 border-t border-rulesoft" aria-labelledby="cr-gate">
        <div className={wrap}>
          <h2 id="cr-gate" className={h2}>
            {t.gate.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.gate.lede}</p>
          <FairnessGate
            ratio={CR.equidad.disparate_impact_ratio}
            threshold={umbralEquidad}
            lang={lang}
            labels={{
              scale: t.gate.scale,
              threshold: t.gate.threshold,
              observed: `${t.gate.observed} ${num(CR.equidad.disparate_impact_ratio, lang)}`,
              caption: t.gate.caption,
            }}
          />
          <p className="text-[14px] text-muted">
            {lang === "es" ? "peor grupo" : "worst group"}: {CR.equidad.peor_grupo}
          </p>
        </div>
      </section>

      {/* ================= ESTUDIO DE EVENTO ================= */}
      <section className="py-14 border-t border-rulesoft" aria-labelledby="cr-event">
        <div className={wrap}>
          <h2 id="cr-event" className={h2}>
            {t.event.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.event.lede}</p>

          <dl className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {regimenRows.map((r, i) => (
              <div key={r.label} className="border-t border-rule pt-4">
                <dt className="text-[14px] text-muted mb-1 min-h-[2.4em]">{r.label}</dt>
                <dd
                  className={`font-figure text-[32px] leading-none ${
                    i === 1 ? "text-muted" : "text-ink"
                  }`}
                >
                  {num(r.v, lang, 2).replace("-", "−")}
                  <span className="text-[15px] text-muted ml-1">pp</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-[15px] leading-[1.75] max-w-[680px] border-l-2 border-cold pl-4">
            {t.event.punch}{" "}
            <span className="text-muted">
              ({pp(regimes.vs_prepandemia_pp, lang)} {lang === "es" ? "contra" : "vs"} FY2018–2019;{" "}
              {pp(regimes.vs_auge_pp, lang)} {lang === "es" ? "contra" : "vs"} 2021)
            </span>
          </p>

          <h3 className="font-display text-[19px] font-bold text-ink mt-11 mb-2">
            {t.event.chartTitle}
          </h3>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.event.chartLede}</p>

          <EventStudy
            points={eventPoints}
            threshold={umbralPP}
            lang={lang}
            labels={{
              y: t.event.y,
              band: t.event.band,
              pre: t.event.pre,
              post: t.event.post,
              caption: t.event.caption,
            }}
          />

          <h3 className="font-display text-[17px] font-bold text-ink mt-9 mb-4">
            {t.event.reasonsTitle}
          </h3>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.event.reasons.map((r, i) => (
              <li key={r.title} className="border-t border-rule pt-4">
                <p className="font-figure text-[20px] text-muted leading-none mb-2">{i + 1}</p>
                <p className="text-[14px] text-cold mb-1.5">{r.title}</p>
                <p className="text-[14px] leading-[1.7]">{r.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[14.5px] leading-[1.75] max-w-[700px]">{t.event.closing}</p>
          <p className="mt-3 text-[14px] text-muted">
            {CR.evento.n_solicitudes.toLocaleString(lang)}{" "}
            {lang === "es" ? "solicitudes" : "applications"} · FY{CR.evento.ventana[0]}–FY
            {CR.evento.ventana[CR.evento.ventana.length - 1]} ·{" "}
            {lang === "es" ? "retención diferencial" : "differential retention"}{" "}
            {num(CR.evento.retencion_diferencial_pp, lang, 1)} pp
          </p>
        </div>
      </section>

      {/* ================= CIERRE ================= */}
      <section className="py-14 border-t border-rulesoft" aria-labelledby="cr-close">
        <div className={wrap}>
          <h2 id="cr-close" className={h2}>
            {t.close.title}
          </h2>
          <p className="text-[14.5px] leading-[1.7] max-w-[680px]">{t.close.body}</p>
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
            {t.close.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[14.5px] text-cold underline underline-offset-4 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-9 text-[14px] leading-[1.65] text-muted max-w-[680px] border-t border-rulesoft pt-4">
            {t.sourceNote} <code className="text-[12.5px]">{CR.manifest.code_fingerprint}</code>
          </p>
        </div>
      </section>
    </main>
  );
}
