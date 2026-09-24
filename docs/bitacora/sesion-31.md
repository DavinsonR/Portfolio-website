## Sesión 31 — 24 sep 2026 · Dos versiones de la capa de proyección, una sola en producción

Encargo: poner al día la copia `../Portfolio` y desplegar. Al preparar el despliegue apareció el PR #36 (sesión 30, D-36), otra implementación de la misma capa del atlas, abierta en paralelo desde otra sesión. Tocaba los mismos ocho archivos que el PR #38 de esta. Se revisaron los dos contra la misma lista de defectos.

### La decisión

Se despliega **#36 con los arreglos de #38**; los dos PR originales se cierran.

- #36 era mejor en la presentación:
  - lista agrupada por región, con la nota de por qué no va por valor;
  - trama con espaciado constante en pantalla y contraste en los dos temas;
  - clave de opacidad dentro de la leyenda del mapa;
  - intervalo completo en el tooltip;
  - confianza mezclada en el color, sin texto atenuado;
  - nota sobre el mapa;
  - proyección deshabilitada en la vista municipal.
- #38 corregía seis defectos que #36 conservaba. Se portaron en la rama `atlas-proyeccion-final`, sin tocar la de la otra sesión.

### Lo que se portó

- **La capa «sin anclar al consenso» se describía como «escenario condicional al ancla».** Ahora el ancla, su edad y esa frase solo acompañan a las dos series ancladas (`components/atlas/unidades.ts`, `esAnclada`). La capa sin anclar tiene su propia frase (`scenarioUnanchored`); la del ancho no habla del ancla.
- **El crecimiento por habitante iba en dos unidades.** El medido llega como fracción del exportador de la tesis (0,0148) y el proyectado en por ciento (1,55), así que 2025 se leía «+0,01» y 2026 «1,55». Se convierte al cargar, una vez, con guarda contra la doble conversión.
- **Unidades en cada cifra.** «%» en todo crecimiento y «pp» en el ancho, también en la leyenda, los rieles y la tabla, que antes iban sin unidad. El formateador la añade una sola vez, así que las plantillas `growthValue` y `widthValue` sobraban y se quitaron. El ancho sale con el decimal que declara el export, no con dos. Todo crecimiento lleva signo, medido o proyectado.
- **Estado del proyecto:** ya no anuncia «la proyección sobre el mapa» como pendiente.
- **San Andrés:** el filtro de región atenúa su cuadro y su trama, no su nombre (DA-07; caía a 1,7:1).
- **Pruebas:** `tests/atlas-proyeccion.test.ts`, seis pruebas contra los JSON reales:
  - cada indicador solo en su tramo;
  - ninguna proyección sin ancho;
  - conversión a por ciento idempotente y efectiva;
  - ancla y escenario solo en las series ancladas;
  - unidades;
  - estado al día.

### Lo que se verificó

`npm run check`, build, peso y rutas en verde. En Edge headless por CDP, con cada una de las cuatro capas de proyección, en 1.440 y 390 px, en es y en.

### Pendiente fuera de este repositorio

- Renovar el ancla en `config/forecast.yaml` de la tesis: la exportación la marca vencida (FMI WEO, corte de mayo de 2025, 16 meses frente a un máximo de 6).
- Publicar desde el exportador del atlas el crecimiento por habitante medido en por ciento. La conversión del sitio se desactiva sola cuando llegue.
