## Sesión 25 — 23 sep 2026 · Se abre el lab: pronóstico macro en LATAM, para jugarlo y no solo leerlo

Encargo: una sección nueva en *labs* con `macro-forecast-lab-latam`, «dinámica, didáctica, intuitiva», guiada por la tesis y el atlas pero para toda la región, y distinta para que no se solapen.

### La medida antes de diseñar

- **No existía `labs`.** El ROADMAP lo tenía reservado («nada se abre sin una necesidad real»). Esta es la primera: un experimento cuyo resultado —casi nada le gana al pronóstico ingenuo— se entiende mejor intentando ganarle que leyéndolo.
- **Para no solaparse con el atlas, no es un mapa.** El atlas es geografía de Colombia (coroplético, año, indicador, relieve). El lab es tiempo: la región entra como un conjunto de economías que se comparan, no como polígonos.
- **El margen de peso era de ~10 KB** (155–162 de 172 KB br). Las seis piezas van en islas perezosas: lo que baja con el HTML es una puerta de 600 px (el patrón del atlas, por FALLO-30); los gráficos y los datos se piden al abrirse. Resultado: 156,3 KB br, en la media del sitio.
- **La CSP obliga a servir los datos del mismo origen**: `public/forecast-lab/*.json` (88 KB), generados en el otro repositorio por `macro_lab.exportar_web`, igual que la tesis con `public/atlas/`.

### Lo que se hizo

- **`/labs/macro-forecast`** en los cinco sitios que exige una ruta (página, contenido en los dos idiomas, metadatos con `alternates` y `social`, `sitemap`, redirect 308), más la caché horaria de `/forecast-lab/`.
- **Seis piezas** (`components/forecast/`): jugar contra el ingenuo arrastrando un punto (o con flechas: es un `role="slider"`), el origen móvil reproducible con el error acumulado frente al ingenuo, la región como dispersión por modelo con Wilcoxon al lado, la frontera de cobertura con un deslizador de 1 a 33 variables, el experimento de frecuencia y el interruptor de Holm. La economía elegida en una pieza viaja a las demás.
- **El ámbar se usa en una sola cosa**: el pronóstico del visitante, que es lo único humano de la página. Los modelos se distinguen por forma y trazo además del color, y el ingenuo va gris y discontinuo, como toda referencia del sitio.
- **Contenido en un bloque propio** (`lib/content/forecast.ts`) y no en `projects.ts`, que además tiene trabajo sin subir en otra copia del repositorio.
- **Pruebas** (`tests/forecast-lab.test.ts`): el contrato (un pronóstico por origen y modelo; el ingenuo igual al último dato, que es la forma de detectar una serie corrida un período), la aritmética de trimestres, y **las cifras escritas en la página derivadas de los JSON** (0,86; 17 de 20; 20 economías; 18 comparaciones).

### Lo que se encontró al hacerlo

- **«N países» choca con `check:figures`**, que reserva ese patrón para el alcance del CV (15+). Se dijo «economías» en vez de relajar la comprobación.
- **Dos cifras propias infladas en el primer borrador**, corregidas antes de publicar: «0 rankings por economía que sobreviven a Holm en ninguna de las cuatro pistas» era falso (en la calma mensual de Colombia sobreviven cuatro, y el propio widget de Holm lo enseña) y la auditoría corrigió ocho errores, no nueve.
- **Hidratación (#418)**: la isla nacía abierta donde no hay `IntersectionObserver` —el servidor— y cerrada en el cliente. Ahora nace cerrada en los dos.
- **Etiquetas cortadas en el teléfono**: con el texto a 12 px reales (`ScaleAware`), los nombres a la izquierda del eje no cabían en 375 px. Pasaron encima de cada fila. Medido: 0 textos fuera de su SVG y ninguno por debajo de 12 px.

### Lo que se verificó

`npm run check` en verde (17 pruebas, 5 nuevas). `npm run build` en verde. `check:weight`: 18 rutas, máximo 161,5 KB br. `check:routes`: 18 rutas a 200, 9 redirects, JSON-LD y tarjetas propias. En el navegador, tema claro y oscuro, español e inglés, escritorio y 375 px: sin desborde horizontal y sin errores de consola salvo el 404 del script de analítica en localhost.
