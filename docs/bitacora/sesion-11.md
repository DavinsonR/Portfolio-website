<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 11 (21 ago 2026): EL CV, LA VITALIDAD Y UN NÚMERO QUE NO CUADRABA

Tres encargos del usuario tras revisar el sitio: *los CV están mal y desactualizados* · *quitar el mensaje del 80% con IA* · *la página se siente estática*.

### 1. El CV estaba mintiendo, y la causa era mecánica
Los PDF descargables **nunca se habían regenerado desde el MVP** (`a18013e`). Decían literalmente `Analista FP&A → Data Analyst / Junior Data Scientist` y *"Busco un rol 100% remoto como Data Analyst / Junior Data Scientist"* — es decir, el documento que el reclutador se lleva contradecía todo el reposicionamiento de la sesión 10. La causa raíz: el script `npm run pdf` importaba `pdfkit` y `tsx`, y **ninguno de los dos estaba declarado en `package.json`**, así que el comando no podía correr. Un generador que no corre es un generador que no existe.

Corregido a fondo:
- **Title mapping en el encabezado** — los tres nombres con que las vacantes llaman al mismo rol: *Finance Data Analyst · Financial BI Analyst · Analytics Engineer*, como titular, no como subtítulo.
- **Sección de proyectos en producción** — el CV no mencionaba `market-data-medallion` en ninguna parte. Ahora lleva las plataformas (PostgreSQL, medallion, dbt, Prefect, GitHub Actions, Supabase, Power BI TMDL/PBIP) con las cifras verificables.
- **Narrativa reescrita**: *"No estoy cambiando de carrera: estoy cobrando por lo que ya hago."*
- **Una sola escala de habilidades.** El CV declaraba Power BI 55% "intermedio" mientras la portada decía 8/10. Dos autoevaluaciones distintas de la misma persona en el mismo sitio, y la del CV era la más baja. Ahora ambas superficies leen las mismas filas.
- **"Social Data Analyst Jr" → "Analista de datos sociales"** — el "Jr" era del 2023 y ya no describe nada.

### 2. Formato LaTeX, la sugerencia de Felix, entregada de verdad
Felix fue explícito: *"para tu cv usa overleaf, latex, ese formato es más decente"*. En lugar de imitar el aspecto, se generan **fuentes `.tex` reales** desde el mismo diccionario (`npm run latex`), autocontenidas, que compilan en Overleaf con pdfLaTeX sin instalar nada — y que el usuario puede editar ahí mismo. `scripts/compile-cv.mjs` las compila localmente con el motor que haya (tectonic / latexmk / xelatex / pdflatex) y, si no hay ninguno, no rompe: dice cómo hacerlo en Overleaf.

Se compilaron y verificaron con tectonic: **2 páginas exactas** en ambos idiomas, sin rastro de "Junior Data Scientist". Dos fallos que solo aparecieron al compilar de verdad: `\spanishdeactivate` no existe en el babel-spanish actual (se cambió por la opción `es-noshorthands`), y la regla de escape de comillas tenía la misma expresión dos veces, así que la segunda nunca corría.

### 3. Vitalidad: movimiento en registro de imprenta
El sitio tenía **una sola animación** (la cabecera al cargar) y nada más. Ahora hay cuatro primitivas, todas colgando de **un único `IntersectionObserver`** a nivel de documento, para que los componentes de servidor sigan siendo de servidor: las reglas **se trazan** de izquierda a derecha (`scaleX`), las filas **se asientan** en orden de lectura, los segmentos del indicador **se llenan** uno a uno, y las cifras **se cuentan** hasta su valor. Las series de las gráficas se dibujan con la Web Animations API (el largo de un path solo se conoce en ejecución). Nada rebota, nada escala bajo el cursor: el hover vale un pixel de levantada.

**Tres garantías que el sistema no puede romper**, y una de ellas era un fallo real que encontré al auditar: los estados ocultos viven bajo `.js` (puesto antes del primer pintado), un temporizador de 3 s lo revela todo si el bundle nunca corre, y **`@media print` fuerza todo visible — el papel no tiene scroll, así que sin esa regla el CV se habría impreso en blanco.**

### 4. Cifras que no cuadraban entre sí (encontradas al escribir el CV)
La portada decía *100 pruebas de datos automáticas*, la metodología decía *87*, y el warehouse decía otra cosa. Contado contra el manifiesto compilado de dbt: **89 nodos de test** + **139 pruebas unitarias en Python**. También *55.000+ velas* → **59.800** reales, y *"tres APIs"* → **cuatro fuentes**. Todo alineado en ambos idiomas. En un sitio cuya tesis es *"cada número enlaza a lo que lo prueba"*, dos cifras para el mismo hecho cuestan exactamente la confianza que la banda de cifras existe para comprar.

### Estado al cierre de sesión 11
| Ítem | Estado |
|---|---|
| CV en el sitio (ES/EN) | ✅ title mapping, proyectos en producción, una sola escala |
| PDF descargables | ✅ regenerados desde LaTeX, 2 páginas, formato Overleaf |
| Fuente `.tex` para editar en Overleaf | ✅ publicada junto al PDF (`npm run cv`) |
| Mensaje del 80% con IA | ✅ retirado de ambos idiomas |
| Animaciones | ✅ 4 primitivas, seguras sin JS, en papel y con reduced-motion |
| Cifras del pipeline | ✅ 89 tests / 59.800 velas / 4 fuentes, verificadas contra el warehouse |
| ⚠️ Pendiente de vigilar | El cron llevaba sin publicar desde el **17 ago** (FALLO-23); el fix `3489025` está pusheado pero aún no había corrido al cierre. La página muestra "última actualización 17 ago" hasta que corra. |
| Pendiente usuario | ⏳ foto profesional para la portada |

---
