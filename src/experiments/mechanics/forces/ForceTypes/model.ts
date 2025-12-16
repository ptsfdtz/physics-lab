import type { ParameterConfig } from '@/types/types';

export type ForceType = 'gravity' | 'normal' | 'friction' | 'tension' | 'applied';

export interface ForceTypesModel {
  // 选择展示的力类型（可多选）
  selectedForces: ForceType[];
  // 物体相关参数
  mass: number; // kg
  angle: number; // 斜面角度 degrees (0-60)
  // 力的大小参数
  appliedForce: number; // 外加力 N
  coefficientFriction: number; // 摩擦系数 (0-1)
  // 是否显示力的分解
  showComponents: boolean;
}

export interface ForceDataPoint extends Record<string, unknown> {
  mass: number;
  gravity: number;
  normal: number;
  friction: number;
  tension: number;
  gravityParallel: number;
  gravityPerpendicular: number;
}

export const defaultModel: ForceTypesModel = {
  selectedForces: ['gravity', 'normal', 'friction', 'tension'],
  mass: 2,
  angle: 0,
  appliedForce: 5,
  coefficientFriction: 0.3,
  showComponents: false,
};

export const modelConfigs: Record<keyof ForceTypesModel, ParameterConfig> = {
  selectedForces: { label: '选择力类型', readonly: true },
  mass: { label: '物体质量 (m)', min: 0.5, max: 10, step: 0.5, unit: 'kg' },
  angle: { label: '斜面角度 (θ)', min: 0, max: 60, step: 5, unit: '°' },
  appliedForce: { label: '外加力 (F)', min: 0, max: 50, step: 1, unit: 'N' },
  coefficientFriction: {
    label: '摩擦系数 (μ)',
    min: 0,
    max: 1,
    step: 0.1,
  },
  showComponents: { label: '显示力的分解', readonly: true },
};

// 物理常数
export const g = 10; // m/s²

// 计算各种力的大小
export function calculateForces(model: ForceTypesModel) {
  const angleRad = (model.angle * Math.PI) / 180;

  // 重力 G = mg
  const gravity = model.mass * g;
  // 重力分量：沿斜面方向和垂直方向
  const gravityParallel = gravity * Math.sin(angleRad);
  const gravityPerpendicular = gravity * Math.cos(angleRad);

  // 支持力 N = mg cos(θ)
  const normal = gravityPerpendicular;

  // 摩擦力 f = μN
  const friction = model.coefficientFriction * normal;

  // 拉力（外加力）
  const tension = model.appliedForce;

  return {
    gravity,
    gravityParallel,
    gravityPerpendicular,
    normal,
    friction,
    tension,
  };
}

export default {};
