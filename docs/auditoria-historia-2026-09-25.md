# Auditoría: la página de la historia (`/historia`)

*25 sep 2026 · producción, `/es/historia` y `/en/historia`. Mismo método que las auditorías anteriores: capturas de página completa a 1280 px en claro y a 390 px en oscuro, más mediciones automáticas (desborde de 320 a 1280 px, prosa por debajo de 14 px y errores de consola). Solo lectura: no se ha tocado nada.*

## Veredicto

**Técnica 10/10.** Cero desbordes, cero prosa por debajo de 14 px y cero errores de consola.

**Texto 8/10.** Es el mejor texto del sitio: primera persona, registro colombiano real y una prueba enlazada en cada sección. Le quedan algunos anclajes de junior, una frase defensiva y dos afirmaciones que caducan solas.

**Diseño 4/10.** Es la única página del sitio que **no tiene un solo gráfico**: 6.178 px en escritorio y 8.190 px en el teléfono de texto seguido, interrumpido solo por una tabla de tres filas y dos citas. Justo después de convertir la portada y las seis páginas de proyecto en piezas visuales, esta se queda como el muro de texto que los reviewers ya criticaron («te pierdes»). Además, en escritorio el texto ocupa el 55 % izquierdo y **el 45 % derecho queda en blanco** durante toda la página.

---

## Hallazgos

### Alto

| ID | Hallazgo | Solución |
|---|---|---|
| **HI-01** | **Ningún gráfico en siete secciones.** Cada sección afirma algo que en otra página del sitio ya tiene su gráfico: el atlas en §03, la serie y el embudo en §04, la fuga 0,9461 → 0,6621 → 0,7005 en §05. | Un gráfico por sección, reutilizando los componentes que ya existen: §01 las **60 h/mes** como cifra grande · §03 el **atlas 2018/2025** (la tabla de tres filas pasa a ser su pie) · §04 la **serie de SPY** · §05 una escalera de **AUC**: 0,9461 (la fuga), tachado → 0,6621 (sin el campo) → 0,7005 (el modelo en producción) · §06 el **gate**, 0,7639 contra 0,80. |
| **HI-02** | **El 45 % derecho de la página, en blanco** durante 6.000 px en escritorio. El texto va en una columna de ~62 caracteres pegada a la izquierda. | Una rejilla de dos columnas en escritorio: el relato a la izquierda y, en la columna derecha **pegajosa**, el gráfico y la cifra de la sección con su enlace de prueba. En el teléfono, el gráfico va debajo del texto. |
| **HI-03** | **La cabecera no muestra «la línea recta» que promete.** La intro dice «esta es la línea —y es una línea recta—», pero no la dibuja. | Una **línea de tiempo** en la cabecera: 2018 becario Ecopetrol → 2024 practicante en SLB → 2 ascensos → 2026 dueño del cierre de 15+ países en Neoris → la tesis → las plataformas. Cada hito es un enlace a su sección. Es el gráfico que esta página tiene que tener y ninguna otra tiene. |
| **HI-04** | **Dos afirmaciones que caducan solas.** §06: «incluidos los que rompí **esta semana**» (dentro de un mes será falso). §05: «el número que me hizo quedar bien **duró dos días**» (no enlaza a nada que lo pruebe). | §06: «…incluidos los más recientes». §05: confirmar los «dos días» contra NOTES.md o ADR-0002 de credit-risk-mlops; si no se puede probar, «El número que me hizo quedar bien no sobrevivió a la primera revisión». |

### Medio

| ID | Hallazgo | Solución |
|---|---|---|
| **HI-05** | **«Tres años» dos veces seguidas:** en el titular («Llevo tres años haciendo este trabajo») y como primeras palabras de la intro («Llevo tres años en finanzas…»). Es el anclaje de junior que la auditoría de copy ya había señalado (P1), y aquí va en el H1. | Titular: «**El cruce entre finanzas y datos no fue un giro. Fue el trabajo desde el primer día.**» La intro empieza por el hecho: «En cada puesto de finanzas terminé haciendo lo mismo sin que nadie me lo pidiera…». |
| **HI-06** | **§02 no coincide con el CV.** Dice «Sistemas de gestión financiera para el cierre y el forecast… América y también el hemisferio oriental», mientras que el CV (corregido hoy) dice «**dueño del proceso** de cierre y forecast… América, Europa y Asia». | Alinear §02: «En Neoris/EPAM pasé a ser dueño del proceso de cierre y forecast de SG&A de más de quince países —América, Europa y Asia—, desde HQ.» |
| **HI-07** | **Queda una defensa preventiva** (P2): «No lo pienses como una decisión de carrera, porque no lo fue.» | Quitarla. La frase siguiente («la pregunta me pareció buena y la herramienta no la respondía») ya lo dice sin negar nada. |
| **HI-08** | **El cierre no cierra la venta.** §07 termina en «Estoy en Bogotá, GMT-5…» y no dice ni nivel, ni inicio, ni vía, que es justo lo que decide quien llegó hasta aquí. | Añadir al final de §07 el bloque de contratación de la portada: **Senior Analyst · preaviso de 15 días · B2B o EOR, sin patrocinio de visa**, en ámbar (es contenido humano). |
| **HI-09** | **El índice pegajoso no cabe.** Siete etiquetas largas en una fila: en escritorio «Hacia dónde voy» se corta en «Hacia», y en el teléfono solo se ven dos. | Etiquetas de una o dos palabras: Origen · Patrón · La tesis · La plataforma · La fuga · El hilo · Contratar. |
| **HI-10** | **Faltan dos proyectos.** El relato cubre la tesis, la plataforma y el sistema de crédito, pero no el **laboratorio de pronóstico de LATAM** (el más visual del sitio) ni **JARVIS**. | Una frase en §04 que los una: «Y encima de esa base, un laboratorio que pronostica 20 economías de América Latina y un producto con datos sensibles abierto al público sin exponer una fila», con los dos enlaces. |

### Bajo

| ID | Hallazgo | Solución |
|---|---|---|
| **HI-11** | Los enlaces de prueba («Ver en el CV →», «Abrir el laboratorio →») son texto de 13–14 px y se pierden al final de cada sección. | Convertirlos en la tarjeta de prueba de la columna derecha (HI-02): cifra, frase y enlace. |
| **HI-12** | El kicker «Trayectoria · cómo se construye un perfil que casi no existe» ocupa dos líneas en el teléfono. | «Trayectoria · en primera persona» en móvil, o acortarlo en los dos anchos. |

---

## Lo que ya está bien (no tocar)

- **El registro:** «te cuento», «así de poco», «por un rato me sentí muy bien». Es lo que hace creíble al resto del sitio.
- **El arco:** «un número que nadie puede auditar no sirve» en §01 vuelve en §05 con los gates. Es el mejor recurso del sitio.
- **Una prueba enlazada en cada sección.**
- **Las dos citas en serif** (el veredicto de §02 y «Publico lo que falla»).
- **La banda ámbar de cierre.**

## Orden de ataque

1. **HI-04, HI-06, HI-07, HI-09:** texto y etiquetas, de minutos.
2. **HI-01 + HI-02 + HI-11:** la rejilla de dos columnas, con el gráfico y la prueba de cada sección.
3. **HI-03:** la línea de tiempo de la cabecera.
4. **HI-05, HI-08, HI-10:** el titular, el cierre con los términos de contratación y los dos proyectos que faltan.
