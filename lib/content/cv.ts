// ============================================================
// GENERADO POR scripts/split-dictionaries.mjs — pero SÍ se edita a mano.
// Este es el sitio donde se cambian los textos del sitio, en los dos idiomas.
// El script solo hizo el corte inicial; no hay que volver a correrlo.
//
// INVARIANTE: `es` y `en` tienen exactamente la misma forma, incluidas las
// longitudes de los arrays. `npm run check:dict` es quien lo prueba — `tsc`
// no ve una lista más corta en un idioma.
// ============================================================
// El CV — de aquí salen también el .tex y el PDF

import { THESIS_REPO, TABLEAU_VIZ } from "./types";
import type { Award, ProofRow, Education, CvProject } from "./types";

export const cv = {
  es: {
    cv: {
      title: "Davirson Novoa Ramírez",
      // El "title mapping": los tres nombres con que las vacantes llaman al
      // mismo rol cruzado. Es el encabezado, no un subtítulo.
      targetsLabel: "Roles objetivo",
      targets: ["Finance Data Analyst", "Financial BI Analyst", "Analytics Engineer"],
      subtitle: "Economista y consultor FP&A que construye él mismo la infraestructura de datos que usa. Entre el negocio y el dato no necesito traductor.",
      metaLine: "Bogotá, Colombia · GMT-5 · 100% remoto · Inglés B2 · Portugués A2",
      download: "Descargar CV (PDF)",
      downloadHref: "/Davirson_Novoa_CV_ES.pdf",
      downloadShort: "Versión de 1 página",
      downloadShortHref: "/Davirson_Novoa_CV_ES_1p.pdf",
      downloadShortNote: "Una página para cribar; la completa tiene las tres.",
      latex: "Fuente LaTeX",
      latexHref: "/Davirson_Novoa_CV_ES.tex",
      latexNote: "Compilable en Overleaf sin instalar nada.",
      contactBtn: "Contacto",
      facts: [
        { value: "15+", label: "países en las operaciones que reporto, desde HQ" },
        { value: "60 h/mes", label: "de reporting devueltas al equipo (10 por analista)" },
        { value: "26 meses", label: "de practicante a especialista" },
        { value: "95 M", label: "registros de crédito modelados en un portátil" },
      ],
      profileLabel: "Perfil",
      profileText:
        "Economista con tres años dentro de finanzas corporativas — tesorería, facturación y FP&A — construyendo yo mismo los datos que el negocio necesita, no esperando a que alguien me los pase: Python, SQL y Power BI aplicados a operaciones en más de 15 países de América y el hemisferio oriental. En paralelo opero en producción un warehouse PostgreSQL con arquitectura medallion, transformaciones en dbt, 89 pruebas automáticas de calidad y un modelo semántico de Power BI, actualizado a diario sin que yo toque nada, y un sistema de decisión crediticia sobre 95 millones de registros con diez gates de gobierno de modelos. Todo verificable: cada cifra de mi sitio enlaza al repositorio que la produce. Busco un rol remoto donde el criterio financiero y la ingeniería de datos se paguen como una sola capacidad, no como dos mitades.",
      // Solo para la hoja de UNA pagina: ahi el lector escanea en treinta
      // segundos y el perfil largo se come el espacio de la experiencia — y
      // ademas empuja el documento a dos paginas, que es lo unico que esa
      // version no puede hacer. `check:artifacts` lo exige en 1.
      profileShortText:
        "Economista con tres años dentro de finanzas corporativas — tesorería, facturación y FP&A — construyendo yo mismo los datos que el negocio necesita: Python, SQL y Power BI sobre operaciones en más de 15 países de América y el hemisferio oriental. En paralelo opero un warehouse PostgreSQL con dbt, 89 pruebas automáticas de calidad y un modelo semántico de Power BI que se refresca solo a diario, y un sistema de decisión crediticia sobre 95 millones de registros con diez gates de gobierno. Cada cifra de mi sitio enlaza al repositorio que la produce.",
      pivot: {
        label: "El rol cruzado",
        shortBody: "No cambio de carrera: cobro por lo que ya hago. En cada rol financiero terminé construyendo código y datos porque el reporte que hacía falta no existía y nadie más lo iba a hacer. La ventaja no es saber Python — eso lo sabe muchísima gente. Es saber qué pregunta vale la pena responder antes de escribir la primera línea.",
        body: "No estoy cambiando de carrera: estoy cobrando por lo que ya hago. En cada rol financiero terminé construyendo lo mismo — código y datos — porque el reporte que hacía falta no existía y nadie más lo iba a hacer. Un análisis de descalces cambiarios en Python siendo practicante. Automatizaciones que devolvieron unas 10 horas al mes a cada analista de tesorería — cerca de 60 al mes en el equipo. Modelos de Power BI que convirtieron un cierre contable en una decisión. La ventaja no es saber Python; eso lo sabe muchísima gente. Es saber qué pregunta vale la pena responder antes de escribir la primera línea. Un Finance Data Analyst no es un analista de datos que aprendió finanzas, ni un financiero que aprendió a programar — es quien no necesita traductor entre los dos. Contratar a esa persona es contratar dos perfiles en uno, sin la reunión de traducción entre ellos.",
      },
      expLabel: "Experiencia",
      expTitle: "Experiencia",
      remoteTag: "remoto",
      hybridTag: "híbrido",
      experience: [
        {
          company: "Neoris EPAM",
          location: "Bogotá, Colombia",
          mode: "remote",
          roles: [
            {
              title: "Business Consultant, FP&A",
              period: "Mar 2026 — presente",
              bullets: [
                "Diseñé y lideré sistemas de gestión financiera para el cierre y el forecast de gastos SG&A en más de 15 países de América y el hemisferio oriental (India, Hungría, España, República Checa).",
                "Gestioné el cierre mensual y la confirmación del forecast a nivel compañía, analizando variaciones contra plan y forecast anterior.",
                "Di seguimiento a la variación cambiaria en moneda constante y a la inflación por moneda.",
                "Construí reporting FP&A con Excel avanzado, Power Query, Power BI, MicroStrategy, JD Edwards y SAP.",
              ],
            },
          ],
        },
        {
          company: "SLB",
          location: "Bogotá, Colombia",
          mode: "hybrid",
          note: "Progresión interna: de practicante a especialista en 26 meses.",
          roles: [
            {
              title: "Especialista en Facturación (Argentina & Brasil)",
              period: "Dic 2024 — Mar 2026",
              bullets: [
                "Ejecuté reconocimiento de ingresos en SAP bajo los requisitos de Sarbanes-Oxley (SOX).",
                "Desarrollé modelos y visualizaciones en Power BI para análisis de ingresos y tendencias.",
                "Realicé auditorías internas en proyectos tecnológicos integrados, asegurando trazabilidad y cumplimiento.",
              ],
            },
            {
              title: "Analista de Tesorería",
              period: "Oct 2024 — Dic 2024",
              bullets: [
                "Automaticé la conciliación bancaria en SAP, mejorando precisión y eficiencia.",
                "Eliminé cerca de 10 horas mensuales de reporting manual por analista — unas 60 horas al mes devueltas al equipo — optimizando y automatizando el proceso.",
                "Implementé flujos de trabajo automatizados con Power Automate.",
              ],
            },
            {
              title: "Practicante de Tesorería",
              period: "Ene 2024 — Jun 2024",
              bullets: [
                "Desarrollé en Python un análisis integral de descalces cambiarios en mercados latinoamericanos, identificando riesgos y oportunidades de cobertura.",
                "Construí dashboards en Power BI para proyección de flujo de caja en 15+ países.",
                "Automaticé reportes de transacciones bancarias en 10+ operaciones regionales.",
              ],
            },
          ],
        },
        {
          company: "LEE Javeriana",
          location: "Remoto",
          mode: "remote",
          roles: [
            {
              title: "Asistente de Investigación",
              period: "Jul 2023 — Dic 2023",
              bullets: [
                "Analicé datos del sistema educativo colombiano con enfoque en educación superior.",
                "Desarrollé dashboards en Power BI para visualización de resultados de investigación.",
                "Contribuí a estudios de evaluación de impacto mediante análisis estadístico.",
              ],
            },
          ],
        },
        {
          company: "Solidariamente (voluntariado)",
          location: "Remoto",
          mode: "remote",
          roles: [
            {
              title: "Analista de datos sociales",
              period: "Ene 2023 — Jul 2023",
              bullets: [
                "Entregué herramientas analíticas e insights para ONG en entornos multiculturales.",
                "Colaboré con equipos internacionales en iniciativas de impacto social basadas en datos.",
              ],
            },
          ],
        },
      ],
      projectsLabel: "Proyectos en producción",
      projectsNote: "Código abierto y verificable. Nada de esto es un ejercicio de curso.",
      projects: [
        {
          name: "credit-risk-mlops",
          role: "Sistema de decisión crediticia con gobierno de modelos — diseño y construcción",
          period: "2026 — en producción",
          href: "https://github.com/DavinsonR/credit-risk-mlops",
          hrefLabel: "github.com/DavinsonR/credit-risk-mlops",
          stack: [
            "Python", "LightGBM", "scikit-learn", "optbinning (WoE)", "MLflow",
            "ONNX", "DuckDB", "pandera", "Docker", "Power BI",
          ],
          bullets: [
            "Modelo en producción con AUC 0,7005 sobre 1,96 M de préstamos SBA 7(a) y 93,4 M de solicitudes HMDA: +0,0311 frente a una scorecard WoE interpretable, con error de calibración 0,0107.",
            "La primera medición dio 0,9461 y no era un modelo, era una fuga: «TermInMonths» se sobrescribe cuando el préstamo se liquida, así que el campo llevaba dentro el resultado. Quitarlo derrumba la ablación a 0,6621, y esa es la cifra que se publica.",
            "Diez gates de promoción juzgados por código de salida, y uno está diseñado para bloquear mi propio modelo cuando no cumple el umbral.",
            "El monitoreo detectó que la fuente cambió de vocabulario sin avisar: una variable dejó de significar lo mismo entre cortes y nadie se habría enterado sin el control.",
            "El artefacto ONNX de producción puntúa en el navegador del lector, sin servidor y sin que ningún dato salga de la página.",
          ],
        },
        {
          name: "JARVIS — app de seguimiento personal",
          role: "Producto propio — diseño, construcción y operación",
          period: "2026 — demo abierto",
          href: "https://jarvis-app-psi-sable.vercel.app/demo",
          hrefLabel: "demo público, sin cuenta",
          stack: ["Next.js 16", "React 19", "TypeScript", "Postgres (Supabase)", "RLS", "Tailwind", "PWA", "Vitest"],
          bullets: [
            "Modelo multiusuario en Postgres con política de fila en 34 tablas: la conversión exigió reconstruir 22 claves primarias que identificaban filas sin el usuario, y meter el usuario dentro de las claves foráneas para que el aislamiento no dependiera solo de la política.",
            "Ocho puertas en CI juzgadas por código de salida: tipos, formato, lint, 526 pruebas, build, auditoría de dependencias, un guardia que busca datos personales en el artefacto ya construido, y una prueba de humo que exige que el rol anónimo sea denegado en las 55 tablas y vistas.",
            "Demo público que corre las cinco pantallas reales sobre 120 días generados con semilla y no consulta la base ni una vez; una prueba recorre el grafo de importaciones en ejecución y falla si algún módulo alcanzable llega al cliente de datos.",
            "Registro del día en un formulario y un botón, con ocho escrituras independientes, borrador y cola de envío en el teléfono para sobrevivir a la pérdida de señal, y un lector de números propio porque un campo numérico del navegador guardaba los gastos divididos por mil.",
            "Gráficas en SVG escrito a mano, sin librería, con contraste validado en tema claro y oscuro y estados diferenciados por forma además de por color.",
          ],
        },
        {
          name: "market-data-medallion",
          role: "Plataforma de datos de mercado — diseño, construcción y operación",
          period: "2026 — en operación",
          href: "https://github.com/DavinsonR/market-data-medallion",
          hrefLabel: "github.com/DavinsonR/market-data-medallion",
          stack: [
            "PostgreSQL", "Arquitectura medallion", "dbt", "Python", "Prefect",
            "GitHub Actions", "Supabase", "Power BI (TMDL / PBIP)", "Next.js",
          ],
          bullets: [
            "Ingesta incremental por watermark desde 4 fuentes (Tiingo, Coinbase, Kraken, FX) hacia un warehouse PostgreSQL de tres capas: 48 activos y más de 58.000 velas, idempotente y reanudable.",
            "89 pruebas automáticas de calidad en dbt más 171 pruebas unitarias en Python; el pipeline falla antes de publicar un dato malo, no después.",
            "Motor de backtesting sin look-ahead con validación out-of-sample 70/30 sobre 1.392 variantes de estrategia: solo el 13% de las ganadoras in-sample sobrevivió a la ventana ciega.",
            "Descomposición cambiaria de ADRs latinoamericanos, separando el retorno de la empresa del movimiento de la divisa mediante la identidad (1+r_USD) × (1+r_FX) = (1+r_local).",
            "Orquestación diaria en GitHub Actions con circuit breaker de rate limit, sobre infraestructura de costo cero.",
          ],
        },
      ] as CvProject[],
      researchLabel: "Investigación",
      researchNote: "Investigación propia, construida en público con datos abiertos.",
      research: [
        {
          name: "Inclusión financiera y crecimiento regional en Colombia",
          role: "Tesis de Maestría en Economía, Javeriana — investigación reproducible de punta a punta",
          period: "2026 — en construcción",
          href: THESIS_REPO,
          hrefLabel: "repositorio en GitHub",
          stack: ["dbt", "DuckDB", "Python", "Parquet", "Datos de panel", "Quarto"],
          bullets: [
            "Descargador propio de datos abiertos con manifiesto verificable: diecinueve fuentes (Superintendencia Financiera, DANE, MinTIC, MEN, mapa nacional), conteo verificado contra la fuente, tipado por metadatos y sha256 por archivo.",
            "Warehouse dimensional en dbt sobre DuckDB: dimensiones de departamento, municipio y periodo, inclusión financiera en formato largo por bloque de producto, y pruebas que cuadran el total departamental con la suma de sus municipios.",
            "Claves geográficas resueltas al código DIVIPOLA con cobertura del 100 % en los 34 cortes trimestrales, y el empalme entre las dos tablas de la Superintendencia medido trimestre a trimestre.",
            "Índice de inclusión financiera por dimensiones y paneles anuales departamental y municipal, con una batería explícita contra la correlación espuria. Bitácora pública de errores y aciertos.",
          ],
        },
      ] as CvProject[],
      skillsLabel: "Habilidades",
      skillsFinTitle: "Dominio financiero",
      skillsFinDesc: "El contexto que los datos necesitan para significar algo.",
      skillsFin: [
        "FP&A", "Cierre y forecast", "SG&A", "Revenue recognition (SOX)", "Tesorería",
        "Análisis cambiario", "Presupuestos", "Moneda constante", "SAP", "JD Edwards", "MicroStrategy",
      ],
      skillsDataTitle: "Datos e ingeniería",
      skillsDataDesc: "Herramientas que corren hoy en un repositorio público, no en un certificado.",
      skillsData: [
        "SQL analítico", "PostgreSQL", "dbt", "Arquitectura medallion", "Python (pandas)",
        "ETL incremental", "Prefect", "GitHub Actions", "Supabase", "Power BI · DAX",
        "Power Query", "Tableau", "Git", "Next.js · Vercel",
      ],
      skillsTechTitle: "Stack técnico",
      skillsTechDesc: "Cada herramienta con el trabajo que la respalda.",
      skillsTech: [
        { name: "Excel y modelado financiero", proof: "Cierre y forecast de SG&A para más de 15 países en Neoris EPAM" },
        { name: "Power BI", proof: "Modelo semántico de 7 tablas en TMDL, cargado contra Supabase", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard ganador del BodyTech Trends Hackathon, público", href: TABLEAU_VIZ },
        { name: "SQL · PostgreSQL", proof: "Warehouse medallion de tres capas, más de 58.000 velas en producción" },
        { name: "Python", proof: "Ingesta incremental, motor de backtesting, descomposición cambiaria" },
        { name: "dbt", proof: "89 pruebas de calidad que corren antes de publicar un dato" },
        { name: "Git · GitHub Actions", proof: "Cron diario en operación, con circuit breaker de rate limit" },
        { name: "Machine learning", proof: "Especialización de Stanford en Coursera, 2024" },
      ] as ProofRow[],
      awardsLabel: "Reconocimientos",
      // Ojo: si el workbook se renombra en Tableau Public, la URL cambia y este
      // enlace hay que actualizarlo aquí (fuente única).
      awards: ([
        {
          title: "Ganador — BodyTech Trends Hackathon",
          year: "2024",
          desc: "Analítica de demanda de búsqueda para una cadena de gimnasios: 19.560 registros de keywords limpiados en Python y un tablero de tendencias por sede en Tableau. Sigue publicado y es consultable por cualquiera.",
          href: TABLEAU_VIZ,
          hrefLabel: "ver el tablero en Tableau Public",
        },
        { title: "Becario Ecopetrol — Programa Mario Galán Gómez", year: "2018", desc: "Beca por mérito académico y potencial de liderazgo." },
      ] as Award[]),
      eduLabel: "Educación y certificaciones",
      education: [
        {
          title: "Maestría en Economía", inst: "Pontificia Universidad Javeriana", period: "2025 — 2026",
          status: "research", statusText: "TESIS RADICADA",
          note: "Trabajo de grado radicado en agosto de 2026; grado previsto en noviembre de 2026. De ahí nace el proyecto de inclusión financiera que sigo construyendo en público.",
          href: "/research/fintech-inclusion", hrefLabel: "ver la investigación",
        },
        { title: "Pregrado en Economía", inst: "Pontificia Universidad Javeriana", period: "2020 — 2024", status: "live", statusText: "COMPLETADO" },
        { title: "Técnico en Sistemas", inst: "SENA", period: "2018", status: "live", statusText: "COMPLETADO" },
      ] as Education[],
      certs: [
        { title: "Especialización en Machine Learning", inst: "Stanford · Coursera", year: "2024" },
        { title: "Certificado de Ciberseguridad", inst: "Google · Coursera", year: "2024" },
        { title: "Ciencia de Datos con Python", inst: "Platzi", year: "2023" },
      ],
      remote: {
        label: "Preparado para remoto",
        points: [
          "3 roles remotos o híbridos con equipos distribuidos en 15+ países.",
          "GMT-5 (Bogotá): solapamiento completo con horarios de EE. UU. y Canadá.",
          "Experiencia trabajando con equipos de Norteamérica, Argentina y Brasil.",
          "Español nativo · Inglés B2 · Portugués A2.",
        ],
      },
    },
  },
  en: {
    cv: {
      title: "Davirson Novoa Ramírez",
      // The title mapping: the three names job posts give the same crossover
      // role. It is the heading, not a subtitle.
      targetsLabel: "Target roles",
      targets: ["Finance Data Analyst", "Financial BI Analyst", "Analytics Engineer"],
      subtitle: "Economist and FP&A consultant who builds the data infrastructure he works from. Between the business and the data, I need no translator.",
      metaLine: "Bogotá, Colombia · GMT-5 · Fully remote · English B2 · Portuguese A2",
      download: "Download resume (PDF)",
      downloadHref: "/Davirson_Novoa_Resume_EN.pdf",
      downloadShort: "One-page version",
      downloadShortHref: "/Davirson_Novoa_Resume_EN_1p.pdf",
      downloadShortNote: "One page to screen from; the full one has all three.",
      latex: "LaTeX source",
      latexHref: "/Davirson_Novoa_Resume_EN.tex",
      latexNote: "Compiles in Overleaf with nothing to install.",
      contactBtn: "Contact",
      facts: [
        { value: "15+", label: "countries in the operations I report on, from HQ" },
        { value: "60 hrs/mo", label: "of reporting given back to the team (10 per analyst)" },
        { value: "26 months", label: "from intern to specialist" },
        { value: "95 M", label: "credit records modelled on a laptop" },
      ],
      profileLabel: "Profile",
      profileText:
        "Economist with three years inside corporate finance — treasury, billing and FP&A — building the data the business runs on rather than waiting for someone to hand it over: Python, SQL and Power BI applied to operations across 15+ countries in the Americas and the Eastern Hemisphere. Alongside that I run a production PostgreSQL warehouse in medallion architecture, with dbt transformations, 89 automated quality tests and a Power BI semantic model, refreshed daily with no manual step, plus a credit decisioning system over 95 million records with ten model-governance gates. All of it verifiable: every figure on my site links to the repository that produces it. I am looking for a remote role where financial judgment and data engineering are paid as one capability, not two halves.",
      // One-page sheet only: see the Spanish note above.
      profileShortText:
        "Economist with three years inside corporate finance — treasury, billing and FP&A — building the data the business runs on myself: Python, SQL and Power BI over operations across 15+ countries in the Americas and the Eastern Hemisphere. Alongside it I run a PostgreSQL warehouse with dbt, 89 automated quality tests and a Power BI semantic model that refreshes itself daily, plus a credit decisioning system over 95 million records with ten governance gates. Every figure on my site links to the repository that produces it.",
      pivot: {
        label: "The crossover role",
        shortBody: "Not a career change: I am pricing what I already do. In every finance role I ended up building code and data because the report the business needed did not exist and nobody else was going to build it. The edge is not knowing Python — plenty of people do. It is knowing which question is worth answering before writing the first line.",
        body: "This is not a career change; it is pricing what I already do. In every finance role I ended up building the same thing — code and data — because the report the business needed did not exist and nobody else was going to build it. An FX mismatch analysis in Python as an intern. Automation that gave every treasury analyst about 10 hours a month back — close to 60 a month across the team. Power BI models that turned a monthly close into a decision. The edge is not knowing Python; plenty of people know Python. It is knowing which question is worth answering before writing the first line. A Finance Data Analyst is neither a data analyst who picked up finance nor a finance person who picked up code — it is the one who needs no translator between them. Hiring that person is hiring two profiles in one, without the handoff meeting between them.",
      },
      expLabel: "Experience",
      expTitle: "Experience",
      remoteTag: "remote",
      hybridTag: "hybrid",
      experience: [
        {
          company: "Neoris EPAM",
          location: "Bogotá, Colombia",
          mode: "remote",
          roles: [
            {
              title: "Business Consultant, FP&A",
              period: "Mar 2026 — present",
              bullets: [
                "Designed and led financial management systems for SG&A close and forecast across 15+ countries in the Americas and the Eastern Hemisphere (India, Hungary, Spain, Czech Republic).",
                "Managed monthly close and company-wide forecast confirmation, analyzing variances against plan and prior forecast.",
                "Tracked FX variance in constant currency and per-currency inflation.",
                "Built FP&A reporting with advanced Excel, Power Query, Power BI, MicroStrategy, JD Edwards and SAP.",
              ],
            },
          ],
        },
        {
          company: "SLB",
          location: "Bogotá, Colombia",
          mode: "hybrid",
          note: "Internal progression: intern to specialist in 26 months.",
          roles: [
            {
              title: "Billing Specialist (Argentina & Brazil)",
              period: "Dec 2024 — Mar 2026",
              bullets: [
                "Executed revenue recognition in SAP under Sarbanes-Oxley (SOX) requirements.",
                "Built Power BI models and visualizations for revenue and trend analysis.",
                "Performed internal audits on integrated technology projects, ensuring traceability and compliance.",
              ],
            },
            {
              title: "Treasury Analyst",
              period: "Oct 2024 — Dec 2024",
              bullets: [
                "Automated bank reconciliation in SAP, improving accuracy and efficiency.",
                "Cut roughly 10 hours of manual reporting per analyst per month — about 60 hours a month back to the team — by optimizing and automating the process.",
                "Implemented automated workflows with Power Automate.",
              ],
            },
            {
              title: "Treasury Intern",
              period: "Jan 2024 — Jun 2024",
              bullets: [
                "Built a comprehensive FX mismatch analysis for Latin American markets in Python, identifying financial risks and hedging opportunities.",
                "Created Power BI dashboards for cash-flow projections across 15+ countries.",
                "Automated bank transaction reporting across 10+ regional operations.",
              ],
            },
          ],
        },
        {
          company: "LEE Javeriana",
          location: "Remote",
          mode: "remote",
          roles: [
            {
              title: "Research Assistant",
              period: "Jul 2023 — Dec 2023",
              bullets: [
                "Analyzed Colombian education-system data with a focus on higher education.",
                "Built Power BI dashboards to visualize research findings.",
                "Contributed to impact-evaluation studies through statistical analysis.",
              ],
            },
          ],
        },
        {
          company: "Solidariamente (volunteer)",
          location: "Remote",
          mode: "remote",
          roles: [
            {
              title: "Social Data Analyst",
              period: "Jan 2023 — Jul 2023",
              bullets: [
                "Delivered analytical tools and insights for NGOs in multicultural environments.",
                "Collaborated with international teams on data-driven social-impact initiatives.",
              ],
            },
          ],
        },
      ],
      projectsLabel: "Production projects",
      projectsNote: "Open source and checkable. None of this is a course exercise.",
      projects: [
        {
          name: "credit-risk-mlops",
          role: "Credit decisioning system with model governance — design and build",
          period: "2026 — in production",
          href: "https://github.com/DavinsonR/credit-risk-mlops",
          hrefLabel: "github.com/DavinsonR/credit-risk-mlops",
          stack: [
            "Python", "LightGBM", "scikit-learn", "optbinning (WoE)", "MLflow",
            "ONNX", "DuckDB", "pandera", "Docker", "Power BI",
          ],
          bullets: [
            "Production model at AUC 0.7005 over 1.96M SBA 7(a) loans and 93.4M HMDA applications: +0.0311 over an interpretable WoE scorecard, with calibration error 0.0107.",
            "The first reading was 0.9461, and it was not a model but a leak: TermInMonths is overwritten when a loan is liquidated, so the field carried the outcome. Removing it drops the ablation to 0.6621 — and that is the number published.",
            "Ten promotion gates judged by exit code, one of them designed to block my own model when it misses the threshold.",
            "Monitoring caught the source changing its vocabulary without notice: a field stopped meaning the same thing between vintages, and nobody would have known without the control.",
            "The production ONNX artifact scores in the reader's own browser — no server, and no data leaves the page.",
          ],
        },
        {
          name: "JARVIS — personal tracking app",
          role: "Own product — designed, built and operated",
          period: "2026 — open demo",
          href: "https://jarvis-app-psi-sable.vercel.app/demo",
          hrefLabel: "public demo, no account",
          stack: ["Next.js 16", "React 19", "TypeScript", "Postgres (Supabase)", "RLS", "Tailwind", "PWA", "Vitest"],
          bullets: [
            "Multi-user model on Postgres with a row policy on 34 tables: the conversion required rebuilding 22 primary keys that identified rows without the user, and pushing the user inside the foreign keys so isolation did not rest on the policy alone.",
            "Eight CI gates judged by exit code: types, format, lint, 526 tests, build, dependency audit, a guard that hunts personal data inside the built artifact, and a smoke test requiring the anonymous role to be denied across all 55 tables and views.",
            "A public demo running the five real screens over 120 seed-generated days that never queries the database; a test walks the runtime import graph and fails if any reachable module gets to the data client.",
            "Day logging in one form and one button, with eight independent writes, an on-device draft and send queue to survive losing signal, and a purpose-built number reader because a browser number field was storing expenses divided by a thousand.",
            "Hand-written SVG charts, no library, with contrast validated in light and dark and states separated by shape as well as color.",
          ],
        },
        {
          name: "market-data-medallion",
          role: "Market data platform — designed, built and operated",
          period: "2026 — in operation",
          href: "https://github.com/DavinsonR/market-data-medallion",
          hrefLabel: "github.com/DavinsonR/market-data-medallion",
          stack: [
            "PostgreSQL", "Medallion architecture", "dbt", "Python", "Prefect",
            "GitHub Actions", "Supabase", "Power BI (TMDL / PBIP)", "Next.js",
          ],
          bullets: [
            "Watermark-based incremental ingestion from 4 sources (Tiingo, Coinbase, Kraken, FX) into a three-layer PostgreSQL warehouse: 48 assets and more than 58,000 candles, idempotent and resumable.",
            "89 automated dbt data-quality tests plus 171 Python unit tests; the pipeline fails before publishing bad data, not after.",
            "No-look-ahead backtesting engine with 70/30 out-of-sample validation over 1,392 strategy variants: only 13% of the in-sample winners survived the blind window.",
            "FX decomposition for Latin American ADRs, separating company performance from the currency move through the identity (1+r_USD) × (1+r_FX) = (1+r_local).",
            "Daily orchestration on GitHub Actions with a rate-limit circuit breaker, running on zero-cost infrastructure.",
          ],
        },
      ] as CvProject[],
      researchLabel: "Research",
      researchNote: "My own research, built in public on open data.",
      research: [
        {
          name: "Financial inclusion and regional growth in Colombia",
          role: "M.Sc. in Economics thesis, Javeriana — reproducible research end to end",
          period: "2026 — building",
          href: THESIS_REPO,
          hrefLabel: "repository on GitHub",
          stack: ["dbt", "DuckDB", "Python", "Parquet", "Panel data", "Quarto"],
          bullets: [
            "Purpose-built open-data downloader with a verifiable manifest: nineteen sources (financial supervisor, statistics office, ICT and education ministries, national map), row counts verified against the source, metadata-driven typing and a sha256 per file.",
            "Dimensional warehouse in dbt on DuckDB: department, municipality and period dimensions, financial inclusion in long form by product block, and tests that reconcile each department total with the sum of its municipalities.",
            "Geographic keys resolved to the municipal code with 100% coverage across the 34 quarterly cuts, and the splice between the supervisor's two tables measured quarter by quarter.",
            "A financial-inclusion index by dimension and annual panels at department and municipality level, with an explicit battery against spurious correlation. Public logbook of mistakes and wins.",
          ],
        },
      ] as CvProject[],
      skillsLabel: "Skills",
      skillsFinTitle: "Finance domain",
      skillsFinDesc: "The context data needs in order to mean something.",
      skillsFin: [
        "FP&A", "Close & forecast", "SG&A", "Revenue recognition (SOX)", "Treasury",
        "FX analysis", "Budgeting", "Constant currency", "SAP", "JD Edwards", "MicroStrategy",
      ],
      skillsDataTitle: "Data & engineering",
      skillsDataDesc: "Tools running today in a public repository, not on a certificate.",
      skillsData: [
        "Analytical SQL", "PostgreSQL", "dbt", "Medallion architecture", "Python (pandas)",
        "Incremental ETL", "Prefect", "GitHub Actions", "Supabase", "Power BI · DAX",
        "Power Query", "Tableau", "Git", "Next.js · Vercel",
      ],
      skillsTechTitle: "Technical stack",
      skillsTechDesc: "Each tool with the work that backs it.",
      skillsTech: [
        { name: "Excel and financial modelling", proof: "SG&A close and forecast across 15+ countries at Neoris EPAM" },
        { name: "Power BI", proof: "Seven-table semantic model in TMDL, loaded against Supabase", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard that won the BodyTech Trends Hackathon, public", href: TABLEAU_VIZ },
        { name: "SQL · PostgreSQL", proof: "Three-layer medallion warehouse, more than 58,000 candles in production" },
        { name: "Python", proof: "Incremental ingestion, backtesting engine, FX decomposition" },
        { name: "dbt", proof: "89 quality tests that run before a single figure is published" },
        { name: "Git · GitHub Actions", proof: "Daily cron in operation, with a rate-limit circuit breaker" },
        { name: "Machine learning", proof: "Stanford Specialization on Coursera, 2024" },
      ] as ProofRow[],
      awardsLabel: "Recognition",
      awards: ([
        {
          title: "Winner — BodyTech Trends Hackathon",
          year: "2024",
          desc: "Search-demand analytics for a gym chain: 19,560 keyword records cleaned in Python and a branch-by-branch trend dashboard in Tableau. Still published and open to anyone.",
          href: TABLEAU_VIZ,
          hrefLabel: "see the dashboard on Tableau Public",
        },
        { title: "Ecopetrol Scholar — Mario Galán Gómez Program", year: "2018", desc: "Scholarship for academic merit and leadership potential." },
      ] as Award[]),
      eduLabel: "Education & certifications",
      education: [
        {
          title: "M.Sc. in Economics", inst: "Pontificia Universidad Javeriana", period: "2025 — 2026",
          status: "research", statusText: "THESIS FILED",
          note: "Thesis filed in August 2026; graduation expected in November 2026. It is the origin of the financial-inclusion project I keep building in public.",
          href: "/research/fintech-inclusion", hrefLabel: "see the research",
        },
        { title: "B.Sc. in Economics", inst: "Pontificia Universidad Javeriana", period: "2020 — 2024", status: "live", statusText: "COMPLETED" },
        { title: "Systems Technician", inst: "SENA", period: "2018", status: "live", statusText: "COMPLETED" },
      ] as Education[],
      certs: [
        { title: "Machine Learning Specialization", inst: "Stanford · Coursera", year: "2024" },
        { title: "Cybersecurity Certificate", inst: "Google · Coursera", year: "2024" },
        { title: "Data Science with Python", inst: "Platzi", year: "2023" },
      ],
      remote: {
        label: "Remote-ready",
        points: [
          "3 remote or hybrid roles with teams distributed across 15+ countries.",
          "GMT-5 (Bogotá): full overlap with US and Canadian hours.",
          "Experience working with teams in North America, Argentina and Brazil.",
          "Native Spanish · English B2 · Portuguese A2.",
        ],
      },
    },
  },
};
