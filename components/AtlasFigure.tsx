import Link from "next/link";
import { ATLAS_FIGURE } from "@/lib/generated/atlas-figure";
import type { Dictionary } from "@/lib/dictionaries";

/** La figura del atlas en la portada.
 *
 *  Es un componente de servidor y no trae ni un byte de JavaScript: el SVG se
 *  generó en `npm run atlas` desde `public/atlas/` y viaja ya pintado. El atlas
 *  interactivo, en cambio, cuesta 257 KB de JSON más d3 y topojson, y los pide
 *  al hidratar aunque el lector no baje nunca hasta él.
 *
 *  Los rellenos son `var(--atlas-*)`, los mismos tokens del atlas interactivo:
 *  el mapa es estático pero sigue el tema, y las dos superficies no pueden
 *  desincronizarse porque leen la misma rampa. Y como es SVG con tokens, el
 *  bloque de impresión que fuerza los fondos exactos también lo alcanza — cosa
 *  que un `<img>` no permitiría.
 *
 *  La región se abre con una regla de 2px fría, que es como este pliego declara
 *  una voz técnica, pero se queda sobre papel: la banda de cifras que va justo
 *  encima ya es `coldsoft`, y dos tintes iguales seguidos se leen como una sola
 *  mancha azul de 500px. Sobre el tinte frío, además, el paso neutro de la rampa
 *  (#edf0f3) se diferencia del fondo (#e6eef7) en 1,05:1 y el panel de 2018
 *  —que es casi todo neutro— desaparecía. Esquinas rectas: no es una tarjeta. */
export default function AtlasFigure({
  copy,
  lang,
}: {
  copy: Dictionary["sheet"]["atlasFigure"];
  lang: string;
}) {
  // El `<title>` del SVG es su nombre accesible y el SVG es el mismo en los dos
  // idiomas, así que se inyecta aquí y no en el fichero generado.
  const svg = ATLAS_FIGURE.svg.replace("TITLE_SLOT", escapeXml(copy.alt));

  const atlasHref = `/${lang}/research/fintech-inclusion#atlas`;

  return (
    <section aria-labelledby="atlas-figure" className="border-t-2 border-cold py-14">
      <div className="mx-auto max-w-[1080px] px-6">
        <p className="text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">
          {copy.label}
        </p>

        <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <figure className="m-0">
            {/* El mapa lleva al mapa. Quien ve la figura y quiere el atlas hace
                clic en lo que está mirando, no busca el botón; el botón se queda
                porque en el teléfono no hay cursor que delate que esto se pulsa.
                El nombre accesible del enlace es la misma frase del botón: sin
                `aria-label` el lector de pantalla leería como nombre del enlace
                el `<title>` del SVG, que es una descripción de tres líneas.
                La leyenda queda fuera del enlace: describe la figura, no lleva
                a ningún sitio. */}
            <Link
              href={atlasHref}
              aria-label={copy.cta}
              className="lift block cursor-pointer"
            >
              <div
                data-reveal
                className="reveal"
                // Contenido propio, generado en build desde los JSON del repo.
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </Link>
            <figcaption className="mt-4 border-t border-coldline pt-3 text-[14px] leading-[1.6] text-body">
              <Legend copy={copy} />
            </figcaption>
          </figure>

          <div className="lg:pt-1">
            <h2
              id="atlas-figure"
              data-reveal
              className="reveal max-w-[26ch] text-balance font-display text-[clamp(20px,2.4vw,26px)] leading-[1.2] font-bold tracking-[-0.02em] text-ink"
            >
              {copy.title}
            </h2>
            <p className="mt-3.5 max-w-[46ch] text-[15px] leading-[1.7]">{copy.body}</p>

            <Link
              href={atlasHref}
              className="lift mt-6 inline-flex items-center rounded-[3px] bg-cold px-5 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {copy.cta} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Siete pasos discretos, los mismos del mapa. Continua mentiría: el mapa está
 *  cortado en cubetas, no interpolado. */
function Legend({ copy }: { copy: Dictionary["sheet"]["atlasFigure"] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span aria-hidden="true" className="flex">
        {ATLAS_FIGURE.ramp.map((token) => (
          <span
            key={token}
            className="h-3 w-6 border-y border-l border-coldline last:border-r"
            style={{ background: `var(${token})` }}
          />
        ))}
      </span>
      <span className="text-[14px] text-muted">
        {copy.legendLow} · {copy.legendMid} · {copy.legendHigh}
      </span>
    </div>
  );
}

function escapeXml(s: string) {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
}
