import React from 'react';
import { Layer, Circle, Rect, Group, Text } from 'react-konva';
import Konva from 'konva';
import type { UniformMotionModel } from './model';
import { uniformDisplacement } from '../../../../physics/kinematics';
import { VectorArrow } from '../../../../components/physics/VectorArrow';

interface RendererProps {
  model: UniformMotionModel;
  onModelChange?: (model: UniformMotionModel) => void;
}

export const UniformMotionRenderer: React.FC<RendererProps> = ({ model, onModelChange }) => {
  // Scale factor: 10 pixels = 1 meter
  const SCALE = 10;
  const TRACK_Y = 300;

  // Physics Calculation
  const currentDisplacement = uniformDisplacement(model.v, model.t);
  const currentX = (model.x0 + currentDisplacement) * SCALE;

  const handleDragMoveCar = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    // Get the new x position from the event
    const newXPixels = e.target.x();
    // Convert pixels to meters
    const newX = newXPixels / SCALE;
    // Calculate new x0: x = x0 + v*t => x0 = x - v*t
    const newX0 = newX - model.v * model.t;

    onModelChange({
      ...model,
      x0: newX0,
    });
  };

  const handleDragMoveVelocity = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    // The handle is inside the car group, so x is relative to the car
    const newLengthPixels = e.target.x();
    // Convert to velocity: length = v * SCALE => v = length / SCALE
    const newV = newLengthPixels / SCALE;

    onModelChange({
      ...model,
      v: newV,
    });
  };

  return (
    <Layer>
      {/* Track */}
      <Rect
        x={0}
        y={TRACK_Y + 20}
        width={2000} // Arbitrary long track
        height={5}
        fill="#cbd5e1"
      />

      {/* Car/Object Group */}
      <Group
        x={currentX}
        y={TRACK_Y}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({
          x: pos.x,
          y: TRACK_Y, // Lock Y axis
        })}
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
        {/* The Body */}
        <Rect
          x={-25}
          y={-20}
          width={50}
          height={40}
          fill="#3b82f6"
          cornerRadius={5}
          shadowBlur={5}
        />
        {/* Wheels */}
        <Circle x={-15} y={20} radius={8} fill="#1e293b" />
        <Circle x={15} y={20} radius={8} fill="#1e293b" />

        {/* Info Label */}
        <Text
          x={-20}
          y={-40}
          text={`x=${(model.x0 + currentDisplacement).toFixed(1)}m`}
          fill="#334155"
          fontSize={12}
        />

        {/* Velocity Vector */}
        <VectorArrow
          x={0}
          y={0}
          length={model.v * SCALE}
          color="#ef4444" // Red
          label={`v=${model.v.toFixed(1)}m/s`}
        />

        {/* Velocity Control Handle */}
        {onModelChange && (
          <Circle
            x={model.v * SCALE}
            y={0}
            radius={6}
            fill="#ef4444"
            stroke="white"
            strokeWidth={2}
            draggable
            dragBoundFunc={pos => ({
              x: pos.x,
              y: TRACK_Y, // Lock Y axis (absolute position)
            })}
            onDragMove={handleDragMoveVelocity}
            onMouseEnter={e => {
              e.cancelBubble = true; // Prevent parent group hover
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'ew-resize';
            }}
            onMouseLeave={e => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'default';
            }}
          />
        )}
      </Group>

      {/* Start Line Marker */}
      <Group x={model.x0 * SCALE} y={TRACK_Y + 20}>
        <Rect width={2} height={10} fill="#94a3b8" />
        <Text text="起点" y={15} fontSize={10} fill="#94a3b8" />
      </Group>
    </Layer>
  );
};
