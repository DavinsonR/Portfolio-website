# Auditoría de diseño: las seis páginas de proyecto

*25 sep 2026 · producción (`davirson.com`, commit de la PR #42). Método: capturas de página completa con el navegador headless (1280 px en tema claro y 390 px en tema oscuro), más mediciones automáticas en cada ruta: desborde horizontal a 320/393/768/1280 px, prosa por debajo de 14 px y errores de consola. Solo lectura: no se ha tocado nada.*

## Veredicto

**Técnica 10/10. Venta 6/10.**

Lo técnico está limpio en las seis páginas: cero desbordes a 320, 393, 768 y 1280 px, cero prosa por debajo de 14 px y cero errores de consola.

El problema es de continuidad. La portada ahora vende con gráficos, pero al hacer clic el lector aterriza en un titular seguido de cinco a siete líneas de prosa. En la de crédito, el primer gráfico aparece a unos 1.400 px; en la de la tesis, el atlas aparece a unos 2.400 px. Cada página se diseñó por separado, y se nota: cada una tiene una cabecera distinta, una banda de cifras distinta (o ninguna) y un índice pegajoso distinto (o ninguno).

| Página | Alto (escritorio) | Gráfico en la 1.ª pantalla | Banda de cifras | Índice pegajoso | Botón en la cabecera |
|---|---|---|---|---|---|
| `/projects/credit-risk` | 5.741 px | no | **no** | **no** | no |
| `/projects/trading-sim` | 6.708 px | no (cifras a ~550 px) | sí, con otro formato | **no** | no |
| `/projects/powerbi` | 8.277 px | no | sí | **no** | no |
| `/projects/tracking` | 7.405 px | no | sí | sí | sí |
| `/research/fintech-inclusion` | 9.263 px | no | sí | sí | sí |
| `/labs/macro-forecast` | 9.777 px | no (tablero a ~1.200 px) | sí | sí | no |

---

## Hallazgos

### Alto

| ID | Página | Hallazgo | Solución |
|---|---|---|---|
| **DP-01** | todas | **La cabecera no enseña el trabajo.** El lector viene de una tarjeta con un gráfico y aterriza en un bloque de texto. En la primera pantalla no hay nada visual en ninguna de las seis páginas. | Llevar a la cabecera el **mismo gráfico de la tarjeta de la portada**: continuidad visual y el mejor argumento, arriba. En escritorio va a la derecha del título; en el teléfono, debajo de la primera frase. Los componentes ya existen (`components/showcase/Previews.tsx`). |
| **DP-02** | powerbi | **La página más cercana al puesto de Financial BI Analyst no tiene una sola imagen del informe.** La sección «Las páginas» ocupa unos 2.500 px con un inventario técnico (`cardVariants`, `slRegion`, `slKind`…) que solo le sirve a quien ya sabe leer un PBIR. | (a) Exportar las 4 páginas a PNG desde Power BI Desktop: el andamiaje `shots` ya está escrito y esperando el archivo. Esto lo tiene que hacer el dueño, porque necesita Power BI Desktop. (b) Mientras tanto, dibujar cada página como una maqueta con los mismos datos, usando los gráficos que ya tiene el sitio (embudo, dispersión, FX, curvas). En los dos casos, el inventario va a un bloque desplegable. |
| **DP-03** | powerbi · móvil | **El diagrama del modelo semántico se corta a 390 px:** las cuatro tablas de hechos aparecen como «comb…», «asse…», «fx_de…», «equit…». No aparece en la medición de desborde porque el recorte ocurre dentro de su contenedor. | En pantallas de menos de 640 px, dibujar la estrella en vertical (la dimensión arriba y los hechos en columna debajo), o reutilizar la estrella de la tarjeta de la portada, que ya escala. |
| **DP-04** | credit-risk · trading-sim | **La píldora de estado está en inglés y se contradice con la portada.** En `/es/projects/credit-risk` dice «LIVE», y en `/es/projects/trading-sim` dice «BUILDING», mientras la tarjeta de la portada dice «EN OPERACIÓN». | Pasar el texto de la píldora al diccionario, en los dos idiomas, igual que en las otras cuatro páginas. En trading-sim: `status: "live"`, «EN OPERACIÓN» / «IN OPERATION». |
| **DP-05** | credit-risk | **Rótulos que se pisan en dos gráficos.** En el gráfico de los gates, «razón de impacto dispar (regla de cuatro quintos)» choca con «observado 0,7639». En el estudio de evento, «umbral económico declarado antes de estimar» tapa el punto de 2024. | Pasar el rótulo del eje por encima del área del gráfico y alinear la etiqueta de la banda a la izquierda, fuera de la columna de los puntos. |

### Medio

| ID | Página | Hallazgo | Solución |
|---|---|---|---|
| **DP-06** | credit-risk | **No tiene banda de cifras**, y es la página con las cifras más vendedoras del sitio (AUC 0,7005 · $276,3 M · 10 gates · 0,7639). | Una banda de 4 cifras como la de powerbi, tracking, la tesis y el laboratorio. |
| **DP-07** | trading-sim | **La banda de cifras tiene su propio formato y está desalineada.** «51» queda más abajo porque su etiqueta ocupa dos líneas, y «15,1 %» sale más grande que las otras tres. | Usar el mismo componente de banda que las demás páginas, con la etiqueta debajo de la cifra. |
| **DP-08** | credit-risk · trading-sim · powerbi | **Sin índice pegajoso** en páginas de 5.700 a 8.300 px, cuando las otras tres sí lo tienen. | `SectionNav` con las secciones que ya existen. |
| **DP-09** | tesis | **El titular ocupa 4 líneas en escritorio y 7 en el teléfono,** y además el Resumen son 12 líneas de prosa antes del atlas, que es lo más llamativo del proyecto. | Un titular de 2 líneas como máximo (el anterior, «Podía haber publicado el coeficiente bonito. Publiqué el cero.», vendía más). Subir el atlas justo debajo de la banda de cifras y mandar el Resumen a un bloque desplegable. |
| **DP-10** | tracking | **Las capturas del demo se ven a unos 200 px de ancho y no se leen.** Además, las secciones Decisiones, Datos, Procesos y Seguridad suman unos 4.000 px de rejillas de prosa en tres columnas. | Capturas a dos por fila (o una grande con miniaturas). De cada rejilla, dejar visibles las 3 piezas más fuertes y plegar el resto. |
| **DP-11** | laboratorio | **Cada pieza interactiva reserva unos 400 px en blanco con «Cargando las series del laboratorio…»** hasta que llegan sus datos. Sí cargan (comprobado), pero quien baja rápido ve cuatro huecos seguidos. | Un esqueleto con la silueta del gráfico, en el tono de `band`, en lugar del texto. |
| **DP-12** | trading-sim · powerbi | **Salidas duplicadas e inconsistentes:** en trading-sim, «← volver al inicio» va en minúsculas y como botón con borde; en powerbi hay un «Volver al inicio» suelto justo antes del bloque de contacto. El pie ya lleva ese enlace en todas las páginas. | Quitar los dos. La página termina en su bloque de contacto, como las otras cuatro. |
| **DP-13** | credit-risk | La introducción dice «qué pasa cuando la fuente **cambia de idioma**», pero la sección que lo explica se titula «cambió de **vocabulario**» (pendiente de la auditoría del 23 sep). | «…cuando la fuente cambia de vocabulario…». |

---

## La plantilla que las unifica

Todas las páginas de proyecto deberían tener la misma estructura, en este orden:

1. **Píldora de estado + kicker**, en el idioma de la página.
2. **Titular de 2 líneas como máximo** y **una frase** debajo.
3. **Botón principal**, que lleva a la demo, al atlas o al tablero según el proyecto.
4. **Gráfico principal**: el mismo de la tarjeta de la portada.
5. **Banda de 4 cifras**, con un único componente para todas las páginas.
6. **Índice pegajoso.**
7. **Secciones**, cada una con su gráfico primero y su texto después.
8. **Bloque de contacto** para cerrar, sin enlaces sueltos de «volver».

Hoy tracking y el laboratorio ya cumplen del 5 al 8, y la tesis del 3 al 6. Credit-risk y trading-sim son las que más se alejan, y son justo las que la portada destaca primero.

## Lo que ya está bien (no tocar)

- **El laboratorio de LATAM es la mejor página del sitio:** un tablero de verdad, con filtros, KPIs, serie con choques numerados, abanico de pronóstico y mapa de calor. Es la referencia visual para las demás.
- **El simulador de crédito en la propia página**, que puntúa en vivo.
- **El bloque de contacto en ámbar** que cierra las seis páginas.
- **El explorador de backtests y el catálogo de 89 pruebas** de trading-sim.
- **El atlas interactivo** de la tesis.

## Orden de ataque

1. **DP-04, DP-05, DP-13, DP-12:** arreglos de minutos, sin decisiones de diseño.
2. **DP-01 + DP-06 + DP-07 + DP-08:** la plantilla común, empezando por credit-risk y trading-sim.
3. **DP-02 + DP-03:** Power BI. La parte (a), las capturas desde Power BI Desktop, la tiene que hacer el dueño.
4. **DP-09, DP-10, DP-11:** menos texto y mejores esperas.
