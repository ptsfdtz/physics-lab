import { Select } from '@/components';

export interface OptionItem<T extends string> {
  value: T;
  label: string;
}

interface ChartControlsProps<X extends string, Y extends string> {
  xKey: X;
  yKey: Y;
  onXChange: (v: X) => void;
  onYChange: (v: Y) => void;
  xOptions?: OptionItem<X>[];
  yOptions?: OptionItem<Y>[];
  className?: string;
  xLabel?: string;
  yLabel?: string;
}

export const ChartControls = <X extends string, Y extends string>({
  xKey,
  yKey,
  onXChange,
  onYChange,
  xOptions,
  yOptions,
  className,
  xLabel = 'X轴',
  yLabel = 'Y轴',
}: ChartControlsProps<X, Y>) => {
  const defaultXOptions = [
    { value: 't', label: '时间 (t)' },
    { value: 'y', label: '高度 (y)' },
    { value: 'v', label: '速度 (v)' },
  ] as const;

  const defaultYOptions = [
    { value: 'y', label: '高度 (y)' },
    { value: 'v', label: '速度 (v)' },
    { value: 't', label: '时间 (t)' },
  ] as const;

  const xOpts = (xOptions ?? (defaultXOptions as unknown)) as OptionItem<X>[];
  const yOpts = (yOptions ?? (defaultYOptions as unknown)) as OptionItem<Y>[];

  return (
    <div className={className ?? 'p-2 bg-white/80 flex items-center gap-2'}>
      <label className="text-lg font-bold text-gray-600">{xLabel}:</label>
      <Select<X> value={xKey} onChange={onXChange} options={xOpts} />

      <label className="text-lg font-bold text-gray-600">{yLabel}:</label>
      <Select<Y> value={yKey} onChange={onYChange} options={yOpts} />
    </div>
  );
};

export default ChartControls;
