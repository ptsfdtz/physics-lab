import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import ProjectileRenderer from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { ProjectileModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';
import { BlockMath } from 'react-katex';

export default function ProjectilePage() {
  const [model, setModel] = useState<ProjectileModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);

  useAnimationFrame((deltaTime: number) => {
    setModel(prev => ({ ...prev, t: prev.t + deltaTime }));
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
        <ProjectileRenderer model={model} onModelChange={setModel} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={
          <BlockMath math="\begin{cases}x = x_0 + v\cos\theta\,t\\y = y_0 + v\sin\theta\,t - \tfrac{1}{2}gt^2\end{cases}" />
        }
      />
    </div>
  );
}
