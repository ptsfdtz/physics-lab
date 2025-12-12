import type { ExperimentChartSpec } from '@/components/chart/types';
import { uniformDisplacement } from '@/physics/kinematics';

import type { UniformMotionModel } from './model';

export function samplePoint(model: UniformMotionModel) {
  const t = model.t;
  const x = model.x0 + uniformDisplacement(model.v, t);
  const v = model.v;
  return { t, x, v };
}

export function buildSpec(xKey: 't' | 'x' | 'v', yKey: 't' | 'x' | 'v') {
  const xLabel = xKey === 't' ? '时间' : xKey === 'x' ? '位移' : '速度';
  const yLabel = yKey === 't' ? '时间' : yKey === 'x' ? '位移' : '速度';

  const spec: ExperimentChartSpec<{ t: number; x: number; v: number }> = {
    id: `uniform-motion-${xKey}-${yKey}`,
    title: `${yLabel} 对 ${xLabel}`,
    x: {
      key: xKey,
      label: xLabel,
      unit: xKey === 't' ? 's' : xKey === 'x' ? 'm' : 'm/s',
    },
    y: {
      key: yKey,
      label: yLabel,
      unit: yKey === 't' ? 's' : yKey === 'x' ? 'm' : 'm/s',
    },
    series: [
      {
        id: 'series',
        name: `${yLabel}${yKey === 't' ? ' (s)' : yKey === 'x' ? ' (m)' : ' (m/s)'}`,
        type: 'line',
        xKey,
        yKey,
        color: '#3b82f6',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
