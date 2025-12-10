import { useState, useCallback } from 'react';
import { PhysicsCanvas } from '../../../../components/canvas/PhysicsCanvas';
import { ParameterController } from '../../../../components/control-panel/ParameterController';
import ForceAnalysisRenderer from './renderer.tsx';
import { defaultModel, modelConfigs } from './model';
import type { ForceAnalysisModel } from './model';
import { useAnimationFrame } from '../../../../hooks/useAnimationFrame';
import { BlockMath } from 'react-katex';

export default function ForceAnalysisPage() {
  const [model, setModel] = useState<ForceAnalysisModel>(defaultModel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);

  // Animation Loop: 积分计算速度和位移
  useAnimationFrame((deltaTime: number) => {
    if (!isPlaying) return;

    setModel(prev => {
      const g = 9.81;
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
        return {
          ...prev,
          v: 0,
          x: prev.x, // 位置不变
          t: prev.t + deltaTime,
        };
      }

      // 确定摩擦力方向：优先让摩擦力反向于外力方向（避免合力成为外力与摩擦力绝对值之和），
      // 当外力几乎为零时再让摩擦力反向于速度方向以阻尼运动。
      let frictionSign = 0;
      if (Math.abs(Fx) > eps) frictionSign = -Math.sign(Fx);
      else if (Math.abs(prev.v) >= eps) frictionSign = -Math.sign(prev.v);

      // 带符号摩擦力（方向与外力或速度相反）
      const frictionSigned = frictionSign * f_mag;

      // 合力：外力与摩擦力代数和（注意 frictionSigned 已含方向）
      const netFx = Fx + frictionSigned;

      // 加速度
      const ax = netFx / m;

      // 积分更新速度和位置（显式欧拉），并避免速度在零附近因数值误差而反向震荡
      let newV = prev.v + ax * deltaTime;
      // 若速度在该步发生翻转且幅值很小，则认为被摩擦或阻力钳制为静止
      if (Math.sign(prev.v) !== Math.sign(newV) && Math.abs(newV) < 1e-2) {
        newV = 0;
      }

      const newX = prev.x + newV * deltaTime;

      return {
        ...prev,
        v: newV,
        x: newX,
        t: prev.t + deltaTime,
      };
    });
  }, isPlaying);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setModel(defaultModel);
  }, []);

  const handleDecompose = useCallback(() => {
    setIsDecomposing(prev => !prev);
  }, []);

  return (
    <div className="flex h-full w-full">
      <PhysicsCanvas>
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
