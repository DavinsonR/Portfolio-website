## Sesión 27 — 23 sep 2026 · Las cifras de la tesis, al día y en un solo sitio

Encargo: la página `/research/fintech-inclusion` publicaba cifras anteriores a ADR-017 (denominador rezagado) y ADR-018 (potencia y equivalencia) del repositorio de la tesis. Rama `fintech-inclusion-cifras-vigentes`.

### La medida antes de opinar

Página contra `data/processed/econ/resultados.json` y `curva_especificacion.json` del repositorio (`main` en cfc0498, generados el 17 sep):

| | Página | Repositorio |
|---|---|---|
| β base | +0,0007, p = 0,90 | +0,0038 (EE 0,0062), p = 0,54 |
| Bootstrap salvaje / placebo | 0,89 / 0,68 | 0,48 / 0,51 |
| Sin efectos de tiempo | +0,0242 | +0,027 |
| CD de Pesaran | 2,46 (p = 0,014) | 2,40 (p = 0,016) |
| KMO | 0,314 acceso, 0,404 uso | 0,317 uso, 0,407 profundidad |
| Pruebas / especificaciones | 91 / 15 | 189 / 160 |

Las mismas cifras estaban copiadas a mano en la cabecera, la banda, la tabla, las fichas, la portada (figura del atlas) y `/historia`, en dos idiomas. `check:figures` no las veía: sus afirmaciones son de conteos (fuentes, municipios), no de coeficientes. Además, la tabla de la deriva de `/historia` (−0,02 · +1,20 · +2,47) ya no coincidía con los datos que la figura del atlas pinta (−0,03 · +1,20 · +2,45). Registrado como FALLO-40.

### Lo que se hizo

- **`lib/data/thesis-results.ts`**: cada cifra econométrica, de potencia, de la curva de especificación y de la proyección se escribe una vez, al redondeo con que se publica, con el archivo y la clave de origen en un comentario. `thesisFormat(lang)` le pone el formato de cada idioma (coma o punto decimal, menos tipográfico, signo explícito). `projects.ts`, `home.ts` e `historia.ts` interpolan; ninguna cifra de inferencia queda escrita a mano.
- **`check:figures`** rechaza un «β = …» literal en `lib/content/` (probado: con un `β = +0,0007` añadido falla con código 1).
- **Copy nuevo de la página** en los dos idiomas: titular «Un límite, no una ausencia», subtítulo con 160 especificaciones, tres puntos de valor, acción primaria «Explorar el atlas», bloque «Lo que esto demuestra», salidas por lector (CV, `CITATION.cff`, correo) y la línea de la tesis con universidad, año y director (Gabriel Penagos Londoño, que el README del repositorio ya publica). Resultados: MDE al 80 %, equivalencia a ±0,50 y ±0,25 pp, varianza que se llevan los efectos de dos vías, jackknife, curva de especificación, el contraste del shift-share con la urbanización y la capa de proyección como escenario (38,6 %, 3 de 8 años, +8,3 % sin 2021, p = 0,29 agrupado por año). Índice: KMO corregidos y el denominador rezagado (−0,31 contra +0,05).
- **JSON-LD**: el nodo `ScholarlyArticle` lleva `sourceOrganization` y la página añade un `Dataset` (CC BY-SA 4.0, Colombia, 2018/2025) con lo que la propia página enseña. `metaDesc` reescrita dentro de 155 caracteres; los títulos se quedan (con el sufijo del nombre, 57 y 56 caracteres).
- **`scripts/generate-atlas-figure.mjs`**: con la capa de proyección, `anios` del repositorio llega a 2028 y el índice no tiene valor en esos años; «el último año» habría pintado un panel vacío con mediana NaN al sincronizar. Ahora los paneles salen del primer y último año observados, y el generador emite `drift` (2018, 2021, 2025), de donde `/historia` lee su tabla. Probado en seco contra `atlas/data/` del repositorio: 2018 → 2025, 17/32 → 1/32, medianas −0,04 → 2,48. Por la misma causa, `components/atlas/Atlas.tsx` abre ahora en el último año observado y no en el último de `anios`.

### Lo que se verificó

`npm run check` en verde (lint, tipos, scripts, 12 pruebas, paridad, artefactos, cifras: 10 afirmaciones, 108 menciones). `npm run build` en verde. `check:routes` contra `next start`: 16 rutas, metadatos, JSON-LD (`WebPage`, `BreadcrumbList`, `ScholarlyArticle`, `Dataset`) y tarjetas propias. `check:weight`: máximo 161,5 KB br. En navegador: sin desborde a 320 px, cero errores de consola salvo el script de analítica de Vercel en localhost.

### Lo que queda

- **Sincronizar `public/atlas/*.json`** con `atlas/data/` del repositorio y correr `npm run atlas` (la figura y la tabla de `/historia` pasan a −0,04 · +1,35 · 3 de 33 · +2,48). El atlas interactivo aún no pinta la proyección: sus JSON nuevos traen `anios` hasta 2028, `anios_proyectados` y series `*_proy`. Esta sesión ya hace que abra en el último año observado (antes habría abierto en 2028, con el mapa del índice vacío), pero el selector seguirá ofreciendo 2026–2028; qué enseñar ahí es la tarea de pintar la proyección.
- **Actualizar `lib/data/thesis-results.ts`** cuando el repositorio cierre ADR-024 (TOST con t(32), bootstrap con CRVE): las cifras de inferencia de esta sesión son las de `main` en cfc0498.
- Decisión del autor: no hay agenda en línea, así que la salida «para tu organización» es un correo, no «agenda 20 minutos».

### Cierre (misma sesión, tras ADR-024 y ADR-025 del repositorio de la tesis)

- `public/atlas/*.json` sincronizados con `atlas/data/` del repositorio y `npm run atlas` regenerado.
- `lib/data/thesis-results.ts` actualizado a las cifras del cierre. La cota del titular pasa de «medio punto» a 0,55 pp por desviación identificante (unos 2 pp por desviación bruta): con el bootstrap studentizado con el error agrupado, la equivalencia a ±0,50 pp ya no pasa (p = 0,07). También cambian el bootstrap (0,55), el efecto mínimo detectable (0,60), la curva (50 de 80), el placebo del denominador (β en lugar de correlaciones), 242 pruebas y 25 ADR.
- Las cuatro frases que decían «medio punto» fuera del módulo (portada, historia, resumen del proyecto) y las que prometían «vintages» o «cuatro diseños» pasan a leer del módulo o a describir lo que el código hace. CV regenerado.
- Sigue pendiente, como decisión de diseño y no de cifras: qué pinta el atlas interactivo en 2026–2028.
