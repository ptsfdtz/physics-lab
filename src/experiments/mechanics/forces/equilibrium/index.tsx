import { useCallback, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

import type { EquilibriumModel } from './model';
import { defaultModel, integrate, modelConfigs } from './model';
import EquilibriumRenderer from './renderer';

export default function EquilibriumPage() {
  const [model, setModel] = useState<EquilibriumModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);

  useAnimationFrame((dt: number) => {
    if (!isPlaying) return;
    setModel(prev => integrate(prev, dt));
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setModel(defaultModel);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas>
        <EquilibriumRenderer model={model} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={
          <div className="space-y-2">
            <BlockMath math={String.raw`\sum \vec F = 0 \iff \text{平衡}`} />
            <BlockMath math={String.raw`\vec F_i = F_i(\cos\theta_i, \sin\theta_i)`} />
          </div>
        }
      />
    </div>
  );
}
