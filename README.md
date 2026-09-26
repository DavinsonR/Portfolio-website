# Davirson Novoa — Finance Data Analyst

*[Leer en español](README.es.md)*

Bilingual personal site (EN/ES) and the entry point to five projects with open code and live data: a credit-decisioning system with model governance, econometric research, an interactive macro-forecasting lab for Latin America, a market data platform and a daily tracking app.

### ▶ [davirson.com](https://davirson.com)

Not a portfolio of screenshots: every page on the site is fed by the repository behind it, and every figure it shows traces back to the commit that produced it.

## What is inside

| Project | On the site | Repository | Status |
| --- | --- | --- | --- |
| **Credit decisioning with model governance** — LightGBM over 1.96M SBA loans and 62.4M HMDA applications, ten gates that block (one blocks the author's own model), and a demo scoring in the browser | [`/en/projects/credit-risk`](https://davirson.com/en/projects/credit-risk) | [credit-risk-mlops](https://github.com/DavinsonR/credit-risk-mlops) | Deployed, scoring in the browser |
| **Financial inclusion and regional growth** — a warehouse of 19 public sources, an index by dimension, a fixed-effects panel and an atlas of all 1,123 municipalities | [`/en/research/fintech-inclusion`](https://davirson.com/en/research/fintech-inclusion) | [financial-inclusion-colombia](https://github.com/DavinsonR/financial-inclusion-colombia) | Main result published |
| **Macro forecasting lab across LATAM** — thirteen models against the naive forecast in 20 economies, with Diebold-Mariano, Holm and Wilcoxon; visitors play against naive and move the backtest | [`/en/labs/macro-forecast`](https://davirson.com/en/labs/macro-forecast) | [macro-forecast-lab-latam](https://github.com/DavinsonR/macro-forecast-lab-latam) | v1.1.0 released, open lab |
| **Market data platform** — public APIs → a Postgres medallion warehouse with dbt → a backtester with no look-ahead → an automated daily refresh | [`/en/projects/trading-sim`](https://davirson.com/en/projects/trading-sim) | [market-data-medallion](https://github.com/DavinsonR/market-data-medallion) | 48 assets, refreshed daily |
| **Power BI report** — the model, measures and pages of the report built on the gold layer | [`/en/projects/powerbi`](https://davirson.com/en/projects/powerbi) | catalogue in `lib/data/powerbi-model.ts` | Catalogue published |
| **JARVIS** — multi-user Postgres with row-level security on 34 tables, 526 tests, and a public demo that never touches the database | — | private; [public demo, no account](https://jarvis-app-psi-sable.vercel.app/demo) | v1 in use |

## The CV

`/[lang]/cv` publishes the full CV in both languages. The text lives once, in `lib/content/cv.ts`; the page, the LaTeX source and the PDF all come from there. Editing the dictionary and running `npm run cv` regenerates all three, so no version of the CV can fall behind another.

## How it is built

Next.js 16 (App Router) · React · TypeScript · Tailwind v4 · Vercel. Fully static: no backend and no database. The market lab's data arrives as JSON exported by the pipeline, not through a query at render time. Running cost: $0.

## Development

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run check` | Lint, types (app and scripts), tests, dictionary parity, CV artefacts and figure consistency — what CI runs (CI also runs `npm audit`, the build, the weight budget, the route smoke test and Lighthouse) |
| `npm test` | `node --test` over `tests/`: the CountUp regex against the real dictionary values, the lab-figure derivation, the credit-risk series and the snapshot fallback |
| `npm run check:weight` | Brotli weight per route against a versioned budget; needs a build |
| `npm run check:routes` | Route smoke test against a running `next start` |
| `npm run lint` | ESLint with the Next configuration |
| `npm run latex` | Regenerates `public/*.tex` from the dictionary |
| `npm run cv` | The above, plus a PDF if tectonic/latexmk/xelatex/pdflatex is available |
| `npm run icons` | Regenerates `favicon.ico`, `apple-icon.png` and `public/icon-*.png` from `app/icon.svg` (needs Pillow) |

### Where to edit

- **All copy (ES/EN):** `lib/content/` — six blocks (`home`, `projects`, `about`, `cv`, `historia`, `error`), each with `es` and `en` side by side. `lib/dictionaries.ts` only assembles them.
- **Colours and typography:** `app/globals.css`, `@theme` blocks.
- **Module status and progress:** `lib/content/home.ts` → `sistema.modules`.
- **Power BI catalogue:** `lib/data/powerbi-model.ts`, copied from `market-data-medallion/powerbi/` with the source commit in the header.

## Licences

- **Code** (the application, the components, the scripts): MIT. See [`LICENSE`](LICENSE).
- **Atlas data** (`public/atlas/`): CC BY-SA 4.0, inherited from the Colombian financial regulator. The ShareAlike clause requires the derivative to carry the same licence. See [`DATA-LICENSE.md`](DATA-LICENSE.md).
- **Typefaces** (`public/fonts/`): Archivo and Source Serif 4, SIL OFL 1.1, self-hosted. See [`public/fonts/OFL.txt`](public/fonts/OFL.txt).
- **CV, résumé and screenshots**: biographical content, all rights reserved. Not covered by the MIT licence.

## Documentation

Written in Spanish, and the place to start before working on this repository.

| | |
| --- | --- |
| [`docs/FALLOS.md`](docs/FALLOS.md) | Every defect this project has already had, numbered from FALLO-01, in one table, each linked to its root cause. **Read this first.** More than half belong to the data pipeline, not to this repo — the table says which. |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | The decisions, numbered from D-01, and where the reasoning lives. Several look arbitrary and are not. |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Current state and what is left. |
| [`docs/DESIGN.md`](docs/DESIGN.md) · [`docs/PRODUCT.md`](docs/PRODUCT.md) | The visual system and the positioning. Binding, not descriptive. |
| [`BITACORA_MAESTRA.md`](BITACORA_MAESTRA.md) | The index; the full narrative, session by session, is in `docs/bitacora/`. |
