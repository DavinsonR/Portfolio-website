import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getDictionary, type CvProject } from "@/lib/dictionaries";
import StatusPill from "@/components/StatusPill";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import BackLink from "@/components/BackLink";
import CopyEmail from "@/components/CopyEmail";
import { mailtoHref } from "@/lib/config/contact";
import { alternates, social } from "@/lib/config/alternates";
import { pageGraph } from "@/lib/config/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  // `title` ya lleva el nombre, y la plantilla del layout (`%s — nombre`) lo
  // volvía a añadir: «Davirson Novoa Ramírez — Finance Data Analyst — Davirson
  // Novoa Ramírez», en producción y en los dos idiomas (FALLO-37). `absolute`
  // se salta la plantilla solo aquí; la tarjeta social recibe el mismo texto.
  const title = `${dict.cv.title} — ${dict.cv.targets[0]}`;
  // Antes era `profileText.slice(0, 155)` y el corte caía a mitad de palabra
  // («…waiting for someone t»). Una descripción es una frase, no un recorte.
  const description = dict.cv.metaDesc;
  return {
    title: { absolute: title },
    description,
    alternates: alternates(lang, "/cv"),
    ...social(lang, "/cv", { title, description, siteName: dict.profile.name }),
  };
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* One project block, used by "Production projects" and "Research" alike:
   a head rule, the name and period, the role, the proof link, bullets, stack. */
