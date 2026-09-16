<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 9 (18 ago 2026): FASE 4C CERRADA — informe Power BI (PBIP/PBIR/TMDL)

### Resultado
**`powerbi/MedallionInsights.pbip`** en el repo del pipeline (commit `53a975d`): informe interactivo de 4 páginas + modelo semántico de 7 tablas y 17 medidas DAX, conectado al warehouse de Supabase vía el session pooler IPv4. **Todo en formato texto versionable (TMDL + PBIR), cero binarios, cero credenciales en el repo** — la contraseña se ingresa una sola vez en Desktop y `PgHost`/`PgDatabase` son parámetros del modelo (el informe se re-apunta al Postgres local sin tocar M).

**Páginas:** The Verdict (embudo de supervivencia con medidas vivas — al filtrar por región se recalcula) · Strategy Explorer (slicers sobre las 1.347 variantes, scatter exposición-vs-exceso-OOS, leaderboard) · FX Decomposition (empresa vs moneda por ADR con slicer de ventana) · Equity Curves (estrategia vs buy & hold por activo).

### Cómo se verificó SIN tener Power BI (no hay Windows en WSL) — D-27
1. Los 31 JSON del reporte validados contra **los esquemas oficiales publicados por Microsoft** (resolución completa de $ref); el validador atrapó 1 error real antes de entregar.
2. El modelo TMDL deserializado con **el parser del propio Microsoft** (`Tabular.TmdlSerializer`, AMO 19.x — el revisor adversarial instaló el SDK de .NET para correrlo): OK.
3. Cada `sourceColumn`, query nativa y referencia de medida verificada contra el warehouse vivo (psql).
4. Riesgo RLS cerrado empíricamente: se verificó empíricamente el acceso de lectura de Power BI a las tablas gold por el pooler. (Nota de endurecimiento pendiente: el rol de conexión debe ser uno dedicado, sin propiedad sobre las tablas.)
Hallazgos de la revisión: 0 altos, 0 medios, 1 cosmético (título del scatter, corregido).

### ✅ CIERRE CONFIRMADO DE FASE 4 (20 ago 2026)
El usuario cargó el informe Power BI completo contra Supabase — las 7 tablas, ~283k filas de curvas incluidas. Con esto, **la Fase 4 está 100% terminada y validada por el usuario en cada eslabón**: pipeline medallion con cron diario ✓ · 1.347 variantes con validación fuera de muestra ✓ · página pública bilingüe en vivo ✓ · descomposición cambiaria ✓ · informe Power BI interactivo ✓. Camino recorrido para llegar aquí: FALLOS 21, 22 y 23 — cada uno detectado por una capa distinta (logs de CI, reporte de error de Desktop, refresh de datos), que es exactamente como debe funcionar la defensa en profundidad.

**FALLO-23 (el refresh de Power BI lo destapó):** el cron diario llevaba 3 días fallando en silencio — `dbt seed` no altera tablas existentes, así que cuando `dim_assets` ganó la columna `fx_pair`, el build contra Supabase (cuya tabla era anterior al cambio) murió con "column fx_pair does not exist" y `mart_fx_decomposition` nunca llegó a la nube (de ahí "la clave no coincidió con ninguna fila" en Power BI). La ingesta corría ANTES del fallo, así que no se perdió ni una vela. Fix inmediato: seed `--full-refresh` + dbt build contra Supabase (100 PASS). Fix permanente: el flow usa `dbt build --full-refresh` (sin modelos incrementales, solo recrea seeds — 48 filas). Lección: un cron verde hoy no es un cron verde mañana; los cambios de esquema de seeds necesitan full-refresh en TODOS los entornos, no solo donde se desarrolló.

**FALLO-22 (encontrado por el usuario al abrirlo en Desktop):** `The 'Equity' measure cannot be created because a column with the same name already exists`. Causa: los nombres de objetos en Tabular son **insensibles a mayúsculas dentro de una tabla** — la medida `Equity` colisionaba con la columna `equity` de `equity_curves`. La trampa: el deserializador TMDL de Microsoft (que usamos para validar) acepta el archivo; la unicidad solo la exige **el motor** al crear la base de datos — la única capa que no podíamos ejecutar sin Windows. Fix: medida renombrada a `Strategy Equity` + proyección del gráfico actualizada + scan programático de colisiones medida↔columna en todo el modelo (era la única). Dato positivo del reporte de error: Desktop saltó el login sin cuenta de trabajo, abrió por `\\wsl.localhost` y parseó todo el proyecto — murió en el último paso, ya corregido (`b2feb77`).

### Estado al cierre de sesión 9 — FASE 4 COMPLETA (4a+4b+4c)
| Ítem | Estado |
|---|---|
| Pipeline + 1.347 variantes + validación OOS | ✅ corriendo solo cada día (cron confirmado) |
| Página del laboratorio en el sitio | ✅ en vivo, bilingüe |
| Descomposición cambiaria | ✅ mart + página + Power BI |
| Informe Power BI (PBIP) | ✅ en el repo, validado con parser oficial — el usuario lo abre en Desktop y refresca |
| Pendiente usuario | ⏳ abrir el .pbip en Desktop (instrucciones en powerbi/README.md) |
| Siguiente fase | Fase 5: /historia (redacción con lente de propósito) — o lo que el usuario decida |

---
