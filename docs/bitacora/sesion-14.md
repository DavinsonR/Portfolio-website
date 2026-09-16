<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 14 — 21 ago 2026 · Pasada de higiene antes de empezar a repartir el enlace

El usuario empieza hoy a mandar el sitio en aplicaciones. Encargo: quitar la duplicación del hackathon, corregir toda inconsistencia que quedara, y revisar seguridad y durabilidad.

### Contenido

**BodyTrends sale de "Proyectos en producción".** Estaba en dos sitios a la vez: como proyecto y como reconocimiento. La sección promete *"código abierto y verificable"* y un tablero de Tableau no es ninguna de las dos cosas; tenerlo ahí rebaja lo que la palabra "proyecto" significa en esta página, que hoy sostiene un solo proyecto real. Queda solo en Reconocimientos, con su enlace y con el dato concreto que traía el proyecto (19.560 registros de keywords) plegado en una línea.

**Cifras que no coincidían consigo mismas**, todas contra su fuente:
- `quality.note` decía 139 pruebas de Python; son **171** (`pytest --collect-only`). La tabla de las 89 pruebas de dbt sí estaba exacta, una por una, contra el manifiesto compilado (47 not_null · 21 accepted_values · 7 unique_combination · 6 SQL propio · 4 relationships · 3 unique · 1 ohlc_consistency).
- El stack técnico decía "60.000 velas"; el bullet del proyecto, "más de 58.000". 60.000 son filas *bronce* — incluyen la misma vela traída por dos fuentes — y suben cada noche, así que la cifra exacta caduca sola. Queda "más de 58.000" en las cuatro posiciones.
- Comprobación automática de paridad ES/EN sobre todas las cadenas: ninguna cifra difiere entre idiomas (las cuatro diferencias que salieron son "100% remoto" vs "Fully remote" y "7 tablas" vs "Seven-table").

### El hallazgo de la sesión

**El brief de diseño viajaba dentro del HTML público.** El layout inyectaba un comentario con `dangerouslySetInnerHTML` que contenía la tesis del rediseño, la paleta, el "seed key", y frases como *"the previous build that four reviewers independently rejected"*. Cualquiera con Ver código fuente leía el proceso interno del sitio. Verificado en vivo antes de tocarlo: 4 coincidencias en `/es`. Eliminado.

### Compartir el enlace

Sin OpenGraph, pegar el sitio en LinkedIn o WhatsApp daba una tarjeta vacía — justo el día en que el enlace empieza a circular. Ahora hay `openGraph` + `twitter` con tarjeta propia por idioma (`public/og-es.png`, `og-en.png`), generada con `scripts/generate-og.py` a partir del **mismo diccionario** que alimenta el sitio, con la tipografía y los colores del sitio. Se ejecuta a mano cuando cambie el copy de portada: el build no depende de Python ni de la red. Se intentó primero `next/og` (ImageResponse) y se descartó: colgó el build más de dos minutos buscando su fuente por red, y un build que depende de la red es exactamente el FALLO-01 otra vez.

También: `sitemap.xml` y `robots.txt` (tres rutas por idioma, con alternates), y `metadataBase` para que las URLs absolutas salgan bien.

### Seguridad

- **Cabeceras** en `next.config.ts`: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` cerrando cámara/micrófono/geolocalización, HSTS, y una CSP acotada (`frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'`). **Sin CSP de scripts a propósito**: el sitio usa scripts en línea (tema antes del primer pintado, hidratación de Next) y una CSP con nonce obliga a render en servidor — que es justo lo que este sitio no hace. Cerrar lo que se puede cerrar sin romper el modelo estático.
- `npm audit`: 0 vulnerabilidades. Sin secretos en el árbol ni en el historial (`ghp_`, `github_pat_`, claves de Tiingo/Supabase): 0 coincidencias. Ningún `.env` rastreado. Ningún `target="_blank"` sin `noopener`. Sin teléfono ni dirección en los CV.
- Superficie de ataque real: el sitio es estático, sin backend, sin formularios, sin cookies y sin analítica. Lo único que sale a la red es la lectura de los JSON del pipeline en `raw.githubusercontent.com` — solo lectura y sin credenciales.

### Durabilidad

- **`fetchJson` con tiempo límite (12 s)** en `lib/trading-sim.ts`, usado por el panel y por la marca del pipeline. Antes, una red que bloquea `raw.githubusercontent.com` *sin cerrar la conexión* — cualquier proxy corporativo — dejaba el panel en "cargando…" para siempre. Ahora muestra el error y ofrece reintentar. El estado peor no es el error: es el que parece que sigue cargando.
- Repasadas las degradaciones: si el JSON no llega, el panel da error con reintento y la marca del pipeline vuelve a su texto estático (nunca inventa una fecha); si el cron se detiene, la marca lo dice; si el export cambia de forma, el índice acepta las dos formas conocidas.
- **Lint en cero errores.** Los tres que arrastraba eran `set-state-in-effect`: el reintento del índice ahora limpia el error desde el clic y no desde el montaje; el acierto de caché del activo se **deriva en el render** en vez de copiarse a estado (un render menos por cada cambio de activo); y los dos casos que no tienen versión derivable — leer el tema del navegador, marcar "cargando" antes de disparar la petición — quedan con `eslint-disable` y su razón escrita al lado. La advertencia de `next/font` también queda documentada en el código: el `<link>` es deliberado desde el FALLO-01.

**Pendientes del usuario:** activar el título del mapa en Tableau y republicar; borrar la viz vieja (`...Proyect`) del perfil; y decidir si el enlace a Kaggle se queda — si el perfil está vacío, resta más de lo que suma.

---
