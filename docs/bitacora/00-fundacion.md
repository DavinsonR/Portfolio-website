<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

# BITÁCORA MAESTRA — PROYECTO DAVIRSON
### Hoja de ruta, mapa de arquitectura e historial completo de ejecución
### v1.0 · Última actualización: 5 septiembre 2026

> Este documento es el mapa definitivo del proyecto. Su propósito: que cualquier sesión futura (o cualquier persona) pueda entender **qué se construyó, por qué, cómo, qué falló y qué sigue** — sin repetir procesos fallidos ni redescubrir decisiones ya tomadas. Cuando el proyecto crezca, este archivo evita que nos estanquemos.

---

## 1. SUMMARY EJECUTIVO

**Qué es:** Sitio web personal bilingüe (ES/EN) que documenta la transición de Davirson Novoa de FP&A/finanzas hacia data science. No es un portfolio genérico: su tesis es "entiendo el negocio **y** los datos", y su diferenciador de diseño es mostrar el proceso en construcción ("build in public") mediante módulos con estado.

**Estado actual (14 ago 2026):**
- ✅ Fases 0–3 completadas (Discovery, Identidad, Arquitectura, MVP Build).
- ✅ Código fuente completo, compila sin errores, 4 rutas estáticas (`/es`, `/en`, `/es/cv`, `/en/cv`).
- ✅ Dos PDFs de CV (ES/EN) generados desde la misma fuente de datos.
- ✅ Desplegado en Vercel (build exitoso).
- ⚠️ **Bloqueo abierto:** el deploy quedó en el scope personal de Vercel con "Vercel Authentication" activada → devuelve HTTP 403 público. Requiere desactivación manual (ver §7, FALLO-05). El conector no tiene permisos para desactivarla automáticamente.

**Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript, desplegado en Vercel. Sin backend, sin base de datos (todo estático/SSG). Costo: $0.

**Decisión narrativa central:** el CV NO se copió tal cual. Se reconstruyó para contar que Davirson ya hacía data science *dentro* de las finanzas (Python desde practicante, automatizaciones, hackathon ganado, Stanford ML), y que el pivote es "oficializar lo que ya hacía", no un salto al vacío.

---

## 2. DIAGRAMA DE FLUJO DEL PROCESO COMPLETO

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PROYECTO DAVIRSON — FLUJO                        │
└─────────────────────────────────────────────────────────────────────┘

FASE 0 — DISCOVERY  ✅
   │  Prompt maestro + entrevista → Documento Fundacional v1.0
   │  Define: visión, estrategia, 4 conceptos de marca, IA, roadmap
   ▼
