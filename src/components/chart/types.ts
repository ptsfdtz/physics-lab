export type SeriesKind = 'measured' | 'theory' | 'fit';

export interface MetricSpec {
  key: string;
  label: string;
  unit?: string;
  formatter?: (value: number) => string;
}

export type MetricRegistry = Record<string, MetricSpec>;

export interface AxisSpec {
  key: string;
  label?: string;
  unit?: string;
  formatter?: (value: number) => string;
}

export interface ChartSeriesSpec<DataRow = unknown, Ctx = unknown> {
  id: string;
  name: string;
  type?: 'line' | 'scatter';
  kind?: SeriesKind;
  color?: string;
  xKey?: string;
  yKey?: string;
  showSymbol?: boolean;
  smooth?: boolean;
  /**
   * Optional mapper when the point is derived instead of coming directly from xKey/yKey.
   */
  point?: (row: DataRow, ctx: Ctx) => { x: number; y: number };
}

export interface ExperimentChartSpec<DataRow = unknown, Ctx = unknown> {
  id: string;
  title: string;
  description?: string;
  x: AxisSpec;
  y: AxisSpec;
  series: ChartSeriesSpec<DataRow, Ctx>[];
}
