"use client";

// ============================================================
// CONSTELLATION FIELD — la retícula viva detrás de la cabecera.
//
// Adaptación de un componente de terceros. Lo que llegó era una portada
// completa: `h-screen`, fondo `slate-950` fijo, un título «CONSTELLATION» a 9xl
// en monoespaciada, un acento cian propio y etiquetas hexadecimales inventadas
// sobre cada nodo. Nada de eso podía entrar tal cual, y cada cambio tiene su
// motivo escrito abajo. Lo que SÍ se conservó es la idea: una malla elástica
// que reacciona al cursor con una onda de choque proporcional a su velocidad.
//
// QUÉ SE CAMBIÓ, Y POR QUÉ
//
// 1. CERO COLORES PROPIOS. El original traía `#38bdf8`. `docs/DESIGN.md` dice
//    que un color nuevo sale de los tokens que ya existen y que no se inventa
//    un tercer acento. Aquí se leen `--color-rule`, `--color-coldline` y
//    `--color-cold` de la hoja en tiempo de ejecución, así que la retícula
//    sigue el tema —incluido el conmutador manual de `data-theme`, que un
//    `prefers-color-scheme` solo no ve— y no puede desincronizarse del sistema.
//
// 2. SIN TEXTO. El original pintaba `7A:3F` sobre cada nodo. En un sitio cuya
//    regla es «verificable o no se publica», unas coordenadas inventadas son
//    exactamente la clase de adorno que finge ser un dato. Fuera.
//
// 3. SIN TIPOGRAFÍA NUEVA. Esta hoja no tiene monoespaciada (DESIGN.md), así
//    que el título a 9xl y el `font-mono` no tenían dónde caer.
//
// 4. ES UN FONDO, NO UNA PORTADA. Va detrás de la cabecera que ya existe, con
//    `pointer-events-none` para no comerse ni un clic de los botones del hero,
//    y con la altura de su contenedor en vez de la de la pantalla.
//
// 5. O(n) EN VEZ DE O(n²). El original comparaba cada nodo con todos los demás
//    para decidir qué unir: 240 nodos son 28.680 comparaciones por fotograma, y
//    a pantalla completa eran cientos de miles. Como la malla ES una retícula,
//    los vecinos se conocen por índice: cada nodo se une a su derecho y a su
//    inferior. Mismo dibujo, coste lineal.
//
// 6. NO CORRE CUANDO NADIE LA VE. Un `requestAnimationFrame` eterno en la
//    portada de un sitio que presume de 0,4 s es una contradicción. Se para
//    cuando la pestaña se oculta y cuando la cabecera sale de pantalla — la
//    lección de FALLO-30, donde «diferido» resultó no diferir nada.
//
// 7. `prefers-reduced-motion` PINTA UN FOTOGRAMA Y SE CALLA. La retícula queda,
//    quieta. No es una degradación: es el mismo dibujo sin movimiento.
// ============================================================

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; bx: number; by: number };

/** Separación de la retícula. A 46 px una cabecera de 1080×420 son ~230 nodos:
 *  suficiente para que se lea como malla y barato de integrar cada fotograma. */
const SPACING = 46;
const MOUSE_RADIUS = 190;
const SPRING_K = 18;
const DAMPING = 0.82;

/** Lee un token de color de la hoja y lo devuelve como `r, g, b` para poder
 *  componerlo con alfa. Si el token no existe o viene en un formato que el
 *  navegador no resuelve a `rgb()`, se devuelve `null` y el trazo se omite:
 *  vale más una retícula incompleta que una con un color inventado. */
function readToken(name: string): string | null {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return null;
  const probe = document.createElement("span");
  probe.style.color = raw;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const m = resolved.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `${m[1]}, ${m[2]}, ${m[3]}` : null;
}

