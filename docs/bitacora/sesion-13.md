<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 13 — 21 ago 2026 · Auditoría del diccionario: la fuente única contra la fuente real

Pregunta de entrada del usuario: si el hackathon BodyTech (2024, Tableau) merece entrar al portafolio o si quedó por debajo de lo que hace hoy. **Decisión: entra como reconocimiento con enlace, no como proyecto.** La sección se llama "Proyectos en producción" y su subtítulo promete código abierto y verificable; poner al lado un tablero de un fin de semana no suma un proyecto, recalibra hacia abajo lo que la palabra significa en esta página. Pero el premio es la única validación *externa* del sitio —todo lo demás lo construyó y lo evaluó él mismo— y es BI puro, que es la mitad del título que vende (*Financial BI Analyst*). Estaba en el CV como texto plano, sin evidencia. Ahora el título del premio enlaza al tablero público, en el sitio y en el PDF.

Aprovechando el paso por `dictionaries.ts` se auditó el archivo completo contra la fuente real, no contra la memoria: el `index.json` **publicado** (no la base local — lección del FALLO-28), el `manifest.json` de dbt y `pytest --collect-only`.

### Lo que no cuadraba

| # | Decía | Es | Dónde |
|---|---|---|---|
| 1 | "una de cada nueve" sobrevive | 47/365 = **12,9%** → una de cada ocho | embudo ES/EN |
| 2 | "supervivencia plana en ~11%" | 15,5 / 11,4 / 13,2 / 11,1% por nº de señales | gráfico de supervivencia |
| 3 | "cero operaciones en 4,5 años" con 5 señales | exposición media 0,004%, no cero | gráfico de exposición |
| 4 | 139 pruebas unitarias en Python | **171** recolectadas por pytest | metodología + CV |
| 5 | "23 fallos" en la bitácora | **28** | divulgaciones |
| 6 | LEE Javeriana "2023 — 2024" | jul–dic 2023, como ya decía el CV | trayectoria |
| 7 | "Las 31 combinaciones de este activo" | hay activos con 15 (sin volumen) | explorador |
| 8 | "60.000 velas" | son filas bronce (la misma vela por dos fuentes) y la cifra caduca mañana → "más de 58.000" | metodología + CV |

Los cuatro primeros son el mismo problema: **prosa estática describiendo cifras que el cron recalcula cada noche**. La página mostraba "12,9% tasa de supervivencia" en el panel dinámico y, dos centímetros abajo, un párrafo estático diciendo "una de cada nueve". En un sitio cuya tesis es *"cada cifra enlaza a lo que la prueba"*, la contradicción se ve en la misma pantalla. La corrección no fue solo actualizar los números: donde se pudo, se quitó la cifra del texto y se dejó la afirmación cualitativa que sigue siendo verdad aunque el dato se mueva; y el título de combinaciones ahora es `{n}`, resuelto contra el activo abierto, como ya hacía `health.totals`.

89 pruebas de dbt sí eran 89 (manifest), y 1.392 variantes / 47 supervivientes también estaban bien.

### Notas de ejecución

- **No hay motor LaTeX en el WSL**; los PDF se recompilaron con el `pdflatex.exe` de MiKTeX (Windows). Mismo `.tex`, 2 páginas cada uno, enlaces vivos. Pesan 242 KB contra los 49 KB anteriores: pdfTeX incrusta las fuentes completas donde el motor anterior las subconjuntaba. Si molesta el peso, se recompilan con tectonic.
- **Sesión concurrente**: mientras se auditaba, otra sesión commiteó `f3a4264` sobre el mismo archivo (45 → 48 activos). Se rebasó el trabajo sobre ese estado en vez de sobrescribirlo. Dos agentes en el mismo repo a la vez es una forma barata de perder trabajo.
- Estos hallazgos **no** se numeran como FALLO-XX: son deuda de contenido, no fallos de ingeniería, y renumerarlos volvería a romper la cifra de la divulgación.

**Pendiente del usuario:** el workbook de Tableau se llama `BodyTrends-ADataAnalysisProyect` — "Proyect" no existe en inglés, y está en la URL y en el título visible. Renombrarlo cambia la URL: al hacerlo hay que actualizar el `href` del premio en `dictionaries.ts` (hay un comentario en el archivo advirtiéndolo).

### Anexo sesión 13 — el tablero del hackathon, republicado y enlazado

El workbook se bajó de Tableau Public (`public.tableau.com/workbooks/<slug>.twb` entrega el `.twbx` completo cuando la descarga está permitida), se corrigió sobre su XML y el usuario lo republicó. Lo que se arregló: tildes en todos los títulos, `Nom Oferta` → `Oferta` y demás nombres de columna crudos, el typo del dashboard `BodyTrends Anaysis` → `BodyTrends Analytics`, un carácter `Æ` suelto en el título de portada, cinco paneles que salían mudos porque tenían el título oculto, la clave de color escrita en el título (el color de las barras es la hora del día; el tamaño de las burbujas, la facturación de la sede), moneda declarada en el eje de ingreso, y fuera el panel de facturación cuyo eje "Date 0–32" era día-del-mes tratado como continuo — su forma era un artefacto, no un hallazgo.

Hallazgo que vale para cualquier publicación futura en Tableau Public: **el estado de resaltado y selección se publica con el libro**. Los rectángulos azules que se veían pegados a los ejes eran `<highlight>` y `<selection-collection>` guardados dentro de `<windows>` — 5.470 caracteres de estado de sesión viajando al público. Se limpian antes de publicar.

Verificación: no se confía en el código HTTP. Tableau Public devuelve 200 incluso para vizzes inexistentes (es una SPA), así que la comprobación válida fue **descargar el workbook publicado** y contar las correcciones dentro del XML servido: 0 resaltados, 0 selecciones, 0 zonas del panel roto, dashboard renombrado, títulos presentes. El enlace nuevo (`BodyTrendsADataAnalysisProject`, sin guion — Tableau lo comió al armar el slug) quedó en las cuatro posiciones del diccionario y en los dos CV.

**Pendiente del usuario:** el título del mapa volvió a quedar oculto al republicar (`show-title='false'`); se activa con clic derecho sobre el mapa → Mostrar título. Y borrar la viz vieja (`...Proyect`) del perfil, que sigue publicada.

---
