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

import { THESIS_REPO, TABLEAU_VIZ, profile } from "./types";
import type { Status, Award, Metric, ProofRow, ProjectLink, AlsoRow, Education, CvProject } from "./types";

export const home = {
  es: {
    meta: {
      title: "Davirson Novoa — Finance Data Analyst",
      description:
        "Economista y consultor FP&A que construye la infraestructura de datos él mismo. Leo un P&L y construyo el pipeline que lo alimenta.",
    },
    nav: {
      links: [
        { label: "Trabajo", href: "#work" },
        { label: "Trayectoria", href: "#track" },
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
      thesis: "Leo un P&L y construyo el pipeline que lo alimenta.",
      sub: "Economista y consultor FP&A para operaciones en más de 15 países. Opero una plataforma de datos en producción —ingesta diaria, pruebas de calidad automáticas y modelo en Power BI— que construí yo mismo.",
      availability: "Bogotá · GMT-5 · Traslape completo con horario de EE.UU. · Abierto a roles remotos",
      // Las tres preguntas que un reclutador resuelve antes de abrir el CV, y que
      // la página no respondía en ninguna parte: a qué nivel, desde cuándo y por
      // qué vía. Sin la primera, el lector clasifica por defecto en el nivel más
      // bajo compatible con "tres años". Ámbar es su jurisdicción: contratación
      // y disponibilidad son contenido humano, no una cifra.
      hireLabel: "Cómo contratarme",
      hire: [
        { term: "Nivel", detail: "Senior Analyst" },
        { term: "Inicio", detail: "Preaviso de 15 días" },
        { term: "Vía", detail: "Contrato directo (B2B) o mediante EOR. Sin patrocinio de visa." },
      ],
      metricsLabel: "Cifras verificables",
      metricsNote: "Cada cifra enlaza a lo que la prueba.",
      pipelineLive: "Pipeline en vivo · datos hasta",
      pipelineStalled: "Pipeline detenido · datos hasta",
      pipelineLiveFallback: "Pipeline en vivo · se actualiza a diario",
      // Cinco cifras, cinco AFIRMACIONES DISTINTAS, una por cuerpo de trabajo.
      // Antes eran cuatro y dos hablaban del mismo pipeline (48 activos y 89
      // pruebas), así que dos de los cuatro huecos más valiosos de la portada
      // decían lo mismo. El orden es deliberado: alcance de negocio, escala de
      // datos, honestidad intelectual, investigación propia, rigor de producción.
      metrics: [
        { value: "15+", label: "países en alcance", note: "HQ · América y hemisferio oriental", href: "/cv#experiencia" },
        { value: "95 M", label: "registros de crédito modelados", note: "1,96 M SBA + 93,4 M HMDA", href: "/projects/credit-risk#cr-cliff" },
        { value: "1.392", label: "variantes de estrategia evaluadas", note: "sobrevivieron menos de 50", href: "/projects/trading-sim" },
        { value: "1.123", label: "municipios en el atlas", note: "19 fuentes públicas", href: "/research/fintech-inclusion#atlas" },
        { value: "89", label: "pruebas de datos automáticas", note: "en cada corrida diaria", href: "/projects/trading-sim#calidad" },
      ] as Metric[],
      ctaPrimary: "Descargar CV (PDF)",
      ctaSecondary: "Ver la evidencia",
      // La figura del atlas. No es adorno: el par de mapas ES el argumento del
      // resultado nulo de la tesis, y era lo único visual del sitio que vivía
      // cinco pantallas dentro de una ruta a dos clics.
      atlasFigure: {
        label: "Figura · Índice de inclusión financiera por departamento",
        title: "En 2018, diecisiete departamentos estaban bajo la línea base. En 2025 queda uno.",
        body: "Los dos mapas comparten escala, y el índice está estandarizado contra 2018. Todo el país subió a la vez — y esa subida común es justo la razón de que el efecto se desvanezca: con solo efectos de entidad, la inclusión financiera predice el crecimiento (+0,0242, p < 0,001); al descontar el año, el coeficiente es cero.",
        legendLow: "Bajo la base de 2018",
        legendMid: "Base 2018",
        legendHigh: "Sobre la base",
        cta: "Abrir el atlas de los 1.123 municipios",
        alt: "Dos mapas de Colombia por departamento con el índice compuesto de inclusión financiera, en la misma escala divergente: en 2018 el país aparece en tonos neutros con la periferia en rojo, y en 2025 casi todo el territorio está en azul.",
      },
      portraitPending: "DNR",
    },
    work: {
      title: "Lo que construí, y el problema que resuelve",
      intro: "Un proyecto, contado como se cuenta un caso: el problema primero.",
      project: {
        name: "credit-risk-mlops",
        kind: "Sistema de decisión con gobierno de modelos",
        problemLabel: "El problema",
        problem: "Un modelo de crédito que nadie puede auditar no se despliega, por bueno que sea. El validador no pregunta cuánto da el AUC: pregunta quién puede cambiar esa cifra sin que nadie se entere, qué pasa cuando cambia el régimen y cómo se sabe que el modelo sigue viendo la población para la que se entrenó.",
        builtLabel: "Lo que construí",
        built: "Un sistema de decisión crediticia sobre 1,96 millones de préstamos SBA 7(a) y 62,4 millones de solicitudes HMDA, con validación out-of-time que cruza el shock COVID, diez gates que bloquean la promoción de un modelo que no cumpla, model card y reporte de validación generados desde la corrida, monitoreo de deriva y una capa de inferencia causal. Ninguna cifra publicada se escribe a mano: el gate las recomputa desde las predicciones guardadas antes de dejar promover nada.",
        matterLabel: "Por qué importa",
        matter: "Es lo que separa un modelo de un modelo desplegable. La misma estructura —umbrales derivados y escritos, documentación que se regenera sola, controles que fallan cerrado— es la que pide un examen de riesgo de modelo, y la que hace que un número sobreviva a la pregunta de dónde salió.",
        findingLabel: "Hallazgo publicado",
        finding: "Mi primer AUC fue 0,9461 y lo borré: era una fuga. Y de los diez gates, uno bloquea mi propio modelo de acceso con una razón de impacto dispar de 0,7639 contra un umbral de 0,80 — no bajé el umbral.",
        stack: ["Python", "LightGBM", "PyTorch", "DuckDB", "PySpark", "MLflow", "ONNX", "Power BI"],
        links: [
          { label: "Ver el proyecto", href: "/projects/credit-risk", tone: "solid" },
          { label: "Ver el código", href: "https://github.com/DavinsonR/credit-risk-mlops", tone: "outline" },
          { label: "Leer la bitácora de defectos", href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md", tone: "text" },
        ] as ProjectLink[],
      },
      also: {
        title: "También en la mesa",
        // Orden: del más nuevo al más viejo, por fecha de creación del repositorio.
        // JARVIS nació el 1 de septiembre de 2026 -- su repositorio es privado, así que
        // la fecha la puso su autor y no la API de GitHub -- y por eso queda entre la
        // tesis (5 de septiembre) y market-data-medallion (17 de agosto).
        rows: [
          {
            name: "Inclusión financiera y crecimiento regional en Colombia",
            kind: "Investigación reproducible · datos abiertos",
            status: "research",
            statusText: "EN CONSTRUCCIÓN",
            note: "Diecinueve fuentes públicas en un warehouse dimensional con dbt y DuckDB, resueltas a código municipal DIVIPOLA. Encima: un índice de inclusión financiera por dimensiones, dos paneles anuales, un atlas de los 1.123 municipios y una batería econométrica completa, con sus resultados publicados.",
            href: "/research/fintech-inclusion",
          },
          {
            name: "JARVIS — app de seguimiento personal",
            kind: "Producto propio · Next.js + Supabase",
            status: "live",
            statusText: "DEMO ABIERTO",
            note: "Registro diario de hábitos, cuerpo, sueño, comida y gastos sobre Postgres con política de fila en 34 tablas, 526 pruebas y ocho puertas en CI. Hay un demo abierto con las cinco pantallas reales y los datos de una persona que no existe: no consulta la base ni una vez, y eso lo obliga una prueba.",
            href: "/projects/tracking",
            access: "Repositorio privado · el demo es la superficie pública",
          },
          {
            name: "market-data-medallion — plataforma de datos",
            kind: "Plataforma en producción · se refresca sola",
            status: "live",
            statusText: "EN OPERACIÓN",
            note: "Ingesta diaria desde cuatro fuentes de mercado a un warehouse PostgreSQL en capas medallion con dbt, 89 pruebas de calidad automáticas y CI/CD, sobre infraestructura gratuita. De más de 1.300 variantes de estrategia evaluadas encima, apenas una de cada ocho ganadoras dentro de muestra sobrevivió fuera de muestra — publiqué todas las que no.",
            href: "/projects/trading-sim",
          },
          {
            name: "Medallion Insights — informe Power BI",
            kind: "Modelo semántico y reporte",
            status: "live",
            statusText: "EN EL REPO",
            note: "Siete tablas en TMDL sobre el warehouse, 17 medidas DAX y cuatro páginas de informe, versionado como texto en el repositorio público. El catálogo completo, con cada expresión, está en su página.",
            href: "/projects/powerbi",
          },
        ] as AlsoRow[],
      },
      // "Lo que esto demuestra" salió de aquí y de la portada: sus seis entradas
      // repetían una por una las ocho filas de `toolkit`, con la misma forma
      // tipográfica y a 300 px de distancia, y ninguna llevaba prueba. La que
      // sobrevive es la que nombra el artefacto y enlaza a él.
    },
  },
  en: {
    meta: {
      title: "Davirson Novoa — Finance Data Analyst",
      description:
        "Economist and FP&A consultant who builds the data infrastructure himself. I read a P&L and I build the pipeline that feeds it.",
    },
    nav: {
      links: [
        { label: "Work", href: "#work" },
        { label: "Track record", href: "#track" },
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
      thesis: "I read a P&L, and I build the pipeline that feeds it.",
      sub: "Economist and FP&A consultant supporting operations across 15+ countries. I run a production data platform — daily ingestion, automated quality tests, a Power BI model — that I built and operate myself.",
      availability: "Bogotá · GMT-5 · Full overlap with US hours · Open to remote roles",
      // The three questions a recruiter settles before opening the CV, and that
      // the page answered nowhere: at what level, from when, and through what
      // arrangement. Without the first, the reader defaults to the lowest level
      // consistent with "three years". Amber is their jurisdiction: hiring and
      // availability are human content, not a figure.
      hireLabel: "How to hire me",
      hire: [
        { term: "Level", detail: "Senior Analyst" },
        { term: "Start", detail: "15 days' notice" },
        { term: "Route", detail: "Direct contract (B2B) or through an EOR. No visa sponsorship needed." },
      ],
      metricsLabel: "Verifiable figures",
      metricsNote: "Every figure links to what proves it.",
      pipelineLive: "Live pipeline · data through",
      pipelineStalled: "Pipeline stalled · data through",
      pipelineLiveFallback: "Live pipeline · refreshes daily",
      metrics: [
        { value: "15+", label: "countries in scope", note: "HQ · Americas and Eastern Hemisphere", href: "/cv#experiencia" },
        { value: "95 M", label: "credit records modelled", note: "1.96 M SBA + 93.4 M HMDA", href: "/projects/credit-risk#cr-cliff" },
        { value: "1,392", label: "strategy variants tested", note: "fewer than 50 survived", href: "/projects/trading-sim" },
        { value: "1,123", label: "municipalities in the atlas", note: "19 public sources", href: "/research/fintech-inclusion#atlas" },
        { value: "89", label: "automated data tests", note: "on every daily run", href: "/projects/trading-sim#calidad" },
      ] as Metric[],
      ctaPrimary: "Download CV (PDF)",
      ctaSecondary: "See the evidence",
      // The atlas figure. Not ornament: the pair of maps IS the argument for the
      // thesis's null result, and it was the only visual on the site — five
      // screens inside a route two clicks away.
      atlasFigure: {
        label: "Figure · Financial-inclusion index by department",
        title: "In 2018, seventeen departments sat below the baseline. In 2025, one does.",
        body: "Both maps share one scale, and the index is standardised against 2018. The whole country moved up at once — and that common rise is exactly why the effect vanishes: with entity effects alone, financial inclusion predicts growth (+0.0242, p < 0.001); take the year out and the coefficient is zero.",
        legendLow: "Below the 2018 baseline",
        legendMid: "2018 baseline",
        legendHigh: "Above the baseline",
        cta: "Open the atlas of all 1,123 municipalities",
        alt: "Two maps of Colombia by department showing the composite financial-inclusion index on one diverging scale: in 2018 the country reads in neutral tones with a red periphery, and by 2025 almost the whole territory is blue.",
      },
      portraitPending: "DNR",
    },
    work: {
      title: "What I built, and the problem it solves",
      intro: "One project, told the way a case is told: the problem first.",
      project: {
        name: "credit-risk-mlops",
        kind: "Decision system with model governance",
        problemLabel: "The problem",
        problem: "A credit model nobody can audit does not get deployed, however good it is. The validator does not ask what the AUC is: they ask who can change that figure without anyone noticing, what happens when the regime shifts, and how you know the model still sees the population it was trained for.",
        builtLabel: "What I built",
        built: "A credit decisioning system over 1.96M SBA 7(a) loans and 62.4M HMDA applications, with out-of-time validation across the COVID shock, ten gates that block promotion of a model that does not comply, a model card and validation report generated from the run, drift monitoring, and a causal inference layer. No published figure is written by hand: the gate recomputes them from the saved predictions before letting anything be promoted.",
        matterLabel: "Why it matters",
        matter: "This is what separates a model from a deployable one. The same structure — thresholds derived and written down, documentation that regenerates itself, controls that fail closed — is what a model risk examination asks for, and what makes a number survive the question of where it came from.",
        findingLabel: "Published finding",
        finding: "My first AUC was 0.9461 and I deleted it: it was a leak. And of the ten gates, one blocks my own access model at a disparate impact ratio of 0.7639 against a 0.80 threshold — I did not move the threshold.",
        stack: ["Python", "LightGBM", "PyTorch", "DuckDB", "PySpark", "MLflow", "ONNX", "Power BI"],
        links: [
          { label: "See the project", href: "/projects/credit-risk", tone: "solid" },
          { label: "See the code", href: "https://github.com/DavinsonR/credit-risk-mlops", tone: "outline" },
          { label: "Read the defect log", href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md", tone: "text" },
        ] as ProjectLink[],
      },
      also: {
        title: "Also on the desk",
        // Order: newest to oldest, by repository creation date. JARVIS was born on
        // 1 September 2026 -- its repository is private, so the date comes from its
        // author rather than the GitHub API -- which puts it between the thesis
        // (5 September) and market-data-medallion (17 August).
        rows: [
          {
            name: "Financial inclusion and regional growth in Colombia",
            kind: "Reproducible research · open data",
            status: "research",
            statusText: "BUILDING",
            note: "Nineteen public sources in a dimensional warehouse on dbt and DuckDB, every series resolved to municipal codes. On top: a financial-inclusion index by dimension, two annual panels, an atlas of all 1,123 municipalities and a full econometric battery, with its results published.",
            href: "/research/fintech-inclusion",
          },
          {
            name: "JARVIS — personal tracking app",
            kind: "Own product · Next.js + Supabase",
            status: "live",
            statusText: "OPEN DEMO",
            note: "Daily logging of habits, body, sleep, food and spending on Postgres with a row policy on 34 tables, 526 tests and eight CI gates. There is an open demo running the five real screens on data from someone who does not exist: it never queries the database, and a test enforces that.",
            href: "/projects/tracking",
            access: "Private repository · the demo is the public surface",
          },
          {
            name: "market-data-medallion — data platform",
            kind: "Production platform · refreshes itself",
            status: "live",
            statusText: "IN OPERATION",
            note: "Daily ingestion from four market sources into a PostgreSQL warehouse in medallion layers with dbt, 89 automated quality tests and CI/CD, on free infrastructure. Of more than 1,300 strategy variants evaluated on top of it, barely one in eight of the in-sample winners survived out of sample — I published every one that did not.",
            href: "/projects/trading-sim",
          },
          {
            name: "Medallion Insights — Power BI report",
            kind: "Semantic model and report",
            status: "live",
            statusText: "IN THE REPO",
            note: "Seven tables in TMDL over the warehouse, 17 DAX measures and four report pages, versioned as text in the public repository. The full catalogue, expression by expression, is on its page.",
            href: "/projects/powerbi",
          },
        ] as AlsoRow[],
      },
      // "What this demonstrates" left this file and the home page: its six entries
      // repeated the eight `toolkit` rows one for one, in the same typographic
      // form and 300px apart, and none of them carried proof. The list that
      // survives is the one that names the artifact and links to it.
    },
  },
};
