import { useCallback, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { BlockMath } from 'react-katex';

import { PhysicsCanvas } from '@/components';
import { Button } from '@/components/ui/Button';

import type { ForceTypesModel } from './model';
import { defaultModel, modelConfigs } from './model';
import ForceTypesRenderer from './renderer';

export default function ForceTypesPage() {
  const [model, setModel] = useState<ForceTypesModel>(defaultModel);

  const handleToggleComponents = useCallback(() => {
    setModel(prev => ({
      ...prev,
      showComponents: !prev.showComponents,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setModel(defaultModel);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas>
        <ForceTypesRenderer model={model} />
      </PhysicsCanvas>

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">控制面板</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 参数控制 */}
          {Object.entries(modelConfigs).map(([key, config]) => {
            if (key === 'selectedForces' || key === 'showComponents') return null;
            const value = model[key as keyof ForceTypesModel] as number;
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">{config.label}</label>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                    {value.toFixed(config.step && config.step < 1 ? 2 : 1)} {config.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={value}
                  onChange={e =>
                    setModel(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            );
          })}

          {/* 公式 */}
          <div className="pt-6 mt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">公式</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="space-y-2 text-xs">
                <div className="katex-display">
                  <BlockMath math="G = mg" />
                </div>
                <div className="katex-display">
                  <BlockMath math="N = mg\cos\theta" />
                </div>
                <div className="katex-display">
                  <BlockMath math="f = \mu N" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button
              onClick={handleToggleComponents}
              variant="outline"
              className="flex-1"
              title="分解演示"
            >
              分解
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
