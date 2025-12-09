import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Circle, Group, Text } from 'react-konva';
import Konva from 'konva';
import type { ProjectileModel } from './model';
import { VectorArrow } from '../../../../components/physics/VectorArrow';
// import { velocityTime } from '../../../../physics/kinematics';

interface RendererProps {
  model: ProjectileModel;
  onModelChange?: (model: ProjectileModel) => void;
}

export const ProjectileRenderer: React.FC<RendererProps> = ({ model, onModelChange }) => {
  const SCALE = 10; // 10 px = 1 m
  const TOP_PADDING = 20;
  const BOTTOM_PADDING = 60;
  const groupRef = useRef<Konva.Group | null>(null);
  const [centerX, setCenterX] = useState<number>(200);
  const [stageHeight, setStageHeight] = useState<number>(480);

  // compute kinematic positions (treat y upward positive)
  const angleRad = (model.angle * Math.PI) / 180;
  const vx = model.v * Math.cos(angleRad);
  const vy0 = model.v * Math.sin(angleRad);
  const x = model.x0 + vx * model.t;
  const y = Math.max(0, model.y0 + vy0 * model.t - 0.5 * model.g * model.t * model.t);
  const vxCurrent = vx;
  const vyCurrent = vy0 - model.g * model.t;

  const speed = Math.hypot(vxCurrent, vyCurrent);
  const velocityAngleDeg = (Math.atan2(vyCurrent, vxCurrent) * 180) / Math.PI;

  const groundY = stageHeight - BOTTOM_PADDING;
  const pixelX = centerX + x * SCALE;
  const pixelY = groundY - y * SCALE;

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const px = e.target.x();
    const py = e.target.y();
    const newX = (px - centerX) / SCALE;
    const newY = Math.max(0, (groundY - py) / SCALE);
    onModelChange({ ...model, x0: newX, y0: newY });
  };

  useEffect(() => {
    const setStage = () => {
      const stage = groupRef.current?.getStage?.();
      if (stage) {
        setCenterX(stage.width() / 2 - 100); // left-of-center start
        setStageHeight(stage.height());
      }
    };
    setStage();
    window.addEventListener('resize', setStage);
    return () => window.removeEventListener('resize', setStage);
  }, []);

  return (
    <Layer>
      <Rect x={0} y={groundY} width={2000} height={6} fill="#94a3b8" />

      <Group
        ref={groupRef}
        x={pixelX}
        y={pixelY}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({
          x: Math.min(Math.max(pos.x, 0), 2000),
          y: Math.min(Math.max(pos.y, TOP_PADDING), groundY - 10),
        })}
        onDragMove={handleDrag}
      >
        <Circle x={0} y={0} radius={8} fill="#06b6d4" shadowBlur={4} />
        <Text text={`x=${x.toFixed(1)}m`} y={-28} fontSize={12} fill="#0f172a" />
        <Text text={`y=${y.toFixed(1)}m`} y={-14} fontSize={12} fill="#0f172a" />

        {/* Orthogonal decomposition: draw vx along x-axis from origin */}
        <VectorArrow
          x={0}
          y={0}
          length={Math.abs(vxCurrent) * SCALE}
          angle={vxCurrent >= 0 ? 0 : 180}
          color="#ef4444"
          label={`vx=${vxCurrent.toFixed(1)}m/s`}
        />

        {/* vy starting at end of vx to form right triangle */}
        <VectorArrow
          x={vxCurrent * SCALE}
          y={0}
          length={Math.abs(vyCurrent) * SCALE}
          angle={vyCurrent >= 0 ? -90 : 90}
          color="#3b82f6"
          label={`vy=${vyCurrent.toFixed(1)}m/s`}
          labelOffsetY={vyCurrent >= 0 ? -20 : 8}
        />

        {/* Resultant velocity vector from origin */}
        <VectorArrow
          x={0}
          y={0}
          length={speed * SCALE}
          angle={-velocityAngleDeg}
          color="#10b981"
          label={`v=${speed.toFixed(1)}m/s`}
          labelOffsetY={-28}
        />
      </Group>
    </Layer>
  );
};

export default ProjectileRenderer;
