import type { ExperimentChartSpec } from '@/components/chart/types';

import type { ReferenceFrameModel } from './model';

export function samplePoint(model: ReferenceFrameModel) {
  const t = model.t;
  const xA = model.xA; // 地面参考系中A的位置
  const xRel = model.xA - model.xB; // 动地参考系中A的相对位置
  const vA = model.vA; // 地面参考系中A的速度
  const vRel = model.vA - model.vB; // 动地参考系中A的相对速度
  return { t, xA, xRel, vA, vRel };
}

export function buildSpec(xKey: string, yKey: string) {
  const labelMap: Record<string, string> = {
    t: '时间',
    xA: '地面位置',
    xRel: '相对位置',
    vA: '地面速度',
    vRel: '相对速度',
  };

  const unitMap: Record<string, string> = {
    t: 's',
    xA: 'm',
    xRel: 'm',
    vA: 'm/s',
    vRel: 'm/s',
  };

  const colorMap: Record<string, string> = {
    xA: '#3b82f6', // 蓝色（地面参考系）
    xRel: '#8b5cf6', // 紫色（相对位置）
    vA: '#06b6d4', // 青色（地面速度）
    vRel: '#ec4899', // 粉红色（相对速度）
  };

  const spec: ExperimentChartSpec<Record<string, number>> = {
    id: `reference-frame-${xKey}-${yKey}`,
    title: `${labelMap[yKey]} 对 ${labelMap[xKey]}`,
    x: { key: xKey, label: labelMap[xKey], unit: unitMap[xKey] },
    y: { key: yKey, label: labelMap[yKey], unit: unitMap[yKey] },
    series: [
      {
        id: 'series',
        name: `${labelMap[yKey]}`,
        type: 'line',
        xKey,
        yKey,
        color: colorMap[yKey] || '#06b6d4',
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
