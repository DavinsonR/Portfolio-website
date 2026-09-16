<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 12 — 21 ago 2026 · El cron volvió, y trajo malas noticias

Al abrir la Fase 6 hice la comprobación rutinaria de si el cron se había recuperado tras el FALLO-23. Se había recuperado: commit `1ee31e9` a las 12:09 UTC. Pero los totales publicados habían **bajado** — 48 activos → 45, 59.800 velas → 55.486 — y en un warehouse append-only eso no debería poder pasar. Tirar de ese hilo destapó cuatro fallos encadenados.

### FALLO-24 — El secreto de GitHub contenía su propio nombre (causa raíz, del usuario)
`meta.ingest_runs.error` guardaba, literalmente:

```
HTTPError: 403 Client Error: Forbidden for url:
https://api.tiingo.com/tiingo/daily/DIA/prices?...&token=TIINGO_API_KEY
```

El `token=` no llevaba la llave: llevaba **el nombre del secreto**. En Settings → Secrets se pegó el *nombre* en la casilla del *valor*. El YAML del workflow siempre estuvo bien (`${{ secrets.TIINGO_API_KEY }}`). La misma llave probada localmente responde HTTP 200 sin problema, incluidos los tres pares FX que nunca habían entrado.

Histórico en `meta.ingest_runs`, que no deja lugar a interpretación:

| día | success | failed |
|---|---|---|
| 17 ago | 122 | 205 |
| 18 ago | **4** | 138 |
| 19 ago | **4** | 138 |
| 20 ago | **4** | 138 |
| 21 ago | **4** | 138 |

138 = 46 símbolos de Tiingo × 3 intentos. Los 4 éxitos diarios son BTC y ETH por Coinbase y Kraken, que no usan llave. Los 3 activos "perdidos" (USDMXN, USDCLP, USDPEN) nunca se perdieron: se añadieron el 18, cuando la llave ya estaba rota, y jamás llegaron a ingerir. No se borró un solo dato — simplemente llevábamos cuatro días sin recibir ninguno.

### FALLO-25 — Un 403 se reintentaba como si fuera transitorio
`request_json` frenaba en seco ante un 429 (FALLO-14) pero dejaba caer el 403 hasta `raise_for_status`, y encima `ingest_asset` es un `@task(retries=2, retry_delay_seconds=30)`. Resultado: 46 símbolos × 3 intentos × 30 s = **46 minutos por noche re-preguntando por el mismo rechazo**. Es el FALLO-14 otra vez con otro código de estado. Fix: `AuthError` se une a `RateLimitError` como rechazo que ningún reintento contesta, y un solo 403 cortocircuita el resto de esa fuente.

### FALLO-26 — El run publicaba igual (el peor de los cuatro)
La compuerta de aborto era `succeeded == 0`. Coinbase y Kraken no necesitan llave, así que **4 éxitos sobre 142 la pasaban de largo**: corría dbt, corrían los backtests, y se sobrescribía `exports/index.json`. La página lee `generated_at` de ese archivo, así que anunciaba una actualización fresca sobre precios de hace cuatro días.

Un fallo que parece salud es peor que uno que parece fallo: no dispara ninguna alarma y además destruye la evidencia del estado anterior. Ahora el flow aborta **antes de dbt y antes del export** cuando una fuente rechaza las credenciales — lo que además pone el run de Actions en rojo, que es el único canal de alerta que tiene este proyecto.

### FALLO-27 — La llave se escribía en la base en texto plano
El query string lleva `token=…`, `requests` mete la URL completa en el mensaje del `HTTPError`, y ese mensaje se persiste en `meta.ingest_runs.error`. Esta vez filtró un placeholder inofensivo; **con la llave correcta habría escrito el secreto real de Tiingo en una fila por cada fallo**. Ahora todo mensaje construido a partir de una URL se redacta en el punto donde nace la cadena, no en el punto donde se publica.

### Lo que se corrigió en la página
El `PipelineStamp` mostraba `generated_at` — *cuándo se escribió el export*, no *hasta cuándo llegan los datos*. Por eso enseñaba una fecha fresca durante cuatro días de datos rancios. Ahora reporta la vela más reciente del warehouse y dice "Pipeline detenido" cuando la mayoría de los activos están obsoletos, reutilizando la definición que ya vive en `mart_asset_summary.sql` (`now() - last_candle_ts > 3 días`) en lugar de inventar una segunda que pudiera contradecirla. Cuando está detenido el punto verde que late se vuelve un cuadro rojo quieto: si el pipeline paró, la marca también tiene que parar.

### La lección
Los FALLOS 21, 23 y 24 son el mismo fallo tres veces: **el cron pasa de verde a rojo sin avisar a nadie**. Un cron sin alerta no es automatización, es una apuesta a que alguien mire. Las tres veces lo descubrimos por casualidad — la primera al revisar el CI, la segunda al refrescar Power BI, esta al abrir otra fase. La diferencia es que ahora el modo de fallo silencioso ya no existe: si no entran datos, no se publica y el run se pone rojo.

### FALLO-28 — Las cifras publicadas venían de la base local, no de producción
Perseguía por qué las velas habían "bajado" de 59.800 a 55.486 sin que exista un solo `DELETE` sobre bronze. No bajaron nunca. Los blobs de git lo dicen sin ambigüedad:

| commit | autor | `generated_at` | totales publicados |
|---|---|---|---|
| `858b11e` | `github-actions[bot]` | 17 ago **22:23** | 45 activos · **55.470** velas |
| `6b12430` | `DavinsonR` | 17 ago **22:04** | 48 activos · **59.800** velas |

El commit humano tiene una marca de tiempo *anterior* pero se **commiteó después**, y sobrescribió el export del bot. Es decir: durante cuatro días la página publicó las cifras de un **warehouse de desarrollo local**, no las de producción. Producción siempre tuvo 45 activos y ~55.470 velas; hoy tiene 55.486 — exactamente 16 más, que son los 4 ingests diarios de BTC y ETH por dos fuentes durante cuatro días. Todo cuadra, y nunca se borró nada.

Los 3 activos "perdidos" tampoco se perdieron: USDMXN, USDCLP y USDPEN se añadieron el 18, cuando la llave ya estaba rota, y solo existían en la base local donde la llave sí servía.

Este es el fallo más instructivo de los cinco, porque es el que le cuesta el puesto a un ingeniero de datos: **publicar cifras de desarrollo como si fueran de producción**. Y en un sitio cuya tesis es *"cada cifra enlaza a lo que la prueba"*, es el fallo exacto que la tesis existe para impedir. Corregido: el sitio y los CV dicen ahora 45 activos y "más de 55.000 velas" — verdad en producción, y una redacción que no caduca porque bronze solo crece. `exports/` no vuelve a commitearse a mano: lo escribe el bot o no se escribe.

**Pendiente del usuario (2 minutos, bloquea la recuperación):** Settings → Secrets and variables → Actions → `TIINGO_API_KEY` → Update, y pegar la llave real. El watermark hace el resto solo: el siguiente cron recupera los cuatro días y hace el backfill de los tres pares FX. Cuando corra, los 3 pares FX harán backfill y producción llegará por primera vez a 48 activos reales; ahí se regeneran los CV con `npm run cv`.

---
