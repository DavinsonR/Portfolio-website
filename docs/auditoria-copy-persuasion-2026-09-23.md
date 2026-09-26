# Auditoría de copy: persuasión y autoridad

*23 sep 2026 · commit `584f4d6` · alcance: todo `lib/content/*.ts` (home, about, cv, historia, projects, error) y `README.md`. Solo lectura: no se ha tocado ningún texto del sitio.*

## Veredicto

**Credibilidad 9/10. Persuasión 6/10.**

El sitio se cree, pero no vende. La evidencia es de primer nivel; el problema está en cómo se enmarca. Buena parte del espacio más caro (titulares, primeras líneas, perfil del CV) se va en defenderse de objeciones que nadie ha puesto, en confesar, en anclar señales de junior y en enseñar lo que falta antes que lo que hay. Un senior no se disculpa, no se justifica y no se cuenta los años: afirma lo que controla y deja que la prueba haga el resto.

Hay cambios de alto impacto que no cuestan nada de veracidad. Son la mayoría de los de este documento.

---

## La línea roja: humo en el tono, nunca en los datos

Hay que decirlo antes de empezar, porque choca con el contrato del propio repo: `docs/PRODUCT.md` pide *«Voice: direct, specific, no marketing inflation»*, y `CLAUDE.md` exige que ninguna cifra se infle.

**Lo que esta auditoría amplifica:** el encuadre, el orden, los verbos, la seguridad del tono, qué va primero y qué desaparece.
**Lo que no amplifica:** cifras, cargos, alcance, fechas, usuarios, clientes ni resultados. Nada se inventa ni se redondea hacia arriba.

La razón no es moral sino estratégica. El arma principal del sitio es *«Haz clic en la que menos te creas»*. Todo el posicionamiento depende de que el lector que audita no encuentre nada falso. Una sola cifra inflada convierte a ese lector en fiscal, y un check de referencias o una entrevista técnica la encuentran igual. Además `check:figures` falla si una cifra diverge entre páginas.

> **Decisión que te toca:** si apruebas el tono de este documento, `PRODUCT.md` → *Brand Commitments → Voice* debería pasar de «no marketing inflation» a algo como **«asertiva, segura y de dominio; cero cifras infladas»**. Si no, la próxima revisión marcará estas reescrituras como una violación del contrato.

---

## Los siete patrones que restan autoridad

| # | Patrón | Medición | Efecto en quien lee |
|---|---|---|---|
| P1 | **Anclaje junior** | «practicante»/«intern» aparece **17 veces**; «tres años»/«three years» **13 veces** | El recruiter clasifica por el dato más bajo que ve. «Tres años» y «practicante» hacen de techo al «Senior Analyst» del hero |
| P2 | **Defensa preventiva** | «No cambié de carrera», «No cambio de carrera», «No es humildad de vitrina», «Esto no es un curso de trading» | Negar una objeción la instala. Nadie había pensado «cambio de carrera» hasta que el titular lo dijo |
| P3 | **Autodevaluación y confesión** | «así de poco heroico», «por un rato me sentí muy bien», «Apenas le puse nombre», «me dejó incómodo», «a pedazos, a mano» | Es encantador en un blog. En una criba de 60 segundos se lee como inseguridad |
| P4 | **Verbos de participante** | CV: «Contribuí», «Colaboré», «Di seguimiento», «Realicé», «Analicé», «Entregué», «mejorando precisión y eficiencia» | Son los verbos de quien asistió, no de quien respondió por el resultado |
| P5 | **Lo que falta, en primer plano** | «Sin captura todavía» ×4 en Power BI; «Lo que falta para abrir las diez cuentas»; «Inglés B2» en el bloque de remoto; Platzi y SENA junto a Stanford | Cada carencia a la vista le da al lector una razón para descartar |
| P6 | **Titulares que describen en vez de afirmar** | JARVIS: «Una app de seguimiento personal, y el porqué de cada decisión»; kicker «Trayectoria · en primera persona» | Un titular descriptivo no se recuerda y no posiciona |
| P7 | **Centrado en mí y no en quien contrata** | «Busco un rol remoto…», «Abierto a roles…», «Respondo…» | Quien contrata compra lo que gana, no lo que el candidato busca |

**Lo que el sitio ya hace muy bien, y no hay que tocar:** la honestidad usada como arma («Mi primer AUC fue 0,9461: espectacular, publicable y falso», «No bajé el umbral. Cualquiera lo habría bajado», «Publiqué el cero»). Eso no es autodevaluación: es demostrar autoridad por contraste. **El problema no es publicar lo que falla. Es disculparse mientras se publica.**

