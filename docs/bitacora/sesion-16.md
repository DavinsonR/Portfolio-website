<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 16 — 7 sep 2026 · Auditoría por agentes independientes: dos 404 que devolvían 200, un pliego que no se imprime, y el camino de contacto que faltaba

Encargo del usuario: revisar fallos de diseño, mejorar composiciones, analizar el sitio desde agentes independientes, y dejarlo listo para que un reclutador lo vea y escriba directo.

Se lanzaron tres auditorías en paralelo, cada una con una lente y sin ver el trabajo de las otras: **conversión** (¿escribe el reclutador?), **accesibilidad, SEO técnico y rendimiento**, y **composición y cumplimiento del sistema de diseño**. Las tres leyeron el código; la de composición trabajó además sobre capturas reales del build (Chromium headless, 1440 y 390, claro y oscuro) — con la advertencia de que Google Fonts está bloqueado en ese entorno y las capturas caen a la fuente del sistema, así que juzgan maquetación, no letra.

Antes de tocar nada se verificó en vivo cada afirmación fuerte. Las que no se pudieron confirmar no se actuaron.

### Los dos bloqueadores, confirmados contra el servidor

**`dynamicParams` nunca se desactivó.** `generateStaticParams` devuelve `["es","en"]`, pero el segmento `[lang]` aceptaba cualquier cosa: `GET /pricing` devolvía **200** con la portada en español dentro de un `<html lang="pricing">` y con `robots: index, follow`. Una granja de soft-404 indexable y, de paso, un fallo de WCAG 3.1.1 en esas URLs. El `canonical` por ruta que se añadió en esta misma sesión lo habría **empeorado**: cada URL basura se declaraba canónica de sí misma. Una línea: `export const dynamicParams = false`. Verificado: `/pricing` → 404.

**El favicon vivía dentro del segmento dinámico.** `app/[lang]/favicon.ico` no genera ruta de icono, así que `/favicon.ico` caía en el comodín y devolvía **125.799 bytes de HTML** con `content-type: text/html`. Ninguna página emitía `<link rel="icon">`. Pestaña en blanco en el navegador y nada al lado del resultado en Google. `git mv` a `app/favicon.ico`. Verificado: `image/x-icon`, y el `<link>` aparece.

### El pliego no se imprimía

PRODUCT dice que esta hoja se imprime y se comparte en pantalla. El navegador omite todo `background-color` al imprimir salvo que se le diga lo contrario, y este sistema **no dibuja cajas: separa regiones con bandas de color a sangre**. En papel desaparecían la banda de cifras, el bloque de disponibilidad, las divulgaciones, las barras del laboratorio y los tramos del atlas — la estructura entera. No había ni un `print-color-adjust` en el árbol. Además:

- Los botones rellenos imprimían `text-paper` (blanco) sin su fondo: **blanco sobre blanco**, y el primero de la lista es "Descargar CV". En papel salen contorneados, que se lee siempre; la regla se ata al elemento (`a`, `button`) y no a la clase, porque las reglas de 2px del pliego también son `bg-ink` y esas sí deben quedar macizas.
- `.settle` faltaba en el reinicio de impresión y su estado inicial es `opacity: 0` con `blur(3px)` y `fill-mode: both`: imprimir dentro de los primeros 620 ms sacaba la cabecera, el nombre y el veredicto **borrosos y a medio tono**.
- Las hairlines a 1,37:1 se traman hasta desaparecer en una láser. Solo para papel: `rule` a `#9aa3ad`, `rulesoft` a `#c3c9d0`, `coldline` a `#8fabc6`.
- Los contenedores con scroll imprimían solo lo que cabía en su caja (la tabla de datos de la curva salía con tres filas de treinta). `overflow: visible` y `max-height: none` en impresión.
- Sin control de saltos de página: `break-inside: avoid` en artículos, filas y bloques.
- Y como la página promete que cada cifra enlaza a lo que la prueba, en papel el destino se imprime detrás del enlace.

### FALLO-29 — Las cifras que enseña una tarjeta de LinkedIn eran las de la portada

