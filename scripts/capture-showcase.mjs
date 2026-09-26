#!/usr/bin/env node
/**
 * Captura el tablero del laboratorio de pronóstico para la vitrina de la
 * portada: public/showcase/forecast-{es,en}-{light,dark}.png. Después,
 * `python scripts/showcase-webp.py` los pasa a WebP.
 *
 *   npm run build && npx next start -p 3100            # en otra terminal
 *   node scripts/capture-showcase.mjs http://127.0.0.1:3100
 *
 * Mismo enfoque que scripts/capture-atlas-frames.mjs (CDP contra el Edge o el
 * Chrome instalado, sin dependencias) y las mismas trampas, resueltas igual:
 * foco y ciclo de vida forzados en headless, `.js` fuera para que el revelado
 * no deje la captura en blanco, y coordenadas de DOCUMENTO para el recorte.
 * No corre en CI: se corre a mano cuando el tablero cambia.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const OUT = "public/showcase";
const PORT = 9334;
const ANCHO = 1280;
const ALTO_RECORTE = 760; // filtros, KPIs y el gráfico principal: lo que cabe en una tarjeta

const CANDIDATOS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
let seq = 0;
const pendientes = new Map();
const enviar = (ws, method, params = {}, sessionId) => {
  const msg = { id: ++seq, method, params, ...(sessionId ? { sessionId } : {}) };
  ws.send(JSON.stringify(msg));
  return new Promise((res, rej) => pendientes.set(msg.id, { res, rej }));
};

const bin = CANDIDATOS.find((p) => existsSync(p));
if (!bin) throw new Error("No encuentro Edge ni Chrome. Añade su ruta a CANDIDATOS.");
mkdirSync(OUT, { recursive: true });

const navegador = spawn(bin, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--hide-scrollbars", "--disable-gpu",
  "--no-first-run", "--no-default-browser-check",
  `--user-data-dir=${join(tmpdir(), "showcase-perfil")}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

let version;
for (let i = 0; i < 80 && !version; i++) {
  try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await dormir(500); }
}
if (!version) throw new Error(`El navegador no abrió el puerto ${PORT}.`);

const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (!m.id || !pendientes.has(m.id)) return;
  const { res, rej } = pendientes.get(m.id);
  pendientes.delete(m.id);
  if (m.error) rej(new Error(m.error.message)); else res(m.result);
});

const { targetId } = await enviar(ws, "Target.createTarget", { url: "about:blank", newWindow: true, width: ANCHO, height: 1100 });
const { sessionId: S } = await enviar(ws, "Target.attachToTarget", { targetId, flatten: true });
await enviar(ws, "Page.enable", {}, S);
await enviar(ws, "Runtime.enable", {}, S);
await enviar(ws, "Emulation.setDeviceMetricsOverride", { width: ANCHO, height: 1100, deviceScaleFactor: 2, mobile: false }, S);
await enviar(ws, "Emulation.setFocusEmulationEnabled", { enabled: true }, S);
await enviar(ws, "Page.setWebLifecycleState", { state: "active" }, S);

const evaluar = async (expression) => {
  const r = await enviar(ws, "Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, S);
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} :: ${expression.slice(0, 90)}`);
  return r.result.value;
};

for (const lang of ["es", "en"]) {
  for (const tema of ["light", "dark"]) {
    await enviar(ws, "Page.navigate", { url: `${BASE}/${lang}/labs/macro-forecast` }, S);
    await dormir(2500);
    let listo = false;
    for (let i = 0; i < 120 && !listo; i++) {
      listo = await evaluar(`(()=>{
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(tema)});
        document.documentElement.classList.remove('js');
        document.documentElement.style.scrollBehavior = 'auto';
        const b = document.querySelector('.fl-board');
        b?.scrollIntoView({block:'start', behavior:'instant'});
        return !!b && b.querySelectorAll('svg path').length > 20;})()`);
      if (!listo) await dormir(500);
    }
    if (!listo) throw new Error(`El tablero no cargó en /${lang}/labs/macro-forecast`);
    await dormir(1500);
    // Se encuadra el gráfico principal (el SVG con más trazos) y su recuadro,
    // sin los filtros. Las barras pegajosas (navegación, índice de sección,
    // filtros) se quitan antes: con captureBeyondViewport se pintan encima.
    const caja = await evaluar(`(()=>{
      for (const e of document.querySelectorAll('body *')) {
        const p = getComputedStyle(e).position;
        if (p === 'sticky' || p === 'fixed') e.style.position = 'static';
      }
      document.querySelectorAll('header, [aria-label] > nav').forEach(e => { if (e.closest('main') === null) e.style.display = 'none'; });
      const svgs = [...document.querySelectorAll('.fl-board svg')];
      const big = svgs.sort((a, b) => b.querySelectorAll('path').length - a.querySelectorAll('path').length)[0];
      let tile = big; while (tile.parentElement && !tile.parentElement.classList.contains('fl-board') && tile.getBoundingClientRect().width < 900) tile = tile.parentElement;
      tile.scrollIntoView({block:'start', behavior:'instant'});
      const r = tile.getBoundingClientRect();
      return {x:Math.round(r.left+scrollX), y:Math.round(r.top+scrollY), w:Math.round(r.width), h:Math.round(r.height)};})()`);
    await dormir(600);
    const { data } = await enviar(ws, "Page.captureScreenshot", {
      format: "png", captureBeyondViewport: true,
      clip: { x: caja.x, y: caja.y, width: caja.w, height: Math.min(caja.h, ALTO_RECORTE), scale: 1 },
    }, S);
    const f = join(OUT, `forecast-${lang}-${tema}.png`);
    writeFileSync(f, Buffer.from(data, "base64"));
    console.log(`✓ ${f}`);
  }
}

navegador.kill();
process.exit(0);
