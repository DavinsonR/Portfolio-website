# Auditoría completa — 23 sep 2026

*Cinco expertos independientes (diseño y accesibilidad, ingeniería y rendimiento, SEO e i18n, contenido leído como reclutador, seguridad y CI) auditaron el repositorio en `main` (`93ad3bc`) y el sitio publicado en `davirson.com`, en paralelo y sin verse entre sí. Sus informes íntegros están en [`auditoria-2026-09-23/`](auditoria-2026-09-23/). Este documento los consolida: quita duplicados, corrige lo que uno de ellos midió mal, y ordena todo en un plan.*

*Estado de partida verificado: `npm run check` en verde (lint, tipos, paridad, artefactos, 11 afirmaciones de cifras). Lighthouse en producción: móvil 95 / escritorio 99 en rendimiento, y 100 en accesibilidad, buenas prácticas y SEO. Cero errores de consola en las 16 rutas. Cero desborde horizontal a 320, 393, 768 y 1280 px. Los trece enlaces externos que el sitio promete devuelven 200 y dicen lo que el sitio dice.*

---

## 1. Veredicto

| Dimensión | Nota | Lo que la sostiene | Lo que la baja |
|---|---|---|---|
| Contenido y posicionamiento | **8,0** | Crossover resuelto, sin una sola disculpa; tres preguntas de contratación sobre el pliegue; trece enlaces verificados cifra por cifra | El PDF de una página sin cifras; el lado FP&A afirmado y no demostrado; portada de 1.654 palabras; Power BI sin una imagen |
| Diseño y accesibilidad | **7,5** | Todos los pares de texto/fondo pasan AA en los dos temas; `reduced-motion` en cuatro capas; impresión diseñada | Foco invisible (1,00:1) en el control principal del atlas; texto de gráficos a 3–5 px en móvil; deriva del contrato (h1 en dos pesos, columna en tres medidas) |
| Ingeniería y rendimiento | **7,5** | Frontera servidor/cliente de libro; `/projects/credit-risk` con 0 KB de JS propio; CSP razonada | CVE crítico en `next@16.3.1`; cero `Cache-Control` en `public/`; serif de 122 KB sin subconjuntar; 318 KB de JSON de terceros en la portada para pintar una fecha |
| Seguridad, robustez y CI | **7,0** | Cabeceras publicadas idénticas a las declaradas; `security.txt` real; secret scanning activo | Dependabot desactivado; `main` sin protección; HSTS anuncia `preload` sin estar en la lista; ningún `error.tsx` |
| SEO, metadatos e i18n | **6,0** | hreflang recíproco en las 16 rutas; sitemap fiel; traducción redactada, no calcada | `<title>` del CV con el nombre dos veces; `twitter:*` de la portada en 14 rutas (FALLO-29 repetido); 7 de 8 títulos por encima de 60 caracteres; JSON-LD solo en la portada |
| **Global** | **7,2** | *«Percentil 95 de los portafolios que recibo»* (el reclutador) | ~60 hallazgos concretos, casi todos de esfuerzo S, y cuatro decisiones que solo puede tomar el autor |

---

## 2. Lo que no hay que romper

Los cinco coinciden en esto, y es lo que separa este sitio de un CV en HTML:

- **El mapeo de títulos en el hero** (Finance Data Analyst · Financial BI Analyst · Analytics Engineer), repetido en `<title>`, CV, PDF y JSON-LD: la misma terna en cinco superficies.
- **El bloque ámbar de contratación** (nivel, inicio, vía, sin visa) y el `mailto:` prellenado con rol, empresa, modalidad y rango.
- **La honestidad como argumento**: «mi primer AUC fue 0,9461: espectacular, publicable y falso», «publiqué el nulo», los diez gates. Ningún competidor lo copia porque exige haberlo hecho.
- **`/historia`**: el mejor texto del proyecto, y la única página donde la longitud es el producto.
- **La rampa de color**: ni un solo par de texto por debajo de AA en ninguno de los dos temas. No tocar un token sin volver a medir.
- **El foco global** (`globals.css:221-225`) con `outline-offset: 2px`, que hace que el anillo caiga siempre sobre el papel. La única excepción es el fallo DA-01, que existe precisamente por haber roto esa regla.
- **`CountUp` con el valor real en `sr-only`**, `aria-pressed` en vez de `tablist` falso, `lang` por fragmento, `reportShot()` leyendo el IHDR del PNG en build.
- **`fetchJson` con `AbortController` y respaldo a la instantánea del mismo origen**: el patrón correcto, que solo falta aplicar en dos sitios más.
- **La CSP con `default-src 'none'`** y la exclusión por lookahead de la demo, verificadas en producción tal cual están escritas. Nunca declarar un `sha256-` ahí.
- **Las cuatro comprobaciones con su prueba de fallo intencional**, y los dos pasos «regenera y `git diff --exit-code`» de CI.

---

## 3. Los hallazgos, consolidados y en orden

Cada fila apunta al ID del informe de origen, donde está la evidencia línea a línea. Severidad y esfuerzo son los del experto salvo donde este documento los corrige (§6).

