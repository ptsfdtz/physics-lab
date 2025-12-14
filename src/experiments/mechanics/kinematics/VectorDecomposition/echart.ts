import type { ExperimentChartSpec } from '@/components/chart/types';

import type { VectorDecompositionModel } from './model';

export type SamplePoint = { t: number; x: number; y: number };

export function samplePoint(m: VectorDecompositionModel): SamplePoint {
  const angle = (m.angle * Math.PI) / 180;
  const vx = m.v * Math.cos(angle);
  const vy0 = m.v * Math.sin(angle);
  const x = m.x0 + vx * m.t;
  const y = Math.max(0, m.y0 + vy0 * m.t - 0.5 * m.g * m.t * m.t);
  return { t: m.t, x, y };
}

export function buildSpec(xKey: 't' | 'x' | 'y', yKey: 'x' | 'y' | 't') {
  const labelFor = (k: string) => (k === 't' ? '时间' : k === 'x' ? 'x' : 'y');
  const unitFor = (k: string) => (k === 't' ? 's' : 'm');

  const spec: ExperimentChartSpec<{ t: number; x: number; y: number }> = {
    id: `vector-decomposition-${xKey}-${yKey}`,
    title: `${labelFor(yKey)} 对 ${labelFor(xKey)}`,
    x: { key: xKey, label: labelFor(xKey), unit: unitFor(xKey) },
    y: { key: yKey, label: labelFor(yKey), unit: unitFor(yKey) },
    series: [
      {
        id: 'series',
        name: `${labelFor(yKey)}`,
        type: 'line',
        xKey,
        yKey,
        color: '#10b981',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}
