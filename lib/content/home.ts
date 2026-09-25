// ============================================================
// GENERADO POR scripts/split-dictionaries.mjs — pero SÍ se edita a mano.
// Este es el sitio donde se cambian los textos del sitio, en los dos idiomas.
// El script solo hizo el corte inicial; no hay que volver a correrlo.
//
// INVARIANTE: `es` y `en` tienen exactamente la misma forma, incluidas las
// longitudes de los arrays. `npm run check:dict` es quien lo prueba — `tsc`
// no ve una lista más corta en un idioma.
// ============================================================
// La portada: metadatos, navegación, la hoja y la mesa de trabajo

import type { Metric, ShowcaseCard } from "./types";
import { THESIS as T, thesisFormat } from "../data/thesis-results";

// Las cifras de la tesis salen de un solo sitio (lib/data/thesis-results.ts).
const fes = thesisFormat("es");
const fen = thesisFormat("en");

export const home = {
  es: {
    meta: {
      title: "Davirson Novoa — Finance Data Analyst",
      description:
        "Finance Data Analyst: dueño del cierre de 15+ países, una plataforma de datos en producción y un sistema de crédito que se audita solo. Remoto, GMT-5.",
    },
    nav: {
      links: [
        { label: "Trabajo", href: "#work" },
        { label: "La historia", href: "/historia" },
        { label: "CV", href: "/cv" },
      ],
      contact: "Contacto",
      backHome: "Volver al inicio",
      skip: "Saltar al contenido",
      label: "Navegación principal",
      switchLabel: "EN",
      switchTitle: "Read in English",
      themeLight: "Modo claro",
      themeDark: "Modo oscuro",
    },
    sheet: {
      classification: "Perfil · Finanzas y Datos",
      asOf: "Corte a septiembre 2026",
      name: "Davirson Novoa Ramírez",
      verdict: "Finance Data Analyst",
      thesis: "Encuentro la variación, llego a su causa raíz, dejo el control corriendo solo y lo explico donde se decide. Las cuatro cosas, la misma persona.",
      sub: "Casi nadie hace las cuatro. El analista encuentra la variación y la pasa; el ingeniero automatiza lo que le pidan; y a la dirección le llega un número que nadie sabe defender. Yo hago las cuatro. Soy dueño del cierre y el forecast de más de 15 países desde HQ, y en paralelo opero una plataforma de datos en producción —ingesta diaria, 89 pruebas de calidad, modelo semántico en Power BI— que diseñé y construí de punta a punta. Sin equipo y sin proveedor: la responsabilidad entera es mía.",
      availability: "Bogotá · GMT-5 · Tu horario de EE. UU., completo · Disponible en 15 días",
      // Las tres preguntas que un reclutador resuelve antes de abrir el CV, y que
      // la página no respondía en ninguna parte: a qué nivel, desde cuándo y por
      // qué vía. Sin la primera, el lector clasifica por defecto en el nivel más
      // bajo compatible con "tres años". Ámbar es su jurisdicción: contratación
      // y disponibilidad son contenido humano, no una cifra.
      hireLabel: "Contratarme es simple",
      hire: [
        { term: "Nivel", detail: "Senior Analyst" },
        { term: "Inicio", detail: "Preaviso de 15 días" },
        { term: "Vía", detail: "Contrato directo (B2B) o mediante EOR. Sin patrocinio de visa." },
      ],
      metricsLabel: "Cuatro cifras que puedes auditar ahora mismo",
      metricsNote: "Ninguna está redondeada y ninguna es de adorno. Haz clic en la que menos te creas.",
      pipelineLive: "Pipeline en vivo · datos hasta",
      pipelineStalled: "Pipeline detenido · datos hasta",
      pipelineLiveFallback: "Pipeline en vivo · se actualiza a diario",
      // Cuatro cifras, cuatro AFIRMACIONES DISTINTAS, una por cuerpo de trabajo.
      // Fueron cinco durante un tiempo: la quinta («1.123 municipios») era la más
      // lejana del puesto y ya tiene su propio gráfico justo debajo —la figura del
      // atlas cuenta esa historia entera—, y con cinco huecos el ojo no elige,
      // recorre (auditoría del 23 sep 2026). Cuatro es además lo que declara
      // DESIGN.md para la banda. El orden es deliberado: alcance de negocio,
      // escala de datos, honestidad intelectual, rigor de producción.
      metrics: [
        { value: "15+", label: "países cuyo cierre controlo", note: "desde HQ · América y hemisferio oriental", href: "/cv#experiencia" },
        { value: "95 M", label: "registros de crédito procesados", note: "93,4 M HMDA + 1,96 M SBA · el modelo entrena sobre 62,4 M", href: "/projects/credit-risk#cr-cliff" },
        { value: "1.392", label: "estrategias puestas a prueba", note: "sobrevivieron {survivors} · publiqué las {eliminated} que no", href: "/projects/trading-sim" },
        { value: "89", label: "pruebas que corren antes que tú", note: "cada día, antes de que un dato se publique", href: "/projects/trading-sim#calidad" },
      ] as Metric[],
      ctaPrimary: "Descargar CV (PDF)",
      ctaSecondary: "Ver la evidencia completa",
      // La figura del atlas. No es adorno: el par de mapas ES el argumento del
      // resultado nulo de la tesis, y era lo único visual del sitio que vivía
      // cinco pantallas dentro de una ruta a dos clics.
      atlasFigure: {
        label: "Figura · Índice de inclusión financiera por departamento",
        title: "En 2018, diecisiete departamentos estaban bajo la línea base. En 2025 queda uno.",
        body: `Los dos mapas comparten escala, y el índice está estandarizado contra 2018. Todo el país subió a la vez — y esa subida común es justo la razón de que el efecto se desvanezca: con solo efectos de entidad, la inclusión financiera predice el crecimiento (${fes.s(T.entityOnly.coefShort)}, p ${fes.lt(T.entityOnly.pBelow)}); al descontar el año, el coeficiente cae a ${fes.s(T.base.coef)} (p = ${fes.n(T.base.p)}) y el diseño descarta efectos mayores a ${fes.n(T.bound.pp)} puntos por desviación del índice.`,
        legendLow: "Bajo la base de 2018",
        legendMid: "Base 2018",
        legendHigh: "Sobre la base",
        cta: "Abrir el atlas de los 1.123 municipios",
        alt: "Dos mapas de Colombia por departamento con el índice compuesto de inclusión financiera, en la misma escala divergente: en 2018 el país aparece en tonos neutros con la periferia en rojo, y en 2025 casi todo el territorio está en azul.",
      },
      portraitPending: "DNR",
    },
    work: {
      // La vitrina. Antes: un caso de 600 palabras más cinco filas de prosa, y
      // la queja fue «no me gusta, quiero ver un preview de cada proyecto». Cada
      // tarjeta es ahora un gráfico propio, una cifra, una línea y un clic a su
      // página. El detalle vive en la página del proyecto, que es donde se lee.
      title: "Seis piezas de trabajo. Cada una se verifica en un clic.",
      intro: "Elige una: te lleva directo a la evidencia.",
      cta: "Ver el proyecto",
      cards: [
        {
          viz: "credit",
          name: "Riesgo de crédito que se audita solo",
          kind: "credit-risk-mlops · ML con gobierno de modelos",
          status: "live",
          statusText: "DESPLEGADO",
          stat: "276,3 M USD",
          statLabel: "en castigos evitables sobre la cartera de prueba",
          hook: "Diez gates que bloquean cualquier modelo que no cumpla, incluido el mío: impacto dispar de 0,7639 contra un umbral de 0,80.",
          href: "/projects/credit-risk",
          vizLabels: ["Rechazo al azar", "Mi modelo", "más pérdida evitada que rechazando al azar", "2,15×"],
        },
        {
          viz: "funnel",
          name: "Plataforma de datos de mercado",
          kind: "market-data-medallion · PostgreSQL + dbt",
          status: "live",
          statusText: "EN OPERACIÓN",
          stat: "{survivors}",
          statLabel: "de 1.392 estrategias sobrevivieron a la ventana ciega",
          hook: "48 activos cada día y 89 pruebas de calidad antes de publicar un dato.",
          href: "/projects/trading-sim",
          vizLabels: ["evaluadas", "ganaron en muestra", "sobrevivieron"],
        },
        {
          viz: "star",
          name: "Informe Power BI",
          kind: "Medallion Insights · TMDL + DAX",
          status: "live",
          statusText: "EN EL REPO",
          stat: "17",
          statLabel: "medidas DAX, versionadas como código",
          hook: "Un modelo estrella que se revisa línea por línea en una pull request.",
          href: "/projects/powerbi",
          vizLabels: ["dim_assets", "hechos", "agregados"],
        },
        {
          viz: "forecast",
          name: "Pronóstico macro de LATAM",
          kind: "Laboratorio interactivo · 13 modelos",
          status: "live",
          statusText: "LAB ABIERTO",
          stat: "20",
          statLabel: "economías pronosticadas a 2027, con su acierto medido",
          hook: "Trece modelos contra el pronóstico ingenuo. Y tú también puedes jugarle.",
          href: "/labs/macro-forecast",
          vizLabels: ["error frente al ingenuo", "ingenuo = 1"],
        },
        {
          viz: "dots",
          name: "Inclusión financiera en Colombia",
          kind: "Tesis de maestría · datos abiertos",
          status: "research",
          statusText: "TESIS RADICADA",
          stat: "17 → 1",
          statLabel: "departamentos bajo la línea base, de 2018 a 2025",
          hook: "19 fuentes públicas, 1.123 municipios y el resultado publicado tal como salió.",
          href: "/research/fintech-inclusion",
          vizLabels: ["2018", "2025", "bajo la línea base"],
        },
        {
          viz: "screen",
          name: "JARVIS, producto multiusuario",
          kind: "Next.js + Postgres con seguridad por fila",
          status: "live",
          statusText: "DEMO ABIERTO",
          stat: "526",
          statLabel: "pruebas automáticas en ocho puertas de CI",
          hook: "Datos de salud y de dinero, abiertos en un demo público sin exponer una sola fila.",
          href: "/projects/tracking",
          vizLabels: [],
        },
      ] as ShowcaseCard[],
    },
  },
  en: {
    meta: {
      title: "Davirson Novoa — Finance Data Analyst",
      description:
        "Finance Data Analyst: owns the close for 15+ countries, runs a production data platform and a credit system that audits itself. Remote, GMT-5.",
    },
    nav: {
      links: [
        { label: "Work", href: "#work" },
        { label: "The story", href: "/historia" },
        { label: "CV", href: "/cv" },
      ],
      contact: "Contact",
      backHome: "Back to home",
      skip: "Skip to content",
      label: "Main navigation",
      switchLabel: "ES",
      switchTitle: "Leer en español",
      themeLight: "Light mode",
      themeDark: "Dark mode",
    },
    sheet: {
      classification: "Profile · Finance & Data",
      asOf: "As of September 2026",
      name: "Davirson Novoa Ramírez",
      verdict: "Finance Data Analyst",
      thesis: "I find the variance, I trace it to root cause, I leave the control running itself, and I explain it where the decision gets made. All four, one person.",
      sub: "Almost nobody does all four. The analyst finds the variance and passes it on; the engineer automates whatever they are handed; and the board gets a number nobody can defend. I do all four. I own the close and forecast for 15+ countries from HQ, and alongside it I run a production data platform — daily ingestion, 89 quality tests, a Power BI semantic model — that I designed and built end to end. No team, no vendor: the accountability is all mine.",
      availability: "Bogotá · GMT-5 · Your US hours, in full · Available in 15 days",
      // The three questions a recruiter settles before opening the CV, and that
      // the page answered nowhere: at what level, from when, and through what
      // arrangement. Without the first, the reader defaults to the lowest level
      // consistent with "three years". Amber is their jurisdiction: hiring and
      // availability are human content, not a figure.
      hireLabel: "Hiring me is simple",
      hire: [
        { term: "Level", detail: "Senior Analyst" },
        { term: "Start", detail: "15 days' notice" },
        { term: "Route", detail: "Direct contract (B2B) or through an EOR. No visa sponsorship needed." },
      ],
      metricsLabel: "Four figures you can audit right now",
      metricsNote: "Not one is rounded and not one is decoration. Click the one you believe least.",
      pipelineLive: "Live pipeline · data through",
      pipelineStalled: "Pipeline stalled · data through",
      pipelineLiveFallback: "Live pipeline · refreshes daily",
      metrics: [
        { value: "15+", label: "countries whose close I own", note: "from HQ · Americas and Eastern Hemisphere", href: "/cv#experiencia" },
        { value: "95 M", label: "credit records processed", note: "93.4 M HMDA + 1.96 M SBA · the model trains on 62.4 M", href: "/projects/credit-risk#cr-cliff" },
        { value: "1,392", label: "strategies put to the test", note: "{survivors} survived · I published the {eliminated} that didn't", href: "/projects/trading-sim" },
        { value: "89", label: "tests that run before you do", note: "every day, before a single figure ships", href: "/projects/trading-sim#calidad" },
      ] as Metric[],
      ctaPrimary: "Download CV (PDF)",
      ctaSecondary: "See the full evidence",
      // The atlas figure. Not ornament: the pair of maps IS the argument for the
      // thesis's null result, and it was the only visual on the site — five
      // screens inside a route two clicks away.
      atlasFigure: {
        label: "Figure · Financial-inclusion index by department",
        title: "In 2018, seventeen departments sat below the baseline. In 2025, one does.",
        body: `Both maps share one scale, and the index is standardised against 2018. The whole country moved up at once — and that common rise is exactly why the effect vanishes: with entity effects alone, financial inclusion predicts growth (${fen.s(T.entityOnly.coefShort)}, p ${fen.lt(T.entityOnly.pBelow)}); take the year out and the coefficient falls to ${fen.s(T.base.coef)} (p = ${fen.n(T.base.p)}), and the design rules out effects above ${fen.n(T.bound.pp)} points per standard deviation of the index.`,
        legendLow: "Below the 2018 baseline",
        legendMid: "2018 baseline",
        legendHigh: "Above the baseline",
        cta: "Open the atlas of all 1,123 municipalities",
        alt: "Two maps of Colombia by department showing the composite financial-inclusion index on one diverging scale: in 2018 the country reads in neutral tones with a red periphery, and by 2025 almost the whole territory is blue.",
      },
      portraitPending: "DNR",
    },
    work: {
      // The showcase: one visual, one figure, one line and one click per project.
      // See the Spanish note above.
      title: "Six pieces of work. Each one checkable in one click.",
      intro: "Pick one: it takes you straight to the evidence.",
      cta: "See the project",
      cards: [
        {
          viz: "credit",
          name: "Credit risk that audits itself",
          kind: "credit-risk-mlops · ML with model governance",
          status: "live",
          statusText: "DEPLOYED",
          stat: "$276.3M",
          statLabel: "in avoidable charge-offs on the test portfolio",
          hook: "Ten gates that block any model that fails, mine included: disparate impact of 0.7639 against a 0.80 threshold.",
          href: "/projects/credit-risk",
          vizLabels: ["Random declines", "My model", "more loss avoided than declining at random", "2.15×"],
        },
        {
          viz: "funnel",
          name: "Market data platform",
          kind: "market-data-medallion · PostgreSQL + dbt",
          status: "live",
          statusText: "IN OPERATION",
          stat: "{survivors}",
          statLabel: "of 1,392 strategies survived the blind window",
          hook: "48 assets every day, and 89 quality tests before a single figure ships.",
          href: "/projects/trading-sim",
          vizLabels: ["evaluated", "won in-sample", "survived"],
        },
        {
          viz: "star",
          name: "Power BI report",
          kind: "Medallion Insights · TMDL + DAX",
          status: "live",
          statusText: "IN THE REPO",
          stat: "17",
          statLabel: "DAX measures, versioned as code",
          hook: "A star schema you review line by line in a pull request.",
          href: "/projects/powerbi",
          vizLabels: ["dim_assets", "facts", "aggregates"],
        },
        {
          viz: "forecast",
          name: "LATAM macro forecasting",
          kind: "Interactive lab · 13 models",
          status: "live",
          statusText: "OPEN LAB",
          stat: "20",
          statLabel: "economies forecast to 2027, with their accuracy measured",
          hook: "Thirteen models against the naive forecast. And you can play against it too.",
          href: "/labs/macro-forecast",
          vizLabels: ["error vs. naive", "naive = 1"],
        },
        {
          viz: "dots",
          name: "Financial inclusion in Colombia",
          kind: "M.Sc. thesis · open data",
          status: "research",
          statusText: "THESIS FILED",
          stat: "17 → 1",
          statLabel: "departments below the baseline, from 2018 to 2025",
          hook: "19 public sources, 1,123 municipalities and the result published as it came out.",
          href: "/research/fintech-inclusion",
          vizLabels: ["2018", "2025", "below the baseline"],
        },
        {
          viz: "screen",
          name: "JARVIS, a multi-user product",
          kind: "Next.js + Postgres with row-level security",
          status: "live",
          statusText: "OPEN DEMO",
          stat: "526",
          statLabel: "automated tests across eight CI gates",
          hook: "Health and money data, open in a public demo without exposing a single row.",
          href: "/projects/tracking",
          vizLabels: [],
        },
      ] as ShowcaseCard[],
    },
  },
};
