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
import { readFileSync } from "node:fs";

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
//    La lista se lee de `next.config.ts`: antes eran cuatro copiadas a mano de
//    las ocho declaradas, y una ruta nueva sin redirect pasaba en verde. Y el
//    código importa: los de ruta concreta son 308 (permanentes, cacheables) y
//    `/` se queda en 307 a propósito (D-32) — cambiarlo aquí sin cambiarlo allí,
//    o al revés, es un fallo.
const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const redirects = [...config.matchAll(/source:\s*"([^"]+)"[^}]*?permanent:\s*(true|false)/g)].map((m) => [m[1], m[2] === "true" ? 308 : 307]);
if (redirects.length === 0) failures.push("next.config.ts no declara ningún redirect, o cambió el formato y esta lectura ya no lo ve");
for (const [r, code] of redirects) await expect(r, code, `redirect al idioma por defecto, ${code === 308 ? "permanente" : "temporal a propósito (D-32)"}`);

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

// 5. FALLO-29 — cada página declara su PROPIA tarjeta social.
//
//    Next **reemplaza** el objeto `openGraph`, no lo fusiona. Una subpágina que
//    no lo declara hereda el del layout entero: `og:url` apuntando a la portada
//    y el título de la portada. Pegar `/en/cv` en LinkedIn daba la tarjeta de la
//    portada, enlazando a la portada — justo en el canal por el que este sitio
//    se reparte. Se arregló a mano en la sesión 16 y nada impedía que la
//    siguiente ruta lo volviera a olvidar.
//
//    El síntoma es exacto y barato: cuando se hereda, `og:url` deja de coincidir
//    con el canonical de la propia página. Eso es lo que se comprueba, más que
//    la tarjeta lleve imagen (una tarjeta sin imagen es una tarjeta muerta).
const pick = (html, re) => (html.match(re) ?? [])[1] ?? null;

for (const r of routes) {
  const html = await (await fetch(`${BASE}${r}`)).text();
  const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/);
  const ogUrl = pick(html, /property="og:url" content="([^"]+)"/);
  const ogImage = pick(html, /property="og:image" content="([^"]+)"/);
  const ogTitle = pick(html, /property="og:title" content="([^"]+)"/);
  const twTitle = pick(html, /name="twitter:title" content="([^"]+)"/);

  // FALLO-36 — la misma mecánica que FALLO-29, en el bloque `twitter`: el layout
  // lo declaraba una vez con los textos de la portada y las catorce subpáginas
  // publicaban la tarjeta de Twitter de la portada con el openGraph ya correcto.
  if (!twTitle) failures.push(`${r} — sin twitter:title`);
  if (ogTitle && twTitle && ogTitle !== twTitle) {
    failures.push(
      `${r} — twitter:title es «${twTitle}» y og:title es «${ogTitle}»: esta página hereda el bloque \`twitter\` del layout ` +
        `(FALLO-36). Esparce social(lang, "<ruta>", …) en su generateMetadata.`,
    );
  }

  if (!canonical) failures.push(`${r} — sin <link rel="canonical">`);
  if (!ogUrl) failures.push(`${r} — sin og:url`);
  if (!ogImage) failures.push(`${r} — sin og:image (tarjeta sin imagen)`);

  // FALLO-34: `height`/`width` como ATRIBUTO de un <svg> exigen una longitud.
  // `auto` no lo es, el navegador lo rechaza y lo grita en consola en cada
  // carga. En CSS sí es válido, así que va en el estilo. El estándar de este
  // repo es cero errores de consola, y un error tolerado enseña a ignorarla.
  const badSvg = [...html.matchAll(/<svg[^>]*?\s(?:width|height)="auto"/g)];
  if (badSvg.length) {
    failures.push(`${r} — un <svg> lleva width/height="auto" como atributo (${badSvg.length}): no es una longitud, va en el estilo (FALLO-34)`);
  }

  if (canonical && ogUrl) {
    const c = new URL(canonical).pathname;
    const o = new URL(ogUrl).pathname;
    if (c !== o) {
      failures.push(
        `${r} — og:url es ${o} y el canonical es ${c}: esta página NO declara su propio openGraph ` +
          `y hereda el del layout (FALLO-29). Añade openGraph(lang, "<ruta>", …) en su generateMetadata.`,
      );
    }
  }
}

if (failures.length === 0) {
  console.log(`✓ rutas: ${routes.length} del sitemap a 200, ${redirects.length} redirects con su código, 404, metadatos y tarjetas OG y Twitter propias en cada página`);
  process.exit(0);
}

console.error(`✗ rutas: ${failures.length} fallo(s)\n`);
for (const f of failures) console.error(`  ${f}`);
process.exit(1);
