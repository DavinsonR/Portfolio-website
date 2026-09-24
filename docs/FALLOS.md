# Fallos — FALLO-01 … FALLO-40

*Este es el documento que hay que leer antes de tocar nada.* Cada fila es un fallo que ya ocurrió, con su causa raíz en la sesión enlazada.

Dos columnas hacen el trabajo:

- **Dónde** — más de la mitad de estos fallos son de `market-data-medallion` (el pipeline) o de Power BI, **no de este repositorio**. Si vienes a trabajar en el sitio, filtra por «sitio» y ahórrate veinte.
- **Cubierto** — si una comprobación automática lo atraparía hoy. Un ✗ es un fallo que sigue dependiendo de que alguien se acuerde.

## El sitio (este repositorio)

| # | Qué pasó | Cubierto | Sesión |
|---|---|---|---|
| 01 | `next/font/google` falla sin red en el build → fuentes autoalojadas | ✓ build | [fundación §7](bitacora/00-fundacion.md) |
| 02 | `as const` sobre el objeto gigante ensanchaba los tipos | ✓ `tsc` | [fundación §7](bitacora/00-fundacion.md) |
| 03 | `characterSpacing` no era encadenable en PDFKit | — histórico | [fundación §7](bitacora/00-fundacion.md) |
| 04 | El primer deploy por API subió el árbol de archivos incompleto | — histórico | [fundación §7](bitacora/00-fundacion.md) |
| 05 | Vercel Authentication dejaba el sitio en 403 para el público | ✓ resuelto | [fundación §7](bitacora/00-fundacion.md) |
| 06 | 403 al crear deployment en el team con el token del conector | — histórico | [fundación §7](bitacora/00-fundacion.md) |
| 07 | Push por SSH: `Permission denied (publickey)` | — histórico | [2](bitacora/sesion-02.md) |
| 08 | Push por HTTPS: credenciales inválidas / 403 | — histórico | [2](bitacora/sesion-02.md) |
| 29 | **La tarjeta de LinkedIn de cada subpágina enseñaba las cifras de la portada** — Next *reemplaza* `openGraph`, no lo fusiona | ✓ `check:routes` | [16](bitacora/sesion-16.md) |
| 30 | **La carga diferida del atlas no difería nada** — un segundo efecto pedía el nivel departamental al montar | ✗ | [17](bitacora/sesion-17.md) |
| 31 | **El PDF del CV se quedó con el host anterior impreso dentro** al mudarse el dominio. Un PDF es opaco: `grep` no lo ve | ✓ `check:artifacts` | 16 sep 2026 |
| 32 | **La línea de contacto del CV llevaba los comandos LaTeX rotos** — barras simples en una plantilla de JavaScript: `\small` → `small`, `\,` → `,`, `\t` → TAB. Salía `small hrefmailto:…` al PDF, en los dos idiomas, desde que existe el generador | ✓ `check:artifacts` | 16 sep 2026 |
| 33 | El propio `check:artifacts` solo miraba dentro de los streams comprimidos del PDF; al recompilar con pdfLaTeX las URL pasaron a las anotaciones `/URI` y dio un falso negativo con el PDF ya correcto | ✓ mira los dos sitios | 16 sep 2026 |
| 34 | El SVG de la figura del atlas emitía `height="auto"`, que no es una longitud: error de consola en la portada en cada carga. Va al estilo, donde `height:auto` sí es válido | ✓ `check:routes` | 16 sep 2026 |
| 35 | **El generador del atlas escribía en la ruta vieja.** Al mover `lib/atlas-figure.ts` a `lib/generated/`, `scripts/generate-atlas-figure.mjs:41` se quedó apuntando al destino anterior: `npm run atlas` habría creado un fichero huérfano y la figura publicada se habría congelado sin que nada se quejara. Lo encontró Codex en una revisión independiente | ✓ CI regenera y diff | 16 sep 2026 |
| 36 | **Las catorce subpáginas publicaban la tarjeta de Twitter de la portada.** La misma mecánica que FALLO-29 —`twitter` se reemplaza, no se fusiona— en el bloque que nadie volvió a declarar; el `openGraph` de cada una ya era correcto y `check:routes` solo miraba `og:url`. Lo encontró la auditoría de cinco expertos | ✓ `check:routes` | [18](bitacora/sesion-18.md) |
| 37 | **El `<title>` de `/cv` llevaba el nombre dos veces**: la página lo ponía en su título y la plantilla del layout (`%s — nombre`) lo volvía a añadir. En producción, en los dos idiomas, 71 caracteres | ✗ | [18](bitacora/sesion-18.md) |
| 38 | **`Motion.tsx` desarmaba el salvavidas de 3 s antes de montar el observador**: si algo lanzaba entre medias, todo `[data-reveal]` se quedaba invisible para siempre, y no existía ningún `error.tsx` que contuviera el fallo. Latente, nunca observado; lo encontró la auditoría | ✗ | [18](bitacora/sesion-18.md) |
| 39 | **`next@16.3.1` llevaba un CVE crítico en el lockfile y nadie lo vio**: las alertas de Dependabot estaban apagadas a nivel de repositorio y ningún paso de CI corría `npm audit` | ✓ `npm audit` en CI + Dependabot | [18](bitacora/sesion-18.md) |
| 40 | **La página de la tesis publicó cifras de inferencia viejas durante semanas** — β = +0,0007, p = 0,90, bootstrap 0,89, «91 pruebas», «15 especificaciones» y el titular «publiqué el cero», cuando el repositorio de la tesis ya decía +0,0038, p = 0,54, 189 pruebas, 160 especificaciones y «un límite, no una ausencia». Las cifras estaban copiadas a mano en seis sitios de dos idiomas y ninguna comprobación las comparaba con su fuente. Ahora viven en `lib/data/thesis-results.ts` con archivo y clave de origen, y `check:figures` rechaza un «β = …» escrito a mano | parcial: el valor sigue copiado del JSON del otro repositorio | [24](bitacora/sesion-24.md) |

