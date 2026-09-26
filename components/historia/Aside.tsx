// ============================================================
// La columna derecha de /historia (auditoría HI-01/02/08/11). La página era
// 6.000 px de texto con el 45 % derecho en blanco, y cada sección afirmaba algo
// que en otra página del sitio ya tiene su gráfico. Aquí va ese gráfico —el
// mismo componente de las tarjetas de la portada— o la cifra, más la prueba.
// Componente de servidor: SVG ya pintado, sin JavaScript propio.
// ============================================================
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import Preview from "@/components/showcase/Previews";
import { CR, num } from "@/lib/data/credit-risk";

type Section = Dictionary["historia"]["sections"][number];

function Proof({ s, lang }: { s: Section; lang: string }) {
  if (!("proofHref" in s) || !s.proofHref) return null;
  const cls = "lift mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-cold hover:underline";
  return s.proofHref.startsWith("http") ? (
    <a href={s.proofHref} target="_blank" rel="noopener noreferrer" className={cls}>{s.proofLabel} ↗</a>
  ) : (
    <Link href={`/${lang}${s.proofHref}`} className={cls}>{s.proofLabel} →</Link>
  );
}

const panel = "rounded-[14px] border border-rule bg-coldsoft p-5";

/* §05: la escalera del AUC. La fuga tachada, la ablación y el modelo. */
function AucLadder({ a, lang }: { a: Dictionary["historia"]["aside"]["cifra"]; lang: string }) {
  const lgbm = CR.modelos.modelos.find((m) => m.modelo === CR.modelos.produccion)!;
  const f = (v: number) => (lang === "es" ? v.toFixed(4).replace(".", ",") : v.toFixed(4));
  // 0,9461 y 0,6621 vienen del ADR 0002 del repositorio; el 0,7005, del bundle.
  const rows = [
    { v: 0.9461, t: a.leak, cls: "text-muted line-through decoration-neg decoration-2" },
    { v: 0.6621, t: a.ablation, cls: "text-body" },
    { v: lgbm.auc_test, t: a.model, cls: "text-cold" },
  ];
  return (
    <div className={panel}>
      <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{a.title}</p>
      <ol className="mt-3 space-y-3">
        {rows.map((r) => (
          <li key={r.t} className="flex items-baseline justify-between gap-4 border-t border-coldline pt-3">
            <span className={`font-figure text-[30px] leading-none ${r.cls}`}>{f(r.v)}</span>
            <span className="text-right text-[14px] text-body">{r.t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* §06: el gate de equidad, en miniatura. */
function Gate({ a, lang }: { a: Dictionary["historia"]["aside"]["hilo"]; lang: string }) {
  const ratio = CR.equidad.disparate_impact_ratio;
  const thr = 0.8;
  const x = (v: number) => 12 + ((v - 0.6) / 0.4) * 256;
  return (
    <div className={panel}>
      <p className="text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{a.title}</p>
      <svg viewBox="0 0 280 92" className="mt-3 block h-auto w-full" aria-hidden="true">
        <rect x={x(0.6)} y="40" width={x(thr) - x(0.6)} height="14" className="fill-neg/20" />
        <rect x={x(thr)} y="40" width={x(1) - x(thr)} height="14" className="fill-pos/20" />
        <line x1={x(thr)} x2={x(thr)} y1="28" y2="62" className="stroke-ink" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx={x(ratio)} cy="47" r="7" className="fill-neg" />
        <text x={x(ratio) - 4} y="22" textAnchor="end" className="fill-neg text-[13px] font-semibold">{a.observed} {num(ratio, lang)}</text>
        <text x={x(thr) + 5} y="22" className="fill-ink text-[13px] font-semibold">{a.threshold} {lang === "es" ? "0,80" : "0.80"}</text>
        {[0.6, 0.8, 1].map((t) => (
          <text key={t} x={x(t)} y="80" textAnchor="middle" className="fill-muted text-[12px]">{lang === "es" ? t.toFixed(2).replace(".", ",") : t.toFixed(2)}</text>
        ))}
      </svg>
    </div>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className={panel}>
      <p className="font-figure text-[clamp(40px,4.4vw,54px)] leading-none text-cold">{value}</p>
      <p className="mt-2 text-[14.5px] leading-[1.45] font-medium text-ink">{label}</p>
    </div>
  );
}

export default function HistoriaAside({ s, dict, lang }: { s: Section; dict: Dictionary; lang: string }) {
  const a = dict.historia.aside;
  const card = (href: string) => dict.work.cards.find((c) => c.href === href)!;
  const chart = (href: string) => {
    const c = card(href);
    return (
      <figure className={`${panel} m-0`}>
        <div className="is-in"><Preview card={c} lang={lang} /></div>
        <figcaption className="mt-3 text-[14px] leading-[1.5] text-muted">{c.caption}</figcaption>
      </figure>
    );
  };

  let body: React.ReactNode = null;
  switch (s.id) {
    case "origen": body = <Figure {...a.origen} />; break;
    case "patron": body = <Figure {...a.patron} />; break;
    case "nombre": body = chart("/research/fintech-inclusion"); break;
    case "plataforma":
      body = (
        <>
          {chart("/projects/trading-sim")}
          <p className="mt-5 text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">{a.more}</p>
          <ul className="mt-2 space-y-1.5">
            {[card("/labs/macro-forecast"), card("/projects/tracking")].map((c) => (
              <li key={c.href}>
                <Link href={`/${lang}${c.href}`} className="text-[14.5px] font-medium text-cold hover:underline">{c.name} →</Link>
              </li>
            ))}
          </ul>
        </>
      );
      break;
    case "cifra": body = <AucLadder a={a.cifra} lang={lang} />; break;
    case "hilo": body = <Gate a={a.hilo} lang={lang} />; break;
    case "donde":
      // HI-08: quien llega al final necesita nivel, inicio y vía. Ámbar: es
      // contenido humano (contratación), no una cifra.
      body = (
        <div className="rounded-[14px] border-t-2 border-warm bg-warmsoft p-5">
          <p className="text-[12.5px] font-semibold tracking-[0.09em] text-warm uppercase">{a.donde.title}</p>
          <dl className="mt-3 space-y-2.5 text-[14.5px]">
            {dict.sheet.hire.map((h) => (
              <div key={h.term}>
                <dt className="text-[12.5px] font-semibold tracking-[0.08em] text-warm uppercase">{h.term}</dt>
                <dd className="mt-0.5 leading-[1.5] text-ink">{h.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
      break;
  }

  return (
    <div className="lg:sticky lg:top-[132px]">
      {body}
      <Proof s={s} lang={lang} />
    </div>
  );
}
