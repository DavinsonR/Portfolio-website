// ============================================================
// GENERADO POR scripts/split-dictionaries.mjs — pero SÍ se edita a mano.
// Este es el sitio donde se cambian los textos del sitio, en los dos idiomas.
// El script solo hizo el corte inicial; no hay que volver a correrlo.
//
// INVARIANTE: `es` y `en` tienen exactamente la misma forma, incluidas las
// longitudes de los arrays. `npm run check:dict` es quien lo prueba — `tsc`
// no ve una lista más corta en un idioma.
// ============================================================
// Trayectoria, herramientas, divulgaciones, contacto, pie y 404

import { TABLEAU_VIZ } from "./types";
import type { ProofRow } from "./types";

import { FALLOS_LOG } from "./types";

export const about = {
  es: {
    track: {
      title: "Trayectoria",
      fullCv: "Ver CV completo",
      story: "Leer la historia completa",
      rows: [
        {
          period: "2026 — hoy",
          title: "Business Consultant, FP&A · Neoris EPAM",
          desc: "Desde HQ, el cierre y el forecast de SG&A de más de 15 países a la vez — América y el hemisferio oriental. Variaciones contra plan, contra forecast previo y en moneda constante. 100% remoto, desde el primer día.",
          tag: "FP&A",
        },
        {
          period: "2024 — 2026",
          title: "SLB · de practicante a especialista en 26 meses",
          desc: "Tesorería y facturación LATAM. Análisis cambiario en Python que nadie me pidió, y una automatización que le devolvió ~10 horas al mes a cada analista — unas 60 al mes al equipo entero. Revenue recognition bajo SOX y auditorías internas sobre proyectos de tecnología.",
          tag: "Finanzas + datos",
        },
        {
          period: "2023",
          title: "Investigación económica · LEE Javeriana",
          desc: "Investigación aplicada y analítica social voluntaria con equipos remotos internacionales.",
          tag: "Datos",
        },
      ],
    },
    toolkit: {
      title: "Ninguna lista de logos",
      note: "Cualquiera puede escribir «Python» en un CV. Aquí cada herramienta enlaza al trabajo exacto donde la usé — el repositorio, el informe o el puesto. Si algo no tiene dónde enlazar, no está en esta lista.",
      rows: [
        { name: "Análisis financiero y FP&A", proof: "Cierre y forecast de SG&A en más de 15 países: variaciones contra plan, contra forecast previo y en moneda constante", href: "/cv#experiencia" },
        { name: "Excel y modelado financiero", proof: "El cierre y el forecast de esos 15+ países, en Neoris EPAM", href: "/cv#experiencia" },
        { name: "SAP", proof: "Reconocimiento de ingresos bajo SOX y conciliación bancaria automatizada, en SLB", href: "/cv#experiencia" },
        { name: "Power BI", proof: "Modelo semántico de 7 tablas en TMDL y 17 medidas DAX, versionado como texto", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard ganador del BodyTech Trends Hackathon, público", href: TABLEAU_VIZ },
        { name: "Python", proof: "Ingesta incremental, motor de backtesting y descomposición cambiaria", href: "/projects/trading-sim" },
        { name: "SQL · PostgreSQL", proof: "Warehouse medallion de tres capas, más de 58.000 velas en producción", href: "/projects/trading-sim" },
        { name: "dbt", proof: "89 pruebas de calidad que corren antes de publicar un dato", href: "/projects/trading-sim#calidad" },
        { name: "DuckDB", proof: "Warehouse dimensional de 19 fuentes públicas resueltas a código DIVIPOLA", href: "/research/fintech-inclusion#datos" },
        { name: "Git · GitHub Actions", proof: "Cron diario en operación, con circuit breaker de rate limit", href: "/projects/trading-sim" },
        { name: "Econometría de panel", proof: "Efectos fijos de dos vías sobre 228 observaciones, con bootstrap salvaje por clúster (p = 0,89) y placebo por permutación (p = 0,68)", href: "/research/fintech-inclusion#resultados" },
        { name: "Diagnóstico y robustez", proof: "Driscoll-Kraay por dependencia transversal medida (p = 0,014), CCE, SLX y cuatro diseños contra la exogeneidad", href: "/research/fintech-inclusion#metodo" },
        { name: "Machine learning", proof: "LightGBM sobre 1,96 M de préstamos SBA y 62,4 M de solicitudes HMDA: AUC 0,7005, +0,0311 sobre la scorecard interpretable", href: "/projects/credit-risk" },
        { name: "Riesgo de crédito y scorecards", proof: "Binning WoE con optbinning, validación out-of-time que cruza el shock COVID, error de calibración 0,0107", href: "/projects/credit-risk#cr-cliff" },
        { name: "Gobierno de modelos (MLOps)", proof: "Diez gates de promoción juzgados por código de salida; uno bloquea mi propio modelo y no bajé el umbral", href: "/projects/credit-risk" },
      ] as ProofRow[],
    },
    disclosures: {
      title: "Divulgaciones",
      items: [
        {
          term: "Construido en público",
          // Sin el número: «35» se escribía a mano y caducaba solo cada vez que
          // se arreglaba algo. El enlace no caduca.
          text: "Este sitio y los proyectos detrás se documentan mientras se hacen, y los errores también. La bitácora de ingeniería lleva cada fallo encontrado y corregido, numerado uno a uno, con su causa raíz. Pocos portafolios publican esa lista. Es justo la que hace verificable todo lo demás.",
          href: FALLOS_LOG,
          hrefLabel: "Ver la bitácora de fallos",
        },
        {
          term: "Rendimientos pasados",
          text: "La investigación de trading que aparece aquí es una demostración de metodología, no una recomendación de inversión.",
        },
        {
          term: "Cifras verificables",
          text: "Cada número de esta página sale del pipeline o del repositorio público, y enlaza al artefacto que lo prueba.",
        },
        {
          term: "Informe Power BI",
          text: "El informe existe como proyecto PBIP en el repositorio público y se abre gratis en Power BI Desktop. No hay embebido público porque «Publicar en la web» exige una licencia Pro sobre un tenant de trabajo y hace público el conjunto de datos.",
        },
        {
          term: "Analítica",
          text: "El sitio cuenta páginas vistas con la analítica de Vercel: sin cookies, sin huella del navegador y sin datos personales, servida desde este mismo dominio. Por eso no hay banner de consentimiento que aceptar.",
        },
        {
          term: "Idiomas",
          text: "Español nativo · Inglés B2 · Portugués A2.",
        },
      ],
    },
    contact: {
      title: "Deja de elegir entre el que entiende el negocio y el que construye los datos.",
      body: "Abierto a roles remotos de Finance Data Analyst, Analytics Engineer y FP&A con automatización. Bogotá, GMT-5, traslape completo con Estados Unidos. Respondo en español e inglés, y respondo rápido.",
      email: "Escribir un correo",
      linkedin: "LinkedIn",
      github: "GitHub",
      kaggle: "Kaggle",
      // El correo va prellenado con los cuatro campos que hacen falta para
      // responder algo útil. Un reclutador que escribe desde el móvil no
      // redacta una vacante: rellena huecos.
      mailSubject: "Vacante — Davirson Novoa",
      mailBody:
        "Hola Davirson:\n\nRol:\nEmpresa:\nModalidad y zona horaria:\nRango salarial:\n\n",
      copy: "Copiar correo",
      copied: "Correo copiado",
      copyFail: "Selecciona y copia:",
    },
    footer: {
      left: "Davirson Novoa · construido en público",
      right: "Datos actualizados a diario por un pipeline automático",
    },
    /* El 404 es una página del sitio, no una pantalla de error del framework:
       llega gente desde enlaces viejos y desde el PDF del CV, y la única
       respuesta útil es devolverla al inicio o al CV, no informarle del código. */
    notFound: {
      code: "404",
      title: "Esta página no existe",
      body: "El enlace está roto o la ruta cambió de sitio. Todo lo publicado se alcanza desde la portada.",
      home: "Ir al inicio",
      cv: "Ver el CV",
    },
  },
  en: {
    track: {
      title: "Track record",
      fullCv: "See full CV",
      story: "Read the full story",
      rows: [
        {
          period: "2026 — present",
          title: "Business Consultant, FP&A · Neoris EPAM",
          desc: "From HQ, the SG&A close and forecast for 15+ countries at once — the Americas and the Eastern Hemisphere. Variance against plan, against prior forecast, and in constant currency. Fully remote, from day one.",
          tag: "FP&A",
        },
        {
          period: "2024 — 2026",
          title: "SLB · intern to specialist in 26 months",
          desc: "LATAM treasury and billing. FX analysis in Python nobody asked me for, and automation that handed every analyst ~10 hours a month back — around 60 a month across the team. Revenue recognition under SOX, and internal audits on technology projects.",
          tag: "Finance + data",
        },
        {
          period: "2023",
          title: "Economic research · LEE Javeriana",
          desc: "Applied research and volunteer social analytics with international remote teams.",
          tag: "Data",
        },
      ],
    },
    toolkit: {
      title: "No logo wall",
      note: "Anyone can type “Python” on a CV. Here every tool links to the exact work where I used it — the repository, the report or the role. If something has nowhere to link, it is not on this list.",
      rows: [
        { name: "Financial analysis and FP&A", proof: "SG&A close and forecast across 15+ countries: variance against plan, against prior forecast and in constant currency", href: "/cv#experiencia" },
        { name: "Excel and financial modelling", proof: "The close and forecast for those 15+ countries, at Neoris EPAM", href: "/cv#experiencia" },
        { name: "SAP", proof: "Revenue recognition under SOX and automated bank reconciliation, at SLB", href: "/cv#experiencia" },
        { name: "Power BI", proof: "Seven-table semantic model in TMDL with 17 DAX measures, versioned as text", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard that won the BodyTech Trends Hackathon, public", href: TABLEAU_VIZ },
        { name: "Python", proof: "Incremental ingestion, backtesting engine and FX decomposition", href: "/projects/trading-sim" },
        { name: "SQL · PostgreSQL", proof: "Three-layer medallion warehouse, more than 58,000 candles in production", href: "/projects/trading-sim" },
        { name: "dbt", proof: "89 quality tests that run before a single figure is published", href: "/projects/trading-sim#calidad" },
        { name: "DuckDB", proof: "Dimensional warehouse over 19 public sources resolved to municipal codes", href: "/research/fintech-inclusion#datos" },
        { name: "Git · GitHub Actions", proof: "Daily cron in operation, with a rate-limit circuit breaker", href: "/projects/trading-sim" },
        { name: "Panel econometrics", proof: "Two-way fixed effects over 228 observations, with wild cluster bootstrap (p = 0.89) and permutation placebo (p = 0.68)", href: "/research/fintech-inclusion#resultados" },
        { name: "Diagnostics and robustness", proof: "Driscoll-Kraay for measured cross-sectional dependence (p = 0.014), CCE, SLX and four designs against exogeneity", href: "/research/fintech-inclusion#metodo" },
        { name: "Machine learning", proof: "LightGBM over 1.96M SBA loans and 62.4M HMDA applications: AUC 0.7005, +0.0311 over the interpretable scorecard", href: "/projects/credit-risk" },
        { name: "Credit risk and scorecards", proof: "WoE binning with optbinning, out-of-time validation across the COVID shock, calibration error 0.0107", href: "/projects/credit-risk#cr-cliff" },
        { name: "Model governance (MLOps)", proof: "Ten promotion gates judged by exit code; one blocks my own model, and I did not move the threshold", href: "/projects/credit-risk" },
      ] as ProofRow[],
    },
    disclosures: {
      title: "Disclosures",
      items: [
        {
          term: "Built in public",
          text: "This site and the projects behind it are documented as they are made, and so are the mistakes. The engineering log carries every defect found and fixed, numbered one by one, with its root cause. Few portfolios publish that list. It is precisely what makes everything else verifiable.",
          href: FALLOS_LOG,
          hrefLabel: "See the defect log",
        },
        {
          term: "Past results",
          text: "The trading research shown here is a methodology demonstration, not investment advice.",
        },
        {
          term: "Verifiable figures",
          text: "Every number on this page comes from the pipeline or the public repository, and links to the artifact that proves it.",
        },
        {
          term: "Power BI report",
          text: "The report exists as a PBIP project in the public repository and opens for free in Power BI Desktop. There is no public embed because “Publish to web” needs a Pro licence on a work tenant and makes the dataset public.",
        },
        {
          term: "Analytics",
          text: "The site counts page views with Vercel Analytics: no cookies, no browser fingerprint and no personal data, served from this same domain. That is why there is no consent banner to dismiss.",
        },
        {
          term: "Languages",
          text: "Native Spanish · English B2 · Portuguese A2.",
        },
      ],
    },
    contact: {
      title: "Stop choosing between the one who reads the business and the one who builds the data.",
      body: "Open to remote Finance Data Analyst, Analytics Engineer and FP&A automation roles. Bogotá, GMT-5, full overlap with the US. I answer in English and Spanish, and I answer fast.",
      email: "Send an email",
      linkedin: "LinkedIn",
      github: "GitHub",
      kaggle: "Kaggle",
      // The email opens with the four fields it takes to reply with something
      // useful. A recruiter writing from a phone does not draft a job spec:
      // they fill blanks.
      mailSubject: "Role — Davirson Novoa",
      mailBody:
        "Hi Davirson,\n\nRole:\nCompany:\nWork mode and time zone:\nRange:\n\n",
      copy: "Copy email",
      copied: "Email copied",
      copyFail: "Select and copy:",
    },
    footer: {
      left: "Davirson Novoa · built in public",
      right: "Data refreshed daily by an automated pipeline",
    },
    notFound: {
      code: "404",
      title: "This page does not exist",
      body: "The link is broken or the route moved. Everything published is reachable from the home page.",
      home: "Go to the home page",
      cv: "Read the CV",
    },
  },
};
