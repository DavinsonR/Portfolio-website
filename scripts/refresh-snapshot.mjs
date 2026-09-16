// ============================================================
// Refresca la instantánea del laboratorio — `npm run snapshot`
//
// POR QUÉ EXISTE. La página de trading lee `exports/index.json` del repositorio
// del pipeline desde `raw.githubusercontent.com`, en el navegador. Funciona
// perfectamente... salvo en la red desde la que este sitio se lee de verdad:
// muchas redes corporativas bloquean ese host, y quien abre el portafolio desde
// la oficina ve un mensaje de error donde debería estar el mejor trabajo del
// autor. No es hipotético — `docs/PRODUCT.md` ya documenta que esos filtros
// bloqueaban el `*.vercel.app` anterior por «hosting personal».
//
// QUÉ HACE. Guarda una copia del índice en `public/`, servida desde el MISMO
// origen. Si la lectura en vivo falla, la página cae a esta copia y sigue
// enseñando el hallazgo —1.392 variantes, una de cada ocho sobrevive fuera de
// muestra— con su fecha a la vista, en vez de un error.
//
// Solo el ÍNDICE. Las curvas por activo son ~50 KB cada una por 48 activos: eso
// no cabe en una instantánea y además no es lo que sostiene el argumento. Si un
// activo concreto no carga, la página ya degrada sola.
//
// La copia se versiona, como el `.tex` y la figura del atlas: el build no
// depende de la red. Se refresca a mano de vez en cuando; quedarse atrás no
// rompe nada, solo envejece el respaldo.
// ============================================================
import fs from "node:fs";
import path from "node:path";

const SRC = "https://raw.githubusercontent.com/DavinsonR/market-data-medallion/main/exports/index.json";
const OUT = path.join(process.cwd(), "public", "trading-sim-snapshot", "index.json");

const res = await fetch(SRC);
if (!res.ok) throw new Error(`No se pudo leer el índice en vivo: HTTP ${res.status}`);
const data = await res.json();

if (!data.leaderboard?.length || !data.assets?.length) {
  throw new Error("El índice llegó sin leaderboard o sin activos; no se sobrescribe la instantánea.");
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data), "utf8");

const kb = (n) => (n / 1024).toFixed(0);
console.log(`✓ public/trading-sim-snapshot/index.json  ${kb(fs.statSync(OUT).size)} KB`);
console.log(`  generado por el pipeline: ${data.generated_at}`);
console.log(`  ${data.assets.length} activos · ${data.leaderboard.length} filas de leaderboard`);
