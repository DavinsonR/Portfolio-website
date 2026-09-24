"use client";

/* Fuerza la carga completa de las rutas que tienen su propia CSP.

   Un solo escuchador en fase de captura sobre `window`, en vez de cambiar cada
   <Link> que apunta a la página de crédito (hay seis sitios que la enlazan, y el
   séptimo lo añadiría alguien sin saber esto). Si el clic va a una de esas rutas y
   el documento actual no tiene su política, se corta la propagación ANTES de que
   React la reparta: el <Link> de Next nunca se entera, no hace preventDefault, y el
   navegador sigue el href como un enlace normal — carga el documento, con su CSP.

   Se respetan los clics que un enlace normal no convierte en navegación de la misma
   pestaña: modificadores, botón central, target distinto, descargas. */

import { useEffect } from "react";
import { DOCUMENT_ROUTE, documentHasScorerPolicy, loadedDocumentUrl } from "@/lib/config/document-routes";

export default function DocumentNavigation() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !DOCUMENT_ROUTE.test(url.pathname)) return;
      // Ya estamos en un documento con esa política (p. ej. un ancla de la propia
      // página, o el cambio de idioma): la navegación de cliente sirve.
      if (documentHasScorerPolicy(loadedDocumentUrl(), location.href)) return;
      e.stopPropagation();
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
