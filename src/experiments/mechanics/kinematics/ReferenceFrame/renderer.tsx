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
  const TRACK_Y = 220;
  const LEFT_PADDING = 60;

  const xRel = model.x - model.frameX;

  // drag to move particle (global position)
  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const target = e.target as Konva.Node & { x: () => number };
    const newXPx = target.x();
    const newGlobalX = (newXPx - LEFT_PADDING) / SCALE + model.frameX;
    onModelChange({ ...model, x: newGlobalX });
  };

  return (
    <Layer>
      {/* Track */}
      <Rect x={0} y={TRACK_Y + 20} width={2000} height={6} fill="#cbd5e1" />

      {/* Particle group positioned by global->relative conversion */}
      <Group
        x={LEFT_PADDING + xRel * SCALE}
        y={TRACK_Y}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({ x: Math.max(pos.x, LEFT_PADDING), y: TRACK_Y })}
        onDragEnd={handleDrag}
        onMouseEnter={e => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'move';
        }}
        onMouseLeave={e => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'default';
        }}
      >
        <Circle x={0} y={0} radius={12} fill="#3b82f6" shadowBlur={4} />
        <VectorArrow
          x={0}
          y={0}
          length={Math.abs(model.v) * (SCALE / 2)}
          color="#ef4444"
          label={`v=${model.v.toFixed(2)}m/s`}
        />
      </Group>

      {/* Reference origin marker (visual) */}
      <Group x={LEFT_PADDING} y={TRACK_Y + 20}>
        <Rect width={2} height={10} fill="#94a3b8" />
        <Text text="参考系原点" y={12} fontSize={10} fill="#94a3b8" />
      </Group>

      {/* Info panel */}
      <Group x={LEFT_PADDING + 8 * SCALE} y={20}>
        <Text text={`全局 x = ${model.x.toFixed(2)} m`} y={0} fontSize={14} fill="#334155" />
        <Text
          text={`参考系原点 x0 = ${model.frameX.toFixed(2)} m`}
          y={20}
          fontSize={14}
          fill="#334155"
        />
        <Text text={`相对位置 x' = ${xRel.toFixed(2)} m`} y={40} fontSize={14} fill="#334155" />
        <Text text={`速度 v = ${model.v.toFixed(2)} m/s`} y={60} fontSize={14} fill="#334155" />
      </Group>
    </Layer>
  );
};

export default ReferenceFrameRenderer;
