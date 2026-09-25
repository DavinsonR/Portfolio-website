# Auditoría: portada y CV (web y PDF)

*25 sep 2026 · producción (`davirson.com`, tras la PR #45). Método: capturas de página completa de `/es`, `/en`, `/es/cv` y `/en/cv` a 1280 px en claro y a 390 px en oscuro; los PDF del CV renderizados página a página; y mediciones automáticas de desborde (320–1280 px), prosa por debajo de 14 px y errores de consola. Solo lectura.*

## Veredicto

**Técnica 10/10.** Cero desbordes, cero prosa por debajo de 14 px y cero errores de consola en las cuatro rutas.

**Portada 8/10.** La vitrina funciona: lo que la frena es lo que va antes y después de ella. En el teléfono, la primera tarjeta de proyecto aparece a unos 1.900 px (más de dos pantallas), y las cifras de la banda de arriba se repiten en las tarjetas.

**CV web 7/10.** El contenido está bien afinado; la forma, no. Tiene cuatro botones de descarga compitiendo, la columna de habilidades queda desequilibrada y la banda de cierre no tiene titular.

**PDF de una página 6/10: es el hallazgo más caro.** Es el documento que se reenvía, y sus proyectos no llevan **ni una cifra**. Los resultados más fuertes del sitio (276,3 M USD, AUC 0,7005, 1.392 → 51) no aparecen en él.

---

## Hallazgos

### Alto

| ID | Dónde | Hallazgo | Solución |
|---|---|---|---|
| **PC-01** | PDF de 1 página (ES y EN) | **Los cuatro proyectos salen sin resultado:** solo el nombre, las herramientas usadas y el enlace. Al pie de la hoja sobran unos 80 px. | Una línea de resultado por proyecto, justo debajo del nombre y con cifra: «$276.3M in avoidable charge-offs · AUC 0.7005 · 10 gates, one blocks my own model», «1,392 strategies → 51 survived · 89 data-quality tests daily», «526 tests · 34 tables under row-level security», «19 public sources · 1,123 municipalities». La lista de herramientas baja a una sola línea. |
| **PC-02** | PDF completo, página 1 | **Título huérfano:** «Projects in operation» y su nota quedan solos al pie de la página 1, y los proyectos empiezan en la 2. | `\needspace` antes de cada `\section*` en `scripts/generate-cv-latex.ts`. |
| **PC-03** | Perfil del CV (web y PDF) | **Afirmación inexacta:** el perfil dice «15+ países de América y Europa», pero la viñeta de Neoris incluye a **India**. | «…de más de 15 países de América, Europa y Asia» / «…across the Americas, Europe and Asia». |
| **PC-04** | Portada · móvil | **La vitrina aparece a unos 1.900 px.** Antes van el hero, un párrafo de 9 líneas, el bloque ámbar completo (nivel, inicio, vía, correo, LinkedIn, GitHub y el botón de copiar) y la banda de cifras. | En el teléfono: el párrafo `sub` cortado a 2 líneas con «leer más», y el bloque ámbar reducido a nivel, inicio y vía (el contacto ya está en la barra y al pie). |
| **PC-05** | Portada | **Las cifras se repiten:** 1.392 aparece en la banda y otra vez en la tarjeta de la plataforma; 89, en la banda y en el texto de la misma tarjeta; 95 M y 276,3 M cuentan el mismo proyecto. La banda y las tarjetas compiten en vez de sumar. | La banda habla **de la persona** y las tarjetas **de los proyectos**. Banda: **15+** países cuyo cierre controlo · **60 h/mes** de trabajo manual eliminadas · **2 ascensos** en 26 meses · **6** proyectos públicos verificables. |

### Medio

| ID | Dónde | Hallazgo | Solución |
|---|---|---|---|
| **PC-06** | CV web · cabecera | **Cuatro acciones compitiendo:** CV en PDF, versión de 1 página, Fuente LaTeX y Contacto, más la nota «Compilable en Overleaf». Al reclutador el LaTeX no le sirve de nada. | Botón sólido: **Descargar CV (1 página)**; en contorno, «versión completa». LaTeX y Overleaf bajan al pie del CV como enlace de texto. |
| **PC-07** | CV web · móvil | **En la banda de cifras las etiquetas se tocan:** «…hasta liderar a un practicante» choca con «registros de crédito…» de la columna vecina. | Separación horizontal en la rejilla de 2 columnas (`gap-x-5`). |
| **PC-08** | CV web · Habilidades | **Columnas desequilibradas:** la de la izquierda (chips) termina unos 650 px antes que la derecha (15 filas de «Stack técnico»), y queda un bloque en blanco. Además, «Stack técnico» repite casi fila por fila el «Ninguna lista de logos» de la portada. | «Stack técnico» a todo el ancho, en 3 columnas, **debajo** de los chips (como en la portada), o fundirlo con los chips enlazando cada uno a su prueba. |
| **PC-09** | CV web · cierre | **La banda final no tiene titular:** empieza directamente con el párrafo. En la portada y en las páginas de proyecto sí lo tiene («Deja de elegir…»). | Usar el `ContactBand` común, con titular. |
| **PC-10** | Portada | **«Ninguna lista de logos»** (9 filas con subrayado) justo después de «Trayectoria» alarga la portada unos 450 px con información que ya está en las tarjetas y en el CV. | Pasarla a una fila compacta de chips enlazados, o dejarla solo en el CV. |
| **PC-11** | Portada y CV | **Sigue sin haber foto.** Es la última queja abierta de los reviewers, y el bloque ámbar admite una sin rediseño. | Subir una foto (tiene que aportarla el dueño). |

### Bajo

| ID | Dónde | Hallazgo | Solución |
|---|---|---|---|
| **PC-12** | Pie, en la portada | El pie ofrece «Volver al inicio» estando ya en el inicio. | Ocultar ese enlace cuando la ruta es la portada. |
| **PC-13** | CV web | El kicker de la cabecera dice «ROLES OBJETIVO» aunque los roles no están debajo de él, sino bajo el nombre. | Kicker «CV · FINANZAS Y DATOS», igual que la portada. |

---

## Lo que ya está bien (no tocar)

- **El bloque ámbar** (nivel, inicio y vía) en la primera pantalla de escritorio.
- **La vitrina de una columna** con los gráficos reales.
- **«Haz clic en la que menos te creas».**
- **Las viñetas del CV**, con verbos de dueño y la cifra primero.
- **La captura del tablero de Tableau** en Reconocimientos.
- **El PDF de una página**, que de verdad cabe en una hoja y lleva nivel, inicio y vía bajo el nombre.

## Orden de ataque

1. **PC-01, PC-02, PC-03:** los PDF, que son lo que se reenvía. Exigen `npm run cv`.
2. **PC-04, PC-05:** la portada en el teléfono y la banda de cifras.
3. **PC-06 a PC-10:** la forma del CV web y la portada.
4. **PC-11:** la foto, que tiene que aportarla el dueño.
