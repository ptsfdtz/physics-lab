import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import { UniformMotionRenderer } from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { UniformMotionModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';

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
        formula={
          <span>
            <i className="font-serif">x</i> = <i className="font-serif">x</i>₀ +{' '}
            <i className="font-serif">v</i>
            <i className="font-serif">t</i>
          </span>
        }
      />
    </div>
  );
}
