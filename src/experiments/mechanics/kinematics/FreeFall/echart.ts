import type { ExperimentChartSpec } from '@/components/chart/types';
import { displacementTime, velocityTime } from '@/physics/kinematics';

import type { FreeFallModel } from './model';

export function samplePoint(model: FreeFallModel) {
  const t = model.t;
  const disp = displacementTime(model.v0, model.g, t); // downward displacement
  const y = Math.max(0, model.y0 - disp); // height above ground
  const v = velocityTime(model.v0, model.g, t);
  return { t, y, v };
}

export function buildSpec(xKey: 't' | 'y' | 'v', yKey: 't' | 'y' | 'v') {
  const labelFor = (k: 't' | 'y' | 'v') => (k === 't' ? '时间' : k === 'y' ? '高度' : '速度');
  const unitFor = (k: 't' | 'y' | 'v') => (k === 't' ? 's' : k === 'y' ? 'm' : 'm/s');

  const xLabel = labelFor(xKey);
  const yLabel = labelFor(yKey);

  const spec: ExperimentChartSpec<{ t: number; y: number; v: number }> = {
    id: `free-fall-${xKey}-${yKey}`,
    title: `${yLabel} 对 ${xLabel}`,
    x: {
      key: xKey,
      label: xLabel,
      unit: unitFor(xKey),
    },
    y: {
      key: yKey,
      label: yLabel,
      unit: unitFor(yKey),
    },
    series: [
      {
        id: 'series',
        name: `${yLabel}${yKey === 't' ? ' (s)' : yKey === 'y' ? ' (m)' : ' (m/s)'}`,
        type: 'line',
        xKey,
        yKey,
        color: '#f97316',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
