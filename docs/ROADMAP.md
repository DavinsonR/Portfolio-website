# Estado y pendientes

*Solo lo que está vivo. La historia está en [`bitacora/`](bitacora/).*
*Última actualización: 23 septiembre 2026.*

## Dónde está el proyecto

| | Estado |
|---|---|
| Sitio | **[davirson.com](https://davirson.com)** · Next.js 16 · estático en Vercel · $0 de hosting + ~$10/año de dominio |
| Dominio | `davirson.com`, Cloudflare Registrar, precio plano. `proyecto-davirson-git.vercel.app` sigue vivo y redirige — **no se apaga**: está en LinkedIn, en correos enviados y en PDF que ya circulan |
| Analítica | Vercel Web Analytics, sin cookies, mismo origen (por eso no hace falta tocar la CSP) |
| CI | `.github/workflows/ci.yml` — lint, tipos, paridad del diccionario, artefactos del CV, cifras, `npm audit`, `.tex` y figura del atlas al día, build y humo de rutas (con tarjetas OG y Twitter y los ocho redirects con su código) |
| Repositorio | `main` protegida: exige el check `verify` en verde y no admite force-push (el trabajo va en rama y se fusiona, o se empuja con `git push origin rama:main` cuando CI ya pasó). Dependabot activo (alertas y parches). `davirson.com` enviado a la lista de precarga HSTS el 23 sep 2026: estado `pending` hasta que Chromium lo incorpore |
| Idiomas | ES y EN completos, 7 rutas por idioma |
| Proyectos en la mesa | tesis de inclusión financiera · plataforma de datos de mercado · informe Power BI · demo de riesgo de crédito en el navegador · JARVIS (privado) |

## Pendientes

### Del sitio

- [x] ~~FALLO-29~~ — `check:routes` exige que el `og:url` de cada página coincida con su canonical; verificado quitándole el `openGraph` al CV (lo detecta en los dos idiomas).
- [x] ~~El `height="auto"` del SVG del atlas~~ — pasa al estilo; cero errores de consola y la proporción se mantiene exacta.

- [ ] **[Auditoría del 23 sep 2026](AUDITORIA-2026-09-23.md)** — cinco expertos, 46 hallazgos consolidados, seis sesiones. Las **sesiones 1 a 5 están ejecutadas** el mismo día: [sesión 18](bitacora/sesion-18.md) (P0), [sesión 19](bitacora/sesion-19.md) (cifras vivas del laboratorio, PDF de una página, `check:figures` ampliado), [sesión 20](bitacora/sesion-20.md) (conversión: cuatro cifras, ocho herramientas, banda de contacto en seis rutas, CV en el pie, ATS) [sesión 21](bitacora/sesion-21.md) (diseño y accesibilidad: foco, texto de gráficos en el teléfono, `border-control`, estados anunciados, una medida de columna, el 404 con `main`) y [sesión 22](bitacora/sesion-22.md) (ingeniería: caché para `public/`, serif a la mitad, atlas diferido, JSON-LD y títulos a medida en todas las páginas). Queda la sesión 6 (la red: `check:weight`, `tsc` para `scripts/`, Lighthouse CI, Vitest, higiene del repositorio), las capturas del informe de Power BI, las seis decisiones del §7 (pieza FP&A, foto, orden de JARVIS, `/` en 307 o 308, el serif de `historia`, plataformas cloud) y una cifra que solo el autor puede resolver: JARVIS dice **34 tablas** en la banda y **«treinta y tres»** en la prosa (CO-09); `check:figures` ya entiende números escritos con letra, así que el día que se fije basta una línea en `CLAIMS`.
- [ ] **La escala divergente del atlas ya no divide.** En 2024–25 no hay prácticamente valores negativos y media rampa queda muerta. Decisión analítica del autor, señalada en la [sesión 17](bitacora/sesion-17.md) y no ejecutada.
- [ ] **En oscuro, el panel de 2018 pierde contraste.** Coherente con la regla del tema re-escalonado; subir `--atlas-mid` afectaría también al atlas interactivo. Señalado, no ejecutado. La sesión 21 subió el **contorno** departamental de la figura a `--color-control` (3,64:1) en vez de tocar `--atlas-mid`: el escalón neutro sigue siendo un problema de rampa, en claro (1,14:1 contra papel) y en oscuro.
- [x] ~~El laboratorio moría en redes que bloquean `raw.githubusercontent.com`~~ — instantánea versionada del índice en `public/trading-sim-snapshot/`, servida del mismo origen, con nota de procedencia. `npm run snapshot` la refresca. Verificado apuntando el host en vivo a un dominio inválido: la página enseña el laboratorio entero, no un error.
- [x] ~~**CV de una página**~~ — `*_1p.pdf` y `*_1p.tex` del mismo `lib/content/cv.ts`, con la regla de recorte escrita en `buildOnePage()` y no decidida a ojo. `check:artifacts` cuenta las páginas y falla si son dos.
- [ ] Verificación semanal de los enlaces externos (3 repos y una demo) en CI.

### De organización

- [x] ~~`lib/` mezclaba cuatro cosas en un nivel~~ — ahora `lib/config/`, `lib/content/`, `lib/data/` y `lib/generated/`, con `lib/dictionaries.ts` como puerta que re-exporta, de modo que nadie tuvo que cambiar sus imports.
- [x] ~~`lib/dictionaries.ts` pesaba 164 KB~~ — partido en cuatro bloques de `lib/content/` por rangos contiguos, verificado comparando `JSON.stringify(dictionaries)` carácter a carácter: 159.642 = 159.642, orden de claves incluido.
- [x] ~~Las capturas de `public/tracking/`~~ — a WebP: 201 KB → 104 KB, y como esas `<Image>` van `unoptimized`, el ahorro lo nota el visitante, no solo el repo.

- [ ] **`public/credit-risk-demo/model.onnx` sigue con sus 1,88 MB versionados, y se queda.** La idea era sacarlo con Git LFS, pero **Vercel no resuelve punteros de LFS en el build**: el fichero llegaría como puntero de texto y la demo moriría con un error de ONNX en el navegador, sin avisar en el build. Servirlo desde otro origen tampoco sale gratis: habría que abrir `connect-src` en la CSP de esa ruta y añadir una dependencia de red a una demo que hoy corre contra su propio origen. **Se revisa el día que el modelo se regenere**, que es cuando el coste empieza a acumularse de verdad; hoy `.git` pesa 4 MB y no duele.
- [ ] `components/` son 12 archivos sueltos junto a 4 carpetas. Se dejó así: a este tamaño, agruparlos es mover ficheros sin que nadie encuentre nada mejor.

### De contenido

- [x] ~~**`/[lang]/historia`**~~ — escrita y publicada; esta línea siguió diciendo «nunca escrita» hasta que la auditoría del 23 sep la leyó.
- [ ] Una nota escrita por proyecto: el hallazgo del nulo en la tesis (está: `/historia` §03), el sesgo de look-ahead del backtester (está: `tradingSim.method`), y **por qué la demo de crédito corre en el navegador** (falta: hoy se dice qué hace, no por qué se decidió así).

## Reservado

Lab de experimentos · blog · ventures · comunidad. Nada de esto se abre sin una necesidad real; están anotados para que no se reinventen.
