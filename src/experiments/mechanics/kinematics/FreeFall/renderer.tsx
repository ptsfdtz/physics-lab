import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Circle, Group, Text } from 'react-konva';
import Konva from 'konva';
import type { FreeFallModel } from './model';
import { displacementTime, velocityTime } from '../../../../physics/kinematics';
import { VectorArrow } from '../../../../components/physics/VectorArrow';

interface RendererProps {
  model: FreeFallModel;
  onModelChange?: (model: FreeFallModel) => void;
}

export const FreeFallRenderer: React.FC<RendererProps> = ({ model, onModelChange }) => {
  const SCALE = 10; // 10 pixels = 1 m
  const TOP_PADDING = 30; // avoid top edge
  const BOTTOM_PADDING = 20; // distance from bottom edge to ground line
  const groupRef = useRef<Konva.Group | null>(null);
  const [centerX, setCenterX] = useState<number>(100);
  const [stageHeight, setStageHeight] = useState<number>(480);

  const currentDisplacement = displacementTime(model.v0, model.g, model.t);
  // physical height above ground (m) - now height decreases when falling
  // displacementTime returns downward displacement (positive when moving down)
  const currentHeight = Math.max(0, model.y0 - currentDisplacement);
  const groundY = stageHeight - BOTTOM_PADDING;
  const currentY = groundY - currentHeight * SCALE;
  const currentV = velocityTime(model.v0, model.g, model.t);

  const handleDragMoveBall = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const newYPixels = e.target.y();
    // compute new height above ground from groundY
    const newHeight = Math.max(0, (groundY - newYPixels) / SCALE);
    // y0 = currentHeight + displacement (since currentHeight = y0 - displacement)
    const newY0 = Math.max(0, newHeight + currentDisplacement);
    onModelChange({ ...model, y0: newY0 });
  };

  useEffect(() => {
    const setStageCenter = () => {
      const stage = groupRef.current?.getStage?.();
      if (stage) {
        setCenterX(stage.width() / 2);
        setStageHeight(stage.height());
      }
    };

    setStageCenter();
    window.addEventListener('resize', setStageCenter);
    return () => window.removeEventListener('resize', setStageCenter);
  }, []);

  return (
    <Layer>
      {/* ground */}
      <Rect x={0} y={groundY} width={2000} height={6} fill="#94a3b8" />

      <Group
        ref={groupRef}
        x={centerX}
        y={currentY}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({
          x: centerX,
          y: Math.min(Math.max(pos.y, TOP_PADDING), groundY - 10),
        })}
        onDragMove={handleDragMoveBall}
      >
        <Circle x={0} y={0} radius={15} fill="#f97316" shadowBlur={6} />
        <Text text={`y=${currentHeight.toFixed(1)} m`} y={-30} fontSize={12} fill="#1f2937" />

        {/* Velocity vector - down positive */}
        <VectorArrow
          x={0}
          y={20}
          length={Math.abs(currentV) * SCALE}
          angle={90}
          color="#ef4444"
          label={`v=${currentV.toFixed(1)}m/s`}
        />
      </Group>

      {/* height scale (left axis) */}
      <Group x={10} y={TOP_PADDING}>
        <Text text="高度 (m)" y={-20} fontSize={12} fill="#4b5563" />
      </Group>
    </Layer>
  );
};

export default FreeFallRenderer;
