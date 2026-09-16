# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Sitio personal bilingüe de Davirson Novoa: un CV interactivo y las páginas de sus proyectos.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · estático puro en Vercel, sin backend ni base de datos.

**Lee [`docs/FALLOS.md`](docs/FALLOS.md) antes de tocar nada**: los 33 fallos que este proyecto ya tuvo, en una tabla, con su causa raíz enlazada. Está ordenado por ámbito — más de la mitad son de `market-data-medallion` y no de aquí, así que si vienes al sitio, filtra y ahórrate veinte. Al lado están [`docs/DECISIONES.md`](docs/DECISIONES.md) (por qué algo que parece arbitrario no lo es) y [`docs/ROADMAP.md`](docs/ROADMAP.md) (estado y pendientes). [`BITACORA_MAESTRA.md`](BITACORA_MAESTRA.md) es hoy el índice de todo eso; la narrativa completa, sesión por sesión, vive en `docs/bitacora/`.

`docs/DESIGN.md` y `docs/PRODUCT.md` no son documentación descriptiva sino el contrato del sistema visual y del posicionamiento; varias de sus reglas son vinculantes y romperlas ya ha sido un hallazgo de revisión.

## Comandos

```bash
npm run dev          # http://localhost:3000 → redirige a /en
npm run check        # ← lo que hay que correr: lint + tipos + paridad + artefactos
npm run build        # compilación de producción; prerenderiza las rutas de los dos idiomas
npm run check:routes # humo de rutas contra un `next start` ya levantado
npm run latex        # regenera public/*.tex desde lib/dictionaries.ts
npm run cv           # latex + compila el PDF si hay tectonic/latexmk/xelatex
npm run atlas        # regenera lib/atlas-figure.ts desde public/atlas/*.json
npm run icons        # regenera favicon.ico, apple-icon.png y public/icon-*.png (necesita Pillow)
```

**No hay framework de pruebas, pero sí tres comprobaciones**, y `.github/workflows/ci.yml` las corre en cada PR y en cada push a `main`. Verificar un cambio es `npm run check` y `npm run build` en cero, y después mirarlo en un navegador en tema claro y oscuro, en español y en inglés. Para lo visual conviene medir en vez de opinar: desborde horizontal a 320/393/768/1280 px, contraste, y cero errores de consola.

Qué cubre cada una, y por qué existe:

- **`check:dict`** — recorre `es` y `en` y exige la misma forma. Cubre los dos huecos que `tsc` deja: las **longitudes de array** (añadir una divulgación en un idioma y no en el otro compila sin una queja — medido) y las cadenas vacías. Y cuando algo falta, nombra la ruta exacta (`cv.experience[2].bullets`) en vez del componente que la consume.
- **`check:artifacts`** — descomprime los streams de los PDF del CV y exige que mencionen el host de `SITE`. Existe por un fallo real del 16 sep 2026: el sitio se mudó de dominio, el `.tex` se actualizó y el PDF se quedó con el host anterior impreso dentro. Un PDF es opaco, `grep` no lo ve, y nada lo notó.
- **`check:routes`** — lee las rutas del `sitemap.xml` publicado (no de una lista copiada, que se desincroniza) y comprueba 200; más los redirects de idioma y los 404 que tienen que serlo. La bitácora registra **dos rutas que devolvían 200 debiendo ser 404** y un redirect que faltaba, encontrados a mano meses después.

Las tres saben fallar: se verificó rompiendo el diccionario y volteando una aserción, y las dos veces salieron con código 1.

## Arquitectura

### Todo el texto vive en un solo archivo

`lib/dictionaries.ts` es la fuente única de verdad de cada cadena del sitio, en `es` y `en`. No hay texto literal en los componentes.

```ts
export type Dictionary = (typeof dictionaries)["es"];
```

De ahí sale el invariante más importante del repositorio: **los objetos `es` y `en` deben tener exactamente la misma forma**. Añadir una clave a uno y no al otro no se nota hasta `tsc`, y ahí falla en el componente que la consume, no donde está el hueco. **Y hay dos divergencias que `tsc` no ve: las longitudes de array y las cadenas vacías** — añadir una divulgación en español y no en inglés compila limpio. La prueba de que la traducción está completa es `npm run check:dict`, no `tsc`.

Los PDF y las fuentes LaTeX del CV se generan de ese mismo archivo (`scripts/generate-cv-latex.ts`), así que tocar el bloque `cv` obliga a `npm run cv` para que el PDF descargable no contradiga la página.

### Añadir una ruta toca cinco sitios

Olvidar cualquiera deja un fallo silencioso, y varios ya ocurrieron:

1. `app/[lang]/<ruta>/page.tsx` — la página.
2. `lib/dictionaries.ts` — su bloque de contenido, **en los dos idiomas**.
3. `generateMetadata` de esa página — `alternates(lang, "/ruta")` **y** `openGraph(lang, "/ruta", …)` de `lib/alternates.ts`. Next **reemplaza** el `openGraph`, no lo fusiona: una subpágina que no lo declara hereda el del layout y su tarjeta en LinkedIn enlaza a la portada.
4. `app/sitemap.ts` — la constante `ROUTES`.
5. `next.config.ts` — el redirect de la ruta sin idioma (`/x` → `/en/x`); sin él esa URL devuelve 404.

Las páginas son componentes de servidor `async` que reciben `params: Promise<{ lang: string }>` y leen su contenido con `getDictionary(lang)`.

