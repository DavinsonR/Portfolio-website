<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## Sesión 17 — 7 sep 2026 · El atlas sale del fondo: una figura estática en la portada, y la deriva que explica el nulo

Encargo del usuario: «me encanta el atlas y siento que está al fondo de todo, hay que darle más visibilidad a un gráfico hermoso como lo es ese».

### La medida antes de opinar

El atlas arrancaba a **2.820px de una página de 7.489** en escritorio y a **4.608 de 12.349** en el teléfono — cinco pantallas y media — dentro de una ruta que ya está a dos clics de la portada. Es el artefacto más bonito del sitio y no lo veía nadie. En paralelo, la portada tenía **cero imágenes en todo el build** mientras el sitio afirmaba trabajo visual una veintena de veces.

### El hallazgo que decidió la forma

Al mirar la distribución del índice compuesto por año apareció lo siguiente:

| año | mediana | departamentos bajo cero |
|---|---|---|
| 2018 | −0,02 | 17 de 32 |
| 2021 | +1,20 | 4 de 33 |
| 2025 | +2,47 | 1 de 32 |

El índice está estandarizado contra 2018: **todo el país subió a la vez**. Esa deriva común es exactamente la razón de que el coeficiente se caiga a cero al añadir efectos de tiempo — la especificación con solo efectos de entidad la recoge y publica un +0,0242 con p < 0,001 que no significa nada. **El mapa es el argumento del resultado nulo**, y contarlo con dos paneles en la misma escala lo dice sin una sola tabla. Escalar cada panel contra sí mismo lo escondería, así que la escala es una y está agrupada.

Eso resolvió de paso lo que un revisor externo había señalado el mismo día: que la tesis no aparece en ninguna de las cuatro cifras del hero y que el encabezado de resultados lidera con el nulo en vez de con la comparación.

### D-31 · Figura estática, no el atlas interactivo

Llevar el atlas entero a la portada cuesta 258 KB de JSON (92 comprimidos) más d3 y topojson, y se piden al hidratar. La figura son **14,1 KB gzip, cero JavaScript**, y se imprime — que es más de lo que hace el interactivo.

`scripts/generate-atlas-figure.mjs` la genera desde `public/atlas/` con d3-geo y topojson-client, que ya eran dependencias. Se corre a mano con `npm run atlas` y su salida se versiona, igual que el `.tex` y el `.pdf` del CV: el build no depende de la red ni del script.

Tres decisiones que costaron su medición:

- **Douglas-Peucker sobre coordenadas ya proyectadas**, no en grados: el mismo error angular pesa distinto arriba y abajo del mapa. A 0,8px sobre un panel de 300px los puntos caen de 29.781 a ~1.500 y el ojo no lo nota. Sin simplificar, el SVG eran **232 KB**.
- **La geometría se declara una vez en `<defs>` y cada panel la referencia con `<use>`.** Next serializa el árbol del servidor dos veces —HTML y payload de hidratación—, así que con dos paneles cada byte se paga cuatro veces: medido, **+26,7 KB gzip** en la portada. Con `<use>`: **+14,1 KB**. El SVG bajó de 62,5 KB a 17,5.
- **El trazo va en `--color-coldline`, no en papel.** Sobre la banda fría el paso neutro de la rampa (#edf0f3) y el fondo (#e6eef7) se diferencian en 1,05:1: el panel de 2018, que es casi todo neutro, desaparecía de la página. Y por lo mismo la figura **no lleva banda `coldsoft`**: la de cifras que va justo encima ya la lleva, y dos tintes iguales seguidos se leen como una sola mancha azul de 500px. Regla de 2px fría sobre papel.

Los rellenos salen como `var(--atlas-*)`, los mismos tokens del atlas interactivo: el SVG es estático pero sigue el tema, lo alcanza el bloque de impresión que fuerza los fondos exactos —cosa que un `<img>` no permitiría— y las dos superficies no pueden desincronizarse porque leen la misma rampa.

### FALLO-30 — La carga diferida del atlas no difería nada

El nivel municipal (1,55 MB) sí estaba correctamente diferido desde su sesión. El departamental —258 KB— se pedía **al hidratar la página**, bajara o no el lector hasta el mapa.

Al poner el `IntersectionObserver` apareció que no bastaba con el primer efecto: hay un segundo (`if (bundles[level] || failed) return;`) que pedía el nivel departamental por su cuenta en el montaje, porque `bundles[level]` está vacío y `failed` es falso. Con solo el primero protegido, la medición seguía mostrando las dos peticiones sin scroll. Protegidos los dos, y añadida la condición de que el nivel departamental espere a `meta`, la traza pasa de **cinco peticiones con duplicados** a **cero sin scroll y tres al acercarse**.

El estado nace abierto donde no hay `IntersectionObserver` — un navegador viejo debe ver el mapa, no un hueco — y eso se deriva en el inicializador del `useState`, no en un efecto: la regla `set-state-in-effect` que esta base ya respeta lo habría marcado, y con razón.

### El atlas, dentro de su propia página

Sube por delante de datos, índice y econometría, justo después del resumen, y la navegación de sección se reordena con él. Quien llega desde la figura de la portada viene a ver el mapa, no a leer la construcción del índice antes de llegar a él. Medido después: de 2.820px a **1.201px**.

### Lo que no se tocó, y por qué

**La escala divergente ya no divide.** En 2024 y 2025 no hay prácticamente valores negativos, así que la mitad roja de la rampa queda vacía y un año suelto en el atlas interactivo se lee como «todo bien». En el par 2018/2025 eso es una virtud porque es el hallazgo; en el selector de año del atlas es una rampa desperdiciada. Cambiarlo es una decisión analítica del autor, no cosmética: queda señalado, no ejecutado.

**En oscuro el panel de 2018 pierde contraste** contra el fondo, porque el tono neutro se retira hacia la tierra — que es lo que manda la regla del tema oscuro re-escalonado. Es coherente con el sistema y subir `--atlas-mid` afectaría también al atlas interactivo. Queda señalado.

### Estado

`npm run build` ✓ · `npm run lint` ✓ (cero errores) · `tsc --noEmit` ✓ · 17 rutas · las dos rutas de idioma a 200 · figura presente en ES y EN · orden de secciones verificado (resumen → atlas → datos → índice → resultados) · rellenos como tokens en el HTML servido.