**Dos rutas que devolvían 200 debiendo ser 404** y un redirect de idioma que faltaba también salieron en la [sesión 16](bitacora/sesion-16.md); hoy los cubre `check:routes`.

## La plataforma de datos (`market-data-medallion`)

No rigen este repositorio. Están aquí porque el sitio consume su salida.

| # | Qué pasó | Sesión |
|---|---|---|
| 09 | Conector Vercel: 403 al disparar deployment | [2](bitacora/sesion-02.md) |
| 10 | **Watermark envenenado por un seed sintético** aplicado a una base compartida | [5](bitacora/sesion-05.md) |
| 11 | Fechas del export corridas un día — `timestamptz` en el timezone del servidor | [5](bitacora/sesion-05.md) |
| 12 | Kraken parseado como array cuando el cliente lo guarda como dict → 100% NULL | [5](bitacora/sesion-05.md) |
| 13 | Push rechazado: el PAT no podía tocar `.github/workflows/*` | [5](bitacora/sesion-05.md) |
| 14 | **Reintentar un HTTP 429 empeora el 429** — hasta 9 llamadas desperdiciadas por símbolo | [6](bitacora/sesion-06.md) |
| 15 | Una columna enteramente NULL llega como dtype `object` y pandera la rechaza | [6](bitacora/sesion-06.md) |
| 16 | La conexión directa de Supabase es IPv6-only; los runners de Actions son IPv4 | [7](bitacora/sesion-07.md) |
| 17 | Sin retención, el free tier muere en menos de una semana | [7](bitacora/sesion-07.md) |
| 18 | **Warm-up asimétrico entre ventanas** — habría movido la métrica principal un tercio | [7](bitacora/sesion-07.md) |
| 19 | Sharpe degenerado: `r` se cancela y colapsa a `√(periodos/N)` | [7](bitacora/sesion-07.md) |
| 20 | Los tests de Python leían `DATABASE_URL` y escribían en Supabase | [7](bitacora/sesion-07.md) |
| 21 | GitHub bloqueó una action de terceros y el job murió antes del primer paso | [8](bitacora/sesion-08.md) |
| 22 | Power BI: en Tabular los nombres no distinguen mayúsculas dentro de una tabla | [9](bitacora/sesion-09.md) |
| 23 | **Un cron verde hoy no es un cron verde mañana** — `dbt seed` no altera tablas existentes | [9](bitacora/sesion-09.md) |
| 24 | El secreto de GitHub contenía su propio nombre | [12](bitacora/sesion-12.md) |
| 25 | Un 403 se reintentaba como si fuera transitorio | [12](bitacora/sesion-12.md) |
| 26 | **El run publicaba igual** (el peor de los cuatro) | [12](bitacora/sesion-12.md) |
| 27 | La llave se escribía en la base en texto plano | [12](bitacora/sesion-12.md) |
| 28 | Las cifras publicadas venían de la base local, no de producción | [12](bitacora/sesion-12.md) |

---

## El patrón, si hay que quedarse con uno

Casi ninguno de estos fallos fue un error de sintaxis. Fueron **contratos que cada lado entendió distinto** (12, 22, 32), **cifras que venían de donde no debían** (28, 29, 31), y **cosas que estaban verdes y dejaron de estarlo sin avisar** (21, 23). Por eso las comprobaciones de este repositorio no miran estilo: miran que lo publicado coincida con su fuente.