Next **reemplaza** el objeto `openGraph`, no lo fusiona. Las cuatro subpáginas declaraban título y descripción pero no `openGraph`, así que heredaban el del layout entero: pegar `/en/cv` en LinkedIn daba la tarjeta de la portada, con `og:url` apuntando a la portada. Justo en el canal por el que este sitio se reparte. `lib/alternates.ts` gana `openGraph(lang, route, meta)` y las cuatro lo declaran.

También: el `alternates` estaba una sola vez en el layout, así que las cinco rutas de cada idioma anunciaban `/es` y `/en` — las portadas — como su propia traducción; para el buscador `/en/cv` decía "mi versión en español es la portada" y el par se descarta. Ahora viaja con la ruta, con `canonical` y `x-default`. Y sin `title.template`, `/en/projects/trading-sim` se titulaba "Trading Sim — 1,300+ strategies vs. reality": el nombre de la persona no aparecía en la ranura que Google enseña para una búsqueda por nombre.

**Datos estructurados** (`lib/structured-data.ts`): `Person` + `ProfilePage`, todo derivado del diccionario. Lo que resuelve de verdad es el problema de las dos grafías — `alternateName: "Davinson Novoa Ramírez"` —, que hasta hoy el sitio no explicaba en ninguna parte mientras publicaba `Davirson` en el nombre y `Davinson` en el correo, GitHub y Kaggle.

### El camino de contacto

El sitio tenía **cinco `mailto:` pelados y nada más**: sin asunto, sin botón de copiar, sin dirección visible fuera del bloque ámbar, sin contacto en el pie, y con el botón de la barra **oculto por debajo de 640px**. En un portátil corporativo con webmail y sin manejador registrado, un `mailto:` es un clic que no hace nada — sin error, sin ventana, sin nada que reintentar; el lector concluye que el botón está roto. Y en el teléfono, que es donde llega el enlace desde LinkedIn, la barra quedaba con el nombre, el idioma y el tema: la alternativa era bajar 7.200px hasta el cierre.

- `lib/contact.ts` — un solo `mailto:`, con asunto y con los cuatro campos que hacen falta para responder algo útil (rol, empresa, modalidad, rango). Quien escribe desde el móvil no redacta una vacante: rellena huecos.
- `components/CopyEmail.tsx` — no sustituye al `mailto:`, cubre el caso en que es un clic muerto. Si el portapapeles se niega, lo dice y deja la dirección seleccionable en vez de fingir que copió.
- Botón de contacto en la barra **a todos los anchos** (cabe: se midió), dirección en el pie de las cinco rutas, y en el cierre de portada y de CV.

**Las tres preguntas que decidían el reenvío y no se respondían en ninguna parte** — a qué nivel, desde cuándo, por qué vía — entran al bloque ámbar, confirmadas por el usuario: Senior Analyst · preaviso de 15 días · contrato directo (B2B) o EOR, sin patrocinio de visa. Ámbar es su jurisdicción: contratación y disponibilidad son contenido humano, no una cifra.

### Composición

