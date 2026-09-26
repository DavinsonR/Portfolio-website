import { SITE } from "./site";
import type { Dictionary, Locale } from "../dictionaries";

/** Datos estructurados para el buscador.
 *
 *  El sitio se reparte en aplicaciones: quien lo recibe teclea el nombre en
 *  Google antes de abrir el enlace. Sin esto, el buscador ve un documento con
 *  un `<h1>` y adivina; con esto sabe que hay una persona, cómo se llama de las
 *  dos maneras, a qué rol apunta y cuáles son sus perfiles reales.
 *
 *  Todo sale del diccionario o de hechos ya publicados en la propia página.
 *  Nada se afirma aquí que no esté visible arriba: un dato estructurado que el
 *  lector no puede verificar en la página es exactamente lo que la regla de
 *  "cifras verificables" prohíbe.
 *
 *  El correo ya está en texto plano en la cabecera y en cada `mailto:`, así que
 *  repetirlo aquí no abre una superficie nueva. */
export const PERSON_ID = `${SITE}/#person`;
export const SITE_ID = `${SITE}/#website`;

export function personGraph(dict: Dictionary, lang: Locale) {
  const home = `${SITE}/${lang}`;
  const personId = PERSON_ID;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE,
        name: dict.profile.name,
        inLanguage: ["es", "en"],
        author: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: dict.profile.name,
        // Los documentos legales dicen Davirson; las cuentas en línea, Davinson.
        // Un reclutador que copia el nombre de LinkedIn escribe el segundo.
        alternateName: "Davinson Novoa Ramírez",
        jobTitle: dict.sheet.verdict,
        description: dict.meta.description,
        url: home,
        email: `mailto:${dict.profile.email}`,
        sameAs: [dict.profile.linkedin, dict.profile.github, dict.profile.kaggle],
        knowsLanguage: [
          { "@type": "Language", name: "Spanish", alternateName: "es" },
          { "@type": "Language", name: "English", alternateName: "en" },
          { "@type": "Language", name: "Portuguese", alternateName: "pt" },
        ],
        knowsAbout: dict.cv.targets,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá",
          addressCountry: "CO",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Pontificia Universidad Javeriana",
        },
        seeks: dict.cv.targets.map((t) => ({
          "@type": "Demand",
          name: t,
          availableAtOrFrom: {
            "@type": "Place",
            name: "Remote",
          },
        })),
      },
      {
        "@type": "ProfilePage",
        "@id": `${home}#page`,
        url: home,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: lang,
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        isPartOf: { "@id": SITE_ID },
      },
    ],
  };
}

/** Lo que una subpágina afirma de sí misma. Solo existía en la portada:
 *  las siete subpáginas —incluidos tres repositorios públicos, una tesis y un
 *  warehouse de datos abiertos— no decían al buscador qué eran. Cada nodo se
 *  construye con el título y la descripción de la propia página y con enlaces
 *  que la página ya enseña: nada aquí que el lector no pueda verificar arriba. */
export type PageWork =
  | { type: "SoftwareSourceCode"; codeRepository: string; programmingLanguage?: string }
  | { type: "SoftwareApplication"; url: string; applicationCategory: string }
  | {
      type: "ScholarlyArticle";
      codeRepository: string;
      /** Los datos derivados que la página publica (el atlas), para Google
       *  Dataset Search. Solo lo que la página ya enseña: licencia, cobertura
       *  y el repositorio donde están. */
      dataset?: { license: string; temporalCoverage: string; spatialCoverage: string };
    }
  | { type: "Article" };

export function pageGraph(
  dict: Dictionary,
  lang: string,
  route: string,
  meta: { title: string; description: string },
  work?: PageWork,
) {
  const home = `${SITE}/${lang}`;
  const url = `${home}${route}`;
  const pageId = `${url}#page`;
  const base = {
    name: meta.title,
    description: meta.description,
    url,
    inLanguage: lang,
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": pageId },
  };
  const workNode =
    work?.type === "SoftwareSourceCode"
      ? { "@type": "SoftwareSourceCode", ...base, codeRepository: work.codeRepository, programmingLanguage: work.programmingLanguage }
      : work?.type === "SoftwareApplication"
        ? { "@type": "SoftwareApplication", ...base, url: work.url, applicationCategory: work.applicationCategory, operatingSystem: "Web" }
        : work?.type === "ScholarlyArticle"
          ? { "@type": "ScholarlyArticle", ...base, isBasedOn: work.codeRepository, sourceOrganization: { "@type": "CollegeOrUniversity", name: "Pontificia Universidad Javeriana" } }
          : work?.type === "Article"
            ? { "@type": "Article", ...base }
            : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: lang,
        isPartOf: { "@id": SITE_ID },
        about: { "@id": PERSON_ID },
        ...(workNode ? { mainEntity: { "@id": `${url}#work` } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dict.profile.name, item: home },
          { "@type": "ListItem", position: 2, name: meta.title, item: url },
        ],
      },
      ...(workNode ? [{ "@id": `${url}#work`, ...workNode }] : []),
      ...(work?.type === "ScholarlyArticle" && work.dataset
        ? [
            {
              "@type": "Dataset",
              "@id": `${url}#dataset`,
              name: meta.title,
              description: meta.description,
              url,
              sameAs: work.codeRepository,
              creator: { "@id": PERSON_ID },
              license: work.dataset.license,
              isAccessibleForFree: true,
              inLanguage: lang,
              temporalCoverage: work.dataset.temporalCoverage,
              spatialCoverage: { "@type": "Place", name: work.dataset.spatialCoverage },
            },
          ]
        : []),
    ],
  };
}
