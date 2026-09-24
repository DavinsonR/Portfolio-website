/* The contract the thesis repository exports with `uv run iif atlas`. The files land in
   public/atlas/ and nothing here reshapes them: what the warehouse publishes is what the map reads. */

export type Level = "departamento" | "municipio";
export type View = "plano" | "relieve" | "municipios";

export type Indicator = {
  id: string;
  etiqueta: string;
  grupo: "indice" | "variable" | "contexto" | "proyeccion";
  escala: "divergente" | "secuencial";
  decimales: number;
};

export type AtlasMeta = {
  version: number;
  generado_en: string;
  indicadores: Record<Level, Indicator[]>;
  unidades: Record<string, number>;
  islas_descartadas: Record<string, number>;
  fuente: string;
  nota: string;
  nota_geometria: string;
};

export type Series = {
  nivel: Level;
  ids: string[];
  anios: number[];
  /* Since the forecast layer (thesis ADR-019 to ADR-023) `anios` runs to 2028; these are
     the projected years, where the index itself has no value. Absent in older exports.
     The map hatches them and dims them by confidence; without this the reader cannot tell
     a measurement from a projection. */
  anios_proyectados?: number[];
  nombres: string[];
  /* One matrix per indicator: years by units. A null is a unit nobody reported, never a zero. */
  series: Record<string, (number | null)[][]>;
  /* Where the projection comes from, so the map can say it out loud. */
  proyeccion?: {
    ancla: {
      fuente: string;
      fecha_corte: string;
      escenario?: string;
      /* La tesis da el ancla por vencida pasados `antiguedad_maxima_meses`; la exportación
         la marca `vencida` y el mapa lo dice. `aviso` es para quien mantiene
         la tesis, no para el lector: no se pinta. */
      antiguedad_maxima_meses?: number;
      vencida?: boolean;
      aviso?: string;
    };
    nivel_intervalo: number;
    vintage: string;
    backtest: {
      modelo_publicado: string;
      mae: number;
      ganancia_sobre_ingenuo_pct: number | null;
      lectura?: string;
      cobertura_intervalo_empirica?: number;
    };
    /* La lectura para el lector: escenario condicional al ancla, no pronóstico oficial. */
    escenario?: { tipo: string; lectura: string };
  };
  region?: string[];
  dpto_ccdgo?: (string | null)[];
  mpio_tipo?: (string | null)[];
  es_capital?: boolean[];
};

/* TopoJSON as topojson-client wants it; the geometry keeps only the DIVIPOLA key. */
export type Topology = {
  type: "Topology";
  objects: Record<string, unknown>;
  arcs: unknown[];
  transform?: unknown;
};

export type AtlasCopy = {
  viewLabel: string;
  views: { plano: string; relieve: string; municipios: string };
  indicatorLabel: string;
  groups: { indice: string; variable: string; contexto: string; proyeccion: string };
  yearLabel: string;
  regionLabel: string;
  departmentLabel: string;
  all: string;
  medianLabel: string;
  /* Templates, not functions: the dictionary is a plain content file and has to stay one.
     {n} {total} {ind} {y} {name} are filled in at draw time. */
  medianFoot: string;
  evolutionLabel: string;
  dimensionsLabel: string;
  byRegionLabel: string;
  byDepartmentLabel: string;
  rankingLabel: string;
  rankingHead: { rank: string; unit: string; value: string };
  moreUnits: string;
  noData: string;
  noDataYear: string;
  drillDown: string;
  offScale: string;
  dimensions: { compuesto: string; acceso: string; uso: string; profundidad: string };
  loading: string;
  failed: string;
  projectedBadge: string;
  projectedFoot: string;
  intervalFoot: string;
  unvalidatedWidth: string;
  confidenceLabel: string;
  anchorLabel: string;
  anchorCutoff: string;
  anchorStale: string;
  anchorStaleFlag: string;
  /* Nombre de la fuente del ancla por idioma; la exportación lo trae en español. */
  anchorSources: Record<string, string>;
  projectedTableLabel: string;
  widthHead: string;
  sourceLabel: string;
  licenceLabel: string;
  licenceName: string;
};