### P0 — Esta semana. Seguridad, credibilidad y bugs en producción

| # | Hallazgo | Origen | Esf. | Arreglo |
|---|---|---|---|---|
| 1 | **`next@16.3.1` arrastra un CVE crítico** (dos RCE, fix en 16.3.6) y `sharp` uno alto. Dependabot está **desactivado** en el repositorio, por eso nadie lo vio. | IR-01, SR-01, SR-02, SR-24 | S | Subir el pin a `16.3.6` (`next` y `eslint-config-next`), `npm run check` + `build`. Activar Dependabot alerts y security updates; añadir `.github/dependabot.yml`. Paso `npm audit --omit=dev --audit-level=high` en `ci.yml`. |
| 2 | **`main` no tiene protección de rama**: un push con CI en rojo se publica igual. | SR-03 | S | Require status checks (`verify`) + bloquear force-push. Cinco clics. |
| 3 | **Las cifras del laboratorio están escritas a mano y el dato se mueve cada noche.** La instantánea del 16 sep dice 51 supervivientes (14,8 %); el índice vivo de hoy dice **45** (13,0 %). «Menos de 50» es verdad hoy y era mentira la semana pasada; «las 1.342 que no» es falso contra los dos (1.347 hoy, 1.341 entonces); «una de cada ocho» vale 12,5 % y el dato oscila entre 13 y 15. El bloque de estadísticas de la misma página, alimentado por el JSON, contradice al `<h1>` en pantalla en cuanto la instantánea y el titular divergen. | CO-01 (corregido en §6) | M | **Derivar, no escribir**: el `<h1>` de `/projects/trading-sim`, la nota de la cifra en la portada y la frase del CV salen de `overfitting.overall` (instantánea en build, dato vivo en cliente), y el diccionario guarda solo la plantilla «{n} entraron. {k} salieron.». Donde no se pueda derivar (PDF, `historia`), usar formulación robusta a la deriva: «alrededor de 50», «una de cada siete u ocho». Añadir `npm run snapshot` a la rutina de publicación y una comprobación en `check:figures` que compare el titular con la instantánea. |
| 4 | **`<title>` de `/cv` repite el nombre**: «Davirson Novoa Ramírez — Finance Data Analyst — Davirson Novoa Ramírez» (71 car., en los dos idiomas). Y su `description` se corta a mitad de palabra («…someone t»). | SE-01, SE-04 | S | `cv/page.tsx:15`: usar solo `targets[0]` como base o `title: { absolute }`. Descripción propia y corta en `cv.ts` en vez de `profileText.slice(0,155)`. |
| 5 | **`twitter:title` y `twitter:description` de la portada en las 14 subpáginas.** Es FALLO-29 otra vez, sin corregir para Twitter y sin cobertura en `check:routes`. | SE-02 | M | Un `twitter()` hermano de `openGraph()` en `alternates.ts`, llamado desde cada `generateMetadata`. `check:routes` exige `twitter:title == og:title`. |
| 6 | **`Motion.tsx` desarma el salvavidas de 3 s antes de montar el observador** (`data-motion` en la línea 23, `watch()` en la 47): si algo lanza en medio, todo `[data-reveal]` queda en `opacity: 0` para siempre. No hay `error.tsx` en ningún nivel. `ThemeToggle` llama a `localStorage` sin `try/catch`. | IR-07, SR-11, SR-12 | S | Mover el `setAttribute` después de `watch(document)` y envolver en `try/catch` que revele todo. `app/[lang]/error.tsx` con el pliego del 404. `try/catch` en `ThemeToggle`. |
| 7 | **El PDF de una página, el artefacto que se reenvía, no lleva ni un resultado cuantificado en Experiencia**: `generate-cv-latex.ts:405` conserva la primera viñeta y tira la de «60 horas al mes». Tampoco emite certificaciones (Stanford ML) ni los términos de contratación que el sitio pone en ámbar. | CO-02 | M | Regla de recorte por **cifra**: `role.bullets.find(b => /\d/.test(b)) ?? role.bullets[0]`. Una línea de certificaciones y una de cierre («Senior Analyst · 15 days' notice · B2B or EOR · no visa sponsorship · GMT-5»). `npm run cv` + `check:artifacts`. |
| 8 | **Un commit de contenido con nueve inconsistencias pequeñas** que, juntas, dan a un entrevistador técnico tres preguntas incómodas: «95 M» modelados donde son 62,4 M (CV, toolkit, skillsTech); 34 tablas en la banda y «treinta y tres» en la prosa de la misma página; el estado de la tesis dicho de cuatro maneras (BUILDING / RESEARCH / THESIS FILED / «2026 — building»); «3 roles remotos» sobre cuatro empleadores; «35 fallos» escrito a mano y sin enlace; dos «nosotros» en un sitio en primera persona; «the #1 reason» sin medición; una cifra de terceros sin fuente en `tracking.decisions`; comillas «» dentro del inglés, incluido un titular. | CO-17, CO-09, CO-05, CO-23, CO-22, CO-12, CO-11, CO-10, CO-13, SE-10, SE-11 | S | Cada uno está citado con su ruta del diccionario y su texto propuesto en el informe de contenido. `check:figures` con números escritos con letra (CO-09) para que el 33/34 no vuelva. |
| 9 | **HSTS anuncia `preload` y el dominio no está en la lista** (`hstspreload.org` → `unknown`). Cumple ya todos los requisitos. | SR-05 | S | Enviar el formulario. Sin código. |

### P1 — Conversión. Lo que decide si el vistazo se vuelve entrevista

| # | Hallazgo | Origen | Esf. | Arreglo |
|---|---|---|---|---|
| 10 | **Power BI dice «No screenshot yet» cuatro veces**, y el sitio entero tiene **una sola imagen** en siete rutas. Es la página que más se parece al trabajo diario de un Financial BI Analyst. | CO-04 | S | Exportar cuatro PNG desde Power BI Desktop: el andamiaje (`shots`, `shotAlt`, `shotCaption`) ya está escrito esperando el fichero. Miniatura del tablero de Tableau, único visual financiero ya público. |
| 11 | **Densidad**: portada 1.654 palabras EN / 1.744 ES; `/cv` 2.007; `/projects/tracking` 1.875. `toolkit` (15 filas) duplica `cv.skillsTech` (15 filas). La banda de cifras tiene cinco cuando el contrato y las otras tres bandas tienen cuatro. Es la queja que cuatro reviewers dieron por separado y sigue abierta. | CO-07, DA-prop.3, DA-resumen | M | Objetivos: portada ≤ 1.100, `/cv` ≤ 1.400, `tracking` ≤ 1.100. La tijera más rentable: `toolkit` a las **seis** filas con artefacto público, `skillsTech` borrado (−380 palabras sin perder una prueba). Cinco cifras a cuatro: sale «1.123 municipios», que ya tiene su propio gráfico 200 px más abajo. En `/cv` web usar `pivot.shortBody` y `profileShortText`, que ya existen. |
| 12 | **Ninguna página de proyecto cierra con una llamada a la acción**, y en móvil desaparecen los tres enlaces de la barra, incluido CV: desde `/es/projects/powerbi` en un teléfono no hay ruta al PDF salvo volver a la portada. El pie solo lleva el correo. | CO-15, CO-14, DA-08, SE-12 | S | Reusar la banda ámbar de cierre de `/historia` (`ctaTitle`, `ctaBody`, `ctaEmail`, `ctaCv`: ya escrita, traducida y diseñada) al final de las cinco páginas. «Descargar CV (PDF)» y dos enlaces de navegación en el pie. |
| 13 | **JARVIS ocupa el segundo puesto de la mesa y del CV**, por delante del warehouse en producción y del informe de BI, y es el activo menos relevante para el puesto. | CO-08 | S | Reordenar: credit-risk → market-data-medallion → Power BI → tesis → JARVIS. Reencuadrar su nota hacia lo transferible (RLS en 34 tablas, 526 pruebas, «se puede abrir al público sin exponer una fila, y hay una prueba que lo obliga»). **Decisión del autor** (§7). |
| 14 | **«English B2» impreso bajo el nombre** en la web y en el PDF, antes de toda la evidencia de uso. | CO-06 | S | Cabecera: «Working language: English (daily, 15+ countries) · Spanish native». La etiqueta B2/A2 se queda en `Remote-ready` y en Divulgaciones, junto a la prueba que la respalda. |
| 15 | **Faltan palabras clave ATS que son verdaderas**: 0 apariciones de «variance analysis», «month-end close», «cash-flow forecasting», «data warehousing», «star schema», «CI/CD» en `cv.ts`, y las viñetas describen exactamente eso con otras palabras. | CO-19 | S | Añadirlas a `skillsFin` y `skillsData`. Hueco real que conviene reconocer y no inventar: no hay ninguna plataforma cloud en todo el sitio. |
| 16 | **«En producción» para proyectos sin usuarios ni SLA**; «Respondo rápido» como única promesa no comprobable; «Trayectoria» nombra dos destinos distintos (barra → `/historia`; sección de la portada). | CO-16, CO-20, CO-24 | S | «2026 — en operación diaria sin intervención»; «respondo en menos de un día hábil» + un enlace de agenda (Cal.com, sin cookies); barra: «La historia» / «The story». |
| 17 | **Diez calcos del español en el inglés**, con propuesta cada uno: «two profiles in one» → «two hires in one», «changes its language» → «changes its vocabulary», «barely one in eight», «read instead of raw», guiones pegados en inglés… | CO tabla de 10 | S | Tabla «10 ejemplos de copy» del informe de contenido. |
| 18 | **La evidencia del laboratorio no está en el HTML**: un crawler y una red que bloquea scripts ven «loading pipeline data…». | CO-18 | M | Pintar en servidor los cuatro valores de `overfitting.overall` desde la instantánea (mismo origen, el build puede leerla) y que el cliente los actualice. Mismo patrón que `PipelineStamp`. Se resuelve junto con el #3. |
| 19 | **El crossover se afirma de los dos lados y se demuestra de uno**: las cinco piezas son de datos, ML e investigación; el trabajo de FP&A no tiene página ni artefacto, y las tres filas financieras del toolkit enlazan a `/cv#experiencia`, es decir, a sí mismas. Un hiring manager de Finance Data lee «ingeniero de datos con pasado financiero», que es lo contrario del posicionamiento. | CO-03 | **L** | Una sexta pieza del lado financiero sobre datos **sintéticos con semilla** (P&L de SG&A de 15 países × 24 meses, dbt calculando variación contra plan, forecast previo y moneda constante, pruebas que fallen si una variación no cuadra, un informe encima). El mecanismo para publicar sin tocar dato de cliente ya está inventado en JARVIS. Mientras tanto, cambiar los tres `href` circulares. **Es la única cosa de esta lista que mueve el posicionamiento; todo lo demás lo pule.** |
| 20 | **Sin foto**, y `portraitPending = "DNR"` lleva meses en el diccionario sin renderizarse. Última queja de reviewer abierta. | CO-21 | S | Borrar la clave o renderizarla. El bloque ámbar de 300 px admite una foto sin tocar la retícula. **Decisión del autor.** |

### P2 — Diseño y accesibilidad. Medido, no opinado

| # | Hallazgo | Origen | Esf. | Arreglo |
|---|---|---|---|---|
| 21 | **El anillo de foco del conmutador de vistas del atlas es azul sobre azul: 1,00:1.** `outline-offset: -2px` (`globals.css:524`) sobre `background: cold` (`:538`). Lo mismo le pasa a `.atlas-drill` sobre un departamento en `--atlas-pos-3`, que es exactamente `#0f4c81`. | DA-01 | S | `.atlas-views button[aria-pressed="true"]:focus-visible { outline-color: var(--color-paper) }` (8,86:1). |
| 22 | **El texto de los tres gráficos se pinta a 3–5 px en un teléfono**: `viewBox` de 720 con `width:100%` en 297 px → escala 0,41 → `fontSize 10` se pinta a 4,1 px. Es literalmente la queja de PRODUCT.md («some letters are super small»). | DA-02 | M | `font-size` en px absolutos vía CSS (`.chart text { font-size: 12px }`) con `overflow: visible`, en vez de unidades de `viewBox`. Aplica a `trading/Charts.tsx`, `credit-risk/Charts.tsx`, `atlas/render.ts`. |
| 23 | **`--color-control` se creó para WCAG 1.4.11 (3,64:1) y solo llegó al atlas y al laboratorio**: el conmutador de tema, el botón de copiar y nueve botones contorneados siguen con `border-rule` a **1,37:1**. | DA-03 | S | `border-rule` → `border-control` en los 11 sitios listados. Las reglas estructurales de filas se quedan. |
| 24 | **Ningún estado de carga o error se anuncia** (4 sitios en Atlas y TradingSimDashboard) y **cinco regiones con scroll no son alcanzables por teclado**. | DA-04, DA-05 | S | `role="status"` en los párrafos de estado (`role="alert"` en el error). `tabIndex={0} role="region" aria-label` en los cinco contenedores. |
| 25 | **Seis enlaces dentro de un `role="img"`** en el diagrama del modelo Power BI: focalizables y fuera del árbol de accesibilidad. | DA-06 | M | Quitar los `<a>` del SVG y dejar la lista enlazada que ya existe debajo (`powerbi/page.tsx:127-155`). |
| 26 | **Texto real tirado por debajo de AA con opacidad**: `opacity-45` en filas sin operaciones (2,16:1) y `opacity: 0.4` en regiones fuera del filtro del atlas (1,99:1). | DA-07 | S | `text-muted` (5,35:1) más una marca no cromática. |
| 27 | **Deriva del contrato visual**: `h1` en dos pesos (800 en cuatro páginas, 500 en `powerbi`, `tracking`, `fintech`); columna en **tres medidas** (980 / 1080 / 1180) con `SectionNav` fijada a 1180 y desalineada 100 px en `historia`; titulares de sección a 12,5 px apagados sobre contenido a 15 px en `tracking` ×5, `powerbi` ×2 y portada (defecto documentado como corregido en el CV); `<dl>` con `<dd>` antes de `<dt>` en `trading-sim` (corregido en las otras cuatro); dos secciones destino de navegación sin encabezado; el 404 sin `<main>` ni `<h1>`. Individualmente veniales; juntos son por qué cuatro reviewers puntuaron el diseño 5–7 y el contenido 8–10. | DA-09, DA-10, DA-11, DA-12, DA-13, DA-14, IR-19 | M | Un `ProjectHeader` de servidor y `lib/config/layout.ts` con `WRAP` único (1080, que es lo que DESIGN.md declara). `SectionNav` hereda la medida del padre. Los tres `h1` al paso Display. `heading` del CV aplicado a `tracking` y `powerbi`. `<dt>` primero. `<main>` + `<h1>` en el 404. |
| 28 | **El escalón neutro del atlas es indistinguible del papel también en claro** (1,14:1; el contorno que debía salvarlo, 1,40:1). El ROADMAP solo lo registra en oscuro. La figura de la portada no entrega su propio argumento. | DA-15 | M | `--atlas-mid` a ~`#e2e7ec`, contorno a `--color-control`, `npm run atlas`. Cierra de paso el pendiente del ROADMAP. |
| 29 | Filas del atlas accionables sin rol ni estado (DA-16); tres SVG de raíles sin nombre (DA-17); cifras del laboratorio en Archivo y no en serif (DA-18); **siete párrafos en serif en `historia`** cuando la regla dice una línea de veredicto (DA-19); `alt` que repite el pie (DA-20); `.atlas-credit` a 13 px siendo prosa (DA-21); `scroll-mt-16` un píxel corto (DA-22); ARIA redundante (DA-23); `rounded` de 4 px en una tabla (DA-24); `aria-current="true"` → `"location"` (DA-25); `reduced-motion` leído una vez sin escuchar el cambio (DA-26); constante `mono` que contiene el serif (DA-27); `id` de sección en español en `/en` (DA-30). | DA-16…30 | S cada uno | Todo de una a tres líneas. DA-19 es una **decisión**: o una sola línea de veredicto o enmendar DESIGN.md; lo que no puede quedar es la contradicción silenciosa. |

### P3 — Ingeniería, rendimiento y SEO técnico

| # | Hallazgo | Origen | Esf. | Arreglo |
|---|---|---|---|---|
| 30 | **Cero `Cache-Control` en `public/`** (5,3 MB): las dos fuentes precargadas, el `model.onnx` de 1,93 MB, el atlas y los PDF se revalidan en cada visita. | IR-02 | S | En `headers()`: fuentes y `model.onnx` → `max-age=31536000, immutable`; atlas y snapshot → `max-age=3600, stale-while-revalidate=604800`; OG e iconos → `max-age=604800`. `check:routes` exige `max-age > 0` en una fuente. |
| 31 | **`source-serif-4-latin.woff2` pesa 122 KB y no está subconjuntada** al `unicode-range` que declara (Archivo, con el mismo rango, pesa 35 KB). Se precarga en las diez rutas y solo se usa en cifras grandes. | IR-03 | S | `pyftsubset` al rango latín declarado; precarga solo en `/` y `/cv`. |
| 32 | **La portada pide 318 KB de JSON a `raw.githubusercontent.com` para imprimir una fecha**, y usa `fetchJson(INDEX_URL)` en vez de `fetchIndex()`: en la red corporativa que bloquea ese host, el sello de vida desaparece justo donde más se lee. | IR-04 | S→M | Un `exports/stamp.json` de ~120 bytes en el pipeline; mínimo inmediato, `fetchIndex()` y el campo en la instantánea. |
| 33 | **No hay un solo `next/dynamic` ni `import()` en el repositorio**: d3 + topojson + `render.ts` (22,5 KB br) bajan al cargar `/research/fintech-inclusion` aunque sus datos sí estén diferidos. La mitad de FALLO-30 que quedó abierta. | IR-05 | M | `await import("./render")` dentro del efecto que ya espera a `near`. No envolver `<Atlas>` desde la página de servidor (la doc local lo desaconseja). |
| 34 | `next/image` con `unoptimized` en dos rutas: envía el runtime (4,8 KB br) a cambio de nada, y en `powerbi` no pinta ninguna imagen. | IR-06 | S | `<img width height loading="lazy" decoding="async">`. |
| 35 | **La demo de crédito depende de dos CDN externos (jsdelivr sin SRI), carga 1,88 MB al abrir la página sin límite de tiempo ni `res.ok`**, y el `submit` no tiene `try/catch`. Repite la avería que `trading-sim.ts` ya diagnosticó y arregló. | IR-20, SR-13 | M | Autoalojar `onnxruntime-web` y el `.wasm` en `public/credit-risk-demo/vendor/`, cerrar la CSP de esa ruta a `'self'`, `AbortController` + 12 s, cargar el modelo al primer `focus` del formulario. |
| 36 | **Ocho redirects en 307** para una decisión permanente; no hay fila en DECISIONES.md. Paso 6 del checklist de migración de PLAN_MEJORA, nunca ejecutado. | IR-28, SE-06 | S | Los siete de ruta concreta a `permanent: true` (308). `/` es una **decisión** (§7): 308 congela en el navegador cualquier detección de idioma futura. Escribirla como D-32. |
| 37 | `lastModified: new Date()` en las 16 URL del sitemap en cada build (Google aprende a ignorarlo) y el año del pie congelado en el build. | IR-15, SE-07 | M | `lastModified` por ruta desde `git log -1 --format=%cI` sobre los ficheros de esa ruta, volcado a `lib/generated/` con el patrón de `npm run atlas`. |
| 38 | **JSON-LD solo en la portada**: sin `SoftwareSourceCode` para los repos, `Dataset` para el warehouse, `ScholarlyArticle` para la tesis, `BreadcrumbList` en subpáginas. Sin `og:locale:alternate`, sin `rel="me"`, `theme_color` único sin variante oscura. | SE-05, SE-08, SE-14, SE-13, SE-15 | M | Extender `structured-data.ts` con un generador por tipo de página; `alternateLocale` en `openGraph()`; `rel="noopener noreferrer me"`; `viewport.themeColor` por esquema. |
| 39 | **7 de 8 títulos por idioma superan 60 caracteres** (research EN: 100; ES: 109) y 7 de 8 descriptions superan 155: la plantilla «— Davirson Novoa Ramírez» va al final y es lo primero que Google corta, que es lo contrario de su propósito. | SE-03, SE-04 | M | `metaTitle` a ~35–40 caracteres; `metaDesc` a ~150. Comprobación de longitud en `check:routes`. |
| 40 | Higiene de rendimiento, todo S: `prefetch={false}` en el conmutador de idioma y el pie (Next precarga la ruta entera del otro idioma en cada página, 75 KB de RSC que nadie lee) (IR-11); `getBoundingClientRect()` en cada `pointermove` de `ConstellationField` (IR-12); `will-change` permanente en todos los `.reveal` (IR-13); el héroe arranca en `opacity: 0` con retardos de hasta 620 ms, que es un suelo artificial de LCP (IR-14, hipótesis: medir); el sello del pipeline puede reflujar la banda al resolverse (IR-25). | IR-11…14, IR-25 | S | Ver cada fila del informe de ingeniería. |
| 41 | Código y activos muertos: cuatro exports en `credit-risk.ts`, cinco SVG de la plantilla de `create-next-app` servidos públicamente, `public/powerbi/README.md` público; `x-powered-by` emitido; `interest-cohort` (FLoC, abandonado) sin `browsing-topics`; sin COOP; sin CAA ni DNSSEC en Cloudflare; nueve `as any` concentrados en la costura topojson↔d3-geo; doce `key={i}`. | IR-17, IR-22, IR-16, IR-26, SR-08, SR-09, SR-06, SR-07 | S | Borrar, `poweredByHeader: false`, dos directivas, un registro DNS, un tipo `AtlasFeature`. |

### P4 — Higiene del repositorio y documentación

| # | Hallazgo | Origen | Esf. |
|---|---|---|---|
| 42 | **Los dos README contradicen al código**: dicen que `/` redirige a `/es` (es `/en`), «33 fallos» (son 35), describen `npm run check` sin `check:figures`, y **la tabla de proyectos no incluye credit-risk**, la mejor página del sitio. | IR-23, SR-21 | S |
| 43 | `docs/ROADMAP.md` da por «nunca escrita» a `/historia`, que existe y está publicada; la nota «por qué la demo corre en el navegador» sí falta. `CLAUDE.md` omite `npm run snapshot`. `DESIGN.md` declara la barra en 61 px (son 65) y un subrayado ámbar al 50 % que el build, con razón, no hace. `DECISIONES.md` no tiene fila para 307, `unoptimized`, ni canonical-cross-domain en vez de redirect en el dominio viejo. | IR-24, SR-22, DA-29, IR-G | S |
| 44 | **El dominio viejo no redirige: sirve el sitio entero con 200** y canonical al nuevo. ROADMAP y PRODUCT dicen «redirige». Es una estrategia válida, más débil que un 308, y no está razonada. | Mediciones, SE | S (decidir) |
| 45 | `main` local dos commits detrás de `origin/main` (solo scripts del GIF del atlas); `origin/material-atlas-para-publicaciones` fusionada y viva; sin `.gitattributes` para los artefactos generados; `ci.yml` sin `permissions:` explícito y con acciones por tag en vez de SHA; `PROVENANCE.json` con hashes de 65 caracteres (SHA-256 tiene 64); 2,6 MB de GIF versionados sin nota de decisión. | SR-20, SR-23, SR-16, SR-17, SR-18, SR-19 | S |
| 46 | En `next dev` la CSP `style-src 'self'` bloquea los `<style>` de HMR y el script de debug de Vercel Analytics: la consola de desarrollo se llena de violaciones que tapan errores reales. En producción la consola está limpia. | Mediciones | S: relajar `style-src` solo cuando `process.env.NODE_ENV !== "production"`. |

---

## 4. Las comprobaciones nuevas, para que nada de esto vuelva

El repositorio ya sabe hacer esto: cuatro comprobaciones que saben fallar. Faltan seis huecos medidos, cada uno con un fallo real detrás en esta auditoría:

| Comprobación | Qué cierra | Dónde |
|---|---|---|
| `npm audit --omit=dev --audit-level=high` | #1 | paso de `ci.yml` |
| `check:routes` lee cabeceras y metadatos | #5 (`twitter:title == og:title`), #30 (`max-age > 0` en fuentes), CSP sin `sha256-` y con `wasm-unsafe-eval` en la demo, `title ≤ 60` y `description ≤ 155`, JSON-LD parseable, **los ocho redirects leídos de `next.config.ts`** y no cuatro copiados a mano (IR-08) | `scripts/check-routes.mjs` |
| `check:figures` más ancho | falla si la mitad `en` sale vacía (IR-10); lee `README*.md` y `lib/data/**` (IR-10, SR-15); reconoce números escritos con letra (#8); compara el titular del laboratorio con la instantánea (#3) | `scripts/check-figures.ts` |
| `tsc -p scripts --noEmit` | el único código que fabrica artefactos publicados es el único sin tipar; FALLO-32 vivió ahí meses (IR-09) | `scripts/tsconfig.json` + `npm run check` |
| `check:weight` | presupuesto de bundle por ruta versionado en `lib/config/budgets.ts`; hoy 154,5 KB br compartidos y ≤ 6 KB por ruta salvo `fintech` (#33). Un presupuesto que solo sube a mano y con motivo escrito | nuevo script |
| Lighthouse CI | contra el `next start` que el último paso ya levanta: `/en`, `/en/research/fintech-inclusion`, `/en/projects/credit-risk`, con umbrales (LCP < 2,0 s, CLS < 0,05, TBT < 200 ms, performance ≥ 0,95, accessibility = 1). Resuelve las tres «hipótesis — medir» del informe de ingeniería sin discutirlas | `treosh/lighthouse-ci-action` |
| Vitest, solo donde el coste está demostrado | `CountUp` con la regex `SHAPE` sobre los diez valores reales; `Motion.tsx` con el salvavidas armado si el montaje falla; `lib/data/credit-risk.ts` con series no vacías; `fetchIndex` cayendo a la instantánea | ~120 líneas, un paso de CI |

Y dos que no son código: **Dependabot** (#1) y **protección de rama** (#2).

---

## 5. Plan por sesiones

Cada sesión deja el sitio en verde (`npm run check`, `npm run build`, navegador en claro y oscuro, ES y EN). El orden es impacto ÷ esfuerzo, con la restricción de que lo que un reclutador ve hoy va antes que lo que ve un auditor.

**Sesión 1 — P0 entero (una tarde).** #1 Next 16.3.6 + Dependabot + audit en CI · #2 protección de rama · #4 título y descripción del CV · #5 `twitter()` + comprobación · #6 `Motion.tsx` + `error.tsx` + `ThemeToggle` · #8 el commit de contenido de nueve inconsistencias · #9 HSTS preload · #36 siete redirects a 308 · #42 README. Todo S. Con esto la nota de seguridad y la de SEO suben dos puntos cada una.

**Sesión 2 — Las cifras vivas y el PDF (una sesión).** #3 derivar el titular del laboratorio de `overfitting.overall` y pintarlo en servidor desde la instantánea (#18) · `npm run snapshot` en la rutina · #7 regla de recorte por cifra, certificaciones y términos en el PDF de una página · `check:figures` ampliado (§4). Es la sesión que protege la tesis del sitio: «verificable o no se publica».

**Sesión 3 — Conversión (una sesión, más lo que tarde Power BI Desktop).** #10 cuatro capturas + Tableau · #11 portada a ~1.100 palabras, cuatro cifras, toolkit a seis, `skillsTech` fuera, CV web con los textos cortos · #12 banda de cierre en las cinco páginas + CV en el pie · #14 B2 fuera de la cabecera · #15 palabras clave ATS · #16 y #17 copy. Y las dos decisiones del autor: #13 orden de JARVIS y #20 foto.

**Sesión 4 — Diseño y accesibilidad (una sesión).** #21 foco del atlas · #23 `border-control` · #24 `role="status"` y `tabindex` · #26 opacidad · #27 la deriva del contrato (`ProjectHeader`, `WRAP` único, `SectionNav` heredando, tres `h1`, titulares, `<dt>`, 404) · #22 texto de los gráficos · #28 `--atlas-mid` · #25 diagrama · #29 el resto en un barrido. Después, actualizar `DESIGN.md` a lo que el build hace (#43).

**Sesión 5 — Ingeniería (una sesión).** #30 `Cache-Control` · #31 subset del serif · #32 `stamp.json` · #33 `import()` de `render.ts` · #34 `<img>` · #35 demo de crédito autoalojada y diferida · #40 higiene de rendimiento · #41 código muerto y cabeceras · #37 `lastModified` desde Git.

**Sesión 6 — La red (una sesión).** §4 entera: `check:routes` con cabeceras, `check:figures` ancho, `tsc` para `scripts/`, `check:weight`, Lighthouse CI, Vitest. #38 JSON-LD por página y #39 títulos a medida. #43–#46 documentación y repositorio.

**Después, y en este orden.** #19 la pieza de FP&A sintética (la única que mueve el posicionamiento; una o dos semanas de trabajo propio, no de sesión) · `opengraph-image` por ruta con `ImageResponse`, composición tipográfica sin foto · «Cómo trabajo» al final de `/historia`: cinco reglas, cada una con el artefacto que la produjo (la única personalidad que este sitio puede permitirse) · eventos de conversión sin cookies (descarga del PDF, clic en `mailto:`, clic en cada cifra): hoy Vercel Analytics cuenta páginas vistas y no cuenta lo único que importa · la nota «por qué la demo corre en el navegador» · cerrar en el ROADMAP lo que ya está hecho.

---

## 6. Donde los expertos se equivocan, o hay que matizar

- **CO-01 no es «la cifra contradice al artefacto»: es «la cifra está escrita a mano y el artefacto cambia cada noche».** El experto comparó contra la instantánea del 16 sep (51 supervivientes). El índice vivo de hoy dice 45, así que «menos de 50» y «13 %» son verdad hoy. La consecuencia es peor, no mejor: un titular fijo sobre un dato móvil entra y sale de la verdad sin que nadie lo toque, y la instantánea de `public/` lleva una semana de retraso. Por eso la solución es derivar (#3), no corregir el número.
- **SR-10 (`Access-Control-Allow-Origin: *`)** es comportamiento de la capa estática de Vercel para contenido prerenderizado, no del repositorio. En un sitio 100 % público sin sesión no expone nada. Basta una línea en DECISIONES.md.
- **307 frente a 308 (IR-28 y SE-06 discrepan).** SEO tiene razón en que los siete redirects de ruta concreta son permanentes y deben ser 308. Ingeniería tiene razón en que `/` es distinto: un 308 queda cacheado en el navegador y congelaría cualquier detección futura de idioma. Recomendación: siete a 308, `/` se decide (§7).
- **DA-02 (texto de gráficos a 3–5 px)** es aritmética sobre el código, no una captura: la auditoría en vivo no pudo capturar pantalla a 320 px (el panel del navegador estaba oculto). Es casi seguro cierto y coincide con una queja real; conviene abrir los tres gráficos en un teléfono antes de elegir la solución.
- **DA-tabla de píldoras**: los dos únicos fallos de contraste de `StatusPill` (`building` sobre `band2`, `idea` sobre `band`) son combinaciones que hoy no se usan. Se anotan porque el componente las acepta.
- **CO-08 (JARVIS)** es un juicio de posicionamiento, no un defecto. La ingeniería de esa pieza es la mejor del portafolio; la pregunta es solo dónde está colocada, y la responde el autor.
- **SR-01 en Vercel**: la RCE de Windows no aplica al despliegue (Linux) sino a `npm run dev` local; la de Image Optimization existe como endpoint aunque todas las imágenes vayan `unoptimized`. Se parchea igual, y es la señal más barata de arreglar de todo el informe.
- **Lo que esta auditoría no hizo**: no ejecutó `npm run build` (el árbol está limpio y CI lo corre en cada push); no midió con Lighthouse las 16 rutas sino tres; no revisó visualmente cada página a cada ancho (midió desborde, contraste y tamaños por DOM). Los dos commits que `origin/main` tiene por delante del local solo añaden scripts del GIF del atlas; no cambian el sitio.

---

## 7. Decisiones que solo puede tomar el autor

1. **La pieza de FP&A sintética (#19).** Es trabajo de una o dos semanas y la única entrada de este documento que cambia lo que un hiring manager lee. Sin ella, el sitio sigue siendo un excelente portafolio de datos con un párrafo de finanzas.
2. **La foto (#20).** PRODUCT.md dice que el hero la admite sin rediseño y el andamiaje existe. O se pone, o se borra `portraitPending` y se cierra la queja por decisión.
3. **JARVIS: segundo puesto o último (#13).**
4. **`/` en 307 o 308 (#36)**, y si el dominio viejo pasa a redirigir con 308 o se queda en canonical (#44). Las dos van a DECISIONES.md.
5. **Siete líneas de veredicto en serif en `/historia` (DA-19)**: o una sola, o enmendar DESIGN.md. Lo que no puede quedar es la contradicción silenciosa.
6. **Palabras clave cloud**: no hay ninguna plataforma en el sitio (Azure, AWS, GCP, Snowflake, Databricks) y muchas vacantes de Analytics Engineer filtran por ahí. Reconocer el hueco es una decisión de carrera, no de copy.

---

## 8. Método

Cinco agentes en paralelo, solo lectura, sin verse entre sí: diseño/accesibilidad, ingeniería/rendimiento y contenido/reclutador con Claude Opus; SEO/i18n y seguridad/CI con Claude Sonnet. Cada uno leyó `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md`, `FALLOS.md` y `ROADMAP.md` antes de auditar, con la instrucción de no repetir pendientes ya conocidos y de marcar como hipótesis lo que no pudiera verificar desde el código. En paralelo, el orquestador midió el sitio publicado: `npm run check`, Lighthouse 13 con Edge headless (tres páginas, móvil y escritorio), consola y desborde en las 16 rutas a cuatro anchos, tema oscuro, sonda DOM de accesibilidad, `curl` de cabeceras, redirects, 404, sitemap, manifest y dominio viejo. Las afirmaciones de mayor consecuencia de cada informe (CVE, `twitter:*`, título del CV, regla de recorte del PDF, cifra del laboratorio contra el dato vivo, protección de rama, Dependabot) se verificaron una segunda vez antes de escribir este documento. Ningún agente editó el repositorio; los únicos ficheros nuevos son este y la carpeta `auditoria-2026-09-23/`.
