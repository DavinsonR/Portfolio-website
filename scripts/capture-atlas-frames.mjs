#!/usr/bin/env node
/**
 * Captura el atlas año por año, un PNG por fotograma, para armar los GIF que
 * acompañan una publicación. Segundo paso: scripts/generate-atlas-gif.py.
 *
 *   npm run dev                                          # en otra terminal
 *   node scripts/capture-atlas-frames.mjs http://localhost:3000
 *
 * Habla CDP contra el Edge o el Chrome ya instalado, sin dependencias:
 * Playwright pesa 150 MB para esto, y este script no corre en CI — se corre a
 * mano cuando hay que rehacer el material.
 *
 * Cuatro cosas que no son obvias, una por intento fallido. Cada una está además
 * comentada donde vive el arreglo:
 *
 * 1. En headless la pestaña se considera oculta y el navegador deja de producir
 *    fotogramas, así que el IntersectionObserver que abre la carga del atlas
 *    dispara o no dispara según el día. El síntoma engaña: la página carga
 *    entera y el mapa se queda en "cargando" sin pedir un solo JSON. Se arregla
 *    forzando foco y ciclo de vida activo, no esperando más.
 * 2. El revelado al desplazar deja una captura casi en blanco. El estado oculto
 *    vive dentro de `.js` (components/Motion.tsx), así que quitar esa clase lo
 *    revela todo de golpe, sin esperar a que nada intersecte. Y el
 *    desplazamiento va en 'instant': con el suave de la hoja, repetirlo
 *    reinicia la animación y la sección nunca llega.
 * 3. `Page.captureScreenshot` con `captureBeyondViewport` quiere coordenadas de
 *    DOCUMENTO. `getBoundingClientRect()` las da de ventana: hay que sumarle el
 *    desplazamiento, o se captura la cabecera de la página en vez del mapa.
 * 4. El alto real del atlas cambia con las filas de la leyenda y del ranking, y
 *    un GIF no admite fotogramas de tamaños distintos. Por eso el alto del
 *    recorte es fijo por vista, y no el que mide el elemento.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? "scripts/.atlas-frames";
const PORT = 9333;

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

// Una vista por GIF. `h` es el alto fijo del recorte, en px de CSS.
const VISTAS = [
  { key: "departamentos",  lang: "es", boton: "Plano",          h: 880, anios: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
  { key: "municipios",     lang: "es", boton: "Municipios",     h: 700, anios: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
  { key: "departments",    lang: "en", boton: "Flat",           h: 880, anios: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] },
  { key: "municipalities", lang: "en", boton: "Municipalities", h: 700, anios: [2018, 2019, 2020, 2021, 2022, 2023, 2024] },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

let seq = 0;
const pendientes = new Map();
function enviar(ws, method, params = {}, sessionId) {
  const msg = { id: ++seq, method, params, ...(sessionId ? { sessionId } : {}) };
  ws.send(JSON.stringify(msg));
  return new Promise((res, rej) => pendientes.set(msg.id, { res, rej }));
}

async function main() {
  const bin = CANDIDATOS.find((p) => existsSync(p));
  if (!bin) throw new Error("No encuentro Edge ni Chrome. Añade su ruta a CANDIDATOS.");
  mkdirSync(OUT, { recursive: true });

  const navegador = spawn(bin, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--hide-scrollbars",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    // El perfil va al temporal del sistema, nunca dentro del repositorio: son
    // miles de archivos, y ESLint se cae intentando recorrer las extensiones
    // del navegador si aparecen bajo scripts/.
    `--user-data-dir=${join(tmpdir(), "atlas-frames-perfil")}`,
    // Sin una URL, Edge en headless arranca y se cierra sin abrir el puerto.
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  navegador.stderr.on("data", (b) => { stderr += b; });

  let version;
  for (let i = 0; i < 80; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      break;
    } catch {
      await dormir(500);
    }
  }
  if (!version) throw new Error(`El navegador no abrió el puerto ${PORT}.\n${stderr.slice(0, 600)}`);

  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (!m.id || !pendientes.has(m.id)) return;
    const { res, rej } = pendientes.get(m.id);
    pendientes.delete(m.id);
    if (m.error) rej(new Error(m.error.message)); else res(m.result);
  });

  const { targetId } = await enviar(ws, "Target.createTarget",
    { url: "about:blank", newWindow: true, width: 1680, height: 1150 });
  const { sessionId: S } = await enviar(ws, "Target.attachToTarget", { targetId, flatten: true });
  await enviar(ws, "Page.enable", {}, S);
  await enviar(ws, "Runtime.enable", {}, S);
  await enviar(ws, "Emulation.setDeviceMetricsOverride",
    { width: 1680, height: 1150, deviceScaleFactor: 2, mobile: false }, S);
  // El atlas no pide sus datos hasta que un IntersectionObserver ve su sección
  // (components/atlas/Atlas.tsx). En headless la pestaña se considera oculta y
  // el navegador deja de producir fotogramas, así que ese observador dispara o
  // no dispara según el día: el síntoma es un "cargando" eterno sin una sola
  // petición a /atlas/. Estas dos órdenes fuerzan a tratar la página como
  // visible y enfocada, y con eso la carga es determinista.
  await enviar(ws, "Emulation.setFocusEmulationEnabled", { enabled: true }, S);
  await enviar(ws, "Page.setWebLifecycleState", { state: "active" }, S);

  const evaluar = async (expression) => {
    const r = await enviar(ws, "Runtime.evaluate",
      { expression, returnByValue: true, awaitPromise: true }, S);
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} :: ${expression.slice(0, 90)}`);
    return r.result.value;
  };

  let idiomaCargado = null;
  for (const v of VISTAS) {
    // Las dos vistas de un idioma viven en la misma página: se navega solo al
    // cambiar de idioma. Volver a navegar a la misma URL deja el atlas a medio
    // montar y la comprobación de abajo se cae.
    if (v.lang !== idiomaCargado) {
      await enviar(ws, "Page.navigate", { url: `${BASE}/${v.lang}/research/fintech-inclusion` }, S);
      await dormir(2000);

      // El bundle del atlas y sus JSON tardan; se espera al dato, no a un reloj.
      // En `next dev` la primera visita a una ruta la compila, así que la
      // ventana es larga a propósito.
      let estado = null;
      for (let i = 0; i < 180; i++) {
        // El desplazamiento va DENTRO del bucle a propósito: el atlas no pide
        // sus datos hasta que su sección entra en pantalla (IntersectionObserver
        // con 600px de margen, components/atlas/Atlas.tsx), y en la primera
        // vuelta su nodo puede no existir todavía.
        //
        // Y va en 'instant' porque la hoja declara scroll-behavior: smooth.
        // Con desplazamiento suave, repetir la llamada cada 500 ms reinicia la
        // animación antes de que termine: la sección nunca llega a la pantalla,
        // el observador nunca dispara y el atlas se queda en "cargando" para
        // siempre. Lo avisa CLAUDE.md para las capturas por sección.
        estado = await evaluar(`(()=>{
          document.documentElement.setAttribute('data-theme','light');
          document.documentElement.classList.remove('js');
          document.documentElement.style.scrollBehavior = 'auto';
          document.querySelector('.atlas')?.scrollIntoView({block:'center', behavior:'instant'});
          const r=document.querySelector('.atlas input[type=range]');
          return {doc: document.readyState, atlas: !!document.querySelector('.atlas'),
                  max: r ? r.max : null, paths: document.querySelectorAll('.atlas-map path').length,
                  aviso: document.querySelector('.atlas-state')?.textContent ?? null};})()`);
        if (estado.max && estado.max !== "0" && estado.paths > 5) break;
        await dormir(500);
      }
      // El error nombra la causa, no el síntoma: dice qué vio en la página.
      if (!(estado?.max && estado.max !== "0" && estado.paths > 5)) {
        throw new Error(`El atlas no cargó en /${v.lang}/research/fintech-inclusion — ${JSON.stringify(estado)}`);
      }
      idiomaCargado = v.lang;
    }

    const cambio = await evaluar(`(()=>{const b=[...document.querySelectorAll('.atlas-views button')]
      .find(b => b.textContent.trim().startsWith(${JSON.stringify(v.boton)}));
      if (b) b.click(); return !!b;})()`);
    if (!cambio) throw new Error(`No existe la vista "${v.boton}" en ${v.lang}`);
    // La vista municipal dibuja más de mil polígonos: hay que darle su tiempo.
    await dormir(v.h > 800 ? 1500 : 6000);

    for (const anio of v.anios) {
      // El rango es un input controlado por React: hace falta el setter nativo,
      // o React no se entera del cambio de valor.
      await evaluar(`(()=>{const r=document.querySelector('.atlas input[type=range]');
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(r,'${anio}');
        r.dispatchEvent(new Event('input',{bubbles:true}));
        r.dispatchEvent(new Event('change',{bubbles:true})); return r.value;})()`);
      await dormir(v.h > 800 ? 1100 : 2200);

      const caja = await evaluar(`(()=>{const e=document.querySelector('.atlas-canvas');
        const r=e.getBoundingClientRect();
        return {x:Math.round(r.left+window.scrollX), y:Math.round(r.top+window.scrollY),
                w:Math.round(r.width)};})()`);
      const { data } = await enviar(ws, "Page.captureScreenshot", {
        format: "png",
        clip: { x: caja.x, y: caja.y, width: caja.w + 8, height: v.h, scale: 1 },
        captureBeyondViewport: true,
      }, S);
      writeFileSync(join(OUT, `${v.key}-${anio}.png`), Buffer.from(data, "base64"));
      process.stdout.write(`  ${v.key} ${anio}\n`);
    }
  }

  ws.close();
  navegador.kill();
  console.log(`\nFotogramas en ${OUT}. Ahora: python scripts/generate-atlas-gif.py`);
  process.exit(0);
}

main().catch((e) => {
  console.error("FALLO:", e.message);
  process.exit(1);
});
