import React from 'react';
import { Layer, Rect, Circle, Group, Text } from 'react-konva';
import type { ForceAnalysisModel } from './model';
import { VectorArrow } from '../../../../components/physics/VectorArrow';
import Konva from 'konva';

interface Props {
  model: ForceAnalysisModel;
  onModelChange?: (m: ForceAnalysisModel) => void;
}

const ForceAnalysisRenderer: React.FC<Props> = ({ model, onModelChange }) => {
  const SCALE_POS = 40; // pixels per meter for position
  const FORCE_SCALE = 6; // pixels per N for force visualization
  const G = 9.81;

  const TRACK_Y = 700;
  const LEFT_PADDING = 60;

  // 计算力的分量
  const thetaRad = (model.theta * Math.PI) / 180;
  const Fx = model.F * Math.cos(thetaRad);
  const Fy = model.F * Math.sin(thetaRad);

  // 法向力（假设垂直向上为正）
  const N = model.m * G - Fy;
  const maxFriction = Math.max(0, model.mu * N);

  // 近似静/动摩擦
  const eps = 1e-3;
  let friction = 0;
  if (Math.abs(model.v) < eps) {
    if (Math.abs(Fx) <= maxFriction) {
      friction = Fx; // 抵消外力
    } else {
      friction = maxFriction * Math.sign(Fx);
    }
  } else {
    friction = maxFriction * -Math.sign(model.v);
  }

  const netFx = Fx - friction;
  // 显示用的合力：按照要求显示为 Fx 减去摩擦力的绝对值
  const displayNetFx = Fx - Math.abs(friction);
  const ax = netFx / model.m;

  // 摩擦方向用于可视化：如果在运动中，摩擦方向必定与速度相反；若接近静止，用外力决定摩擦方向（抵消外力）
  const frictionDirection =
    Math.abs(model.v) > eps ? -Math.sign(model.v) : Math.abs(Fx) > 1e-6 ? -Math.sign(Fx) : 0;
  const frictionAngle = frictionDirection < 0 ? 180 : 0;

  const bodyX = LEFT_PADDING + model.x * SCALE_POS;
  const bodyY = TRACK_Y;

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const newXPixels = e.target.x();
    const newX = (newXPixels - LEFT_PADDING) / SCALE_POS;
    onModelChange({ ...model, x: newX, v: model.v });
  };

  return (
    <Layer>
      {/* Track */}
      <Rect x={0} y={TRACK_Y + 24} width={2000} height={6} fill="#cbd5e1" />

      {/* Block */}
      <Group
        x={bodyX}
        y={bodyY}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({ x: Math.max(pos.x, LEFT_PADDING), y: bodyY })}
        onDragMove={handleDragMove}
      >
        <Rect
          x={-30}
          y={-30}
          width={60}
          height={40}
          fill="#10b981"
          cornerRadius={6}
          shadowBlur={6}
        />
        <Circle x={-18} y={12} radius={8} fill="#0f172a" />
        <Circle x={18} y={12} radius={8} fill="#0f172a" />

        {/* Applied Force */}
        <VectorArrow
          x={0}
          y={-10}
          length={model.F * FORCE_SCALE}
          angle={model.theta}
          color="#ef4444"
          label={`F=${model.F.toFixed(1)}N`}
        />

        {/* Gravity */}
        <VectorArrow
          x={20}
          y={0}
          length={model.m * G * FORCE_SCALE}
          angle={90}
          color="#0ea5e9"
          label={`mg=${(model.m * G).toFixed(1)}N`}
        />

        {/* Normal (upwards) */}
        <VectorArrow
          x={-20}
          y={0}
          length={N * FORCE_SCALE}
          angle={270}
          color="#6366f1"
          label={`N=${N.toFixed(2)}N`}
        />

        {/* Friction (horizontal) */}
        {Math.abs(friction) > 0.01 && (
          <VectorArrow
            x={0}
            y={20}
            length={Math.abs(friction) * FORCE_SCALE}
            angle={frictionAngle}
            color="#f59e0b"
            label={`f=${friction.toFixed(2)}N`}
            labelOffsetY={10}
          />
        )}

        {/* Net force horizontal (for visualization) */}
        <VectorArrow
          x={0}
          y={-40}
          length={Math.abs(displayNetFx) * FORCE_SCALE}
          angle={displayNetFx >= 0 ? 0 : 180}
          color="#111827"
          label={`ΣF=${displayNetFx.toFixed(2)}N`}
        />
      </Group>

      {/* Readouts on the right */}
      <Group x={LEFT_PADDING + 10 + 8 * SCALE_POS} y={40}>
        {/* 标题 */}
        <Text text="实时计算" fontSize={20} fontStyle="bold" fill="#0f172a" />

        {/* 两列布局：每列 6 个条目 */}
        {/* 列参数 */}
        {/* 每行高度与原来一致 */}
        <Group x={0} y={30}>
          <Text text={`质量 m = ${model.m.toFixed(2)} kg`} y={0} fontSize={16} fill="#334155" />
          <Text text={`外力 F = ${model.F.toFixed(2)} N`} y={24} fontSize={16} fill="#334155" />
          <Text text={`角度 θ = ${model.theta.toFixed(1)}°`} y={48} fontSize={16} fill="#334155" />
          <Text text={`Fx = ${Fx.toFixed(2)} N`} y={72} fontSize={16} fill="#ef4444" />
          <Text text={`Fy = ${Fy.toFixed(2)} N`} y={96} fontSize={16} fill="#0ea5e9" />
          <Text text={`法向力 N = ${N.toFixed(2)} N`} y={120} fontSize={16} fill="#6366f1" />
        </Group>

        <Group x={220} y={30}>
          <Text
            text={`摩擦上限 μN = ${maxFriction.toFixed(2)} N`}
            y={0}
            fontSize={16}
            fill="#f59e0b"
          />
          <Text text={`摩擦 f = ${friction.toFixed(2)} N`} y={24} fontSize={16} fill="#f59e0b" />
          <Text
            text={`合力 ΣFx = ${displayNetFx.toFixed(2)} N`}
            y={48}
            fontSize={16}
            fill="#111827"
          />
          <Text text={`加速度 a = ${ax.toFixed(3)} m/s²`} y={72} fontSize={16} fill="#111827" />
          <Text text={`速度 v = ${model.v.toFixed(3)} m/s`} y={96} fontSize={16} fill="#065f46" />
          <Text text={`位置 x = ${model.x.toFixed(3)} m`} y={120} fontSize={16} fill="#065f46" />
        </Group>
      </Group>
    </Layer>
  );
};

export default ForceAnalysisRenderer;
