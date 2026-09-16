<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 8 (17-18 ago 2026): Fase 4C — la página en vivo + descomposición cambiaria + CRON CONFIRMADO

### 🎉 El cron diario FUNCIONA (confirmado con evidencia)
El primer intento del usuario falló con "Repository access blocked". Diagnóstico: **FALLO-21 — GitHub bloqueó la action de terceros `keepalive-workflow` por violación de sus ToS** (abril 2025); un job cuyas actions no se pueden descargar muere en "Set up job", antes del primer paso (por eso el CI, que no la usa, sí pasaba). Fix: eliminarla — era redundante, porque el commit diario del export ES la actividad que resetea el timer de 60 días de GitHub. Tras el fix y el re-run del usuario: **commit `858b11e "data: daily refresh"` hecho por `github-actions[bot]`** — secrets correctos, Supabase alcanzable desde CI, ciclo completo en la nube. Lección: cada dependencia de terceros en CI es un punto de fallo que puede desaparecer sin aviso.

### Descomposición cambiaria (D-26) — construida y verificada CLEAN
3 divisas nuevas (USDMXN, USDCLP, USDPEN → 46 requests Tiingo/hora de 50) y mapeo `fx_pair` en los 10 ADRs. Nuevo `gold.mart_fx_decomposition`: separa el retorno USD de cada ADR en empresa vs moneda con la identidad **(1+r_USD)×(1+r_FX)=(1+r_local)**, ventanas 30d/90d/365d/completa, anclas de fecha auditables por serie, y un test dbt que exige la identidad a 1e-9 en las 40 filas. Verificador adversarial: **0 defectos**; recalculó Ecopetrol a mano: **+96,9% en USD = +53,6% en pesos + 43,4pp de apreciación del peso** — la mayor parte del retorno en dólares del último año fue la moneda, no la empresa. dbt: 100 checks. pytest: 161.

### La página `/[lang]/projects/trading-sim` — EN VIVO (commit `94505d3`)
Primera pieza visual del proyecto con datos reales: el sitio sigue 100% estático y lee los JSON publicados del repo del pipeline (raw.githubusercontent), que el cron refresca a diario. Secciones: 4 stat tiles + **embudo de la honestidad** (1.347→349→40) · supervivencia y exposición por nº de señales · **explorador de backtests** (45 activos agrupados por región, 5 estrategias, curvas de equity reales vs buy & hold con crosshair, tooltip, marcador del corte 70/30 y vista tabla) · las 31 combinaciones por activo ordenadas por exceso fuera de muestra · leaderboard de estrategias · **descomposición cambiaria de los ADRs** · salud del pipeline en ventana terminal · 6 tarjetas de metodología. Bilingüe completo. TRADING_SIM: 20% → **45%** (honesto: el motor + la página existen; falta Power BI). El proyecto destacado de la home ahora enlaza a la página real.

**Detalles técnicos de la sesión:** node instalado en WSL vía nvm (el npm que había era el de Windows); build de producción verde a la primera (8 páginas SSG); paleta de gráficas validada con el checker de accesibilidad del skill dataviz sobre la superficie oscura — 5 candidatas iteradas hasta pasar: serie `#3E9BD6`, benchmark gris punteado (identidad por forma → legible en escala de grises); `role="img"` retirado de componentes con texto real (a11y).

### Estado al cierre de sesión 8
| Ítem | Estado |
|---|---|
| Cron diario en la nube | ✅ **FUNCIONANDO** — commit automático `858b11e` del bot |
| Descomposición cambiaria | ✅ mart + export verificados CLEAN (48 activos ahora) |
| Página del laboratorio | ✅ en vivo en `/es/projects/trading-sim` y `/en/...` |
| TRADING_SIM | ✅ 45% |
| Falta de 4C | ⏳ informe Power BI (PBIP) — próxima sesión |
| Pendiente usuario | ⏳ (higiene de credenciales: fuera de este documento) |

---
