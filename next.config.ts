import type { NextConfig } from "next";

/** English is the default: most decision-makers for these roles read English,
 *  and the Spanish routes stay one click away from every page. */
const nextConfig: NextConfig = {
  // Un sitio que se toma la molestia de `default-src 'none'` no anuncia su
  // framework en cada respuesta.
  poweredByHeader: false,
  async redirects() {
    return [
      // `/` se queda en 307 A PROPÓSITO (D-32): es el único sitio donde una
      // detección de idioma por Accept-Language tendría sentido algún día, y un
      // 308 queda cacheado en el navegador del visitante sin fecha de caducidad —
      // lo congelaría. Los ocho de ruta concreta son decisiones permanentes de
      // arquitectura y van en 308: consolidan señal y se cachean. `check:routes`
      // lee esta lista y exige exactamente esos códigos.
      { source: "/", destination: "/en", permanent: false },
      { source: "/cv", destination: "/en/cv", permanent: true },
      { source: "/projects/credit-risk", destination: "/en/projects/credit-risk", permanent: true },
      { source: "/projects/trading-sim", destination: "/en/projects/trading-sim", permanent: true },
      { source: "/projects/powerbi", destination: "/en/projects/powerbi", permanent: true },
      { source: "/projects/tracking", destination: "/en/projects/tracking", permanent: true },
      { source: "/research/fintech-inclusion", destination: "/en/research/fintech-inclusion", permanent: true },
      { source: "/labs/macro-forecast", destination: "/en/labs/macro-forecast", permanent: true },
      { source: "/historia", destination: "/en/historia", permanent: true },
    ];
  },
  /** Cabeceras de seguridad.
   *
   *  Sobre `script-src 'unsafe-inline'`: es deliberado y es el único camino aquí.
   *  El HTML construido lleva tres scripts en línea — el del tema, el arranque de
   *  `__next_f` y el payload RSC de hidratación. El tercero es distinto en cada
   *  página (90–133 KB) y cambia con cada edición del contenido, así
   *  que una CSP por hash exigiría once hashes regenerados en cada commit, y
   *  `headers()` se evalúa antes de renderizar las páginas: no puede conocerlos.
   *  Un nonce obligaría a renderizar en servidor, que es justo lo que este sitio
   *  no hace. Y ojo: en cuanto se declara un hash, el navegador ignora
   *  `'unsafe-inline'` (CSP3) y la hidratación muere. No se pueden mezclar.
   *
   *  Lo que esta CSP sí compra —y era lo que faltaba— es `default-src 'none'` y
   *  `connect-src`: una dependencia comprometida (d3 corre en el navegador del
   *  visitante) no puede cargar un script de otro origen ni exfiltrar a un host
   *  arbitrario. Ese es el escenario realista en un sitio sin sesión ni datos;
   *  el XSS no lo es, porque aquí no hay nada que robar.
   *
   *  `style-src-attr` va aparte para que la hoja de estilo quede estricta: los
   *  43 atributos `style=` del HTML no obligan a abrir `style-src` entero. */
  async headers() {
    /** La demo WASM vive fuera de esta CSP, a proposito.
     *
     *  `public/credit-risk-demo/` sirve un modelo de credito real puntuando en el
     *  navegador: carga onnxruntime-web desde cdnjs y su binario .wasm desde
     *  jsdelivr, y compilar WebAssembly exige `wasm-unsafe-eval`. Nada de eso
     *  cabe en `default-src 'none'` + `script-src 'self'`.
     *
     *  La alternativa era aflojar la CSP del sitio entero para una sola pagina, y
     *  eso es exactamente el trato que no conviene: la politica de arriba es la que
     *  protege las paginas que el visitante sí usa. Asi que la regla general
     *  EXCLUYE esa ruta --por eso el lookahead-- y la demo lleva la suya, mas
     *  permisiva pero acotada a su carpeta y con los origenes nombrados uno por uno.
     *
     *  Sin la exclusion no serviria de nada: cuando dos cabeceras CSP coinciden en
     *  la misma respuesta, el navegador aplica la INTERSECCION, asi que la regla
     *  estricta seguiria bloqueando la demo.
     *
     *  El <script> del runtime va con `integrity`, de modo que el unico permiso de
     *  origen externo que se concede esta atado a un hash concreto. */
    const demo = "credit-risk-demo";
    // En `next dev` la CSP estricta bloquea los <style> que inyecta HMR y el
    // script de depuración de Vercel Analytics (va.vercel-scripts.com): la
    // consola se llenaba de violaciones que tapaban los errores reales. Solo en
    // desarrollo se abren esas dos puertas; la política publicada no cambia.
    const dev = process.env.NODE_ENV !== "production";
    /** Caché para `public/`. Next sirve todo lo que hay ahí con
     *  `max-age=0, must-revalidate`: las dos fuentes precargadas, el modelo de
     *  1,9 MB y los 1,8 MB del atlas se revalidaban en cada visita (un RTT por
     *  activo, en la ruta crítica del render en el caso de las fuentes). Las
     *  fuentes no cambian nunca —si cambian, se renombra el fichero—; el resto
     *  cambia con un commit y una hora de caché con revalidación en segundo
     *  plano no deja a nadie viendo algo viejo más de eso. `check:routes` exige
     *  que una fuente lleve `max-age` mayor que cero. */
    const cache = (source: string, value: string) => ({ source, headers: [{ key: "Cache-Control", value }] });
    const immutable = "public, max-age=31536000, immutable";
    const hourly = "public, max-age=3600, stale-while-revalidate=604800";
    const weekly = "public, max-age=604800, stale-while-revalidate=2592000";
    return [
      cache("/fonts/:path*", immutable),
      cache(`/${demo}/model.onnx`, immutable),
      cache("/atlas/:path*", hourly),
      cache("/forecast-lab/:path*", hourly),
      cache("/trading-sim-snapshot/:path*", hourly),
      cache("/og-:lang.png", weekly),
      cache("/icon-:size.png", weekly),
      cache("/tableau/:path*", weekly),
      cache("/tracking/:path*", weekly),
      cache("/:name*.pdf", "public, max-age=86400, stale-while-revalidate=604800"),
      {
        source: `/:path((?!${demo}).*)`,
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // `browsing-topics` es lo que sustituyó a FLoC (`interest-cohort`); se
          // dejan los dos porque los navegadores ignoran la directiva que no conocen.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()" },
          // Cierra la referencia `window.opener` entre orígenes. Coste cero: nada
          // aquí depende de una ventana abierta desde otro sitio.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'none'",
              dev ? "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com" : "script-src 'self' 'unsafe-inline'",
              dev ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
              "style-src-attr 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data:",
              // El laboratorio de trading lee los JSON del pipeline en cliente.
              "connect-src 'self' https://raw.githubusercontent.com",
              "manifest-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        source: `/${demo}/:path*`,
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'none'",
              // El runtime viene de cdnjs con integrity; wasm-unsafe-eval es lo
              // que permite COMPILAR el modulo, no evaluar JavaScript arbitrario.
              //
              // jsdelivr tambien esta en script-src y no solo en connect-src: ort
              // 1.19 carga su backend como un MODULO (ort-wasm-simd-threaded.mjs)
              // antes de traerse el .wasm, asi que el navegador lo trata como
              // script. Con la CSP sin ese origen la demo moria en
              // "no available backend found" -- y en un servidor estatico sin CSP
              // funcionaba, que es justo la clase de diferencia que hay que probar
              // contra el entorno real y no contra el comodo.
              //
              // LIMITE DECLARADO: el `integrity` cubre ort.min.js y nada mas. Los
              // sub-recursos que el runtime pide despues no llevan hash, solo
              // version fijada en la URL. No se disimula.
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              // model.onnx y contract.json son del mismo origen; el .wasm, de jsdelivr.
              "connect-src 'self' https://cdn.jsdelivr.net",
              "worker-src 'self' blob:",
              "img-src 'self' data:",
              "font-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
