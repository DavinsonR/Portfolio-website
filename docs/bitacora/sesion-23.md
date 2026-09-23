## Sesión 23 — 23 sep 2026 · La red: tipos para los scripts, pruebas sin framework, presupuesto de peso, cabeceras en el humo de rutas, Lighthouse en CI

Sesión 6 y última del plan de la [auditoría](../AUDITORIA-2026-09-23.md). Encargo: «continúa hasta terminar».

### La medida antes de opinar

Cuatro comprobaciones que sabían fallar, y seis huecos con un fallo real detrás cada uno en esta auditoría: `scripts/` estaba excluido de `tsc` (FALLO-32 vivió meses ahí, y en la sesión 19 el generador del CV leyó `dict.hire` donde era `dict.sheet.hire` sin que nadie lo viera hasta ejecutarlo); no había una sola prueba de la lógica con estado; nada medía el peso (IR-05 pasó semanas en verde); `check:routes` no leía cabeceras ni datos estructurados; y Lighthouse era una opinión a mano, no una garantía.

### Lo que se hizo

- **`tsc` sobre `scripts/`** (`scripts/tsconfig.json`, `npm run check:scripts`): el único código que fabrica artefactos publicados era el único sin tipar. Pasa a la primera: los fallos de tipo de la sesión 19 ya estaban corregidos.
- **Pruebas sin framework** (`tests/`, `npm test`): `node --test` cargado por `tsx`, cero dependencias nuevas (`vitest` no instalaba limpio por un conflicto de peers, y tampoco hacía falta). Cuatro ficheros, donde el coste está demostrado: la regex de `CountUp` contra los valores reales del diccionario en los dos idiomas; la derivación de las cifras del laboratorio y el redondeo de «una de cada N» (13,0 % → ocho, 14,8 % → siete); las series del gráfico de crédito, no vacías y finitas cuando se recopie el bundle; y `fetchIndex` cayendo a la instantánea cuando el dato vivo falla, con `fetchIndexShared` pidiendo una vez por página y sin cachear un fallo. `tsc` los tipa (la primera versión de una prueba leía `p.fy` donde el punto se llama `anio`, y lo dijo).
- **`check:weight`** (`scripts/check-weight.mjs`): tras el build, suma en brotli los chunks que el HTML de cada ruta referencia y falla por encima de un presupuesto versionado con su motivo escrito. Medido: 155–162 KB br por ruta; presupuesto 172. Es la quinta comprobación con la misma filosofía que las cuatro: no declara el valor correcto, declara que no puede moverse en silencio.
- **`check:routes` lee lo que la respuesta lleva**, no solo lo que la página dice: la CSP arranca en `default-src 'none'`, conserva `'unsafe-inline'` y no declara ningún hash (el comentario de `next.config.ts` advierte de que uno solo mata la hidratación); HSTS con un año y `preload`; sin `x-powered-by`; la demo con `wasm-unsafe-eval`; y el JSON-LD de cada ruta parsea y tiene tipos.
- **Lighthouse en CI** (`lighthouserc.json`, `treosh/lighthouse-ci-action` fijada por SHA): tres rutas, servidor propio en el puerto 3005, accesibilidad y SEO al 100 como error, rendimiento y buenas prácticas como aviso (en un runner compartido varían, y en localhost falta el script de analítica de Vercel). Validado en local antes de subirlo: **encontró un fallo real** — la tesis daba 97 en accesibilidad por un `<dl>` con la definición antes del término y un `<p>` suelto dentro del grupo, el mismo patrón que DA-12 corrigió en el laboratorio y nadie había medido aquí. Corregido: 100.
- **Las acciones de GitHub fijadas por SHA** con la versión en comentario (Dependabot las sigue actualizando); `.gitattributes` con `eol=lf` para los artefactos generados, que los dos pasos «está al día» comparan byte a byte en Linux; ramas remotas fusionadas borradas.
- **Documentación**: `README` ×2 y `CLAUDE.md` con los tres comandos nuevos y la descripción de lo que ahora cubre `check:routes`; `ROADMAP` cierra las seis sesiones y deja lo que solo el autor puede hacer.
- **Una corrección al informe de seguridad**: SR-18 decía que los hashes de `PROVENANCE.json` tenían 65 caracteres; tienen 64 y el de `model.onnx` coincide con el fichero. No se tocó.

### Lo que se verificó

`npm run check` en verde con los dos pasos nuevos dentro (tipos de scripts, pruebas: 11 casos). `npm run build` en verde. `check:routes` en verde con las cabeceras y el JSON-LD. `check:weight`: 16 rutas, máximo 161,5 KB br. Lighthouse en local con Edge sobre las tres rutas del CI: accesibilidad 100 / 100 / 100 y SEO 100 / 100 / 100 tras el arreglo del `<dl>`; rendimiento 99–100 y buenas prácticas 96 (el 404 del script de analítica en localhost, que es por lo que esa categoría avisa y no falla). `@lhci/cli` no pudo correr en esta máquina por un permiso del directorio temporal de Windows; el runner de Linux no tiene ese problema, y la configuración se validó midiendo lo mismo con Lighthouse a mano.

### Lo que queda, y es del autor

- **Las seis decisiones del §7 de la auditoría**: la pieza de FP&A sobre datos sintéticos (la única que mueve el posicionamiento), la foto, el orden de JARVIS, `/` en 307 o 308, el serif de `historia`, qué decir de las plataformas cloud.
- **33 o 34 tablas en JARVIS** (CO-09): `check:figures` ya entiende «treinta y tres»; una línea en `CLAIMS` cuando se sepa la cifra.
- **Las cuatro capturas del informe de Power BI**: solo salen de Power BI Desktop.
- **CAA y DNSSEC en Cloudflare**, y **los PR de Dependabot** que se abrieron al activarlo: los mayores (`eslint` 10, `typescript` 7, `@types/node` 26, acciones v7) exigen migración y no se fusionan a ciegas.
- **`scripts/.atlas-gif/*.gif`** (2,6 MB versionados): LFS, release, o dejarlos con nota.
