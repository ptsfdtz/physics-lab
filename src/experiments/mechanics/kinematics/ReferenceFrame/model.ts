import type { ParameterConfig } from '@/types/types';

export interface ReferenceFrameModel {
  t: number;
  x: number; // 质点在全局参考系中的位置 (m)
  v: number; // 速度 (m/s)
  frameX: number; // 参考系原点在全局坐标中的位置 (m)
}

export const defaultModel: ReferenceFrameModel = {
  t: 0,
  x: 0,
  v: 1,
  frameX: 0,
};

export const modelConfigs: Record<keyof ReferenceFrameModel, ParameterConfig> = {
  t: { label: '时间 (t)', readonly: true },
  x: { label: '位置 x', unit: 'm' },
  v: { label: '速度 v', min: -10, max: 10, step: 0.1, unit: 'm/s' },
  frameX: { label: '参考系原点 (x0)', min: -10, max: 10, step: 0.1, unit: 'm' },
};

export default {};
