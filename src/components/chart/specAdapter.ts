import type { EChartsOption, SeriesOption } from 'echarts';

import { resolveAxisMeta } from './metricsRegistry';
import type { ExperimentChartSpec, MetricRegistry } from './types';

interface BuildOptionParams<DataRow, Ctx> {
  spec: ExperimentChartSpec<DataRow, Ctx>;
  data: DataRow[];
  metrics?: MetricRegistry;
  context?: Ctx;
}

const resolveNumeric = (row: Record<string, unknown>, key: string): number | undefined => {
  const value = row[key];
  return typeof value === 'number' ? value : undefined;
};

export const buildChartOption = <DataRow extends Record<string, unknown>, Ctx = unknown>({
  spec,
  data,
  metrics,
  context,
}: BuildOptionParams<DataRow, Ctx>): EChartsOption => {
  const xMeta = resolveAxisMeta(spec.x, metrics);
  const yMeta = resolveAxisMeta(spec.y, metrics);

  const series: SeriesOption[] = spec.series.map(seriesSpec => {
    const points = data
      .map(row => {
        if (seriesSpec.point) {
          return seriesSpec.point(row, context as Ctx);
        }
        const x =
          resolveNumeric(row, seriesSpec.xKey ?? spec.x.key) ?? resolveNumeric(row, spec.x.key);
        const y =
          resolveNumeric(row, seriesSpec.yKey ?? spec.y.key) ?? resolveNumeric(row, spec.y.key);
        if (x === undefined || y === undefined) return undefined;
        return { x, y };
      })
      .filter((p): p is { x: number; y: number } => !!p);

    return {
      id: seriesSpec.id,
      name: seriesSpec.name,
      type: seriesSpec.type ?? 'line',
      data: points.map(p => [p.x, p.y]),
      smooth: seriesSpec.smooth ?? seriesSpec.type === 'line',
      showSymbol: seriesSpec.showSymbol ?? seriesSpec.type !== 'line',
      emphasis: { focus: 'series' },
      lineStyle: {
        width: seriesSpec.kind === 'theory' ? 1.5 : 2,
        type: seriesSpec.kind === 'fit' ? 'dashed' : 'solid',
        color: seriesSpec.color,
      },
      itemStyle: {
        color: seriesSpec.color,
      },
      symbolSize: seriesSpec.type === 'scatter' ? 8 : 4,
    } satisfies SeriesOption;
  });

  const option: EChartsOption = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const items = Array.isArray(params) ? (params as unknown[]) : [params as unknown];
        const seen = new Set<string>();
        const lines: string[] = [];

        const first = items[0] as Record<string, unknown> | undefined;
        let axisValRaw: unknown = undefined;
        if (first) {
          if (first['axisValue'] !== undefined) axisValRaw = first['axisValue'];
          else if (first['axisValueLabel'] !== undefined) axisValRaw = first['axisValueLabel'];
          else if (Array.isArray(first['data'])) axisValRaw = (first['data'] as unknown[])[0];
          else if (first['value'] !== undefined) axisValRaw = first['value'];
        }

        if (axisValRaw !== undefined) {
          const axisValNum =
            typeof axisValRaw === 'number' ? axisValRaw : Number(axisValRaw as unknown);
          const axisDisplay = Number.isFinite(axisValNum)
            ? xMeta.formatter
              ? xMeta.formatter(axisValNum)
              : axisValNum.toFixed(2)
            : String(axisValRaw);
          lines.push(`<div><strong>${xMeta.displayName}: ${axisDisplay}</strong></div>`);
        }

        for (const item of items) {
          const p = item as Record<string, unknown>;
          const name = String(p['seriesName'] ?? p['seriesId'] ?? p['seriesIndex'] ?? 'value');
          if (seen.has(name)) continue;
          seen.add(name);

          let raw: unknown = undefined;
          if (p['value'] !== undefined) {
            const v = p['value'];
            raw = Array.isArray(v) ? (v as unknown[])[1] : v;
          } else if (Array.isArray(p['data'])) raw = (p['data'] as unknown[])[1];
          else if (p['data'] && typeof p['data'] === 'object')
            raw = (p['data'] as Record<string, unknown>)['value'] ?? p['data'];

          const valueNum = typeof raw === 'number' ? raw : Number(raw as unknown);
          const formatted = !Number.isFinite(valueNum)
            ? String(raw)
            : yMeta.formatter
              ? yMeta.formatter(valueNum)
              : valueNum.toFixed(2);

          const color = String(p['color'] ?? '#000');
          lines.push(`<div style="color:${color}">${name}: ${formatted}</div>`);
        }

        return lines.join('');
      },
    },
    grid: { left: 60, right: 20, top: 40, bottom: 50 },
    legend: { top: 0 },
    xAxis: (() => {
      // compute min/max from data across series; fall back to sensible defaults when empty
      let xMin = Infinity;
      let xMax = -Infinity;
      series.forEach(s => {
        (s.data as unknown as number[][]).forEach(point => {
          const x = point[0];
          if (typeof x === 'number') {
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
          }
        });
      });
      const defaultX = spec.x.key === 't' ? { min: 0, max: 5 } : { min: 0, max: 10 };
      if (xMin === Infinity) {
        xMin = defaultX.min;
        xMax = defaultX.max;
      } else if (xMin === xMax) {
        // expand a little if single point
        xMin = xMin - 1;
        xMax = xMax + 1;
      } else {
        // add padding
        const pad = (xMax - xMin) * 0.05;
        xMin -= pad;
        xMax += pad;
      }

      return {
        type: 'value',
        name: xMeta.displayName,
        min: xMin,
        max: xMax,
        axisLabel: {
          formatter: (value: number) =>
            xMeta.formatter ? xMeta.formatter(value) : value.toFixed(1),
        },
      };
    })(),
    yAxis: (() => {
      let yMin = Infinity;
      let yMax = -Infinity;
      series.forEach(s => {
        (s.data as unknown as number[][]).forEach(point => {
          const y = point[1];
          if (typeof y === 'number') {
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
          }
        });
      });
      const defaultY =
        spec.y.key === 't'
          ? { min: 0, max: 5 }
          : spec.y.key === 'x'
            ? { min: 0, max: 10 }
            : { min: -10, max: 10 };
      if (yMin === Infinity) {
        yMin = defaultY.min;
        yMax = defaultY.max;
      } else if (yMin === yMax) {
        yMin = yMin - 1;
        yMax = yMax + 1;
      } else {
        const pad = (yMax - yMin) * 0.05;
        yMin -= pad;
        yMax += pad;
      }

      return {
        type: 'value',
        name: yMeta.displayName,
        min: yMin,
        max: yMax,
        axisLabel: {
          formatter: (value: number) =>
            yMeta.formatter ? yMeta.formatter(value) : value.toFixed(2),
        },
        scale: true,
      };
    })(),
    series,
  };

  return option;
};
