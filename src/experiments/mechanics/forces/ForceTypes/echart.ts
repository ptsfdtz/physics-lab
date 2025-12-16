import type { ExperimentChartSpec } from '@/components/chart/types';

import type { ForceDataPoint, ForceTypesModel } from './model';
import { calculateForces } from './model';

export function samplePoint(model: ForceTypesModel): ForceDataPoint {
  const forces = calculateForces(model);
  return {
    mass: model.mass,
    gravity: forces.gravity,
    normal: forces.normal,
    friction: forces.friction,
    tension: forces.tension,
    gravityParallel: forces.gravityParallel,
    gravityPerpendicular: forces.gravityPerpendicular,
  };
}

export function buildSpec(
  xKey: keyof ForceDataPoint & string,
  yKey: keyof ForceDataPoint & string
): ExperimentChartSpec<ForceDataPoint, unknown> {
  const labelMap: Record<string, string> = {
    mass: '质量',
    gravity: '重力',
    normal: '支持力',
    friction: '摩擦力',
    tension: '拉力',
    gravityParallel: '重力平行分量',
    gravityPerpendicular: '重力垂直分量',
  };

  const unitMap: Record<string, string> = {
    mass: 'kg',
    gravity: 'N',
    normal: 'N',
    friction: 'N',
    tension: 'N',
    gravityParallel: 'N',
    gravityPerpendicular: 'N',
  };

  const colorMap: Record<string, string> = {
    gravity: '#ef4444',
    normal: '#10b981',
    friction: '#ec4899',
    tension: '#06b6d4',
    gravityParallel: '#fbbf24',
    gravityPerpendicular: '#a78bfa',
  };

  const spec: ExperimentChartSpec<ForceDataPoint> = {
    id: `force-types-${xKey}-${yKey}`,
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
        color: colorMap[yKey] || '#3b82f6',
        smooth: true,
        showSymbol: true,
      },
    ],
  };

  return spec;
}

export default { samplePoint, buildSpec };
