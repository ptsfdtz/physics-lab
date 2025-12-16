import { useCallback, useState } from 'react';
import { BlockMath } from 'react-katex';

import { PhysicsCanvas } from '@/components';
import { Button } from '@/components/ui/Button';

import type { EquilibriumModel } from './model';
import { defaultModel, modelConfigs } from './model';
import EquilibriumRenderer from './renderer';

export default function EquilibriumPage() {
  const [model, setModel] = useState<EquilibriumModel>(defaultModel);

  const handleReset = useCallback(() => {
    setModel(defaultModel);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas>
        <EquilibriumRenderer model={model} />
      </PhysicsCanvas>

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">共点力平衡</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 质量 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">质量 (m)</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.m.toFixed(1)} kg
              </span>
            </div>
            <input
              type="range"
              min={modelConfigs.m.min}
              max={modelConfigs.m.max}
              step={modelConfigs.m.step}
              value={model.m}
              onChange={e => setModel(prev => ({ ...prev, m: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* F1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F1 大小</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.F1.toFixed(1)} N
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={model.F1}
              onChange={e => setModel(prev => ({ ...prev, F1: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F1 角度 (°)</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.theta1.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={model.theta1}
              onChange={e => setModel(prev => ({ ...prev, theta1: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* F2 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F2 大小</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.F2.toFixed(1)} N
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={model.F2}
              onChange={e => setModel(prev => ({ ...prev, F2: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F2 角度 (°)</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.theta2.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={model.theta2}
              onChange={e => setModel(prev => ({ ...prev, theta2: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* F3 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F3 大小</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.F3.toFixed(1)} N
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={model.F3}
              onChange={e => setModel(prev => ({ ...prev, F3: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">F3 角度 (°)</label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                {model.theta3.toFixed(0)}°
              </span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={5}
              value={model.theta3}
              onChange={e => setModel(prev => ({ ...prev, theta3: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 重力开关 */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">包含重力</label>
            <Button
              variant={model.includeWeight ? 'primary' : 'outline'}
              onClick={() =>
                setModel(prev => ({ ...prev, includeWeight: prev.includeWeight ? 0 : 1 }))
              }
            >
              {model.includeWeight ? '开' : '关'}
            </Button>
          </div>

          {/* 公式 */}
          <div className="pt-6 mt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">公式</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="space-y-2 text-xs">
                <BlockMath math={String.raw`\sum \vec F = 0 \iff \text{平衡}`} />
                <BlockMath math={String.raw`\vec F_i = F_i(\cos\theta_i, \sin\theta_i)`} />
                <BlockMath math={String.raw`a = \dfrac{\sum F}{m}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={handleReset} className="w-full">
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
