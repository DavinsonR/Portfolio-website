## Sesión 19 — 23 sep 2026 · Las cifras del laboratorio dejan de escribirse a mano, y el PDF de una página lleva por fin un resultado

Sesión 2 del plan de la [auditoría](../AUDITORIA-2026-09-23.md). Encargo: «continuemos».

### El problema, medido

El titular de `/projects/trading-sim` decía «Sobrevivieron menos de 50». La portada, «publiqué las 1.342 que no». La historia, «menos de cincuenta». El CV, «solo el 13 %». Cuatro superficies, cuatro cifras escritas a mano sobre un dato que el pipeline recalcula cada noche: la instantánea del 16 sep tenía **51** supervivientes (14,8 %), el índice vivo del 23 sep tiene **45** (13,0 %). «Menos de 50» era mentira la semana pasada y verdad esta; «1.342» era falso las dos (1.341 y 1.347). Y el bloque de estadísticas de la misma página, que sí lee el dato, lo desmentía en pantalla. En un sitio cuya tesis es «verificable o no se publica», es el único defecto que se paga caro.

### Lo que se hizo

**Derivar, no escribir.** `lib/data/lab-stats.ts` saca de `overfitting.overall` los cuatro números y rellena plantillas del diccionario: `{variants}`, `{survivors}`, `{eliminated}`, `{oneIn}` («una de cada ocho», con letra, redondeado de la tasa), `{survivalPct}`. Dos fuentes: en el build, la instantánea versionada (`lib/data/lab-snapshot.ts`, solo servidor: importa 310 KB que ningún componente de cliente puede tocar); en el navegador, el índice vivo (`components/trading/LabText.tsx`, que pinta el texto del servidor y lo actualiza si llega el dato). Nueve textos pasan a plantilla: el `h1` del laboratorio, la nota de la cifra en la portada, la nota de la fila de la mesa, el embudo, cuatro frases de `/historia`. El CV, que es un PDF y no puede derivar, pasa a una formulación robusta a la deriva: «menos de una de cada seis», cierta con 13 % y con 15 %.

**Una sola lectura del índice por página.** `fetchIndexShared()` en `lib/data/trading-sim.ts`: la portada lo pedía dos veces (sello del pipeline y ahora las cifras) y el laboratorio dos (panel y titular). El sello sigue aceptando solo el dato vivo —una fecha de instantánea bajo «pipeline en vivo» sería la misma trampa que lo motivó—.

**La evidencia en el HTML.** El panel del laboratorio recibe el bloque de sobreajuste de la instantánea como valor inicial y pinta el veredicto (1.392 / 346 / 45 / 13,0 %), el embudo y las dos gráficas por nº de señales en el servidor. Antes el HTML servido decía literalmente «loading pipeline data…» y un buscador, o una red que bloquea scripts, no veía ni una cifra. Solo el explorador, que necesita el índice entero, espera; el error, si llega, ocupa su sitio sin borrar lo que ya se ve.

**`check:figures` ampliado**, en las tres direcciones que la auditoría señaló: (1) entiende números escritos con letra, 0–99, en los dos idiomas —«treinta y tres», «twenty-two»— porque la banda de JARVIS dice «34 tablas» y su prosa «treinta y tres» y el patrón solo veía dígitos; (2) lee también `README.md` y `README.es.md`, que afirman cifras y nadie leía (114 menciones ahora, 107 antes); (3) falla si un fichero tiene bloque `es` y el corte no encuentra el `en`, que era el tercer modo de quedarse ciega; y (4) **falla si alguien vuelve a escribir a mano una cifra del laboratorio** («menos de 50», «una de cada ocho», «1.34x que no») — probado a propósito: dos coincidencias, código 1, y en verde al quitarlas.

**El PDF de una página** (`buildOnePage`): la viñeta que se queda por rol ya no es «la primera» sino **la que lleva una cifra** —el Treasury Analyst sale ahora con «unas 60 horas al mes devueltas al equipo» en vez de «automaticé la conciliación»—; una línea de certificaciones bajo Educación (el Stanford ML que un screener de datos busca primero); y los términos de contratación bajo la cabecera, de la misma fuente que el bloque ámbar de la portada: «Nivel: Senior Analyst · Inicio: preaviso de 15 días · Vía: B2B o EOR, sin patrocinio de visa». Sigue cabiendo en una página: `check:artifacts` cuenta.

**La instantánea, refrescada** con `npm run snapshot` (índice del 23 sep) y la rutina escrita en `CLAUDE.md`: **`npm run snapshot` antes de publicar**, o el HTML lleva la cifra de la última vez que alguien lo corrió.

### Lo que se verificó

`npm run check` en verde. `npm run cv` + `check:artifacts` en verde (cuatro `.tex`, cuatro PDF, la hoja corta en una página). `npm run build` en verde. Contra `next start`: `check:routes` en verde; el `h1` servido dice «1.392 estrategias entraron al laboratorio. Sobrevivieron 45.» en los dos idiomas; el veredicto está en el HTML; la portada dice «sobrevivieron 45 · publiqué las 1.347 que no» y «una de cada ocho»; la historia, «Entraron 1.392. Sobrevivieron 45.»; ninguna de las 16 rutas sirve un `{placeholder}` sin rellenar. Un tropiezo por el camino, útil: el generador del CV leía `dict.hire` donde era `dict.sheet.hire`, y `tsc` no lo vio porque `scripts/` está excluido — exactamente IR-09, que sigue en la sesión 6.

### Lo que queda

- **33 o 34 tablas en JARVIS** (CO-09): solo el autor lo sabe. `check:figures` ya entiende «treinta y tres», así que el día que se fije basta una línea en `CLAIMS`.
- Sesiones 3–6 del plan y las decisiones del §7.
