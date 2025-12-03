import type { ParameterConfig } from '../../../../types';

export interface UniformMotionModel {
  v: number; // Velocity (m/s)
  x0: number; // Initial position (m)
  t: number; // Time (s) - Read only mostly, controlled by animation
}

export const defaultModel: UniformMotionModel = {
  v: 5,
  x0: 0,
  t: 0,
};

export const modelConfigs: Record<keyof UniformMotionModel, ParameterConfig> = {
  v: { label: '速度 (v)', min: -20, max: 20, step: 0.5, unit: 'm/s' },
  x0: { label: '初始位置 (x₀)', min: 0, max: 50, step: 1, unit: 'm' },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};
