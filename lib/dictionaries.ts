// ============================================================
// CONTENIDO DEL SITIO — fuente única de verdad (ES / EN)
// Para editar textos, edita SOLO este archivo.
// ============================================================

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

import type { PbiMeasureName, PbiPageId, PbiTableName } from "./powerbi-model";

export type Status = "live" | "building" | "research" | "idea";

// Un reconocimiento puede tener evidencia pública; la mayoría no la tiene.
export type Award = { title: string; year: string; desc: string; href?: string; hrefLabel?: string };
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

/* El tablero del hackathon es el unico artefacto visual, publico y de dominio
   financiero-adyacente que existe hoy: la fila de Tableau del toolkit lo
   afirmaba sin enlazarlo mientras la URL viva ya estaba dos secciones mas abajo,
   en reconocimientos. Ojo: si el workbook se renombra en Tableau Public la URL
   cambia, y por eso vive en una sola constante. */
export const TABLEAU_VIZ =
  "https://public.tableau.com/app/profile/davirson.novoa/viz/BodyTrendsADataAnalysisProject/TrendsAnalysis";

const profile = {
  name: "Davirson Novoa Ramírez",
  email: "davinsonnovoaramirez@gmail.com",
  linkedin: "https://linkedin.com/in/davirson-novoa-ramirez-2721641b5",
  github: "https://github.com/DavinsonR",
  kaggle: "https://kaggle.com/davinsonnovoa",
};

