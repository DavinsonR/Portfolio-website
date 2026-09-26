/* Carga varios JSON del contrato a la vez y los entrega juntos, o ninguno. Cada archivo
   se pide una sola vez por sesión (la caché vive en lib/data/forecast-lab.ts), así que
   varias islas que piden lo mismo comparten la petición. */

import { useEffect, useState } from "react";

type Loaders = Record<string, () => Promise<unknown>>;
type Result<L extends Loaders> = { [K in keyof L]: Awaited<ReturnType<L[K]>> };

export function useLoadAll<L extends Loaders>(loaders: L, key: string) {
  const [state, setState] = useState<{ data: Result<L> | null; failed: boolean }>({ data: null, failed: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    const keys = Object.keys(loaders);
    Promise.all(keys.map((k) => loaders[k]())).then(
      (vals) => alive && setState({ data: Object.fromEntries(keys.map((k, i) => [k, vals[i]])) as Result<L>, failed: false }),
      () => alive && setState({ data: null, failed: true }),
    );
    return () => {
      alive = false;
    };
    // Los cargadores son constantes de módulo; la clave y el reintento deciden cuándo pedir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