---

## Reescrituras por superficie

*Formato: actual → propuesto. Si solo se muestra ES, el cambio en EN es equivalente. Todo lo propuesto sale de hechos que ya están en el sitio o en `PRODUCT.md`.*

### 1. Portada (`home.ts`, `about.ts`)

| ID | Clave | Actual | Propuesto | Patrón |
|---|---|---|---|---|
| H-01 | `meta.description` (ES) | «Encuentro la variación, llego a su causa raíz, dejo el control corriendo solo y lo explico donde se decide. Finance Data Analyst, remoto desde Bogotá.» | «Finance Data Analyst: cierre de 15+ países, una plataforma de datos en producción y un sistema de crédito que se audita solo. Remoto, GMT-5.» | Es lo que se ve en Google y LinkedIn. Ahora abre con alcance y prueba, no con una tesis abstracta |
| H-02 | `sheet.sub` (EN) | «…Three years closing the books for 15+ countries from HQ…» | «…**I close the books for 15+ countries from HQ**, and alongside it I run a production data platform…» | P1: el alcance en presente sustituye a los años |
| H-03 | `sheet.sub` cierre | «…que diseñé, construí y opero solo. Sin equipo detrás. Sin proveedor.» | «…que diseñé, construí y opero **de punta a punta. Sin equipo y sin proveedor: la responsabilidad entera es mía.**» | «Solo» puede leerse como lobo solitario. «De punta a punta» se lee como ownership |
| H-04 | `sheet.availability` | «Bogotá · GMT-5 · Traslape completo con horario de EE.UU. · Abierto a roles remotos» | «Bogotá · GMT-5 · **Tu horario de EE. UU., completo** · Disponible en 15 días» | P7 y urgencia: el dato de disponibilidad ya está confirmado en `PRODUCT.md` |
| H-05 | `work.intro` | «El proyecto que mejor explica cómo trabajo. Contado como se cuenta un caso: el problema primero.» | «**Lo que un examen de riesgo de modelo le pide a un banco, construido y en pie.** El problema primero, como se presenta un caso.» | P6: afirma dominio en vez de anunciar un formato |
| H-06 | `also.rows[1].name` / `kind` | «JARVIS — app de seguimiento personal» · «Producto propio · Next.js + Supabase» | «JARVIS — **producto multiusuario con datos sensibles**» · «Producto propio en producción · Postgres con seguridad por fila» | P6: lo transferible es el aislamiento de datos sensibles, no los hábitos |
| H-07 | `also.rows[2].note` | «De más de 1.300 variantes…» | «De **1.392** variantes…» | La cifra exacta ya está en la banda de arriba, y «más de 1.300» la rebaja |
| H-08 | `about.track.rows[1].title` | «SLB · de practicante a especialista en 26 meses» | «SLB · **dos ascensos en 26 meses**» | P1: el mismo hecho (practicante → analista → especialista, según las fechas del CV), sin la palabra que ancla abajo |
| H-09 | `about.track.rows[1].desc` | «Análisis cambiario en Python que nadie me pidió…» | «**Detecté por iniciativa propia** el descalce cambiario de LATAM y lo modelé en Python…» | P3: «que nadie me pidió» suena a queja; «iniciativa propia» es un rasgo senior |
| H-10 | `about.track.rows[2].desc` | «Investigación aplicada y analítica social voluntaria con equipos remotos internacionales.» | «Evaluación de impacto sobre datos del sistema educativo colombiano, con equipos remotos internacionales.» | P4: nombra el trabajo y quita «voluntaria» (que era otro empleador) |
| H-11 | `about.disclosures.title` | «Divulgaciones» | «**Letra pequeña, a la vista**» / «**The fine print, in plain sight**» | «Divulgaciones» suena a folleto regulatorio; así pasa a ser otra prueba de transparencia |
| H-12 | `about.contact.body` | «Abierto a roles remotos de Finance Data Analyst… Respondo en menos de un día hábil…» | «**Un solo contrato cubre el análisis financiero, el pipeline y el tablero.** Finance Data Analyst, Analytics Engineer o FP&A con automatización. GMT-5, tu horario completo, respuesta en menos de un día hábil.» | P7: el valor para quien contrata va primero |
| H-13 | `footer.left` | «Davirson Novoa · construido en público» | «Davirson Novoa · Finance Data Analyst · construido en público» | La última línea de cada página vuelve a clasificar al candidato |

**Se quedan tal cual:** `verdict`, `thesis`, `hireLabel` («Contratarme es simple»), `metricsNote` («Haz clic en la que menos te creas»), `work.title`, `work.project.finding`, `also.title`, `contact.title`. Son el techo de persuasión del sitio.