FASE 1 — IDENTIDAD  ✅
   │  ¿Preguntas del usuario?
   │   1. Ver ≥5 mockups  → SÍ
   │   2. Confirmar stack → Next.js+Tailwind+Vercel (React incluido; Python = motor aparte)
   │   3. Idea proyecto   → Simulador trading algorítmico (complejidad escalable V1/V2/V3)
   │
   ├─► Entregable: 5 direcciones visuales (HTML con tabs)
   │      01 Terminal Sereno · 02 Terminal+Alma★ · 03 Cuaderno Bitácora
   │      04 Sistema en Construcción · 05 Minimal Future
   │
   ├─► Usuario elige: FUSIÓN 02 (base cálida) + 04 (módulos de estado)
   │
   ├─► Entregable: mockup definitivo (fusión)
   │      Fix aplicado: separar amarillo BUILDING (#E3C368) del ámbar humano (#D9A05B)
   │
   └─► Usuario rechaza nav estilo terminal → Fix: nav limpio (Inter, sin v0.1/status)
   ▼
FASE 2 — ARQUITECTURA  ✅
   │  Entregable: wireframes (mapa del sitio + /cv + /proyectos/trading-sim + /historia)
   │  Decisiones: contacto = sección, no página · PDF desde fuente única · Python offline→JSON
   ▼
FASE 3 — MVP BUILD  ✅  (+ adelanto de Fase 6 deploy)
   │
   ├─ 3.1 Scaffold Next.js 16 + Tailwind v4 + TS
   ├─ 3.2 Tokens de diseño → globals.css (@theme)
   ├─ 3.3 lib/dictionaries.ts  ← FUENTE ÚNICA DE VERDAD (ES/EN)
   ├─ 3.4 Componentes: StatusPill, ProgressBar, Navbar, Footer
   ├─ 3.5 Layout [lang] + i18n (rutas /es /en, sin librería)
   ├─ 3.6 Home (hero, sistema, proyecto, historia, cv-strip, contacto)
   ├─ 3.7 CV interactivo completo
   │        └─ FALLO-01: fuentes next/font/google sin red en build → fix <link>
   │        └─ FALLO-02: `as const` ensanchaba tipos → fix quitar as const
   ├─ 3.8 Ajustes usuario: nombre, niveles skills, narrativa reconstruida
   ├─ 3.9 Generador PDF (scripts/generate-cv-pdfs.ts, lee dictionaries)
   │        └─ FALLO-03: characterSpacing encadenado no es función → fix opción .text()
   ├─ 3.10 Build final ✅ → 4 rutas estáticas
   └─ 3.11 DEPLOY a Vercel
            └─ FALLO-04: 1er deploy sin 3 archivos (payload incompleto)
            └─ FALLO-05: Vercel Authentication activa → 403 público  ⚠️ ABIERTO
            └─ FALLO-06: redeploy a team → 403 permisos del conector
   ▼
┌─── PRÓXIMO ───────────────────────────────────────────────────────┐
│ INMEDIATO: usuario desactiva Vercel Authentication (manual, §7)     │
│ FASE 4: motor Python trading_sim (backtest → JSON → visualización) │
│ FASE 5: página /historia (narrativa completa)                      │
│ FASE 6: analítica (Umami/GoatCounter) + evaluar dominio propio     │
│ FASE 7+: Lab · Blog · Ventures (reservados, no construidos)        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. ARQUITECTURA TÉCNICA

### 3.1 Estructura de carpetas
```
davirson/
├── app/
│   ├── globals.css              ← tokens @theme (colores + fuentes)
│   └── [lang]/                  ← segmento dinámico i18n (es|en)
│       ├── layout.tsx           ← fuentes, metadata, Navbar+Footer, generateStaticParams
│       ├── page.tsx             ← Home (6 secciones)
│       └── cv/page.tsx          ← CV interactivo completo
├── components/
│   ├── Navbar.tsx               ← "use client" (usePathname para toggle idioma)
│   ├── Footer.tsx
│   ├── StatusPill.tsx           ← pills LIVE/BUILDING/RESEARCH/IDEA
│   └── ProgressBar.tsx          ← barras de progreso por estado
├── lib/
│   └── dictionaries.ts          ← ⭐ FUENTE ÚNICA DE VERDAD (todo el texto ES/EN)
├── scripts/
│   └── generate-cv-pdfs.ts      ← genera public/*.pdf desde dictionaries
├── public/
│   ├── Davirson_Novoa_CV_ES.pdf
│   └── Davirson_Novoa_Resume_EN.pdf
├── next.config.ts               ← redirects / → /es, /cv → /es/cv
├── tsconfig.json                ← excluye scripts/ del build de producción
└── package.json
```

### 3.2 Principios de arquitectura (no violar)
1. **Fuente única de verdad:** todo el texto vive en `lib/dictionaries.ts`. Nunca escribir texto dentro de componentes. Un cambio de copy = un solo archivo, y se refleja en sitio + PDF a la vez.
2. **i18n sin dependencias:** rutas `/[lang]/` + diccionarios TS. Cero librerías, contenido versionado en Git.
3. **Sin backend hasta que se necesite:** todo SSG. Supabase/API routes solo cuando Lab o Community lo exijan (Fase 7+). El trading_sim corre en Python **offline**, exporta JSON, el sitio solo visualiza → $0, sin servidor.
4. **Modularidad:** agregar una sección = nueva ruta + nueva entrada en diccionario. No se toca lo existente (regla "no romper").
5. **Los estados son el mensaje:** las barras de progreso deben reflejar la realidad. TRADING_SIM está en 20% porque aún no existe. Actualizar honestamente = el corazón del build in public.

### 3.3 Design tokens (definidos en globals.css)
| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | #0D0D10 | fondo base |
| `--color-fg` | #F0F2F5 | texto principal |
| `--color-body` | #99A2AD | texto cuerpo |
| `--color-cold` | #8AB8D0 | acento técnico (frío) |
| `--color-warm` | #D9A05B | acento humano — **SOLO** historia/propósito |
| `--color-live` | #5FBF8A | estado LIVE (verde) |
| `--color-building` | #E3C368 | estado BUILDING (amarillo frío — distinto del ámbar) |
| `--color-research` | #7FA8D9 | estado RESEARCH (azul) |
| `--color-idea` | #8A93A0 | estado IDEA (gris) |
| Fuentes | Space Grotesk (display) · IBM Plex Mono (técnico) · Inter (cuerpo) |

**Regla de color crítica:** el ámbar `#D9A05B` es exclusivo de contenido humano (historia, propósito). Los colores de estado son "lenguaje de máquina". Nunca mezclar — es lo que hace que el contraste frío/cálido se sienta intencional.

---

## 4. DECISIONES CLAVE (con justificación corta)

| # | Decisión | Por qué |
|---|---|---|
| D-01 | Next.js sobre Astro | Roadmap incluye dashboard/IA/API → evita migración futura |
| D-02 | React viene con Next; Python es motor aparte, no del sitio | Aclaración al usuario: no compiten, se complementan |
| D-03 | Dirección visual = fusión 02+04 | 02 resuelve tensión frío/cálido; 04 es el más diferenciador (build in public) |
| D-04 | Nav en Inter, sin estilo terminal | Feedback del usuario: la mono en el nav desconectaba la página. Mono se queda en contenido técnico |
| D-05 | i18n sin librería | Cero deps, contenido en Git, control total |
| D-06 | Contacto = sección, no página | Una página con 3 links sería parada muerta |
| D-07 | PDF desde fuente única | Nunca desincronizar dos CVs; editar dictionaries actualiza ambos |
| D-08 | Trading sim: Python offline → JSON | $0, sin servidor, sin mantenimiento, velocidad máxima |
| D-09 | Niveles de skills honestos (no todo "avanzado") | La honestidad ES el diferenciador ante reclutadores |
| D-10 | Narrativa reconstruida, no copiada | El CV plano no contaba la transición; la versión nueva demuestra que ya hacía data science en finanzas |
| D-11 | Bilingüe + remoto en primer plano | Objetivo explícito: consultorías/trabajos internacionales remotos |
| D-12 | Nombre visible "Davirson" (cédula); links reales "Davinson" (redes) | Usuario confirmó ambos válidos; se respeta cada uno donde corresponde |

---

## 5. NARRATIVA DEL CV — cómo se reconstruyó

**Problema:** el CV original era una lista de funciones financieras. No contaba una transición ni mostraba la ventaja competitiva.

**Reconstrucción aplicada:**
- **Hero:** "Entiendo el negocio por sus números. Ahora hago que los datos decidan."
- **Hilo conductor:** en cada rol financiero ya construía código/datos (Python de practicante, automatización 10+h/mes, dashboards en 15+ países).
- **Prueba de pivote:** hackathon ganado (2024) + Stanford ML Specialization (2024).
- **Frase tesis:** "no estaba haciendo finanzas con algo de datos — estaba haciendo ciencia de datos dentro de las finanzas."
- **Remoto como argumento:** GMT-5 con solape US/Canadá, equipos en 15+ países, 3 roles remotos/híbridos.

**Datos verificados del CV original (no inventados):** Neoris EPAM (FP&A, 2026), SLB (practicante→especialista, 26 meses, 2024–2026), LEE Javeriana (2023), Solidariamente (2023), Maestría Economía Javeriana (en curso), Stanford ML + Google Cybersecurity + Platzi, hackathon BodyTech, beca Ecopetrol.

---

## 6. HISTORIAL DE EJECUCIONES (cronológico)

| Paso | Acción | Resultado |
|---|---|---|
| E-01 | Leer CV .docx subido | ✅ contenido extraído |
| E-02 | `create-next-app` (Next 16, TS, Tailwind v4) | ✅ scaffold |
| E-03 | `npm install` | ✅ deps OK |
| E-04 | Limpiar scaffold (borrar page/layout default) | ✅ |
| E-05 | globals.css con tokens @theme | ✅ |
| E-06 | lib/dictionaries.ts (ES/EN completo) | ✅ |
| E-07 | StatusPill + ProgressBar | ✅ |
| E-08 | Navbar + Footer | ✅ |
| E-09 | layout.tsx con next/font | ❌ FALLO-01 |
| E-10 | Home + CV pages | ✅ |
| E-11 | build #1 | ❌ FALLO-01 confirmado (fuentes sin red) |
| E-12 | Fix: fuentes vía `<link>` | ✅ |
| E-13 | build #2 | ❌ FALLO-02 (tipos `as const`) |
| E-14 | Fix: quitar `as const` | ✅ |
| E-15 | build #3 | ✅ 4 rutas estáticas |
| E-16 | Smoke test local (curl ambos idiomas) | ✅ |
| E-17 | Ajustes usuario (niveles skills, etc.) | ✅ |
| E-18 | Generador PDF #1 | ❌ FALLO-03 (characterSpacing) |
| E-19 | Fix + PDF #2 | ✅ 2 PDFs, 2 págs c/u |
| E-20 | build #4 (con PDFs) | ✅ |
| E-21 | Deploy #1 a Vercel (personal scope) | ⚠️ FALLO-04 (3 archivos faltantes) + FALLO-05 (403 auth) |
| E-22 | Deploy #2 (payload completo) | ✅ build OK, ⚠️ FALLO-05 persiste |
| E-23 | Intentar desactivar auth vía API | ❌ 404/403 permisos conector |
| E-24 | Redeploy a team con teamId | ❌ FALLO-06 (403 crear deployment en team) |
| E-25 | Escribir esta bitácora | ✅ |

---

## 7. HISTORIAL DE FALLOS (para no repetirlos)

**FALLO-01 — Fuentes de Google en build**
- Síntoma: `next build` falla al descargar Space Grotesk/Inter/Plex Mono con `next/font/google`.
- Causa: el entorno de build (sandbox) no tiene acceso de red a Google Fonts.
- Fix: cargar fuentes vía `<link>` en el `<head>` del layout + declararlas en `@theme` de globals.css.
- Lección: en entornos sin red, `next/font/google` falla. `<link>` funciona igual en producción. (Optimización futura opcional: volver a next/font en Vercel para mejor CLS.)

**FALLO-02 — Tipos ensanchados por `as const`**
- Síntoma: TypeScript error al asignar `dictionaries` a tipo `Dictionary`.
- Causa: `} as const` sobre todo el objeto congelaba literales y chocaba con el tipo derivado.
- Fix: quitar el `as const` global; mantener solo los `as Status` puntuales.
- Lección: no aplicar `as const` a objetos gigantes de los que además derivas un tipo.

**FALLO-03 — characterSpacing en PDFKit**
- Síntoma: `doc.font(...).fontSize(...).fillColor(...).characterSpacing(...)` → "is not a function".
- Causa: en esta versión de PDFKit, characterSpacing no es método encadenable.
- Fix: pasarlo como opción del método `.text(txt, { characterSpacing: 1.5 })`.
- Lección: verificar la API real de la librería antes de encadenar; no asumir fluent API.

**FALLO-04 — Payload de deploy incompleto**
- Síntoma: primer deploy no incluyó 3 archivos (page.tsx, cv/page.tsx, dictionaries.ts, PDFs).
- Causa: se armó el árbol de archivos a mano y faltaron entradas.
- Fix: segundo deploy con los 15 archivos completos.
- Lección: al deployar por API con árbol manual, verificar el conteo de archivos contra el disco antes de enviar.

**FALLO-05 — Vercel Authentication (403 público)  ⚠️ ABIERTO**
- Síntoma: la URL de producción devuelve HTTP 403 a visitantes.
- Causa: Vercel activa "Vercel Authentication" (SSO/protección) por defecto en proyectos creados vía API en scope personal. NO es un fallo de build — el sitio está construido.
- Fix requerido (MANUAL, ~20 segundos):
  1. Entrar a vercel.com → proyecto `proyecto-davirson`.
  2. Settings → Deployment Protection.
  3. Desactivar "Vercel Authentication" (ponerlo en Disabled/Standard Protection off).
  4. Guardar. La URL queda pública al instante.
- Por qué no se resolvió automáticamente: el conector MCP no tiene permisos para leer/modificar la configuración del proyecto en el scope personal (endpoints devuelven 404/403).

**FALLO-06 — 403 al crear deployment en el team**
- Síntoma: redeploy con `teamId` del team → 403 "You don't have permission to create a Production Deployment for this project."
- Causa: el token del conector tiene rol limitado en el team `Davinson_Project`.
- Fix: no reintentar por esa vía. El deploy del scope personal (E-22) ya es válido; solo falta resolver FALLO-05.
- Lección: el deploy por conector queda en el scope por defecto del token. Para control total del proyecto (protección, dominio, envs), gestionar desde el dashboard o conectar el repo GitHub a Vercel manualmente.

---

## 8. RECOMENDACIÓN DE INFRAESTRUCTURA A FUTURO

El deploy directo por API (file-tree) sirvió para publicar rápido, pero deja el proyecto sin repositorio Git y en un scope con permisos limitados para el conector. **Recomendación fuerte para la próxima sesión:**

1. Crear repo en GitHub (`git init` → commit → push). El código ya está listo para ello.
2. En Vercel: "Add New Project" → importar ese repo → Deploy. Esto:
   - Da control total (protección, dominio, variables de entorno).
   - Habilita deploy automático en cada push (build in public real).
   - Evita los 403 de permisos del conector.
3. A partir de ahí, cada avance (subir TRADING_SIM a 40%, escribir /historia) es un commit → deploy automático.

Esto no descarta lo hecho: el mismo código se sube tal cual. Solo cambia el canal de deploy a uno que tú administras.

---

## 9. PENDIENTES INMEDIATOS

- [ ] **(Usuario)** Desactivar Vercel Authentication → sitio público (FALLO-05, §7).
- [ ] **(Recomendado)** Migrar deploy a repo GitHub conectado a Vercel (§8).
- [ ] Confirmar niveles de skills finales (ya ajustados: Python 70, SQL 65, ML 60, PowerBI 55, R 50).
- [ ] Revisar los 2 PDFs generados y validar que la maquetación te convence.

## 10. ROADMAP RESTANTE

| Fase | Objetivo | Estado |
|---|---|---|
| 4 | Motor Python trading_sim → JSON → visualización interactiva en /proyectos/trading-sim | Pendiente |
| 5 | Página /historia (narrativa completa con lente de propósito) | Pendiente |
| 6 | Analítica privacy-friendly (Umami/GoatCounter) + evaluar dominio propio (~$10-15/año) | Pendiente |
| 7 | Lab (experimentos IA/datos) | Reservado |
| 8 | Blog (build in public escrito) | Reservado |
| 9 | Ventures | Reservado |
| 10 | Community + IA avanzada | Reservado (solo si hay necesidad real) |

---
*Fin de la bitácora v1.0. Actualizar este archivo tras cada sesión de trabajo significativa.*

---
