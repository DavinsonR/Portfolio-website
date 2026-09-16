# No cambié de carrera. Le puse precio a lo que ya hacía.

Tres años dentro de finanzas corporativas y, en cada puesto, terminé
construyendo lo mismo: el dato que el negocio necesitaba y que no existía. Esta
es la línea que une un análisis de descalce cambiario hecho por un practicante
con una plataforma de datos que hoy corre sola todos los días.

---

## 1 · El reporte que no existía

Entré a la tesorería de SLB como practicante en enero de 2024. El trabajo era
conciliar, reportar, cerrar. Y como en todo equipo de finanzas, el reporte que
alguien necesitaba de verdad nunca era el que el sistema sabía dar.

El primero fue el descalce cambiario de los mercados latinoamericanos. No
existía una vista que lo mostrara, así que la construí en Python. No fue una
decisión de carrera: fue que la pregunta era buena y la herramienta que había no
la respondía.

Después vino la conciliación bancaria automatizada en SAP. Esa devolvió unas
**diez horas al mes a cada analista de tesorería** — cerca de sesenta al mes en
todo el equipo. Es la cifra que mejor explica por qué seguí: nadie me pidió que
automatizara nada. Lo hice porque el trabajo manual era la parte aburrida de una
pregunta interesante.

De practicante a especialista de facturación para Argentina y Brasil en
**26 meses**. Entre medias, reconocimiento de ingresos en SAP bajo
Sarbanes-Oxley y auditorías internas sobre proyectos de tecnología. Ahí aprendí
algo que no estaba en el temario: **un número que no se puede auditar no vale
nada**, por bueno que sea. Esa frase reaparece al final de esta página, y no por
casualidad.

## 2 · El patrón

En Neoris/EPAM el alcance creció: tres sistemas de gestión financiera para el
cierre y el forecast de gastos SG&A en Norteamérica, con impacto en
**12 países**. Cierre mensual, confirmación del forecast a nivel compañía,
variaciones contra plan y contra forecast anterior, seguimiento de la variación
cambiaria en moneda constante.

Y otra vez lo mismo: Excel avanzado, Power Query, Power BI, MicroStrategy, JD
Edwards, SAP — y debajo, código, porque la pieza que faltaba siempre era el
dato, no la presentación.

Ahí dejé de verlo como una serie de casualidades. **En cada rol de finanzas
terminé construyendo la misma cosa.** La ventaja no es saber Python; mucha gente
sabe Python. La ventaja es saber **qué pregunta vale la pena responder antes de
escribir la primera línea**. Un Finance Data Analyst no es un analista de datos
que aprendió finanzas ni un financiero que aprendió a programar: es el que no
necesita traductor entre las dos cosas.

## 3 · Ponerle nombre

La maestría en Economía en la Javeriana fue el sitio donde ese patrón dejó de
ser un hábito y pasó a ser un método. La tesis pregunta si la inclusión
financiera explica el crecimiento regional en Colombia.

Para responderla hacía falta un dato que tampoco existía: junté
**19 fuentes públicas** en un warehouse dimensional con dbt y DuckDB, construí
un índice de inclusión por dimensiones y levanté un atlas de los
**1.123 municipios** del país.

Y entonces el resultado no salió.

Al añadir efectos de tiempo, el coeficiente se cae a cero. La especificación
ingenua —solo efectos de entidad— publica un **+0,0242 con p < 0,001** que no
significa nada: lo que recoge es que **todo el país subió a la vez**. En 2018 la
mediana del índice era −0,02 y 17 de 32 departamentos estaban bajo cero; en 2025
la mediana es +2,47 y solo queda uno. Esa deriva común es el hallazgo, no el
ruido.

**Publiqué el nulo.** Está en la página, con los dos mapas en la misma escala
para que se vea por qué. Un resultado nulo bien medido dice más sobre cómo
trabajo que un coeficiente bonito, y el que lo lee sabe distinguirlos.

## 4 · Construirlo entero

La tesis me dejó una pregunta incómoda: sabía hacer el análisis, pero la
infraestructura la había armado a mano cada vez. Así que construí una de verdad.

`market-data-medallion` es un warehouse en PostgreSQL con arquitectura
medallion, transformaciones en dbt, **89 pruebas automáticas de calidad** y un
cron diario que trae **48 activos** —cripto, ETFs, acciones de EE. UU., ADR
latinoamericanos y divisas— sin que yo toque nada. Lleva un modelo semántico de
Power BI encima.

Y un backtester honesto. Cinco estrategias técnicas clásicas y **todas** sus
combinaciones: **1.392 variantes** evaluadas con comisiones, slippage y sin
look-ahead. Entraron más de mil trescientas. **Sobrevivieron menos de
cincuenta** a la validación fuera de muestra.

Ese número es el producto. La mayoría de las estrategias ganadoras eran
ilusiones del backtest, y la manera de demostrarlo fue partir cada serie en 70%
de entrenamiento y 30% que el modelo nunca vio. Sin esa ventana ciega, elegir la
mejor de 1.392 variantes no es análisis: es dragado de datos con buena
presentación.

## 5 · La cifra que borré

El proyecto más reciente es un sistema de decisión crediticia sobre
**1,96 millones de préstamos SBA** y **93,4 millones de solicitudes HMDA**,
datos públicos de Estados Unidos.

La primera medición dio **AUC 0,9461**.

Eso no es un modelo de crédito. Es una fuga. `TermInMonths` se sobrescribe
cuando un préstamo se liquida, así que el campo llevaba dentro el resultado que
yo decía estar prediciendo. Quitarlo derrumba la ablación a **0,6621**.

El modelo en producción está en **0,7005**: +0,0311 sobre una scorecard WoE
interpretable, con error de calibración de 0,0107. Son cifras mucho menos
vistosas que 0,9461 y son las únicas que se sostienen.

**Mi primera cifra honesta fue una que borré.** El sistema tiene diez gates de
promoción y uno de ellos está diseñado para bloquear mi propio modelo cuando no
cumple. Eso es lo que quería construir: no un modelo que gane, sino uno que
**sobreviva a una auditoría** — la misma idea que me encontré en las auditorías
internas de SLB, cuatro años antes, desde el otro lado de la mesa.

## 6 · Lo que sostiene todo

Hay un hilo que atraviesa las tres cosas y es más importante que cualquiera de
ellas: **publico lo que falla.**

El resultado nulo de la tesis está publicado. La fuga del 0,9461 está escrita en
el README con el número exacto. De 1.392 estrategias, el titular es cuántas
murieron. Y este mismo sitio lleva una bitácora con **35 fallos numerados**,
cada uno con su causa raíz y su corrección — incluidos los que rompí esta
semana.

No es humildad de escaparate. Es que un portafolio donde todo salió bien no se
puede verificar, y uno donde los errores están fechados sí. Cada cifra de este
sitio enlaza al artefacto que la produce: el repositorio, el commit, el
pipeline. Si algo no se puede comprobar, no está publicado.

## 7 · Hacia dónde

Busco un rol remoto donde el criterio financiero y la ingeniería de datos se
paguen como **una sola capacidad, no como dos mitades**. Finance Data Analyst,
Financial BI Analyst, Analytics Engineer — los tres nombres que las vacantes le
dan al mismo puesto.

Bogotá, GMT-5, solapamiento completo con horario de EE. UU. La evidencia está a
un clic: el código es público, las cifras enlazan a su fuente, y los fallos
también.