### 2. CV (`cv.ts`), que es lo que se reenvía

| ID | Clave | Actual | Propuesto | Patrón |
|---|---|---|---|---|
| C-01 | `profileText` / `profileShortText` (apertura) | «Economista con tres años dentro de finanzas corporativas…» | «**Finance Data Analyst que opera el cierre y el forecast de SG&A de 15+ países** y construye él mismo los datos que ese cierre necesita…» | P1: la primera línea del CV es la que clasifica. Hoy dice «tres años» |
| C-02 | `profileText` (cierre) | «Busco un rol remoto donde el criterio financiero y la ingeniería de datos se paguen como una sola capacidad, no como dos mitades.» | «**Traigo el criterio financiero y la ingeniería de datos en una sola contratación**: sin traductor y sin la reunión de traspaso.» | P7 |
| C-03 | `pivot.shortBody` / `body` (apertura) | «No cambio de carrera: cobro por lo que ya hago.» / «No estoy cambiando de carrera…» | «**Cobro por lo que llevo haciendo en cada rol financiero**: construir el dato que el negocio necesita y que nadie más iba a construir.» | P2: se quita la negación y queda la afirmación |
| C-04 | `facts[2]` | «26 meses · de practicante a especialista» | «**2 ascensos** · en 26 meses, en SLB» | P1 |
| C-05 | Neoris `bullets[1]` | «Gestioné el cierre mensual…» | «**Respondo por** el cierre mensual y la confirmación del forecast a nivel compañía; explico cada variación contra plan y forecast anterior.» | P4. Es el puesto actual: va en presente |
| C-06 | Neoris `bullets[2]` | «Di seguimiento a la variación cambiaria…» | «**Aíslo** el efecto cambiario en moneda constante y la inflación por moneda, para que la variación operativa se lea limpia.» | P4 |
| C-07 | SLB Facturación `bullets[2]` | «Realicé auditorías internas…, asegurando trazabilidad y cumplimiento.» | «**Audité** proyectos tecnológicos integrados: trazabilidad de punta a punta y cumplimiento SOX.» | P4 (compruébalo: ¿estaba bajo SOX? Si no, quita «SOX») |
| C-08 | SLB Tesorería `bullets[0]` | «Automaticé la conciliación bancaria en SAP, mejorando precisión y eficiencia.» | Fusionar con `bullets[1]` y abrir con la cifra: «**Devolví ~60 horas al mes al equipo** (~10 por analista) automatizando la conciliación bancaria y el reporting en SAP y Power Automate.» | P4. «Precisión y eficiencia» es relleno. Además esto arregla CO-02 (el PDF de una página se queda con la primera viñeta) |
| C-09 | SLB Practicante `bullets[0]` | «Desarrollé… un análisis integral de descalces…» | «**Detecté y cuantifiqué** los descalces cambiarios de LATAM en Python e identifiqué oportunidades de cobertura.» | P4 |
| C-10 | LEE `bullets` | «Analicé… / Contribuí a estudios…» | «Modelé datos del sistema de educación superior colombiano para evaluaciones de impacto; **publiqué los resultados en Power BI**.» (2 viñetas en vez de 3) | P4. Quita «Contribuí» |
| C-11 | Solidariamente | 2 viñetas genéricas («Entregué herramientas…», «Colaboré con…») | **Opción A:** quitar el empleo del CV (tercer empleo más débil, voluntario). **Opción B:** una línea: «Analítica para ONG con equipos internacionales remotos.» | P5. Ojo: `remote.points[0]` dice «4 empleadores»; con la opción A pasaría a 3 |
| C-12 | `certs[2]` | «Ciencia de Datos con Python · Platzi · 2023» | **Quitar.** | P5: al lado de Stanford, Platzi baja la media |
| C-13 | `education[2]` | «Técnico en Sistemas · SENA · 2018» | **Quitar** del CV (puede quedar en LinkedIn) | P5: un técnico de 2018 no suma nada a un Senior Analyst con maestría |
| C-14 | `remote.points[3]` | «Español nativo · Inglés B2 · Portugués A2.» | «Inglés de trabajo a diario con equipos de EE. UU., India y Europa · Español nativo · Portugués A2.» | P5. El B2 sigue publicado en «Letra pequeña» (`about.disclosures`), donde es honesto sin ser lo primero que se ve. Confirma que trabajas en inglés con esos equipos |
| C-15 | `remote.points[2]` | «Experiencia trabajando con equipos de Norteamérica, Argentina y Brasil.» | Fusionar con C-14 (ya lo dice) | Redundancia |
| C-16 | `projectsNote` | «Código abierto y verificable. Nada de esto es un ejercicio de curso.» | Se queda. | Ya persuade |
| C-17 | `skillsFinDesc` | «El contexto que los datos necesitan para significar algo.» | «**Lo que convierte un dato en una decisión de negocio.**» | Más directo |

