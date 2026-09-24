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

import { THESIS_REPO, TABLEAU_VIZ, TABLEAU_SHOT } from "./types";
import type { Award, ProofRow, Education, CvProject } from "./types";

export const cv = {
  es: {
    cv: {
      title: "Davirson Novoa Ramírez",
      // El "title mapping": los tres nombres con que las vacantes llaman al
      // mismo rol cruzado. Es el encabezado, no un subtítulo.
      targetsLabel: "Roles objetivo",
      targets: ["Finance Data Analyst", "Financial BI Analyst", "Analytics Engineer"],
      subtitle: "Encuentro la variación, llego a su causa raíz, dejo el control corriendo solo y lo explico donde se decide. Las cuatro cosas, sin traductor entre el negocio y el dato.",
      // «Inglés B2» estaba tres centímetros debajo del nombre, antes de toda la
      // evidencia de uso: un screener no técnico lo lee como «no fluido». El nivel
      // sigue publicado en «Preparado para remoto» y en Divulgaciones, junto a lo
      // que lo respalda.
      metaLine: "Bogotá, Colombia · GMT-5 · 100% remoto · Inglés de trabajo a diario con EE. UU. y Europa · Español nativo",
      // La <meta name="description"> de /cv. Antes se derivaba recortando
      // `profileText` a 155 caracteres, y el corte caía a mitad de palabra.
      metaDesc: "CV de Davirson Novoa, Finance Data Analyst: dueño del cierre FP&A de 15+ países y constructor de plataformas de datos en producción. Remoto, GMT-5.",
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
        { value: "15+", label: "países cuyo cierre y forecast de SG&A controlo, desde HQ" },
        { value: "60 h/mes", label: "de trabajo manual eliminadas en tesorería (10 por analista)" },
        { value: "2 ascensos", label: "en 26 meses en SLB, hasta liderar a un practicante" },
        // «procesados», no «modelados»: 93,4 M son la ventana del estudio de
        // evento y 1,96 M los préstamos SBA; el modelo entrena sobre 62,4 M.
        { value: "95 M", label: "registros de crédito procesados en un portátil" },
      ],
      profileLabel: "Perfil",
      profileText:
        "Finance Data Analyst y dueño del proceso de cierre y forecast de SG&A de más de 15 países de América y Europa, desde HQ. Economista formado en tesorería, facturación bajo SOX y FP&A, que construye los datos que el negocio necesita en vez de esperarlos: Python, SQL y Power BI sobre operaciones reales. En paralelo opero en producción un warehouse PostgreSQL con arquitectura medallion, transformaciones en dbt, 89 pruebas automáticas de calidad y un modelo semántico de Power BI que se actualiza solo a diario, y desplegué un sistema de decisión crediticia sobre 95 millones de registros con diez gates de gobierno de modelos. Todo verificable: cada cifra de mi sitio enlaza al repositorio que la produce. Traigo el criterio financiero y la ingeniería de datos en una sola contratación: sin traductor y sin la reunión de traspaso.",
      // Solo para la hoja de UNA pagina: ahi el lector escanea en treinta
      // segundos y el perfil largo se come el espacio de la experiencia — y
      // ademas empuja el documento a dos paginas, que es lo unico que esa
      // version no puede hacer. `check:artifacts` lo exige en 1.
      profileShortText:
        "Finance Data Analyst y dueño del cierre y forecast de SG&A de más de 15 países, desde HQ. Economista formado en tesorería, facturación bajo SOX y FP&A, que construye los datos que el negocio necesita en vez de esperarlos: Python, SQL y Power BI sobre operaciones reales. En paralelo opero un warehouse PostgreSQL con dbt, 89 pruebas automáticas de calidad y un modelo semántico de Power BI que se refresca solo a diario, y un sistema de decisión crediticia sobre 95 millones de registros con diez gates de gobierno. Cada cifra de mi sitio enlaza al repositorio que la produce.",
      pivot: {
        label: "El rol cruzado",
        shortBody: "Cobro por lo que llevo haciendo en cada rol financiero: construir el dato que el negocio necesita y que nadie más iba a construir. La ventaja no es saber Python — eso lo sabe muchísima gente. Es saber qué pregunta vale la pena responder antes de escribir la primera línea.",
        body: "Cobro por lo que llevo haciendo en cada rol financiero: en todos terminé construyendo lo mismo — código y datos — porque el reporte que el negocio necesitaba no existía y nadie más lo iba a construir. Un análisis de descalces cambiarios en Python que nadie había pedido, siendo practicante. Automatizaciones que devolvieron unas 10 horas al mes a cada analista de tesorería — cerca de 60 al mes en el equipo. Modelos de Power BI que convirtieron un cierre contable en una decisión. La ventaja no es saber Python; eso lo sabe muchísima gente. Es saber qué pregunta vale la pena responder antes de escribir la primera línea. Un Finance Data Analyst no es un analista de datos que aprendió finanzas, ni un financiero que aprendió a programar — es quien no necesita traductor entre los dos. Contratar a esa persona son dos contrataciones en una, sin la reunión de traspaso entre ellas.",
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
                "Dueño del proceso de cierre y forecast de gastos SG&A de más de 15 países de América y el hemisferio oriental (India, Hungría, España, República Checa), desde HQ.",
                "Respondo por el cierre mensual y la confirmación del forecast a nivel compañía, y explico cada variación contra plan y contra forecast anterior.",
                "Aíslo el efecto cambiario en moneda constante y la inflación por moneda, para que la variación operativa se lea limpia.",
                "Construí el reporting FP&A sobre Excel avanzado, Power Query, Power BI, MicroStrategy, JD Edwards y SAP.",
              ],
            },
          ],
        },
        {
          company: "SLB",
          location: "Bogotá, Colombia",
          mode: "hybrid",
          note: "Dos ascensos en 26 meses: de tesorería a especialista de facturación para Argentina y Brasil, con un practicante a cargo.",
          roles: [
            {
              title: "Especialista en Facturación (Argentina & Brasil)",
              period: "Dic 2024 — Mar 2026",
              bullets: [
                "Responsable del reconocimiento de ingresos en SAP para Argentina y Brasil bajo controles Sarbanes-Oxley (SOX).",
                "Supervisé y formé a un practicante del equipo de facturación.",
                "Construí modelos y visualizaciones en Power BI para análisis de ingresos y tendencias.",
                "Audité proyectos tecnológicos integrados, con trazabilidad de punta a punta y cumplimiento.",
              ],
            },
            {
              title: "Analista de Tesorería",
              period: "Oct 2024 — Dic 2024",
              bullets: [
                "Devolví cerca de 60 horas al mes al equipo — unas 10 por analista — automatizando el reporting manual de tesorería.",
                "Automaticé la conciliación bancaria en SAP y la llevé a flujos de trabajo en Power Automate.",
              ],
            },
            {
              title: "Practicante de Tesorería",
              period: "Ene 2024 — Jun 2024",
              bullets: [
                "Detecté y cuantifiqué en Python los descalces cambiarios de los mercados latinoamericanos, identificando riesgos y oportunidades de cobertura.",
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
                "Modelé datos del sistema de educación superior colombiano para estudios de evaluación de impacto.",
                "Publiqué los resultados de la investigación en dashboards de Power BI.",
              ],
            },
          ],
        },
      ],
      projectsLabel: "Proyectos en operación",
      projectsNote: "Código abierto y verificable. Nada de esto es un ejercicio de curso.",
      projects: [
        {
          name: "credit-risk-mlops",
          role: "Sistema de decisión crediticia con gobierno de modelos — diseño y construcción",
          period: "2026 — desplegado, puntúa en vivo",
          href: "https://github.com/DavinsonR/credit-risk-mlops",
          hrefLabel: "github.com/DavinsonR/credit-risk-mlops",
          stack: [
            "Python", "LightGBM", "scikit-learn", "optbinning (WoE)", "MLflow",
            "ONNX", "DuckDB", "pandera", "Docker", "Power BI",
          ],
          bullets: [
            "Rechazar el 10% más riesgoso de la cartera de prueba habría evitado 276,3 M USD en castigos — 2,15 veces lo que logra un rechazo al azar — y el reporte publica también el contrapeso: 1.990 M USD de crédito sano que se renuncia.",
            "Modelo desplegado con AUC 0,7005 sobre 1,96 M de préstamos SBA 7(a) y 62,4 M de solicitudes HMDA: +0,0311 frente a una scorecard WoE interpretable, con error de calibración 0,0107. El estudio de evento corre aparte, sobre 93,4 M de solicitudes.",
            "La primera medición dio 0,9461 y no era un modelo, era una fuga: «TermInMonths» se sobrescribe cuando el préstamo se liquida, así que el campo llevaba dentro el resultado. Quitarlo derrumba la ablación a 0,6621, y esa es la cifra que se publica.",
            "Diez gates de promoción juzgados por código de salida, y uno está diseñado para bloquear mi propio modelo cuando no cumple el umbral.",
            "El monitoreo detectó que la fuente cambió de vocabulario sin avisar: una variable dejó de significar lo mismo entre cortes y nadie se habría enterado sin el control.",
            "El artefacto ONNX de producción puntúa en el navegador del lector, sin servidor y sin que ningún dato salga de la página.",
          ],
        },
        {
          name: "market-data-medallion",
          role: "Plataforma de datos de mercado — diseño, construcción y operación",
          period: "2026 — en operación diaria",
          href: "https://github.com/DavinsonR/market-data-medallion",
          hrefLabel: "github.com/DavinsonR/market-data-medallion",
          stack: [
            "PostgreSQL", "Arquitectura medallion", "dbt", "Python", "Prefect",
            "GitHub Actions", "Supabase", "Power BI (TMDL / PBIP)", "Next.js",
          ],
          bullets: [
            "Ingesta incremental por watermark desde 4 fuentes (Tiingo, Coinbase, Kraken, FX) hacia un warehouse PostgreSQL de tres capas: 48 activos y más de 58.000 velas, idempotente y reanudable.",
            "89 pruebas automáticas de calidad en dbt más 171 pruebas unitarias en Python; el pipeline falla antes de publicar un dato malo, no después.",
            "Motor de backtesting sin look-ahead con validación out-of-sample 70/30 sobre 1.392 variantes de estrategia: menos de una de cada seis ganadoras in-sample sobrevivió a la ventana ciega.",
            "Descomposición cambiaria de ADRs latinoamericanos, separando el retorno de la empresa del movimiento de la divisa mediante la identidad (1+r_USD) × (1+r_FX) = (1+r_local).",
            "Orquestación diaria en GitHub Actions con circuit breaker de rate limit, sobre infraestructura de costo cero.",
          ],
        },
        {
          name: "JARVIS — producto multiusuario con datos sensibles",
          role: "Producto propio — diseño, construcción y operación",
          period: "2026 — en producción · demo abierto",
          href: "https://jarvis-app-psi-sable.vercel.app/demo",
          hrefLabel: "demo público, sin cuenta",
          stack: ["Next.js 16", "React 19", "TypeScript", "Postgres (Supabase)", "RLS", "Tailwind", "PWA", "Vitest"],
          bullets: [
            "Modelo multiusuario en Postgres con política de fila en 34 tablas: la conversión exigió reconstruir 22 claves primarias que identificaban filas sin el usuario, y meter el usuario dentro de las claves foráneas para que el aislamiento no dependiera solo de la política.",
            "Ocho puertas en CI juzgadas por código de salida: tipos, formato, lint, 526 pruebas, build, auditoría de dependencias, un guardia que busca datos personales en el artefacto ya construido, y una prueba de humo que exige que el rol anónimo sea denegado en las 55 tablas y vistas.",
            "Demo público que corre las cinco pantallas reales sobre 120 días generados con semilla y no consulta la base ni una vez; una prueba recorre el grafo de importaciones en ejecución y falla si algún módulo alcanzable llega al cliente de datos.",
            "Registro del día en un formulario y un botón, con ocho escrituras independientes, borrador y cola de envío en el teléfono para sobrevivir a la pérdida de señal, y un lector de números propio porque un campo numérico del navegador guardaba los gastos divididos por mil.",
          ],
        },
      ] as CvProject[],
      researchLabel: "Investigación",
      researchNote: "Investigación propia, construida en público con datos abiertos.",
      research: [
        {
          name: "Inclusión financiera y crecimiento regional en Colombia",
          role: "Tesis de Maestría en Economía, Javeriana — investigación reproducible de punta a punta",
          period: "2026 — tesis radicada",
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
      skillsFinDesc: "Lo que convierte un dato en una decisión de negocio.",
      skillsFin: [
        "FP&A", "Cierre y forecast", "SG&A", "Revenue recognition (SOX)", "Tesorería",
        "Análisis cambiario", "Presupuestos", "Moneda constante", "SAP", "JD Edwards", "MicroStrategy",
        // Los términos por los que filtra un ATS de FP&A. Las viñetas de arriba
        // describen exactamente esto con otras palabras.
        "Análisis de variaciones", "Cierre mensual", "Proyección de flujo de caja", "Reporting gerencial", "Conciliación de cuentas",
      ],
      skillsDataTitle: "Datos e ingeniería",
      skillsDataDesc: "Herramientas que corren hoy en un repositorio público, no en un certificado.",
      skillsData: [
        "SQL analítico", "PostgreSQL", "DuckDB", "dbt", "Arquitectura medallion", "Python (pandas)",
        "ETL incremental", "Prefect", "GitHub Actions", "Supabase", "Power BI · DAX",
        "Power Query", "Tableau", "Git", "Next.js · Vercel",
        "Econometría de panel", "Efectos fijos", "Inferencia causal", "Series de tiempo",
        "Scorecards de crédito (WoE)", "LightGBM", "MLflow", "ONNX", "MLOps", "Pruebas de datos",
        "Data warehousing", "Modelado dimensional (esquema estrella)", "ELT", "CI/CD", "Dashboards",
      ],
      skillsTechTitle: "Stack técnico",
      skillsTechDesc: "Cada herramienta enlaza al trabajo exacto donde la usé.",
      skillsTech: [
        { name: "Análisis financiero y FP&A", proof: "Cierre y forecast de SG&A en más de 15 países: variaciones contra plan y en moneda constante" },
        { name: "SAP", proof: "Reconocimiento de ingresos bajo SOX y conciliación bancaria automatizada, en SLB" },
        { name: "Excel y modelado financiero", proof: "El cierre y el forecast de esos 15+ países, en Neoris EPAM" },
        { name: "Power BI", proof: "Modelo semántico de 7 tablas en TMDL y 17 medidas DAX, versionado como texto", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard ganador del BodyTech Trends Hackathon, público", href: TABLEAU_VIZ },
        { name: "Python", proof: "Ingesta incremental, motor de backtesting, descomposición cambiaria" },
        { name: "SQL · PostgreSQL", proof: "Warehouse medallion de tres capas, más de 58.000 velas en producción" },
        { name: "dbt", proof: "89 pruebas de calidad que corren antes de publicar un dato" },
        { name: "DuckDB", proof: "Warehouse dimensional de 19 fuentes públicas resueltas a código DIVIPOLA" },
        { name: "Git · GitHub Actions", proof: "Cron diario en operación, con circuit breaker de rate limit" },
        { name: "Econometría de panel", proof: "Efectos fijos de dos vías sobre 228 observaciones, bootstrap salvaje por clúster y placebo por permutación" },
        { name: "Diagnóstico y robustez", proof: "Dependencia transversal medida, CCE, SLX, tendencias previas, bootstrap salvaje con error agrupado y corrección de Holm" },
        { name: "Machine learning", proof: "LightGBM sobre 1,96 M de préstamos SBA y 62,4 M de solicitudes HMDA: AUC 0,7005, +0,0311 sobre la scorecard interpretable" },
        { name: "Riesgo de crédito y scorecards", proof: "Binning WoE con optbinning, validación out-of-time sobre el shock COVID, error de calibración 0,0107" },
        { name: "Gobierno de modelos (MLOps)", proof: "Diez gates de promoción juzgados por código de salida; uno bloquea mi propio modelo" },
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
          image: TABLEAU_SHOT,
          imageAlt: "Tablero de Tableau con la estimación del ingreso promedio por cliente entre 2022 y 2025, la ocurrencia de búsquedas por mes y seis tendencias de keywords.",
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
      ] as Education[],
      certs: [
        { title: "Especialización en Machine Learning", inst: "Stanford · Coursera", year: "2024" },
        { title: "Certificado de Ciberseguridad", inst: "Google · Coursera", year: "2024" },
      ],
      remote: {
        label: "Preparado para remoto",
        points: [
          "Toda mi experiencia es remota o híbrida, con equipos distribuidos en 15+ países.",
          "GMT-5 (Bogotá): tu horario de EE. UU. y Canadá, completo.",
          "Inglés de trabajo a diario con equipos de EE. UU. y Europa (Hungría, República Checa, España), y con Argentina y Brasil.",
          "Español nativo · Portugués A2.",
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
      subtitle: "I find the variance, I trace it to root cause, I leave the control running itself, and I explain it where the decision gets made. All four, with no translator between the business and the data.",
      metaLine: "Bogotá, Colombia · GMT-5 · Fully remote · Daily working English with US and European teams · Native Spanish",
      metaDesc: "CV of Davirson Novoa, Finance Data Analyst: owns the FP&A close for 15+ countries and builds production data platforms. Remote, GMT-5.",
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
        { value: "15+", label: "countries whose SG&A close and forecast I own, from HQ" },
        { value: "60 hrs/mo", label: "of manual treasury work eliminated (10 per analyst)" },
        { value: "2 promotions", label: "in 26 months at SLB, up to leading an intern" },
        { value: "95 M", label: "credit records processed on a laptop" },
      ],
      profileLabel: "Profile",
      profileText:
        "Finance Data Analyst who owns the SG&A close and forecast process for 15+ countries across the Americas and Europe, from HQ. An economist trained in treasury, SOX billing and FP&A, who builds the data the business runs on instead of waiting for it: Python, SQL and Power BI on real operations. Alongside that I run a production PostgreSQL warehouse in medallion architecture, with dbt transformations, 89 automated quality tests and a Power BI semantic model that refreshes itself daily, and I deployed a credit decisioning system over 95 million records with ten model-governance gates. All of it verifiable: every figure on my site links to the repository that produces it. I bring financial judgment and data engineering in a single hire: no translator, no handoff meeting.",
      // One-page sheet only: see the Spanish note above.
      profileShortText:
        "Finance Data Analyst who owns the SG&A close and forecast for 15+ countries, from HQ. An economist trained in treasury, SOX billing and FP&A, who builds the data the business runs on instead of waiting for it: Python, SQL and Power BI on real operations. Alongside it I run a PostgreSQL warehouse with dbt, 89 automated quality tests and a Power BI semantic model that refreshes itself daily, plus a credit decisioning system over 95 million records with ten governance gates. Every figure on my site links to the repository that produces it.",
      pivot: {
        label: "The crossover role",
        shortBody: "I charge for what I have done in every finance role: build the data the business needed, which nobody else was going to build. The edge is not knowing Python — plenty of people do. It is knowing which question is worth answering before writing the first line.",
        body: "I charge for what I have done in every finance role: in all of them I ended up building the same thing — code and data — because the report the business needed did not exist and nobody else was going to build it. An FX mismatch analysis in Python nobody had asked for, as an intern. Automation that gave every treasury analyst about 10 hours a month back — close to 60 a month across the team. Power BI models that turned a monthly close into a decision. The edge is not knowing Python; plenty of people know Python. It is knowing which question is worth answering before writing the first line. A Finance Data Analyst is neither a data analyst who picked up finance nor a finance person who picked up code — it is the one who needs no translator between them. Hiring that person is two hires in one, without the handoff meeting between them.",
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
                "Own the SG&A close and forecast process for 15+ countries across the Americas and the Eastern Hemisphere (India, Hungary, Spain, Czech Republic), from HQ.",
                "Accountable for the monthly close and company-wide forecast confirmation; I explain every variance against plan and prior forecast.",
                "Isolate the FX effect in constant currency and per-currency inflation, so the operating variance reads clean.",
                "Built the FP&A reporting on advanced Excel, Power Query, Power BI, MicroStrategy, JD Edwards and SAP.",
              ],
            },
          ],
        },
        {
          company: "SLB",
          location: "Bogotá, Colombia",
          mode: "hybrid",
          note: "Two promotions in 26 months: from treasury to billing specialist for Argentina and Brazil, with an intern reporting to me.",
          roles: [
            {
              title: "Billing Specialist (Argentina & Brazil)",
              period: "Dec 2024 — Mar 2026",
              bullets: [
                "Owned revenue recognition in SAP for Argentina and Brazil under Sarbanes-Oxley (SOX) controls.",
                "Supervised and trained an intern on the billing team.",
                "Built Power BI models and visualizations for revenue and trend analysis.",
                "Audited integrated technology projects, with end-to-end traceability and compliance.",
              ],
            },
            {
              title: "Treasury Analyst",
              period: "Oct 2024 — Dec 2024",
              bullets: [
                "Gave the team back about 60 hours a month — roughly 10 per analyst — by automating manual treasury reporting.",
                "Automated bank reconciliation in SAP and moved it into Power Automate workflows.",
              ],
            },
            {
              title: "Treasury Intern",
              period: "Jan 2024 — Jun 2024",
              bullets: [
                "Detected and quantified FX mismatches across Latin American markets in Python, identifying financial risks and hedging opportunities.",
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
                "Modelled Colombian higher-education data for impact-evaluation studies.",
                "Published the research findings in Power BI dashboards.",
              ],
            },
          ],
        },
      ],
      projectsLabel: "Projects in operation",
      projectsNote: "Open source and checkable. None of this is a course exercise.",
      projects: [
        {
          name: "credit-risk-mlops",
          role: "Credit decisioning system with model governance — design and build",
          period: "2026 — deployed, scoring live",
          href: "https://github.com/DavinsonR/credit-risk-mlops",
          hrefLabel: "github.com/DavinsonR/credit-risk-mlops",
          stack: [
            "Python", "LightGBM", "scikit-learn", "optbinning (WoE)", "MLflow",
            "ONNX", "DuckDB", "pandera", "Docker", "Power BI",
          ],
          bullets: [
            "Declining the riskiest 10% of the test portfolio would have avoided $276.3M in charge-offs — 2.15x what random declines achieve — and the report ships the counterweight too: $1.99B in good lending forgone.",
            "Deployed model at AUC 0.7005 over 1.96M SBA 7(a) loans and 62.4M HMDA applications: +0.0311 over an interpretable WoE scorecard, with calibration error 0.0107. The event study runs separately, over 93.4M applications.",
            "The first reading was 0.9461, and it was not a model but a leak: TermInMonths is overwritten when a loan is liquidated, so the field carried the outcome. Removing it drops the ablation to 0.6621 — and that is the number published.",
            "Ten promotion gates judged by exit code, one of them designed to block my own model when it misses the threshold.",
            "Monitoring caught the source changing its vocabulary without notice: a field stopped meaning the same thing between vintages, and nobody would have known without the control.",
            "The production ONNX artifact scores in the reader's own browser — no server, and no data leaves the page.",
          ],
        },
        {
          name: "market-data-medallion",
          role: "Market data platform — designed, built and operated",
          period: "2026 — in daily operation",
          href: "https://github.com/DavinsonR/market-data-medallion",
          hrefLabel: "github.com/DavinsonR/market-data-medallion",
          stack: [
            "PostgreSQL", "Medallion architecture", "dbt", "Python", "Prefect",
            "GitHub Actions", "Supabase", "Power BI (TMDL / PBIP)", "Next.js",
          ],
          bullets: [
            "Watermark-based incremental ingestion from 4 sources (Tiingo, Coinbase, Kraken, FX) into a three-layer PostgreSQL warehouse: 48 assets and more than 58,000 candles, idempotent and resumable.",
            "89 automated dbt data-quality tests plus 171 Python unit tests; the pipeline fails before publishing bad data, not after.",
            "No-look-ahead backtesting engine with 70/30 out-of-sample validation over 1,392 strategy variants: fewer than one in six in-sample winners survived the blind window.",
            "FX decomposition for Latin American ADRs, separating company performance from the currency move through the identity (1+r_USD) × (1+r_FX) = (1+r_local).",
            "Daily orchestration on GitHub Actions with a rate-limit circuit breaker, running on zero-cost infrastructure.",
          ],
        },
        {
          name: "JARVIS — multi-user product with sensitive data",
          role: "Own product — designed, built and operated",
          period: "2026 — in production · open demo",
          href: "https://jarvis-app-psi-sable.vercel.app/demo",
          hrefLabel: "public demo, no account",
          stack: ["Next.js 16", "React 19", "TypeScript", "Postgres (Supabase)", "RLS", "Tailwind", "PWA", "Vitest"],
          bullets: [
            "Multi-user model on Postgres with a row policy on 34 tables: the conversion required rebuilding 22 primary keys that identified rows without the user, and pushing the user inside the foreign keys so isolation did not rest on the policy alone.",
            "Eight CI gates judged by exit code: types, format, lint, 526 tests, build, dependency audit, a guard that hunts personal data inside the built artifact, and a smoke test requiring the anonymous role to be denied across all 55 tables and views.",
            "A public demo running the five real screens over 120 seed-generated days that never queries the database; a test walks the runtime import graph and fails if any reachable module gets to the data client.",
            "Day logging in one form and one button, with eight independent writes, an on-device draft and send queue to survive losing signal, and a purpose-built number reader because a browser number field was storing expenses divided by a thousand.",
          ],
        },
      ] as CvProject[],
      researchLabel: "Research",
      researchNote: "My own research, built in public on open data.",
      research: [
        {
          name: "Financial inclusion and regional growth in Colombia",
          role: "M.Sc. in Economics thesis, Javeriana — reproducible research end to end",
          period: "2026 — thesis filed",
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
      skillsFinDesc: "What turns a data point into a business decision.",
      skillsFin: [
        "FP&A", "Close & forecast", "SG&A", "Revenue recognition (SOX)", "Treasury",
        "FX analysis", "Budgeting", "Constant currency", "SAP", "JD Edwards", "MicroStrategy",
        "Variance analysis", "Month-end close", "Cash-flow forecasting", "Management reporting", "Account reconciliation",
      ],
      skillsDataTitle: "Data & engineering",
      skillsDataDesc: "Tools running today in a public repository, not on a certificate.",
      skillsData: [
        "Analytical SQL", "PostgreSQL", "DuckDB", "dbt", "Medallion architecture", "Python (pandas)",
        "Incremental ETL", "Prefect", "GitHub Actions", "Supabase", "Power BI · DAX",
        "Power Query", "Tableau", "Git", "Next.js · Vercel",
        "Panel econometrics", "Fixed effects", "Causal inference", "Time series",
        "Credit scorecards (WoE)", "LightGBM", "MLflow", "ONNX", "MLOps", "Data testing",
        "Data warehousing", "Dimensional modelling (star schema)", "ELT", "CI/CD", "Dashboarding",
      ],
      skillsTechTitle: "Technical stack",
      skillsTechDesc: "Every tool links to the exact work where I used it.",
      skillsTech: [
        { name: "Financial analysis and FP&A", proof: "SG&A close and forecast across 15+ countries: variance against plan and in constant currency" },
        { name: "SAP", proof: "Revenue recognition under SOX and automated bank reconciliation, at SLB" },
        { name: "Excel and financial modelling", proof: "The close and forecast for those 15+ countries, at Neoris EPAM" },
        { name: "Power BI", proof: "Seven-table semantic model in TMDL with 17 DAX measures, versioned as text", href: "/projects/powerbi" },
        { name: "Tableau", proof: "Dashboard that won the BodyTech Trends Hackathon, public", href: TABLEAU_VIZ },
        { name: "Python", proof: "Incremental ingestion, backtesting engine, FX decomposition" },
        { name: "SQL · PostgreSQL", proof: "Three-layer medallion warehouse, more than 58,000 candles in production" },
        { name: "dbt", proof: "89 quality tests that run before a single figure is published" },
        { name: "DuckDB", proof: "Dimensional warehouse over 19 public sources resolved to municipal codes" },
        { name: "Git · GitHub Actions", proof: "Daily cron in operation, with a rate-limit circuit breaker" },
        { name: "Panel econometrics", proof: "Two-way fixed effects over 228 observations, wild cluster bootstrap and permutation placebo" },
        { name: "Diagnostics and robustness", proof: "Measured cross-sectional dependence, CCE, SLX, pre-trends, cluster-robust wild bootstrap and a Holm correction" },
        { name: "Machine learning", proof: "LightGBM over 1.96M SBA loans and 62.4M HMDA applications: AUC 0.7005, +0.0311 over the interpretable scorecard" },
        { name: "Credit risk and scorecards", proof: "WoE binning with optbinning, out-of-time validation across the COVID shock, calibration error 0.0107" },
        { name: "Model governance (MLOps)", proof: "Ten promotion gates judged by exit code; one blocks my own model" },
      ] as ProofRow[],
      awardsLabel: "Recognition",
      awards: ([
        {
          title: "Winner — BodyTech Trends Hackathon",
          year: "2024",
          desc: "Search-demand analytics for a gym chain: 19,560 keyword records cleaned in Python and a branch-by-branch trend dashboard in Tableau. Still published and open to anyone.",
          href: TABLEAU_VIZ,
          hrefLabel: "see the dashboard on Tableau Public",
          image: TABLEAU_SHOT,
          imageAlt: "Tableau dashboard with the estimated average revenue per customer from 2022 to 2025, search occurrence by month and six keyword trends.",
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
      ] as Education[],
      certs: [
        { title: "Machine Learning Specialization", inst: "Stanford · Coursera", year: "2024" },
        { title: "Cybersecurity Certificate", inst: "Google · Coursera", year: "2024" },
      ],
      remote: {
        label: "Remote-ready",
        points: [
          "My entire track record is remote or hybrid, with teams distributed across 15+ countries.",
          "GMT-5 (Bogotá): your US and Canadian hours, in full.",
          "Daily working English with teams in the US and Europe (Hungary, Czech Republic, Spain), plus Argentina and Brazil.",
          "Native Spanish · Portuguese A2.",
        ],
      },
    },
  },
};
