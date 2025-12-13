import React from 'react';
import Konva from 'konva';
import { Circle, Group, Layer, Rect, Text } from 'react-konva';

import { VectorArrow } from '@/components';
import { displacementTime, velocityTime } from '@/physics/kinematics';

import type { UniformAccelerationModel } from './model';

interface RendererProps {
  model: UniformAccelerationModel;
  onModelChange?: (model: UniformAccelerationModel) => void;
}

export const UniformAccelerationRenderer: React.FC<RendererProps> = ({ model, onModelChange }) => {
  const SCALE = 10; // 10 pixels = 1 meter
  const TRACK_Y = 300;
  const LEFT_PADDING = 40; // pixels to add a margin from left

  // kinematic calculations
  const currentDisplacement = displacementTime(model.v0, model.a, model.t);
  const currentX = LEFT_PADDING + (model.x0 + currentDisplacement) * SCALE;
  const currentVelocity = velocityTime(model.v0, model.a, model.t);

  const handleDragMoveCar = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const newXPixels = e.target.x();
    const newX = (newXPixels - LEFT_PADDING) / SCALE;
    const newX0 = newX - currentDisplacement; // x = x0 + displacement
    onModelChange({ ...model, x0: newX0 });
  };

  return (
    <Layer>
      <Rect x={0} y={TRACK_Y + 20} width={2000} height={5} fill="#cbd5e1" />

      <Group
        x={currentX}
        y={TRACK_Y}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({ x: Math.max(pos.x, LEFT_PADDING), y: TRACK_Y })}
        onDragMove={handleDragMoveCar}
        onMouseEnter={e => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'move';
        }}
        onMouseLeave={e => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = 'default';
        }}
      >
        <Rect
          x={-25}
          y={-20}
          width={50}
          height={40}
          fill="#10b981"
          cornerRadius={5}
          shadowBlur={5}
        />
        <Circle x={-15} y={20} radius={8} fill="#0f172a" />
        <Circle x={15} y={20} radius={8} fill="#0f172a" />

        <Text
          x={-20}
          y={-40}
          text={`x=${(model.x0 + currentDisplacement).toFixed(1)}m`}
          fill="#0f172a"
          fontSize={12}
        />

        <VectorArrow
          x={0}
          y={0}
          length={currentVelocity * SCALE}
          color="#ef4444"
          label={`v=${currentVelocity.toFixed(1)}m/s`}
        />
        <VectorArrow
          x={0}
          y={18}
          length={model.a * SCALE * 0.5}
          color="#3b82f6"
          label={`a=${model.a.toFixed(1)}m/s²`}
          labelOffsetY={12}
        />
      </Group>

      <Group x={LEFT_PADDING + model.x0 * SCALE} y={TRACK_Y + 20}>
        <Rect width={2} height={10} fill="#94a3b8" />
        <Text text="起点" y={15} fontSize={10} fill="#94a3b8" />
      </Group>
    </Layer>
  );
};

export default UniformAccelerationRenderer;