### 3. La historia (`historia.ts`)

Aquí el tono cálido es deliberado (lo documenta la cabecera del fichero) y **funciona**. Se mantiene la primera persona y el registro colombiano; solo se quitan las frases que restan.

| ID | Clave | Actual | Propuesto | Patrón |
|---|---|---|---|---|
| S-01 | `title` | «No cambié de carrera. Apenas le puse nombre a lo que ya venía haciendo.» | «**Llevo tres años haciendo este trabajo. Solo le faltaba el nombre.**» / «**I've been doing this job for three years. It just didn't have a name.**» | P2+P3: la negación y el «apenas» salen. «Tres años» aquí suma, porque es el tiempo haciendo *el cruce* |
| S-02 | `metaTitle` | «La historia: no cambié de carrera» | «La historia: finanzas y datos desde el primer día» | P2: es lo que se ve en la pestaña y en LinkedIn |
| S-03 | `kicker` | «Trayectoria · en primera persona» | «Trayectoria · **cómo se construye un perfil que casi no existe**» | P6 |
| S-04 | `sections[0].body[2]` | «…Así de simple, y así de poco heroico.» | Borrar la última frase. | P3 |
| S-05 | `sections[0].body[3]` | «…nadie me pidió que automatizara nada. Lo hice porque la parte manual era la parte aburrida…» | «…nadie me pidió que automatizara nada. **Lo hice porque veo el proceso completo, no solo mi tarea.**» | P3: «aburrida» resta; ver el sistema entero es un rasgo senior |
| S-06 | `sections[3].body[0]` | «La tesis me dejó incómodo… la infraestructura la había armado a pedazos cada vez, a mano.» | «La tesis me dejó una exigencia: **si el análisis es de producción, la infraestructura también tiene que serlo.** Así que construí una de verdad.» | P3 |
| S-07 | `sections[4].body[2]` | «Y te voy a ser honesto: por un rato me sentí muy bien.» | **Se queda.** | Es el único momento emocional y hace creíble el giro que viene. La regla de la cabecera («una vez y sin adornarlo») se cumple |
| S-08 | `sections[4].bodyAfter[0]` | «…en las auditorías internas de SLB **cuatro años antes**…» | «…en las auditorías internas de SLB **un año antes**…» | **Error de hecho:** esas auditorías son de 2024–2026 y el sistema de crédito es de 2026. «Cuatro años» es falso, y en la página que dice que todo se verifica |
| S-09 | `sections[5].body[2]` | «No es humildad de vitrina, y quiero ser claro en eso. Es algo más aburrido y más útil…» | «**Es un criterio de ingeniería, no de humildad:** un portafolio donde todo salió bien no se puede verificar…» | P2+P3 |
| S-10 | `sections[6].body[0]` | «Busco un rol remoto donde…» | «**El rol que encaja** paga el criterio financiero y la ingeniería de datos como una sola capacidad…» | P7 |
| S-11 | `ctaBody` | «Si lo de arriba se parece a lo que necesitas, escríbeme y hablamos esta semana. Respondo en español e inglés.» | «Si tu equipo necesita a alguien que lea el P&L y construya el pipeline que lo alimenta, **hablemos esta semana.** Respondo en menos de un día hábil.» | P7 + la promesa ya verificable de `about.contact` |

### 4. Páginas de proyecto (`projects.ts`)

