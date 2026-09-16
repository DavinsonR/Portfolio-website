> **Estado: fases A, B y C ejecutadas el 16 sep 2026.** Este documento es el plan
> tal como se escribió, y se conserva como registro de por qué se hizo cada cosa.
> Lo que queda vivo está en [`ROADMAP.md`](ROADMAP.md), que es el que hay que mirar.

# PLAN DE MEJORA — proyecto-davirson

*Diagnóstico y hoja de ruta. 16 sep 2026. Estado de partida verificado: `tsc --noEmit` ✓, `npm run lint` ✓, `npm run build` ✓ (19 rutas), sitio en vivo 200.*

---

## 0. Diagnóstico honesto

**El código no está desordenado. La sensación de desorden viene de otras cuatro cosas.**

Lo verificado en esta sesión:

| Señal | Medida |
|---|---|
| Tipos, lint, build | Los tres en verde, cero advertencias |
| Rutas prerenderizadas | 19 (ES + EN completas) |
| Portada en el cable | 130 KB en crudo, **23 KB gzip** — correcto |
| Cabeceras de seguridad | CSP `default-src 'none'`, HSTS preload, X-Frame DENY — por encima de la media |
| Rutas basura | `/pricing` → 404 real (`dynamicParams = false` funciona) |
| Historia | 58 commits, trabajo real y fechado |

Lo que sí está roto o ausente:

| # | Hallazgo | Por qué importa |
|---|---|---|
| 1 | **La URL es `proyecto-davirson-git.vercel.app`** | El sufijo `-git` se lee como un accidente de configuración. Es lo primero que ve un reclutador. |
| 2 | **No hay CI** | 58 commits y nada impide que un diccionario desbalanceado llegue a `main`. La bitácora documenta 30 fallos; ninguno estaba cubierto por una verificación automática. |
| 3 | **No hay ni una prueba** | El invariante más importante del repo (formas idénticas de `es` y `en`) solo lo atrapa `tsc`, y lo reporta en el componente consumidor, no donde está el hueco. |
| 4 | **`BITACORA_MAESTRA.md` pesa 107 KB / 985 líneas** | Es el activo intelectual del proyecto y **nadie puede leerlo**: ni tú de un vistazo, ni un agente sin quemar la mitad de su contexto. Esta es la causa principal de la sensación de desorden. |
| 5 | 4 ramas `claude/*` vivas en `origin` | Ruido permanente en la vista del repo para cualquiera que lo abra. |
| 6 | Sin `LICENSE` para el código | Solo existe `DATA-LICENSE.md`. Sin licencia, legalmente nadie puede reutilizar nada — y un repo público sin licencia le resta seriedad. |
| 7 | Sin analítica | Fase 6 de la hoja de ruta, nunca ejecutada. No sabes si alguien abre el CV. |
| 8 | Sin `manifest` ni iconos más allá de `favicon.ico` | La CSP declara `manifest-src 'self'` y no hay manifest. En iOS el sitio no tiene identidad al guardarlo. |
| 9 | Sin `not-found.tsx` propio | Un 404 genérico de Next en un sitio con esta atención al detalle. |
| 10 | Redirects en `permanent: false` (307) | Con dominio propio hay que consolidar señal SEO: deben ser 308. |
| 11 | `model.onnx` de 1,88 MB versionado | Hoy está bien (`.git` = 3,4 MB). Cada regeneración duplica ese peso para siempre. |
| 12 | `lib/` mezcla cuatro cosas | Configuración (`site.ts`), contenido (`dictionaries.ts`, 164 KB), artefactos generados (`atlas-figure.ts`) y datos (`credit-risk-data/`) en el mismo nivel. |

---

## 1. Dominio — la decisión, con números

Los diez candidatos están **todos disponibles** (consultado 16 sep 2026):

