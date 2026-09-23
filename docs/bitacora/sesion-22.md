## Sesión 22 — 23 sep 2026 · Ingeniería: caché para lo que no cambia, un serif a la mitad, el atlas que baja con sus datos, y una página que dice al buscador qué es

Sesión 5 del plan de la [auditoría](../AUDITORIA-2026-09-23.md). Encargo: «continúa hasta terminar».

### La medida antes de opinar

Next sirve todo `public/` con `max-age=0, must-revalidate`: las dos fuentes precargadas, el modelo de 1,9 MB y los 1,8 MB del atlas se revalidaban en cada visita, un RTT por activo y en la ruta crítica del render en el caso de las fuentes. El serif pesaba 122 KB y se precargaba en las diez rutas para usarse en dos. El renderizador del atlas (d3 + topojson, 66 KB crudos) bajaba con la página aunque sus datos sí esperaban a la puerta de 600 px. Siete de ocho títulos superaban los 60 caracteres que enseña Google. Ninguna subpágina llevaba datos estructurados.

### Lo que se hizo

- **Caché para `public/`** (`next.config.ts`): fuentes y `model.onnx` inmutables un año (si cambian, se renombran); atlas e instantánea una hora con revalidación en segundo plano; tarjetas, iconos y capturas una semana; PDF un día. `check:routes` exige que una fuente lleve `max-age` real.
- **El serif a la mitad**: 122 → **69 KB**. El fichero traía la variable entera (peso 200–900, tamaño óptico 8–60) y el sitio la usa a 400–600 y entre 18 y 48 px. Instancia parcial con fontTools a ese rango exacto, más subset al `unicode-range` declarado: misma tipografía en todo lo que se ve, la mitad de bytes. (Pinar el tamaño óptico en un solo valor la dejaba en 33 KB, pero eso sí cambia el dibujo; no se hizo.) Y la precarga sale del layout: solo la portada y el CV la declaran, que es donde el serif aparece sobre el pliegue.
- **El atlas baja con sus datos** (IR-05, la mitad de FALLO-30 que quedó abierta): `render.ts` se pide con `import()` en el mismo `Promise.all` que los JSON, una vez por sesión. El JS que referencia el HTML de la tesis pasa a ser el mismo que el de la portada.
- **JSON-LD en las siete subpáginas** (`pageGraph`): `WebPage` + `BreadcrumbList` y el nodo que corresponde —`SoftwareSourceCode` con su repositorio para credit-risk, el laboratorio y Power BI; `SoftwareApplication` con su demo para JARVIS; `ScholarlyArticle` para la tesis; `Article` para la historia—, todo con el título y la descripción de la propia página. La portada gana un nodo `WebSite`. `og:locale:alternate` en todas; `rel="me"` en los cinco enlaces a perfiles de la portada; `theme_color` por esquema.
- **Títulos y descripciones a la medida del SERP**: la plantilla añade 25 caracteres con el nombre, así que el título propio cabe en 35 y el total en 60; las descripciones en 155. Doce títulos y catorce descripciones reescritos en los dos idiomas. `check:routes` lo exige desde ahora, contando las entidades como un carácter.
- **Sin fechas congeladas en el build**: el sitemap deja de decir «modificado hoy» en las 16 URL (una señal que el buscador aprende a ignorar) y el pie deja de llevar un año que caducaba cada 1 de enero.
- **Higiene medida**: `prefetch={false}` en el conmutador de idioma y en el pie (Next precargaba la ruta entera del otro idioma en cada página); `will-change` solo mientras el revelado está pendiente; la retícula de la cabecera deja de medir el DOM en cada `pointermove`; cuatro exports muertos fuera; los cinco SVG de la plantilla de `create-next-app` y el README de `public/powerbi/` fuera de lo que se sirve; `x-powered-by` apagado; `browsing-topics=()` y `Cross-Origin-Opener-Policy`.
- **`<img>` en vez de `next/image`** (D-33): con `unoptimized` el componente no convertía, ni redimensionaba, ni generaba `srcset`; solo enviaba su runtime por cada ruta con una imagen. Son WebP con medidas y `loading="lazy"`.
- **La demo de crédito**: `contract.json` con `AbortController` y 12 s, `res.ok`, el modelo con 30 s de límite, y el `submit` en `try/catch` con la banda por defecto si el tensor no tiene la forma esperada. Antes una red que bloquea sin cerrar dejaba «cargando…» para siempre, el estado que `trading-sim.ts` ya llamaba «el peor posible». No se autoaloja el runtime de ONNX: el `.wasm` son ~10 MB, y versionarlos es la misma cuenta que el ROADMAP ya rechazó para el modelo.
- **La CSP de desarrollo** admite los `<style>` de HMR y el script de depuración de Vercel: la consola de `next dev` estaba llena de violaciones que tapaban los errores reales. La política publicada no cambia.

### Lo que se verificó

`npm run check` en verde. `npm run build` en verde. Contra `next start`: `check:routes` en verde con las tres comprobaciones nuevas (título ≤ 60, descripción ≤ 155, fuente con caché); las cabeceras medidas: fuentes y modelo `immutable`, atlas `max-age=3600`, PDF `86400`, `x-powered-by` ausente, COOP `same-origin`, `browsing-topics` presente; JSON-LD válido en las 16 rutas con los tipos previstos; la precarga del serif solo en `/` y `/cv`; `og:locale:alternate` en las 16; cinco `rel="me"` en la portada; cero `<lastmod>`; el JS referenciado por la tesis igual al de la portada. El script de la demo pasa `node --check`.

### Lo que queda de la dimensión

- CAA y DNSSEC en Cloudflare (SR-06, SR-07): dos clics en el panel, que solo el autor puede dar.
- Los nueve `as any` en la costura topojson↔d3-geo (IR-16) y las doce claves de lista por índice (IR-26).
- `stamp.json` en el pipeline (IR-04): la portada sigue pidiendo el índice entero, aunque ya una sola vez.
