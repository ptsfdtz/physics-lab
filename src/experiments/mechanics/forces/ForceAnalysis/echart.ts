import type { ExperimentChartSpec } from '@/components/chart/types';
import { G } from '@/physics/constants';

import type { ForceAnalysisModel } from './model';

export function samplePoint(model: ForceAnalysisModel) {
  const t = model.t;
  const m = model.m;
  const thetaRad = (model.theta * Math.PI) / 180;
  const Fx = model.F * Math.cos(thetaRad);
  const Fy = model.F * Math.sin(thetaRad);
  // 使用与渲染器一致的摩擦计算：当接近静止且外力不足以克服静摩擦时，静摩擦等于外力（抵消）
  const N = Math.max(0, m * G - Fy);
  const f_mag = Math.max(0, model.mu * N);

  const eps = 1e-3;
  // 计算 signed 摩擦力（力的方向：摩擦总是与运动或外力趋向相反）
  let fSigned = 0;
  if (Math.abs(model.v) < eps) {
    if (Math.abs(Fx) <= f_mag) {
      // 静摩擦完全抵消外力：f_signed = -Fx，使得 Fx + f_signed = 0
      fSigned = -Fx;
    } else {
      // 外力超过静摩擦上限，摩擦变为动摩擦，方向与外力相反
      fSigned = -Math.sign(Fx) * f_mag;
    }
  } else {
    // 运动摩擦：与速度方向相反
    fSigned = -Math.sign(model.v) * f_mag;
  }

  const netFx = Fx + fSigned; // 合力为外力 + 摩擦（signed）

  return {
    t,
    x: model.x,
    v: model.v,
    Fx,
    f: Math.abs(fSigned), // 返回给图表的摩擦为正的幅值
    fSigned,
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
