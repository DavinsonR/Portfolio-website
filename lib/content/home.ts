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

import type { Metric, ProjectLink, AlsoRow } from "./types";

export const home = {
  es: {
    meta: {
      title: "Davirson Novoa — Finance Data Analyst",
      description:
        "Encuentro la variación, llego a la causa raíz, dejo el control corriendo solo y lo explico donde se decide. 95 M de registros de crédito modelados, 15+ países en el cierre, una plataforma que se refresca sola.",
    },
    nav: {
      links: [
        { label: "Trabajo", href: "#work" },
        { label: "Trayectoria", href: "/historia" },
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
      sub: "Casi nadie hace las cuatro. El analista encuentra la variación y la pasa; el ingeniero automatiza lo que le pidan; y a la dirección le llega un número que nadie sabe defender. Tres años cerrando los libros de más de 15 países desde HQ, y en paralelo una plataforma de datos en producción —ingesta diaria, 89 pruebas de calidad, modelo semántico en Power BI— que diseñé, construí y opero solo. Sin equipo detrás. Sin proveedor.",
      availability: "Bogotá · GMT-5 · Traslape completo con horario de EE.UU. · Abierto a roles remotos",
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
      metricsLabel: "Cinco cifras que puedes auditar ahora mismo",
      metricsNote: "Ninguna está redondeada y ninguna es de adorno. Haz clic en la que menos te creas.",
      pipelineLive: "Pipeline en vivo · datos hasta",
      pipelineStalled: "Pipeline detenido · datos hasta",
      pipelineLiveFallback: "Pipeline en vivo · se actualiza a diario",
      // Cinco cifras, cinco AFIRMACIONES DISTINTAS, una por cuerpo de trabajo.
      // Antes eran cuatro y dos hablaban del mismo pipeline (48 activos y 89
      // pruebas), así que dos de los cuatro huecos más valiosos de la portada
      // decían lo mismo. El orden es deliberado: alcance de negocio, escala de
      // datos, honestidad intelectual, investigación propia, rigor de producción.
      metrics: [
        { value: "15+", label: "países bajo mi alcance", note: "desde HQ · América y hemisferio oriental", href: "/cv#experiencia" },
        { value: "95 M", label: "registros de crédito procesados", note: "93,4 M HMDA + 1,96 M SBA · el modelo entrena sobre 62,4 M", href: "/projects/credit-risk#cr-cliff" },
        { value: "1.392", label: "estrategias puestas a prueba", note: "sobrevivieron {survivors} · publiqué las {eliminated} que no", href: "/projects/trading-sim" },
        { value: "1.123", label: "municipios levantados uno a uno", note: "19 fuentes públicas que nadie había cruzado", href: "/research/fintech-inclusion#atlas" },
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
      title: "Construí un sistema de crédito que se audita solo. Y que bloquea a su propio autor.",
      intro: "El proyecto que mejor explica cómo trabajo. Contado como se cuenta un caso: el problema primero.",
      project: {
        name: "credit-risk-mlops",
        kind: "Sistema de decisión con gobierno de modelos",
        problemLabel: "El problema",
        problem: "Un modelo de crédito que nadie puede auditar no se despliega jamás, por espectacular que sea su AUC. El validador no pregunta cuánto da: pregunta quién puede cambiar esa cifra sin que nadie se entere, qué pasa cuando cambia el régimen y cómo sabes que el modelo sigue viendo la población para la que se entrenó. La mayoría de los portafolios de datos no sobrevive la primera de esas tres preguntas.",
        builtLabel: "Lo que construí",
        built: "Un sistema de decisión crediticia sobre 1,96 millones de préstamos SBA 7(a) y 62,4 millones de solicitudes HMDA, con validación out-of-time que cruza el shock COVID, diez gates que bloquean la promoción de un modelo que no cumpla, model card y reporte de validación generados desde la corrida, monitoreo de deriva y una capa de inferencia causal. Ninguna cifra publicada se escribe a mano: el gate las recomputa desde las predicciones guardadas antes de dejar promover nada.",
        matterLabel: "Por qué importa",
        matter: "Es exactamente lo que separa un modelo de uno que se puede desplegar. La misma estructura —umbrales derivados y escritos, documentación que se regenera sola, controles que fallan cerrado— es la que pide un examen de riesgo de modelo en un banco, y la que hace que un número sobreviva a la única pregunta que importa: de dónde salió. Eso no se aprende en un curso. Se aprende auditando, y yo estuve del otro lado de esa mesa.",
        findingLabel: "Hallazgo publicado",
        finding: "Mi primer AUC fue 0,9461: espectacular, publicable y falso — era una fuga de datos. Lo dejé publicado con nombre y apellido en lugar de esconderlo, porque ese es el resultado. Y de los diez gates del sistema, uno bloquea mi propio modelo con una razón de impacto dispar de 0,7639 contra un umbral de 0,80. No bajé el umbral. Cualquiera lo habría bajado.",
        stack: ["Python", "LightGBM", "PyTorch", "DuckDB", "PySpark", "MLflow", "ONNX", "Power BI"],
        links: [
          { label: "Ver el proyecto", href: "/projects/credit-risk", tone: "solid" },
          { label: "Ver el código", href: "https://github.com/DavinsonR/credit-risk-mlops", tone: "outline" },
          { label: "Leer la bitácora de defectos", href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md", tone: "text" },
        ] as ProjectLink[],
      },
      also: {
        title: "Y esto es solo lo que cabe en la portada",
        // Orden: del más nuevo al más viejo, por fecha de creación del repositorio.
        // JARVIS nació el 1 de septiembre de 2026 -- su repositorio es privado, así que
        // la fecha la puso su autor y no la API de GitHub -- y por eso queda entre la
        // tesis (5 de septiembre) y market-data-medallion (17 de agosto).
        rows: [
          {
            name: "Inclusión financiera y crecimiento regional en Colombia",
            kind: "Investigación reproducible · datos abiertos",
            status: "research",
            statusText: "TESIS RADICADA",
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
            note: "Ingesta diaria desde cuatro fuentes de mercado a un warehouse PostgreSQL en capas medallion con dbt, 89 pruebas de calidad automáticas y CI/CD, sobre infraestructura gratuita. De más de 1.300 variantes de estrategia evaluadas encima, solo una de cada {oneIn} ganadoras dentro de muestra sobrevivió fuera de muestra — publiqué todas las que no.",
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
        "I find the variance, I trace it to root cause, I leave the control running itself, and I explain it where the decision gets made. 95M credit records modelled, 15+ countries in the close, a platform that refreshes itself.",
    },
    nav: {
      links: [
        { label: "Work", href: "#work" },
        { label: "Track record", href: "/historia" },
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
      sub: "Almost nobody does all four. The analyst finds the variance and passes it on; the engineer automates whatever they are handed; and the board gets a number nobody can defend. Three years closing the books for 15+ countries from HQ, and alongside it a production data platform — daily ingestion, 89 quality tests, a Power BI semantic model — that I designed, built and run alone. No team behind me. No vendor.",
      availability: "Bogotá · GMT-5 · Full overlap with US hours · Open to remote roles",
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
      metricsLabel: "Five figures you can audit right now",
      metricsNote: "Not one is rounded and not one is decoration. Click the one you believe least.",
      pipelineLive: "Live pipeline · data through",
      pipelineStalled: "Pipeline stalled · data through",
      pipelineLiveFallback: "Live pipeline · refreshes daily",
      metrics: [
        { value: "15+", label: "countries under my scope", note: "from HQ · Americas and Eastern Hemisphere", href: "/cv#experiencia" },
        { value: "95 M", label: "credit records processed", note: "93.4 M HMDA + 1.96 M SBA · the model trains on 62.4 M", href: "/projects/credit-risk#cr-cliff" },
        { value: "1,392", label: "strategies put to the test", note: "{survivors} survived · I published the {eliminated} that didn't", href: "/projects/trading-sim" },
        { value: "1,123", label: "municipalities built one by one", note: "19 public sources nobody had joined", href: "/research/fintech-inclusion#atlas" },
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
      title: "I built a credit system that audits itself. And blocks its own author.",
      intro: "The project that best explains how I work. Told the way a case is told: the problem first.",
      project: {
        name: "credit-risk-mlops",
        kind: "Decision system with model governance",
        problemLabel: "The problem",
        problem: "A credit model nobody can audit never gets deployed, however spectacular its AUC. The validator doesn't ask what the number is: they ask who can change it without anyone noticing, what happens when the regime shifts, and how you know the model still sees the population it was trained for. Most data portfolios don't survive the first of those three questions.",
        builtLabel: "What I built",
        built: "A credit decisioning system over 1.96M SBA 7(a) loans and 62.4M HMDA applications, with out-of-time validation across the COVID shock, ten gates that block promotion of a model that does not comply, a model card and validation report generated from the run, drift monitoring, and a causal inference layer. No published figure is written by hand: the gate recomputes them from the saved predictions before letting anything be promoted.",
        matterLabel: "Why it matters",
        matter: "This is exactly what separates a model from a deployable one. The same structure — thresholds derived and written down, documentation that regenerates itself, controls that fail closed — is what a model risk examination at a bank asks for, and what makes a number survive the only question that matters: where it came from. You don't learn that on a course. You learn it auditing, and I sat on the other side of that table.",
        findingLabel: "Published finding",
        finding: "My first AUC was 0.9461: spectacular, publishable and false — it was a data leak. I left it published by name instead of burying it, because that is the result. And of the system's ten gates, one blocks my own model at a disparate impact ratio of 0.7639 against a 0.80 threshold. I didn't move the threshold. Anyone would have moved it.",
        stack: ["Python", "LightGBM", "PyTorch", "DuckDB", "PySpark", "MLflow", "ONNX", "Power BI"],
        links: [
          { label: "See the project", href: "/projects/credit-risk", tone: "solid" },
          { label: "See the code", href: "https://github.com/DavinsonR/credit-risk-mlops", tone: "outline" },
          { label: "Read the defect log", href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md", tone: "text" },
        ] as ProjectLink[],
      },
      also: {
        title: "And this is only what fits on the home page",
        // Order: newest to oldest, by repository creation date. JARVIS was born on
        // 1 September 2026 -- its repository is private, so the date comes from its
        // author rather than the GitHub API -- which puts it between the thesis
        // (5 September) and market-data-medallion (17 August).
        rows: [
          {
            name: "Financial inclusion and regional growth in Colombia",
            kind: "Reproducible research · open data",
            status: "research",
            statusText: "THESIS FILED",
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
            note: "Daily ingestion from four market sources into a PostgreSQL warehouse in medallion layers with dbt, 89 automated quality tests and CI/CD, on free infrastructure. Of more than 1,300 strategy variants evaluated on top of it, only one in {oneIn} in-sample winners survived out of sample — I published every one that did not.",
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
