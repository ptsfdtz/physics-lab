import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Group, Layer, Line, Rect, Text } from 'react-konva';

import { VectorArrow } from '@/components';

import type { VectorDecompositionModel } from './model';

interface RendererProps {
  model: VectorDecompositionModel;
  onModelChange?: (m: VectorDecompositionModel) => void;
  decomposePlaying?: boolean;
  onDecomposeDone?: () => void;
}

export const VectorDecompositionRenderer: React.FC<RendererProps> = ({
  model,
  onModelChange,
  decomposePlaying,
  onDecomposeDone,
}) => {
  const SCALE = 12; // px per meter
  const TOP_PADDING = 20;
  const BOTTOM_PADDING = 60;
  const [centerX, setCenterX] = useState<number>(220);
  const [stageHeight, setStageHeight] = useState<number>(480);
  const groupRef = useRef<Konva.Group | null>(null);

  useEffect(() => {
    const setStage = () => {
      const stage = groupRef.current?.getStage?.();
      if (stage) {
        setCenterX(Math.max(160, stage.width() / 3));
        setStageHeight(stage.height());
      }
    };
    setStage();
    window.addEventListener('resize', setStage);
    return () => window.removeEventListener('resize', setStage);
  }, []);

  const angleRad = (model.angle * Math.PI) / 180;
  const vx = model.v * Math.cos(angleRad);
  const vy0 = model.v * Math.sin(angleRad);
  const vyCurrent = vy0 - model.g * model.t;

  const speed = Math.hypot(vx, vyCurrent);
  const velocityAngleDeg = (Math.atan2(vyCurrent, vx) * 180) / Math.PI;

  // decomposition animation state
  const [decompPhase, setDecompPhase] = useState(0); // 0 none, 1 horiz, 2 vert, 3 result
  const [decompProgress, setDecompProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const phaseDur = 800; // ms per phase
    let currentPhase = 0;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(1, elapsed / phaseDur);
      setDecompProgress(p);
      if (elapsed >= phaseDur) {
        currentPhase++;
        if (currentPhase >= 3) {
          setDecompPhase(0);
          setDecompProgress(0);
          if (onDecomposeDone) onDecomposeDone();
          return;
        }
        start = 0;
        setDecompPhase(currentPhase + 1);
      }
      raf = requestAnimationFrame(step);
    };

    if (decomposePlaying) {
      currentPhase = 0;
      setDecompPhase(1);
      setDecompProgress(0);
      raf = requestAnimationFrame(step);
    } else {
      setDecompPhase(0);
      setDecompProgress(0);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [decomposePlaying, onDecomposeDone]);

  // current combined position
  const x = model.x0 + vx * model.t;
  const y = Math.max(0, model.y0 + vy0 * model.t - 0.5 * model.g * model.t * model.t);

  const groundY = stageHeight - BOTTOM_PADDING;
  const pixelX = centerX + x * SCALE;
  const pixelY = groundY - y * SCALE;

  // sampling
  const samples = Math.max(2, Math.min(240, Math.ceil(model.t / 0.02 + 1)));
  const combinedPoints: number[] = [];
  const horizPoints: number[] = [];
  const vertPoints: number[] = [];

  for (let i = 0; i <= samples; i++) {
    const ts = (i / samples) * model.t;
    const xs = model.x0 + vx * ts;
    const ys = Math.max(0, model.y0 + vy0 * ts - 0.5 * model.g * ts * ts);
    const hx = centerX + (model.x0 + vx * ts) * SCALE;
    const hy = groundY - model.y0 * SCALE; // horizontal stays at initial height
    const vxPx = centerX + model.x0 * SCALE; // vertical x fixed
    const vy = Math.max(0, model.y0 + vy0 * ts - 0.5 * model.g * ts * ts);

    combinedPoints.push(centerX + xs * SCALE, groundY - ys * SCALE);
    horizPoints.push(hx, hy);
    vertPoints.push(vxPx, groundY - vy * SCALE);
  }

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!onModelChange) return;
    const px = e.target.x();
    const py = e.target.y();
    const newX = (px - centerX) / SCALE;
    const newY = Math.max(0, (groundY - py) / SCALE);
    onModelChange({ ...model, x0: newX, y0: newY });
  };

  return (
    <Layer>
      <Rect x={0} y={groundY} width={4000} height={6} fill="#94a3b8" />

      {/* horizontal component trajectory (dashed) */}
      {horizPoints.length >= 4 && (
        <Line points={horizPoints} stroke="#0ea5e9" strokeWidth={2} dash={[8, 6]} tension={0.2} />
      )}

      {/* vertical component trajectory (dashed) */}
      {vertPoints.length >= 4 && (
        <Line points={vertPoints} stroke="#f97316" strokeWidth={2} dash={[8, 6]} tension={0.2} />
      )}

      {/* combined projectile (solid) */}
      {combinedPoints.length >= 4 && (
        <Line points={combinedPoints} stroke="#10b981" strokeWidth={3} tension={0.25} />
      )}
      {/* markers for current positions */}
      {/* horizontal marker */}
      <Circle
        x={centerX + (model.x0 + vx * model.t) * SCALE}
        y={groundY - model.y0 * SCALE}
        radius={6}
        fill="#0ea5e9"
      />
      <VectorArrow
        x={centerX + (model.x0 + vx * model.t) * SCALE}
        y={groundY - model.y0 * SCALE}
        length={Math.abs(vx) * SCALE}
        angle={vx >= 0 ? 0 : 180}
        color="#0ea5e9"
        label={`vx=${vx.toFixed(1)} m/s`}
        labelOffsetY={-14}
      />

      {/* vertical marker */}
      <Circle
        x={centerX + model.x0 * SCALE}
        y={
          groundY -
          Math.max(0, model.y0 + vy0 * model.t - 0.5 * model.g * model.t * model.t) * SCALE
        }
        radius={6}
        fill="#f97316"
      />
      <VectorArrow
        x={centerX + model.x0 * SCALE}
        y={
          groundY -
          Math.max(0, model.y0 + vy0 * model.t - 0.5 * model.g * model.t * model.t) * SCALE
        }
        length={Math.abs(vyCurrent) * SCALE}
        angle={vyCurrent >= 0 ? -90 : 90}
        color="#f97316"
        label={`vy=${vyCurrent.toFixed(1)} m/s`}
        labelOffsetY={vyCurrent >= 0 ? -18 : 8}
      />

      {/* combined marker (actual projectile) */}
      <Group
        ref={groupRef}
        x={pixelX}
        y={pixelY}
        draggable={!!onModelChange}
        dragBoundFunc={pos => ({
          x: Math.min(Math.max(pos.x, 0), 4000),
          y: Math.min(Math.max(pos.y, TOP_PADDING), groundY - 8),
        })}
        onDragMove={handleDrag}
      >
        <Circle x={0} y={0} radius={8} fill="#10b981" shadowBlur={6} />
        <Text text={`x=${x.toFixed(1)}m`} y={-28} fontSize={12} fill="#0f172a" />
        <Text text={`y=${y.toFixed(1)}m`} y={-14} fontSize={12} fill="#0f172a" />
        {decompPhase === 0 ? (
          <VectorArrow
            x={0}
            y={0}
            length={speed * SCALE}
            angle={-velocityAngleDeg}
            color="#065f46"
            label={`v=${speed.toFixed(1)} m/s`}
            labelOffsetY={-18}
          />
        ) : (
          <>
            {decompPhase >= 1 && (
              <VectorArrow
                x={0}
                y={0}
                length={Math.abs(vx) * SCALE * (decompPhase === 1 ? decompProgress : 1)}
                angle={vx >= 0 ? 0 : 180}
                color="#60a5fa"
                label={decompPhase === 1 ? undefined : `vx=${vx.toFixed(1)} m/s`}
                labelOffsetY={-8}
              />
            )}
            {decompPhase >= 2 && (
              <VectorArrow
                x={0}
                y={0}
                length={Math.abs(vyCurrent) * SCALE * (decompPhase === 2 ? decompProgress : 1)}
                angle={vyCurrent >= 0 ? -90 : 90}
                color="#fb923c"
                label={decompPhase === 2 ? undefined : `vy=${vyCurrent.toFixed(1)} m/s`}
                labelOffsetY={-8}
              />
            )}
            {decompPhase >= 3 && (
              <VectorArrow
                x={0}
                y={0}
                length={speed * SCALE * (decompPhase === 3 ? decompProgress : 1)}
                angle={-velocityAngleDeg}
                color="#34d399"
                label={decompPhase === 3 ? undefined : `v=${speed.toFixed(1)} m/s`}
                labelOffsetY={-28}
              />
            )}
          </>
        )}
      </Group>
    </Layer>
  );
};

export default VectorDecompositionRenderer;
