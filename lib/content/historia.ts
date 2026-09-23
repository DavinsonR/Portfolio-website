// ============================================================
// LA HISTORIA — `/[lang]/historia`
//
// La página que convierte una lista de proyectos en una trayectoria. Es la
// única del sitio escrita en PRIMERA PERSONA y en registro cálido: el resto
// habla DE la persona, esta la habla. Una trayectoria en tercera persona suena
// a biografía institucional, y lo que hay que transmitir aquí no es autoridad
// sino criterio.
//
// El registro es deliberado y tiene reglas:
//   · se le habla a UNA persona («te cuento», «si llegaste hasta acá»);
//   · se admite lo que no se eligió, no solo lo que se hizo («podía haber
//     publicado el +0,0242 y nadie me habría dicho nada»);
//   · se admite el sentimiento donde lo hubo, una vez y sin adornarlo
//     («por un rato me sentí muy bien»);
//   · español colombiano, no neutro de agencia.
//
// Lo que el registro NO cambia: ninguna cifra es nueva. Todas salen de
// `cv.ts`, `projects.ts` o de los repositorios, y cada sección enlaza al
// artefacto que la prueba. La regla no se relaja porque el texto sea cálido —
// si algo aquí no se puede comprobar, no está aquí.
//
// El orden es cronológico salvo el cierre: la sección 6 es la tesis del texto
// y va al final porque solo significa algo después de haber leído las cinco
// anteriores.
// ============================================================

import { FALLOS_LOG } from "./types";

