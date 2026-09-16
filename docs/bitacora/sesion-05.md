<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 5 (17 ago 2026): Fase 4a construida — pipeline medallion funcionando end-to-end

### Resultado
**`market-data-medallion` existe y funciona con datos reales**, en local: 51 archivos, 4,363 líneas, commit inicial `b852398` en el checkout local (WSL). Pendiente solo el push (el usuario debe crear el repo vacío en GitHub — el PAT no tiene permiso de Administration para crearlo por API, verificado 403).

- **Entorno sin sudo ni Docker:** Python 3.12 vía `uv` (el sistema tiene 3.8) + PostgreSQL 18 local vía conda en `:5433`. Docker Desktop no está habilitado en WSL.
- **Datos reales:** 1,689 velas diarias por símbolo (BTC-USD, ETH-USD, 2022-01-01 → 2026-08-16) de Coinbase + 720 de Kraken para reconciliación. SPY/QQQ esperan la key de Tiingo.
- **Verificación:** 77 tests unitarios (incl. guardas anti look-ahead con valores de forma cerrada) + 33 checks de dbt, todo verde. Ruff limpio.
- **8 backtests persistidos y exportados** (`exports/trading_sim.json`, 103 KB, curvas de 400 puntos): resultados honestos — en BTC `sma_cross` PERDIÓ -5.2% vs +35.8% de buy & hold; `macd` ganó +47.6%; en ETH buy & hold -49.1% y `volume_breakout` +56.3%. Ese contraste es exactamente la narrativa anti-humo del proyecto.
- **Reconciliación cruzada real:** desacuerdo máximo Coinbase↔Kraken de 0.16% en cierres diarios, 0 días discrepantes (>0.5%).
- **Supabase espejado:** migración 001 aplicada a `Davinson_Project` vía conector (esquemas bronze/silver/gold/meta + 4 tablas). ⚠️ Aviso de Supabase: RLS deshabilitado en esas tablas — no urgente (los esquemas no-public no se exponen por REST por defecto y el pipeline conecta como rol postgres), decisión del usuario pendiente (§ pendientes).

### Fallos nuevos (FALLO-10 a 12) — los tres los atrapó la propia infraestructura de calidad
**FALLO-10 — Watermark envenenado por seed sintético.** El agente que construyó la ingesta dejó su seed de prueba (130 velas hasta 2025-07-09) aplicado en el Postgres local; la ingesta real leyó ese watermark y solo pidió datos desde 2025-07-10. Detección: la tabla de auditoría `meta.ingest_runs` mostró 3 runs a las 00:00:00 exactas. Fix: truncar bronze/meta y re-correr (backfill completo). Lección: **los datos sintéticos jamás se aplican a una base compartida sin rollback**; el test correspondiente ahora limpia sus claves dentro de una transacción con rollback.
**FALLO-11 — Fechas del export corridas un día.** psycopg devuelve timestamptz en el timezone del servidor (America/Bogota); `.date()` truncaba las medianoches UTC al día anterior → las ~400 etiquetas de cada curva salían un día antes (el "candle del 2021-12-31" que delató el bug). Fix: `SET TIME ZONE 'UTC'` en la conexión del export. Lección: fijar timezone de sesión en cualquier conexión que serialice fechas.
**FALLO-12 — Parseo Kraken como array.** El modelo dbt parseaba el payload de Kraken con índices de array (`payload ->> 1`) pero el cliente lo guarda como dict etiquetado → 100% NULLs en silver para Kraken. Dos agentes paralelos interpretaron el contrato distinto; el seed de uno no representaba la forma real del otro. Fix: parseo por claves (idéntico para las 3 fuentes) + **5 tests `not_null` nuevos en staging para que esta clase de regresión reviente `dbt build` en voz alta**. Lección: los contratos entre componentes se validan contra la forma REAL del dato, no contra la suposición de cada lado.

### Revisión adversarial (10 agentes: 3 lentes + 7 refutadores)
6 hallazgos confirmados y arreglados (los de arriba + aislamiento del test de seed, `unquote` de credenciales para dbt con passwords especiales de Supabase, Bollinger con stddev poblacional canónica), 1 refutado, 5 menores (arreglados: partición por granularity en dedup, `dbt source freshness` cableado en daily.yml y Makefile, `.env` honrado por Makefile; aceptados como están: commit diario del JSON —es el comportamiento deseado—).

