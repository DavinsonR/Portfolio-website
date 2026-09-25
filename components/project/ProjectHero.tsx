// ============================================================
// La cabecera común de las páginas de proyecto (auditoría de diseño del
// 25 sep 2026, DP-01/06/07). Antes cada página tenía la suya: unas con banda
// de cifras y otras sin ella, unas con botón y otras no, y ninguna enseñaba el
// trabajo en la primera pantalla. El lector venía de una tarjeta con un
// gráfico y aterrizaba en un bloque de texto.
//
// Orden fijo: volver + píldora · kicker · titular a todo el ancho · a la
// izquierda la frase y los botones, a la derecha el MISMO gráfico de la
// tarjeta de la portada (continuidad) · banda de cuatro cifras.
// ============================================================
import type { ReactNode } from "react";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import StatusPill from "@/components/StatusPill";
import type { Status } from "@/lib/dictionaries";

export type HeroFigure = { value: ReactNode; label: string; note?: ReactNode; href?: string };
export type HeroCta = { href: string; label: string; tone: "solid" | "outline" };

export const HERO_WRAP = "mx-auto max-w-[1080px] px-6";

export default function ProjectHero({
  wrap = HERO_WRAP,
  lang,
  backLabel,
  status,
  pill,
  kicker,
  title,
  lede,
  meta = [],
  ctas = [],
  ctaNote,
  visual,
  visualCaption,
  figures,
}: {
  /** El ancho de la página: la cabecera se alinea con sus secciones. */
  wrap?: string;
  lang: string;
  backLabel: string;
  status: Status;
  pill: string;
  kicker: string;
  title: ReactNode;
  lede: ReactNode;
  meta?: ReactNode[];
  ctas?: HeroCta[];
  ctaNote?: string;
  visual: ReactNode;
  visualCaption?: string;
  figures: HeroFigure[];
}) {
  return (
    <header className="border-b border-rule">
      <div className={wrap}>
        <div className="pt-16 pb-12 sm:pt-20">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <BackLink href={`/${lang}`} label={backLabel} />
            <StatusPill status={status} text={pill} />
          </div>
          <p className="text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">{kicker}</p>
          <h1 className="settle mt-3 max-w-[24ch] text-balance font-display text-[clamp(28px,4.2vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
            {title}
          </h1>

          <div className="mt-8 grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="max-w-[60ch] text-[15.5px] leading-[1.7] text-ink">{lede}</p>
              {meta.map((m, i) => (
                <p key={i} className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-muted">{m}</p>
              ))}
              {ctas.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {ctas.map((c) => {
                    const cls =
                      c.tone === "solid"
                        ? "lift inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
                        : "lift inline-flex items-center rounded-[3px] border border-control px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:border-cold hover:text-cold";
                    const external = c.href.startsWith("http");
                    return external ? (
                      <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {c.label}
                      </a>
                    ) : c.href.startsWith("#") ? (
                      <a key={c.href} href={c.href} className={cls}>{c.label}</a>
                    ) : (
                      <Link key={c.href} href={`/${lang}${c.href}`} className={cls}>{c.label}</Link>
                    );
                  })}
                  {ctaNote && <span className="text-[14px] text-muted">{ctaNote}</span>}
                </div>
              )}
            </div>

            <figure className="settle m-0 overflow-hidden rounded-[14px] border border-rule bg-coldsoft p-4 sm:p-6" style={{ animationDelay: "120ms" }}>
              <div className="is-in">{visual}</div>
              {visualCaption && (
                <figcaption className="mt-3 text-[14px] leading-[1.55] text-muted">{visualCaption}</figcaption>
              )}
            </figure>
          </div>
        </div>
      </div>

      {/* La banda de cifras: el mismo instrumento en las seis páginas. */}
      <div className="border-t-2 border-cold bg-coldsoft">
        <div className={wrap}>
          <ul className="grid grid-cols-2 gap-y-2 py-6 lg:grid-cols-4">
            {figures.map((f, i) => {
              const body = (
                <>
                  <span className="block font-figure text-[clamp(28px,3.6vw,40px)] leading-none text-ink group-hover:text-cold">
                    {f.value}
                  </span>
                  <span className={`mt-2 block max-w-[26ch] text-[14px] leading-[1.4] font-medium text-ink ${f.href ? "underline decoration-cold decoration-[1.5px] underline-offset-4 group-hover:decoration-[2.5px]" : ""}`}>
                    {f.label}
                  </span>
                </>
              );
              return (
                <li
                  key={f.label}
                  data-reveal
                  className="reveal border-coldline py-2 pr-3 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
                  style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                >
                  {f.href ? (
                    <a
                      href={f.href}
                      {...(f.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="lift group block"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="group">{body}</div>
                  )}
                  {f.note && <p className="mt-1 text-[14px] leading-[1.45] text-body">{f.note}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
