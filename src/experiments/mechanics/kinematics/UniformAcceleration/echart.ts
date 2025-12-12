import type { ExperimentChartSpec } from '@/components/chart/types';
import { displacementTime, velocityTime } from '@/physics/kinematics';

import type { UniformAccelerationModel } from './model';

export function samplePoint(model: UniformAccelerationModel) {
  const t = model.t;
  const x = model.x0 + displacementTime(model.v0, model.a, t);
  const v = velocityTime(model.v0, model.a, t);
  return { t, x, v };
}

export function buildSpec(xKey: 't' | 'x' | 'v', yKey: 't' | 'x' | 'v') {
  const xLabel = xKey === 't' ? '时间' : xKey === 'x' ? '位移' : '速度';
  const yLabel = yKey === 't' ? '时间' : yKey === 'x' ? '位移' : '速度';

  const spec: ExperimentChartSpec<{ t: number; x: number; v: number }> = {
    id: `uniform-accel-${xKey}-${yKey}`,
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
        color: '#10b981',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
