#!/usr/bin/env node
/**
 * Captura dos pantallas del demo de Kairo para la vitrina y la página del
 * proyecto: public/tracking/{hoy,registro,historia,finanzas}-{es,en}-{light,dark}.webp.
 *
 *   node scripts/capture-kairo.mjs [https://kairo.davirson.com]
 *
 * Mismo enfoque que scripts/capture-showcase.mjs (CDP contra el Edge o el
 * Chrome instalado, sin dependencias). El tema y el idioma no se fuerzan en el
 * DOM: se ponen las cookies que la propia app lee (`jarvis_tema`,
 * `jarvis_idioma` — conservan el nombre viejo a propósito), así que la captura
 * es la pantalla que vería alguien con esa preferencia. El viewport es el de un
 * teléfono (393 px) por CDP: por línea de órdenes, el Edge sin cabeza no baja
 * de 500 px de ancho. Sale a 2× y se guarda en WebP con Pillow.
 * No corre en CI: se corre a mano cuando el demo cambia.
 */
import { spawn, execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = (process.argv[2] ?? "https://kairo.davirson.com").replace(/\/$/, "");
const HOST = new URL(BASE).hostname;
const OUT = "public/tracking";
const PORT = 9335;
const ANCHO = 393;
const ALTO = 800;
const PANTALLAS = {
  hoy: "/demo/app",
  registro: "/demo/app/registro",
  historia: "/demo/app/historia",
  finanzas: "/demo/app/finanzas",
};
const TEMA = { light: "claro", dark: "oscuro" };

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
  `--user-data-dir=${join(tmpdir(), "kairo-perfil")}`, "about:blank",
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

const { targetId } = await enviar(ws, "Target.createTarget", { url: "about:blank", newWindow: true, width: ANCHO, height: ALTO });
const { sessionId: S } = await enviar(ws, "Target.attachToTarget", { targetId, flatten: true });
await enviar(ws, "Page.enable", {}, S);
await enviar(ws, "Runtime.enable", {}, S);
await enviar(ws, "Network.enable", {}, S);
await enviar(ws, "Emulation.setDeviceMetricsOverride", { width: ANCHO, height: ALTO, deviceScaleFactor: 2, mobile: true }, S);
await enviar(ws, "Emulation.setFocusEmulationEnabled", { enabled: true }, S);

const evaluar = async (expression) => {
  const r = await enviar(ws, "Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, S);
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} :: ${expression.slice(0, 90)}`);
  return r.result.value;
};

for (const lang of ["es", "en"]) {
  for (const tema of ["light", "dark"]) {
    await enviar(ws, "Network.setCookie", { name: "jarvis_idioma", value: lang, domain: HOST, path: "/", secure: true }, S);
    await enviar(ws, "Network.setCookie", { name: "jarvis_tema", value: TEMA[tema], domain: HOST, path: "/", secure: true }, S);
    await enviar(ws, "Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: tema }] }, S);
    for (const [nombre, ruta] of Object.entries(PANTALLAS)) {
      await enviar(ws, "Page.navigate", { url: `${BASE}${ruta}` }, S);
      let listo = false;
      for (let i = 0; i < 60 && !listo; i++) {
        await dormir(500);
        listo = await evaluar(`document.readyState === 'complete' && !!document.querySelector('main')`);
      }
      if (!listo) throw new Error(`No cargó ${BASE}${ruta}`);
      await dormir(2500); // animaciones de entrada y la píldora de la barra
      const { data } = await enviar(ws, "Page.captureScreenshot", { format: "png" }, S);
      const png = join(OUT, `${nombre}-${lang}-${tema}.png`);
      writeFileSync(png, Buffer.from(data, "base64"));
      execFileSync("python", ["-c",
        `from PIL import Image; Image.open(r"${png}").convert("RGB").save(r"${png.replace(/\.png$/, ".webp")}", "WEBP", quality=84, method=6)`]);
      unlinkSync(png);
      console.log(`✓ ${png.replace(/\.png$/, ".webp")}`);
    }
  }
}

navegador.kill();
process.exit(0);
