import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import FreeFallRenderer from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { FreeFallModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';
import { BlockMath } from 'react-katex';

export default function FreeFallPage() {
  const [model, setModel] = useState<FreeFallModel>(defaultModel);
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
        <FreeFallRenderer model={model} onModelChange={setModel} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={<BlockMath math="y = y_0 + v_0 t + \tfrac{1}{2} g t^2" />}
      />
    </div>
  );
}
