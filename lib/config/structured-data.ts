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
export function personGraph(dict: Dictionary, lang: Locale) {
  const home = `${SITE}/${lang}`;
  const personId = `${SITE}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
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
      },
    ],
  };
}
