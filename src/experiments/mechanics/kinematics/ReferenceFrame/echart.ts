import type { ExperimentChartSpec } from '@/components/chart/types';

import type { ReferenceFrameModel } from './model';

export function samplePoint(model: ReferenceFrameModel) {
  const t = model.t;
  const xRel = model.x - model.frameX; // 在参考系中的位置
  return { t, x: xRel, v: model.v };
}

export function buildSpec(xKey: string, yKey: string) {
  const labelFor = (k: string) => (k === 't' ? '时间' : k === 'x' ? '位置' : '速度');
  const unitFor = (k: string) => (k === 't' ? 's' : k === 'x' ? 'm' : 'm/s');

  const spec: ExperimentChartSpec<Record<string, number>> = {
    id: `reference-frame-${xKey}-${yKey}`,
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
        color: '#06b6d4',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
