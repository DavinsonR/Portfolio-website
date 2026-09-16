# Decisiones — D-01 … D-31

*Índice. Cada fila enlaza a la sesión donde la decisión se tomó, con su justificación completa; aquí va solo lo suficiente para saber si hace falta ir a leerla.*

**Cómo usar esta tabla:** antes de cambiar algo que parezca arbitrario, búscalo aquí. Varias de estas decisiones se ven como un descuido y son deliberadas, con una medición detrás.

## El sitio (este repositorio)

| # | Decisión | Sesión |
|---|---|---|
| D-01 | Next.js sobre Astro — el roadmap incluía dashboard/IA/API | [fundación §4](bitacora/00-fundacion.md) |
| D-02 | React viene con Next; Python es motor aparte, no del sitio | [fundación §4](bitacora/00-fundacion.md) |
| D-03 | Dirección visual = fusión de las propuestas 02 y 04 | [fundación §4](bitacora/00-fundacion.md) |
| D-04 | Nav sin estilo terminal; la monoespaciada se queda en contenido técnico | [fundación §4](bitacora/00-fundacion.md) |
| D-05 | **i18n sin librería** — cero dependencias, contenido en Git | [fundación §4](bitacora/00-fundacion.md) |
| D-06 | Contacto es una sección, no una página | [fundación §4](bitacora/00-fundacion.md) |
| D-07 | **El PDF del CV sale de la fuente única** — dos CV no pueden desincronizarse | [fundación §4](bitacora/00-fundacion.md) |
| D-08 | Trading sim: Python offline → JSON. $0, sin servidor | [fundación §4](bitacora/00-fundacion.md) |
| D-09 | Niveles de skills honestos, no todo «avanzado» | [fundación §4](bitacora/00-fundacion.md) |
| D-10 | Narrativa del CV reconstruida, no copiada | [fundación §4](bitacora/00-fundacion.md) |
| D-11 | Bilingüe y remoto en primer plano | [fundación §4](bitacora/00-fundacion.md) |
| D-12 | «Davirson» visible (cédula), «Davinson» en los enlaces (redes) | [fundación §4](bitacora/00-fundacion.md) |
| D-28 | Power BI sin embed, con página propia y catálogo copiado con su SHA | [15](bitacora/sesion-15.md) |
| D-29 | Tesis pública por etapas, PDF diferido | [15](bitacora/sesion-15.md) |
| D-30 | El tracking app se queda privado — es producto potencial | [15](bitacora/sesion-15.md) |
| D-31 | **Figura estática del atlas en la portada, no el interactivo** — 14,1 KB gzip y cero JavaScript contra 258 KB pedidos al hidratar | [17](bitacora/sesion-17.md) |

## La plataforma de datos (`market-data-medallion`)

Estas decisiones **no rigen este repositorio**. Están aquí porque el sitio consume su salida y porque la página de trading depende de su contrato.

| # | Decisión | Sesión |
|---|---|---|
| D-13 | Fase 4 se expande a plataforma medallion en repo nuevo, 100% en inglés | [4](bitacora/sesion-04.md) |
| D-14 | Postgres = Supabase existente, con ping diario de keep-alive | [4](bitacora/sesion-04.md) |
| D-15 | Power BI como PBIP + .pbix en el repo; «Publish to web» exige Pro | [4](bitacora/sesion-04.md) |
| D-16 | Fuentes: Coinbase + Kraken (cripto), Tiingo + Alpha Vantage (ETF) | [4](bitacora/sesion-04.md) |
| D-17 | Orquestación con GitHub Actions cron + Prefect 3; **Airflow descartado a propósito** | [4](bitacora/sesion-04.md) |
| D-18 | `tiingo_fx` para divisas; `volume` opcional — el FX spot no tiene volumen consolidado | [6](bitacora/sesion-06.md) |
| D-19 | `silver.dim_assets` real sustituye la heurística `symbol LIKE '%-USD'` | [6](bitacora/sesion-06.md) |
| D-20 | `gold.mart_strategy_leaderboard` — 177 backtests convertidos en estadística | [6](bitacora/sesion-06.md) |
| D-21 | Export partido en `index.json` + `backtests/<SÍMBOLO>.json` bajo demanda | [6](bitacora/sesion-06.md) |
| D-22 | Solo las 222 estrategias individuales guardan curva; impuesto por un `CHECK` en la BD | [7](bitacora/sesion-07.md) |
| D-23 | Señales calculadas una vez por activo; las combinaciones son AND vectoriales | [7](bitacora/sesion-07.md) |
| D-24 | **Split 70/30 de entrenamiento y validación** — sin ventana ciega la cifra no vale | [7](bitacora/sesion-07.md) |
| D-25 | «Ganarle a buy & hold» exige haber operado (`n_trades > 0`) | [7](bitacora/sesion-07.md) |
| D-26 | Descomposición cambiaria | [8](bitacora/sesion-08.md) |
| D-27 | Cómo verificar Power BI sin tener Power BI | [9](bitacora/sesion-09.md) |

---

*Las decisiones posteriores a la sesión 17 (dominio propio, CI, comprobaciones) están en el historial de Git y en [`ROADMAP.md`](ROADMAP.md).*