| Dominio | 1er año | Renovación real | Veredicto |
|---|---|---|---|
| **`davirson.com`** | **$11,25** | **~$10,44/año en Cloudflare, plano** | ✅ **Cómpralo** |
| `davirson.dev` | $9,99 | ~$12/año | Opción B (señal «dev», no «finanzas/datos») |
| `davirson.app` | $9,99 | ~$14/año | No aporta nada aquí |
| `davirson.org` | $8,49 | ~$10/año | El más barato, pero `.org` dice *ONG*. Señal equivocada. |
| `davirson.xyz` | **$1,99** | **~$12–15/año** | ❌ El precio es un gancho de primer año; `.xyz` arrastra reputación de spam. |
| `davirson.me` | $13,99 | ~$20/año | Caro para lo que da |
| `davirson.net` | $13,50 | ~$14/año | Sin motivo |
| `davirson.co` | $29,99 | ~$30/año | Bonito por colombiano, triple de precio, y apuntas a remoto internacional |
| `davirson.io` | $30,00 | ~$35/año | Prima de moda tech |
| `davirsonnovoa.com` | $11,25 | ~$10,44 | Más largo de dictar por teléfono |

### Recomendación: `davirson.com`

Tres razones, en orden:

1. **Tu nombre es raro y el `.com` exacto está libre.** Eso no es normal y no dura para siempre. Es el activo de marca más barato que vas a comprar nunca.
2. **Apuntas a *Finance Data Analyst* y *Analytics Engineer* remotos.** Ese comité lee `.com`. `.dev` habla al gremio equivocado y `.xyz` te hace perder la primera impresión por ahorrar $9 al año.
3. **El ahorro de las alternativas es ruido.** `.org` te ahorra $2,76 al año y te cuesta una explicación en cada conversación.

### Dónde comprarlo (precio real a 5 años, `.com`)

| Registrador | Año 1 | Renovación | 5 años | Nota |
|---|---|---|---|---|
| **Cloudflare Registrar** | $10,44 | $10,44 plano | **~$52** | Vende **a precio de costo**, sin margen. WHOIS privado gratis. *Verisign sube la tarifa el 1 nov 2026 → pasará a ~$11,15.* |
| Porkbun | ~$11,06 | ~$11,06 | ~$55 | Casi idéntico, interfaz más simple |
| Vercel Domains | $11,25 | ~$11,25 | ~$56 | **DNS y SSL en un clic**, cero configuración |
| Namecheap | promo baja | **$18,48** | ~$80 | El clásico gancho de primer año |

**Decisión práctica:** la diferencia entre Cloudflare y Vercel a 5 años es **$4 en total**. Si valoras no tocar DNS nunca, cómpralo en Vercel y termina en un clic. Si prefieres el registrador más barato y transparente del mercado y no te importan 10 minutos de DNS, cómpralo en Cloudflare.

> **Recomendación:** `davirson.com` en Cloudflare ($10,44/año, precio plano de por vida), con los registros apuntando a Vercel. Presupuesto total del sitio: **~$10/año**. Todo lo demás sigue costando $0.

**Opcional (+$9,99/año):** `davirson.dev` redirigiendo 301 a `davirson.com`, solo para defender el nombre. No es necesario.

### Migración — el checklist que no se puede saltar

Cambiar la URL sin esto te cuesta la indexación que ya tienes:

1. Comprar el dominio y añadirlo en Vercel → *Project Settings → Domains*.
2. Elegir `davirson.com` como **Production Domain** y dejar `www` redirigiendo a la raíz (o al revés, pero **una sola** canónica).
3. **`lib/site.ts`: cambiar `SITE`.** Es el único sitio donde vive la URL — de ahí salen `robots.ts`, `sitemap.ts`, `alternates.ts`, el `metadataBase` y el CV en LaTeX. Verificar con `grep -rn "vercel.app" .` que no queda ninguna copia suelta.
4. `README.md` y `README.es.md`: los enlaces al dominio viejo.
5. `npm run cv` — el PDF descargable lleva la URL impresa. Si no lo regeneras, tu CV en papel apunta a `vercel.app`.
6. `next.config.ts`: pasar los 7 redirects a `permanent: true` (308).
7. Dejar el dominio `.vercel.app` activo y redirigiendo — no lo borres nunca: está en LinkedIn, en correos enviados y en el PDF del CV que ya mandaste.
8. Google Search Console: añadir la propiedad nueva y enviar `sitemap.xml`.
9. Actualizar el enlace en LinkedIn, GitHub (campo *Website* del perfil y de los 3 repos) y la firma de correo.

---

## 2. Plan de mejora, por fases

