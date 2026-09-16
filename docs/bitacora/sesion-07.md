<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 7 (17 ago 2026): Fase 4b + estrategias combinadas y validación fuera de muestra

### Parte A — Fase 4b: el pipeline corre contra la nube
- ✅ **Supabase operativo end-to-end**: 55.470 velas copiadas de local a la nube en 7 segundos con `scripts/sync_bronze_to_remote.py` (COPY en streaming, idempotente, sin gastar cuota de Tiingo); `dbt build` verde contra Supabase; 1.347 backtests y export generados desde la nube. BD en **133 MB de 500 MB**.
- ⚠️ **FALLO-16 — La conexión directa de Supabase es IPv6-only.** `db.<ref>.supabase.co` no tiene registro A; los runners de GitHub Actions son IPv4 → desde el cron jamás conectaría. Fix: usar el **Session pooler** (sí resuelve IPv4 y soporta prepared statements, que psycopg y dbt necesitan; el Transaction pooler del 6543 los rompería) + `sslmode=require`. `dbt_env()` ahora deriva el `sslmode` del `DATABASE_URL`.
- ⚠️ **FALLO-17 — Sin retención, el free tier muere en menos de una semana.** Cada corrida reescribía ~212k puntos de curva. Fix: `pipeline/retention.py` conserva las 2 corridas más recientes por par (activo, estrategia). No se pierde nada: bronze nunca se purga y todo es reproducible desde ahí.
- Añadidos: `uv.lock` (sin él `uv sync` falla en CI), migración `002_enable_rls.sql` en el repo (era reproducibilidad faltante), `dbt source freshness` cableado, pasos redundantes del `daily.yml` eliminados.
- **Pendiente del usuario:** poner los 4 secrets en GitHub (le fueron entregados). El token no tiene permiso de *secrets*, así que no pueden crearse por API.

### Parte B — 5ª estrategia (Fibonacci) + todas las combinaciones + split de validación
A petición del usuario: Fibonacci como estrategia individual y **todas las combinaciones AND posibles** ("luz verde en MACD + Volumen", etc.). Resultado: 31 combinaciones por activo con volumen, 15 en divisas → **1.347 variantes** (222 individuales + 1.125 combinadas).

**Decisiones (D-22 a D-25):**
| # | Decisión | Por qué |
|---|---|---|
| D-22 | Solo las 222 individuales guardan curva de equity; las 1.125 combinaciones guardan solo métricas. Impuesto por un `CHECK` en la BD, no solo en Python | Medido: 174 KB por backtest con curva → 1.347 curvas = 229 MB/corrida, 458 MB con retención, sobre el techo de 500 MB |
| D-23 | Señales calculadas **una vez por activo**; las combinaciones son AND vectoriales sobre series precalculadas | 5 cálculos en vez de 80 por activo: 3,8× más rápido, medido |
| D-24 | **Split 70/30 de entrenamiento/validación** en cada variante | Probar 1.347 variantes y quedarse con la mejor es *data dredging*; sin ventana ciega la cifra no vale nada |
| D-25 | "Ganarle a buy & hold" exige haber operado (`n_trades > 0`) | Una combinación que nunca entra rinde 0% y se anotaba una victoria cada vez que el mercado caía — premiando a las más inútiles |

**FALLO-18 — Warm-up asimétrico entre ventanas (crítico).** Los indicadores están en NaN durante su calentamiento y toda estrategia lee NaN como "plano". La ventana de entrenamiento cargaba con **todo** ese periodo muerto y la de validación con ninguno → no eran regímenes comparables. Habría movido la métrica principal en un tercio. Fix: cada estrategia declara su `warmup_bars` (una combinación hereda el del componente más lento) y el split se toma después del calentamiento; el backtest completo sí cubre todas las barras.
**FALLO-19 — Sharpe degenerado.** En una ventana larga con muy pocas barras de movimiento, `mean = r/N` y `std = r/√N`: **r se cancela** y el Sharpe colapsa a `√(periodos/N)` sin importar el tamaño del movimiento. Ahora devuelve `None` en esas condiciones.
**FALLO-20 — Los tests de Python leían `DATABASE_URL`**, que puede apuntar a Supabase, e insertaban 4.041 filas y corrían un purgado de tabla completa. Ahora leen `MDM_TEST_DATABASE_URL`: los tests tienen su propia base o ninguna. (Además: los tests de dbt que protegen las métricas de honestidad nunca corrían sobre los datos que protegen — `dbt run` no ejecuta tests; ahora es `dbt build --select`.)

### EL HALLAZGO (el más valioso del proyecto)
**De 349 variantes que le ganaron a comprar-y-mantener dentro de muestra, solo 40 siguieron ganando fuera de muestra: 11,5% de supervivencia. El 88,5% de las "ganadoras" eran ilusiones del backtest.**

| Señales | Variantes | Ganaron dentro | Siguieron ganando | Supervivencia | Tiempo en mercado |
|---|---|---|---|---|---|
| 1 | 222 | 75 | 10 | 13,3% | 39,7% |
| 2 | 438 | 139 | 14 | 10,1% | 13,7% |
| 3 | 432 | 109 | 13 | 11,9% | 3,7% |
| 4 | 213 | 26 | 3 | 11,5% | 0,5% |
| **5** | 42 | **0** | 0 | — | **0,0%** |
| **TOTAL** | **1.347** | **349** | **40** | **11,5%** | — |

Dos conclusiones publicables: (1) **exigir las cinco señales en verde da cero operaciones** en 45 activos y 4,5 años — nunca coinciden; cada filtro adicional no mejora las entradas, saca del mercado. (2) La supervivencia es plana en ~11,5% sin importar cuántas señales se combinen: **la complejidad no compra robustez**.

### Estado al cierre de sesión 7
| Ítem | Estado |
|---|---|
| Pipeline contra Supabase | ✅ end-to-end verificado (133 MB / 500 MB) |
| Variantes | ✅ 1.347 (222 individuales + 1.125 combinadas) en local y en la nube |
| Calidad | ✅ 161 tests pytest + 87 checks dbt, ruff limpio |
| Revisión adversarial | ✅ 16 defectos hallados y corregidos (3 críticos) |
| `BITACORA_TECNICA.md` §10 | ✅ documenta combinaciones, split y resultados |
| Pendiente usuario | ⏳ 4 secrets en GitHub → cron diario activo. (Higiene de credenciales: gestionada fuera de este documento.) |
| Fase 4c | ⏳ página del sitio + Power BI + **descomposición cambiaria** (añadir USDMXN/USDCLP/USDPEN) + TRADING_SIM → 45% |

---
