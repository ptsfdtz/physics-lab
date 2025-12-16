import { useCallback, useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ChartControls, ExperimentChart, ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

import { buildSpec, samplePoint } from './echart';
import type { ReferenceFrameModel } from './model';
import { defaultModel, modelConfigs } from './model';
import ReferenceFrameRenderer from './renderer';

type ChartKey = 't' | 'xA' | 'xRel' | 'vA' | 'vRel';
type ChartDataPoint = { t: number; xA: number; xRel: number; vA: number; vRel: number };

export default function ReferenceFramePage() {
  const [model, setModel] = useState<ReferenceFrameModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartXKey, setChartXKey] = useState<ChartKey>('t');
  const [chartYKey, setChartYKey] = useState<ChartKey>('xA');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useAnimationFrame((deltaTime: number) => {
    if (!isPlaying) return;
    setModel(prev => {
      const newModel = {
        ...prev,
        t: prev.t + deltaTime,
        xA: prev.xA + prev.vA * deltaTime,
        xB: prev.xB + prev.vB * deltaTime,
      };
      const p = samplePoint(newModel);
      setChartData(prevData => [...prevData, p]);
      return newModel;
    });
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        setChartData([]); // 重置图表
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
                onXChange={(v: ChartKey) => setChartXKey(v)}
                onYChange={(v: ChartKey) => setChartYKey(v)}
                xOptions={[
                  { value: 't', label: '时间 (t)' },
                  { value: 'xA', label: '地面 x_A' },
                  { value: 'xRel', label: "相对 x' (A相对B)" },
                  { value: 'vA', label: '地面速度 v_A' },
                  { value: 'vRel', label: "相对速度 v' (A相对B)" },
                ]}
                yOptions={[
                  { value: 't', label: '时间 (t)' },
                  { value: 'xA', label: '地面 x_A' },
                  { value: 'xRel', label: "相对 x' (A相对B)" },
                  { value: 'vA', label: '地面速度 v_A' },
                  { value: 'vRel', label: "相对速度 v' (A相对B)" },
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
        <ReferenceFrameRenderer model={model} onModelChange={setModel} />
      </PhysicsCanvas>

      <ParameterController
        model={model}
        onChange={setModel}
        configs={modelConfigs}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        isPlaying={isPlaying}
        formula={<BlockMath math="x'_A = x_A - x_B \\\\ v'_A = v_A - v_B" />}
      />
    </div>
  );
}
