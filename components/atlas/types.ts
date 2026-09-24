/* The contract the thesis repository exports with `uv run iif atlas`. The files land in
   public/atlas/ and nothing here reshapes them: what the warehouse publishes is what the map reads. */

export type Level = "departamento" | "municipio";
export type View = "plano" | "relieve" | "municipios";

export type Indicator = {
  id: string;
  etiqueta: string;
  /* `proyeccion` exists only at department level and only in `anios_proyectados` (D-36). */
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
     the projected years, where the index itself has no value. Absent in older exports. */
  anios_proyectados?: number[];
  nombres: string[];
  /* One matrix per indicator: years by units. A null is a unit nobody reported, never a zero. */
  series: Record<string, (number | null)[][]>;
  region?: string[];
  dpto_ccdgo?: (string | null)[];
  mpio_tipo?: (string | null)[];
  es_capital?: boolean[];
  /* What the forecast layer says about itself: the anchor it is conditional on and the
     backtest that judges it. Every key is optional because the page only repeats what the
     export publishes; a missing key drops its sentence, it is never filled in here. */
  proyeccion?: ForecastInfo;
};

export type ForecastInfo = {
  ancla?: {
    fuente?: string;
    fecha_corte?: string;
    antiguedad_meses?: number;
    antiguedad_maxima_meses?: number;
    vencida?: boolean;
  };
  /* Nominal level of the published interval, as a fraction (0.8). */
  nivel_intervalo?: number;
  vintage?: string;
  backtest?: {
    origenes_ganados?: number;
    n_origenes?: number;
    dm_p?: number;
    dm_agrupacion?: string;
    cobertura_intervalo_empirica?: number;
    cobertura_intervalo_nominal?: number;
  };
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
  sourceLabel: string;
  licenceLabel: string;
  licenceName: string;
  /* The forecast layer (D-36). Templates again: {source} {date} {months} {max} {won} {n}
     {p} {nominal} {empirical} {v} {lo} {hi} {half} {level} come from the JSON at draw time, so
     no figure of the thesis is written in the dictionary. */
  forecast: {
    municipalOnly: string;
    noteLabel: string;
    anchor: string;
    anchorAge: string;
    scenario: string;
    backtest: string;
    coverage: string;
    encoding: string;
    encodingWidth: string;
    legendProjected: string;
    legendConfidence: string;
    growthValue: string;
    widthValue: string;
    interval: string;
    listLabel: string;
    listFoot: string;
  };
};