**El 404 es uno solo y vive en la raíz.** `app/not-found.tsx` atiende *toda* ruta sin match: con `dynamicParams = false` ni `/pricing` ni `/es/loquesea` entran en el segmento `[lang]`, así que **un `app/[lang]/not-found.tsx` es código muerto** — se escribió, se midió que nunca se alcanzaba, y se borró. Ahí no hay layout (el root layout vive dentro de `[lang]`, que es el patrón de i18n de App Router), así que esa página importa su propia hoja de estilo y se pinta entera sola. Tampoco hereda idioma: publica los dos y un script en línea fija `data-only` desde el primer segmento de la URL para tachar el que sobra. En `/pricing` no fija nada y se quedan los dos, porque ahí el idioma del visitante es justo el dato que no existe.

### Cambiar el dominio toca tres sitios, y uno no es código

`lib/site.ts` es la fuente única de la URL: de ahí salen `robots.ts`, `sitemap.ts`, `alternates.ts` y el `metadataBase` del layout. Pero cambiar esa constante **no basta**:

1. `lib/site.ts` — la constante `SITE`. Después, `grep -rn "vercel.app" .` no debe devolver nada fuera de `node_modules`, `.next` y la bitácora.
2. **`npm run cv`** — el PDF y el `.tex` descargables llevan la URL *impresa dentro*. Sin regenerarlos, el CV que el lector se lleva apunta al dominio viejo y contradice a la página. Es el fallo silencioso clásico de este cambio.
3. `README.md` y `README.es.md` — los enlaces del encabezado y de la tabla.

El dominio anterior no se apaga nunca: está en LinkedIn, en correos ya enviados y en los PDF que ya circulan. Se deja redirigiendo.

### El revelado al desplazar, y por qué importa al verificar

`components/Motion.tsx` monta un único `IntersectionObserver` de documento. Los elementos con `data-reveal` y la clase `.reveal` empiezan en `opacity: 0` y se revelan al entrar en pantalla; el escalonado va por la propiedad `--d`, que un componente de servidor puede fijar sin volverse cliente.

Tres salvaguardas que no se pueden romper: el estado oculto vive dentro de `.js`, que fija el script de arranque de `app/[lang]/layout.tsx` antes del primer pintado; un temporizador de 3 s revela todo si el bundle nunca corre; y `@media print` fuerza todo visible.

**Consecuencia al verificar**: una captura de página completa sale casi en blanco, porque nada llegó a intersectar. Hay que desplazar hasta abajo antes de capturar, y desactivar `scroll-behavior: smooth` si se toman capturas por sección.

### La CSP no admite hashes

`next.config.ts` declara `script-src 'unsafe-inline'` a propósito, y su comentario explica por qué: el payload RSC de hidratación es distinto en cada página y cambia con cada edición del diccionario, así que una CSP por hash exigiría regenerarlos en cada commit y `headers()` se evalúa antes de renderizar. **En cuanto se declara un hash, el navegador ignora `'unsafe-inline'` y la hidratación muere.** No se pueden mezclar. Lo que esa CSP sí compra es `default-src 'none'` y un `connect-src` acotado.

### Sin backend, y tres contratos de datos externos

- **Trading sim** (`lib/trading-sim.ts`): lee `exports/*.json` del repositorio público `market-data-medallion` desde `raw.githubusercontent.com`, en el navegador y con tiempo límite. Un fallo de red enseña el error y ofrece reintentar; nunca se queda en «cargando».
- **Atlas** (`components/atlas/`, `public/atlas/*.json`): el contrato con el repositorio de la tesis (`financial-inclusion-colombia`) es su carpeta `atlas/data/`, copiada a `public/atlas/`. El SVG se dibuja fuera de React en `render.ts` porque la vista municipal son más de 5.000 nodos; React solo posee los controles. `lib/atlas-figure.ts` es **generado** por `npm run atlas` — no se edita a mano.
- **Catálogo Power BI** (`lib/powerbi-model.ts`): copiado a mano de `market-data-medallion/powerbi/`, con el commit de origen en su cabecera; al actualizarlo, actualizar también ese commit.

### Diseño: leer `docs/DESIGN.md` antes de tocar estilos

Los tokens viven en los bloques `@theme` de `app/globals.css`, con el tema oscuro re-escalonado contra su propio fondo. Las reglas que rompen el sistema si se ignoran:

- **La reserva del ámbar.** El acento cálido es solo para contenido humano y de propósito (disponibilidad, contratación, el pasaje de transición). Toda cifra, métrica o afirmación técnica va en azul institucional o en tinta. Un número en ámbar es un defecto.
- **Hoja plana.** Ni sombras, ni tarjetas, ni degradados. Una región se separa con una regla de 1–2 px y un fondo teñido a sangre, nunca con una caja redondeada flotante.
- **El serif es una cifra.** Source Serif 4 solo en números grandes y en la línea de veredicto. Un párrafo, un título o un botón en serif no existen aquí.
- **Suelo de 14 px** para toda prosa. El escalón de 12–12,5 px es solo para etiquetas de metadatos en versalitas.
- **Dos voces.** Un color nuevo sale de los tokens de estado que ya existen (`pos`, `neg`, `live`, `building`); no se inventa un tercer acento.

`components/StatusPill.tsx` acepta solo `live | building | research | idea`. `components/SectionNav.tsx` es la navegación pegajosa de las páginas largas y su resaltado asume `scroll-mt-[118px]` en las secciones.

### Contenido: verificable o no se publica

`docs/PRODUCT.md` recoge la evidencia real disponible. Ninguna cifra publicada puede inventarse ni inflarse, los indicadores de estado tienen que reflejar la realidad incluido lo que no está terminado, y `lib/structured-data.ts` no puede afirmarle al buscador nada que el lector no pueda verificar en la propia página. Cuando una capacidad no está viva —una cuenta que todavía no se puede crear, un repositorio privado— la página lo dice en vez de ofrecer un enlace roto.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
