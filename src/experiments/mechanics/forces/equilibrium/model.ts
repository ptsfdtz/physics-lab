import { G } from '@/physics/constants';
import type { ParameterConfig } from '@/types/types';

export interface EquilibriumModel {
  m: number; // 质量 kg
  // 三个可调力：大小(N)与方向(°)
  F1: number;
  theta1: number; // 角度: 0° 向右，90° 向上
  F2: number;
  theta2: number;
  F3: number;
  theta3: number;
  // 是否包含重力
  includeWeight: number; // 0 或 1
  // 位置和速度
  x: number; // 位置 (m)
  y: number; // 位置 (m)
  vx: number; // 速度 (m/s)
  vy: number; // 速度 (m/s)
}

export const defaultModel: EquilibriumModel = {
  m: 2,
  F1: 10,
  theta1: 0,
  F2: 10,
  theta2: 120,
  F3: 10,
  theta3: 240,
  includeWeight: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
};

export const modelConfigs: Record<keyof EquilibriumModel, ParameterConfig> = {
  m: { label: '质量 (m)', min: 0.5, max: 10, step: 0.5, unit: 'kg' },
  F1: { label: 'F1 大小', min: 0, max: 50, step: 1, unit: 'N' },
  theta1: { label: 'F1 角度 (°)', min: -180, max: 180, step: 5, unit: '°' },
  F2: { label: 'F2 大小', min: 0, max: 50, step: 1, unit: 'N' },
  theta2: { label: 'F2 角度 (°)', min: -180, max: 180, step: 5, unit: '°' },
  F3: { label: 'F3 大小', min: 0, max: 50, step: 1, unit: 'N' },
  theta3: { label: 'F3 角度 (°)', min: -180, max: 180, step: 5, unit: '°' },
  includeWeight: { label: '包含重力', min: 0, max: 1, step: 1 },
  x: { label: 'x', readonly: true },
  y: { label: 'y', readonly: true },
  vx: { label: 'vx', readonly: true },
  vy: { label: 'vy', readonly: true },
};

export function computeVectors(model: EquilibriumModel) {
  const rad1 = (model.theta1 * Math.PI) / 180;
  const rad2 = (model.theta2 * Math.PI) / 180;
  const rad3 = (model.theta3 * Math.PI) / 180;

  const v1 = { x: model.F1 * Math.cos(rad1), y: -model.F1 * Math.sin(rad1) };
  const v2 = { x: model.F2 * Math.cos(rad2), y: -model.F2 * Math.sin(rad2) };
  const v3 = { x: model.F3 * Math.cos(rad3), y: -model.F3 * Math.sin(rad3) };
  const w = model.includeWeight ? { x: 0, y: model.m * G } : { x: 0, y: 0 };

  const sum = { x: v1.x + v2.x + v3.x + w.x, y: v1.y + v2.y + v3.y + w.y };
  const mag = Math.hypot(sum.x, sum.y);
  return { v1, v2, v3, w, sum, mag };
}

export function integrate(model: EquilibriumModel, dt: number): EquilibriumModel {
  const { sum } = computeVectors(model);
  const ax = sum.x / model.m;
  const ay = sum.y / model.m;

  const damping = 0.98;
  const vx = (model.vx + ax * dt) * damping;
  const vy = (model.vy + ay * dt) * damping;
  const x = model.x + vx * dt;
  const y = model.y + vy * dt;

  return { ...model, vx, vy, x, y };
}