Ordenado por *impacto ÷ esfuerzo*. Cada fase es independiente y deja el sitio en verde.

### FASE A — Profesionalismo visible (1 sesión) · *máximo impacto*

Lo que ve un reclutador en los primeros 5 segundos.

- [ ] **A1 · Dominio propio** — los 9 pasos del checklist de arriba. *(Empieza por aquí.)*
- [ ] **A2 · `app/[lang]/not-found.tsx`** — un 404 bilingüe con el sistema visual del sitio y salida a la portada y al CV. Hoy un enlace roto devuelve la pantalla genérica de Next.
- [ ] **A3 · Iconos y manifest** — `app/icon.svg`, `app/apple-icon.png`, `app/manifest.ts` con nombre, colores del tema y los iconos. Cierra de paso la declaración `manifest-src 'self'` de la CSP, que hoy no apunta a nada.
- [ ] **A4 · `LICENSE`** — MIT para el código (`DATA-LICENSE.md` ya cubre los datos). Una línea en el README aclarando el doble régimen.
- [ ] **A5 · Analítica sin cookies** — GoatCounter (gratis, sin cookies, sin banner legal) o Vercel Analytics. Requiere **una** línea nueva en `connect-src` de la CSP. Sin esto no sabes si alguien abre el CV, y llevas 17 sesiones construyendo a ciegas.
- [ ] **A6 · Limpiar `origin`** — borrar las 4 ramas `claude/*` ya fusionadas.

### FASE B — Que el repo no se pueda romper solo (1 sesión)

- [ ] **B1 · CI en GitHub Actions** — un workflow, tres pasos: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Sobre cada PR y cada push a `main`. Es lo que convierte tus tres verificaciones manuales en una garantía.
- [ ] **B2 · Prueba de paridad del diccionario** — un script (`scripts/check-dictionaries.mjs`) que recorra `es` y `en` y falle nombrando **la ruta exacta** de la clave que falta (`cv.experience[2].bullets`). `tsc` ya lo atrapa, pero te señala el componente que la consume, no el hueco. Añadirlo a CI y a un script `npm run check`.
- [ ] **B3 · Humo de rutas** — un script que lea `ROUTES` de `app/sitemap.ts`, levante `next start` y confirme 200 en las 19 rutas más 404 en una ruta inventada. La bitácora registra **dos 404 que devolvían 200**; esto los habría atrapado.
- [ ] **B4 · `npm run check`** — un solo comando que encadene tipos + lint + paridad + build, para que verificar no dependa de recordar cuatro comandos. Documentarlo en `CLAUDE.md` y `README`.
- [ ] **B5 · Verificar enlaces externos** — el sitio enlaza a 3 repos y a una demo externa. Un paso de CI semanal que compruebe que ninguno murió.

### FASE C — Domar la documentación (1 sesión) · *aquí está el «desorden»*

`BITACORA_MAESTRA.md` es el mejor activo del proyecto y su peor problema de acceso: 107 KB de narrativa cronológica donde para encontrar una decisión hay que leer 17 anexos.

- [ ] **C1 · Partir la bitácora en `docs/`**, conservando el original íntegro como archivo histórico:
  - `docs/DECISIONES.md` — las D-01…D-31 en una tabla, con fecha, decisión y enlace al anexo. **Consultable en 20 segundos.**
  - `docs/FALLOS.md` — los FALLO-01…FALLO-30 en una tabla: síntoma, causa raíz, corrección, y si está cubierto por una prueba. Esta tabla es el mejor documento que puede leer un agente antes de tocar nada.
  - `docs/ROADMAP.md` — solo el estado actual y lo pendiente, sin historia.
  - `docs/bitacora/SESION-NN.md` — un archivo por sesión (17 archivos), enlazados desde un índice.
  - `BITACORA_MAESTRA.md` queda como índice de ~100 líneas que enlaza a todo lo anterior.
- [ ] **C2 · `README.md` a 60 líneas** — qué es, dónde está, cómo se corre, dónde se edita. Todo lo demás enlazado. Hoy compite con la bitácora.
- [ ] **C3 · Mover `DESIGN.md` y `PRODUCT.md` a `docs/`** — la raíz del repo debe leerse de un vistazo: `README`, `CLAUDE.md`, `LICENSE`, y el código.
- [ ] **C4 · Actualizar `CLAUDE.md`** con los punteros nuevos (ver §3).

