/* La selección que comparten las piezas del laboratorio y el panel: una economía
   elegida en cualquiera viaja a las demás. Es un almacén de módulo y no un contexto de
   React porque las piezas son islas separadas en la página, sin un padre común. */

import { useSyncExternalStore } from "react";
import type { Freq } from "@/lib/data/forecast-lab";

export type Sel = { freq: Freq; iso3: string };

let sel: Sel = { freq: "anual", iso3: "COL" };
const subs = new Set<() => void>();

export function setSel(patch: Partial<Sel>) {
  sel = { ...sel, ...patch };
  subs.forEach((f) => f());
}

export function useSel(): Sel {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => sel,
    () => sel,
  );
}
