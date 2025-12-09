import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import FreeFallRenderer from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { FreeFallModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';

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
        formula={
          <span>
            <i className="font-serif">y</i> = <i className="font-serif">y</i>₀ +{' '}
            <i className="font-serif">v</i>₀<i className="font-serif">t</i> + 1/2{' '}
            <i className="font-serif">g</i> <i className="font-serif">t</i>²
          </span>
        }
      />
    </div>
  );
}