### Visión del usuario registrada: bot de trading (fase futura, post-4c)
El usuario quiere llevar esta arquitectura a un bot (scalping/day/swing, estrategias cruzadas, análisis de traders famosos, posible capital real pequeño). Evaluación honesta acordada como criterio de diseño:
- **Ya incorporado hoy para no cerrar esa puerta:** fees+slippage modelados desde el día 1, ejecución next-open sin look-ahead, interfaz de estrategia agnóstica de temporalidad, timestamps UTC, config declarativa.
- **Realismo free-first:** scalping NO es viable con infra gratuita (requiere proceso siempre-encendido, latencia baja, datos tick); swing trading con velas 1d/4h SÍ es compatible con esta arquitectura y es el objetivo realista. Camino obligado: backtest → paper trading meses → capital pequeño con kill-switches. Las "estrategias de traders famosos" son discrecionales: se codifican como reglas *inspiradas* y se reporta honestamente si sobreviven a las comisiones.

### Pendientes
- [ ] **(Usuario, 30 seg)** Crear repo público vacío `market-data-medallion` en GitHub (sin README/.gitignore) y avisar para push — o pushear él mismo. Si el PAT fine-grained está restringido por repo, añadirle el repo nuevo.
- [ ] **(Usuario, opcional)** Key gratis de Tiingo (tiingo.com, email) → `.env` local y secret en GitHub → activa SPY/QQQ.
- [ ] **(Usuario, decisión)** Habilitar RLS en las 4 tablas de Supabase (SQL listo, no rompe el pipeline) o dejarlo para 4b.
- [ ] **(4b)** Secrets en GitHub: `DATABASE_URL` (connection string de Supabase), `TIINGO_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` → activa el cron diario.
- [ ] **(4c)** Página `/[lang]/projects/trading-sim` en el sitio + Power BI (PBIP) + TRADING_SIM 20% → ~45%.

### Estado al cierre de sesión 5
| Ítem | Estado |
|---|---|
| Fase 4a (motor local end-to-end) | ✅ completa y verificada |
| Repo `market-data-medallion` | ✅ commit `b852398` local — push pendiente de crear repo en GitHub |
| Supabase (esquema espejado) | ✅ migración 001 aplicada |
| Fase 4b (cron diario en Actions) | ⏳ siguiente — solo faltan secrets + push |

### Addendum sesión 5 (misma noche)
- ✅ **Tiingo activo:** el usuario creó su key (guardada en `.env`, gitignored — jamás commitearla). SPY y QQQ ingestados: 1,158 velas c/u desde 2022 (los 47 "missing days" son festivos bursátiles de EE.UU.; gap máx 4 = fines de semana largos). **16 backtests** en 4 activos. Hallazgo honesto ampliado: en los ETFs NINGUNA estrategia le ganó al buy & hold (SPY +62.8% B&H vs +36.8% la mejor; QQQ +82.9% vs +45.3%) — timing activo pierde en mercado alcista; commit local `data: enable Tiingo ETFs`.
- ✅ **RLS habilitado en Supabase** (migración 002, decisión del usuario): las 4 tablas protegidas; el pipeline no se afecta (conecta como rol dueño).
- ✅ Usuario creó el repo GitHub y amplió el token al repo nuevo. ⚠️ **FALLO-13 — push rechazado por permiso `workflow`:** el PAT no puede crear/modificar `.github/workflows/*` sin ese permiso. Fix (mañana, 30 seg): en el token → si es fine-grained: Permissions → **Workflows: Read and write**; si es classic: marcar scope **workflow** → Update → `git push -u origin main`. El push escribió los 70 objetos y solo rechazó la ref — con el permiso, entra a la primera.
- Nota operativa: `psql` muestra los `timestamptz` en hora Bogotá (medianoche UTC aparece como 19:00 del día anterior) — NO es el FALLO-11, que ya está corregido en el export con `SET TIME ZONE 'UTC'`. No "arreglar" lo que solo es visualización.

---
