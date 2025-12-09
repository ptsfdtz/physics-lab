import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import { UniformAccelerationRenderer } from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { UniformAccelerationModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';
import { BlockMath } from 'react-katex';

export default function UniformAccelerationPage() {
  const [model, setModel] = useState<UniformAccelerationModel>(defaultModel);
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
        <UniformAccelerationRenderer model={model} onModelChange={setModel} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={<BlockMath math="x = x_0 + v_0 t + \tfrac{1}{2} a t^2" />}
      />
    </div>
  );
}