- **El vacío del héroe.** La columna derecha moría 156px antes que la izquierda: un rectángulo de 300×156 de papel en blanco en el cuarto superior derecho de la primera pantalla, la posición más cara del documento. Lo llenan los datos de contratación y el botón de copiar. `sheet.portraitPending` sigue sin usarse; la foto, cuando exista, entra encima del bloque sin tocar la rejilla.
- **1.637px de blanco seguido** en WORK (2.812px en el teléfono, 3,3 pantallas) con una sola hairline dentro. "También en la mesa" pasa a banda a sangre abierta por una regla de 2px de tinta. Las divulgaciones bajan por debajo del cierre — en un pliego van al pie, no entre la evidencia y la conversión — y pasan a `band2` para que las dos bandas neutras no se lean a la misma profundidad.
- **La columna huérfana de 304px.** Tres filas de trayectoria contra ocho de herramientas en un reparto 1,35:1. Una rejilla partida es el instrumento equivocado para dos listas cuyas longitudes no tienen relación: el toolkit corre a todo lo ancho debajo, tres por fila.
- **"Lo que esto demuestra" se borra entero**, del diccionario también. Sus seis entradas repetían una por una las ocho filas del toolkit, con la misma forma tipográfica y a 300px de distancia, y ninguna llevaba prueba. La que sobrevive es la que nombra el artefacto y enlaza a él.
- **El hallazgo publicado sube por encima de las tres salidas.** La mejor frase de la página —un resultado negativo publicado— estaba *debajo* de tres enlaces que se van del sitio.
- **El veredicto pasa a Source Serif 4 600.** A 400 cargaba el 29% de la masa de tinta del nombre y perdía la primera fijación contra un grotesco de 800. El peso 600 ya se pedía en el layout y no se usaba. Debajo, los otros dos nombres que una vacante le da al mismo rol: dos de las tres coincidencias por palabra clave vivían solo en el CV.
- **Las seis secciones del CV** llevaban el mismo paso de 12,5px en versalitas apagadas que un rótulo de campo, mientras sus filas iban a 17-19px en negrita: el título de sección era más pequeño y con menos contraste que su contenido. Por eso 6.000px se leían como una sola hoja gris. Pasan al paso de titular.

### El sistema de diseño contra sí mismo

DESIGN.md dice "no se envía ni una sombra" y llama defecto a cualquiera. **Había dos**, ambas en el atlas. Y seis tarjetas en el laboratorio — con radios de 4px y 6px, sobre fondo teñido y con borde completo — cuando las tarjetas se quitaron de las tres superficies durante la revisión; la del estado de error es la que **se ve** cuando `raw.githubusercontent.com` está bloqueado, es decir, en la red de un banco o una aseguradora. Todas pasan a bloques abiertos: regla de 2px arriba, fondo de banda, esquinas rectas. `animate-pulse` sale con ellas: es un esqueleto de aplicación web y aquí el registro es la imprenta — una hoja no palpita.

También: prosa por debajo del suelo de 14px en seis sitios (notas del atlas, celdas de tabla, tooltip, notas de resultados, la navegación de sección), y un cuarto valor de radio sobre una marca de datos.

**La escala de habilidades se borra de DESIGN.md.** Especificaba diez segmentos de 6px rellenos hasta un nivel declarado; nunca existió en el build, `ProofRow` no tiene campo `level` y `bar-in` solo aparece en las gráficas. Un documento que describe un componente que no está es exactamente cómo pasaron desapercibidas tres sesiones de sombras, tarjetas y prosa a 13px.

### Accesibilidad

- `--color-building` medía **4,44:1** dentro de su propia píldora al 10% — el único sitio donde se usa. A `#805f0f`: 5,9:1 en plano, 5,13:1 en la píldora. El resto de la escala de tokens pasa AA en los dos temas; la auditoría lo calculó par por par y el sistema estaba bien.
- Enlace de salto al contenido: el primer tabulador caía en el conmutador de idioma y luego en cada enlace de la barra, en las cinco rutas.
- Las cuatro bandas de cifras eran un `<dl>` con el `<a>` envolviendo `<dt>` y `<dd>`, con el `<dd>` **antes** que su `<dt>`. Un ancla no es padre válido de ninguno de los dos: el navegador no exponía el par término/definición y la lista de definiciones no definía nada. Pasan a lista simple, con el ancla envolviendo cifra y etiqueta como antes.
- `CountUp` enseñaba durante 1.100 ms un número que no es el de la página; el valor real viaja ahora en paralelo para la asistencia.
- El tooltip de la gráfica era `role="status"` reescrito en cada `pointermove`, inundando la cola de anuncios de un lector que además nunca podía activarlo. El equivalente no visual real ya existía: la tabla del `<details>`.
- `role="tablist"` sin `aria-controls`, sin `tabpanel` y sin flechas — un patrón de pestañas a medias es peor que ninguno. Son botones de alternancia y ahora lo dicen.
- `overflow: hidden` recortaba el anillo de foco del control de vistas del atlas: medio indicador o ninguno en el control principal del mapa.
- El conmutador de idioma fallaba 2.5.3 (nombre accesible "Read in English" sobre texto visible "EN"); el de tema anunciaba la dirección contraria antes de hidratar, teniendo el `data-theme` ya estampado por el script de arranque.

