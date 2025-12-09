import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import ProjectileRenderer from './renderer';
import { defaultModel, modelConfigs } from './model';
import type { ProjectileModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';

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
          <span>
            <i className="font-serif">x</i> = <i className="font-serif">x</i>₀ +{' '}
            <i className="font-serif">v</i>cosθ·t, <i className="font-serif">y</i> ={' '}
            <i className="font-serif">y</i>₀ + <i className="font-serif">v</i>sinθ·t - 1/2gt²
          </span>
        }
      />
    </div>
  );
}