export const dictionaries = {
  // ==========================================================
  // ESPAÑOL
  // ==========================================================
  es: {
    profile,
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
      metrics: [
        { value: "15+", label: "países en alcance", note: "en tres roles de finanzas", href: "/cv#experiencia" },
        { value: "26", label: "meses de practicante a especialista", note: "SLB", href: "/cv#experiencia" },
        { value: "48", label: "activos en producción", note: "pipeline diario", href: "/projects/trading-sim" },
        { value: "89", label: "pruebas de datos automáticas", note: "en cada corrida", href: "/projects/trading-sim#calidad" },
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
    creditRisk: {
      metaTitle: "credit-risk-mlops — diez gates, y uno bloquea mi propio modelo",
      metaDesc:
        "Sistema de decisión crediticia sobre 1,96M de préstamos SBA y 93,4M de solicitudes HMDA, con gobierno de modelos: gates que bloquean, monitoreo que encontró una variable rota y un estudio de evento que corrigió una cifra propia.",
      kicker: "Sistema de decisión · credit-risk-mlops",
      title: "El modelo no es el punto. El punto es que sobrevive una auditoría.",
      intro:
        "Un modelo de crédito que nadie puede auditar no se despliega, por bueno que sea. Esta página muestra las cuatro cosas que un validador pregunta —y que casi ningún portafolio enseña— con la medición al lado: qué pasa cuando la fuente cambia de idioma, qué cuesta la decisión en dólares, qué hace el control cuando el modelo no cumple, y qué se puede afirmar de verdad sobre una brecha que se mueve.",
      pipelineLine:
        "datos: SBA 7(a) FOIA + HMDA (FFIEC/CFPB) · métricas recomputadas desde las predicciones guardadas · código abierto",
      sourceNote:
        "Ningún número de esta página está escrito a mano. Todos salen del bundle que el repositorio publica y verifica contra sus propios exports.",
      demo: {
        title: "El modelo, corriendo en tu navegador",
        body: "No es un vídeo ni una captura: es el artefacto ONNX de producción puntuando en local, sin servidor y sin que ningún dato salga de la página. Prueba a poner la antigüedad en «Change of Ownership» — el modelo responde con el mismo aplomo, y la sección siguiente explica por qué eso es el problema.",
        cta: "Abrir la demo",
        note: "1,9 MB · paridad numérica verificada contra el modelo original",
      },
      cliff: {
        title: "La fuente cambió de vocabulario y nadie se enteró",
        lede: "El SBA rehizo el esquema de categorías de la antigüedad del negocio entre FY2018 y FY2021. No las renombró: cambió la clasificación. Hoy la mayoría de los valores cae en categorías sobre las que el modelo no tiene ninguna evidencia, y el serving las manda a «desconocido».",
        y: "masa sin soporte de business_age",
        caption:
          "Proporción de cada cosecha cuyo valor de business_age cae en categorías con menos del 0,5% de la masa de entrenamiento. Las barras huecas son cosechas sanas.",
        punch:
          "El modelo no se degrada: pierde la variable entera y sigue devolviendo HTTP 200. Ninguna métrica de desempeño lo habría mostrado, porque el desempeño no se puede medir en cosechas jóvenes — un charge-off tarda una mediana de 51 meses en aparecer.",
        fixTitle: "Y cuánto costó arreglarlo",
        fixBody:
          "Armonizar el vocabulario pierde resolución: cuatro tramos de antigüedad colapsan en uno. Argumentar eso es fácil; medirlo es entrenar el modelo dos veces con el mismo split y la misma semilla.",
        fixCost: "costo en AUC",
        fixCoverage: "cobertura recuperada",
        fixResidual: "irreducible",
        fixNote:
          "El argumento cualitativo era correcto en dirección y despreciable en magnitud. Lo que no se mueve es el residuo: «Change of Ownership» no es una antigüedad sino una forma de adquisición, y mapearla sería inventar el dato.",
      },
      money: {
        title: "La decisión, en dólares y con su contrapeso",
        lede: "Rechazar el 10% más riesgoso de la cartera de prueba habría evitado pérdidas reales. Una presentación de ventas se detendría ahí.",
        avoided: "Pérdida evitada",
        forgone: "Volumen sano que se renuncia",
        caption:
          "Ambas cifras viajan en el mismo payload del repositorio. Un titular que muestra solo el numerador no es un titular.",
      },
      gate: {
        title: "El control bloquea mi propio modelo",
        lede: "De los diez gates de promoción, el de equidad no lo pasa el modelo de acceso: la razón de impacto dispar queda por debajo del umbral de cuatro quintos. El umbral no se movió.",
        scale: "razón de impacto dispar (regla de cuatro quintos)",
        threshold: "umbral 0,80",
        observed: "observado",
        caption:
          "El veredicto distingue dos cosas que suelen confundirse: que el build no se rompa y que el modelo cumpla. Aquí no coinciden, y el reporte lo dice con esas palabras.",
      },
      event: {
        title: "La brecha no se amplió: volvió",
        lede: "Entre 2021 y 2023 la brecha racial de denegación creció, y yo mismo publiqué esa cifra. Con tres años más de datos —FY2018 y FY2019 son años de tasas corrientes— resulta que la línea base estaba mal elegida: 2020-21 fue el auge de refinanciación, un régimen anómalo.",
        regimes: {
          pre: "FY2018-2019 · tasas corrientes",
          boom: "FY2020-2021 · auge de refinanciación",
          post: "FY2023-2025 · post-shock",
        },
        punch:
          "La brecha post-shock está a tres centésimas de punto de la pre-pandemia. El número que circulaba mide el auge acabándose, no el shock de tasas.",
        chartTitle: "Y aun así, no se publica un efecto causal",
        chartLede:
          "El estimador compara la brecha dentro de condado, propósito, gravamen y ocupación, sobre un panel balanceado y con errores agrupados por condado. Los coeficientes previos al shock deberían ser cero. No lo son.",
        y: "brecha intra-celda vs. 2021 (pp)",
        band: "umbral económico declarado antes de estimar",
        pre: "antes del shock",
        post: "después",
        caption:
          "Punto hueco: período previo. Barra: intervalo de confianza del 95%, agrupado por condado. La banda es la magnitud que se declaró relevante antes de ver ningún resultado.",
        reasonsTitle: "Tres razones medidas, no tres excusas",
        reasons: [
          {
            title: "Las tendencias previas no son planas",
            body: "El coeficiente de 2018 supera el umbral, y la violación es monótona: es una tendencia, no ruido.",
          },
          {
            title: "El arreglo de manual fabrica el efecto",
            body: "Extrapolar la tendencia previa da un efecto grande y significativo — porque lo que extrapola es el auge que el shock termina.",
          },
          {
            title: "Los dos pools no se vaciaron igual",
            body: "Las solicitudes de un grupo cayeron mucho menos que las del otro. El pool de 2023 no es el de 2021 con menos gente: es otro pool.",
          },
        ],
        closing:
          "La conclusión se parece a la del diagnóstico causal sobre SBA —no se publica un efecto— pero el contenido es el contrario. Allá no había con qué falsificar. Aquí sí, el test corrió, y la falsificación es la que cierra el caso.",
      },
      close: {
        title: "Lo que hay detrás de esta página",
        body: "El repositorio publica el registro completo de lo que se rompió, incluidos los defectos que encontré en mi propio tooling mientras construía esto. Es la parte que no se puede falsificar.",
        links: [
          { label: "Ver el código", href: "https://github.com/DavinsonR/credit-risk-mlops" },
          {
            label: "La bitácora de defectos",
            href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md",
          },
          {
            label: "Los registros de decisión",
            href: "https://github.com/DavinsonR/credit-risk-mlops/tree/main/docs/adr",
          },
          {
            label: "Lo que falta, priorizado",
            href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/docs/ROADMAP.md",
          },
        ],
      },
    },
    tradingSim: {
      metaTitle: "Trading Sim — más de 1.300 estrategias contra la realidad",
      metaDesc:
        "1.392 variantes de estrategia evaluadas sobre 48 activos con comisiones, slippage y validación fuera de muestra. La gran mayoría de las ganadoras eran ilusiones del backtest.",
      kicker: "Laboratorio · trading_sim",
      title: "Más de 1.300 estrategias entraron al laboratorio. Sobrevivieron menos de 50.",
      intro:
        "Cinco estrategias técnicas clásicas y todas sus combinaciones posibles, evaluadas sobre 48 activos — cripto, ETFs, acciones de EE.UU., ADRs latinoamericanos y divisas — con comisiones, slippage y sin mirar el futuro. Cada variante se entrena en el 70% de la historia y se juzga en el 30% que nunca vio. Esto no es un curso de trading: es la medición honesta de cuánto sobrevive el análisis técnico al contacto con la realidad.",
      pipelineLine:
        "datos: pipeline propio (API → PostgreSQL → dbt → backtester) · actualización diaria automática · código abierto",
      loading: "cargando datos del pipeline…",
      error: "No se pudieron cargar los datos (GitHub raw). Reintenta en unos segundos.",
      retry: "reintentar",
      stats: {
        variants: "variantes evaluadas",
        beatIs: "ganaron en entrenamiento",
        survivors: "sobrevivieron fuera de muestra",
        survival: "tasa de supervivencia",
      },
      funnel: {
        title: "El embudo de la honestidad",
        desc: "De todas las variantes que le ganaron a comprar-y-mantener en el periodo de entrenamiento, solo una de cada ocho siguió ganando en el periodo de validación que nunca influyó en su selección. El resto era ruido con buena suerte.",
        stageAll: "variantes evaluadas (5 estrategias + todas sus combinaciones AND)",
        stageIs: "le ganaron a buy & hold dentro de muestra",
        stageBoth: "siguieron ganándole fuera de muestra",
      },
      survivalChart: {
        title: "Supervivencia por nº de señales combinadas",
        desc: "Combinar más señales no aumenta la probabilidad de que un hallazgo sea real: la supervivencia se queda en el mismo rango con una señal que con cuatro, y la señal sola es la que mejor aguanta. La complejidad no compra robustez.",
      },
      exposureChart: {
        title: "Tiempo en el mercado por nº de señales",
        desc: "Cada filtro adicional no mejora las entradas — te saca del mercado. Exigiendo las 5 señales a la vez la exposición cae a prácticamente cero, y ninguna de esas variantes le ganó a comprar y mantener: ni siquiera en el periodo de entrenamiento.",
        never: "nunca coinciden",
      },
      signalOne: "señal",
      signalMany: "señales",
      explorer: {
        windowTitle: "explorador de backtests",
        assetLabel: "activo",
        strategyLabel: "estrategia",
        benchmark: "buy & hold",
        splitMarker: "→ validación",
        tableToggle: "ver datos en tabla",
        date: "fecha",
        noData: "sin datos para este activo todavía",
      },
      regions: { global: "Global", us: "Estados Unidos", latam: "Latinoamérica", emerging: "Emergentes" },
      metrics: { ret: "retorno", bh: "buy & hold", dd: "drawdown máx", sharpe: "sharpe", trades: "operaciones", win: "% ganadoras" },
      combos: {
        title: "Las {n} combinaciones de este activo",
        desc: "\"Luz verde en MACD + volumen\" y todas las demás. Ordenadas por su exceso de retorno fuera de muestra — la única cifra que no se usó para elegir nada. Las filas atenuadas nunca abrieron una posición.",
        strategy: "combinación",
        exposure: "expos.",
        excess: "exceso (total)",
        oosExcess: "exceso (valid.)",
        survived: "¿ganó fuera?",
        yes: "sí",
        no: "no",
        zeroTrades: "0 ops",
      },
      leaderboard: {
        title: "Las 5 estrategias, cara a cara",
        desc: "Promedios sobre los 48 activos, periodo completo 2022–2026. Ninguna estrategia tiene exceso de retorno promedio positivo: en promedio, todas pierden contra no hacer nada.",
        strategy: "estrategia",
        beat: "le ganó a B&H",
        avgReturn: "retorno prom.",
        avgBh: "B&H prom.",
        excess: "exceso prom.",
        sharpe: "sharpe med.",
      },
      fx: {
        title: "¿La empresa o la moneda? — ADRs latinoamericanos",
        desc: "Ecopetrol, Bancolombia, Petrobras y los demás ADRs cotizan en Nueva York en dólares: su retorno mezcla el desempeño de la empresa con el movimiento cambiario. Con las divisas en el mismo warehouse, los separamos (ventana: 365 días).",
        formula: "(1 + r_USD) × (1 + r_FX) = (1 + r_local)  ·  arrastre = r_USD − r_local",
        asset: "activo",
        pair: "par",
        usd: "retorno USD",
        local: "retorno local",
        fxMove: "mov. divisa",
        drag: "arrastre FX",
        note: "Arrastre negativo = la moneda local se depreció y le restó al inversionista en dólares; positivo = la moneda ayudó. Un análisis que solo existe porque el warehouse tiene las dos series.",
      },
      health: {
        windowTitle: "pipeline_health — corrida diaria",
        totals: "{assets} activos · {candles} velas diarias · {backtests} backtests en la base · última generación {date}",
      },
      updated: "datos generados",
      repoCta: "código en GitHub",
      method: {
        label: "Metodología",
        title: "Las reglas que hacen creíbles los números",
        desc: "Un backtest sin estas reglas es marketing. Cada una existe porque su ausencia infla resultados — y varias las aprendimos encontrando bugs reales, documentados en el repositorio.",
        items: [
          {
            title: "sin mirar el futuro",
            body: "La señal calculada al cierre del día t se ejecuta a la apertura del día t+1. Nunca se opera con información que aún no existía — el error clásico que infla backtests.",
          },
          {
            title: "costos reales",
            body: "10 pb de comisión por lado + 5 pb de slippage adverso en cada ejecución. La razón nº1 por la que estrategias \"perfectas\" en papel pierden dinero real.",
          },
          {
            title: "validación 70/30",
            body: "Cada variante se entrena en el 70% de la historia y se juzga en el 30% restante, que nunca influyó en su selección. Con más de 1.300 variantes, sin ventana ciega el resultado sería data dredging.",
          },
          {
            title: "calentamiento simétrico",
            body: "Los indicadores necesitan historia antes de dar señal. El corte 70/30 se toma después de ese calentamiento, para que ambas ventanas comparen regímenes equivalentes.",
          },
          {
            title: "ganar exige operar",
            body: "Una combinación que nunca entra al mercado rinde 0% y \"le ganaría\" a un mercado en caída. No cuenta: vencer a buy & hold requiere haber operado.",
          },
          {
            title: "datos auditables",
            body: "Más de 58.000 velas de Tiingo, Tiingo FX, Coinbase y Kraken en un warehouse PostgreSQL con arquitectura medallion, 89 tests de calidad de datos en dbt, 171 pruebas unitarias en Python y reconciliación entre fuentes. Todo reproducible desde el repo.",
          },
        ],
        repoCta: "ver el pipeline completo en GitHub →",
        backCta: "← volver al inicio",
      },
    },
    quality: {
      label: "Las 89 pruebas, una por una",
      title: "Qué se revisa antes de publicar una sola cifra",
      desc: "Esta es la lista completa, contada contra el manifiesto compilado de dbt. Si una falla, el pipeline se detiene y la página conserva los datos del día anterior en vez de publicar algo roto.",
      rows: [
        { n: 47, name: "not_null", what: "Ninguna columna que entra en un cálculo puede llegar vacía. Fue la prueba que destapó el fallo de Kraken, cuando el 100% de una fuente llegaba en NULL." },
        { n: 21, name: "accepted_values", what: "Un campo de categoría solo admite los valores del catálogo. Una clase de activo mal escrita deja de ser un dato nuevo y pasa a ser un error." },
        { n: 7, name: "unique_combination", what: "No puede existir la misma vela dos veces para el mismo activo y la misma fecha. Es lo que vuelve inofensivo reingerir." },
        { n: 6, name: "SQL propio", what: "Reglas que ninguna prueba genérica cubre: que el exceso de retorno cuadre con sus componentes, o que una combinación que nunca operó no pueda contar como ganadora." },
        { n: 4, name: "relationships", what: "Todo símbolo que aparece en un resultado tiene que existir en el catálogo de activos. Un activo huérfano falla en vez de desaparecer." },
        { n: 3, name: "unique", what: "Las llaves primarias son únicas de verdad, no por convención." },
        { n: 1, name: "ohlc_consistency", what: "El máximo del día no puede quedar por debajo del mínimo, ni la apertura fuera del rango. Detecta una fuente corrupta antes que cualquier métrica." },
      ],
      note: "Encima de estas corren 171 pruebas unitarias en Python sobre el motor de backtesting, las estrategias y el cliente de cada API.",
    },
    powerbi: {
      metaTitle: "Medallion Insights — informe Power BI sobre el warehouse",
      metaDesc: "Modelo semántico de siete tablas en TMDL, 17 medidas DAX y cuatro páginas de informe, versionados como texto. Cada medida enlaza al archivo que la define.",
      kicker: "Informe · Medallion Insights",
      pill: "EN EL REPO",
      title: "El informe Power BI, con cada medida a la vista",
      intro: "El warehouse del pipeline alimenta un informe interactivo de Power BI, Medallion Insights. Está versionado como proyecto de Power BI (PBIP): el modelo semántico en TMDL, las páginas en PBIR, todo texto plano que se revisa en una pull request. Esta página es el catálogo de ese modelo, copiado de los archivos fuente, para que nadie tenga que creer en la palabra «Power BI» sin ver qué hay detrás.",
      sourceLine: "Catálogo copiado del commit",
      sourceTail: "· el modelo se carga contra el warehouse en Supabase desde Power BI Desktop",
      facts: { tables: "tablas", relationships: "relaciones, todas a dim_assets.symbol", measures: "medidas DAX", visuals: "visuales en cuatro páginas" },
      model: {
        label: "Modelo semántico",
        title: "Una dimensión, cuatro tablas de hechos y dos agregados",
        desc: "Estrella clásica: dim_assets es la única dimensión y las cuatro tablas de hechos se relacionan con ella por symbol. Los dos agregados, overfitting_summary y leaderboard, se leen solos: llegan resumidos desde dbt para que el informe y el sitio no puedan discrepar.",
        diagramTitle: "Diagrama del modelo semántico: dim_assets relacionada con cuatro tablas de hechos; dos agregados sin relación.",
        legend: { dim: "dimensión", fact: "hechos", aggregate: "agregado" },
        headers: { table: "Tabla", role: "Rol", source: "Fuente", grain: "Grano", columns: "columnas", measures: "medidas", relationships: "Relaciones" },
        relationshipLine: "muchos a uno hacia dim_assets.symbol",
        grain: {
          dim_assets: "una fila por activo",
          combination_analysis: "una fila por activo y variante de estrategia",
          asset_summary: "una fila por activo",
          fx_decomposition: "una fila por ADR y ventana",
          equity_curves: "una fila por activo, estrategia y barra",
          overfitting_summary: "una fila por número de señales combinadas, más un total",
          leaderboard: "una fila por estrategia, clase y región, más totales",
        } satisfies Record<PbiTableName, string>,
      },
      measures: {
        label: "Medidas DAX",
        title: "Diecisiete medidas, con su expresión",
        desc: "Cada fila enlaza a la línea exacta del archivo TMDL que la define, fijada al commit del catálogo.",
        headers: { measure: "Medida", dax: "Expresión", format: "Formato", meaning: "Qué responde" },
        meaning: {
          "Variants Evaluated": "Cuántas variantes de estrategia hay en el filtro actual.",
          "Winners In-Sample": "Cuántas superaron a comprar y mantener en la ventana de entrenamiento.",
          "Winners IS & OOS": "Cuántas de esas siguieron ganando en la ventana ciega.",
          "OOS Survival Rate": "La cifra de honestidad: supervivientes sobre ganadoras dentro de muestra.",
          "Beat B&H % (full)": "Proporción que supera a comprar y mantener en todo el periodo.",
          "Beat B&H % (OOS)": "Proporción que lo supera fuera de muestra.",
          "Avg Exposure": "Fracción del tiempo con posición abierta.",
          "Avg Excess Return": "Retorno medio por encima de comprar y mantener.",
          "Avg OOS Excess Return": "Lo mismo, solo en la ventana ciega.",
          "Median Sharpe": "Sharpe mediano, que un valor extremo no arrastra.",
          "Zero-Trade Variants": "Variantes que nunca operaron: no pueden contar como ganadoras.",
          "USD Return": "Retorno del ADR para quien invierte en dólares.",
          "Local Return": "Retorno de la empresa en su moneda.",
          "FX Move": "Movimiento de la divisa en la ventana.",
          "FX Drag (pp)": "Puntos porcentuales que la divisa quitó o sumó al inversor en dólares.",
          "Strategy Equity": "Valor de la cartera de la estrategia en cada barra.",
          "Buy & Hold Equity": "Valor de comprar y mantener en la misma barra.",
        } satisfies Record<PbiMeasureName, string>,
      },
      pages: {
        label: "Páginas del informe",
        title: "Las páginas, visual por visual",
        desc: "Lo que muestra cada página sale de los archivos PBIR. Las capturas se exportan desde Power BI Desktop y aparecen aquí cuando existen.",
        summary: {
          verdict: "El embudo de honestidad: variantes evaluadas, ganadoras dentro de muestra y supervivientes fuera de muestra, con la supervivencia y el tiempo en mercado por número de señales combinadas.",
          explorer: "Filtros por región, clase de activo y tipo de estrategia sobre todas las variantes: dispersión de exposición contra exceso fuera de muestra, tabla de líderes y la tabla completa.",
          fx: "Los ADR latinoamericanos partidos en empresa y divisa, con selector de ventana: 30, 90 o 365 días, o todo el periodo.",
          curves: "Estrategia contra comprar y mantener a lo largo del tiempo, para el activo y la estrategia que se elijan.",
        } satisfies Record<PbiPageId, string>,
        visualsWord: "visuales",
        shotCaption: "exportada desde Power BI Desktop",
        shotAlt: "Captura de la página",
        noShot: "Sin captura todavía: la lista de visuales sale del archivo PBIR de la página.",
        types: { card: "tarjeta", slicer: "segmentador", tableEx: "tabla", clusteredColumnChart: "columnas", clusteredBarChart: "barras", scatterChart: "dispersión", lineChart: "líneas" },
      },
      licensing: {
        label: "Licenciamiento",
        title: "Por qué no hay un informe embebido",
        body: "«Publicar en la web» exige una licencia Power BI Pro sobre un tenant de trabajo cuyo administrador permita el embebido público, y además hace público el propio conjunto de datos. Este proyecto corre con presupuesto cero, así que el informe se entrega como fuente: el proyecto PBIP se abre gratis en Power BI Desktop y se refresca contra el warehouse. Decirlo abiertamente también es evidencia: saber qué cuesta publicar un informe es parte del oficio.",
        steps: [
          "Instalar Power BI Desktop, gratis y sin cuenta para editar.",
          "Abrir MedallionInsights.pbip desde la carpeta powerbi del repositorio.",
          "Al refrescar, introducir la credencial de la base de datos una sola vez; queda en el almacén local de Desktop.",
        ],
        ctaPbip: "Abrir MedallionInsights.pbip",
        ctaFolder: "Ver la carpeta powerbi",
        ctaReadme: "Instrucciones y solución de problemas",
      },
      backCta: "Volver al inicio",
    },
    thesis: {
      metaTitle: "Inclusión financiera y crecimiento regional en Colombia — investigación reproducible",
      metaDesc: "Diecinueve fuentes públicas colombianas en un warehouse dimensional con dbt y DuckDB, un índice de inclusión financiera por dimensiones, dos paneles anuales, un atlas interactivo de los 1.123 municipios y una batería econométrica completa contra la correlación espuria.",
      kicker: "Investigación · datos abiertos",
      pill: "INVESTIGACIÓN",
      title: "Inclusión financiera y crecimiento regional en Colombia",
      subtitle: "Un warehouse abierto de fuentes públicas, un índice por dimensiones, dos paneles anuales, un atlas de los 1.123 municipios y una batería econométrica que responde la pregunta con su N, sus clústeres y sus pruebas.",
      degree: "Tesis de Maestría en Economía · Pontificia Universidad Javeriana",
      timeline: "Warehouse, índice, atlas y estimaciones publicados · siguen el anexo de desagregación temporal y el manuscrito",
      nav: [
        { id: "resumen", label: "Resumen" },
        { id: "atlas", label: "Atlas" },
        { id: "datos", label: "Datos" },
        { id: "metodo", label: "Índice" },
        { id: "resultados", label: "Resultados" },
        { id: "decisiones", label: "Decisiones" },
        { id: "reproducir", label: "Reproducir" },
      ],
      figures: [
        { value: "19", label: "fuentes públicas con manifiesto y sha256", note: "Superintendencia Financiera, DANE, MinTIC, MEN y el Marco Geoestadístico", href: "#datos" },
        { value: "2018–2025", label: "de panel anual sin un solo valor repetido", note: "264 filas departamentales y 231 crecimientos, ninguno duplicado", href: "#datos" },
        { value: "1.123", label: "municipios en el panel, 1.121 con polígono", note: "2018–2024 · 7.861 filas municipales", href: "#atlas" },
        { value: "15", label: "especificaciones publicadas, cada una con su N y su p", note: "cuatro diseños contra la exogeneidad, bootstrap salvaje y placebo", href: "#resultados" },
      ] as Metric[],
      abstract: {
        label: "Resumen",
        body: "¿La inclusión financiera predice el crecimiento económico de los departamentos colombianos una vez descontadas las tendencias nacionales que los mueven a todos a la vez? Para responderla, el proyecto descarga diecinueve fuentes públicas con un manifiesto verificable, resuelve cada serie al código municipal DIVIPOLA, las modela en un esquema estrella con vintages sobre dbt y DuckDB, y construye un índice de inclusión financiera por dimensiones con pesos congelados y publicados por variable. Encima van dos paneles anuales, departamental y municipal, un atlas interactivo y una batería econométrica de efectos fijos de dos vías, diagnósticos de dependencia transversal y espacial, cuatro diseños que no dependen de la exogeneidad del índice, y una inferencia hecha para 33 clústeres. La respuesta se publica con su especificación, su N y sus pruebas, sea cual sea el signo.",
      },
      data: {
        label: "Datos",
        title: "Diecinueve fuentes públicas, con la huella de cada descarga",
        items: [
          { title: "Adquisición con manifiesto", body: "Un descargador propio pagina las API de datos abiertos, verifica el conteo contra la fuente, tipa cada columna con los metadatos del portal y guarda Parquet particionado por año. Cada descarga deja fecha de la fuente, filas, bytes y sha256 en un manifiesto versionado." },
          { title: "Claves geográficas resueltas", body: "Las tablas de la Superintendencia no declaran el código DIVIPOLA, pero lo llevan implícito en la columna de renglón. Resolverlo da cobertura del 100 % en los 34 cortes trimestrales y evita el cruce por nombre, que falla con acentos y alias." },
          { title: "Warehouse dimensional con dbt", body: "Esquema estrella con hechos por vintage sobre DuckDB: dimensiones de departamento, municipio, periodo y las 98 variables de la Superintendencia con su regla de anualización; la inclusión en formato largo por bloque de producto." },
          { title: "El empalme, medido", body: "La tabla vigente sustituye a la anterior en 2021Q1, y ese trimestre existe en las dos: es una prueba natural del empalme. La diferencia mediana por departamento es del 0,02 % y el peor caso llega al 1,8 %; una prueba de dbt falla si esos umbrales se rompen." },
          { title: "Frecuencia anual, dos paneles", body: "El PIB subnacional es anual: ningún valor anual se repite en cuatro trimestres. El panel departamental cubre 2018 a 2025 con 231 observaciones de crecimiento y ninguna repetida; el municipal, 2018 a 2024 sobre el valor agregado municipal del DANE." },
          { title: "Un cero no es un dato", body: "Los ceros de la Superintendencia y del Ministerio de Educación son ausencias, no valores: fuera del bloque de producto de cada fila desaparecen por construcción. En el mapa, un territorio sin color es un territorio del que nadie reportó, y eso no es lo mismo que cero." },
        ],
      },
      method: {
        label: "El índice",
        title: "Se mide el supuesto antes de elegir el método",
        items: [
          { title: "Ocho variables, tres dimensiones", body: "Acceso, uso y profundidad, cada una con sus variables normalizadas por adultos o por producto y estandarizadas en la ventana de calibración. Dieciocho candidatas quedaron fuera, cada una con su motivo escrito." },
          { title: "El PCA se descartó midiéndolo", body: "La medida de adecuación muestral da 0,314 en acceso y 0,404 en uso, por debajo del umbral de 0,5 que hace falta para factorizar. Forzarlo produce pesos implícitos negativos en microcrédito, que es un índice que dice que más crédito es menos inclusión." },
          { title: "Pesos iguales, congelados y publicados", body: "Dentro de cada dimensión los pesos son iguales, se fijan en la ventana 2018–2019 y no se vuelven a tocar. Los pesos implícitos por variable se publican siempre, y ninguno puede ser negativo." },
          { title: "Sensibilidad a la vista", body: "El PCA y el índice de distancia de Sarma se calculan igual y se publican como alternativas, con la correlación de rangos entre las tres versiones. Ninguna se esconde." },
          { title: "Cero es un promedio, no una ausencia", body: "El índice está estandarizado contra el promedio de los departamentos en la ventana de calibración. Un valor de 2 son dos desviaciones por encima de aquel promedio, no “el doble de inclusión”." },
        ],
      },
      atlas: {
        label: "Atlas",
        title: "El índice sobre el mapa, por departamento y por municipio",
        body: "Tres vistas de los mismos datos. Plano, con las métricas alrededor; relieve, para levantar un departamento y verlo aparte; y municipios, para bajar a las 1.123 unidades. Al fijar un departamento se puede descender a sus municipios desde el propio mapa, y elegir una región acerca el encuadre a esa selección dejando los vecinos sangrando por el borde.",
        notes: [
          "Un territorio sin color no vale cero: es un territorio del que ninguna entidad vigilada reportó operaciones ese año.",
          "La altura de los bloques es constante y no codifica nada. Una altura que dependiera del valor haría que las unidades de adelante taparan a las de atrás, y el dato de una unidad no debe depender de dónde cae en el mapa.",
          "El archipiélago de San Andrés va como ficha fuera de escala: está a 700 km del continente y mide 26 km², de modo que dentro del encuadre encogía el mapa una quinta parte para pintar un punto.",
          "Dos de los 1.123 municipios del panel no tienen polígono en el Marco Geoestadístico 2024: aparecen en el ranking y en las cifras, pero no en el mapa.",
        ],
      },
      results: {
        label: "Resultados",
        title: "Con efectos de entidad y tiempo, el coeficiente es cero",
        headline: "La inclusión financiera no predice el crecimiento departamental una vez descontada la tendencia nacional.",
        stat: "β = +0,0007 · p = 0,90",
        body: "Treinta y tres departamentos, 2019 a 2025, 228 observaciones. Con efectos fijos de entidad y de tiempo, el índice compuesto no mueve el crecimiento del PIB real per cápita: el bootstrap salvaje por clúster da p = 0,89 y el placebo por permutación p = 0,68. Sin efectos de tiempo el mismo coeficiente vale +0,024 con p < 0,001. Esa distancia es exactamente lo que valía la tendencia nacional: el índice sube en todos los departamentos a la vez, y cualquier variable que también suba con los años se le parece.",
        tableHead: { spec: "Especificación", coef: "β", se: "EE", p: "p", n: "N" },
        rows: [
          { spec: "Efectos de entidad y tiempo (base)", coef: "+0,0007", se: "0,0060", p: "0,90", n: "228" },
          { spec: "Base con errores de Driscoll-Kraay", coef: "+0,0007", se: "0,0037", p: "0,84", n: "228" },
          { spec: "Solo efectos de entidad", coef: "+0,0242", se: "0,0050", p: "< 0,001", n: "228" },
          { spec: "En cambios del índice", coef: "−0,0071", se: "0,0051", p: "0,16", n: "226" },
          { spec: "CCE, cargas heterogéneas por departamento", coef: "+0,0014", se: "0,0086", p: "0,87", n: "228" },
          { spec: "SLX, rezago espacial del índice", coef: "+0,0046", se: "0,0066", p: "0,49", n: "221" },
          { spec: "Shift-share, exposición 2018 × adopción nacional", coef: "+0,0182", se: "0,0067", p: "0,007", n: "223" },
        ],
        tiles: [
          { value: "0,89", label: "p del bootstrap salvaje por clúster", note: "999 réplicas de Rademacher con la nula impuesta sobre 33 departamentos" },
          { value: "0,68", label: "p del placebo por permutación", note: "499 barajados del índice dentro de cada año; el coeficiente real cae en el centro de la nube" },
          { value: "2,46", label: "CD de Pesaran sobre los residuos", note: "dependencia transversal débil pero presente (p = 0,014); por eso Driscoll-Kraay acompaña al clúster" },
        ],
        reading: [
          "Las tres dimensiones por separado, la especificación en cambios, el CCE, el SLX y los dos índices alternativos dan lo mismo: cero.",
          "El único diseño con señal es el shift-share. Sobrevive al ingreso inicial como placebo, pero la urbanización inicial produce una pendiente igual de significativa (+0,051, p = 0,013): recoge que los departamentos más urbanos, que son también los más incluidos, crecieron más rápido en el periodo. Es una pendiente diferencial, no un efecto del índice, y se publica así.",
          "El estudio de eventos alrededor de 2020 no puede contrastar tendencias previas —la dependiente empieza en 2019 y el choque es 2020— y se publica con esa limitación escrita.",
        ],
      },
      decisions: {
        label: "Decisiones",
        title: "Cada decisión de valor está escrita antes del código",
        body: "Las decisiones que cambian un resultado —la frecuencia, el modelo de datos, el método del índice, el diseño econométrico— van a un registro de decisión con sus alternativas, su coste y cómo revertirla. Las constantes viven en un solo sitio y ninguna cifra publicada existe sin la prueba que la sostiene.",
        items: [
          { title: "Frecuencia anual, dos paneles", body: "El producto subnacional es anual y ningún valor anual se reparte en cuatro trimestres. La desagregación temporal queda como anexo, con sus advertencias." },
          { title: "Esquema estrella con vintages", body: "Claves naturales, hechos por descarga y un empalme de esquema medido en el trimestre que existe en las dos fuentes." },
          { title: "Índice por dimensiones con supuesto medido", body: "Adecuación muestral antes de factorizar; pesos iguales, congelados y publicados; alternativas visibles." },
          { title: "Diseño econométrico", body: "Efectos fijos de dos vías, diagnósticos medidos y no supuestos, cuatro diseños contra la exogeneidad, y bootstrap salvaje porque 33 clústeres no bastan para la asintótica." },
          { title: "Datos derivados con la licencia de la fuente", body: "Lo que sale de la Superintendencia, MinTIC y el Ministerio de Educación se publica CC BY-SA 4.0, con atribución." },
        ],
      },
      reproduce: {
        label: "Reproducir",
        title: "Un comando levanta todo el proyecto",
        steps: [
          { cmd: "uv sync", body: "Dependencias exactas desde el archivo de bloqueo. Nada se instala fuera de él." },
          { cmd: "uv run iif acquire all", body: "Descarga las diecinueve fuentes, verifica el conteo contra cada API y escribe el manifiesto con sha256." },
          { cmd: "make check", body: "Ruff, 91 pruebas de Python, 250 modelos y pruebas de dbt sobre DuckDB, y el render del sitio. Sale en cero o no hay commit." },
          { cmd: "uv run iif econ", body: "Corre la batería econométrica completa en menos de medio minuto y escribe el archivo del que sale cada cifra de esta página." },
          { cmd: "uv run iif atlas", body: "Genera la geometría y las series que consume este mapa, dentro del presupuesto de 3 MB que fija el contrato." },
        ],
        note: "El motor local y de integración continua es DuckDB. BigQuery queda como objetivo alternativo con tope de coste por consulta, y Snowflake como demostración posterior; nada del proyecto depende de que ninguno de los dos siga vivo.",
      },
      status: {
        label: "Qué hay y qué llega",
        title: "El proyecto se publica por fases",
        items: [
          "Publicado: las diecinueve fuentes con manifiesto, el warehouse completo en dbt, el índice por dimensiones con sus pesos, los dos paneles anuales, el atlas y la batería econométrica con sus resultados.",
          "Después: el anexo de desagregación temporal (Chow-Lin, Denton y Fernández con el indicador trimestral del DANE) y el manuscrito.",
          "Todo el código, los datos derivados y las decisiones están en el repositorio, versionados.",
        ],
      },
      repoCta: "Ver el repositorio",
      backCta: "Volver al inicio",
      atlasCopy: {
        viewLabel: "Vista",
        views: { plano: "Plano", relieve: "Relieve 3D", municipios: "Municipios" },
        indicatorLabel: "Qué se pinta",
        groups: { indice: "Índice", variable: "Variables del índice", contexto: "Contexto" },
        yearLabel: "Año",
        regionLabel: "Región",
        departmentLabel: "Departamento",
        all: "Todas",
        medianLabel: "Mediana del territorio",
        medianFoot: "{n} de {total} unidades con dato · {ind}, {y}",
        evolutionLabel: "Evolución",
        dimensionsLabel: "Dimensiones del índice",
        byRegionLabel: "Por región",
        byDepartmentLabel: "Por departamento",
        rankingLabel: "Ranking · {n} con dato",
        rankingHead: { rank: "#", unit: "Territorio", value: "Valor" },
        moreUnits: "… {n} unidades intermedias",
        noData: "sin dato",
        noDataYear: "sin dato reportado ese año",
        drillDown: "Ver los municipios de {name}",
        offScale: "Archipiélago · fuera de escala",
        dimensions: { compuesto: "Compuesto", acceso: "Acceso", uso: "Uso", profundidad: "Profundidad" },
        loading: "Cargando el mapa y sus series…",
        failed: "No se pudieron cargar los datos del atlas.",
        // La atribución existía en atlas_meta.json pero no se renderizaba: la
        // CC BY-SA 4.0 la exige en el medio donde se publica, no en el fichero.
        sourceLabel: "Fuente",
        licenceLabel: "Series derivadas publicadas bajo",
        licenceName: "CC BY-SA 4.0",
      },
    },
    tracking: {
      metaTitle: "JARVIS — app de seguimiento personal, con demo abierto",
      metaDesc:
        "Registro diario de hábitos, cuerpo, sueño, comida y gastos sobre Postgres con seguridad por fila. Demo público con las cinco pantallas reales y datos generados, 526 pruebas en ocho puertas de CI y un modelo multiusuario con política de fila en 34 tablas.",
      kicker: "Producto propio · Next.js y Supabase",
      pill: "DEMO ABIERTO",
      title: "Una app de seguimiento personal, y el porqué de cada decisión",
      subtitle:
        "Cierra el día —hábitos, cuerpo, sueño, comida, gastos— en un formulario y un botón, y lo devuelve leído en vez de en crudo. Hay un demo abierto con las cinco pantallas de verdad y los datos de una persona que no existe.",
      access: "Repositorio privado · el demo es la superficie pública",
      timeline: "Demo público y app en producción · el alta de cuentas está escrita y todavía cerrada",
      demoUrl: "https://jarvis-app-psi-sable.vercel.app/demo",
      nav: [
        { id: "demo", label: "Demo" },
        { id: "decisiones", label: "Decisiones" },
        { id: "datos", label: "Datos" },
        { id: "procesos", label: "Procesos" },
        { id: "seguridad", label: "Seguridad" },
        { id: "estado", label: "Estado" },
      ],
      figures: [
        { value: "5", label: "pantallas reales en el demo, no maquetas", note: "las mismas de la app, corriendo sobre datos de alguien inventado", href: "#demo" },
        { value: "0", label: "consultas a la base desde el demo", note: "medido en el navegador: cero peticiones y cero envíos en las seis rutas", href: "#seguridad" },
        { value: "526", label: "pruebas automáticas en ocho puertas de CI", note: "tipos, formato, lint, pruebas, build, fuga en el bundle, dependencias y RLS", href: "#procesos" },
        { value: "34", label: "tablas con política de fila por usuario", note: "y las claves primarias reconstruidas, que era lo que de verdad bloqueaba", href: "#datos" },
      ] as Metric[],
      demo: {
        label: "El demo",
        title: "Las cinco pantallas de verdad, con los datos de alguien que no existe",
        body:
          "Una app cuyos datos son las finanzas y el cuerpo de una persona no se enseña con capturas. El demo corre las mismas cinco pantallas —no copias— y las mismas funciones de cálculo sobre ciento veinte días generados a partir de una semilla: las mismas cifras en cada recarga, así que una captura no caduca. Los ciento veinte días terminan hoy, de modo que el demo tampoco envejece.",
        cta: "Abrir el demo",
        ctaNote: "Se puede tocar todo. No se guarda nada.",
        ruleTitle: "El demo no consulta la base de datos. Nunca.",
        ruleBody:
          "No es una promesa escrita en un documento: una prueba recorre el grafo de importaciones que existe en tiempo de ejecución desde el módulo del demo y falla si alguno de los módulos alcanzables toca el cliente de la base. Es seguro por construcción y no por permiso — aunque cayera la guardia de rutas, no habría consulta que servir. Comprobado además en el navegador, recorriendo las seis rutas: cero peticiones a la base y cero envíos.",
        shotsTitle: "Lo que se ve",
        shotsNote: "Capturas tomadas del propio demo, con su franja impresa.",
        shots: [
          { file: "hoy", name: "Hoy", note: "Qué falta por registrar, el cuerpo, el gasto del día y los hábitos. Una sola frase interpreta el día: la dimensión que más se aparta de tu propia línea base." },
          { file: "registro", name: "Registro", note: "El día entero en un formulario y un botón. Un envío son ocho escrituras independientes: si un gasto queda ilegible, el peso y los hábitos se guardan igual." },
          { file: "historia", name: "Historia", note: "Cintura y peso con sus huecos sin interpolar, gasto por categoría y los hábitos con su calendario de cinco estados." },
          { file: "finanzas", name: "Finanzas", note: "El mes leído por ritmo y no por magnitud: cuánto llevas contra cuánto tocaría a estas alturas, con la forma real de tus meses ya cerrados." },
        ],
        personTitle: "Lo que la persona del demo tiene, y para qué",
        person: [
          "Tres días en pausa por un viaje, para enseñar que un hueco declarado no es un fallo.",
          "Un hábito graduado con su nota: la salida explícita de una métrica que ya cumplió.",
          "Peso y cintura medidos tres veces por semana, para que las series tengan huecos que nadie interpola.",
          "Una compra a doce cuotas y un cobro en cinco, que es lo que separa el gasto corriente del diferido.",
          "Un bolsillo ajeno, etiquetado como custodia de terceros y fuera de toda suma de patrimonio.",
        ],
      },
      decisions: {
        label: "Decisiones",
        title: "Seis decisiones, cada una contra un modo concreto de abandonar",
        body:
          "La mitad de la gente deja una app de seguimiento en el primer mes, y uno de cada ocho abandonos es de alguien que ya aprendió lo que necesitaba. Esas dos cifras son el punto de partida: cada decisión responde a una forma documentada de fallar, no a una preferencia estética.",
        items: [
          { title: "Un hueco y un fallo no son lo mismo", body: "Un día sin marcar sale del denominador; uno marcado en no cuenta como cero; y un día declarado en pausa —un viaje, una gripe— no cuenta ni a favor ni en contra. Sin esa distinción, dos semanas de vida normal se leen como catorce fracasos." },
          { title: "Graduarse es un final feliz", body: "Un hábito se puede graduar con una nota: deja de pedirse a diario, se queda en la historia y no hunde la adherencia del resto. Sale del denominador solo desde la fecha en que se gradúa, porque los días anteriores ya contaron y reescribirlos cambiaría un historial que fue verdad." },
          { title: "La referencia es tuya, no la del promedio", body: "Cada categoría de gasto se compara contra su presupuesto si lo tiene y contra tu propia media si no, y la pantalla dice siempre de dónde salió el número. La curva de ritmo esperado no es una recta: sale de la forma que tuvieron tus meses ya cerrados, porque el arriendo no se paga en cuotas diarias." },
          { title: "El peso no es una meta", body: "No hay barra de progreso hacia un peso objetivo en ninguna pantalla. La cintura sí la tiene, porque mide lo que de verdad se quería cambiar. Es la diferencia entre una app que acompaña y una que vigila." },
          { title: "Ningún dato inventado", body: "Un campo vacío se muestra vacío y las series no se interpolan: una recta entre dos pesajes separados por dos semanas no es una tendencia. Cuando no hay días suficientes para afirmar algo, la app lo dice en vez de afirmarlo igual." },
          { title: "El color se midió, no se eligió", body: "Cada color pasó por validación de contraste en los dos temas, y los seis de los hábitos llevan luminancias escalonadas para seguir distinguiéndose en escala de grises o con daltonismo. Los estados del calendario se separan por forma —relleno, trama, contorno—, que es lo único que sobrevive a una pantalla al sol." },
        ],
      },
      data: {
        label: "Datos",
        title: "Postgres con seguridad por fila, y las claves que el multiusuario destapó",
        items: [
          { title: "Una política por fila, no por pantalla", body: "Treinta y tres tablas y veintidós vistas en Postgres, cada una con su política y las vistas en modo invocador. El rol anónimo no lee nada: una prueba de humo recorre las cincuenta y cinco por la misma API que usa la app y exige que las cincuenta y cinco denieguen." },
          { title: "Lo que bloqueaba el multiusuario no era la seguridad", body: "Eran las claves primarias. Veintidós tablas se identificaban sin el usuario: las medidas por fecha, los hábitos por fecha y nombre, las cuentas por nombre. La segunda persona que se pesara un martes recibía un error de clave duplicada, y una sola persona en todo el sistema podía tener una cuenta con el nombre de su banco." },
          { title: "Las claves foráneas llevan el usuario dentro", body: "Sin él, un movimiento podía apuntar a la cuenta de otra persona y la seguridad por fila no lo impediría, porque una clave foránea se valida dentro del motor y no pasa por la política." },
          { title: "Un cero no es un dato", body: "Vacío se guarda como nulo, nunca como cero, y un campo en blanco no borra lo que ya se midió ese día: las claves nulas se quitan del envío antes de escribir." },
          { title: "El módulo de los números", body: "Un campo numérico del navegador rechaza la coma decimal y lee 10.500 como diez y medio, así que un gasto se guardaba dividido por mil sin que nada avisara. Todos los campos son de texto y pasan por un lector propio con sus reglas escritas y probadas; debajo de cada uno se muestra el valor exacto que se va a guardar, ya recortado a los decimales de la columna." },
          { title: "Las gráficas son SVG escrito a mano", body: "Treinta líneas de aritmética en vez de una librería: se prueban con el resto del código sin montar un navegador, y el teléfono no baja veinte kilobytes para dibujar seis líneas." },
        ],
      },
      process: {
        label: "Procesos",
        title: "Ocho puertas antes de que un cambio llegue a producción",
        body:
          "Cada empujón y cada propuesta de cambio pasa por la misma cadena, y cada puerta se juzga por su código de salida y no por lo que imprime. La cadena completa, corrida sobre la rama principal:",
        gates: [
          { name: "Tipos", detail: "TypeScript estricto, sin un solo error" },
          { name: "Formato", detail: "Prettier en modo verificación" },
          { name: "Lint", detail: "ESLint con la configuración de Next" },
          { name: "Pruebas", detail: "526 pruebas en 38 ficheros" },
          { name: "Build", detail: "compilación de producción completa" },
          { name: "Fuga en el bundle", detail: "12 términos personales, ninguno en los 28 ficheros servidos" },
          { name: "Dependencias", detail: "auditoría sin vulnerabilidades altas" },
          { name: "Seguridad por fila", detail: "55 de 55 comprobaciones deniegan al anónimo" },
        ],
        guardsTitle: "Cuatro guardias contra una regresión concreta",
        guards: [
          { title: "Aislamiento del demo", body: "Recorre el grafo de importaciones de valor desde el módulo del demo y falla si alguno de los módulos alcanzables llega al cliente de la base." },
          { title: "Escrituras del demo", body: "Recorre los componentes de cliente y exige que todo el que importe una acción de servidor pregunte si está en modo demo, o quede exento con su razón escrita." },
          { title: "Claves de conflicto", body: "Toda escritura con resolución de conflicto tiene que empezar por el usuario. Sin esa guardia, el paso a multiusuario rompía once guardados en silencio: la base impecable y la app inservible." },
          { title: "Datos personales en el artefacto", body: "Corre después del build y sobre lo que se sirve, no sobre el código fuente: quien decide qué viaja al navegador es el empaquetador y no la importación. Está probado que detecta una fuga plantada." },
        ],
      },
      security: {
        label: "Seguridad",
        title: "Dos hallazgos que solo aparecen cuando se abre una puerta",
        items: [
          { title: "El bundle también es una superficie", body: "Abrir el demo no expone solo lo que el demo pinta: expone los ficheros de JavaScript de las pantallas, porque son los mismos. La lista real de hábitos vivía en un módulo de constantes compartido y el empaquetador metía el módulo entero en el envío al navegador; dos de esos nombres son datos de categoría especial. Se movieron a un módulo de solo servidor, con dos guardias detrás. No llegó a estar expuesto: se corrigió antes de fusionar." },
          { title: "Una escritura del demo podía llegar a datos reales, y no por la red", body: "El borrador del formulario vive en el almacenamiento del propio teléfono con la fecha como clave, y el demo usa la fecha de hoy. Quien abriera el demo desde el mismo navegador con el que registra pisaba su borrador real del día, y sin ningún error visible. En modo demo el borrador ya no lee, ni guarda, ni limpia, ni encola." },
          { title: "Sin terceros, y con política de contenido por petición", body: "Ni fuentes externas, ni analítica, ni scripts de nadie. La política de seguridad de contenido se emite con un número de un solo uso en cada petición, y la caché para trabajar sin conexión no guarda datos: solo estáticos y la pantalla de sin conexión. Cerrar sesión borra el almacenamiento local, que no está cifrado." },
        ],
      },
      status: {
        label: "Estado",
        title: "Qué está vivo y qué falta",
        liveTitle: "Vivo hoy",
        live: [
          "El demo es público y no pide cuenta: las cinco pantallas, con datos generados.",
          "La app corre en producción para su autor, detrás de sesión y con seguridad por fila.",
          "El esquema multiusuario está aplicado, y el aislamiento entre dos usuarios comprobado con un usuario desechable que se borró después.",
        ],
        pendingTitle: "Lo que falta para abrir las diez cuentas",
        pending: [
          "El alta está escrita y probada, y cerrada en dos sitios a la vez: una fila en la base y el interruptor de altas del panel de autenticación, que hoy sigue respondiendo que el registro está deshabilitado.",
          "El correo de confirmación necesita un servidor de envío propio: el que viene incluido está limitado por hora, y con diez altas el mismo día alguien se queda con una cuenta que no puede confirmar.",
          "Las cuatro plantillas de correo tienen que apuntar a la ruta de confirmación de la app; las que trae el proveedor por defecto van a su propio punto final, y entonces el enlace parece no hacer nada.",
        ],
        note: "Por eso esta página enlaza el demo y no un formulario de alta: publicar un botón de crear cuenta que hoy devuelve un error sería peor que no publicarlo.",
      },
      backCta: "Volver al inicio",
    },
    track: {
      title: "Trayectoria",
      fullCv: "Ver CV completo",
      rows: [
        {
          period: "2026 — hoy",
          title: "Business Consultant, FP&A · Neoris EPAM",
          desc: "Sistemas de gestión financiera para Norteamérica: cierre, forecast y variaciones de SG&A en 12 países. 100% remoto.",
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
    cv: {
      title: "Davirson Novoa Ramírez",
      // El "title mapping": los tres nombres con que las vacantes llaman al
      // mismo rol cruzado. Es el encabezado, no un subtítulo.
      targetsLabel: "Roles objetivo",
      targets: ["Finance Data Analyst", "Financial BI Analyst", "Analytics Engineer"],
      subtitle: "Economista y consultor FP&A que construye la infraestructura de datos que usa.",
      metaLine: "Bogotá, Colombia · GMT-5 · 100% remoto · Inglés B2 · Portugués A2",
      download: "Descargar CV (PDF)",
      downloadHref: "/Davirson_Novoa_CV_ES.pdf",
      latex: "Fuente LaTeX",
      latexHref: "/Davirson_Novoa_CV_ES.tex",
      latexNote: "Compilable en Overleaf sin instalar nada.",
      contactBtn: "Contacto",
      facts: [
        { value: "15+", label: "países en las operaciones que reporto" },
        { value: "60 h/mes", label: "de reporting devueltas al equipo (10 por analista)" },
        { value: "26 meses", label: "de practicante a especialista" },
        { value: "48", label: "activos en un pipeline diario propio" },
      ],
      profileLabel: "Perfil",
      profileText:
        "Economista con tres años dentro de finanzas corporativas — tesorería, facturación y FP&A — construyendo yo mismo los datos que el negocio necesita: Python, SQL y Power BI aplicados a operaciones en más de 15 países de América. Hoy opero en producción un warehouse PostgreSQL con arquitectura medallion, transformaciones en dbt, 89 pruebas automáticas de calidad y un modelo semántico de Power BI, actualizado a diario sin intervención manual. Busco un rol remoto donde el criterio financiero y la ingeniería de datos se paguen como una sola capacidad, no como dos mitades.",
      pivot: {
        label: "El rol cruzado",
        body: "No estoy cambiando de carrera: estoy cobrando por lo que ya hago. En cada rol financiero terminé construyendo lo mismo — código y datos — porque el reporte que hacía falta no existía. Un análisis de descalces cambiarios en Python siendo practicante. Automatizaciones que devolvieron unas 10 horas al mes a cada analista de tesorería — cerca de 60 al mes en el equipo. Modelos de Power BI que convirtieron un cierre contable en una decisión. La ventaja no es saber Python: es saber qué pregunta vale la pena responder antes de escribirlo. Un Finance Data Analyst no es un analista de datos que aprendió finanzas, ni un financiero que aprendió a programar — es quien no necesita traductor entre los dos.",
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
                "Diseñé y lideré 3 sistemas de gestión financiera para el cierre y forecast de gastos SG&A en Norteamérica, con impacto en 12 países/regiones.",
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
        { name: "Excel y modelado financiero", proof: "Cierre y forecast de SG&A para 12 países en Neoris EPAM" },
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

  // ==========================================================
  // ENGLISH
  // ==========================================================
  en: {
    profile,
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
        { value: "15+", label: "countries in scope", note: "across three finance roles", href: "/cv#experiencia" },
        { value: "26", label: "months intern to specialist", note: "SLB", href: "/cv#experiencia" },
        { value: "48", label: "assets in production", note: "daily pipeline", href: "/projects/trading-sim" },
        { value: "89", label: "automated data tests", note: "every run", href: "/projects/trading-sim#calidad" },
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
    creditRisk: {
      metaTitle: "credit-risk-mlops — ten gates, and one blocks my own model",
      metaDesc:
        "A credit decisioning system over 1.96M SBA loans and 93.4M HMDA applications, with model governance: gates that block, monitoring that found a broken variable, and an event study that corrected a figure of my own.",
      kicker: "Decision system · credit-risk-mlops",
      title: "The model is not the point. The point is that it survives an audit.",
      intro:
        "A credit model nobody can audit does not get deployed, however good it is. This page shows the four things a validator asks — and almost no portfolio shows — with the measurement beside each one: what happens when the source changes its language, what the decision costs in dollars, what the control does when the model does not comply, and what can honestly be claimed about a gap that moves.",
      pipelineLine:
        "data: SBA 7(a) FOIA + HMDA (FFIEC/CFPB) · metrics recomputed from saved predictions · open source",
      sourceNote:
        "No number on this page is written by hand. Every one comes from the bundle the repository publishes and verifies against its own exports.",
      demo: {
        title: "The model, running in your browser",
        body: "Not a video and not a screenshot: the production ONNX artifact scoring locally, with no server and no data leaving the page. Try setting business age to “Change of Ownership” — the model answers with the same confidence, and the next section explains why that is the problem.",
        cta: "Open the demo",
        note: "1.9 MB · numerical parity verified against the original model",
      },
      cliff: {
        title: "The source changed its vocabulary and nobody noticed",
        lede: "The SBA rebuilt the business-age category scheme between FY2018 and FY2021. It did not rename them: it changed the classification. Today most values fall into categories the model has no evidence about, and serving maps them to “unknown”.",
        y: "unsupported mass of business_age",
        caption:
          "Share of each cohort whose business_age value falls into categories holding less than 0.5% of the training mass. Hollow bars are healthy cohorts.",
        punch:
          "The model does not degrade: it loses the variable entirely and keeps returning HTTP 200. No performance metric would have shown it, because performance cannot be measured on young cohorts — a charge-off takes a median of 51 months to appear.",
        fixTitle: "And what it cost to fix",
        fixBody:
          "Harmonising the vocabulary loses resolution: four age bands collapse into one. Arguing that is easy; measuring it means training the model twice on the same split with the same seed.",
        fixCost: "cost in AUC",
        fixCoverage: "coverage recovered",
        fixResidual: "irreducible",
        fixNote:
          "The qualitative argument was right in direction and negligible in magnitude. What does not move is the residual: “Change of Ownership” is not an age but a form of acquisition, and mapping it would be inventing the data.",
      },
      money: {
        title: "The decision, in dollars and with its counterweight",
        lede: "Declining the riskiest 10% of the test portfolio would have avoided real losses. A sales deck would stop there.",
        avoided: "Loss avoided",
        forgone: "Good lending volume forgone",
        caption:
          "Both figures travel in the same payload in the repository. A headline that shows only the numerator is not a headline.",
      },
      gate: {
        title: "The control blocks my own model",
        lede: "Of the ten promotion gates, the access model fails the fairness one: the disparate impact ratio sits below the four-fifths threshold. The threshold did not move.",
        scale: "disparate impact ratio (four-fifths rule)",
        threshold: "threshold 0.80",
        observed: "observed",
        caption:
          "The verdict separates two things that are usually conflated: the build not breaking, and the model complying. Here they differ, and the report says so in those words.",
      },
      event: {
        title: "The gap did not widen — it came back",
        lede: "Between 2021 and 2023 the racial denial gap grew, and I published that figure myself. With three more years of data — FY2018 and FY2019 are ordinary-rate years — the baseline turns out to have been the wrong one: 2020–21 was the refi boom, an anomalous regime.",
        regimes: {
          pre: "FY2018–2019 · ordinary rates",
          boom: "FY2020–2021 · refi boom",
          post: "FY2023–2025 · post-shock",
        },
        punch:
          "The post-shock gap sits three hundredths of a point from the pre-pandemic one. The number in circulation measures the boom ending, not the rate shock.",
        chartTitle: "And still, no causal effect is published",
        chartLede:
          "The estimator compares the gap within county, purpose, lien and occupancy, on a balanced panel with errors clustered by county. The pre-shock coefficients should be zero. They are not.",
        y: "within-cell gap vs. 2021 (pp)",
        band: "economic threshold declared before estimating",
        pre: "before the shock",
        post: "after",
        caption:
          "Hollow point: pre-period. Bar: 95% confidence interval, clustered by county. The band is the magnitude declared meaningful before any result was seen.",
        reasonsTitle: "Three measured reasons, not three excuses",
        reasons: [
          {
            title: "Pre-trends are not flat",
            body: "The 2018 coefficient exceeds the threshold, and the violation is monotone: a trend, not noise.",
          },
          {
            title: "The textbook fix manufactures the effect",
            body: "Extrapolating the pre-trend yields a large, significant effect — because what it extrapolates is the boom the shock ends.",
          },
          {
            title: "The two pools did not empty alike",
            body: "One group had far fewer applications drop away than the other. The 2023 pool is not the 2021 pool with fewer people: it is a different pool.",
          },
        ],
        closing:
          "The conclusion resembles the SBA causal diagnostic — no effect published — but the content is the opposite. There, there was nothing to falsify with. Here there was, the test ran, and the falsification is what closes the case.",
      },
      close: {
        title: "What sits behind this page",
        body: "The repository ships the full ledger of what broke, including the defects I found in my own tooling while building this. It is the part you cannot fake.",
        links: [
          { label: "See the code", href: "https://github.com/DavinsonR/credit-risk-mlops" },
          {
            label: "The defect ledger",
            href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/NOTES.md",
          },
          {
            label: "The decision records",
            href: "https://github.com/DavinsonR/credit-risk-mlops/tree/main/docs/adr",
          },
          {
            label: "What is missing, prioritised",
            href: "https://github.com/DavinsonR/credit-risk-mlops/blob/main/docs/ROADMAP.md",
          },
        ],
      },
    },
    tradingSim: {
      metaTitle: "Trading Sim — 1,300+ strategies vs. reality",
      metaDesc:
        "1,392 strategy variants evaluated across 48 assets with fees, slippage and out-of-sample validation. The vast majority of the winners were backtest illusions.",
      kicker: "Lab · trading_sim",
      title: "1,300+ strategies entered the lab. Fewer than 50 survived.",
      intro:
        "Five classic technical strategies and every possible combination of them, evaluated across 48 assets — crypto, ETFs, US stocks, Latin American ADRs and currencies — with fees, slippage and no look-ahead. Every variant trains on 70% of history and is judged on the 30% it never saw. This is not a trading course: it is an honest measurement of how much technical analysis survives contact with reality.",
      pipelineLine:
        "data: own pipeline (API → PostgreSQL → dbt → backtester) · automatic daily refresh · open source",
      loading: "loading pipeline data…",
      error: "Could not load the data (GitHub raw). Retry in a few seconds.",
      retry: "retry",
      stats: {
        variants: "variants evaluated",
        beatIs: "won in training",
        survivors: "survived out of sample",
        survival: "survival rate",
      },
      funnel: {
        title: "The honesty funnel",
        desc: "Of all the variants that beat buy-and-hold during the training period, only one in eight kept winning in the validation window that never influenced their selection. The rest was noise with good luck.",
        stageAll: "variants evaluated (5 strategies + every AND-combination)",
        stageIs: "beat buy & hold in sample",
        stageBoth: "kept beating it out of sample",
      },
      survivalChart: {
        title: "Survival by number of combined signals",
        desc: "Combining more signals does not increase the odds that a finding is real: survival stays in the same range with one signal as with four, and the lone signal holds up best. Complexity does not buy robustness.",
      },
      exposureChart: {
        title: "Time in the market by signal count",
        desc: "Each extra filter does not improve the entries — it takes you out of the market. Demanding all 5 signals at once drops exposure to practically zero, and not one of those variants beat buy & hold: not even in the training period.",
        never: "they never align",
      },
      signalOne: "signal",
      signalMany: "signals",
      explorer: {
        windowTitle: "backtest explorer",
        assetLabel: "asset",
        strategyLabel: "strategy",
        benchmark: "buy & hold",
        splitMarker: "→ validation",
        tableToggle: "view data as table",
        date: "date",
        noData: "no data for this asset yet",
      },
      regions: { global: "Global", us: "United States", latam: "Latin America", emerging: "Emerging" },
      metrics: { ret: "return", bh: "buy & hold", dd: "max drawdown", sharpe: "sharpe", trades: "trades", win: "win rate" },
      combos: {
        title: "This asset's {n} combinations",
        desc: "\"Green light on MACD + volume\" and all the rest. Sorted by out-of-sample excess return — the only figure that was never used to pick anything. Dimmed rows never opened a position.",
        strategy: "combination",
        exposure: "expos.",
        excess: "excess (full)",
        oosExcess: "excess (valid.)",
        survived: "won out?",
        yes: "yes",
        no: "no",
        zeroTrades: "0 trades",
      },
      leaderboard: {
        title: "The 5 strategies, head to head",
        desc: "Averages across all 48 assets, full period 2022–2026. No strategy has positive average excess return: on average, they all lose to doing nothing.",
        strategy: "strategy",
        beat: "beat B&H",
        avgReturn: "avg return",
        avgBh: "avg B&H",
        excess: "avg excess",
        sharpe: "med. sharpe",
      },
      fx: {
        title: "The company or the currency? — Latin American ADRs",
        desc: "Ecopetrol, Bancolombia, Petrobras and the other ADRs trade in New York in dollars: their return mixes company performance with the currency move. With the FX pairs in the same warehouse, we separate them (window: 365 days).",
        formula: "(1 + r_USD) × (1 + r_FX) = (1 + r_local)  ·  drag = r_USD − r_local",
        asset: "asset",
        pair: "pair",
        usd: "USD return",
        local: "local return",
        fxMove: "FX move",
        drag: "FX drag",
        note: "Negative drag = the local currency depreciated and subtracted from the USD investor's return; positive = the currency helped. An analysis that only exists because the warehouse holds both series.",
      },
      health: {
        windowTitle: "pipeline_health — daily run",
        totals: "{assets} assets · {candles} daily candles · {backtests} backtests in the warehouse · last generated {date}",
      },
      updated: "data generated",
      repoCta: "code on GitHub",
      method: {
        label: "Methodology",
        title: "The rules that make these numbers credible",
        desc: "A backtest without these rules is marketing. Each one exists because its absence inflates results — and several were learned by finding real bugs, documented in the repository.",
        items: [
          {
            title: "no look-ahead",
            body: "A signal computed at day t's close executes at day t+1's open. No trade ever uses information that did not yet exist — the classic error that inflates backtests.",
          },
          {
            title: "real costs",
            body: "10 bps commission per side + 5 bps adverse slippage on every fill. The #1 reason strategies that look \"perfect\" on paper lose real money.",
          },
          {
            title: "70/30 validation",
            body: "Every variant trains on 70% of history and is judged on the remaining 30%, which never influenced its selection. With 1,300+ variants, skipping the blind window would be data dredging.",
          },
          {
            title: "symmetric warm-up",
            body: "Indicators need history before they can speak. The 70/30 split is taken after that warm-up, so both windows compare equivalent regimes.",
          },
          {
            title: "winning requires trading",
            body: "A combination that never enters the market returns 0% and would \"beat\" a falling market. It does not count: beating buy & hold requires having traded.",
          },
          {
            title: "auditable data",
            body: "More than 58,000 candles from Tiingo, Tiingo FX, Coinbase and Kraken in a PostgreSQL medallion warehouse, 89 dbt data-quality tests, 171 Python unit tests and cross-source reconciliation. Everything reproducible from the repo.",
          },
        ],
        repoCta: "see the full pipeline on GitHub →",
        backCta: "← back to home",
      },
    },
    quality: {
      label: "The 89 tests, one by one",
      title: "What gets checked before a single figure is published",
      desc: "This is the complete list, counted against dbt's compiled manifest. When one fails the pipeline stops, and the page keeps yesterday's data instead of publishing something broken.",
      rows: [
        { n: 47, name: "not_null", what: "No column that feeds a calculation may arrive empty. This is the test that caught the Kraken defect, when 100% of one source was landing as NULL." },
        { n: 21, name: "accepted_values", what: "A category field only accepts values from the catalogue. A misspelled asset class stops being new data and becomes an error." },
        { n: 7, name: "unique_combination", what: "The same candle cannot exist twice for one asset on one date. That is what makes re-ingestion harmless." },
        { n: 6, name: "custom SQL", what: "Rules no generic test covers: that excess return reconciles with its components, or that a combination which never traded cannot count as a winner." },
        { n: 4, name: "relationships", what: "Every symbol in a result must exist in the asset catalogue. An orphaned asset fails instead of vanishing." },
        { n: 3, name: "unique", what: "Primary keys are unique in fact, not by convention." },
        { n: 1, name: "ohlc_consistency", what: "A day's high cannot sit below its low, nor the open outside the range. It catches a corrupt feed before any metric does." },
      ],
      note: "On top of these, 171 Python unit tests cover the backtesting engine, the strategies and each API client.",
    },
    powerbi: {
      metaTitle: "Medallion Insights — the Power BI report over the warehouse",
      metaDesc: "A seven-table semantic model in TMDL, 17 DAX measures and four report pages, versioned as text. Every measure links to the file that defines it.",
      kicker: "Report · Medallion Insights",
      pill: "IN THE REPO",
      title: "The Power BI report, with every measure in view",
      intro: "The pipeline's warehouse feeds an interactive Power BI report, Medallion Insights. It is versioned as a Power BI Project (PBIP): the semantic model in TMDL, the pages in PBIR, all plain text reviewed in a pull request. This page is the catalogue of that model, copied from the source files, so nobody has to take the words «Power BI» on trust without seeing what is behind them.",
      sourceLine: "Catalogue copied from commit",
      sourceTail: "· the model loads against the Supabase warehouse from Power BI Desktop",
      facts: { tables: "tables", relationships: "relationships, all to dim_assets.symbol", measures: "DAX measures", visuals: "visuals across four pages" },
      model: {
        label: "Semantic model",
        title: "One dimension, four fact tables and two aggregates",
        desc: "A plain star: dim_assets is the only dimension and the four fact tables relate to it through symbol. The two aggregates, overfitting_summary and leaderboard, stand alone: they arrive pre-summarised from dbt so the report and the site can never disagree.",
        diagramTitle: "Semantic model diagram: dim_assets related to four fact tables; two aggregates with no relationship.",
        legend: { dim: "dimension", fact: "fact", aggregate: "aggregate" },
        headers: { table: "Table", role: "Role", source: "Source", grain: "Grain", columns: "columns", measures: "measures", relationships: "Relationships" },
        relationshipLine: "many to one into dim_assets.symbol",
        grain: {
          dim_assets: "one row per asset",
          combination_analysis: "one row per asset and strategy variant",
          asset_summary: "one row per asset",
          fx_decomposition: "one row per ADR and window",
          equity_curves: "one row per asset, strategy and bar",
          overfitting_summary: "one row per number of combined signals, plus a total",
          leaderboard: "one row per strategy, class and region, plus totals",
        } satisfies Record<PbiTableName, string>,
      },
      measures: {
        label: "DAX measures",
        title: "Seventeen measures, expression included",
        desc: "Each row links to the exact line of the TMDL file that defines it, pinned to the catalogue's commit.",
        headers: { measure: "Measure", dax: "Expression", format: "Format", meaning: "What it answers" },
        meaning: {
          "Variants Evaluated": "How many strategy variants sit in the current filter.",
          "Winners In-Sample": "How many beat buy and hold in the training window.",
          "Winners IS & OOS": "How many of those kept winning in the blind window.",
          "OOS Survival Rate": "The honesty figure: survivors over in-sample winners.",
          "Beat B&H % (full)": "Share that beats buy and hold over the whole period.",
          "Beat B&H % (OOS)": "Share that beats it out of sample.",
          "Avg Exposure": "Fraction of the time with a position open.",
          "Avg Excess Return": "Mean return above buy and hold.",
          "Avg OOS Excess Return": "The same, in the blind window only.",
          "Median Sharpe": "Median Sharpe, which one extreme value cannot drag.",
          "Zero-Trade Variants": "Variants that never traded: they cannot count as winners.",
          "USD Return": "The ADR's return for a dollar investor.",
          "Local Return": "The company's return in its own currency.",
          "FX Move": "The currency's move over the window.",
          "FX Drag (pp)": "Percentage points the currency took from, or added to, the dollar investor.",
          "Strategy Equity": "The strategy's portfolio value at each bar.",
          "Buy & Hold Equity": "Buy and hold's value at the same bar.",
        } satisfies Record<PbiMeasureName, string>,
      },
      pages: {
        label: "Report pages",
        title: "The pages, visual by visual",
        desc: "What each page shows comes from the PBIR files. Screenshots are exported from Power BI Desktop and appear here once they exist.",
        summary: {
          verdict: "The honesty funnel: variants evaluated, in-sample winners and out-of-sample survivors, with survival and time in market by number of combined signals.",
          explorer: "Region, asset-class and strategy-kind slicers over every variant: exposure against out-of-sample excess, the leaderboard and the full table.",
          fx: "The Latin American ADRs split into company and currency, with a window selector: 30, 90 or 365 days, or the full period.",
          curves: "Strategy against buy and hold over time, for whichever asset and strategy you pick.",
        } satisfies Record<PbiPageId, string>,
        visualsWord: "visuals",
        shotCaption: "exported from Power BI Desktop",
        shotAlt: "Screenshot of the page",
        noShot: "No screenshot yet: the list of visuals comes from the page's PBIR file.",
        types: { card: "card", slicer: "slicer", tableEx: "table", clusteredColumnChart: "columns", clusteredBarChart: "bars", scatterChart: "scatter", lineChart: "lines" },
      },
      licensing: {
        label: "Licensing",
        title: "Why there is no embedded report",
        body: "«Publish to web» needs a Power BI Pro licence on a work tenant whose administrator allows public embedding, and it makes the dataset itself public. This project runs on a zero budget, so the report ships as source: the PBIP project opens for free in Power BI Desktop and refreshes against the warehouse. Saying so openly is evidence too: knowing what it costs to publish a report is part of the job.",
        steps: [
          "Install Power BI Desktop, free and with no account needed to author.",
          "Open MedallionInsights.pbip from the repository's powerbi folder.",
          "On refresh, enter the database credential once; it stays in Desktop's local credential store.",
        ],
        ctaPbip: "Open MedallionInsights.pbip",
        ctaFolder: "See the powerbi folder",
        ctaReadme: "Instructions and troubleshooting",
      },
      backCta: "Back to home",
    },
    thesis: {
      metaTitle: "Financial inclusion and regional growth in Colombia — reproducible research",
      metaDesc: "Nineteen Colombian public sources in a dimensional warehouse on dbt and DuckDB, a financial-inclusion index by dimension, two annual panels, an interactive atlas of all 1,123 municipalities and a full econometric battery against spurious correlation.",
      kicker: "Research · open data",
      pill: "RESEARCH",
      title: "Financial inclusion and regional growth in Colombia",
      subtitle: "An open warehouse of public sources, an index by dimension, two annual panels, an atlas of all 1,123 municipalities and an econometric battery that answers the question with its N, its clusters and its tests.",
      degree: "M.Sc. in Economics thesis · Pontificia Universidad Javeriana",
      timeline: "Warehouse, index, atlas and estimates published · the temporal-disaggregation annex and the manuscript follow",
      nav: [
        { id: "resumen", label: "Abstract" },
        { id: "atlas", label: "Atlas" },
        { id: "datos", label: "Data" },
        { id: "metodo", label: "Index" },
        { id: "resultados", label: "Results" },
        { id: "decisiones", label: "Decisions" },
        { id: "reproducir", label: "Reproduce" },
      ],
      figures: [
        { value: "19", label: "public sources with a manifest and sha256", note: "financial supervisor, statistics office, ICT and education ministries, national map", href: "#datos" },
        { value: "2018–2025", label: "of annual panel without a single repeated value", note: "264 department rows and 231 growth observations, none duplicated", href: "#datos" },
        { value: "1,123", label: "municipalities in the panel, 1,121 with a polygon", note: "2018–2024 · 7,861 municipal rows", href: "#atlas" },
        { value: "15", label: "published specifications, each with its N and its p", note: "four designs against endogeneity, a wild cluster bootstrap and a placebo", href: "#resultados" },
      ] as Metric[],
      abstract: {
        label: "Abstract",
        body: "Does financial inclusion predict the economic growth of Colombia's departments once you take out the national trends that move all of them at once? To answer it, the project downloads nineteen public sources with a verifiable manifest, resolves every series to the municipal code, models them as a star schema with vintages on dbt and DuckDB, and builds a financial-inclusion index by dimension with frozen, published weights. On top go two annual panels, department and municipality, an interactive atlas, and an econometric battery of two-way fixed effects, cross-sectional and spatial dependence diagnostics, four designs that do not rely on the index being exogenous, and inference built for 33 clusters. The answer is published with its specification, its N and its tests, whatever the sign.",
      },
      data: {
        label: "Data",
        title: "Nineteen public sources, each download fingerprinted",
        items: [
          { title: "Acquisition with a manifest", body: "A purpose-built downloader pages the open-data APIs, verifies the row count against the source, types every column from the portal's metadata and writes Parquet partitioned by year. Each pull records the source date, rows, bytes and sha256 in a versioned manifest." },
          { title: "Geographic keys resolved", body: "The financial supervisor's tables never declare the municipal code, yet they carry it implicitly in the row column. Resolving it gives 100% coverage across the 34 quarterly cuts and avoids name matching, which breaks on accents and aliases." },
          { title: "Dimensional warehouse with dbt", body: "A star schema with vintage-aware facts on DuckDB: department, municipality and period dimensions, plus the supervisor's 98 variables each with its annualisation rule; inclusion in long form by product block." },
          { title: "The schema splice, measured", body: "The current table replaces the previous one in 2021Q1, and that quarter exists in both: a natural test of the splice. The median difference per department is 0.02% and the worst case reaches 1.8%; a dbt test fails if those thresholds break." },
          { title: "Annual frequency, two panels", body: "Subnational GDP is annual, so no annual value is ever repeated across four quarters. The department panel covers 2018 to 2025 with 231 growth observations and none repeated; the municipal one covers 2018 to 2024 on the statistics office's municipal value added." },
          { title: "A zero is not a reading", body: "Zeros from the supervisor and the education ministry are absences, not values: outside each row's product block they disappear by construction. On the map, a territory without colour is one nobody reported, and that is not the same as zero." },
        ],
      },
      method: {
        label: "The index",
        title: "The assumption gets measured before the method is chosen",
        items: [
          { title: "Eight variables, three dimensions", body: "Access, use and depth, each with its variables normalised per adult or per product and standardised over the calibration window. Eighteen candidates were left out, each with its reason written down." },
          { title: "PCA was ruled out by measuring it", body: "Sampling adequacy comes to 0.314 for access and 0.404 for use, below the 0.5 a factor model needs. Forcing it produces negative implicit weights on microcredit — an index that says more credit is less inclusion." },
          { title: "Equal weights, frozen and published", body: "Within each dimension the weights are equal, fixed over the 2018–2019 window and never touched again. Implicit weights per variable are always published, and none may be negative." },
          { title: "Sensitivity in plain sight", body: "PCA and Sarma's distance index are computed the same way and published as alternatives, with the rank correlation between the three versions. None is hidden." },
          { title: "Zero is an average, not an absence", body: "The index is standardised against the average department over the calibration window. A value of 2 is two standard deviations above that average, not \"twice the inclusion\"." },
        ],
      },
      atlas: {
        label: "Atlas",
        title: "The index on the map, by department and by municipality",
        body: "Three views of the same data. Flat, with the metrics around it; raised, to lift one department out and look at it; and municipalities, to go down to all 1,123 units. Pinning a department lets you descend to its municipalities from the map itself, and choosing a region closes the frame in on that selection while the neighbours bleed off the edge.",
        notes: [
          "A territory without colour is not a zero: it is a territory no supervised institution reported that year.",
          "Block height is constant and encodes nothing. A height that depended on the value would let the units in front hide the ones behind, and a unit's reading must not depend on where it falls on the map.",
          "The San Andrés archipelago is a chip drawn off scale: it lies 700 km offshore and covers 26 km², so inside the frame it shrank the map by a fifth to paint a dot.",
          "Two of the panel's 1,123 municipalities have no polygon in the 2024 national map: they appear in the ranking and the figures, but not on the map.",
        ],
      },
      results: {
        label: "Results",
        title: "With entity and time effects, the coefficient is zero",
        headline: "Financial inclusion does not predict departmental growth once the national trend is taken out.",
        stat: "β = +0.0007 · p = 0.90",
        body: "Thirty-three departments, 2019 to 2025, 228 observations. With entity and time fixed effects the composite index does not move real GDP per capita growth: the wild cluster bootstrap gives p = 0.89 and the permutation placebo p = 0.68. Without time effects the same coefficient is +0.024 with p < 0.001. That distance is exactly what the national trend was worth: the index rises in every department at once, and anything else that rises with the years looks like it.",
        tableHead: { spec: "Specification", coef: "β", se: "SE", p: "p", n: "N" },
        rows: [
          { spec: "Entity and time effects (baseline)", coef: "+0.0007", se: "0.0060", p: "0.90", n: "228" },
          { spec: "Baseline with Driscoll-Kraay errors", coef: "+0.0007", se: "0.0037", p: "0.84", n: "228" },
          { spec: "Entity effects only", coef: "+0.0242", se: "0.0050", p: "< 0.001", n: "228" },
          { spec: "In changes of the index", coef: "−0.0071", se: "0.0051", p: "0.16", n: "226" },
          { spec: "CCE, heterogeneous loadings by department", coef: "+0.0014", se: "0.0086", p: "0.87", n: "228" },
          { spec: "SLX, spatial lag of the index", coef: "+0.0046", se: "0.0066", p: "0.49", n: "221" },
          { spec: "Shift-share, 2018 exposure × national adoption", coef: "+0.0182", se: "0.0067", p: "0.007", n: "223" },
        ],
        tiles: [
          { value: "0.89", label: "wild cluster bootstrap p", note: "999 Rademacher draws with the null imposed over 33 departments" },
          { value: "0.68", label: "permutation placebo p", note: "499 shuffles of the index within each year; the real coefficient sits in the middle of the cloud" },
          { value: "2.46", label: "Pesaran CD on the residuals", note: "weak but present cross-sectional dependence (p = 0.014); hence Driscoll-Kraay alongside the cluster" },
        ],
        reading: [
          "The three dimensions on their own, the specification in changes, CCE, SLX and the two alternative indices all give the same thing: zero.",
          "The only design with a signal is the shift-share. It survives initial income as a placebo, but initial urbanisation produces an equally significant slope (+0.051, p = 0.013): it captures that the more urban departments, which are also the more included ones, grew faster over the period. It is a differential slope, not an effect of the index, and it is published as such.",
          "The event study around 2020 cannot test pre-trends — the dependent variable starts in 2019 and the shock is 2020 — and it is published with that limitation written down.",
        ],
      },
      decisions: {
        label: "Decisions",
        title: "Every decision of substance is written before the code",
        body: "The decisions that change a result — frequency, data model, index method, econometric design — go into a decision record with their alternatives, their cost and how to reverse them. Constants live in one place and no published figure exists without the test that holds it up.",
        items: [
          { title: "Annual frequency, two panels", body: "Subnational output is annual and no annual value is spread across four quarters. Temporal disaggregation stays an annex, with its caveats." },
          { title: "Star schema with vintages", body: "Natural keys, one fact per download, and a schema splice measured in the quarter that exists in both sources." },
          { title: "Index by dimension with its assumption measured", body: "Sampling adequacy before factoring; equal weights, frozen and published; alternatives in plain sight." },
          { title: "Econometric design", body: "Two-way fixed effects, diagnostics measured rather than assumed, four designs against endogeneity, and a wild bootstrap because 33 clusters are not enough for the asymptotics." },
          { title: "Derived data under the source's licence", body: "What comes out of the supervisor, the ICT ministry and the education ministry is published CC BY-SA 4.0, with attribution." },
        ],
      },
      reproduce: {
        label: "Reproduce",
        title: "One command brings the whole project up",
        steps: [
          { cmd: "uv sync", body: "Exact dependencies from the lock file. Nothing is installed outside it." },
          { cmd: "uv run iif acquire all", body: "Downloads the nineteen sources, verifies the count against each API and writes the manifest with sha256." },
          { cmd: "make check", body: "Ruff, 91 Python tests, 250 dbt models and tests on DuckDB, and the site render. It exits zero or there is no commit." },
          { cmd: "uv run iif econ", body: "Runs the full econometric battery in under half a minute and writes the file every figure on this page comes from." },
          { cmd: "uv run iif atlas", body: "Generates the geometry and series this map consumes, inside the 3 MB budget the contract sets." },
        ],
        note: "The local and CI engine is DuckDB. BigQuery is kept as an alternative target with a per-query cost cap, and Snowflake as a later demonstration; nothing in the project depends on either staying alive.",
      },
      status: {
        label: "What is there and what is coming",
        title: "The project ships in phases",
        items: [
          "Published: the nineteen sources with a manifest, the full dbt warehouse, the index by dimension with its weights, the two annual panels, the atlas and the econometric battery with its results.",
          "Next: the temporal-disaggregation annex (Chow-Lin, Denton and Fernández on the statistics office's quarterly indicator) and the manuscript.",
          "All the code, the derived data and the decisions are in the repository, versioned.",
        ],
      },
      repoCta: "See the repository",
      backCta: "Back to home",
      atlasCopy: {
        viewLabel: "View",
        views: { plano: "Flat", relieve: "Raised 3D", municipios: "Municipalities" },
        indicatorLabel: "What is painted",
        groups: { indice: "Index", variable: "Index variables", contexto: "Context" },
        yearLabel: "Year",
        regionLabel: "Region",
        departmentLabel: "Department",
        all: "All",
        medianLabel: "Median of the territory",
        medianFoot: "{n} of {total} units with data · {ind}, {y}",
        evolutionLabel: "Evolution",
        dimensionsLabel: "Index dimensions",
        byRegionLabel: "By region",
        byDepartmentLabel: "By department",
        rankingLabel: "Ranking · {n} with data",
        rankingHead: { rank: "#", unit: "Territory", value: "Value" },
        moreUnits: "… {n} units in between",
        noData: "no data",
        noDataYear: "nothing reported that year",
        drillDown: "See the municipalities of {name}",
        offScale: "Archipelago · off scale",
        dimensions: { compuesto: "Composite", acceso: "Access", uso: "Use", profundidad: "Depth" },
        loading: "Loading the map and its series…",
        failed: "The atlas data could not be loaded.",
        sourceLabel: "Source",
        licenceLabel: "Derived series published under",
        licenceName: "CC BY-SA 4.0",
      },
    },
    tracking: {
      metaTitle: "JARVIS — a personal tracking app, with an open demo",
      metaDesc:
        "Daily logging of habits, body, sleep, food and spending on Postgres with row-level security. A public demo running the five real screens on generated data, 526 tests across eight CI gates, and a multi-user model with a row policy on 34 tables.",
      kicker: "Own product · Next.js and Supabase",
      pill: "OPEN DEMO",
      title: "A personal tracking app, and the reason behind every decision",
      subtitle:
        "It closes the day —habits, body, sleep, food, spending— in one form and one button, then hands it back read instead of raw. There is an open demo with the five real screens and the data of someone who does not exist.",
      access: "Private repository · the demo is the public surface",
      timeline: "Public demo and app in production · account sign-up is written and still closed",
      demoUrl: "https://jarvis-app-psi-sable.vercel.app/demo",
      nav: [
        { id: "demo", label: "Demo" },
        { id: "decisiones", label: "Decisions" },
        { id: "datos", label: "Data" },
        { id: "procesos", label: "Process" },
        { id: "seguridad", label: "Security" },
        { id: "estado", label: "Status" },
      ],
      figures: [
        { value: "5", label: "real screens in the demo, not mockups", note: "the app's own, running on data from someone invented", href: "#demo" },
        { value: "0", label: "database queries from the demo", note: "measured in the browser: zero requests and zero submissions across six routes", href: "#seguridad" },
        { value: "526", label: "automated tests across eight CI gates", note: "types, format, lint, tests, build, bundle leak, dependencies and row security", href: "#procesos" },
        { value: "34", label: "tables with a per-user row policy", note: "and the primary keys rebuilt, which is what was really in the way", href: "#datos" },
      ] as Metric[],
      demo: {
        label: "The demo",
        title: "The five real screens, on data from someone who does not exist",
        body:
          "An app whose data is one person's finances and body cannot be shown with screenshots. The demo runs the same five screens —not copies— and the same calculation functions over a hundred and twenty days generated from a seed: the same figures on every reload, so a screenshot never goes stale. Those hundred and twenty days end today, so the demo does not age either.",
        cta: "Open the demo",
        ctaNote: "Everything responds. Nothing is saved.",
        ruleTitle: "The demo never queries the database. Not once.",
        ruleBody:
          "This is not a promise written in a document: a test walks the import graph that exists at runtime from the demo module and fails if any reachable module touches the database client. It is safe by construction rather than by permission — even if the route guard fell, there would be no query to serve. Confirmed in the browser too, across all six routes: zero requests to the database and zero submissions.",
        shotsTitle: "What you see",
        shotsNote: "Captured from the demo itself, with its own banner printed on.",
        shots: [
          { file: "hoy", name: "Today", note: "What is still unlogged, the body, the day's spending and the habits. One sentence reads the day: the dimension furthest from your own baseline." },
          { file: "registro", name: "Log", note: "The whole day in one form and one button. One submission is eight independent writes: if a spending amount is unreadable, weight and habits are still saved." },
          { file: "historia", name: "History", note: "Waist and weight with their gaps left unfilled, spending by category, and habits with a five-state calendar." },
          { file: "finanzas", name: "Finances", note: "The month read by pace, not size: how much you have spent against how much you should have by now, shaped by your own closed months." },
        ],
        personTitle: "What the demo person has, and why",
        person: [
          "Three days paused for a trip, to show that a declared gap is not a failure.",
          "A graduated habit with its note: the explicit exit for a metric that has done its job.",
          "Weight and waist measured three times a week, so the series carry gaps nobody interpolates.",
          "A purchase in twelve instalments and a receivable in five, which is what separates current from deferred spending.",
          "Someone else's pocket, labelled as third-party custody and kept out of every net-worth total.",
        ],
      },
      decisions: {
        label: "Decisions",
        title: "Six decisions, each against a specific way of quitting",
        body:
          "Half of people abandon a tracking app within the first month, and one in eight who quit do so because they already learned what they needed. Those two figures are the starting point: every decision answers a documented way of failing, not an aesthetic preference.",
        items: [
          { title: "A gap and a failure are not the same thing", body: "An unmarked day leaves the denominator; one marked “no” counts as zero; and a day declared paused —travel, illness— counts neither for nor against. Without that distinction, two weeks of ordinary life read as fourteen failures." },
          { title: "Graduating is a happy ending", body: "A habit can be graduated with a note: it stops being asked daily, stays in the history, and no longer drags down everyone else's adherence. It leaves the denominator only from the graduation date onward, because the earlier days already counted and rewriting them would change a history that was true." },
          { title: "The reference is yours, not the average", body: "Each spending category is compared against its budget when it has one and against your own mean when it does not, and the screen always says which. The expected-pace curve is not a straight line: it comes from the shape your own closed months had, because rent is not paid in daily instalments." },
          { title: "Weight is not a goal", body: "There is no progress bar toward a target weight anywhere in the app. Waist has one, because it measures what was actually meant to change. That is the difference between an app that keeps you company and one that watches you." },
          { title: "Never invent a value", body: "An empty field shows empty and series are not interpolated: a straight line between two weigh-ins two weeks apart is not a trend. When there are not enough days to claim something, the app says so instead of claiming it anyway." },
          { title: "The colors were measured, not picked", body: "Every color went through contrast validation in both themes, and the six habit colors carry stepped luminance so they stay apart in greyscale or with color blindness. Calendar states are separated by shape —fill, hatch, outline— which is the only thing that survives a screen in sunlight." },
        ],
      },
      data: {
        label: "Data",
        title: "Postgres with row-level security, and the keys multi-user exposed",
        items: [
          { title: "A policy per row, not per screen", body: "Thirty-three tables and twenty-two views in Postgres, each with its policy and the views in invoker mode. The anonymous role reads nothing: a smoke test walks all fifty-five through the same API the app uses and requires all fifty-five to deny." },
          { title: "What blocked multi-user was not the security layer", body: "It was the primary keys. Twenty-two tables identified rows without the user: measurements by date, habits by date and name, accounts by name. The second person to weigh themselves on a Tuesday got a duplicate-key error, and only one person in the whole system could have an account named after their bank." },
          { title: "Foreign keys carry the user inside", body: "Without it, a transaction could point at someone else's account and row security would not stop it, because a foreign key is validated inside the engine and never passes through the policy." },
          { title: "A zero is not a value", body: "Empty is stored as null, never as zero, and a blank field does not erase what was already measured that day: null keys are stripped from the payload before writing." },
          { title: "The numbers module", body: "A browser number field rejects the decimal comma and reads 10.500 as ten and a half, so an expense was being stored divided by a thousand with nothing to warn you. Every field is text and goes through a purpose-built reader with its rules written and tested; under each one, the exact value about to be stored is shown, already trimmed to the column's decimals." },
          { title: "The charts are hand-written SVG", body: "Thirty lines of arithmetic instead of a charting library: they are tested with the rest of the code without spinning up a browser, and the phone does not download twenty kilobytes to draw six lines." },
        ],
      },
      process: {
        label: "Process",
        title: "Eight gates before a change reaches production",
        body:
          "Every push and every pull request goes through the same chain, and each gate is judged by its exit code rather than by what it prints. The full chain, run against the main branch:",
        gates: [
          { name: "Types", detail: "strict TypeScript, not one error" },
          { name: "Format", detail: "Prettier in check mode" },
          { name: "Lint", detail: "ESLint with the Next config" },
          { name: "Tests", detail: "526 tests across 38 files" },
          { name: "Build", detail: "full production compile" },
          { name: "Bundle leak", detail: "12 personal terms, none in the 28 files served" },
          { name: "Dependencies", detail: "audit with no high-severity findings" },
          { name: "Row security", detail: "55 of 55 checks deny the anonymous role" },
        ],
        guardsTitle: "Four guards against one specific regression each",
        guards: [
          { title: "Demo isolation", body: "Walks the value-import graph from the demo module and fails if any reachable module gets to the database client." },
          { title: "Demo writes", body: "Walks the client components and requires every one that imports a server action to ask whether it is in demo mode, or be exempt with its reason written down." },
          { title: "Conflict keys", body: "Every write with conflict resolution has to start with the user. Without that guard, the move to multi-user broke eleven saves in silence: an immaculate database and an unusable app." },
          { title: "Personal data in the artifact", body: "Runs after the build and against what is served, not the source: the bundler decides what travels to the browser, not the import. It is proven to catch a planted leak." },
        ],
      },
      security: {
        label: "Security",
        title: "Two findings that only appear once a door is opened",
        items: [
          { title: "The bundle is a surface too", body: "Opening the demo exposes more than what the demo paints: it exposes the screens' JavaScript files, because they are the same ones. The real habit list lived in a shared constants module and the bundler shipped the whole module to the browser; two of those names are special-category data. They moved to a server-only module, with two guards behind them. It never became exposed: it was fixed before merging." },
          { title: "A demo write could reach real data, and not over the network", body: "The form draft lives in the phone's own storage keyed by date, and the demo uses today's date. Anyone opening the demo in the same browser they log with would overwrite their real draft for the day, with no visible error. In demo mode the draft no longer reads, saves, clears or queues." },
          { title: "No third parties, and a per-request content policy", body: "No external fonts, no analytics, nobody's scripts. The content security policy is issued with a single-use number on every request, and the offline cache stores no data: only static files and the offline screen. Signing out wipes local storage, which is not encrypted." },
        ],
      },
      status: {
        label: "Status",
        title: "What is live and what is missing",
        liveTitle: "Live today",
        live: [
          "The demo is public and asks for no account: the five screens, on generated data.",
          "The app runs in production for its author, behind a session and row-level security.",
          "The multi-user schema is applied, and isolation between two users was verified with a throwaway account that was deleted afterwards.",
        ],
        pendingTitle: "What is missing before the ten accounts open",
        pending: [
          "Sign-up is written and tested, and closed in two places at once: a row in the database and the sign-up switch in the auth panel, which still answers that registration is disabled.",
          "The confirmation email needs its own sending server: the bundled one is rate-limited by the hour, and with ten sign-ups on the same day somebody ends up with an account they cannot confirm.",
          "The four email templates have to point at the app's confirmation route; the provider's defaults go to its own endpoint, and then the link looks like it does nothing.",
        ],
        note: "That is why this page links the demo and not a sign-up form: publishing a create-account button that returns an error today would be worse than not publishing it.",
      },
      backCta: "Back to home",
    },
    track: {
      title: "Track record",
      fullCv: "See full CV",
      rows: [
        {
          period: "2026 — present",
          title: "Business Consultant, FP&A · Neoris EPAM",
          desc: "Financial management systems for North America: close, forecast and SG&A variance across 12 countries. Fully remote.",
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
    cv: {
      title: "Davirson Novoa Ramírez",
      // The title mapping: the three names job posts give the same crossover
      // role. It is the heading, not a subtitle.
      targetsLabel: "Target roles",
      targets: ["Finance Data Analyst", "Financial BI Analyst", "Analytics Engineer"],
      subtitle: "Economist and FP&A consultant who builds the data infrastructure he works from.",
      metaLine: "Bogotá, Colombia · GMT-5 · Fully remote · English B2 · Portuguese A2",
      download: "Download resume (PDF)",
      downloadHref: "/Davirson_Novoa_Resume_EN.pdf",
      latex: "LaTeX source",
      latexHref: "/Davirson_Novoa_Resume_EN.tex",
      latexNote: "Compiles in Overleaf with nothing to install.",
      contactBtn: "Contact",
      facts: [
        { value: "15+", label: "countries in the operations I report on" },
        { value: "60 hrs/mo", label: "of reporting given back to the team (10 per analyst)" },
        { value: "26 months", label: "from intern to specialist" },
        { value: "48", label: "assets in a daily pipeline I run" },
      ],
      profileLabel: "Profile",
      profileText:
        "Economist with three years inside corporate finance — treasury, billing and FP&A — building the data the business runs on: Python, SQL and Power BI applied to operations across 15+ countries in the Americas. I now run a production PostgreSQL warehouse in medallion architecture, with dbt transformations, 89 automated quality tests and a Power BI semantic model, refreshed daily with no manual step. I am looking for a remote role where financial judgment and data engineering are paid as one capability, not two halves.",
      pivot: {
        label: "The crossover role",
        body: "This is not a career change; it is pricing what I already do. In every finance role I ended up building the same thing — code and data — because the report the business needed did not exist. An FX mismatch analysis in Python as an intern. Automation that gave every treasury analyst about 10 hours a month back — close to 60 a month across the team. Power BI models that turned a monthly close into a decision. The edge is not knowing Python; it is knowing which question is worth answering before writing any. A Finance Data Analyst is neither a data analyst who picked up finance nor a finance person who picked up code — it is the one who needs no translator between them.",
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
                "Designed and led 3 financial management systems for SG&A close and forecast across North America, impacting 12 countries/regions.",
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
        { name: "Excel and financial modelling", proof: "SG&A close and forecast across 12 countries at Neoris EPAM" },
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

export type Dictionary = (typeof dictionaries)["es"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** El acceso por corchetes sobre el objeto literal alcanzaba la cadena de
 *  prototipos: `dictionaries["__proto__"]` devuelve `Object.prototype`, que es
 *  truthy, así que el `??` no saltaba y la página reventaba con un 500 en vez
 *  de degradar. La lista blanca es la única lectura correcta de un locale. */
export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries.es;
}
