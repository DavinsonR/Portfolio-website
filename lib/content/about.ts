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
          desc: "Sistemas de gestión financiera desde HQ: cierre, forecast y variaciones de SG&A en más de 15 países de América y el hemisferio oriental. 100% remoto.",
          tag: "FP&A",
        },
        {
          period: "2024 — 2026",
          title: "SLB · de practicante a especialista en 26 meses",
          desc: "Tesorería y facturación LATAM: análisis cambiario en Python, automatización que liberó ~10 horas al mes por analista — unas 60 en el equipo —, revenue recognition bajo SOX.",
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
      title: "Herramientas, con la prueba al lado",
      note: "Cada herramienta con el trabajo que la respalda. Todo lo que aparece aquí está corriendo hoy, no en un certificado.",
      rows: [
        { name: "Excel y modelado financiero", proof: "Cierre y forecast de SG&A para 12 países en Neoris EPAM" },
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
          text: "Este sitio y los proyectos detrás se documentan mientras se hacen, incluidos los errores. La bitácora de ingeniería registra 30 fallos encontrados y corregidos, numerados uno a uno.",
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
      title: "¿Buscas a alguien que entienda el negocio y construya los datos?",
      body: "Abierto a roles remotos de Finance Data Analyst, Analytics Engineer y FP&A con automatización. Respondo en español e inglés.",
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
          desc: "Financial management systems from HQ: close, forecast and SG&A variance across 15+ countries in the Americas and the Eastern Hemisphere. Fully remote.",
          tag: "FP&A",
        },
        {
          period: "2024 — 2026",
          title: "SLB · intern to specialist in 26 months",
          desc: "LATAM treasury and billing: FX analysis in Python, automation that freed ~10 hours a month per analyst — about 60 across the team —, revenue recognition under SOX.",
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
      title: "Tools, with the proof next to them",
      note: "Each tool with the work that backs it. Everything here is running today, not sitting on a certificate.",
      rows: [
        { name: "Excel and financial modelling", proof: "SG&A close and forecast across 12 countries at Neoris EPAM" },
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
          text: "This site and the projects behind it are documented as they are made, failures included. The engineering log records 30 defects found and fixed, numbered one by one.",
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
      title: "Hiring someone who reads the business and builds the data?",
      body: "Open to remote Finance Data Analyst, Analytics Engineer and FP&A automation roles. I answer in English and Spanish.",
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
