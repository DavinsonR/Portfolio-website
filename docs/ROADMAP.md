# Estado y pendientes

*Solo lo que está vivo. La historia está en [`bitacora/`](bitacora/).*
*Última actualización: 16 septiembre 2026.*

## Dónde está el proyecto

| | Estado |
|---|---|
| Sitio | **[davirson.com](https://davirson.com)** · Next.js 16 · estático en Vercel · $0 de hosting + ~$10/año de dominio |
| Dominio | `davirson.com`, Cloudflare Registrar, precio plano. `proyecto-davirson-git.vercel.app` sigue vivo y redirige — **no se apaga**: está en LinkedIn, en correos enviados y en PDF que ya circulan |
| Analítica | Vercel Web Analytics, sin cookies, mismo origen (por eso no hace falta tocar la CSP) |
| CI | `.github/workflows/ci.yml` — lint, tipos, paridad del diccionario, artefactos del CV, `.tex` al día, build y humo de rutas |
| Idiomas | ES y EN completos, 7 rutas por idioma |
| Proyectos en la mesa | tesis de inclusión financiera · plataforma de datos de mercado · informe Power BI · demo de riesgo de crédito en el navegador · JARVIS (privado) |

## Pendientes

### Del sitio

- [x] ~~FALLO-29~~ — `check:routes` exige que el `og:url` de cada página coincida con su canonical; verificado quitándole el `openGraph` al CV (lo detecta en los dos idiomas).
- [x] ~~El `height="auto"` del SVG del atlas~~ — pasa al estilo; cero errores de consola y la proporción se mantiene exacta.

- [ ] **La escala divergente del atlas ya no divide.** En 2024–25 no hay prácticamente valores negativos y media rampa queda muerta. Decisión analítica del autor, señalada en la [sesión 17](bitacora/sesion-17.md) y no ejecutada.
- [ ] **En oscuro, el panel de 2018 pierde contraste.** Coherente con la regla del tema re-escalonado; subir `--atlas-mid` afectaría también al atlas interactivo. Señalado, no ejecutado.
- [ ] Verificación semanal de los enlaces externos (3 repos y una demo) en CI.

### De organización

- [ ] `lib/` mezcla configuración, contenido, datos y artefactos generados en un nivel; `components/` son 12 archivos sueltos junto a 4 carpetas.
- [ ] `lib/dictionaries.ts` pesa 164 KB en un archivo. Si se parte, el tipo `Dictionary` debe seguir derivándose de `es` o se pierde el invariante de paridad.
- [ ] `public/credit-risk-demo/model.onnx` son 1,88 MB versionados. Sacarlo **antes** de la primera regeneración, no después.
- [ ] Las 4 capturas de `public/tracking/` son PNG de ~55 KB; en WebP quedarían en ~15 KB.

### De contenido

- [ ] **`/[lang]/historia`** — la Fase 5 del plan original, nunca escrita. Es lo que convierte una lista de proyectos en una trayectoria.
- [ ] Una nota escrita por proyecto: el hallazgo del nulo en la tesis, el sesgo de look-ahead del backtester, y por qué la demo de crédito corre en el navegador.

## Reservado

Lab de experimentos · blog · ventures · comunidad. Nada de esto se abre sin una necesidad real; están anotados para que no se reinventen.
