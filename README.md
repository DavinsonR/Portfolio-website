# Proyecto Davirson

*[Leer en español](README.es.md)*

Bilingual personal site (EN/ES) and the entry point to three projects with open code and live data: econometric research, a market data platform and a daily tracking app.

### ▶ [proyecto-davirson-git.vercel.app](https://proyecto-davirson-git.vercel.app)

Not a portfolio of screenshots: every page on the site is fed by the repository behind it, and every figure it shows traces back to the commit that produced it.

## What is inside

| Project | On the site | Repository | Status |
| --- | --- | --- | --- |
| **Financial inclusion and regional growth** — a warehouse of 19 public sources, an index by dimension, a fixed-effects panel and an atlas of all 1,123 municipalities | [`/en/research/fintech-inclusion`](https://proyecto-davirson-git.vercel.app/en/research/fintech-inclusion) | [financial-inclusion-colombia](https://github.com/DavinsonR/financial-inclusion-colombia) | Main result published |
| **Market data platform** — public APIs → a Postgres medallion warehouse with dbt → a backtester with no look-ahead → an automated daily refresh | [`/en/projects/trading-sim`](https://proyecto-davirson-git.vercel.app/en/projects/trading-sim) | [market-data-medallion](https://github.com/DavinsonR/market-data-medallion) | 48 assets, refreshed daily |
| **Power BI report** — the model, measures and pages of the report built on the gold layer | [`/en/projects/powerbi`](https://proyecto-davirson-git.vercel.app/en/projects/powerbi) | catalogue in `lib/powerbi-model.ts` | Catalogue published |
| **JARVIS** — habits, body, sleep and spending logged in under ninety seconds | — | private; [public demo, no account](https://jarvis-app-psi-sable.vercel.app/demo) | v1 in use |

## The CV

`/[lang]/cv` publishes the full CV in both languages. The text lives once, in `lib/dictionaries.ts`; the page, the LaTeX source and the PDF all come from there. Editing the dictionary and running `npm run cv` regenerates all three, so no version of the CV can fall behind another.

## How it is built

Next.js 16 (App Router) · React · TypeScript · Tailwind v4 · Vercel. Fully static: no backend and no database. The market lab's data arrives as JSON exported by the pipeline, not through a query at render time. Running cost: $0.

## Development

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /es
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint with the Next configuration |
| `npm run latex` | Regenerates `public/*.tex` from the dictionary |
| `npm run cv` | The above, plus a PDF if tectonic/latexmk/xelatex/pdflatex is available |
| `npm run icons` | Regenerates `favicon.ico`, `apple-icon.png` and `public/icon-*.png` from `app/icon.svg` (needs Pillow) |

### Where to edit

- **All copy (ES/EN):** `lib/dictionaries.ts` — the single source of truth.
- **Colours and typography:** `app/globals.css`, `@theme` blocks.
- **Module status and progress:** `lib/dictionaries.ts` → `sistema.modules`.
- **Power BI catalogue:** `lib/powerbi-model.ts`, copied from `market-data-medallion/powerbi/` with the source commit in the header.

## Licences

- **Code** (the application, the components, the scripts): MIT. See [`LICENSE`](LICENSE).
- **Atlas data** (`public/atlas/`): CC BY-SA 4.0, inherited from the Colombian financial regulator. The ShareAlike clause requires the derivative to carry the same licence. See [`DATA-LICENSE.md`](DATA-LICENSE.md).
- **Typefaces** (`public/fonts/`): Archivo and Source Serif 4, SIL OFL 1.1, self-hosted. See [`public/fonts/OFL.txt`](public/fonts/OFL.txt).
- **CV, résumé and screenshots**: biographical content, all rights reserved. Not covered by the MIT licence.

## Documentation

`BITACORA_MAESTRA.md` — roadmap, architecture, decisions and the full log of failures with their root cause. It is written in Spanish and it is the document to read first before working on this repository.
