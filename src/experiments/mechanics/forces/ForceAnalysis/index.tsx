import { useCallback, useState } from 'react';
import { BlockMath } from 'react-katex';

import { ChartControls, ExperimentChart, ParameterController, PhysicsCanvas } from '@/components';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { G } from '@/physics/constants';

import { buildSpec, samplePoint } from './echart';
import type { ForceAnalysisModel } from './model';
import { defaultModel, modelConfigs } from './model';
import ForceAnalysisRenderer from './renderer';

export default function ForceAnalysisPage() {
  const [model, setModel] = useState<ForceAnalysisModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [chartXKey, setChartXKey] = useState<'t' | 'x' | 'v' | 'Fx' | 'f' | 'netFx'>('t');
  const [chartYKey, setChartYKey] = useState<'t' | 'x' | 'v' | 'Fx' | 'f' | 'netFx'>('v');
  const [chartData, setChartData] = useState<
    Array<{
      t: number;
      x: number;
      v: number;
      Fx: number;
      f: number;
      fSigned?: number;
      netFx: number;
    }>
  >([]);

  // Animation Loop: 积分计算速度和位移，并在同一次回调中采样图表点
  useAnimationFrame((deltaTime: number) => {
    if (!isPlaying) return;

    setModel(prev => {
      const g = G;
      const m = prev.m;
      const thetaRad = (prev.theta * Math.PI) / 180;
      const Fx = prev.F * Math.cos(thetaRad);
      const Fy = prev.F * Math.sin(thetaRad);

      // 法向力（假设水平面，y向上为正）
      const N = m * g - Fy;
      const f_mag = Math.max(0, prev.mu * N); // 摩擦大小（非负）

      const eps = 1e-3; // 用于判断近似静止

      // 静摩擦平衡判断：当速度几乎为 0 且外力不足以克服静摩擦时，物体保持静止
      if (Math.abs(prev.v) < eps && Math.abs(Fx) <= f_mag) {
        const stoppedModel = {
          ...prev,
          v: 0,
          x: prev.x, // 位置不变
          t: prev.t + deltaTime,
        };
        const sample = samplePoint(stoppedModel);
        setChartData(prevData => {
          const last = prevData[prevData.length - 1];
          // 指数平滑（根据帧时间），让摩擦曲线平滑上升/下降
          const alpha = Math.min(1, deltaTime * 8);
          const smoothedF = last ? last.f + alpha * (sample.f - last.f) : sample.f;
          const sign = Math.sign(sample.fSigned ?? (sample.Fx >= 0 ? 1 : -1));
          const sampleAdjusted = { ...sample, f: smoothedF, netFx: sample.Fx + sign * smoothedF };
          if (!last || last.t !== sample.t) return [...prevData, sampleAdjusted];
          return prevData;
        });
        return stoppedModel;
      }
      let frictionSign = 0;
      if (Math.abs(Fx) > eps) frictionSign = -Math.sign(Fx);
      else if (Math.abs(prev.v) >= eps) frictionSign = -Math.sign(prev.v);

      const frictionSigned = frictionSign * f_mag;

      const netFx = Fx + frictionSigned;

      const ax = netFx / m;
      let newV = prev.v + ax * deltaTime;
      if (Math.sign(prev.v) !== Math.sign(newV) && Math.abs(newV) < 1e-2) {
        newV = 0;
      }

      const newX = prev.x + newV * deltaTime;
      const newModel = {
        ...prev,
        v: newV,
        x: newX,
        t: prev.t + deltaTime,
      };

      const sample = samplePoint(newModel);
      setChartData(prevData => {
        const last = prevData[prevData.length - 1];
        const alpha = Math.min(1, deltaTime * 8);
        const smoothedF = last ? last.f + alpha * (sample.f - last.f) : sample.f;
        const sign = Math.sign(sample.fSigned ?? (sample.Fx >= 0 ? 1 : -1));
        const sampleAdjusted = { ...sample, f: smoothedF, netFx: sample.Fx + sign * smoothedF };
        if (!last || last.t !== sample.t) return [...prevData, sampleAdjusted];
        return prevData;
      });

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

  const handleDecompose = useCallback(() => {
    setIsDecomposing(prev => !prev);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas
        overlay={(() => {
          const spec = buildSpec(chartXKey, chartYKey);
          const data = chartData;
          return (
            <div className="h-full flex flex-col items-center">
              <ChartControls
                xKey={chartXKey}
                yKey={chartYKey}
                onXChange={v => setChartXKey(v)}
                onYChange={v => setChartYKey(v)}
                xOptions={[
                  { value: 't', label: '时间 (t)' },
                  { value: 'x', label: '位置 (x)' },
                  { value: 'v', label: '速度 (v)' },
                  { value: 'Fx', label: '外力 (Fx)' },
                  { value: 'f', label: '摩擦 (f)' },
                  { value: 'netFx', label: '合力 (ΣF)' },
                ]}
                yOptions={[
                  { value: 't', label: '时间 (t)' },
                  { value: 'x', label: '位置 (x)' },
                  { value: 'v', label: '速度 (v)' },
                  { value: 'Fx', label: '外力 (Fx)' },
                  { value: 'f', label: '摩擦 (f)' },
                  { value: 'netFx', label: '合力 (ΣF)' },
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
        })()}
      >
        <ForceAnalysisRenderer
          model={model}
          onModelChange={setModel}
          decomposePlaying={isDecomposing}
          onDecomposeDone={() => setIsDecomposing(false)}
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
        formula={
          <BlockMath math={String.raw`F\cos\theta - f = ma\\ f = \mu N\\ N = mg - F\sin\theta`} />
        }
      />
    </div>
  );
}
