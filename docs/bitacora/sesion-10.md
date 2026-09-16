<!-- Extraído de BITACORA_MAESTRA.md por scripts/split-bitacora.mjs. Texto sin modificar. -->

## ANEXO — SESIÓN 10 (20 ago 2026): REDISEÑO COMPLETO DEL SITIO

### Por qué
Feedback estructurado de cuatro personas reales (Felix — data engineer con mucha experiencia en filtros de RRHH; Simón — ingeniero en transición a datos; Nicol, 15 años — usuaria no técnica; Mateo — economista con la misma transición). El patrón fue inequívoco y **el contenido no era el problema**: confianza 8–10, diseño 5–7. Quejas independientes y repetidas: *muy oscura* · *demasiadas cosas, uno se pierde* · *los proyectos no muestran qué problema resuelven* · *letras muy chiquitas y casi no se ven* · *el selector de idioma no se nota* · *debería estar en inglés*.

### Qué se hizo
Se corrió el protocolo `impeccable` completo (PRODUCT.md → concept-seed → craft-floor → build → finish review → documenter) y salió un mundo visual nuevo: **hoja de análisis (research tear sheet)** — fondo papel blanco, tinta casi negra, azul institucional `#0F4C81` para lo técnico, ámbar `#96551A` reservado **solo** para lo humano, Archivo + Source Serif 4, reglas de un pixel y bandas a sangre en lugar de tarjetas. Modo claro por defecto (con oscuro re-escalonado, no invertido), inglés por defecto, y todo el posicionamiento movido de *"economista en transición a data science"* a **Finance Data Analyst** — un rol cruzado que se cobra completo en vez de empezar de cero.

La revisión de acabado (agente independiente) encontró 8 defectos materiales antes de publicar; los dos que más importaban: la **regla del ámbar estaba invertida** (el ámbar estaba sobre una afirmación estadística y el azul sobre el contenido humano) y **el azul no era dueño de ninguna banda** pese a que el contrato de dirección lo prometía. Ambos corregidos. `DESIGN.md` y `.impeccable/design.json` quedan como registro del sistema **tal como se construyó**, no como se pensó.

**Commits:** `f126a2f` (rediseño) · `9f69f19` (DESIGN.md + piso tipográfico de 14px aplicado en 62 tamaños).

---
