<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 6 (17 ago 2026): universo ampliado a 45 activos

### Resultado
El pipeline pasó de 4 a **45 activos** (2 cripto, 40 acciones/ETFs, 3 divisas · 55.470 velas diarias · **177 backtests**), todo pusheado a `market-data-medallion` (commits `a5336ae` + docs). Repo público y funcionando: el usuario resolvió el FALLO-13 dando permiso `workflow` al token.

**Cartera:** 20 ETFs (índices US, sectoriales, Latam: ILF/EWZ/EWW/ECH, oro/plata/bonos) · 10 acciones US (AAPL, MSFT, NVDA…) · **10 ADRs Latam incluidos Ecopetrol (EC) y Bancolombia (CIB)** · 3 divisas (USDCOP, USDBRL, EURUSD). 16 de los 45 activos son latinoamericanos.

### Decisiones nuevas (D-18 a D-21)
| # | Decisión | Por qué |
|---|---|---|
| D-18 | Nueva fuente `tiingo_fx` para divisas; `volume` pasa a ser opcional (`float \| None`) | FX spot es OTC: no existe volumen consolidado. Se guarda NULL honesto, nunca un cero inventado. Las estrategias de volumen se **excluyen** en FX (no se corren sobre datos ausentes) |
| D-19 | Dimensión real `silver.dim_assets` (seed de dbt generado desde config.yaml) reemplaza la heurística `symbol LIKE '%-USD'` | La heurística se rompía con `USDCOP` (parece cripto y no lo es). Ahora hay modelo dimensional (hechos + dimensión), joins INNER + test `relationships` para que un símbolo sin catalogar falle ruidosamente. Habilita análisis por región |
| D-20 | Nuevo `gold.mart_strategy_leaderboard` (beat-rate y exceso por estrategia/clase/región, con totales vía `grouping sets`) | Convierte 177 backtests en estadística agregada. Es el mart que alimentará Power BI y la página del sitio |
| D-21 | Export partido en `index.json` (83 KB, todos los activos + leaderboard) + `backtests/<SÍMBOLO>.json` (curvas, ~50 KB c/u) | 45×4×400 puntos = 2,4 MB en un archivo era inviable para carga inicial. El playground carga curvas bajo demanda |

### Fallos nuevos (FALLO-14 y 15) — ambos solo aparecen a escala
**FALLO-14 — Reintentar un HTTP 429 empeora el 429.** Primera corrida con 45 activos: 28 símbolos fallaron pero la auditoría registró 47 fallos. Causa: ante un 429, el cliente reintentaba 3× (backoff de segundos) y Prefect reintentaba el task 2× más → hasta **9 llamadas desperdiciadas por símbolo** (~250 contra un techo de 50/hora). Contra una cuota *horaria*, ningún reintento en segundos puede tener éxito. Fix en tres piezas: (a) `RateLimitError` propia, lanzada sin reintentos (los 5xx sí siguen reintentándose, ahí sí es transitorio); (b) **circuit breaker por fuente**: al primer 429 se dejan de llamar los símbolos restantes de esa fuente; (c) el task devuelve el resultado en vez de lanzar excepción, para que Prefect no reintente. Resultado medido: `31 ok, 0 failed, 16 deferred` con watermarks intactos. **Lección: "diferido por cuota" no es un error — es una decisión operativa; confundirlos produce alertas que nadie lee.**
**FALLO-15 — Columna enteramente NULL llega como dtype `object`.** El volumen de FX (que no existe) hacía que pandas infiriera `object` en vez de `float64` y pandera rechazara el frame. Con 4 activos nunca ocurrió porque todos tenían volumen. Fix: cast explícito `astype("float64")` de las columnas numéricas + backtests tolerantes a fallos por símbolo (un activo malformado no puede costarle el backtest a los otros 44).

### Hallazgo de negocio (el más valioso del proyecto hasta ahora)
**De 177 combinaciones estrategia-activo, solo 40 (22,6%) le ganaron a comprar y mantener.** Ninguna de las 4 estrategias tiene exceso promedio positivo: rsi_reversion −19,6 pp · sma_cross −35,4 pp · macd −41,9 pp · volume_breakout −54,1 pp (Sharpe mediano negativo). Por región: global 30,4% · EE.UU. 26,2% · Latam 16,1% · emergentes 12,5%. Con comisiones, slippage y sin mirar el futuro, **el timing activo pierde de forma consistente**. Publicar las 137 que perdieron —con la metodología que lo hace creíble— es el diferenciador.

### Limitación declarada
Los ADRs latinos (EC, CIB, VALE, PBR, ITUB, ABEV, AMX, FMX, BAP, SQM) cotizan en NYSE/NASDAQ **en dólares**, no en BVC/B3/BMV (el free tier de Tiingo no cubre bolsas locales). Su retorno mezcla desempeño de la empresa con movimiento cambiario. Oportunidad derivada: con USDCOP y USDBRL en el mismo warehouse se puede **descomponer** cuánto del retorno de Ecopetrol en USD fue la empresa y cuánto el peso — análisis que aporta el economista, no el ingeniero de datos puro.

### Estado al cierre de sesión 6
| Ítem | Estado |
|---|---|
| Repo `market-data-medallion` | ✅ público y pusheado (45 activos, 177 backtests) |
| Calidad | ✅ 81 tests pytest + 57 checks dbt (49 tests), ruff limpio |
| `BITACORA_TECNICA.md` §9 | ✅ documenta la expansión y los FALLOS 14-15 |
| Fase 4b (cron diario) | ⏳ siguiente: 4 secrets en GitHub (`DATABASE_URL`, `TIINGO_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) |
| Supabase | ⚠️ solo tiene el esquema (migraciones 001+002); los datos viven en el Postgres local. Sincronizar en 4b |

---
