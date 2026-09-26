## Sesión 28 — 24 sep 2026 · El panorama pasa a ser un tablero

Encargo: que se vea como un tablero de Power BI, Tableau o Looker, con varios gráficos en la misma pantalla; economías y eventos en listas desplegables con selección múltiple, sin perder los atajos; un resumen flotante al tocar un evento; quitar la frontera de cobertura si no se podía explicar mejor; un mapa de calor menos tosco; tablas ordenables por columna.

### Lo que se hizo

- **Grilla de 12 columnas con recuadros de visual** (`components/forecast/ui.tsx` → `Tile`): título en franja, regla de 1 px, sin sombras. La serie va junto a la cronología (cada evento al lado de su caída), el mapa de calor junto a la dispersión, la tabla junto a la estacionalidad. El panorama usa el ancho útil (1.440 px), no la columna de lectura.
- **Barra de filtros fija** bajo la navegación de sección en escritorio: economías (desplegable múltiple con buscador y tope de seis), atajo, métrica, período, tipos de evento (desplegable múltiple) e «ir a un evento».
- **Resumen flotante del evento** al tocar un marcador numerado o su línea punteada: fecha con mes, economía, tipo, texto y «Enfocar este período». Foco al abrir, Escape o un toque fuera lo cierran.
- **Tablas ordenables** (`SortTable`, con `aria-sort`): la tabla de las 20 economías reemplaza al ranking de barras y lleva barras de datos en el promedio; también la de la región, la de Holm y la de frecuencia.
- **Mapa de calor redibujado** como SVG: celdas compactas con separación de 1 px, guías de fila y columna al pasar, leyenda continua.
- **Fuera la frontera de cobertura.** Medía disponibilidad de datos, un paso metodológico que no se lee de un vistazo; su conclusión (17 de 20 sin un año con las 33 variables) queda en el veredicto, y la cifra de la cabecera enlaza allí. La estacionalidad junta sus dos vistas en un recuadro con selector.

### Lo que se verificó

`npm run check` (27 pruebas; nuevas: el resumen del evento se pinta con su texto, y la tabla ordena en los dos sentidos con los nulos al final), build, peso (156 KB br) y rutas en verde. Clics reales en Edge headless por CDP: el marcador 11 abre el corralito con el foco en «cerrar»; Escape lo cierra; el desplegable muestra 20 economías con seis marcadas y catorce bloqueadas; la tabla ordena por «Mínimo». Sin desborde a 390 y 1.440 px.
