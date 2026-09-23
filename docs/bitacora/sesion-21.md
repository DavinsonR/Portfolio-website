## Sesión 21 — 23 sep 2026 · Diseño y accesibilidad: el foco que no existía, el texto de 4 píxeles, y la deriva del contrato

Sesión 4 del plan de la [auditoría](../AUDITORIA-2026-09-23.md). Encargo: «continúa hasta terminar».

### La medida antes de opinar

El informe de diseño midió, no opinó: el anillo de foco del conmutador de vistas del atlas era azul sobre azul, **1,00:1** — el foco no existía justo en el control más usado del mapa. El texto de los tres gráficos se pintaba a **3–5 px reales** en un teléfono: `viewBox` de 720 en un contenedor de 297 px es escala 0,41, y un `font-size` de 10 son 4,1 px; es literalmente la queja de un revisor real que `PRODUCT.md` ya registraba. `--color-control` se creó para WCAG 1.4.11 (3,64:1) y solo llegó al atlas y al laboratorio: once controles seguían con `rule` a 1,37:1. Y una capa de deriva: `h1` en dos pesos, columna en tres medidas con la `SectionNav` fija a 1180 px y desalineada 100 px de su propia página, titulares de sección a 12,5 px apagados sobre contenido a 15 px, un `<dl>` con la definición antes del término, el 404 sin `<main>` ni `<h1>`.

### Lo que se hizo

- **DA-01 · Foco visible.** El botón presionado del atlas y el botón de detalle sobre el coropleto llevan el anillo en papel (8,86:1 sobre `cold`), hacia dentro.
- **DA-02 · Texto de gráficos legible en el teléfono.** `components/ScaleAware.tsx`: un envoltorio que publica `--k = viewBox / ancho real` con un `ResizeObserver`, y los `<text>` ponen su tamaño como `calc(12px * var(--k))`: en unidades del viewBox crece justo lo que la escala encoge, y en pantalla mide siempre lo que dice. Los cuatro gráficos de credit-risk siguen siendo SVG de servidor (hidrata solo el `div`); el del laboratorio ya era cliente y publica `--k` en su propio envoltorio. Medido a 320 px: **10–12 px reales** donde antes había 4.
- **DA-03 · `border-control` en los once controles** (conmutador de tema, copiar correo, nueve botones contorneados). Los chips se quedan con `rule`: no son controles.
- **DA-04 · Los estados se anuncian**: `role="status"` en carga y sin datos, `role="alert"` en error, en el atlas y en el laboratorio.
- **DA-05 · Cinco regiones con scroll** son alcanzables por teclado (`tabIndex={0}`, `role="region"`, nombre de la tabla que contienen).
- **DA-06 · Los seis enlaces salen del `role="img"`** del diagrama de Power BI; la lista de tablas enlazada vive debajo, con todo lo que la imagen dice.
- **DA-07 · Nada de texto atenuado por opacidad**: las filas sin operaciones del laboratorio van en `muted` y cursiva (5,35:1, era 2,16:1); las regiones fuera del filtro del atlas, en `muted` (era 1,99:1).
- **DA-09 · Una medida.** `SectionNav` hereda el `wrap` de la página; `tracking` y `fintech-inclusion` pasan de 1180 a **980 px**, que es lo que `DESIGN.md` declara para el CV y el proyecto.
- **DA-10 · Titulares que pesan más que su contenido**: los `<h3>` a 12,5 px apagados de `tracking` (×5) y `powerbi` (×2) y el `<h2>` de Divulgaciones pasan al paso de titular. En el CV, «Reconocimientos» y «Trabajo remoto» eran `<p>` con `<h3>` colgando: ahora `<h3>` y `<h4>`.
- **DA-11 · Un solo `h1`**: `powerbi` (iba a 50 px con peso 500, más grande y más ligero que el nombre de la persona en la portada), `tracking` y `fintech-inclusion` al paso Display (800, 30–44 px).
- **DA-12 · `<dt>` antes de `<dd>`** en la tabla de las 89 pruebas; el número sigue delante en pantalla con `order`.
- **DA-13 · Dos secciones destino de navegación sin encabezado** (`#resumen` de la tesis, el pasaje de transición del CV) tienen el suyo.
- **DA-14 · El 404** con `<main>` y `<h1>`.
- **DA-15 · El contorno departamental de la figura del atlas** pasa de `coldline` (1,40:1 sobre el escalón neutro) a `control` (3,64:1): el departamento en el escalón neutro deja de leerse como papel en blanco. `npm run atlas` regenerado. El escalón neutro en sí no se movió: oscurecerlo le quita contraste a los escalones ±1, y ese es un problema de rampa que merece su propia sesión.
- **DA-16 · La fila del atlas** ya no es el control: lo es un botón dentro de la celda del nombre, con `aria-pressed`, y la fila conserva sus encabezados.
- **DA-17 · Los tres SVG de los raíles del atlas** tienen `role="img"` y nombre.
- **DA-18 · Las cifras grandes del laboratorio** en Source Serif 4 tabular, como toda cifra grande del sitio.
- **DA-20 · `alt=""`** en las capturas de JARVIS: el pie ya las nombra y describe.
- **DA-21 / 22 / 23 / 24 / 25 / 26 / 27** · `.atlas-credit` a 14 px (era prosa a 13); el 11,5 y el 13 fuera de escala a 12,5; `scroll-mt-16` → `scroll-mt-[72px]` en las nueve anclas (la barra mide 65, no 64); el `role="group"` redundante fuera y las cuatro figuras de credit-risk con `aria-labelledby` a su pie; la tabla del laboratorio sin radio; `aria-current="location"`; el revelado escucha el cambio de `prefers-reduced-motion`; la constante `mono` que contenía el serif se llama `serif`.
- **DA-29 · `DESIGN.md`** deja de describir un estado peor que el build: la barra mide 65 px, y el subrayado ámbar va a plena fuerza (al 50 % sobre `warmsoft` daba 2,07:1).

### Lo que se verificó

`npm run check` en verde. `npm run atlas` regenera la figura con un solo cambio. `npm run build` en verde. Contra `next start`: `check:routes` en verde; a 320 px el texto de los gráficos mide 10–12 px reales en credit-risk y en el laboratorio, sin desborde; la tabla de pruebas expone `dt, dd, dd`; cuatro cifras del laboratorio en serif; cuatro regiones con scroll nombradas; el `h1` a 800 en las tres páginas que iban a 500; los `h3` de `tracking` a 19–20 px; `alt=""` en las capturas; el borde de los controles en `--color-control`; el CV sin saltos de encabezado y con «El rol cruzado» como `h2`; Divulgaciones a 20 px; el 404 con `<main>` y `<h1>`; las reglas de foco del atlas en la hoja publicada; el diagrama de Power BI sin enlaces dentro del `role="img"`.

No se pudo ver disparar: el atlas interactivo (se carga al acercarse a 600 px y el panel del navegador estaba oculto), así que el botón de fila y los nombres de los raíles se verificaron en el código y en la compilación, no en pantalla.

### Lo que queda de la dimensión

- **DA-19 · Siete párrafos en serif en `/historia`**: o una sola línea de veredicto o enmendar `DESIGN.md`. Decisión del autor.
- **DA-30 · Los `id` de sección en español en `/en`**: cosmético; si se cambian hay que revisar anclas internas.
- **El escalón neutro del atlas** (`--atlas-mid`) sigue pendiente como problema de rampa, en claro y en oscuro.
- Las etiquetas del mapa interactivo (`atlas/render.ts`, 9,5–11) no pasan por `ScaleAware`: el mapa tiene su propio tamaño mínimo.
