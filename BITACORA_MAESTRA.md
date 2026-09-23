# Bitácora maestra — Proyecto Davirson

*Índice. El contenido vive en [`docs/`](docs/) desde el 16 sep 2026.*

Esto eran 107 KB y 985 líneas de narrativa cronológica: el mejor activo del proyecto y su peor problema de acceso. Para encontrar una decisión había que leer diecisiete anexos, y ningún agente podía cargarlo sin quemar medio contexto. Se partió **sin reescribir una línea** (`scripts/split-bitacora.mjs`, corte mecánico por encabezados, verificado carácter a carácter contra el original); lo único nuevo son los tres índices.

## Empieza por aquí

| | Qué es | Cuándo |
|---|---|---|
| **[docs/FALLOS.md](docs/FALLOS.md)** | Los 33 fallos en una tabla, con su causa raíz enlazada y si hay una comprobación que los atrape hoy | **Antes de tocar nada.** Más de la mitad son del pipeline, no de este repo: filtra y ahórrate veinte |
| **[docs/DECISIONES.md](docs/DECISIONES.md)** | Las 31 decisiones, qué se decidió y dónde está el porqué | Antes de cambiar algo que parezca arbitrario. Varias lo parecen y no lo son |
| **[docs/ROADMAP.md](docs/ROADMAP.md)** | Estado actual y lo que queda | Al empezar una sesión |

Y para trabajar en el código: [`CLAUDE.md`](CLAUDE.md) (invariantes y comandos), [`docs/DESIGN.md`](docs/DESIGN.md) (el contrato del sistema visual) y [`docs/PRODUCT.md`](docs/PRODUCT.md) (el posicionamiento y la evidencia real disponible). Los dos últimos **no son documentación descriptiva**: varias de sus reglas son vinculantes y romperlas ya ha sido un hallazgo de revisión.

## El historial, sesión por sesión

| | Sesión | Qué pasó |
|---|---|---|
| — | [Documento fundacional](docs/bitacora/00-fundacion.md) | Las diez secciones del plan v1.0: arquitectura, decisiones D-01…D-12, fallos 01…06, roadmap original |
| 2 | [15 ago](docs/bitacora/sesion-02.md) | GitHub y deploy público *(reconstruido: los commits originales nunca llegaron a subirse)* |
| 3 | [—](docs/bitacora/sesion-03.md) | Paquete de traspaso para agente de IA |
| 4 | [16–17 ago](docs/bitacora/sesion-04.md) | La Fase 4 se replantea como plataforma de datos |
| 5 | [17 ago](docs/bitacora/sesion-05.md) | Pipeline medallion funcionando de punta a punta |
| 6 | [17 ago](docs/bitacora/sesion-06.md) | Universo ampliado a 45 activos |
| 7 | [17 ago](docs/bitacora/sesion-07.md) | Estrategias combinadas y validación fuera de muestra — **el hallazgo más valioso del proyecto** |
| 8 | [17–18 ago](docs/bitacora/sesion-08.md) | La página en vivo, descomposición cambiaria, cron confirmado |
| 9 | [18 ago](docs/bitacora/sesion-09.md) | Fase 4 cerrada: informe Power BI |
| 10 | [20 ago](docs/bitacora/sesion-10.md) | Rediseño completo del sitio |
| 11 | [21 ago](docs/bitacora/sesion-11.md) | El CV, la vitalidad, y un número que no cuadraba |
| 12 | [21 ago](docs/bitacora/sesion-12.md) | El cron volvió y trajo malas noticias — cuatro fallos, el peor: **el run publicaba igual** |
| 13 | [21 ago](docs/bitacora/sesion-13.md) | Auditoría del diccionario: la fuente única contra la fuente real |
| 14 | [21 ago](docs/bitacora/sesion-14.md) | Higiene antes de empezar a repartir el enlace |
| 15 | [5 sep](docs/bitacora/sesion-15.md) | Power BI a la vista, tesis publicada, tracking en su sitio |
| 16 | [7 sep](docs/bitacora/sesion-16.md) | Auditoría por agentes: dos 404 que devolvían 200 y el camino de contacto que faltaba |
| 17 | [7 sep](docs/bitacora/sesion-17.md) | El atlas sale del fondo, y la deriva que explica el nulo |
| 18 | [23 sep](docs/bitacora/sesion-18.md) | Cinco expertos auditan el sitio, y la sesión 1: un CVE que nadie vio, las tarjetas de Twitter de la portada en catorce rutas, el nombre dos veces en el título del CV |
| 19 | [23 sep](docs/bitacora/sesion-19.md) | Las cifras del laboratorio dejan de escribirse a mano, el veredicto entra en el HTML, y el PDF de una página lleva por fin un resultado |

## Después de la sesión 17

El historial sigue en los mensajes de commit, que llevan la misma disciplina: qué se midió, qué se encontró y por qué se decidió así. Lo destacado del 16 sep 2026:

- **El sitio se muda a `davirson.com`** (Cloudflare Registrar, ~$10/año plano). El host anterior queda redirigiendo para siempre.
- **404 propio, identidad de icono y manifest.** El favicon era el logotipo de Vercel que trae la plantilla de Next. De paso se midió que un `app/[lang]/not-found.tsx` es código muerto: con `dynamicParams = false` toda ruta sin match cae al de la raíz.
- **CI y tres comprobaciones** (`check:dict`, `check:artifacts`, `check:routes`), verificadas rompiendo las cosas a propósito para comprobar que saben fallar.
- **FALLO-32**: la línea de contacto del CV llevaba los comandos LaTeX rotos —barras simples en una plantilla de JavaScript— desde que existe el generador. Salía `small hrefmailto:…` al PDF, en los dos idiomas.
