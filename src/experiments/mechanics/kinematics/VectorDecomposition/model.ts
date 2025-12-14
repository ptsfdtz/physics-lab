import { G } from '@/physics/constants';
import type { ParameterConfig } from '@/types/types';

export interface VectorDecompositionModel {
  v: number; // initial speed magnitude (m/s)
  angle: number; // launch angle in degrees
  x0: number;
  y0: number;
  g: number;
  t: number;
}

export const defaultModel: VectorDecompositionModel = {
  v: 12,
  angle: 40,
  x0: -20,
  y0: 10,
  g: G,
  t: 0,
};

export const modelConfigs: Record<keyof VectorDecompositionModel, ParameterConfig> = {
  v: { label: '初速度 (v)', min: 0, max: 100, step: 1, unit: 'm/s' },
  angle: { label: '发射角 (θ)', min: 0, max: 90, step: 1, unit: '°' },
  x0: { label: '初始横坐标 (x₀)', min: -50, max: 50, step: 1, unit: 'm' },
  y0: { label: '初始高度 (y₀)', min: 0, max: 200, step: 1, unit: 'm' },
  g: { label: '重力 (g)', min: 0, max: 20, step: 0.1, unit: 'm/s²' },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};

export default {};
