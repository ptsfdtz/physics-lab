import type { ExperimentChartSpec } from '@/components/chart/types';
import { G } from '@/physics/constants';

import type { ForceAnalysisModel } from './model';

export function samplePoint(model: ForceAnalysisModel) {
  const t = model.t;
  const m = model.m;
  const thetaRad = (model.theta * Math.PI) / 180;
  const Fx = model.F * Math.cos(thetaRad);
  const Fy = model.F * Math.sin(thetaRad);
  const N = m * G - Fy;
  const f_mag = Math.max(0, model.mu * N);

  // determine friction sign similar to renderer/logic
  let frictionSign = 0;
  if (Math.abs(Fx) > 1e-3) frictionSign = -Math.sign(Fx);
  else if (Math.abs(model.v) >= 1e-3) frictionSign = -Math.sign(model.v);

  const frictionSigned = frictionSign * f_mag;
  const netFx = Fx + frictionSigned;

  return {
    t,
    x: model.x,
    v: model.v,
    Fx,
    f: frictionSigned,
    netFx,
  };
}

export function buildSpec(xKey: string, yKey: string) {
  const labelFor = (k: string) =>
    k === 't'
      ? '时间'
      : k === 'x'
        ? '位置'
        : k === 'v'
          ? '速度'
          : k === 'Fx'
            ? '外力(Fx)'
            : k === 'f'
              ? '摩擦(f)'
              : '合力';
  const unitFor = (k: string) => (k === 't' ? 's' : k === 'x' ? 'm' : k === 'v' ? 'm/s' : 'N');

  const xLabel = labelFor(xKey);
  const yLabel = labelFor(yKey);

  const spec: ExperimentChartSpec<Record<string, number>> = {
    id: `force-analysis-${xKey}-${yKey}`,
    title: `${yLabel} 对 ${xLabel}`,
    x: { key: xKey, label: xLabel, unit: unitFor(xKey) },
    y: { key: yKey, label: yLabel, unit: unitFor(yKey) },
    series: [
      {
        id: 'series',
        name: `${yLabel}`,
        type: 'line',
        xKey,
        yKey,
        color: '#06b6d4',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
