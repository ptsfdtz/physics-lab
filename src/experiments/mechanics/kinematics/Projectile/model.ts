import type { ParameterConfig } from '../../../../types/types';

export interface ProjectileModel {
  v: number; // initial speed magnitude (m/s)
  angle: number; // launch angle in degrees (upwards)
  x0: number; // initial horizontal position (m)
  y0: number; // initial height above ground (m)
  g: number; // gravity (m/s^2)
  t: number; // time (s)
}

export const defaultModel: ProjectileModel = {
  v: 20,
  angle: 45,
  x0: 0,
  y0: 10,
  g: 9.8,
  t: 0,
};

export const modelConfigs: Record<keyof ProjectileModel, ParameterConfig> = {
  v: { label: '初速度 (v)', min: 0, max: 100, step: 1, unit: 'm/s' },
  angle: { label: '发射角 (θ)', min: 0, max: 90, step: 1, unit: '°' },
  x0: { label: '初始横坐标 (x₀)', min: -50, max: 50, step: 1, unit: 'm' },
  y0: { label: '初始高度 (y₀)', min: 0, max: 200, step: 1, unit: 'm' },
  g: { label: '重力 (g)', min: 0, max: 20, step: 0.1, unit: 'm/s²' },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};

export default {};
