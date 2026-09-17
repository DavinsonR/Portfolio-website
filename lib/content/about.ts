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
      title: "Ocho herramientas. Ocho pruebas. Ninguna lista de logos.",
      note: "Cualquiera puede escribir «Python» en un CV. Aquí cada herramienta va con el trabajo que la respalda, y casi todo está corriendo hoy mismo — no reposando en un certificado.",
      rows: [
        { name: "Excel y modelado financiero", proof: "Cierre y forecast de SG&A para más de 15 países en Neoris EPAM" },
        { name: "Power BI", proof: "Modelo semántico de 7 tablas en TMDL, cargado contra Supabase", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard ganador del BodyTech Trends Hackathon, público", href: TABLEAU_VIZ },
        { name: "SQL · PostgreSQL", proof: "Warehouse medallion de tres capas, más de 58.000 velas en producción" },
        { name: "Python", proof: "Ingesta incremental, motor de backtesting, descomposición cambiaria" },
        { name: "dbt", proof: "89 pruebas de calidad que corren antes de publicar un dato" },
        { name: "Git · GitHub Actions", proof: "Cron diario en operación, con circuit breaker de rate limit" },
        { name: "Machine learning", proof: "Especialización de Stanford en Coursera, 2024" },
      ] as ProofRow[],
    },
    disclosures: {
      title: "Divulgaciones",
      items: [
        {
          term: "Construido en público",
          text: "Este sitio y los proyectos detrás se documentan mientras se hacen, y los errores también. La bitácora de ingeniería lleva 35 fallos encontrados y corregidos, numerados uno a uno, con su causa raíz. Pocos portafolios publican esa lista. Es justo la que hace verificable todo lo demás.",
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
      title: "Eight tools. Eight proofs. No logo wall.",
      note: "Anyone can type «Python» on a CV. Here every tool comes with the work that backs it, and nearly all of it is running today — not sitting on a certificate.",
      rows: [
        { name: "Excel and financial modelling", proof: "SG&A close and forecast across 15+ countries at Neoris EPAM" },
        { name: "Power BI", proof: "Seven-table semantic model in TMDL, loaded against Supabase", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard that won the BodyTech Trends Hackathon, public", href: TABLEAU_VIZ },
        { name: "SQL · PostgreSQL", proof: "Three-layer medallion warehouse, more than 58,000 candles in production" },
        { name: "Python", proof: "Incremental ingestion, backtesting engine, FX decomposition" },
        { name: "dbt", proof: "89 quality tests that run before a single figure is published" },
        { name: "Git · GitHub Actions", proof: "Daily cron in operation, with a rate-limit circuit breaker" },
        { name: "Machine learning", proof: "Stanford Specialization on Coursera, 2024" },
      ] as ProofRow[],
    },
    disclosures: {
      title: "Disclosures",
      items: [
        {
          term: "Built in public",
          text: "This site and the projects behind it are documented as they are made, and so are the mistakes. The engineering log carries 35 defects found and fixed, numbered one by one, with their root cause. Few portfolios publish that list. It is precisely what makes everything else verifiable.",
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
          text: "The report exists as a PBIP project in the public repository and opens for free in Power BI Desktop. There is no public embed because «Publish to web» needs a Pro licence on a work tenant and makes the dataset public.",
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