### FASE D — Orden interno del código (1 sesión)

Nada de esto es urgente. Hazlo cuando C esté hecho.

- [ ] **D1 · Separar `lib/` por rol:**
  - `lib/config/` → `site.ts`, `contact.ts`, `alternates.ts`, `structured-data.ts`
  - `content/` → `dictionaries.ts` (+ partirlo: por bloque, `cv.ts`, `projects.ts`, `home.ts`). **164 KB en un archivo es el único punto del código donde el desorden es real.**
  - `lib/data/` → `credit-risk-data/`, `powerbi-model.ts`, `trading-sim.ts`
  - `lib/generated/` → `atlas-figure.ts`, con una cabecera «NO EDITAR — `npm run atlas`»
  > Si partes el diccionario, el tipo `Dictionary` debe seguir derivándose de `es` para no perder el invariante de paridad. No negociable.
- [ ] **D2 · `components/` en carpetas por dominio** — hoy son 12 archivos sueltos junto a 4 carpetas. `components/ui/` (Navbar, Footer, ThemeToggle, BackLink, SectionNav, StatusPill, CopyEmail, CountUp, Motion) y dejar las de proyecto donde están.
- [ ] **D3 · `model.onnx` fuera de git** — 1,88 MB versionados. Git LFS, o servirlo desde el repo `credit-risk-mlops` con la versión fijada. Hazlo **antes** de la primera regeneración del modelo, no después.
- [ ] **D4 · Optimizar las capturas de `public/tracking/`** — 4 PNG de ~55 KB. A WebP quedan en ~15 KB cada una.

### FASE E — Contenido y alcance (continuo)

- [ ] **E1 · Enlace canónico y ficha OG revisados** tras el cambio de dominio.
- [ ] **E2 · `/[lang]/historia`** — la Fase 5 de la hoja de ruta original, nunca escrita. Es la página que convierte una lista de proyectos en una trayectoria. Con el atlas y el hallazgo del nulo ya tienes el material.
- [ ] **E3 · Una nota escrita por proyecto** — no un blog. Tres textos: el hallazgo del nulo en la tesis, el sesgo de look-ahead del backtester, y por qué la demo de crédito corre en el navegador. Es lo que se comparte en LinkedIn y lo que te lee un hiring manager.
- [ ] **E4 · La escala divergente del atlas** — señalada en la sesión 17 y no ejecutada: en 2024–25 no hay valores negativos y media rampa queda muerta. Decisión analítica tuya, no cosmética.
- [ ] **E5 · Contraste del panel 2018 en tema oscuro** — señalado en la sesión 17. Medir y decidir.

---

## 3. Cambios sugeridos a `CLAUDE.md`

El `CLAUDE.md` actual es **bueno** — explica invariantes y causas, no estructura de carpetas. No hay que reescribirlo. Cuatro adiciones:

1. **Comando único de verificación.** Cuando exista `npm run check` (B4), que sustituya la lista de cuatro comandos sueltos.
2. **Puntero a `docs/FALLOS.md`.** Hoy dice «lee `BITACORA_MAESTRA.md` antes de empezar», y son 107 KB. Tras la fase C debe decir: «lee `docs/FALLOS.md` (tabla) antes de tocar nada; la bitácora completa es el archivo histórico».
3. **Sección «Después de cambiar el dominio»** — que `lib/site.ts` es la fuente única, pero el PDF del CV lleva la URL impresa y exige `npm run cv`. Es un fallo silencioso clásico y hoy no está documentado en ninguna parte.
4. **La regla de `model.onnx`** si se aplica D3: de dónde sale y por qué no se versiona.

---

## 4. Orden de ejecución sugerido

```
Semana 1   A1 (dominio)  →  A2 A3 A4 A6
Semana 2   A5 (analítica) + B1 B2 B4     ← el repo deja de poder romperse solo
Semana 3   C1 C2 C3 C4                   ← desaparece la sensación de desorden
Semana 4   B3 B5 + D1 D2
Después    D3 D4, luego E
```

**Si solo haces una cosa esta semana: A1.** El dominio es lo único de esta lista que ve un reclutador.
