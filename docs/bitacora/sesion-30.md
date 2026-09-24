## Sesión 30 — 24 sep 2026 · La proyección de la tesis llega al mapa, con su incertidumbre y su ancla a la vista

Encargo: poner al día la copia de trabajo `../Portfolio` (rama `capa-proyeccion-atlas`, con la capa de proyección del atlas sin commit) y desplegarla.

### Punto de partida

- La rama estaba ocho commits detrás de `main`. Seis de sus siete archivos sin commit se solapaban con el PR #33, que ya había publicado los **datos** de la proyección 2026–2028 (ADR-019 a ADR-023 de la tesis), pero no la interfaz. En producción el grupo «Proyección» no aparecía en el selector: la capa estaba publicada y era invisible.
- Respaldo antes de tocar nada: `stash` «respaldo antes de poner al dia con main (24-sep-2026)». Avance rápido a `main` y reaplicación. Conflictos resueltos así:
  - En `Atlas.tsx`, el filtro de años por grupo del trabajo local, que ya cubre el año por defecto observado que `main` resolvía aparte.
  - En `types.ts`, un campo duplicado (`anios_proyectados`) que quedó de la fusión automática.
  - Los JSON de la exportación más nueva de la tesis, la de `main`.

### Lo que encontró la revisión

Cuatro revisores independientes y un verificador escéptico por hallazgo: 34 hallazgos, 30 confirmados, 13 distintos. Los que cambiaban lo que el lector entiende:

- **El mapa publicaba un ranking del crecimiento proyectado** (#1 a #33). La propia tesis lo excluye: «el sitio no publica tablas de posiciones del crecimiento proyectado» (ADR-022, adenda 1). Ahora las regiones y los departamentos van en orden alfabético y sin número de puesto; la tabla da la cifra exacta y, a su lado, el ancho del intervalo.
- **El ancla vencida se presentaba como vigente.** La exportación la marca `vencida` (FMI WEO, corte de mayo de 2025, 16 meses frente a un máximo de 6); el mapa decía «Anclado a FMI» sin fecha. Ahora, bajo el mapa:
  - el ancla con su fecha de corte;
  - su edad, calculada al día y no la congelada en la exportación;
  - la lectura del escenario y la del backtest, tal como las escribe la tesis.
  - El `aviso`, que es para quien mantiene la tesis, no se pinta.
- **La trama que distingue pronóstico de dato no se veía en la vista por defecto** («Plano»): el patrón solo se definía en relieve.
- **La insignia de proyección se montaba sobre el título de la leyenda y se leía a 6 px.** La marca pasa al título de la leyenda (viaja con una captura del mapa) y la lectura larga a HTML bajo el mapa, a 14 px.
- **La capa del ancho del intervalo se atenuaba por su propio valor**, lo que invertía su rampa.
- **Crecimiento por habitante en dos unidades.** El medido llega como fracción (0,0148) y el proyectado en por ciento (1,55). Con la proyección visible, Meta pasaba de «+0,01» a «2,59». Se convierte al cargar (`components/atlas/proyeccion.ts`, con guarda contra la doble conversión); todas las cifras de crecimiento llevan «%» y el ancho «pp». **El arreglo de raíz va en el exportador de la tesis.**
- **Una afirmación falsa en la nota:** «el tamaño no predice la incertidumbre». La correlación de Spearman es ≈ −0,4 y significativa. Ahora dice que el tamaño apenas orienta.
- Otros:
  - la evolución del riel izquierdo terminaba en un 2028 vacío;
  - las dimensiones del índice mostraban cuatro rayas en años proyectados;
  - el ancho salía con dos decimales de precisión falsa;
  - el nombre de San Andrés se atenuaba por opacidad (DA-07);
  - el estado del proyecto seguía anunciando «la proyección sobre el mapa» como pendiente.

### Lo que se verificó

- `npm run check`: 37 pruebas en verde. Las 7 nuevas (`tests/atlas-proyeccion.test.ts`) leen los JSON reales:
  - reparto de años medidos y proyectados;
  - ninguna proyección sin su ancho (ADR-022, decisión 6);
  - conversión a por ciento idempotente;
  - el ancla solo en las series ancladas;
  - la edad del ancla desde su corte;
  - lo que la nota afirma de Meta y Amazonas, en cada año proyectado.
- Build y peso en verde.
- En Edge headless por CDP, a 1.440 y 390 px, en es y en: trama en Plano, tabla alfabética con ancho, nota con ancla y advertencia, evolución 2026–2028, per cápita medido en «+1,48 %» e índice con su ranking intacto.
- Una segunda ronda de verificación confirmó cada arreglo.

### Pendiente fuera de este repositorio

- **Renovar el ancla en la tesis** (`config/forecast.yaml`) y re-exportar. Mientras tanto el mapa la muestra vencida.
- **Publicar en por ciento y con unidad** el crecimiento por habitante medido en el exportador del atlas de la tesis. La conversión del sitio se desactiva sola cuando llegue.
