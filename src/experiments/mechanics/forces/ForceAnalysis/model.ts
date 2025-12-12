import type { ParameterConfig } from '@/types/types';

export interface ForceAnalysisModel {
  m: number; // 质量 (kg)
  F: number; // 外力大小 (N)
  theta: number; // 外力与水平的夹角 (deg)
  mu: number; // 摩擦系数
  v: number; // 速度 (m/s)
  x: number; // 位置 (m)
  t: number; // 时间 (s)
}

export const defaultModel: ForceAnalysisModel = {
  m: 2,
  F: 0,
  theta: 0,
  mu: 0.2,
  v: 0,
  x: 0,
  t: 0,
};

export const modelConfigs: Record<keyof ForceAnalysisModel, ParameterConfig> = {
  m: { label: '质量 (m)', min: 0.1, max: 20, step: 0.1, unit: 'kg' },
  F: { label: '外力大小 (F)', min: 0, max: 50, step: 0.5, unit: 'N' },
  theta: { label: '外力角度 (θ)', min: -89, max: 89, step: 1, unit: '°' },
  mu: { label: '摩擦系数 (μ)', min: 0, max: 1, step: 0.01 },
  v: { label: '速度 (v)', unit: 'm/s', readonly: true },
  x: { label: '位置 (x)', unit: 'm', readonly: true },
  t: { label: '时间 (t)', unit: 's', readonly: true },
};
