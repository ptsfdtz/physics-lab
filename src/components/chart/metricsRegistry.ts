import type { AxisSpec, MetricRegistry, MetricSpec } from './types';

export const baseMetricRegistry: MetricRegistry = {
  t: { key: 't', label: '时间', unit: 's' },
  x: { key: 'x', label: '位移', unit: 'm' },
  s: { key: 's', label: '位移', unit: 'm' },
  v: { key: 'v', label: '速度', unit: 'm/s' },
  a: { key: 'a', label: '加速度', unit: 'm/s^2' },
  F: { key: 'F', label: '力', unit: 'N' },
  m: { key: 'm', label: '质量', unit: 'kg' },
};

export const mergeMetricRegistry = (
  overrides?: MetricRegistry,
  base: MetricRegistry = baseMetricRegistry
): MetricRegistry => ({
  ...base,
  ...(overrides ?? {}),
});

export interface AxisMeta extends MetricSpec {
  displayName: string;
}

export const resolveAxisMeta = (axis: AxisSpec, registry?: MetricRegistry): AxisMeta => {
  const metric = registry?.[axis.key];
  const label = axis.label ?? metric?.label ?? axis.key;
  const unit = axis.unit ?? metric?.unit;

  return {
    key: axis.key,
    label,
    unit,
    formatter: axis.formatter ?? metric?.formatter,
    displayName: unit ? `${label} (${unit})` : label,
  };
};
