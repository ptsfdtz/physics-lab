import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';

import { ChartHost } from './ChartHost';
import { baseMetricRegistry } from './metricsRegistry';
import { buildChartOption } from './specAdapter';
import type { ExperimentChartSpec, MetricRegistry } from './types';

interface ExperimentChartProps<DataRow extends Record<string, unknown>, Ctx = unknown> {
  spec: ExperimentChartSpec<DataRow, Ctx>;
  data: DataRow[];
  context?: Ctx;
  metrics?: MetricRegistry;
  className?: string;
  style?: CSSProperties;
}

export function ExperimentChart<DataRow extends Record<string, unknown>, Ctx = unknown>({
  spec,
  data,
  context,
  metrics = baseMetricRegistry,
  className,
  style,
}: ExperimentChartProps<DataRow, Ctx>) {
  const option: EChartsOption = useMemo(
    () => buildChartOption({ spec, data, metrics, context }),
    [spec, data, metrics, context]
  );

  return <ChartHost option={option} className={className} style={style} />;
}