| ID | Clave | Actual | Propuesto | Patrón |
|---|---|---|---|---|
| P-01 | `tracking.title` | «Una app de seguimiento personal, y el porqué de cada decisión» | «**Datos de salud y de dinero, abiertos al público sin exponer una sola fila.**» / «**Health and money data, open to the public without exposing a single row.**» | P6: el titular más débil del sitio pasa a una afirmación de seguridad que un Analytics Engineer respeta |
| P-02 | `tracking.metaTitle` | «JARVIS: app de seguimiento personal» | «JARVIS: Postgres multiusuario con seguridad por fila» | P6 |
| P-03 | `tracking.status.pendingTitle` | «Lo que falta para abrir las diez cuentas» | «**Siguiente fase: alta pública**» | P5: el contenido se queda (es honesto), pero enmarcado como hoja de ruta y no como carencia |
| P-04 | `tracking.status.note` | «…publicar un botón de crear cuenta que hoy devuelve un error sería peor que no publicarlo.» | «**No se publica un botón que todavía no puede cumplir lo que promete.** Por eso aquí se enlaza el demo.» | Mismo hecho, dicho como estándar y no como defecto |
| P-05 | `powerbi.pages.noShot` | «Sin captura todavía: la lista de visuales sale del archivo PBIR de la página.» | «Inventario de visuales leído del archivo PBIR de la página.» **Y la solución real: exportar las 4 capturas** (CO-04 de la auditoría anterior; el andamiaje ya existe) | P5: «todavía» ×4 en la página más cercana al puesto |
| P-06 | `powerbi.licensing.title` | «Por qué no hay un informe embebido» | «**Entregado como código, no como enlace**» | P5: lo mismo, dicho como una decisión |
| P-07 | `powerbi.intro` (cierre) | «…para que nadie tenga que creer en la palabra «Power BI» sin ver qué hay detrás.» | Se queda. | Ya persuade |
| P-08 | `tradingSim.metaTitle` | «Más de 1.300 estrategias a prueba» | «**1.392 estrategias a prueba: casi todas eran ruido**» | La cifra exacta, y el gancho del resultado |
| P-09 | `tradingSim.intro` | «…Esto no es un curso de trading: es la medición honesta…» | «…**Es la medición que separa el alfa real del overfitting**: cuánto sobrevive el análisis técnico al contacto con la realidad.» | P2 |
| P-10 | `tradingSim.fx.desc` | «…los separamos…» | «…los separo…» | Persona: el sitio insiste en «sin equipo» (CO-12 de la auditoría anterior, aún abierto) |
| P-11 | `thesis.kicker` / `pill` | «Investigación · datos abiertos» · «INVESTIGACIÓN» | «Investigación · **tesis de maestría radicada**» | Suma credencial académica donde hoy no aparece |
| P-12 | `creditRisk.title` | «El modelo no es el punto. El punto es que sobrevive una auditoría.» | Se queda. | Es el mejor titular del sitio |

### 5. README

| ID | Actual | Propuesto |
|---|---|---|
| R-01 | Título «# Proyecto Davirson» | «# Davirson Novoa — Finance Data Analyst» (el repo es público, y lo abre quien viene desde el CV) |
| R-02 | JARVIS: «habits, body, sleep and spending logged in under ninety seconds» | «Multi-user Postgres with row-level security on 34 tables, 526 tests, a public demo that never touches the database» |

---

## Sobre-afirmaciones que ya existen y conviene confirmar

La persuasión máxima se cae si una de estas se pregunta en entrevista y la respuesta decepciona. Responde sí o no a cada una:

1. **«Diseñé y lideré sistemas de gestión financiera»** (Neoris, desde mar 2026). «Lideré» implica personas a cargo o dueño del proceso. Si no hubo ninguna de las dos: «Diseñé y opero…».
2. **«Modelo en producción» / «desplegado»** (credit-risk). La producción es el ONNX puntuando en el navegador, sin usuarios ni SLA. Hoy es defendible porque la página lo explica; en el CV, un entrevistador técnico lo va a preguntar.
3. **«Tres años en finanzas corporativas».** Ene 2024 → sep 2026 son 2 años y 9 meses. Redondear para arriba es normal, pero con C-01 y S-01 la cifra casi desaparece del primer plano, que es mejor que defenderla.
4. **S-08 «cuatro años antes»**: es un error, no una afirmación. Hay que corregirlo aunque no se toque nada más.
5. **Historia §05: «93,4 millones de solicitudes HMDA»** en la frase que presenta el sistema. El modelo entrena sobre 62,4 M; 93,4 M es la ventana del estudio de evento (CO-17 de la auditoría anterior).

---

## Orden de ataque

1. **S-08** (error de hecho) y las **5 confirmaciones** de arriba.
2. **CV entero** (C-01 a C-15): es el artefacto que se reenvía, y P1+P4 lo lastran más que a ninguna otra superficie. Obliga a `npm run cv`.
3. **Titulares y primeras líneas**: H-01, H-02, S-01, S-02, P-01, P-08. Son el 80% de lo que lee alguien que solo escanea.
4. **Todo lo demás de P2, P3 y P5.**
5. Actualizar la línea de voz en `PRODUCT.md` para que el contrato y el texto no se contradigan.

Cada tanda se verifica con `npm run check` (paridad `es`/`en`, cifras entre páginas, artefactos del PDF) y `npm run build`.
