# Decisiones — D-01 … D-36

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

## Después de la sesión 17

| # | Decisión | Sesión |
|---|---|---|
| D-32 | **Siete redirects sin idioma en 308 y `/` en 307.** Los de ruta concreta (`/cv` → `/en/cv`…) son decisiones permanentes de arquitectura: consolidan señal y se cachean. `/` se queda temporal a propósito: es el único sitio donde una detección de idioma por `Accept-Language` tendría sentido algún día, y un 308 queda cacheado en el navegador del visitante sin caducidad — lo congelaría. `check:routes` lee la lista de `next.config.ts` y exige exactamente esos códigos | [18](bitacora/sesion-18.md) |
| D-33 | **Las imágenes van en `<img>`, no en `next/image`.** Con `unoptimized` el componente no convertía, ni redimensionaba, ni generaba `srcset`: solo enviaba su runtime (4,8 KB br) por cada ruta con una imagen, y en Power BI por una imagen que no existía. Son WebP con medidas declaradas y `loading="lazy"`. La regla `@next/next/no-img-element` está apagada con este motivo; si algún día se quiere optimización real, vuelve `next/image` SIN `unoptimized` y la regla se enciende | [22](bitacora/sesion-22.md) |
| D-34 | **El sitemap no lleva `lastmod` y el pie no lleva año.** Eran `new Date()` en el build: las 16 URL «modificadas hoy» en cada despliegue, que es exactamente la señal que Google aprende a ignorar, y un año que caducaba cada 1 de enero hasta el siguiente despliegue. Derivarlos de Git exigía un fichero generado más que regenerar en cada commit; omitirlos es más honesto que inventarlos | [22](bitacora/sesion-22.md) |
| D-35 | **El serif es una instancia parcial de la variable** (peso 400–600, tamaño óptico 18–48): el rango exacto en que el sitio la usa. 122 → 69 KB con la misma tipografía en todo lo que se ve. Pinar el tamaño óptico en un solo valor la dejaba en 33 KB, pero cambia el dibujo entre 18 y 48 px; no se hizo. Va con caché inmutable: si cambia, se renombra | [22](bitacora/sesion-22.md) |
| D-36 | **La proyección 2026–2028 del atlas es una capa aparte, con sus propios años, y se pinta con su incertidumbre.** Cada grupo de indicadores tiene sus años: índice, variables y contexto solo los observados (`anios` menos `anios_proyectados`); el grupo `proyeccion` solo los proyectados. El deslizador recorre los años del grupo activo y, al cambiar de grupo, el año se lee al más cercano que existe (2025 → 2026 y vuelta), sin corregir el estado en un segundo render. La proyección solo existe por departamento: en municipios sus opciones siguen en el selector, deshabilitadas y con una línea que dice dónde verlas, y si estaba activa el mapa cae al índice compuesto. Codificación de ADR-022 de la tesis: color = valor en la escala divergente del indicador; opacidad inversa a `intervalo_ancho_proy` (0,35–1, un solo dominio para los tres años, mezclada con el papel como color sólido para que en relieve no se transparente el costado); trama diagonal en los años proyectados, y la leyenda y la nota dicen «proyectado» (la trama nunca es la única señal). El ancho del intervalo es capa propia, secuencial, sin opacidad; es el ancho del crecimiento total y se aplica también al per cápita y al sin anclar, porque el export publica uno solo. Nota fija con `role="note"` construida desde `proyeccion` del JSON (ancla, fecha de corte, antigüedad si está vencida, orígenes ganados, p agrupado por año, cobertura empírica al nivel nominal); una clave ausente quita su frase. Sin tablas de posiciones (ADR-023): en la proyección la lista va por región y nombre, entera, en su propio marco con desplazamiento, y las regiones por orden alfabético | [29](bitacora/sesion-29.md) |

---

*Las decisiones del 16 sep 2026 (dominio propio, CI, comprobaciones) están en el historial de Git y en [`ROADMAP.md`](ROADMAP.md).*
