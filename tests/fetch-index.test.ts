// ============================================================
// `fetchIndex` tiene que caer a la instantánea del propio origen cuando el
// dato vivo falla (la red corporativa que bloquea raw.githubusercontent.com),
// y `fetchIndexShared` tiene que pedir una sola vez por página — pero NO
// cachear un fallo, o el botón de reintentar no reintentaría nada.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchIndex, fetchIndexShared, INDEX_URL, SNAPSHOT_INDEX_URL } from "../lib/data/trading-sim";

type Call = { url: string };
const calls: Call[] = [];

function stubFetch(handler: (url: string) => Response | Promise<Response>) {
  calls.length = 0;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push({ url });
    return handler(url);
  }) as typeof fetch;
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("con el dato vivo, fuente «live» y una sola petición", async () => {
  stubFetch((url) => (url === INDEX_URL ? json({ generated_at: "x" }) : json({}, 404)));
  const r = await fetchIndex<{ generated_at: string }>();
  assert.equal(r.source, "live");
  assert.equal(r.data.generated_at, "x");
  assert.equal(calls.length, 1);
});

test("si el dato vivo falla, cae a la instantánea del mismo origen", async () => {
  stubFetch((url) => (url === INDEX_URL ? json({}, 403) : url === SNAPSHOT_INDEX_URL ? json({ generated_at: "snap" }) : json({}, 404)));
  const r = await fetchIndex<{ generated_at: string }>();
  assert.equal(r.source, "snapshot");
  assert.equal(r.data.generated_at, "snap");
  assert.deepEqual(
    calls.map((c) => c.url),
    [INDEX_URL, SNAPSHOT_INDEX_URL],
  );
});

test("fetchIndexShared pide una vez por página y no cachea un fallo", async () => {
  // Primero falla todo: la promesa compartida se descarta.
  stubFetch(() => json({}, 500));
  await assert.rejects(fetchIndexShared());
  // Luego funciona: una petición, y la segunda llamada reutiliza la misma promesa.
  stubFetch((url) => (url === INDEX_URL ? json({ generated_at: "live" }) : json({}, 404)));
  const [a, b] = await Promise.all([fetchIndexShared<{ generated_at: string }>(), fetchIndexShared<{ generated_at: string }>()]);
  assert.equal(a.data.generated_at, "live");
  assert.equal(a, b);
  assert.equal(calls.length, 1);
});
