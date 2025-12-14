import { useCallback, useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ChartControls, ExperimentChart, ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

import { buildSpec, samplePoint } from './echart';
import type { VectorDecompositionModel } from './model';
import { defaultModel, modelConfigs } from './model';
import { VectorDecompositionRenderer } from './renderer';

export default function VectorDecompositionPage() {
  const [model, setModel] = useState<VectorDecompositionModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartXKey, setChartXKey] = useState<'t' | 'x' | 'y'>('t');
  const [chartYKey, setChartYKey] = useState<'x' | 'y' | 't'>('x');
  const [chartData, setChartData] = useState<Array<{ t: number; x: number; y: number }>>([]);
  const [decomposePlaying, setDecomposePlaying] = useState(false);

  // advance time
  useAnimationFrame((deltaTime: number) => {
    if (!isPlaying) return;
    setModel(prev => ({ ...prev, t: prev.t + deltaTime }));
  }, isPlaying);

  // sampling synchronized with time update
  useAnimationFrame((deltaTime: number) => {
    if (!isPlaying) return;
    setModel(prev => {
      const nextT = prev.t + deltaTime;
      const next = { ...prev, t: nextT };
      setChartData(d => [...d, samplePoint(next)]);
      return next;
    });
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) setChartData(d => [...d, samplePoint(model)]);
      return next;
    });
  }, [model]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setModel(defaultModel);
    setChartData([]);
  }, []);

  const handleDecompose = useCallback(() => setDecomposePlaying(p => !p), []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas
        overlay={useMemo(() => {
          const data = chartData;
          const spec = buildSpec(chartXKey, chartYKey);

          return (
            <div className="h-full flex flex-col items-center">
              <ChartControls
                xKey={chartXKey}
                yKey={chartYKey}
                onXChange={v => setChartXKey(v)}
                onYChange={v => setChartYKey(v)}
                xOptions={[
                  { value: 't', label: '时间 (t)' },
                  { value: 'x', label: 'x (m)' },
                  { value: 'y', label: 'y (m)' },
                ]}
                yOptions={[
                  { value: 'x', label: 'x (m)' },
                  { value: 'y', label: 'y (m)' },
                  { value: 't', label: '时间 (t)' },
                ]}
              />

              <div className="flex-1 p-1 w-full border-t border-gray-200">
                <ExperimentChart
                  spec={spec}
                  data={data}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          );
        }, [chartData, chartXKey, chartYKey])}
      >
        <VectorDecompositionRenderer
          model={model}
          onModelChange={setModel}
          decomposePlaying={decomposePlaying}
          onDecomposeDone={() => setDecomposePlaying(false)}
        />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        onDecompose={handleDecompose}
        formula={<BlockMath math={'x = x_0 + v_x t\\ y = y_0 + v_y t - 	frac{1}{2} g t^2'} />}
      />
    </div>
  );
}