export const historia = {
  es: {
    historia: {
      metaTitle: "La historia — no cambié de carrera, ya la estaba haciendo",
      metaDesc:
        "De un análisis que escribí de practicante a una plataforma que corre sola mientras duermo. La línea recta que conecta tres años de finanzas corporativas con una tesis, un warehouse y un modelo de crédito que se audita a sí mismo — incluido el AUC de 0,9461 que resultó ser mentira, y que publiqué igual.",
      kicker: "Trayectoria · en primera persona",
      title: "No cambié de carrera. Apenas le puse nombre a lo que ya venía haciendo.",
      intro:
        "Llevo tres años en finanzas corporativas y en cada puesto terminé haciendo lo mismo sin que nadie me lo pidiera: construir el dato que hacía falta y que no existía. Nunca lo planeé así. Esta es la línea —y es una línea recta— que conecta un análisis que escribí de practicante, un martes cualquiera, con una plataforma que hoy corre sola mientras yo duermo.",
      navLabel: "En esta página",
      readTime: "7 minutos · cada cifra de esta página enlaza al artefacto que la prueba",
      sections: [
        {
          id: "origen",
          nav: "El reporte que no existía",
          num: "01",
          title: "El reporte que no existía",
          body: [
            "Entré a la tesorería de SLB en enero de 2024, de practicante. El trabajo era conciliar, reportar, cerrar. Y me pasó lo que le pasa a todo el que entra a un equipo de finanzas: el reporte que de verdad hacía falta nunca era el que el sistema sabía dar.",
            "El primero fue el descalce cambiario de los mercados latinoamericanos. No existía una vista que lo mostrara. Así que la hice en Python.",
            "No lo pienses como una decisión de carrera, porque no lo fue. Fue que la pregunta me pareció buena y la herramienta que tenía a mano no la respondía. Así de simple, y así de poco heroico.",
            "Después vino la conciliación bancaria automatizada en SAP. Esa le devolvió unas diez horas al mes a cada analista del equipo — como sesenta al mes entre todos. Es la cifra que mejor explica por qué seguí: nadie me pidió que automatizara nada. Lo hice porque la parte manual era la parte aburrida de algo que sí me estaba pareciendo interesante.",
            "De practicante a especialista de facturación para Argentina y Brasil en veintiséis meses. En el camino, reconocimiento de ingresos en SAP bajo Sarbanes-Oxley y auditorías internas sobre proyectos de tecnología. Ahí aprendí algo que ningún curso me había dicho: un número que nadie puede auditar no sirve, por bonito que se vea. Guarda esa frase. Vuelve al final, y no por casualidad.",
          ],
          proofLabel: "Ver en el CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "patron",
          nav: "Cuando vi el patrón",
          num: "02",
          title: "Cuando me di cuenta de que era un patrón",
          body: [
            "En Neoris/EPAM la cosa creció. Sistemas de gestión financiera para el cierre y el forecast de SG&A en más de quince países — América y también el hemisferio oriental: India, Hungría, España, República Checa. Cierre mensual, confirmación del forecast de toda la compañía, variaciones contra plan y contra el forecast anterior, la variación cambiaria en moneda constante.",
            "Y otra vez lo mismo. Excel avanzado, Power Query, Power BI, MicroStrategy, JD Edwards, SAP — y debajo de todo eso, código, porque la pieza que faltaba siempre era el dato, nunca la presentación.",
            "Fue ahí que dejé de verlo como una serie de casualidades. En todos los roles de finanzas terminé construyendo lo mismo. Y entendí cuál era la ventaja, que no es la que uno cree: no es saber Python. Python lo sabe muchísima gente. Es saber qué pregunta vale la pena responder antes de escribir la primera línea.",
          ],
          verdict:
            "Un Finance Data Analyst no es un analista de datos que aprendió finanzas, ni un financiero que aprendió a programar. Es el que no necesita traductor entre las dos cosas.",
          proofLabel: "Ver en el CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "nombre",
          nav: "Ponerle nombre",
          num: "03",
          title: "Ponerle nombre",
          body: [
            "La maestría en Economía en la Javeriana fue donde ese hábito se volvió método. La tesis pregunta si la inclusión financiera explica el crecimiento regional en Colombia.",
            "Para responderla hacía falta, otra vez, un dato que no existía. Junté diecinueve fuentes públicas en un warehouse dimensional con dbt y DuckDB, armé un índice de inclusión por dimensiones y levanté un atlas de los 1.123 municipios del país.",
            "Y el resultado no salió.",
            "Te cuento qué pasó, porque es la parte que importa. Al meter efectos de tiempo, el coeficiente se cae a cero. La especificación ingenua —solo efectos de entidad— publica un +0,0242 con p < 0,001 que suena muy bien y no significa nada. Lo que está recogiendo es otra cosa: que todo el país subió al tiempo.",
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
            "Esa subida común es el hallazgo. No es el ruido, es la respuesta.",
            "Podía haber publicado el +0,0242 y nadie me habría dicho nada. Publiqué el nulo. Está en la página, con los dos mapas en la misma escala para que se vea por qué. Un resultado nulo bien medido dice más de cómo trabajo que un coeficiente bonito, y el que sabe leer nota la diferencia.",
          ],
          proofLabel: "Abrir la investigación",
          proofHref: "/research/fintech-inclusion",
        },
        {
          id: "plataforma",
          nav: "Construirlo entero",
          num: "04",
          title: "Construirlo entero, esta vez",
          body: [
            "La tesis me dejó incómodo. Sabía hacer el análisis, sí, pero la infraestructura la había armado a pedazos cada vez, a mano. Así que me senté a construir una de verdad.",
            "market-data-medallion es un warehouse en PostgreSQL con arquitectura medallion, transformaciones en dbt, ochenta y nueve pruebas automáticas de calidad y un cron diario que trae cuarenta y ocho activos —cripto, ETFs, acciones gringas, ADR latinoamericanos, divisas— sin que yo toque absolutamente nada. Encima lleva un modelo semántico de Power BI.",
            "Y un backtester honesto, que es donde se pone interesante. Cinco estrategias técnicas clásicas y todas sus combinaciones posibles: 1.392 variantes, con comisiones, con slippage y sin look-ahead. Entraron {variants}. Sobrevivieron {survivors}.",
            "Ese número es el producto. No las {survivors} que quedaron: las {eliminated} que no. Casi todas las estrategias ganadoras eran ilusiones del backtest, y la única forma de demostrarlo fue partir cada serie en 70% de entrenamiento y 30% que el modelo nunca vio. Sin esa ventana ciega, escoger la mejor de 1.392 no es análisis — es dragado de datos con buena presentación.",
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
            "La primera medición me dio AUC 0,9461.",
            "Y te voy a ser honesto: por un rato me sentí muy bien.",
            "Pero eso no es un modelo de crédito. Es una fuga. «TermInMonths» se sobrescribe cuando el préstamo se liquida, así que ese campo llevaba adentro exactamente el resultado que yo decía estar prediciendo. Quitarlo derrumba la ablación a 0,6621.",
            "El modelo que quedó en producción está en 0,7005 — +0,0311 sobre una scorecard WoE interpretable, con error de calibración de 0,0107. Mucho menos vistoso que 0,9461. Y es lo único que se sostiene.",
          ],
          verdict: "El número que me hizo quedar bien duró dos días. El que publiqué lleva meses aguantando.",
          bodyAfter: [
            "El sistema tiene diez gates de promoción y uno está diseñado para bloquear mi propio modelo cuando no cumple. Eso era lo que quería construir: no un modelo que gane, sino uno que aguante una auditoría. Que es, mirándolo bien, la misma idea que me encontré en las auditorías internas de SLB cuatro años antes — solo que entonces yo estaba del otro lado de la mesa.",
          ],
          proofLabel: "Abrir el sistema de crédito",
          proofHref: "/projects/credit-risk",
        },
        {
          id: "hilo",
          nav: "Lo que sostiene todo",
          num: "06",
          title: "Lo que sostiene todo",
          body: [
            "Hay un hilo que atraviesa las tres cosas y me importa más que cualquiera de ellas: publico lo que falla.",
            "El nulo de la tesis está publicado. La fuga del 0,9461 está en el README con el número exacto, sin maquillar. De 1.392 estrategias, el titular es cuántas se murieron. Y este mismo sitio carga una bitácora de fallos numerados, cada uno con su causa raíz y su corrección — incluidos los que rompí esta semana.",
            "No es humildad de vitrina, y quiero ser claro en eso. Es algo más aburrido y más útil: un portafolio donde todo salió bien no se puede verificar. Uno donde los errores están fechados, sí. Cada cifra de este sitio enlaza al artefacto que la produce — el repositorio, el commit, el pipeline. Si algo no se puede comprobar, no lo publico.",
          ],
          verdict: "Publico lo que falla.",
          proofLabel: "Ver la bitácora de fallos",
          proofHref: FALLOS_LOG,
        },
        {
          id: "donde",
          nav: "Hacia dónde voy",
          num: "07",
          title: "Hacia dónde voy",
          body: [
            "Busco un rol remoto donde el criterio financiero y la ingeniería de datos se paguen como una sola capacidad y no como dos mitades. Finance Data Analyst, Financial BI Analyst, Analytics Engineer — tres nombres distintos para el mismo puesto, según a quién le preguntes.",
            "Estoy en Bogotá, GMT-5, con solapamiento completo con el horario de Estados Unidos.",
            "Y si llegaste hasta acá, lo demás está a un clic: el código es público, las cifras enlazan a su fuente, y los errores también.",
          ],
        },
      ],
      ctaTitle: "Deja de elegir entre el que entiende el negocio y el que construye los datos.",
      ctaBody: "Si lo de arriba se parece a lo que necesitas, escríbeme y hablamos esta semana. Respondo en español e inglés.",
      ctaEmail: "Escribir un correo",
      ctaCv: "Descargar el CV",
    },
  },
  en: {
    historia: {
      metaTitle: "The story — I didn't switch careers, I was already doing this one",
      metaDesc:
        "From an analysis I wrote as an intern to a platform that runs itself while I sleep. The straight line connecting three years of corporate finance with a thesis, a warehouse and a credit model that audits itself — including the 0.9461 AUC that turned out to be a lie, and that I published anyway.",
      kicker: "Track record · first person",
      title: "I didn't switch careers. I just put a name to what I was already doing.",
      intro:
        "Three years in corporate finance, and in every role I ended up doing the same thing without anyone asking me to: building the data that was missing. I never planned it that way. This is the line — and it is a straight one — connecting an analysis I wrote as an intern, on some ordinary Tuesday, with a platform that now runs itself while I sleep.",
      navLabel: "On this page",
      readTime: "7 minutes · every figure on this page links to the artifact that proves it",
      sections: [
        {
          id: "origen",
          nav: "The report that didn't exist",
          num: "01",
          title: "The report that didn't exist",
          body: [
            "I joined SLB's treasury in January 2024, as an intern. The job was to reconcile, report, close. And what happens to everyone who joins a finance team happened to me: the report someone actually needed was never the one the system knew how to give.",
            "The first was the FX mismatch across Latin American markets. No view showed it. So I built one in Python.",
            "Don't read that as a career decision, because it wasn't. The question struck me as a good one and the tool at hand didn't answer it. That simple, and that unheroic.",
            "Then came automated bank reconciliation in SAP. That one gave every analyst on the team about ten hours a month back — around sixty a month between all of us. It's the figure that best explains why I kept going: nobody asked me to automate anything. I did it because the manual part was the boring part of something that was actually getting interesting.",
            "Intern to billing specialist for Argentina and Brazil in twenty-six months. Along the way, revenue recognition in SAP under Sarbanes-Oxley and internal audits on technology projects. That's where I learned something no course had told me: a number nobody can audit is worth nothing, however good it looks. Hold on to that one. It comes back at the end, and not by accident.",
          ],
          proofLabel: "See it in the CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "patron",
          nav: "When I saw the pattern",
          num: "02",
          title: "When I realised it was a pattern",
          body: [
            "At Neoris/EPAM it grew. Financial management systems for SG&A close and forecast across more than fifteen countries — the Americas, and the Eastern Hemisphere too: India, Hungary, Spain, the Czech Republic. Monthly close, company-wide forecast confirmation, variances against plan and against prior forecast, FX variance in constant currency.",
            "And again, the same thing. Advanced Excel, Power Query, Power BI, MicroStrategy, JD Edwards, SAP — and underneath all of it, code, because the missing piece was always the data, never the presentation.",
            "That's when I stopped reading it as a run of coincidences. In every finance role I ended up building the same thing. And I worked out where the edge actually is, which isn't where people think: it isn't knowing Python. Plenty of people know Python. It's knowing which question is worth answering before you write the first line.",
          ],
          verdict:
            "A Finance Data Analyst isn't a data analyst who picked up finance, or a finance person who picked up code. It's the one who needs no translator between them.",
          proofLabel: "See it in the CV",
          proofHref: "/cv#experiencia",
        },
        {
          id: "nombre",
          nav: "Giving it a name",
          num: "03",
          title: "Giving it a name",
          body: [
            "The MSc in Economics at Javeriana is where that habit turned into a method. The thesis asks whether financial inclusion explains regional growth in Colombia.",
            "Answering it needed, once again, data that didn't exist. I pulled nineteen public sources into a dimensional warehouse with dbt and DuckDB, built an inclusion index by dimension, and raised an atlas of all 1,123 municipalities in the country.",
            "And the result didn't come.",
            "Let me tell you what happened, because this is the part that matters. Add time effects and the coefficient collapses to zero. The naive specification — entity effects only — publishes a +0.0242 at p < 0.001 that sounds excellent and means nothing. What it's picking up is something else: the whole country rose at once.",
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
            "That common rise is the finding. It isn't the noise, it's the answer.",
            "I could have published the +0.0242 and nobody would have said a word. I published the null. It's on the page, with both maps on the same scale so you can see why. A well-measured null says more about how I work than a pretty coefficient, and anyone who can read tells the difference.",
          ],
          proofLabel: "Open the research",
          proofHref: "/research/fintech-inclusion",
        },
        {
          id: "plataforma",
          nav: "Building the whole thing",
          num: "04",
          title: "Building the whole thing, this time",
          body: [
            "The thesis left me uncomfortable. I knew how to do the analysis, yes, but I had assembled the infrastructure in pieces every time, by hand. So I sat down and built a real one.",
            "market-data-medallion is a PostgreSQL warehouse in medallion architecture, transformations in dbt, eighty-nine automated quality tests and a daily cron that brings in forty-eight assets — crypto, ETFs, US equities, Latin American ADRs, currencies — without me touching a thing. It carries a Power BI semantic model on top.",
            "And an honest backtester, which is where it gets interesting. Five classic technical strategies and every combination of them: 1,392 variants, with fees, with slippage and no look-ahead. {variants} went in. {survivors} survived.",
            "That number is the product. Not the {survivors} that made it: the {eliminated} that didn't. Almost all the winning strategies were backtest illusions, and the only way to show it was to split every series into 70% training and 30% the model never saw. Without that blind window, picking the best of 1,392 isn't analysis — it's data dredging with good presentation.",
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
            "The first reading gave me AUC 0.9461.",
            "And I'll be honest with you: for a while there, I felt pretty good.",
            "But that isn't a credit model. It's a leak. TermInMonths is overwritten when a loan is liquidated, so that field carried inside it exactly the outcome I claimed to be predicting. Removing it drops the ablation to 0.6621.",
            "The model that ended up in production sits at 0.7005 — +0.0311 over an interpretable WoE scorecard, with a calibration error of 0.0107. Far less impressive than 0.9461. And it's the only thing that holds.",
          ],
          verdict: "The number that made me look good lasted two days. The one I published has held for months.",
          bodyAfter: [
            "The system has ten promotion gates and one of them is designed to block my own model when it doesn't comply. That's what I wanted to build: not a model that wins, but one that survives an audit. Which is, when you look at it, the same idea I met in SLB's internal audits four years earlier — except back then I was on the other side of the table.",
          ],
          proofLabel: "Open the credit system",
          proofHref: "/projects/credit-risk",
        },
        {
          id: "hilo",
          nav: "What holds it together",
          num: "06",
          title: "What holds it together",
          body: [
            "There's a thread running through all three and it matters to me more than any of them: I publish what fails.",
            "The thesis null is published. The 0.9461 leak is in the README with the exact number, unretouched. Of 1,392 strategies, the headline is how many died. And this very site carries a log of numbered defects, each with its root cause and its fix — including the ones I broke this week.",
            "This isn't shop-window humility, and I want to be clear about that. It's something duller and more useful: a portfolio where everything went well can't be verified. One where the mistakes are dated can. Every figure on this site links to the artifact that produces it — the repository, the commit, the pipeline. If it can't be checked, I don't publish it.",
          ],
          verdict: "I publish what fails.",
          proofLabel: "See the defect log",
          proofHref: FALLOS_LOG,
        },
        {
          id: "donde",
          nav: "Where I'm going",
          num: "07",
          title: "Where I'm going",
          body: [
            "I'm looking for a remote role where financial judgment and data engineering are paid as one capability and not as two halves. Finance Data Analyst, Financial BI Analyst, Analytics Engineer — three different names for the same job, depending on who you ask.",
            "I'm in Bogotá, GMT-5, with full overlap with US hours.",
            "And if you made it this far, the rest is one click away: the code is public, the figures link to their source, and so do the mistakes.",
          ],
        },
      ],
      ctaTitle: "Stop choosing between the one who reads the business and the one who builds the data.",
      ctaBody: "If what you just read looks like what you need, write to me and let's talk this week. I answer in English and Spanish.",
      ctaEmail: "Write an email",
      ctaCv: "Download the CV",
    },
  },
};
