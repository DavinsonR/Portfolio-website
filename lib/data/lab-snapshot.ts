// ============================================================
// SOLO SERVIDOR. Importa la instantánea entera del índice (≈310 KB) para
// derivar las cifras del laboratorio en el build. Ningún componente de
// cliente puede importar este módulo, o el JSON viaja al navegador: los
// componentes de cliente reciben `LabStats` (cuatro números) como prop y
// piden el índice vivo por su cuenta (`components/trading/LabText.tsx`).
//
// La instantánea se refresca con `npm run snapshot`. Sin refrescarla, el HTML
// lleva la cifra de la última vez que alguien lo corrió; el navegador la
// corrige con el dato vivo, pero el buscador y la red que bloquea scripts ven
// la del build. Por eso va en la rutina de publicación (CLAUDE.md).
// ============================================================
import snapshot from "@/public/trading-sim-snapshot/index.json";
import { labStatsFrom, type LabStats } from "./lab-stats";
import type { IndexData } from "./trading-sim";

const data = snapshot as unknown as IndexData;
const stats = labStatsFrom(data);

// Un build sin cifras del laboratorio es un build roto, no una página con un
// hueco: que falle aquí, con el motivo, y no en silencio en el HTML.
if (!stats) {
  throw new Error(
    "public/trading-sim-snapshot/index.json no trae overfitting.overall, y de ahí salen las cifras del " +
      "laboratorio (titular, portada, historia). Corre `npm run snapshot` y mira qué exportó el pipeline.",
  );
}

export const labSnapshot: LabStats = stats;
/** El bloque entero de sobreajuste (total + filas por nº de señales, ~2 KB):
 *  con él el panel del laboratorio pinta el veredicto y las dos gráficas en
 *  el servidor, antes de que llegue el índice vivo. */
export const labSnapshotOverfitting = data.overfitting ?? null;
export const labSnapshotGeneratedAt = data.generated_at;
/** Activos en el índice (la banda de cifras de la página del laboratorio). */
export const labSnapshotAssets = data.assets?.length ?? 0;
/** El índice entero, para las maquetas del informe Power BI (solo servidor). */
export const labSnapshotData = data;
