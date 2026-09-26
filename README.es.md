# Davirson Novoa — Finance Data Analyst

*[Read in English](README.md)*

Sitio personal bilingüe (ES/EN) y punto de entrada a cinco proyectos con código abierto y datos en vivo: un sistema de decisión crediticia con gobierno de modelos, una investigación econométrica, un laboratorio interactivo de pronóstico macro para América Latina, una plataforma de datos de mercado y una app de registro diario.

### ▶ [davirson.com](https://davirson.com)

No es un portafolio de capturas: cada página del sitio se alimenta del repositorio que la sostiene, y cada cifra que aparece se puede rastrear hasta el commit que la produjo.

## Qué hay dentro

| Proyecto | En el sitio | Repositorio | Estado |
| --- | --- | --- | --- |
| **Decisión crediticia con gobierno de modelos** — LightGBM sobre 1,96 M de préstamos SBA y 62,4 M de solicitudes HMDA, diez gates que bloquean (uno bloquea el modelo del propio autor) y un demo que puntúa en el navegador | [`/es/projects/credit-risk`](https://davirson.com/es/projects/credit-risk) | [credit-risk-mlops](https://github.com/DavinsonR/credit-risk-mlops) | Desplegado, puntuando en el navegador |
| **Inclusión financiera y crecimiento regional** — warehouse de 19 fuentes públicas, índice por dimensiones, panel de efectos fijos y atlas de los 1.123 municipios | [`/es/research/fintech-inclusion`](https://davirson.com/es/research/fintech-inclusion) | [financial-inclusion-colombia](https://github.com/DavinsonR/financial-inclusion-colombia) | Resultado principal publicado |
| **Laboratorio de pronóstico macro en LATAM** — trece modelos contra el pronóstico ingenuo en 20 economías, con Diebold-Mariano, Holm y Wilcoxon; el visitante juega contra el ingenuo y mueve el backtest | [`/es/labs/macro-forecast`](https://davirson.com/es/labs/macro-forecast) | [macro-forecast-lab-latam](https://github.com/DavinsonR/macro-forecast-lab-latam) | v1.1.0 publicada, laboratorio abierto |
| **Plataforma de datos de mercado** — APIs públicas → medallion en Postgres con dbt → backtester sin look-ahead → refresh diario automatizado | [`/es/projects/trading-sim`](https://davirson.com/es/projects/trading-sim) | [market-data-medallion](https://github.com/DavinsonR/market-data-medallion) | 48 activos, refresh diario |
| **Informe Power BI** — modelo, medidas y páginas del informe construido sobre la capa gold | [`/es/projects/powerbi`](https://davirson.com/es/projects/powerbi) | catálogo en `lib/data/powerbi-model.ts` | Catálogo publicado |
| **JARVIS** — Postgres multiusuario con seguridad por fila en 34 tablas, 526 pruebas y un demo público que nunca toca la base | — | privado; [demo público sin cuenta](https://jarvis-app-psi-sable.vercel.app/demo) | v1 en uso |

## El CV

`/[lang]/cv` publica el CV completo en las dos lenguas. El texto vive una sola vez en `lib/content/cv.ts`; de ahí salen la página, la fuente LaTeX y el PDF. Editar el diccionario y correr `npm run cv` regenera los tres: no hay una versión del CV que pueda quedarse atrás de otra.

## Cómo está hecho

Next.js 16 (App Router) · React · TypeScript · Tailwind v4 · Vercel. Todo estático: sin backend y sin base de datos. Los datos del laboratorio de mercado entran como JSON exportado por el pipeline, no por una consulta en tiempo de render. Costo de operación: $0.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000 → redirige a /en
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run check` | Lint, tipos (app y scripts), pruebas, paridad del diccionario, artefactos del CV y consistencia de cifras — lo que corre CI (CI corre además `npm audit`, el build, el presupuesto de peso, el humo de rutas y Lighthouse) |
| `npm test` | `node --test` sobre `tests/`: la regex de CountUp contra los valores reales del diccionario, la derivación de las cifras del laboratorio, las series de crédito y la caída a la instantánea |
| `npm run check:weight` | Peso brotli por ruta contra un presupuesto versionado; necesita un build |
| `npm run check:routes` | Humo de rutas contra un `next start` levantado |
| `npm run lint` | ESLint con la configuración de Next |
| `npm run latex` | Regenera `public/*.tex` desde el diccionario |
| `npm run cv` | Lo anterior y además compila a PDF si hay tectonic/latexmk/xelatex/pdflatex |
| `npm run icons` | Regenera `favicon.ico`, `apple-icon.png` y `public/icon-*.png` desde `app/icon.svg` (necesita Pillow) |

### Dónde editar

- **Todo el texto (ES/EN):** `lib/content/` — seis bloques (`home`, `projects`, `about`, `cv`, `historia`, `error`), cada uno con `es` y `en` uno al lado del otro. `lib/dictionaries.ts` solo los ensambla.
- **Colores y tipografías:** `app/globals.css`, bloques `@theme`.
- **Estado y progreso de los módulos:** `lib/content/home.ts` → `sistema.modules`.
- **Catálogo de Power BI:** `lib/data/powerbi-model.ts`, copiado de `market-data-medallion/powerbi/` con el commit de origen en la cabecera.

## Licencias

- **Código** (la aplicación, los componentes, los scripts): MIT. Ver [`LICENSE`](LICENSE).
- **Datos del atlas** (`public/atlas/`): CC BY-SA 4.0, heredada de la Superintendencia Financiera. La cláusula ShareAlike obliga a publicar el derivado bajo la misma licencia. Ver `DATA-LICENSE.md`.
- **Tipografías** (`public/fonts/`): Archivo y Source Serif 4, SIL OFL 1.1, autoalojadas. Ver `public/fonts/OFL.txt`.
- **CV, currículo y capturas**: contenido biográfico, todos los derechos reservados. No entra en la MIT.

## Documentación

| | |
| --- | --- |
| [`docs/FALLOS.md`](docs/FALLOS.md) | Todos los fallos que este proyecto ya tuvo, numerados desde FALLO-01, en una tabla, cada uno enlazado a su causa raíz. **Empieza por aquí.** Más de la mitad son del pipeline de datos, no de este repo — la tabla lo dice. |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | Las decisiones, numeradas desde D-01, y dónde está el porqué. Varias parecen arbitrarias y no lo son. |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Estado actual y lo que queda. |
| [`docs/DESIGN.md`](docs/DESIGN.md) · [`docs/PRODUCT.md`](docs/PRODUCT.md) | El sistema visual y el posicionamiento. Vinculantes, no descriptivos. |
| [`BITACORA_MAESTRA.md`](BITACORA_MAESTRA.md) | El índice; la narrativa completa, sesión por sesión, en `docs/bitacora/`. |
