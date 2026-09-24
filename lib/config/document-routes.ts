/** Rutas que tienen que cargarse como DOCUMENTO, no con navegación de cliente.
 *
 *  La CSP es del documento: el navegador la fija con la respuesta que cargó la
 *  página y no la cambia cuando Next navega en el cliente. La página de
 *  credit-risk-mlops es la única con una política abierta al runtime del
 *  simulador (`wasm-unsafe-eval` y los dos CDN de onnxruntime-web, ver
 *  next.config.ts), así que si se llega a ella con un <Link> desde la portada, el
 *  documento sigue siendo el de la portada y su CSP estricta bloquea el runtime.
 *  Pasó en producción el 24 sep 2026: abriendo la URL funcionaba, entrando desde
 *  «Ver el proyecto», no.
 *
 *  `components/DocumentNavigation.tsx` usa esto para forzar la carga completa, y
 *  el simulador para saber si su documento lo admite. */

export const DOCUMENT_ROUTE = /^\/(?:en|es)\/projects\/credit-risk\/?$/;

/** ¿El documento se cargó desde una ruta con la política del simulador? `entry` es
 *  la URL con la que el navegador cargó el documento (la entrada de navegación de
 *  `performance`), no la de la barra, que Next cambia sin recargar. */
export function documentHasScorerPolicy(entry: string | undefined, base: string): boolean {
  if (!entry) return false;
  try {
    return DOCUMENT_ROUTE.test(new URL(entry, base).pathname);
  } catch {
    return false;
  }
}

export function loadedDocumentUrl(): string | undefined {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return nav?.name;
}
