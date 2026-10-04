## Sesión 34 — 3 oct 2026 · Dependencias al día, y tres saltos mayores que esperan al ecosistema

Encargo: aplicar los PR abiertos de Dependabot, auditarlos y subir a `main`.

### Lo que entra

| PR | Cambio | Comprobación |
|---|---|---|
| #20 | `react` y `react-dom` 19.3.0, `@types/react` 19.3, `tsx` 4.23.15 | check, build, peso, rutas |
| #15 | `js-yaml` 4.3.2 (transitiva, vía `@eslint/eslintrc`) | `npm ls js-yaml` |
| #14 | `sharp` 0.35.4 | ya había entrado con `next` 16.3.6 (#16) |
| #51, #52 | `actions/setup-node` v7.0.0 y `actions/checkout` v7.0.1 | SHA comprobados contra `git ls-remote` de cada etiqueta |
| — | `typescript` ~6.0.3 en lugar del 7.0.2 de #23 | `tsc --noEmit` y lint en cero, sin peers inválidos |
| — | `@types/node` ^22 en lugar del 26 de #21 | sigue al Node 22 de CI |

### Lo que no entra, y por qué (D-38)

- **ESLint 10 (#22).** `eslint-plugin-react`, que trae `eslint-config-next` 16.3.6, llama a `context.getFilename()`, y ESLint 10 la eliminó. Con ESLint 10 el lint se cae en el primer archivo (`app/sitemap.ts`).
- **TypeScript 7 (#23).** `typescript-eslint` 8.71 exige `typescript >=4.8.4 <6.1.0`. El tipado pasa con TS 7, pero el lint no carga. Entra la versión más alta compatible, 6.0.3.
- **`@types/node` 26 (#21).** Los tipos tienen que seguir al Node que ejecuta el sitio. Con tipos de 26 sobre un runtime de 22, el compilador acepta API que en producción no existe. La API de Vercel no deja leer la versión de producción desde esta sesión; los tipos de 22 son seguros con producción en 22 o en 24.

`.github/dependabot.yml` ignora esos tres saltos, cada uno con su motivo. La señal para revisarlos es que cambie su condición: una `eslint-config-next` que admita ESLint 10, una `typescript-eslint` que admita TS 6.1 o superior, o un cambio del Node de ejecución.

### Auditoría

- `npm audit --omit=dev`: 0 vulnerabilidades. Lo que se publica está limpio.
- `npm audit` completo: quedan 5 altas en `braces`, que entra por el lint y no tiene versión corregida. `npm audit fix` resolvió una de las seis; las otras solo se van con `--force`, que instala ESLint 10 y rompe el lint (ver arriba). Son de desarrollo y no llegan al sitio.
- `check`, `build`, `check:weight` (18 rutas, máximo 162,1 KB br) y `check:routes` (18 rutas a 200, redirects, 404, cabeceras, metadatos y JSON-LD) en verde.

### Un fallo que solo vio CI

`check:scripts` (`tsc -p scripts`) pasó en local y cayó en CI con TypeScript 6.0.3: «Cannot find name 'node:fs'», `process`, `Buffer`. TypeScript 6 dejó de incluir por defecto todos los paquetes `@types` visibles, y `scripts/tsconfig.json` nunca declaró `types`. En la máquina local los resolvía igual y en el runner de Linux no. El arreglo es declarar `"types": ["node"]`, que es lo correcto en los dos entornos. La regla: con TypeScript 6, todo `tsconfig` que use API de Node declara `types` explícitamente; no se confía en el descubrimiento automático.
