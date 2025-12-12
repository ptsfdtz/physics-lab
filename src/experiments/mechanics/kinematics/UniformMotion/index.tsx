import { useCallback, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

import { defaultModel, modelConfigs } from './model';
import type { UniformMotionModel } from './model';
import { UniformMotionRenderer } from './renderer';

export default function UniformMotionPage() {
  const [model, setModel] = useState<UniformMotionModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation Loop
  useAnimationFrame((deltaTime: number) => {
    setModel(prev => ({
      ...prev,
      t: prev.t + deltaTime,
    }));
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setModel(defaultModel);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas>
        <UniformMotionRenderer model={model} onModelChange={setModel} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={<BlockMath math="x = x_0 + v t" />}
      />
    </div>
  );
}
