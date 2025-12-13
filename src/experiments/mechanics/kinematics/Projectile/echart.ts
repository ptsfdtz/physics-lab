import type { ExperimentChartSpec } from '@/components/chart/types';

import type { ProjectileModel } from './model';

export function samplePoint(model: ProjectileModel) {
  const t = model.t;
  const angleRad = (model.angle * Math.PI) / 180;
  const vx = model.v * Math.cos(angleRad);
  const vy0 = model.v * Math.sin(angleRad);
  const x = model.x0 + vx * t;
  const y = Math.max(0, model.y0 + vy0 * t - 0.5 * model.g * t * t);
  const vxCurrent = vx;
  const vyCurrent = vy0 - model.g * t;
  const speed = Math.hypot(vxCurrent, vyCurrent);
  return { t, x, y, v: speed };
}

export function buildSpec(xKey: 't' | 'x' | 'y' | 'v', yKey: 't' | 'x' | 'y' | 'v') {
  const label = (k: 't' | 'x' | 'y' | 'v') =>
    k === 't' ? '时间' : k === 'x' ? '横坐标' : k === 'y' ? '高度' : '速度';
  const unit = (k: 't' | 'x' | 'y' | 'v') => (k === 't' ? 's' : k === 'v' ? 'm/s' : 'm');

  const spec: ExperimentChartSpec<{ t: number; x: number; y: number; v: number }> = {
    id: `projectile-${xKey}-${yKey}`,
    title: `${label(yKey)} 对 ${label(xKey)}`,
    x: { key: xKey, label: label(xKey), unit: unit(xKey) },
    y: { key: yKey, label: label(yKey), unit: unit(yKey) },
    series: [
      {
        id: 'series',
        name: `${label(yKey)}${yKey === 't' ? ' (s)' : yKey === 'v' ? ' (m/s)' : ' (m)'}`,
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
