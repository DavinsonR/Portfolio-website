// ============================================================
// LA HISTORIA — `/[lang]/historia`
//
// La página que convierte una lista de proyectos en una trayectoria. Es la
// única del sitio escrita en PRIMERA PERSONA: el resto habla de la persona,
// esta habla la persona. Una historia en tercera persona suena a biografía
// institucional.
//
// Ninguna cifra es nueva. Todas salen de `cv.ts`, `projects.ts` o de los
// repositorios, y son las mismas que el resto del sitio publica con su enlace
// al artefacto que las prueba. La regla no se relaja porque el texto sea
// narrativo — si algo aquí no se puede comprobar, no está aquí.
//
// El orden es cronológico salvo el cierre: la sección 6 es la tesis del texto
// y va al final, no al principio, porque solo significa algo después de haber
// leído las cinco anteriores.
// ============================================================

export const historia = {
  es: {
    historia: {
      metaTitle: "La historia — no cambié de carrera, le puse precio a lo que ya hacía",
      metaDesc:
        "De un análisis de descalce cambiario hecho por un practicante a una plataforma de datos que corre sola. La línea que une tres años de finanzas corporativas con una tesis, un warehouse y un modelo de crédito que se audita a sí mismo.",
      kicker: "Trayectoria · en primera persona",
      title: "No cambié de carrera. Le puse precio a lo que ya hacía.",
      intro:
        "Tres años dentro de finanzas corporativas y, en cada puesto, terminé construyendo lo mismo: el dato que el negocio necesitaba y que no existía. Esta es la línea que une un análisis de descalce cambiario hecho por un practicante con una plataforma de datos que hoy corre sola todos los días.",
      navLabel: "En esta página",
      readTime: "7 minutos de lectura · cada cifra enlaza a su prueba",
      sections: [
        {
          id: "origen",
          nav: "El reporte que no existía",
          num: "01",
          title: "El reporte que no existía",
          body: [
            "Entré a la tesorería de SLB como practicante en enero de 2024. El trabajo era conciliar, reportar, cerrar. Y como en todo equipo de finanzas, el reporte que alguien necesitaba de verdad nunca era el que el sistema sabía dar.",
            "El primero fue el descalce cambiario de los mercados latinoamericanos. No existía una vista que lo mostrara, así que la construí en Python. No fue una decisión de carrera: fue que la pregunta era buena y la herramienta que había no la respondía.",
            "Después vino la conciliación bancaria automatizada en SAP. Esa devolvió unas diez horas al mes a cada analista de tesorería — cerca de sesenta al mes en todo el equipo. Es la cifra que mejor explica por qué seguí: nadie me pidió que automatizara nada. Lo hice porque el trabajo manual era la parte aburrida de una pregunta interesante.",
            "De practicante a especialista de facturación para Argentina y Brasil en veintiséis meses. Entre medias, reconocimiento de ingresos en SAP bajo Sarbanes-Oxley y auditorías internas sobre proyectos de tecnología. Ahí aprendí algo que no estaba en el temario: un número que no se puede auditar no vale nada, por bueno que sea. Esa frase reaparece al final de esta página, y no por casualidad.",
          ],
          proofLabel: "Ver en el CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "patron",
          nav: "El patrón",
          num: "02",
          title: "El patrón",
          body: [
            "En Neoris/EPAM el alcance creció: sistemas de gestión financiera para el cierre y el forecast de gastos SG&A en más de quince países, entre América y el hemisferio oriental — India, Hungría, España, República Checa. Cierre mensual, confirmación del forecast a nivel compañía, variaciones contra plan y contra forecast anterior, seguimiento de la variación cambiaria en moneda constante.",
            "Y otra vez lo mismo: Excel avanzado, Power Query, Power BI, MicroStrategy, JD Edwards, SAP — y debajo, código, porque la pieza que faltaba siempre era el dato, no la presentación.",
            "Ahí dejé de verlo como una serie de casualidades. En cada rol de finanzas terminé construyendo la misma cosa. La ventaja no es saber Python; mucha gente sabe Python. La ventaja es saber qué pregunta vale la pena responder antes de escribir la primera línea.",
          ],
          verdict:
            "Un Finance Data Analyst no es un analista de datos que aprendió finanzas ni un financiero que aprendió a programar: es el que no necesita traductor entre las dos cosas.",
          proofLabel: "Ver en el CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "nombre",
          nav: "Ponerle nombre",
          num: "03",
          title: "Ponerle nombre",
          body: [
            "La maestría en Economía en la Javeriana fue el sitio donde ese patrón dejó de ser un hábito y pasó a ser un método. La tesis pregunta si la inclusión financiera explica el crecimiento regional en Colombia.",
            "Para responderla hacía falta un dato que tampoco existía: junté diecinueve fuentes públicas en un warehouse dimensional con dbt y DuckDB, construí un índice de inclusión por dimensiones y levanté un atlas de los 1.123 municipios del país.",
            "Y entonces el resultado no salió.",
            "Al añadir efectos de tiempo, el coeficiente se cae a cero. La especificación ingenua —solo efectos de entidad— publica un +0,0242 con p < 0,001 que no significa nada: lo que recoge es que todo el país subió a la vez.",
          ],
          drift: {
            caption: "Índice compuesto de inclusión financiera, estandarizado contra 2018",
            colYear: "año",
            colMedian: "mediana",
            colBelow: "departamentos bajo cero",
            rows: [
              { year: "2018", median: "−0,02", below: "17 de 32" },
              { year: "2021", median: "+1,20", below: "4 de 33" },
              { year: "2025", median: "+2,47", below: "1 de 32" },
            ],
          },
          bodyAfter: [
            "Esa deriva común es el hallazgo, no el ruido. Publiqué el nulo: está en la página, con los dos mapas en la misma escala para que se vea por qué. Un resultado nulo bien medido dice más sobre cómo trabajo que un coeficiente bonito, y el que lo lee sabe distinguirlos.",
          ],
          proofLabel: "Abrir la investigación",
          proofHref: "/research/fintech-inclusion",
        },
        {
          id: "plataforma",
          nav: "Construirlo entero",
          num: "04",
          title: "Construirlo entero",
          body: [
            "La tesis me dejó una pregunta incómoda: sabía hacer el análisis, pero la infraestructura la había armado a mano cada vez. Así que construí una de verdad.",
            "market-data-medallion es un warehouse en PostgreSQL con arquitectura medallion, transformaciones en dbt, ochenta y nueve pruebas automáticas de calidad y un cron diario que trae cuarenta y ocho activos —cripto, ETFs, acciones de EE. UU., ADR latinoamericanos y divisas— sin que yo toque nada. Lleva un modelo semántico de Power BI encima.",
            "Y un backtester honesto. Cinco estrategias técnicas clásicas y todas sus combinaciones: 1.392 variantes evaluadas con comisiones, slippage y sin look-ahead. Entraron más de mil trescientas. Sobrevivieron menos de cincuenta a la validación fuera de muestra.",
            "Ese número es el producto. La mayoría de las estrategias ganadoras eran ilusiones del backtest, y la manera de demostrarlo fue partir cada serie en 70% de entrenamiento y 30% que el modelo nunca vio. Sin esa ventana ciega, elegir la mejor de 1.392 variantes no es análisis: es dragado de datos con buena presentación.",
          ],
          proofLabel: "Abrir el laboratorio",
          proofHref: "/projects/trading-sim",
        },
        {
          id: "cifra",
          nav: "La cifra que borré",
          num: "05",
          title: "La cifra que borré",
          body: [
            "El proyecto más reciente es un sistema de decisión crediticia sobre 1,96 millones de préstamos SBA y 93,4 millones de solicitudes HMDA, datos públicos de Estados Unidos.",
            "La primera medición dio AUC 0,9461.",
            "Eso no es un modelo de crédito. Es una fuga. «TermInMonths» se sobrescribe cuando un préstamo se liquida, así que el campo llevaba dentro el resultado que yo decía estar prediciendo. Quitarlo derrumba la ablación a 0,6621.",
            "El modelo en producción está en 0,7005: +0,0311 sobre una scorecard WoE interpretable, con error de calibración de 0,0107. Son cifras mucho menos vistosas que 0,9461 y son las únicas que se sostienen.",
            "El sistema tiene diez gates de promoción y uno de ellos está diseñado para bloquear mi propio modelo cuando no cumple. Eso es lo que quería construir: no un modelo que gane, sino uno que sobreviva a una auditoría — la misma idea que me encontré en las auditorías internas de SLB, cuatro años antes, desde el otro lado de la mesa.",
          ],
          verdict: "Mi primera cifra honesta fue una que borré.",
          proofLabel: "Abrir el sistema de crédito",
          proofHref: "/projects/credit-risk",
        },
        {
          id: "hilo",
          nav: "Lo que sostiene todo",
          num: "06",
          title: "Lo que sostiene todo",
          body: [
            "Hay un hilo que atraviesa las tres cosas y es más importante que cualquiera de ellas: publico lo que falla.",
            "El resultado nulo de la tesis está publicado. La fuga del 0,9461 está escrita en el README con el número exacto. De 1.392 estrategias, el titular es cuántas murieron. Y este mismo sitio lleva una bitácora con treinta y cinco fallos numerados, cada uno con su causa raíz y su corrección — incluidos los que rompí esta semana.",
            "No es humildad de escaparate. Es que un portafolio donde todo salió bien no se puede verificar, y uno donde los errores están fechados sí. Cada cifra de este sitio enlaza al artefacto que la produce: el repositorio, el commit, el pipeline. Si algo no se puede comprobar, no está publicado.",
          ],
          verdict: "Publico lo que falla.",
          proofLabel: "Ver la bitácora de fallos",
          proofHref: "https://github.com/DavinsonR/proyecto-davirson/blob/main/docs/FALLOS.md",
        },
        {
          id: "donde",
          nav: "Hacia dónde",
          num: "07",
          title: "Hacia dónde",
          body: [
            "Busco un rol remoto donde el criterio financiero y la ingeniería de datos se paguen como una sola capacidad, no como dos mitades. Finance Data Analyst, Financial BI Analyst, Analytics Engineer — los tres nombres que las vacantes le dan al mismo puesto.",
            "Bogotá, GMT-5, solapamiento completo con horario de Estados Unidos. La evidencia está a un clic: el código es público, las cifras enlazan a su fuente, y los fallos también.",
          ],
        },
      ],
      ctaTitle: "¿Buscas a alguien que entienda el negocio y construya los datos?",
      ctaBody: "Respondo en español e inglés.",
      ctaEmail: "Escribir un correo",
      ctaCv: "Descargar el CV",
    },
  },
  en: {
    historia: {
      metaTitle: "The story — I did not change careers, I priced what I already did",
      metaDesc:
        "From an FX mismatch analysis written by an intern to a data platform that runs itself. The line connecting three years of corporate finance with a thesis, a warehouse and a credit model that audits itself.",
      kicker: "Track record · first person",
      title: "I did not change careers. I priced what I already did.",
      intro:
        "Three years inside corporate finance and, in every role, I ended up building the same thing: the data the business needed and did not have. This is the line connecting an FX mismatch analysis written by an intern with a data platform that now runs itself every day.",
      navLabel: "On this page",
      readTime: "7 minute read · every figure links to its proof",
      sections: [
        {
          id: "origen",
          nav: "The report that did not exist",
          num: "01",
          title: "The report that did not exist",
          body: [
            "I joined SLB's treasury as an intern in January 2024. The job was to reconcile, report, close. And as in every finance team, the report someone actually needed was never the one the system knew how to give.",
            "The first was the FX mismatch across Latin American markets. No view showed it, so I built one in Python. It was not a career decision: the question was good and the tool at hand did not answer it.",
            "Then came automated bank reconciliation in SAP. That one gave every treasury analyst about ten hours a month back — close to sixty a month across the team. It is the figure that best explains why I kept going: nobody asked me to automate anything. I did it because the manual work was the boring part of an interesting question.",
            "Intern to billing specialist for Argentina and Brazil in twenty-six months. Along the way, revenue recognition in SAP under Sarbanes-Oxley and internal audits on technology projects. That is where I learned something that was not on the syllabus: a number nobody can audit is worth nothing, however good it is. That sentence comes back at the end of this page, and not by accident.",
          ],
          proofLabel: "See it in the CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "patron",
          nav: "The pattern",
          num: "02",
          title: "The pattern",
          body: [
            "At Neoris/EPAM the scope grew: financial management systems for SG&A close and forecast across 15+ countries, in the Americas and the Eastern Hemisphere — India, Hungary, Spain, the Czech Republic. Monthly close, company-wide forecast confirmation, variances against plan and prior forecast, FX variance tracked in constant currency.",
            "And again the same thing: advanced Excel, Power Query, Power BI, MicroStrategy, JD Edwards, SAP — and underneath, code, because the missing piece was always the data, not the presentation.",
            "That is when I stopped reading it as a run of coincidences. In every finance role I ended up building the same thing. The edge is not knowing Python; plenty of people know Python. The edge is knowing which question is worth answering before writing the first line.",
          ],
          verdict:
            "A Finance Data Analyst is neither a data analyst who picked up finance nor a finance person who picked up code: it is the one who needs no translator between them.",
          proofLabel: "See it in the CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "nombre",
          nav: "Giving it a name",
          num: "03",
          title: "Giving it a name",
          body: [
            "The MSc in Economics at Javeriana was where that pattern stopped being a habit and became a method. The thesis asks whether financial inclusion explains regional growth in Colombia.",
            "Answering it needed data that also did not exist: I pulled nineteen public sources into a dimensional warehouse with dbt and DuckDB, built an inclusion index by dimension, and raised an atlas of all 1,123 municipalities in the country.",
            "And then the result did not come.",
            "Adding time effects collapses the coefficient to zero. The naive specification — entity effects only — publishes a +0.0242 at p < 0.001 that means nothing: what it captures is that the whole country rose at once.",
          ],
          drift: {
            caption: "Composite financial-inclusion index, standardised against 2018",
            colYear: "year",
            colMedian: "median",
            colBelow: "departments below zero",
            rows: [
              { year: "2018", median: "−0.02", below: "17 of 32" },
              { year: "2021", median: "+1.20", below: "4 of 33" },
              { year: "2025", median: "+2.47", below: "1 of 32" },
            ],
          },
          bodyAfter: [
            "That common drift is the finding, not the noise. I published the null: it is on the page, with both maps on the same scale so you can see why. A well-measured null says more about how I work than a pretty coefficient, and the person reading it can tell the difference.",
          ],
          proofLabel: "Open the research",
          proofHref: "/research/fintech-inclusion",
        },
        {
          id: "plataforma",
          nav: "Building the whole thing",
          num: "04",
          title: "Building the whole thing",
          body: [
            "The thesis left me with an uncomfortable question: I knew how to do the analysis, but I had assembled the infrastructure by hand every time. So I built a real one.",
            "market-data-medallion is a PostgreSQL warehouse in medallion architecture, transformations in dbt, eighty-nine automated quality tests and a daily cron that brings in forty-eight assets — crypto, ETFs, US equities, Latin American ADRs and currencies — without me touching anything. It carries a Power BI semantic model on top.",
            "And an honest backtester. Five classic technical strategies and every possible combination of them: 1,392 variants evaluated with fees, slippage and no look-ahead. More than thirteen hundred went in. Fewer than fifty survived out-of-sample validation.",
            "That number is the product. Most of the winning strategies were backtest illusions, and the way to prove it was to split every series into 70% training and 30% the model never saw. Without that blind window, picking the best of 1,392 variants is not analysis: it is data dredging with good presentation.",
          ],
          proofLabel: "Open the lab",
          proofHref: "/projects/trading-sim",
        },
        {
          id: "cifra",
          nav: "The number I deleted",
          num: "05",
          title: "The number I deleted",
          body: [
            "The most recent project is a credit decisioning system over 1.96 million SBA loans and 93.4 million HMDA applications, US public data.",
            "The first reading was AUC 0.9461.",
            "That is not a credit model. It is a leak. TermInMonths is overwritten when a loan is liquidated, so the field carried inside it the outcome I claimed to be predicting. Removing it drops the ablation to 0.6621.",
            "The production model sits at 0.7005: +0.0311 over an interpretable WoE scorecard, with a calibration error of 0.0107. Far less impressive figures than 0.9461, and the only ones that hold.",
            "The system has ten promotion gates and one of them is designed to block my own model when it does not comply. That is what I wanted to build: not a model that wins, but one that survives an audit — the same idea I met in SLB's internal audits, four years earlier, from the other side of the table.",
          ],
          verdict: "My first honest number was a deleted one.",
          proofLabel: "Open the credit system",
          proofHref: "/projects/credit-risk",
        },
        {
          id: "hilo",
          nav: "What holds it together",
          num: "06",
          title: "What holds it together",
          body: [
            "There is a thread running through all three and it matters more than any of them: I publish what fails.",
            "The thesis null is published. The 0.9461 leak is written in the README with the exact number. Of 1,392 strategies, the headline is how many died. And this very site carries a log of thirty-five numbered defects, each with its root cause and its fix — including the ones I broke this week.",
            "This is not shop-window humility. It is that a portfolio where everything went well cannot be verified, and one where the mistakes are dated can. Every figure on this site links to the artifact that produces it: the repository, the commit, the pipeline. If something cannot be checked, it is not published.",
          ],
          verdict: "I publish what fails.",
          proofLabel: "See the defect log",
          proofHref: "https://github.com/DavinsonR/proyecto-davirson/blob/main/docs/FALLOS.md",
        },
        {
          id: "donde",
          nav: "Where this goes",
          num: "07",
          title: "Where this goes",
          body: [
            "I am looking for a remote role where financial judgment and data engineering are paid as one capability, not two halves. Finance Data Analyst, Financial BI Analyst, Analytics Engineer — the three names job posts give the same position.",
            "Bogotá, GMT-5, full overlap with US hours. The evidence is one click away: the code is public, the figures link to their source, and so do the failures.",
          ],
        },
      ],
      ctaTitle: "Hiring someone who reads the business and builds the data?",
      ctaBody: "I answer in English and Spanish.",
      ctaEmail: "Write an email",
      ctaCv: "Download the CV",
    },
  },
};