function ProjectArticle({ pr, i, chip }: { pr: CvProject; i: number; chip: string }) {
  return (
    <article data-reveal className="reveal relative mt-6 pt-6" style={d(i * 80)}>
      <span aria-hidden="true" className="rule-in absolute inset-x-0 top-0 h-[2px] bg-ink" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-[19px] font-bold tracking-[-0.015em] text-ink">{pr.name}</h3>
        <span className="text-[14px] text-muted">{pr.period}</span>
      </div>
      <p className="mt-1 text-[15px] text-body">{pr.role}</p>
      <a
        href={pr.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-[14px] font-medium text-cold hover:underline"
      >
        {pr.hrefLabel}
      </a>

      <ul className="mt-4 flex flex-col gap-1.5">
        {pr.bullets.map((b, bi) => (
          <li
            key={bi}
            className="relative pl-4 text-[14.5px] leading-[1.7] before:absolute before:left-0 before:text-muted before:content-['—']"
          >
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {pr.stack.map((t, ti) => (
          <span key={t} data-reveal className={`reveal ${chip}`} style={d(ti * 40)}>
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

export default async function CvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const cv = dict.cv;
  const wrap = "mx-auto max-w-[980px] px-6";
  const label = "text-[12.5px] font-semibold tracking-[0.09em] uppercase text-muted";
  /* Las seis secciones de este CV llevaban el mismo paso de 12,5px en versalitas
     apagadas que un rótulo de campo, mientras sus propias filas iban a 17-19px en
     negrita: el título de sección era más pequeño y con menos contraste que su
     contenido. Por eso 6.000px de página se leen como una sola hoja gris sin nada
     por donde navegar — que es lo que decía la reseña "el CV es muy largo". No se
     apila una versalita encima: la regla del sistema dice que un rótulo etiqueta
     un campo, no que decore un titular. */
  const heading =
    "font-display text-[clamp(21px,2.6vw,27px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink";
  const chip = "rounded-[3px] border border-rule bg-band px-2.5 py-1 text-[14px] text-body";
  const mailHref = mailtoHref(dict);

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph(dict, lang, "/cv", { title: `${cv.title} — ${cv.targets[0]}`, description: cv.metaDesc })) }}
      />
      <link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      {/* ===== HEADER — the title mapping is the headline, not a subtitle ===== */}
      <header className="border-b border-rule">
        <div className={wrap}>
          <div className="settle flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rulesoft py-3 text-[12.5px] tracking-[0.08em] text-muted uppercase">
            <span className="font-semibold text-cold">{cv.targetsLabel}</span>
            <span>{dict.sheet.asOf}</span>
          </div>
          <div className="pt-4">
            <BackLink href={`/${lang}`} label={dict.nav.backHome} />
          </div>

          <div className="pt-10 pb-11">
            <h1 className="settle font-display text-[clamp(27px,3.6vw,38px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
              {cv.title}
            </h1>

            {/* the three names a posting gives the same role, set as the verdict */}
            <p
              className="settle mt-3 font-figure text-[clamp(22px,3.1vw,32px)] leading-[1.15] text-cold"
              style={d(60)}
            >
              {cv.targets.map((t, i) => (
                <span key={t}>
                  {i > 0 && <span className="text-muted"> · </span>}
                  {t}
                </span>
              ))}
            </p>

            <p
              className="settle mt-4 max-w-[62ch] text-[15.5px] leading-[1.7] text-ink"
              style={d(120)}
            >
              {cv.subtitle}
            </p>
            <p className="settle mt-2 text-[14px] text-muted" style={d(160)}>
              {cv.metaLine}
            </p>

            <div className="settle mt-8 flex flex-wrap items-center gap-3" style={d(220)}>
              <a
                href={cv.downloadHref}
                download
                className="lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {cv.download}
              </a>
              <a
                href={cv.downloadShortHref}
                download
                title={cv.downloadShortNote}
                className="lift inline-flex items-center rounded-[3px] border border-control px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold"
              >
                {cv.downloadShort}
              </a>
              <a
                href={cv.latexHref}
                download
                title={cv.latexNote}
                className="lift inline-flex items-center rounded-[3px] border border-control px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold"
              >
                {cv.latex}
              </a>
              <a
                href={mailHref}
                className="px-1 py-3 text-[14.5px] font-medium text-cold hover:underline"
              >
                {cv.contactBtn}
              </a>
            </div>
            <p className="settle mt-2.5 text-[14px] text-muted" style={d(260)}>
              {cv.latexNote}
            </p>
          </div>
        </div>

        {/* figures band — the same instrument as the front page */}
        <div className="border-t-2 border-cold bg-coldsoft">
          <div className={wrap}>
            {/* Lista simple, no `<dl>`: el ancla envolvía `<dt>` y `<dd>` y no es
                padre válido de ninguno, así que el par término/definición no se
                exponía. Misma banda, mismo objetivo de clic, marcado válido. */}
            <ul className="grid grid-cols-2 py-6 lg:grid-cols-4">
              {cv.facts.map((f, i) => (
                <li
                  key={f.label}
                  data-reveal
                  className="reveal border-coldline py-2 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
                  style={d(i * 70)}
                >
                  <span className="block font-figure text-[clamp(28px,3.8vw,40px)] leading-none text-ink">
                    <CountUp value={f.value} lang={lang} />
                  </span>
                  <span className="block mt-2 max-w-[26ch] text-[14px] leading-[1.4] font-medium text-ink">
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ===== PROFILE ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <h2 data-reveal className={`reveal ${heading}`}>
            {cv.profileLabel}
          </h2>
          <p
            data-reveal
            className="reveal mt-5 max-w-[74ch] text-[16px] leading-[1.8] text-body"
            style={d(70)}
          >
            {/* El texto largo sigue en el PDF de tres páginas. En la web, la queja
                real de cuatro revisores fue «demasiado largo, deja el PDF». */}
            {cv.profileShortText}
          </p>
        </div>
      </section>

      {/* ===== THE CROSSOVER — amber, because this is the human argument ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <div data-reveal className="reveal relative bg-warmsoft px-6 py-7">
            <span aria-hidden="true" className="rule-in absolute inset-x-0 top-0 h-[2px] bg-warm" />
            <h2 className={`${label} text-warm`}>{cv.pivot.label}</h2>
            <p className="mt-4 max-w-[76ch] text-[15.5px] leading-[1.85] text-ink">
              {cv.pivot.shortBody}
            </p>
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experiencia" className="scroll-mt-[72px] border-b border-rule py-14">
        <div className={wrap}>
          <h2 data-reveal className={`reveal ${heading}`}>
            {cv.expLabel}
          </h2>
          <div className="mt-6">
            {cv.experience.map((company, ci) => (
              <div
                key={company.company}
                data-reveal
                className="reveal border-t border-rule py-6 first:border-t-2 first:border-ink"
                style={d(ci * 80)}
              >
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-[18px] font-semibold text-ink">
                    {company.company}
                  </h3>
                  {/* "Remote · remote" is noise: when the seat already is the
                      mode, it is stated once. */}
                  <span className="text-[14px] text-muted">
                    {company.location.toLowerCase() !==
                      (company.mode === "remote" ? cv.remoteTag : cv.hybridTag).toLowerCase() && (
                      <>{company.location} · </>
                    )}
                    <span className={company.mode === "remote" ? "text-live" : "text-building"}>
                      {company.mode === "remote" ? cv.remoteTag : cv.hybridTag}
                    </span>
                  </span>
                </div>
                {"note" in company && company.note ? (
                  <p className="mb-4 text-[14px] text-cold">{company.note}</p>
                ) : (
                  <div className="mb-3" />
                )}
                <div className="flex flex-col gap-5">
                  {company.roles.map((role) => (
                    <div key={role.title} className="border-l border-rule pl-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h4 className="text-[15.5px] font-semibold text-ink">{role.title}</h4>
                        <span className="text-[14px] text-muted">{role.period}</span>
                      </div>
                      <ul className="mt-2.5 flex flex-col gap-1.5">
                        {role.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="relative pl-4 text-[14.5px] leading-[1.7] before:absolute before:left-0 before:text-muted before:content-['—']"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTION PROJECTS — the platforms, stated as work ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 data-reveal className={`reveal ${heading}`}>
              {cv.projectsLabel}
            </h2>
            <p data-reveal className="reveal text-[14px] text-muted" style={d(60)}>
              {cv.projectsNote}
            </p>
          </div>
          {cv.projects.map((pr, pi) => (
            <ProjectArticle key={pr.name} pr={pr} i={pi} chip={chip} />
          ))}
        </div>
      </section>

      {/* ===== RESEARCH — the thesis, stated the same way ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 data-reveal className={`reveal ${heading}`}>
              {cv.researchLabel}
            </h2>
            <p data-reveal className="reveal text-[14px] text-muted" style={d(60)}>
              {cv.researchNote}
            </p>
          </div>
          {cv.research.map((pr, pi) => (
            <ProjectArticle key={pr.name} pr={pr} i={pi} chip={chip} />
          ))}
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <h2 data-reveal className={`reveal ${heading}`}>
            {cv.skillsLabel}
          </h2>

          <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            <div data-reveal className="reveal">
              <div className="border-t border-rule pt-5">
                <h3 className="font-display text-[17px] font-semibold text-ink">
                  {cv.skillsFinTitle}
                </h3>
                <p className="mt-1 mb-4 text-[14px] text-body">{cv.skillsFinDesc}</p>
                <div className="flex flex-wrap gap-2">
                  {cv.skillsFin.map((s, i) => (
                    <span key={s} className={chip} style={d(i * 30)}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-rule pt-5">
                <h3 className="font-display text-[17px] font-semibold text-ink">
                  {cv.skillsDataTitle}
                </h3>
                <p className="mt-1 mb-4 text-[14px] text-body">{cv.skillsDataDesc}</p>
                <div className="flex flex-wrap gap-2">
                  {cv.skillsData.map((s, i) => (
                    <span
                      key={s}
                      className="rounded-[3px] border border-coldline bg-coldsoft px-2.5 py-1 text-[14px] text-cold"
                      style={d(i * 30)}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* declared level — one scale, the same one the front page shows */}
            <div>
              <div className="border-t border-rule pt-5">
                <h3 className="font-display text-[17px] font-semibold text-ink">
                  {cv.skillsTechTitle}
                </h3>
                <p className="mt-1 mb-5 max-w-[46ch] text-[14px] text-body">
                  {cv.skillsTechDesc}
                </p>
              </div>
              <dl>
                {cv.skillsTech.map((s, ri) => (
                  <div
                    key={s.name}
                    data-reveal
                    className="reveal border-t border-rulesoft py-3"
                    style={d(ri * 60)}
                  >
                    <dt className="text-[14.5px] font-semibold text-ink">{s.name}</dt>
                    <dd className="mt-1 text-[14px] leading-[1.55] text-body">
                      {s.href ? (
                        <Link
                          href={s.href.startsWith("http") ? s.href : `/${lang}${s.href}`}
                          {...(s.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
                        >
                          {s.proof}
                        </Link>
                      ) : (
                        s.proof
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDUCATION · CERTIFICATIONS · RECOGNITION — one compact band ===== */}
      <section className="border-b border-rule py-14">
        <div className={wrap}>
          <h2 data-reveal className={`reveal ${heading}`}>
            {cv.eduLabel}
          </h2>
          <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            <div>
              {cv.education.map((e, i) => (
                <div
                  key={e.title}
                  data-reveal
                  className="reveal border-t border-rule py-4"
                  style={d(i * 70)}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="font-display text-[15.5px] font-semibold text-ink">{e.title}</h3>
                    <StatusPill status={e.status} text={e.statusText} />
                  </div>
                  <p className="text-[14px] text-body">{e.inst}</p>
                  <p className="mt-0.5 text-[14px] text-muted">{e.period}</p>
                  {e.note && <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.6] text-body">{e.note}</p>}
                  {e.href && (
                    <Link
                      href={e.href.startsWith("http") ? e.href : `/${lang}${e.href}`}
                      className="mt-1.5 inline-block text-[14px] font-medium text-cold hover:underline"
                    >
                      {e.hrefLabel} →
                    </Link>
                  )}
                </div>
              ))}
              <div data-reveal className="reveal mt-8" style={d(60)}>
                <h3 className={label}>{cv.awardsLabel}</h3>
                {cv.awards.map((a) => (
                  <div key={a.title} className="mt-4 border-t border-rulesoft pt-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="text-[14.5px] font-semibold text-ink">{a.title}</h4>
                      <span className="text-[14px] text-muted">{a.year}</span>
                    </div>
                    <p className="mt-1 text-[14px] leading-[1.6] text-body">{a.desc}</p>
                    {a.image && (
                      <figure className="mt-3">
                        <img
                          src={a.image.src}
                          width={a.image.width}
                          height={a.image.height}
                          alt={a.imageAlt ?? ""}
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full border border-rulesoft"
                        />
                      </figure>
                    )}
                    {a.href && (
                      <a
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-[14px] font-medium text-cold hover:underline"
                      >
                        {a.hrefLabel} ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              {cv.certs.map((c, i) => (
                <div
                  key={c.title}
                  data-reveal
                  className="reveal border-t border-rule py-4"
                  style={d(i * 70)}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[14.5px] font-semibold text-ink">{c.title}</p>
                    <span className="text-[14px] text-muted">{c.year}</span>
                  </div>
                  <p className="mt-0.5 text-[14px] text-body">{c.inst}</p>
                </div>
              ))}

              <div data-reveal className="reveal mt-8" style={d(60)}>
                <h3 className={label}>{cv.remote.label}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  {cv.remote.points.map((p, i) => (
                    <p
                      key={i}
                      className="relative pl-5 text-[14.5px] leading-[1.65] before:absolute before:top-[7px] before:left-0 before:text-[9px] before:text-live before:content-['●']"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSE ===== */}
      {/* Una regla ámbar de 2px declara "aquí habla la voz humana" y abría una
          región de 160px que solo contenía tres botones, con la mitad derecha
          vacía. Ahora dice algo, y la dirección queda a la vista: el `mailto:`
          no abre nada en un portátil corporativo con webmail. */}
      <section className="border-t-2 border-warm py-14">
        <div className={wrap}>
          <p className="mb-6 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink">
            {dict.contact.body}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={mailHref}
              className="lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {cv.contactBtn}
            </a>
            <a
              href={cv.downloadHref}
              download
              className="lift inline-flex items-center rounded-[3px] border border-control px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold"
            >
              {cv.download}
            </a>
            <a
              href={cv.latexHref}
              download
              className="px-1 py-3 text-[14.5px] font-medium text-cold hover:underline"
            >
              {cv.latex}
            </a>
            <CopyEmail
              email={dict.profile.email}
              labels={{
                copy: dict.contact.copy,
                copied: dict.contact.copied,
                fail: dict.contact.copyFail,
              }}
              className="px-4 py-3 text-[14.5px]"
            />
          </div>
          <p className="mt-3 text-[14px] break-all text-body">
            <a href={mailHref} className="text-ink underline decoration-cold decoration-[1.5px] underline-offset-4">
              {dict.profile.email}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
