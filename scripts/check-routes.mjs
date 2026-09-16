// ============================================================
// Humo de rutas — `npm run check:routes` (contra `next start` ya corriendo)
//
// La bitácora registra DOS rutas que devolvían 200 cuando debían devolver 404,
// y un redirect de idioma que faltaba y dejaba una URL en 404. Las tres las
// encontró una auditoría a mano, meses después. Esto las habría atrapado en el
// primer push.
//
// Las rutas NO se listan aquí: se leen del `sitemap.xml` que el build publica.
// Una lista copiada se desincroniza —es exactamente el fallo que se quiere
// evitar—, y además así se comprueba de paso que el sitemap dice la verdad.
//
//   node scripts/check-routes.mjs [baseUrl]     (por defecto http://127.0.0.1:3000)
// ============================================================
const BASE = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");

/** `next start` tarda en aceptar conexiones y el paso de CI que lo arranca no
 *  espera. Sin esto el primer fetch falla por carrera, no por un defecto. */
async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      await fetch(`${BASE}/en`, { redirect: "manual" });
      return;
    } catch {
      if (Date.now() > deadline) throw new Error(`El servidor no respondió en ${BASE} tras ${timeoutMs / 1000}s`);
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

const failures = [];

async function expect(pathname, want, label) {
  const res = await fetch(`${BASE}${pathname}`, { redirect: "manual" });
  const ok = Array.isArray(want) ? want.includes(res.status) : res.status === want;
  const wanted = Array.isArray(want) ? want.join(" o ") : want;
  if (!ok) failures.push(`${pathname} → ${res.status}, se esperaba ${wanted} (${label})`);
  return res;
}

await waitForServer();

// 1. Todo lo que el sitemap anuncia tiene que existir.
const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (routes.length === 0) failures.push("sitemap.xml no publicó ninguna <loc>");
for (const r of routes) await expect(r, 200, "anunciada en el sitemap");

// 2. Los redirects sin idioma. Sin ellos esas URL dan 404, y ya pasó una vez.
for (const r of ["/", "/cv", "/projects/tracking", "/research/fintech-inclusion"]) {
  await expect(r, [307, 308], "redirect al idioma por defecto");
}

// 3. Lo que NO debe existir. `dynamicParams = false` es lo que lo garantiza:
//    sin él, `/pricing` devolvía 200 con la portada dentro de `<html lang="pricing">`
//    y con `robots: index` — una granja de soft-404 indexable.
for (const r of ["/pricing", "/es/no-existe", "/en/no-existe", "/es-CO"]) {
  await expect(r, 404, "debe ser 404");
}

// 4. Los artefactos de metadatos que el sitio declara.
for (const r of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/icon.svg", "/apple-icon.png", "/.well-known/security.txt"]) {
  await expect(r, 200, "artefacto declarado");
}

if (failures.length === 0) {
  console.log(`✓ rutas: ${routes.length} del sitemap a 200, redirects, 404 y metadatos correctos`);
  process.exit(0);
}

console.error(`✗ rutas: ${failures.length} fallo(s)\n`);
for (const f of failures) console.error(`  ${f}`);
process.exit(1);
