## Sesión 32 — 25 sep 2026 · El ancla del atlas se renueva: EME de julio de 2026

Encargo: renovar el ancla en la tesis y re-exportar. El mapa decía que el ancla estaba vencida (FMI WEO, corte de mayo de 2025, 16 meses frente a un máximo de 6).

### Lo que se hizo en la tesis (financial-inclusion-colombia, PR #18)

- **El ancla central es ahora la EME de Banrep de julio de 2026:**
  - la mediana de los analistas: 2,40 % en 2026 y 2,29 % en 2027;
  - 2028 repite 2027, como pide la regla de la tesis;
  - mínimo y máximo para los escenarios;
  - transcrita del Excel oficial `res_inf_jul2026.xlsx`, hoja `PIB`.
- **El respaldo automático del WEO** salía de DBnomics, congelado desde abril de 2025. Ahora sale de la API del FMI y se fecha por su publicación (WEO de abril de 2026).
- **Salidas regeneradas.** Se re-corrió `iif forecast` y, con el almacén reconstruido (Release `data-v1`, dbt e `iif index`), `iif atlas`. Cambian solo las dos series ancladas, el ancla y la lectura del escenario.

### Lo que se hizo aquí

- **`public/atlas/`** con la exportación nueva. El ancla ya no está vencida, así que la frase de la edad desaparece sola: la nota la pinta solo cuando la exportación dice `vencida`.
- **`anchorSources`** traduce el nombre de la fuente, que la tesis exporta en español. En /en ya no aparece una frase española dentro de la inglesa. Una prueba exige que la fuente exportada tenga nombre en los dos idiomas, para que una re-exportación con otra EME no pase en silencio.
- **`lib/data/thesis-results.ts`**: la procedencia de `F` apunta a la corrida nueva. Las cifras del backtest no cambian con el ancla.

### Lo que se verificó

`npm run check` (49 pruebas), build y peso en verde.

### Para la próxima renovación

La próxima EME con PIB es la de octubre de 2026. La primera que pregunta por 2028 es la de abril de 2027. Al renovar: transcribir en la tesis, `iif forecast` e `iif atlas`, copiar `atlas/data` a `public/atlas` y añadir la fuente nueva a `anchorSources`.
