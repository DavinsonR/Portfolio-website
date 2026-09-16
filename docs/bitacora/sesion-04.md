<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 4 (16-17 ago 2026): Validaciones + replaneación de Fase 4 como plataforma de datos

> Sesión ejecutada en Claude Code (WSL local). Primera sesión con acceso directo al repo local, a Git y a los conectores Vercel/Supabase.

### Ejecuciones (E-36 a E-40)
| Paso | Acción | Resultado |
|---|---|---|
| E-36 | Validar push de bitácora del usuario: `ff0ea71` en `origin/main` | ✅ historia a salvo en GitHub |
| E-37 | Validar limpieza Vercel (indirecta: URLs viejas → `DEPLOYMENT_NOT_FOUND`; sitio 200) | ✅ solo queda `proyecto-davirson-git`. Conector sigue 403 en el team (FALLO-09 vigente, no reintentar) |
| E-38 | Descubrir Supabase del usuario vía conector: proyecto `Davinson_Project` (Postgres 17, ca-central-1, ACTIVE_HEALTHY) | ✅ Postgres gratuito ya aprovisionado |
| E-39 | Investigación 5 frentes con fuentes de ago 2026: repo inspiración (AzureDatabricksMedallion), hosting Postgres free, Power BI free, APIs de mercado, orquestación | ✅ hallazgos abajo |
| E-40 | Decisiones D-13 a D-17 con el usuario; Fase 4 replanteada en sub-fases 4a/4b/4c | ✅ plan aprobado |
| — | El usuario guardó la credencial Git (`credential.helper store`) tras su push | ✅ sesiones futuras pueden pushear directo |

### Contexto del cambio
El usuario (con consejo de un amigo data engineer, repo inspiración: github.com/DAVID316CORDOVA/AzureDatabricksMedallion) quiere que la Fase 4 demuestre skills de data engineering — SQL/PostgreSQL, ETL, orquestación, Power BI — no solo el backtester. Cadena imaginada: API → PostgreSQL → ETL → Orquestación → Power BI → Playground interactivo. Veredicto: viable en $0, con un solo recorte (Power BI interactivo público no es gratis).

### Decisiones nuevas (D-13 a D-17)
| # | Decisión | Por qué |
|---|---|---|
| D-13 | Fase 4 se expande a plataforma de datos medallion (bronze/silver/gold como esquemas Postgres + dbt-core + naming `stg_/dim_/fct_/mart_`) en **repo nuevo público, 100% en inglés: `market-data-medallion`** | Demostrar skills tech reclutables; código/repo en inglés para audiencia internacional; el sitio (este repo) no cambia de arquitectura: sigue SSG consumiendo JSON |
| D-14 | Postgres = **Supabase existente** (`Davinson_Project`), con ping REST diario como keep-alive | Ya aprovisionado y conectado a las herramientas del agente. Riesgo conocido: free tier se pausa tras ~7 días sin actividad (el ping lo mitiga; si pausa, resume manual en dashboard). Sin backups gratis, pero irrelevante: warehouse 100% reproducible desde APIs + migraciones. Alternativa documentada: Neon (auto-wake, sin pausas) si la pausa se vuelve molesta |
| D-15 | Power BI se muestra como **PBIP + .pbix en el repo** (abrible gratis en Desktop) + video corto/PNGs en el sitio. La interactividad pública la da el playground del sitio con el JSON de gold | Verificado (docs Microsoft jul 2026): "Publish to web" exige Pro (~US$14/mes) + email corporativo + admin de tenant → imposible en $0. Decirlo abiertamente en el sitio = alfabetización en licenciamiento |
| D-16 | Fuentes de datos: **Coinbase Exchange** (crypto, sin key, primario) + Kraken (fallback) · **Tiingo** (ETFs, key gratis 1000 req/día, primario) + Alpha Vantage (fallback, 25/día). Descartados para CI: api.binance.com (HTTP 451 desde IPs de EE.UU. = runners de Actions), Stooq (challenge anti-bot), yfinance (429 crónico desde datacenter) | Verificación ago 2026 con pruebas en vivo; el pipeline corre desatendido desde GitHub Actions |
| D-17 | Orquestación: **GitHub Actions cron** (minuto impar, `workflow_dispatch`, keepalive por la regla de 60 días, backfill idempotente) + **Prefect 3 OSS** in-process (flows/tasks/retries/logs). **Airflow descartado deliberadamente** (≥4 GB RAM, 5+ contenedores para un DAG diario — overhead sin señal extra a este tamaño; decirlo en el README lee senior) | $0, corre solo, y cubre las señales que miran reclutadores: orquestador + dbt tests + pandera + idempotencia + historial verde público |

### Fase 4 replanteada (sustituye la fila "Fase 4" del §10)
- **4a — Motor local (1-2 sesiones):** scaffold `market-data-medallion` · ingesta Coinbase/Tiingo → bronze (raw JSONB inmutable, naming con timestamp) → silver (OHLCV limpio: dbt `stg_` + pandera) → gold (indicadores SMA/RSI/MACD **en SQL window functions** + métricas de backtest `dim_/fct_/mart_`) · backtester Python (4 estrategias vs buy & hold: retorno, drawdown máx, Sharpe) · export JSON · end-to-end local (docker-compose) y contra Supabase.
- **4b — Automatización (1 sesión):** cron diario en Actions con secrets · dbt tests + pandera como gates · tabla de auditoría de corridas · CI corre el pipeline en PRs contra Postgres efímero.
- **4c — Showcase (1-2 sesiones):** informe Power BI (PBIP en repo + video/PNGs) · página `/[lang]/projects/trading-sim` en el sitio: playground interactivo (activo/estrategia/parámetros → curva equity, drawdown, Sharpe; fetch client-side del JSON público de gold) + widget de salud del pipeline · narrativa honesta del overfitting · TRADING_SIM 20% → ~45% en dictionaries.
- **Calidad de datos con honestidad (mejora sobre la inspiración):** nada de datos sucios artificiales — controles sobre problemas *reales*: días de mercado faltantes, reconciliación cruzada Coinbase vs Kraken, splits/restatements.

### Estado al cierre de sesión 4
| Ítem | Estado |
|---|---|
| Validaciones GitHub + Vercel | ✅ ambas confirmadas |
| Plan Fase 4 v2 | ✅ aprobado por el usuario (decisiones D-13 a D-17) |
| Siguiente paso | Arrancar 4a: crear repo `market-data-medallion` y construir el motor local |

---