export default function ConstellationField() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let nodes: Node[] = [];
    let onScreen = true;
    let last = performance.now();

    // Los tres tokens, releídos cuando cambia el tema.
    let cLine = "216, 221, 227";
    let cNode = "185, 207, 228";
    let cLive = "15, 76, 129";
    const readTokens = () => {
      cLine = readToken("--color-rule") ?? cLine;
      cNode = readToken("--color-coldline") ?? cNode;
      cLive = readToken("--color-cold") ?? cLive;
    };

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
      nodes = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * SPACING;
          const y = j * SPACING;
          nodes.push({ x, y, vx: 0, vy: 0, bx: x, by: y });
        }
      }
    };

    /** La malla se apaga hacia la izquierda, donde están el nombre y el
     *  veredicto, que es lo que la cabecera tiene que decir. El desvanecido va
     *  DENTRO del dibujo y no como una caja con degradado encima: `DESIGN.md`
     *  dice «ni degradados», y una capa así además tendría que adivinar el
     *  color del papel en cada tema. Aquí es la propia figura la que se apaga,
     *  como la rampa del atlas. */
    const fade = (x: number) => {
      const t = w > 0 ? x / w : 1;
      return Math.min(1, Math.max(0, (t - 0.18) / 0.5));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Aristas: derecha e inferior de cada nodo. Cada par se dibuja una vez.
      ctx.lineWidth = 0.7;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const n = nodes[j * cols + i];
          for (const m of [i + 1 < cols ? nodes[j * cols + i + 1] : null, j + 1 < rows ? nodes[(j + 1) * cols + i] : null]) {
            if (!m) continue;
            const dx = n.x - m.x;
            const dy = n.y - m.y;
            const d = Math.hypot(dx, dy);
            // Cuanto más estirada la arista, más se desvanece: la deformación
            // se lee como tensión y no como una línea larga cualquiera.
            const a = Math.max(0, 1 - d / (SPACING * 2.1)) * 0.55 * fade((n.x + m.x) / 2);
            if (a <= 0.01) continue;
            ctx.strokeStyle = `rgba(${cLine}, ${a})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const near = d < MOUSE_RADIUS;
        const t = near ? 1 - d / MOUSE_RADIUS : 0;
        const f = fade(n.x);
        ctx.fillStyle = near ? `rgba(${cLive}, ${(0.18 + t * 0.62) * f})` : `rgba(${cNode}, ${0.5 * f})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.1 + t * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const mvx = mouse.x - mouse.px;
      const mvy = mouse.y - mouse.py;
      const speed = Math.min(Math.hypot(mvx, mvy), 90);
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_RADIUS && d > 0.01) {
          // La onda escala con la velocidad del cursor, que es lo que hacía
          // interesante al original: un barrido rápido empuja más que un paseo.
          const force = (1 - d / MOUSE_RADIUS) * (620 + speed * 26);
          n.vx -= (dx / d) * force * dt;
          n.vy -= (dy / d) * force * dt;
        }
        n.vx = (n.vx + (n.bx - n.x) * SPRING_K * dt) * DAMPING;
        n.vy = (n.vy + (n.by - n.y) * SPRING_K * dt) * DAMPING;
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
      }

      draw();

      // Y se para tambien cuando NO PASA NADA. Una malla en reposo redibujada
      // a 60 fps es un fotograma identico al anterior sesenta veces por
      // segundo: el mismo desperdicio que animar fuera de pantalla, solo que
      // menos evidente. Cuando ningun nodo se mueve ni esta desplazado, y el
      // cursor esta lejos, el bucle se apaga; el siguiente movimiento del raton
      // lo vuelve a encender.
      // Se mide VELOCIDAD, no desplazamiento. Fue el primer intento y estaba
      // mal: con el cursor parado sobre la malla, los nodos alcanzan un
      // equilibrio DESPLAZADO —quietos pero lejos de casa— y una condicion que
      // exigiera desplazamiento cero no se cumplia nunca; el bucle seguia
      // redibujando una imagen que ya no cambiaba. Lo que importa es si el
      // dibujo se mueve, y eso es la velocidad. Los nodos se dejan donde estan:
      // devolverlos a casa aqui seria un salto visible.
      let motion = 0;
      for (const n of nodes) motion += Math.abs(n.vx) + Math.abs(n.vy);
      if (motion < nodes.length * 0.004) {
        stop();
        return;
      }

      raf = requestAnimationFrame(step);
    };

    // `data-running` no es andamiaje de prueba: es la unica forma de COMPROBAR
    // desde fuera que la malla se para cuando nadie la ve. Contar fotogramas no
    // sirve —un navegador suspende el rAF de una pestana en segundo plano, que
    // es justo el caso que se quiere medir— asi que el estado se publica en el
    // DOM y se verifica leyendo el atributo. Cuesta dos lineas.
    const mark = () => host.setAttribute("data-running", raf ? "yes" : "no");

    const start = () => {
      if (raf || reduced.matches || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
      mark();
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      mark();
    };

    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      start();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      // Hace falta re-arrancar: si el bucle se habia dormido con el cursor
      // parado encima, los nodos se quedarian deformados para siempre. Este
      // start() es el que los deja volver a su sitio.
      start();
    };

    readTokens();
    build();
    draw();
    mark();

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(host);

    // Sin esto, la retícula sigue integrando física con la cabecera fuera de
    // pantalla o la pestaña en segundo plano. Es la lección de FALLO-30.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "80px" },
    );
    io.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onReduced = () => {
      stop();
      if (reduced.matches) {
        for (const n of nodes) {
          n.x = n.bx;
          n.y = n.by;
          n.vx = 0;
          n.vy = 0;
        }
        draw();
      } else start();
    };
    // El tema se cambia con `data-theme` en `<html>`, y también puede moverse
    // solo con el sistema. Los dos caminos tienen que releer los tokens.
    const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => {
      readTokens();
      draw();
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    themeMedia.addEventListener("change", onTheme);
    reduced.addEventListener("change", onReduced);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      themeMedia.removeEventListener("change", onTheme);
      reduced.removeEventListener("change", onReduced);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      // `print:hidden`: la hoja se imprime, y una retícula decorativa en papel
      // es tinta gastada. `pointer-events-none` para que los botones del hero
      // sigan siendo suyos.
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none print:hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
