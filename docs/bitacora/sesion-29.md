## Sesión 29 — 24 sep 2026 · El tablero pronostica, filtra de verdad y se lee en el teléfono

Encargo: en el celular no se veía bien; el filtro debía mover todos los gráficos (seis economías elegidas, solo esas seis; «limpiar», todas); fuera la cronología y la estacionalidad del ISE, que es solo de Colombia; esquinas un poco redondeadas; títulos de eje en todos los gráficos y un eje Y con más marcas; un titular que venda en lugar de sonar a estudio; y el pronóstico 2026–2027 de cada economía con bandas al 95 %.

### Lo que se hizo

- **Pronóstico 2026–2027** (`public/forecast-lab/pronostico.json`, del laboratorio: D-008 y B-011). Un AR(1) por economía, bandas al 80 y 95 % y, al lado, la cobertura medida en el backtest: en la región la banda del 95 % contuvo el dato el 92 % de las veces y la del 80 %, el 84 % (649 pronósticos). En la serie principal, una zona sombreada con la banda del 80 % y la media punteada; el recuadro nuevo muestra el abanico de una economía y una tabla ordenable con 2026, 2027 y el acierto de la banda, en rojo si queda bajo 85 % (Venezuela, 74 %).
- **El filtro manda en todo.** Sin tope de selección; la serie, el mapa de calor, la dispersión y las tablas muestran solo lo elegido, y «Mostrar todas» pasa a las 20 con la mediana de la región.
- **Fuera la cronología y la estacionalidad del ISE.** Los eventos siguen en el gráfico y en su resumen flotante.
- **Teléfono.** La serie, el abanico y el mapa de calor se dibujan al ancho real de su recuadro (`useWidth`), con menos marcas y códigos ISO donde los nombres no caben; la barra de filtros se pliega en una línea que resume el filtro activo; la cabecera de los recuadros se apila; el resumen de un evento ocupa el ancho de la pantalla.
- **Ejes.** Títulos en todos los gráficos del tablero y del laboratorio; la serie principal pasa de 3 a unas 14 marcas en Y.
- **Titular:** «Pronostico el crecimiento de 20 economías de América Latina, y demuestro cuánto vale cada pronóstico.»
- **Esquinas de 6 px en los recuadros del tablero**, a pedido. Se aparta de `rounded.control` (3 px) de DESIGN.md solo en `.fl-*`; los controles siguen en 3 px.

### Lo que se verificó

`npm run check` (30 pruebas; nuevas: el pronóstico se pinta con su media y su banda, con seis economías la tabla tiene seis filas, y sin filtro tiene veinte y la mediana), build, peso (161,5 KB br de 172) y rutas en verde. En Edge headless por CDP a 390 y 1.440 px: sin desborde horizontal; los filtros se despliegan; «Mostrar todas» deja 20 filas en la tabla y 19 en el pronóstico (Honduras sigue fuera por B-010); el resumen del corralito cabe en la pantalla del teléfono; las etiquetas de la dispersión y del abanico ya no se enciman.
