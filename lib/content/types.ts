// ============================================================
// Los tipos y las constantes que comparten los cuatro ficheros de contenido.
//
// Vive aquí y no en `lib/dictionaries.ts` porque son ESTOS ficheros los que
// los usan; que el diccionario los re-exporte es cortesía para quien ya
// importaba desde ahí, no la dirección real de la dependencia.
// ============================================================

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];


export type Status = "live" | "building" | "research" | "idea";

// Un reconocimiento puede tener evidencia pública; la mayoría no la tiene.
export type Award = {
  title: string; year: string; desc: string; href?: string; hrefLabel?: string;
  // Una captura del artefacto, si es visual. El alt va por idioma.
  image?: { src: string; width: number; height: number }; imageAlt?: string;
};
// Una cifra lleva su prueba: href relativo al idioma ("/cv#experiencia") o absoluto.
export type Metric = { value: string; label: string; note: string; href: string };
// Herramienta con su prueba; la prueba puede enlazar a la página que la muestra.
export type ProofRow = { name: string; proof: string; href?: string };
// Botón del proyecto destacado. Vive en el diccionario y no en la página porque
// antes los tres estaban fijos en el componente —uno de ellos apuntando a
// /projects/trading-sim—, así que cambiar cuál es el proyecto destacado obligaba a
// editar el layout. El destino es contenido, no estructura.
// `tone` decide el peso visual: sólido el destino principal, contorno el
// secundario, texto el terciario.
export type ProjectLink = { label: string; href: string; tone: "solid" | "outline" | "text" };
// Fila de "también en la mesa": sin href es un proyecto privado y lo dice en access.
export type AlsoRow = {
  name: string; kind: string; status: Status; statusText: string; note: string;
  href?: string; access?: string;
};
export type Education = {
  title: string; inst: string; period: string; status: Status; statusText: string;
  note?: string; href?: string; hrefLabel?: string;
};
export type CvProject = {
  name: string; role: string; period: string; href: string; hrefLabel: string;
  stack: string[]; bullets: string[];
};

/* El proyecto no tiene sitio aparte: vive en /research/fintech-inclusion, dentro de este
   portafolio. Lo unico externo es el repositorio, que es donde esta el codigo. */
export const THESIS_REPO = "https://github.com/DavinsonR/financial-inclusion-colombia";
/* La ficha de cita del repositorio (CITATION.cff en `main`): es a donde lleva
   «Cita el proyecto». GitHub la lee y ofrece el formato APA y BibTeX. */
export const THESIS_CITATION = `${THESIS_REPO}/blob/main/CITATION.cff`;

/* La bitácora de fallos, enlazada desde las divulgaciones y desde la historia.
   El texto que la cita ya no dice cuántos son: ese número caducaba solo. */
export const FALLOS_LOG = "https://github.com/DavinsonR/proyecto-davirson/blob/main/docs/FALLOS.md";

/* El tablero del hackathon es el unico artefacto visual, publico y de dominio
   financiero-adyacente que existe hoy: la fila de Tableau del toolkit lo
   afirmaba sin enlazarlo mientras la URL viva ya estaba dos secciones mas abajo,
   en reconocimientos. Ojo: si el workbook se renombra en Tableau Public la URL
   cambia, y por eso vive en una sola constante. */
export const TABLEAU_VIZ =
  "https://public.tableau.com/app/profile/davirson.novoa/viz/BodyTrendsADataAnalysisProject/TrendsAnalysis";

/* Su captura, servida desde este origen (la CSP no admite imágenes de terceros):
   el PNG que Tableau Public publica para la vista, sin sus barras de pestañas y
   de pie, a WebP. Era el único artefacto visual financiero-adyacente del sitio y
   se ofrecía solo como enlace de texto. */
export const TABLEAU_SHOT = { src: "/tableau/bodytrends-trends-analysis.webp", width: 800, height: 548 };

export const profile = {
  name: "Davirson Novoa Ramírez",
  email: "davirson@davirson.com",
  linkedin: "https://linkedin.com/in/davirson-novoa",
  github: "https://github.com/DavinsonR",
  kaggle: "https://kaggle.com/davinsonnovoa",
};
