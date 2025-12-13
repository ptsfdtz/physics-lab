import { useCallback, useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ChartControls, ExperimentChart, ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

import { buildSpec, samplePoint } from './echart';
import type { UniformAccelerationModel } from './model';
import { defaultModel, modelConfigs } from './model';
import { UniformAccelerationRenderer } from './renderer';

export default function UniformAccelerationPage() {
  const [model, setModel] = useState<UniformAccelerationModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartXKey, setChartXKey] = useState<'t' | 'x' | 'v'>('t');
  const [chartYKey, setChartYKey] = useState<'t' | 'x' | 'v'>('x');
  const [chartData, setChartData] = useState<Array<{ t: number; x: number; v: number }>>([]);

  useAnimationFrame((deltaTime: number) => {
    setModel(prev => {
      const newT = prev.t + deltaTime;
      const newModel = { ...prev, t: newT };
      if (isPlaying) {
        const p = samplePoint(newModel);
        setChartData(prevData => [...prevData, p]);
      }
      return newModel;
    });
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        const p = samplePoint(model);
        setChartData(prevData => [...prevData, p]);
      }
      return next;
    });
  }, [model]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setModel(defaultModel);
    setChartData([]);
  }, []);

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
                  { value: 'x', label: '位移 (x)' },
                  { value: 'v', label: '速度 (v)' },
                ]}
                yOptions={[
                  { value: 'x', label: '位移 (x)' },
                  { value: 'v', label: '速度 (v)' },
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
