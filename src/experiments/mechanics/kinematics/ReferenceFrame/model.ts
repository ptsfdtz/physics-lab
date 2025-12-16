import type { ParameterConfig } from '@/types/types';

export interface ReferenceFrameModel {
  t: number;
  // 物体 A（地面参考系中观察）
  xA: number; // 物体A在地面参考系中的位置 (m)
  vA: number; // 物体A的速度 (m/s)
  // 物体 B（动地参考系的原点）
  xB: number; // 物体B在地面参考系中的位置 (m)
  vB: number; // 物体B的速度 (m/s)
}

export const defaultModel: ReferenceFrameModel = {
  t: 0,
  xA: 0,
  vA: 2,
  xB: 5,
  vB: 1,
};

export const modelConfigs: Record<keyof ReferenceFrameModel, ParameterConfig> = {
  t: { label: '时间 (t)', readonly: true },
  xA: { label: '物体A位置', min: 0, max: 30, step: 0.5, unit: 'm' },
  vA: { label: '物体A速度', min: -10, max: 10, step: 0.1, unit: 'm/s' },
  xB: { label: '物体B位置', min: 0, max: 30, step: 0.5, unit: 'm' },
  vB: { label: '物体B速度', min: -10, max: 10, step: 0.1, unit: 'm/s' },
};

export default {};
