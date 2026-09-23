# Mediciones en vivo (producción davirson.com, 23 sep 2026)

## Comprobaciones locales
- `npm run check`: lint ✓, tsc ✓, check:dict ✓, check:artifacts ✓, check:figures ✓ (11 afirmaciones, 104 menciones). Exit 0.

## Lighthouse 13 (Edge headless, producción)
| Página | Form factor | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| /en | móvil | 95 | 100 | 100 | 100 | 1,2 s | 2,7 s | 150 ms | 0 |
| /en | escritorio | 99 | 100 | 100 | 100 | 0,4 s | 1,0 s | 0 ms | 0 |
| /es/projects/trading-sim | móvil | 99 | 100 | 100 | 100 | 1,0 s | 1,9 s | 70 ms | 0 |

Detalle /en móvil: 433 KiB totales. HTML 26 KB gz (146 KB crudo). CSS 11 KB gz (49 KB crudo), único recurso bloqueante. JS: 72 + 45 + 8 + 7 + 7 + 4 + 4 + 2 KB. Fuentes: archivo-latin 34 KB, **source-serif-4-latin 120 KB** (font-display: swap; no precargada; se usa solo en cifras grandes y en la línea de veredicto). **La portada hace un fetch de 49 KB a raw.githubusercontent.com (exports/index.json) solo para pintar la fecha del sello «Live pipeline»** (`components/PipelineStamp.tsx`). Legacy JS: 14 KB en el chunk principal (polyfills innecesarios).

## Consola en producción
Cero errores en las 16 rutas (ES y EN). En `next dev` la CSP `style-src 'self'` bloquea los `<style>` que inyecta HMR y llena la consola de violaciones + el script de debug de Vercel Analytics (va.vercel-scripts.com) bloqueado: ruido solo de desarrollo, pero tapa errores reales mientras se desarrolla.

## Desborde horizontal (document.scrollWidth > innerWidth)
- 320 px: ninguna de las 16 rutas desborda. Tablas (`min-w-[560px]`, `min-w-[640px]`, `min-w-[720px]`) y el SVG del modelo Power BI van dentro de contenedores con `overflow-x: auto`. Las listas `li` que asoman en tracking/research/historia son tiras horizontales desplazables.
- 393 px: sin desborde.
- 768 px: /en, /en/cv, /en/projects/powerbi, /en/research/fintech-inclusion sin desborde.
- 1280 px (oscuro): sin desborde. Fondo rgb(14,18,22), texto rgb(179,188,197).

## Tipografía medida
Texto < 14 px encontrado: solo etiquetas de metadatos a 12,5–13 px (versalitas con tracking) y `th` de tablas a 12,5 px. Cumple el suelo de DESIGN.md salvo los `th` (cabeceras de tabla a 12,5 px en powerbi e historia: revisar si son «metadatos»).

## Accesibilidad (sonda DOM en /es/historia)
Skip link a `#main` ✓ · landmarks header/nav×2/main/footer ✓ · h1 único ✓ · sin saltos de encabezado ✓ · 0 imágenes sin alt · 0 botones sin nombre · 0 SVG sin título/aria-hidden · `target=_blank` con rel ✓ · reglas `:focus-visible` ✓ · `prefers-reduced-motion` ✓ · reglas `print` ✓. Los enlaces del conmutador de idioma no llevan `hreflang`/`lang`.

## Cabeceras y rutas (curl)
- `/` → 307 `/en`; `/cv` → 307 `/en/cv` (**307, no 308**: `permanent: false` en next.config.ts, paso 6 del checklist de migración de PLAN_MEJORA, nunca ejecutado).
- `www.davirson.com/en` → 308 apex ✓. `/pricing` → 404 ✓. `/es/nope` → 404 ✓.
- **`proyecto-davirson-git.vercel.app/es/cv` → 200, no redirige** (ROADMAP y PRODUCT dicen que redirige). Mitigado por `<link rel=canonical>` y `og:url` apuntando a davirson.com, pero sigue siendo contenido duplicado servido desde dos hosts y el enlace de LinkedIn/PDF viejos deja al lector en el host viejo.
- CSP general y de `/credit-risk-demo/` publicadas tal como están declaradas ✓. HSTS preload, X-Frame DENY, nosniff, Referrer-Policy ✓.
- **`Cache-Control: public, max-age=0, must-revalidate` en TODO `public/`**: og-en.png (52 KB), model.onnx (1,93 MB), fuentes, PDFs, JSON del atlas y de la instantánea. Cada visita revalida (304 con ETag, pero un RTT por activo).
- robots.txt ✓ (Allow /, Sitemap). sitemap.xml: 16 `<loc>` ✓. manifest ✓ (`start_url: "/"` pasa por el 307).
- Tamaño en el cable: /en 35 KB, /es 36 KB, /en/cv 24 KB, /en/research 20 KB, /en/projects/trading-sim 11 KB (gzip).

## Títulos `<title>` medidos
Plantilla «— Davirson Novoa Ramírez» en todas las subpáginas: CV = «Davirson Novoa Ramírez — Finance Data Analyst — Davirson Novoa Ramírez» (nombre duplicado, 71 car.); research EN = 103 car.; powerbi EN = 84; historia EN = 87. Todos por encima de los ~60 car. que muestra Google.

## Peso en public/
atlas 1,8 MB · credit-risk-demo 1,9 MB (model.onnx 1,93 MB) · 4 PDF del CV 172–252 KB cada uno (≈850 KB) · trading-sim-snapshot 312 KB · fuentes 160 KB · tracking 116 KB · og-en/og-es 52/56 KB. Restos de la plantilla de Next sin usar: file.svg, globe.svg, next.svg, vercel.svg, window.svg.
