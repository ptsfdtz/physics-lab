import type { ParameterConfig } from '../../../../types/types';

export interface FreeFallModel {
  v0: number; // initial vertical velocity (m/s), positive downwards
  y0: number; // initial height above ground (m)
  g: number; // gravitational acceleration (m/s^2) positive downwards
  t: number; // time (s)
}

export const defaultModel: FreeFallModel = {
  v0: 0,
  y0: 90,
  g: 9.8,
  t: 0,
};

export const modelConfigs: Record<keyof FreeFallModel, ParameterConfig> = {
  v0: { label: '初速度 (v₀)', min: -20, max: 20, step: 0.5, unit: 'm/s' },
  y0: { label: '高度 (y₀)', min: 0, max: 100, step: 1, unit: 'm' },
  g: { label: '重力加速度 (g)', min: 0, max: 20, step: 0.1, unit: 'm/s²' },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};

export default {};
