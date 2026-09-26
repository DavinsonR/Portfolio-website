## Sesión 30 — 24 sep 2026 · El atlas pinta la proyección, con su incertidumbre y sin tabla de posiciones

Encargo: el deslizador del atlas iba de 2018 a 2028 desde que los JSON de la tesis traen la capa de proyección, pero el selector solo ofrecía índice, variables y contexto: en 2026–2028 el mapa salía vacío y la proyección no se podía ver. Rama `atlas-proyeccion-escenario`. La decisión se registra como D-36; el diseño viene de ADR-022 y ADR-023 del repositorio de la tesis.

### La medida antes de tocar

- `public/atlas/series_departamento.json`: `anios` 2018–2028, `anios_proyectados` 2026–2028, cuatro series `*_proy` con 33 valores en cada año proyectado y ninguno en los observados; el índice, al revés. `proyeccion` trae `ancla` (fuente, fecha de corte, antigüedad, `vencida`), `nivel_intervalo`, `vintage` y `backtest` (`origenes_ganados`, `n_origenes`, `dm_p`, `dm_agrupacion`, `cobertura_intervalo_empirica`, `cobertura_intervalo_nominal`, entre otras).
- `series_municipio.json` no tiene años proyectados ni series de proyección: la capa es solo departamental.
- `atlas_meta.json` declara los cuatro indicadores con `grupo: "proyeccion"`; los tres de crecimiento en escala divergente y el ancho del intervalo en secuencial.

### Lo que se hizo

- **Años por grupo** (`Atlas.tsx`). Índice, variables y contexto recorren los años observados; la proyección, los proyectados. El año activo se lee al más cercano del grupo (`nearest`), así que elegir «Crecimiento proyectado» desde 2025 salta a 2026 y volver al índice desde 2027 cae en 2025, sin un segundo render. Sin año elegido, el atlas sigue abriendo en el índice compuesto del último año observado.
- **Selector.** Nuevo `optgroup` «Proyección 2026–2028 · escenario» / «Forecast 2026–2028 · scenario» (`copy.groups.proyeccion`). En municipios sigue listado pero deshabilitado, con una línea (`aria-describedby`) que dice que solo existe por departamento; si la proyección estaba activa, el mapa cae al índice compuesto por el mismo mecanismo de lectura a través.
- **Codificación** (`render.ts`). Color = valor en la escala del indicador. En las tres capas de crecimiento, el relleno se mezcla con el papel según el ancho del intervalo del mismo departamento y año: 1 el más estrecho, 0,35 el más ancho, con un solo dominio para 2026–2028. Se mezcla como color sólido y no como `fill-opacity`, porque en la vista en relieve un relleno translúcido deja ver el costado apilado. Trama diagonal en los años proyectados: dos patrones SVG (uno dentro del grupo inclinado, con el paso corregido por su escala; otro plano para el archipiélago y la leyenda), cada uno con una línea de papel y otra de tinta tenue para que se lea sobre el escalón más claro y el más oscuro en los dos temas. La leyenda gana una segunda fila: «proyectado» con la trama y, en las capas de crecimiento, «intervalo estrecho → ancho» con tres muestras de opacidad. El ancho del intervalo es su propia capa, secuencial y sin opacidad.
- **Tooltip y ficha fijada**: valor central con su unidad y el intervalo, central ± ancho/2, con el nivel nominal leído del JSON.
- **Nota fija** (`ForecastNote`, `role="note"`) mientras el indicador activo es de proyección: fuente del ancla y fecha de corte, su antigüedad cuando `vencida` es verdadero, «escenario condicional al ancla, no un pronóstico con superioridad demostrada», orígenes ganados de `n_origenes` con el p agrupado por año, y la cobertura empírica al nivel nominal. Cada cifra sale del JSON y se formatea por idioma; el diccionario solo tiene plantillas, y una clave ausente quita su frase.
- **Sin tablas de posiciones** (ADR-023). En la proyección la lista de la derecha no numera ni ordena por valor: va por región y luego por nombre, cada región en su propio `<tbody>` con un encabezado `scope="rowgroup"`, entera (cortar en cabeza y cola también es un ranking) y dentro de un marco con desplazamiento de 520 px, enfocable. Las barras «Por región» pasan a orden alfabético. El bloque de dimensiones del índice se oculta: en un año proyectado serían cuatro rayas.
- **La línea de evolución** recorre los años del grupo y no `anios`: el índice se dibujaba en un marco que terminaba tres años vacíos después.
- **Figura de portada**: `npm run atlas` no cambia un byte; `scripts/generate-atlas-figure.mjs` ya elegía solo años observados desde la sesión 27.

### Lo que se verificó

- `npm run check` en verde (lint, tipos, scripts, 25 pruebas, paridad, artefactos, cifras: 10 afirmaciones, 108 menciones). `npm run build` en verde. `check:weight`: 18 rutas dentro de 172 KB br, la de la tesis en 158,4 KB.
- En navegador contra `next start`: abre en índice compuesto 2025 con el deslizador en 2018–2025; «Crecimiento proyectado» salta a 2026 con 33 tramas, rellenos con opacidad variable, la nota y la leyenda de dos filas; el deslizador en proyección va de 2026 a 2028; la capa de ancho pinta en secuencial sin opacidad; relieve con trama; municipios deshabilita el grupo, muestra la línea y cae al índice 2024; volver a Plano recupera la proyección en el mismo año. Español e inglés, claro y oscuro. Contraste de la nota: cuerpo 7,23:1 y rótulo 7,57:1 en claro, 8,48:1 y 7,05:1 en oscuro. Sin desborde horizontal a 320, 393, 768 y 1280 px, en departamentos y municipios. Consola sin errores en una carga limpia salvo el script de analítica de Vercel en localhost.

### Decisiones menores

- El ancho del intervalo que publica el export es el del crecimiento total; se aplica también al per cápita y al sin anclar. El per cápita resta una proyección de población determinista y el sin anclar es el mismo modelo antes de la reconciliación, así que el ancho es el mismo; si el export publicara uno por capa, bastaría leerlo.
- La antigüedad del ancla se dice solo cuando el propio JSON la marca como vencida, y sin el `aviso` interno (que es una instrucción al autor, no al lector).
- `± {half} pp`, `p = {p}` y las unidades van con espacio de no separación: a 320 px el paréntesis se partía en dos líneas.

### Lo que queda

- `docs/bitacora/sesion-28.md` y su fila existen en `main` y no en esta rama: al fusionar, la fila 28 va antes de esta.
- Las etiquetas de los indicadores llegan del export solo en español, también en `/en` (ya pasaba con los demás grupos).
