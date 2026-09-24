## Sesión 26 — 23 sep 2026 · El panorama: analítica descriptiva de la región antes de los modelos

Encargo: «la vista inicial, luego del texto de entrada, un dashboard interactivo de analíticas descriptivas con filtros que muevan todos los gráficos, que compare economías, con crecimientos, series, estacionalidades y las noticias que impactaron, tipo corralito».

### Lo que se hizo

- **`#panorama`, la primera sección de `/labs/macro-forecast`.** Un solo estado de filtros —economías (hasta seis, con atajos por subregión), métrica (10 del Banco Mundial), período y eventos por categoría— mueve todas las vistas: cinco indicadores, la serie con los eventos numerados, el ranking de las 20, nivel frente a volatilidad, el mapa de calor economía × año y la cronología. Casi todo es a su vez un filtro: una barra, un punto o un nombre añaden o quitan la economía; un evento enfoca su período. La economía elegida viaja al juego y al origen móvil (`components/forecast/store.ts`).
- **Treinta eventos** (el corralito, el Tequila, el Plan Collor, las dolarizaciones, las hiperinflaciones): una cronología editorial que vive en el laboratorio (`macro_lab/eventos.py`), sin cifras en el texto —la magnitud la pone la serie— y contrastada con ella. El huracán Mitch y la crisis bancaria paraguaya de 1995 no entraron porque no se ven en sus series.
- **Estacionalidad solo donde existe**: el ISE mensual sin ajustar, 16 series. Las trimestrales del FMI vienen desestacionalizadas y el panel lo dice.
- **Su propio fragmento perezoso** (`dashboard.tsx`): quien solo mira el panorama no baja las piezas del lab. La ruta sigue en 156 KB br.

### Lo que se encontró

- **Un empalme roto en la fuente** (B-010 del laboratorio): Honduras con crecimientos reales de 21 a 29 % por año entre 1990 y 1997. Salió primera en el ranking, y ese «demasiado bueno» fue la pista. Se enmascaró en el laboratorio —Honduras sale de la Pista D, que queda en 19 economías: 0,862 → 0,861, ninguna conclusión cambia— y el panel llega con el tramo como faltante y lo declara. Las cifras de la página se actualizaron y la prueba que las deriva de los JSON ahora cuenta las economías anuales.
- **La cobertura parcial se decía en silencio**: Argentina tiene inflación en el Banco Mundial solo desde 2018. Una línea corta sin aviso se lee como el dato completo; ahora el panel nombra cada economía con menos de la mitad de los años del período.
- **Una hora de caché sobre datos que cambian con cada versión** mezclaba JSON viejos con código nuevo en quien volvía. `/forecast-lab/` pasa a revalidar siempre.

### Lo que se verificó

`npm run check` en verde (25 pruebas; nueva: `forecast-dashboard.test.ts` renderiza el tablero en Node con los JSON reales, las 10 métricas en los dos idiomas y filtros extremos, y falla ante un NaN). Build, peso y humo de rutas en verde. Sin desborde horizontal a 320, 390 y 768 px, medido en Edge headless con emulación móvil (una captura a 390 sin emulación mostraba un desborde falso: la ventana de escritorio no baja de ~500 px).
