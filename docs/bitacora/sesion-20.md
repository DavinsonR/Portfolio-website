## Sesión 20 — 23 sep 2026 · Conversión: la portada adelgaza, las páginas de proyecto cierran con una salida, y el PDF y la web dicen por fin lo que un ATS busca

Sesión 3 del plan de la [auditoría](../AUDITORIA-2026-09-23.md). Encargo: «continuemos con la sesión 3», y a mitad de sesión: «tienes permiso para fusionar los PR, primero audita y luego fusionas, continúa hasta terminar».

### La medida antes de opinar

Cuatro revisores reales dijeron, por separado, «demasiado contenido, te pierdes» y «el CV es muy largo, deja el PDF». Medido sobre el HTML servido: la portada tenía **1.669 palabras en español y 1.579 en inglés**; el CV, **2.018 / 1.850**. Y ninguna página de proyecto cerraba con una llamada a la acción: terminaban en «volver al inicio» o en GitHub, justo donde el lector acaba de leer entre 900 y 1.900 palabras de evidencia y está más convencido.

### Lo que se hizo

- **La banda de cifras pasa de cinco a cuatro.** Sale «1.123 municipios»: era la más lejana del puesto y ya tiene su propio gráfico 200 px más abajo. Cuatro es además lo que DESIGN.md declara para la banda. La rejilla de la portada pasa a `lg:grid-cols-4`.
- **La caja de herramientas pasa de 15 filas a 8.** Se quedan las que tienen un artefacto público o nombran el cruce (FP&A, Power BI, Tableau, Python, SQL, dbt, riesgo de crédito, gobierno de modelos); Excel, SAP, DuckDB, Git, econometría, diagnóstico y ML salen de la portada. La lista completa, con su prueba cada una, sigue en `/cv`, que es donde se lee entera, y la nota lo dice. La fila de FP&A enlazaba a `/cv#experiencia` —la prueba era otra afirmación del mismo sitio—; ahora enlaza a la sección de la historia sobre esos años.
- **Dos divulgaciones que decían lo mismo** («Construido en público» y «Cifras verificables») son una. «Por qué importa» del proyecto destacado, de 78 palabras a 55. Las notas de la tesis y de JARVIS, más cortas y —la de JARVIS— encuadrada en lo transferible: «producto propio en operación», no «hábitos y peso».
- **La banda ámbar de contacto** (`components/ContactBand.tsx`) cierra ahora las seis rutas largas: las cinco páginas de proyecto y la historia, donde nació. Mismo texto, ya escrito y traducido; cada página pasa su medida de columna.
- **El pie lleva el CV**: «Descargar CV (PDF)», «La historia» y «Volver al inicio» en las ocho rutas y en los dos anchos. Por debajo de 768 px la barra pierde sus tres enlaces, y desde una página de proyecto en un teléfono no había ruta al PDF salvo volver a la portada y desplazarse.
- **El CV en la web usa los textos cortos** (`profileShortText`, `pivot.shortBody`); los largos siguen en el PDF de tres páginas.
- **«Inglés B2» sale de la línea de cabecera** del CV y de los dos PDF: estaba tres centímetros debajo del nombre, antes de toda la evidencia de uso, y un screener no técnico lo lee como «no fluido». Ahora la línea dice «inglés de trabajo a diario, con equipos en 15+ países · español nativo»; el nivel sigue publicado en «Preparado para remoto» y en Divulgaciones, junto a lo que lo respalda.
- **Palabras clave ATS que son verdaderas**: variance analysis, month-end close, cash-flow forecasting, management reporting, account reconciliation; data warehousing, dimensional modelling (star schema), ELT, CI/CD, dashboarding. Las viñetas del CV describían exactamente eso con otras palabras. El hueco que no se inventa: no hay ninguna plataforma cloud en el sitio.
- **Copy**: «respondo rápido» → «respondo en menos de un día hábil» (era la única promesa no comprobable del sitio); «Trayectoria» nombraba dos destinos → la barra dice «La historia»; «en producción» para proyectos sin usuarios ni SLA → «en operación» / «desplegado», también en las etiquetas del generador del PDF; tres calcos del español en el inglés («two profiles in one» → «two hires in one», «changes its language» → «changes its vocabulary», el subtítulo de JARVIS).
- **El tablero de Tableau, visible.** Era el único artefacto visual financiero-adyacente del sitio y se ofrecía solo como enlace de texto. Su captura, sin las barras de Tableau Public, a WebP (36 KB) y servida desde este origen, aparece en el reconocimiento del hackathon en `/cv`.

### Lo que se verificó

`npm run check` en verde (99 menciones de cifras, siete menos: las que salieron con las filas del toolkit). `npm run cv` + `check:artifacts` en verde: la hoja de una página sigue cabiendo con la nueva línea de cabecera. `npm run build` en verde. Contra `next start`: `check:routes` en verde; la banda con `id="contact-band"` en las seis rutas; el pie con el PDF en todas; cuatro cifras y «Cuatro cifras que puedes auditar» en la portada; «Built in public, verifiable figures»; el WebP del tablero a 200; las cuatro palabras clave en el HTML del CV; el CV con el perfil corto.

**Palabras, medidas sobre el HTML servido:**

| Página | Antes | Ahora |
|---|---|---|
| `/es` | 1.669 | 1.532 |
| `/en` | 1.579 | 1.449 |
| `/es/cv` | 2.018 | 1.918 |
| `/en/cv` | 1.850 | 1.743 |

El objetivo de la auditoría era ≤ 1.100 en la portada y ≤ 1.400 en el CV. Se hicieron los recortes **estructurales** (lo que estaba duplicado o no probaba nada); llegar al objetivo exige recortar prosa con voz —el «sub» del héroe (72 palabras), el proyecto destacado (≈250), la sección de trayectoria (125), las divulgaciones (≈120)— y eso es una decisión del autor, no de una sesión. Los números quedan aquí para que la próxima ronda mida contra ellos.

### Lo que no se hizo, y por qué

- **Las capturas del informe de Power BI** (CO-04): solo salen de Power BI Desktop, en la máquina del autor. El andamiaje (`shots`, `shotAlt`, `shotCaption`) sigue esperando los cuatro PNG.
- **El orden de JARVIS en la mesa y en el CV** (CO-08) y **la foto** (CO-21): decisiones del autor. Se reencuadró la nota de JARVIS, no su puesto.
- **El enlace de agenda** (Cal.com): exige una cuenta que solo el autor puede abrir.
