import type { ParameterConfig } from '../../../../types';

export interface UniformAccelerationModel {
  v0: number; // initial velocity (m/s)
  a: number; // acceleration (m/s^2)
  x0: number; // initial position (m)
  t: number; // time (s)
}

export const defaultModel: UniformAccelerationModel = {
  v0: 5,
  a: 2,
  x0: 0,
  t: 0,
};

export const modelConfigs: Record<keyof UniformAccelerationModel, ParameterConfig> = {
  v0: { label: '初速度 (v₀)', min: -20, max: 20, step: 0.5, unit: 'm/s' },
  a: { label: '加速度 (a)', min: -10, max: 10, step: 0.1, unit: 'm/s²' },
  x0: { label: '初始位置 (x₀)', min: 0, max: 50, step: 1, unit: 'm' },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};