### Rendimiento

**El script del tema iba después del `<link>` de Google Fonts.** Un script clásico en línea no se ejecuta mientras una hoja de estilo bloquea scripts, así que el tema pre-pintado —cuya razón de existir es que una recarga no parpadee en el fondo equivocado— quedaba detrás de una petición a terceros, y detrás de su tiempo de espera cuando un proxy corporativo la bloquea. Se movió arriba. Coste: cero.

**El diccionario entero viajaba dentro del HTML de cada página.** `Navbar` es de cliente (solo por `usePathname`) y recibía `dict`: 45.117 bytes del idioma completo —el CV, la tesis, el laboratorio, el catálogo de Power BI— para pintar 508. La portada enviaba `profileText` y `atlasCopy` a un lector que nunca los ve. Ahora entra solo `nav` y el `mailto:` ya construido. **HTML de portada: 120.631 → 80.957 bytes (−33%)**, verificado.

### Los CV, regenerados

Los dos `.tex` publicados llevaban todavía `Tesis_Fnancial_Inclusion_GDP_Growth_Colombia`, la URL con errata que el commit `def3723` había corregido en el diccionario: el generador lee la fuente única, pero nadie había vuelto a correr `npm run cv`. Y la cabecera llevaba correo, LinkedIn y GitHub y **ninguna forma de volver al sitio** — en un artefacto que PRODUCT define como el que sobrevive a la visita y se reenvía dentro de la empresa. Ambos corregidos y recompilados con tectonic; `.tex` y `.pdf` van juntos en el commit, como manda el script.

### Lo que se decidió NO hacer

- **Ningún formulario de contacto.** La CSP declara `form-action 'self'` y el sitio no tiene backend por diseño. Copiar al portapapeles y un `mailto:` prellenado resuelven el mismo problema sin abrir superficie.
- **Ningún enlace de agenda inventado.** El usuario quiere uno; cuando exista la URL, entra al lado del correo y nunca en su lugar.
- **Ninguna cifra, credencial ni testimonio nuevos.** Todo lo que se añadió es un hecho que el usuario confirmó o un enlace que ya existía sin usarse.

### Pendientes del usuario (nuevos, por orden de impacto)

1. **El hueco de cuatro meses del CV**: la práctica en tesorería termina en jun 2024 y el puesto de analista empieza en oct 2024, dentro de la afirmación "26 meses de practicante a especialista". Es lo primero que revisa un líder de finanzas. Solo tú sabes qué pasó ahí; una línea lo cierra.
2. **Dominio propio.** Ver el análisis de coste más abajo.
3. **Capturas del informe Power BI** en `public/powerbi/`: la página las muestra sola en cuanto existan. Hoy el sitio afirma Power BI unas veinte veces, tiene **cero `<img>` en todo el build**, y a "enséñame un tablero" responde con un instructivo de instalación en cinco pasos.
4. **El enlace de agenda**, si lo quieres cableado.
5. **Regenerar las tarjetas OG** (`scripts/generate-og.py`): dicen "AS OF AUGUST 2026" contra el "September 2026" del sitio, y ahora además el copy de portada cambió.
6. **Confirmar la URL viva de LinkedIn** (sigue de la sesión 14): el sitio publica `/in/davirson-novoa-ramirez-2721641b5`; el texto del enlace ya se deriva de la URL, así que la etiqueta dejó de poder mentir por su cuenta, pero el slug largo se ve.
7. **`/projects/trading-sim` sigue sin sobrevivir a un `raw.githubusercontent.com` bloqueado.** Ninguna cifra del embudo se renderiza en servidor. Es la página de evidencia insignia y en la red de un banco es una caja de error. Se documenta, no se tocó: la solución (una instantánea en build, estampada como instantánea, con la lectura en vivo como mejora progresiva) es un cambio de arquitectura que merece su propia sesión.

---
