import React from 'react';
import Konva from 'konva';
import { Circle, Group, Layer, Rect, Text } from 'react-konva';

import { VectorArrow } from '@/components';

import type { ReferenceFrameModel } from './model';

interface Props {
  model: ReferenceFrameModel;
  onModelChange?: (m: ReferenceFrameModel) => void;
}

export const ReferenceFrameRenderer: React.FC<Props> = ({ model, onModelChange }) => {
  const SCALE = 40; // px per meter
  const GROUND_TRACK_Y = 180;
  const MOVING_TRACK_Y = 280;
  const LEFT_PADDING = 60;

  // 相对位置和速度（物体A相对于物体B）
  const xARel = model.xA - model.xB;
  const vARel = model.vA - model.vB;

  // 拖动物体A
  const handleDragA = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const newXPx = (e.target as Konva.Group).x();
    const newXA = (newXPx - LEFT_PADDING) / SCALE;
    onModelChange({ ...model, xA: newXA });
  };

  // 拖动物体B
  const handleDragB = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const newXPx = (e.target as Konva.Group).x();
    const newXB = (newXPx - LEFT_PADDING) / SCALE;
    onModelChange({ ...model, xB: newXB });
  };

  return (
    <Layer>
      {/* Ground Track */}
      <Rect x={0} y={GROUND_TRACK_Y + 20} width={2000} height={6} fill="#cbd5e1" />
      <Text x={10} y={GROUND_TRACK_Y - 20} text="地面参考系" fontSize={12} fill="#64748b" />

      {/* Object A on ground frame */}
      <Group
        x={LEFT_PADDING + model.xA * SCALE}
        y={GROUND_TRACK_Y}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({ x: pos.x, y: GROUND_TRACK_Y })}
        onDragEnd={handleDragA}
        onMouseEnter={e => {
          if (e.target.getStage()?.container())
            e.target.getStage()!.container()!.style.cursor = 'move';
        }}
        onMouseLeave={e => {
          if (e.target.getStage()?.container())
            e.target.getStage()!.container()!.style.cursor = 'default';
        }}
      >
        <Circle x={0} y={0} radius={12} fill="#3b82f6" shadowBlur={4} />
        <Text text="A" x={-5} y={-6} fontSize={12} fill="white" fontWeight="bold" />
        <VectorArrow
          x={0}
          y={-25}
          length={model.vA * (SCALE / 2)}
          angle={0}
          color="#3b82f6"
          label={`vA=${model.vA.toFixed(1)}`}
        />
      </Group>

      {/* Moving Frame Track (Origin at B) */}
      <Rect x={0} y={MOVING_TRACK_Y + 20} width={2000} height={6} fill="#e0e7ff" />
      <Text
        x={10}
        y={MOVING_TRACK_Y - 20}
        text="动地参考系（B为原点）"
        fontSize={12}
        fill="#64748b"
      />

      {/* Object B - Frame Origin */}
      <Group
        x={LEFT_PADDING + model.xB * SCALE}
        y={MOVING_TRACK_Y}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({ x: pos.x, y: MOVING_TRACK_Y })}
        onDragEnd={handleDragB}
        onMouseEnter={e => {
          if (e.target.getStage()?.container())
            e.target.getStage()!.container()!.style.cursor = 'move';
        }}
        onMouseLeave={e => {
          if (e.target.getStage()?.container())
            e.target.getStage()!.container()!.style.cursor = 'default';
        }}
      >
        <Circle x={0} y={0} radius={12} fill="#10b981" shadowBlur={4} />
        <Text text="B" x={-5} y={-6} fontSize={12} fill="white" fontWeight="bold" />
        <VectorArrow
          x={0}
          y={-25}
          length={model.vB * (SCALE / 2)}
          angle={0}
          color="#10b981"
          label={`vB=${model.vB.toFixed(1)}`}
        />
      </Group>

      {/* Info panel */}
      <Group x={LEFT_PADDING + 10 * SCALE} y={20}>
        <Text text="地面参考系（S）" y={0} fontSize={13} fill="#3b82f6" fontWeight="bold" />
        <Text text={`  x_A = ${model.xA.toFixed(2)} m`} y={20} fontSize={12} fill="#334155" />
        <Text text={`  v_A = ${model.vA.toFixed(2)} m/s`} y={35} fontSize={12} fill="#334155" />

        <Text
          text="动地参考系（S'，B为原点）"
          y={60}
          fontSize={13}
          fill="#10b981"
          fontWeight="bold"
        />
        <Text text={`  x'_A = ${xARel.toFixed(2)} m`} y={80} fontSize={12} fill="#334155" />
        <Text text={`  v'_A = ${vARel.toFixed(2)} m/s`} y={95} fontSize={12} fill="#334155" />
        <Text text={`  v_B = ${model.vB.toFixed(2)} m/s`} y={110} fontSize={12} fill="#334155" />
      </Group>
    </Layer>
  );
};

export default ReferenceFrameRenderer;
