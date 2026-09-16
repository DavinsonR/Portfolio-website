import type { NextConfig } from "next";

/** English is the default: most decision-makers for these roles read English,
 *  and the Spanish routes stay one click away from every page. */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/cv", destination: "/en/cv", permanent: false },
      { source: "/projects/credit-risk", destination: "/en/projects/credit-risk", permanent: false },
      { source: "/projects/trading-sim", destination: "/en/projects/trading-sim", permanent: false },
      { source: "/projects/powerbi", destination: "/en/projects/powerbi", permanent: false },
      { source: "/projects/tracking", destination: "/en/projects/tracking", permanent: false },
      { source: "/research/fintech-inclusion", destination: "/en/research/fintech-inclusion", permanent: false },
    ];
  },
  /** Cabeceras de seguridad.
   *
   *  Sobre `script-src 'unsafe-inline'`: es deliberado y es el único camino aquí.
   *  El HTML construido lleva tres scripts en línea — el del tema, el arranque de
   *  `__next_f` y el payload RSC de hidratación. El tercero es distinto en cada
   *  página (90–133 KB) y cambia con cada edición de `lib/dictionaries.ts`, así
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
    return [
      {
        source: `/:path((?!${demo}).*)`,
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'none'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self'",
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
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
