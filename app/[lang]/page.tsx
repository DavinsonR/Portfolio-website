import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import PipelineStamp from "@/components/PipelineStamp";
import CountUp from "@/components/CountUp";
import StatusPill from "@/components/StatusPill";
import CopyEmail from "@/components/CopyEmail";
import AtlasFigure from "@/components/AtlasFigure";
import { mailtoHref } from "@/lib/config/contact";
import { personGraph } from "@/lib/config/structured-data";
import type { Locale } from "@/lib/dictionaries";

const WRAP = "mx-auto max-w-[1080px] px-6";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const { sheet, work, track, toolkit, disclosures, contact } = dict;
  const cvHref = lang === "es" ? "/Davirson_Novoa_CV_ES.pdf" : "/Davirson_Novoa_Resume_EN.pdf";
  const mailHref = mailtoHref(dict);

  /* El texto del enlace se saca de la propia URL, y por eso no se pudre.
     Estuvo escrito a mano: decía "davirson-novoa" mientras el perfil vivía en
     "davirson-novoa-ramirez-2721641b5", y anunciaba un perfil que no existía.
     Se derivó de la URL, y la broma llegó sola — el 16 sep 2026 el perfil pasó
     a ser exactamente "davirson-novoa" y la etiqueta se actualizó sin que nadie
     tocara nada. Es el argumento de la decisión, ya cobrado. */
  const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;
  const linkedinHandle = handle(dict.profile.linkedin);
  const githubHandle = handle(dict.profile.github);

  return (
    <main id="main" tabIndex={-1}>
      {/* Quien recibe el enlace en una aplicación teclea el nombre en Google
          antes de abrirlo. Sin esto el buscador ve un documento; con esto ve a
          una persona, sus dos grafías y sus perfiles reales. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personGraph(dict, lang as Locale)) }}
      />
      {/* ===================== DOCUMENT HEADER ===================== */}
      <header className="border-b border-rule">
        <div className={WRAP}>
          {/* classification line — the masthead of a research sheet */}
          <div className="settle flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rulesoft py-3 text-[12.5px] tracking-[0.08em] text-muted uppercase">
            <span className="font-semibold text-cold">{sheet.classification}</span>
            <span>{sheet.asOf}</span>
          </div>

          <div className="grid gap-x-12 gap-y-8 pt-10 pb-11 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <h1
                className="settle font-display text-[clamp(30px,4.4vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink"
                style={{ animationDelay: "60ms" }}
              >
                {sheet.name}
              </h1>

              {/* The verdict: what this asset is, stated once, large. It is declared
                  the most important line in the build and it was carrying 29% of
                  the name's ink mass — a 400-weight serif never outranks an
                  800-weight grotesque at a comparable size. Source Serif 4 600 is
                  already requested in the layout and was going unused. */}
              <p
                className="settle mt-3 font-figure text-[clamp(27px,3.8vw,38px)] leading-[1.1] font-semibold text-cold"
                style={{ animationDelay: "120ms" }}
              >
                {sheet.verdict}
              </p>

              {/* The same crossover role, under the two other names a posting gives
                  it. A screener keyword-matches against a req headline; two of the
                  three matches lived only on the CV, a page most never open. */}
              <p
                className="settle mt-2 text-[14px] leading-[1.5] text-muted"
                style={{ animationDelay: "150ms" }}
              >
                {dict.cv.targetsLabel}: {dict.cv.targets.slice(1).join(" · ")}
              </p>

              <p
                className="settle mt-6 max-w-[40ch] text-balance font-display text-[clamp(19px,2.2vw,23px)] leading-[1.35] font-semibold tracking-[-0.015em] text-ink"
                style={{ animationDelay: "180ms" }}
              >
                {sheet.thesis}
              </p>

              <p
                className="settle mt-5 max-w-[68ch] text-[15.5px] leading-[1.7]"
                style={{ animationDelay: "240ms" }}
              >
                {sheet.sub}
              </p>

              <div className="settle mt-8 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
                <a
                  href={cvHref}
                  download
                  className="lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
                >
                  {sheet.ctaPrimary}
                </a>
                <a
                  href="#work"
                  className="lift inline-flex items-center rounded-[3px] border border-rule px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold"
                >
                  {sheet.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Availability and hiring: the facts a recruiter checks before anything
                else, and the only block on the sheet allowed to wear amber
                besides the closing band. It used to end 156px above the header
                rule, leaving the top-right quarter of the first screen empty
                while the three questions that decide a forward — level, start,
                arrangement — were answered nowhere on the site. */}
            <aside
              className="settle self-start border-t-2 border-warm bg-warmsoft px-5 py-5"
              style={{ animationDelay: "260ms" }}
            >
              <p className="text-[14px] leading-[1.65] text-ink">{sheet.availability}</p>

              <dl className="mt-4 space-y-2.5 border-t border-warm pt-4 text-[14px]">
                {sheet.hire.map((h) => (
                  <div key={h.term}>
                    <dt className="text-[12.5px] font-semibold tracking-[0.08em] text-warm uppercase">
                      {h.term}
                    </dt>
                    <dd className="mt-0.5 leading-[1.5] text-ink">{h.detail}</dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-4 space-y-2 border-t border-warm pt-4 text-[14px]">
                <div>
                  <dt className="text-warm">Email</dt>
                  <dd className="mt-0.5 break-all">
                    <a href={mailHref} className="text-ink underline decoration-warm underline-offset-2">
                      {dict.profile.email}
                    </a>
                  </dd>
                </div>
                {/* Etiqueta arriba y valor debajo, igual que el correo: el slug real
                    de LinkedIn tiene 32 caracteres y en una fila `justify-between`
                    de 260px se partía a la derecha en dos trozos. */}
                <div>
                  <dt className="text-warm">LinkedIn</dt>
                  <dd className="mt-0.5 break-all">
                    <a
                      href={dict.profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink underline decoration-warm underline-offset-2">
                      {linkedinHandle}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-warm">GitHub</dt>
                  <dd>
                    <a
                      href={dict.profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink underline decoration-warm underline-offset-2">
                      {githubHandle}
                    </a>
                  </dd>
                </div>
              </dl>

              <CopyEmail
                email={dict.profile.email}
                labels={{ copy: contact.copy, copied: contact.copied, fail: contact.copyFail }}
                className="mt-4 bg-paper"
              />
            </aside>
          </div>
        </div>

        {/* figures band — tabular, ruled, footnoted: a data row, not a card set */}
        <div className="border-t-2 border-cold bg-coldsoft">
          <div className={WRAP}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-4">
              <p className="text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">
                {sheet.metricsLabel}
              </p>
              <PipelineStamp
                label={sheet.pipelineLive}
                stalledLabel={sheet.pipelineStalled}
                fallback={sheet.pipelineLiveFallback}
                lang={lang}
              />
            </div>
            <p className="mt-1 text-[14px] text-body">{sheet.metricsNote}</p>
            {/* Era un `<dl>` con el `<a>` envolviendo `<dt>` y `<dd>`, con el `<dd>`
                antes que su `<dt>` y un `<p>` suelto dentro del envoltorio: un
                ancla no es padre válido de ninguno de los dos, así que el
                navegador no exponía el par término/definición y la lista de
                definiciones no definía nada. Una lista simple dice lo mismo, es
                válida, y deja que el ancla siga envolviendo cifra y etiqueta —
                que es lo que hace de cada cifra un objetivo de clic. */}
            <ul className="grid grid-cols-2 pt-3 pb-6 lg:grid-cols-4">
              {sheet.metrics.map((m, i) => {
                // Each figure lands where its evidence actually is. The first reviewer to
                // click one found the CV's masthead and no sign of what he had clicked.
                // The target travels with the figure (dictionary), not with its position.
                const proof = m.href.startsWith("http") ? m.href : `/${lang}${m.href}`;
                const external = proof.startsWith("http");
                return (
                  <li
                    key={m.label}
                    className="settle border-coldline py-2 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
                    style={{ animationDelay: `${340 + i * 70}ms` }}
                  >
                    <a
                      href={proof}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="lift group block"
                    >
                      <span className="block font-figure text-[clamp(34px,4.4vw,46px)] leading-none text-ink group-hover:text-cold">
                        <CountUp value={m.value} lang={lang} />
                      </span>
                      <span className="mt-2 block text-[14px] leading-[1.35] font-medium text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 group-hover:decoration-[2.5px]">
                        {m.label}
                      </span>
                    </a>
                    <p className="mt-1 text-[14px] text-body">{m.note}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>

      {/* ===================== ATLAS FIGURE =====================
          The second figure on the sheet, and the only picture on a site that
          asserted visual work twenty times and shipped zero images. It earns the
          position because it is an argument, not a decoration: two maps on one
          scale showing every department rising off the 2018 baseline, which is
          precisely why the coefficient dies once the year is taken out. The
          interactive atlas it links to sat 2,820px into a page 7,489px long —
          4,608 of 12,349 on a phone — behind two clicks. */}
      <AtlasFigure copy={sheet.atlasFigure} lang={lang} />

      {/* ===================== WORK ===================== */}
      <section id="work" className="scroll-mt-16 border-b border-rule pt-16">
        <div className={WRAP}>
          <h2
            data-reveal
            className="reveal font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink"
          >
            {work.title}
          </h2>
          <p data-reveal className="reveal mt-2.5 max-w-[62ch] text-[15px] leading-[1.7]" style={{ "--d": "70ms" } as React.CSSProperties}>
            {work.intro}
          </p>

          <article data-reveal className="reveal relative mt-10 pt-6">
            {/* the head rule is drawn, not painted: the pen crosses the sheet */}
            <span aria-hidden="true" className="rule-in absolute inset-x-0 top-0 h-[2px] bg-ink" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-[21px] font-bold tracking-[-0.015em] text-ink">
                {work.project.name}
              </h3>
              <p className="text-[13px] tracking-[0.07em] text-muted uppercase">
                {work.project.kind}
              </p>
            </div>

            <div className="mt-7 grid gap-x-12 gap-y-7 lg:grid-cols-2">
              <div>
                <h4 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
                  {work.project.problemLabel}
                </h4>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-ink">
                  {work.project.problem}
                </p>
              </div>
              <div>
                <h4 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
                  {work.project.builtLabel}
                </h4>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7]">{work.project.built}</p>
              </div>
            </div>

            <div className="mt-7 border-y border-cold bg-coldsoft px-5 py-4">
              <h4 className="text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">
                {work.project.matterLabel}
              </h4>
              <p className="mt-1.5 max-w-[70ch] text-[15px] leading-[1.7] text-ink">
                {work.project.matter}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {work.project.stack.map((s, i) => (
                <span
                  key={s}
                  data-reveal
                  className="reveal rounded-[3px] border border-rule px-2.5 py-1 text-[14px] text-body"
                  style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* The strongest sentence on the page — a published negative result —
                used to sit *below* three links that leave the page. A scanner who
                took any of them never met it. It is a measurement, so it wears the
                cold accent; the comment that used to sit here said amber, which
                would have been a bug against the reservation rule. */}
            <div className="mt-7 border-t border-rule pt-5">
              <h4 className="text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">
                {work.project.findingLabel}
              </h4>
              <p className="mt-1.5 max-w-[70ch] text-[15px] leading-[1.7] text-ink">
                {work.project.finding}
              </p>
            </div>

            {/* Los tres botones estaban fijos aquí, y uno apuntaba a
                /projects/trading-sim: cambiar cuál es el proyecto destacado obligaba
                a editar el layout para mover contenido. Ahora salen del diccionario,
                que es donde vive el resto del texto de la sección. */}
            <div className="mt-7 flex flex-wrap gap-3">
              {work.project.links.map((l) => {
                const externo = l.href.startsWith("http");
                const clase =
                  l.tone === "solid"
                    ? "lift inline-flex items-center rounded-[3px] bg-ink px-4 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90"
                    : l.tone === "outline"
                      ? "lift inline-flex items-center rounded-[3px] border border-rule px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold"
                      : "inline-flex items-center px-1 py-2.5 text-[14px] font-semibold text-cold hover:underline";
                const texto = l.tone === "text" ? `${l.label} →` : l.label;
                return externo ? (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={clase}>
                    {texto}
                  </a>
                ) : (
                  <Link key={l.href} href={`/${lang}${l.href}`} className={clase}>
                    {texto}
                  </Link>
                );
              })}
            </div>

          </article>

        </div>

        {/* WORK ran 1,637px on desktop and 2,812px on a phone — three and a half
            screens — as one unbroken white field with a single hairline in it.
            The reader loses the thread here, which is what "you get lost" was.
            A full-bleed neutral band opened by a 2px ink rule is the sheet's own
            device for a change of region; it costs nothing and gives the scan a
            place to land. */}
        <div className="mt-14 border-t-2 border-ink bg-band py-12">
          <div className={WRAP}>
            {/* the rest of the desk: one ruled row each, a status pill, and a link only
                where there is something public to open. A private row says so. */}
            <h3 className="font-display text-[19px] font-bold tracking-[-0.015em] text-ink">
              {work.also.title}
            </h3>
            <ol className="mt-4">
              {work.also.rows.map((r, i) => (
                <li
                  key={r.name}
                  data-reveal
                  className="reveal grid gap-x-8 gap-y-2 border-t border-rule py-4 first:border-t-2 first:border-ink sm:grid-cols-[minmax(0,1fr)_auto]"
                  style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {r.href ? (
                        <Link
                          href={r.href.startsWith("http") ? r.href : `/${lang}${r.href}`}
                          className="text-[15.5px] font-semibold text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
                        >
                          {r.name}
                        </Link>
                      ) : (
                        <span className="text-[15.5px] font-semibold text-ink">{r.name}</span>
                      )}
                      <span className="text-[12.5px] tracking-[0.07em] text-muted uppercase">{r.kind}</span>
                    </div>
                    <p className="mt-1 max-w-[68ch] text-[14.5px] leading-[1.65] text-body">{r.note}</p>
                    {r.access && <p className="mt-1 text-[14px] text-muted">{r.access}</p>}
                  </div>
                  <div className="sm:pt-0.5">
                    <StatusPill status={r.status} text={r.statusText} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===================== TRACK RECORD + PROFILE ===================== */}
      <section id="track" className="scroll-mt-16 border-b border-rule py-16">
        <div className={WRAP}>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(23px,2.9vw,31px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
                {track.title}
              </h2>
              <Link
                href={`/${lang}/cv`}
                className="text-[14px] font-semibold text-cold transition-opacity hover:opacity-80"
              >
                {track.fullCv} →
              </Link>
            </div>

            <ol className="mt-7">
              {track.rows.map((r, i) => (
                <li
                  key={r.title}
                  data-reveal
                  className="reveal border-t border-rule py-5 first:border-t-2 first:border-ink"
                  style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="font-display text-[16.5px] font-semibold text-ink">{r.title}</h3>
                    <span className="text-[14px] text-muted">{r.period}</span>
                  </div>
                  <p className="mt-1.5 max-w-[68ch] text-[14.5px] leading-[1.65]">{r.desc}</p>
                  <p className="mt-2 text-[12.5px] tracking-[0.08em] text-cold uppercase">{r.tag}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Three career rows against eight tool rows sat in a 1.35 : 1 split, so
              the left column died 304px before the right one finished and the
              bottom-left quarter of the section was blank paper. A split grid is
              the wrong instrument for two lists whose lengths are unrelated: the
              toolkit runs the full measure underneath, three across, and the row
              form is unchanged. */}
          <div className="mt-14 border-t-2 border-ink pt-8">
            <h2 className="font-display text-[clamp(20px,2.4vw,25px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
              {toolkit.title}
            </h2>
            <p className="mt-2 max-w-[62ch] text-[14.5px] leading-[1.6] text-body">{toolkit.note}</p>

            <dl className="mt-6 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {toolkit.rows.map((r, ri) => (
                <div
                  key={r.name}
                  data-reveal
                  className="reveal border-t border-rule py-3"
                  style={{ "--d": `${ri * 60}ms` } as React.CSSProperties}
                >
                  <dt className="text-[14.5px] font-semibold text-ink">{r.name}</dt>
                  <dd className="mt-1 text-[14px] leading-[1.55] text-body">
                    {r.href ? (
                      <Link
                        href={r.href.startsWith("http") ? r.href : `/${lang}${r.href}`}
                        {...(r.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
                      >
                        {r.proof}
                      </Link>
                    ) : (
                      r.proof
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT ===================== */}
      {/* The right half of this band used to be empty for its whole height: a
          24ch headline wrapping to three lines in the left third and a row of
          links underneath. The CTA cluster moves beside the headline, which is
          what a band opened by a 2px rule is supposed to look like. */}
      <section id="contact" className="scroll-mt-16 border-t-2 border-warm py-16">
        <div className={`${WRAP} grid items-start gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]`}>
          <div>
            <h2
              data-reveal
              className="reveal max-w-[24ch] text-balance font-display text-[clamp(24px,3.2vw,34px)] leading-[1.15] font-bold tracking-[-0.02em] text-ink"
            >
              {contact.title}
            </h2>
            <p className="mt-3.5 max-w-[52ch] text-[15.5px] leading-[1.7]">{contact.body}</p>
          </div>

          <div className="lg:pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={mailHref}
                className="lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {contact.email}
              </a>
              <CopyEmail
                email={dict.profile.email}
                labels={{ copy: contact.copy, copied: contact.copied, fail: contact.copyFail }}
                className="px-4 py-3 text-[14.5px]"
              />
            </div>

            {/* The address in plain sight, once more at the foot: when the mail
                client never opens, this is what the reader falls back to. */}
            <p className="mt-3 text-[14px] break-all text-body">
              <a href={mailHref} className="text-ink underline decoration-cold decoration-[1.5px] underline-offset-4">
                {dict.profile.email}
              </a>
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-4">
              <a
                href={cvHref}
                download
                className="inline-flex items-center text-[14.5px] font-semibold text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
              >
                {sheet.ctaPrimary}
              </a>
              {[
                { href: dict.profile.linkedin, label: contact.linkedin },
                { href: dict.profile.github, label: contact.github },
                { href: dict.profile.kaggle, label: contact.kaggle },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14.5px] font-medium text-cold hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DISCLOSURES ===================== */}
      {/* En un pliego las divulgaciones van al pie, no entre la evidencia y la
          conversión: quien ya decidió escribir tenía 450px de salvedades por
          delante del bloque de contacto. Bajan aquí, y pasan a `band2` para que
          las dos bandas neutras del documento no se lean a la misma profundidad
          (la lista de la mesa se quedó con `band`). */}
      <section className="border-t border-rule bg-band2 py-14">
        <div className={WRAP}>
          <h2 className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
            {disclosures.title}
          </h2>
          <dl className="mt-5 grid gap-x-12 gap-y-5 sm:grid-cols-2">
            {disclosures.items.map((d, i) => (
              <div
                key={d.term}
                data-reveal
                className="reveal"
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <dt className="text-[14px] font-semibold text-ink">{d.term}</dt>
                <dd className="mt-1 max-w-[58ch] text-[14px] leading-[1.65] text-body">{d.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

    </main>
  );
}
