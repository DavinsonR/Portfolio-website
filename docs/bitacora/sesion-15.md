<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 15 — 5 sep 2026 · Dos semanas sin novedades: el Power BI a la vista, la tesis publicada y el tracking en su sitio

El sitio llevaba desde el 21 de agosto sin cambios mientras la búsqueda de empleo corría (29 aplicaciones el 3 y 4 de septiembre). Encargo del usuario: que se vea lo de Power BI, decidir qué se publica del tracking app privado, y arrancar el repo de la tesis. Antes de tocar nada se leyeron los cuatro repos y el contexto de Notion (títulos objetivo, banco de evidencias).

### Lo que no cuadraba

**Power BI se afirmaba unas veinte veces y no se enlazaba en ningún sitio.** El informe existe en `market-data-medallion/powerbi/` (PBIP + PBIR + TMDL, commit `23109f5`): 7 tablas, 4 relaciones, 17 medidas DAX, 4 páginas, 21 visuales. La decisión D-15 (PNGs en el sitio + decir abiertamente que "Publish to web" exige Pro) nunca se ejecutó, y no hay ninguna captura en ningún repo: nadie ha renderizado el informe, porque la máquina que lo generó no tenía Power BI. Era la afirmación sin prueba más grande de la página, en un sitio cuya regla es "cada cifra enlaza a lo que la prueba".

**La maestría era una fila de educación "EN CURSO"** y el repo de la tesis estaba creado, público y con cero commits. La tesis está radicada con correcciones desde el 11 de agosto; su resultado central es un nulo honesto (con efectos fijos de entidad y tiempo el índice no es significativo, β = −0,15, p = 0,984) que encaja exactamente con la tesis del sitio.

**Hallazgo colateral en el pipeline:** `daily.yml` hacía `git add exports/*.json`, un glob no recursivo. Desde el 17 de agosto el cron commiteaba `index.json` y se saltaba los 48 `exports/backtests/<SYM>.json` con las curvas de equity: el laboratorio mostraba curvas de tres semanas junto a un índice fresco. Un carácter de diferencia (`git add -A exports/`), PR aparte en ese repo.

### Decisiones

- **D-28 · Power BI sin embed y con página propia.** `/[lang]/projects/powerbi`: catálogo copiado a mano de los TMDL/PBIR (`lib/powerbi-model.ts`, con el SHA en la cabecera), diagrama del modelo en SVG con tokens, las 17 medidas con su expresión enlazando a la línea exacta fijada al commit, las 4 páginas con sus visuales, y la divulgación de licenciamiento que D-15 pedía. Las cifras de la banda salen de `.length`, nunca tecleadas (los comentarios del TMDL traen 1.347 y 45 activos, ya viejos). Las capturas son **slots**: `lib/powerbi-shots.ts` mira en build si existe `public/powerbi/<página>.png` y lee el ancho y alto del IHDR; si no existe, la página se ve terminada igual, como el hero sin foto. El usuario las exporta desde Desktop.
- **D-29 · Tesis pública por etapas, PDF diferido.** Repo con README bilingüe (anclas estables que enlaza el sitio), decisiones metodológicas de la versión corregida, carpetas con README, MIT para el código y derechos reservados sobre el texto hasta el depósito institucional. Página `/[lang]/research/fintech-inclusion` con el nulo en la banda fría. Ni las fuentes de datos ni la frecuencia del panel se afirman hasta que el autor suba los datos (T = 14 en 2017–2021 implica frecuencia intra-anual; se publica T y ρ̂ tal como los reporta el autor, no la frecuencia).
- **D-30 · El tracking app se queda privado.** El usuario lo ve como posible producto a mediano plazo; el modelo de datos y las reglas de diseño son su diferencial y no se publican. Auditoría previa: una parte sustancial del repo lleva datos personales reales y su historial no es publicable en ninguna forma. En el sitio va una fila en "También en la mesa" sin enlace, con tres cifras y la frase "cifras del repositorio privado, verificables en una demo". **No entra en el CV**: la sección promete código abierto y verificable.

### Contenido

- `sheet.metrics` lleva ahora su `href` en el diccionario: los cuatro enlaces de prueba eran un array posicional en `page.tsx` que se desalineaba en silencio al reordenar una cifra.
- Lista "También en la mesa" bajo el proyecto destacado: Power BI (EN EL REPO), tesis (RADICADA), tracking (EN CONSTRUCCIÓN, privado). El proyecto destacado sigue siendo uno: el home se decide en un minuto.
- La fila "Power BI" del toolkit y del CV enlaza a su página (regla One-Scale, las cuatro copias iguales). Quinta divulgación: "Informe Power BI".
- CV: sección **Investigación** con la tesis (el mismo bloque de artículo que los proyectos, ahora un componente), fila de maestría "TESIS RADICADA" con nota y enlace. El generador LaTeX gana la sección y los `\href` absolutos vía `lib/site.ts`; el copy del CV evita letras griegas porque `tex()` no las escapa con T1.
- Los dos PDF del CV se recompilaron en la sesión con tectonic (binario descargado a mano; la máquina no traía motor LaTeX). El `.tex` y el `.pdf` van juntos en el commit, como manda `npm run cv`. De paso, paridad ES/EN de `skillsData`: al inglés le faltaba Tableau.
- `lib/site.ts` reúne la URL del sitio que estaba copiada en `layout`, `robots` y `sitemap`. Dos rutas nuevas en sitemap y redirects.
- `@media print` redeclara los tokens claros: quien imprimía desde el tema oscuro sacaba tinta pálida sobre papel blanco, también en las gráficas del laboratorio.
- README del repo: `npm run pdf` no existía (es `npm run cv`), `/` redirige a `/en`, el aviso del 403 de Vercel llevaba trece sesiones resuelto.

### Pendientes del usuario

- Exportar las cuatro páginas del informe desde Power BI Desktop como `verdict.png`, `explorer.png`, `fx.png`, `curves.png` en `public/powerbi/` (y en `docs/powerbi/` del pipeline). Al existir, la página las muestra sola.
- Subir al repo de tesis el notebook `PCA_GMM_Fintech_Tesis_v2.ipynb`, los datos con su fuente y frecuencia, y el PDF tras el depósito.
- Confirmar cuál URL de LinkedIn está viva: el sitio publica `/in/davirson-novoa-ramirez-2721641b5`; Notion registra `/in/davirson-novoa`.
- Pendiente de higiene de credenciales en el otro proyecto privado (se gestiona fuera de este documento).

---
