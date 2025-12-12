import { Play, Pause, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/Button';
import type { ParameterConfig } from '@/types/types';

interface ParameterControllerProps<T> {
  model: T;
  onChange: (newModel: T) => void;
  configs: Record<keyof T, ParameterConfig>;
  onPlayPause?: () => void;
  onReset?: () => void;
  isPlaying?: boolean;
  onDecompose?: () => void;
  formula?: React.ReactNode;
}

export function ParameterController<T extends object>({
  model,
  onChange,
  configs,
  onPlayPause,
  onReset,
  isPlaying,
  onDecompose,
  formula,
}: ParameterControllerProps<T>) {
  const handleChange = (key: keyof T, value: number) => {
    onChange({
      ...model,
      [key]: value,
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-800">控制面板</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(configs).map(([key, config]) => {
          const typedConfig = config as ParameterConfig;
          const value = (model as never)[key] as number;

          if (typedConfig.readonly) {
            return (
              <div key={key} className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  {typedConfig.label}
                </label>
                <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-gray-900 font-mono">
                  {value.toFixed(2)} {typedConfig.unit}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{typedConfig.label}</label>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                  {value.toFixed(1)} {typedConfig.unit}
                </span>
              </div>
              <input
                type="range"
                min={typedConfig.min}
                max={typedConfig.max}
                step={typedConfig.step}
                value={value}
                onChange={e => handleChange(key as keyof T, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          );
        })}

        {formula && (
          <div className="pt-6 mt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">公式</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-gray-800 font-serif text-lg leading-relaxed katex-display">
                {formula}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Button onClick={onPlayPause} className="flex-1 flex items-center justify-center gap-2">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? '暂停' : '开始'}
          </Button>
          {onDecompose && (
            <Button variant="outline" onClick={onDecompose} title="分解演示">
              分解
            </Button>
          )}
          <Button variant="outline" onClick={onReset} title="重置">
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
