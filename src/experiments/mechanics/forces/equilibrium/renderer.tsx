import React from 'react';
import { Group, Layer, Rect } from 'react-konva';

import { VectorArrow } from '@/components/physics/VectorArrow';

import type { EquilibriumModel } from './model';
import { computeVectors } from './model';

interface Props {
  model: EquilibriumModel;
}

const EquilibriumRenderer: React.FC<Props> = ({ model }) => {
  const WIDTH = 900;
  const HEIGHT = 560;
  const ORIGIN_X = WIDTH / 2;
  const ORIGIN_Y = HEIGHT / 2 + 60;
  const FORCE_SCALE = 6;
  const POS_SCALE = 40; // m -> px

  const { v1, v2, v3, w, sum, mag } = computeVectors(model);

  const bodyX = ORIGIN_X + model.x * POS_SCALE;
  const bodyY = ORIGIN_Y + model.y * POS_SCALE;

  return (
    <Layer>
      {/* ground grid baseline */}
      <Rect x={0} y={ORIGIN_Y + 24} width={2000} height={4} fill="#e5e7eb" />

      {/* body */}
      <Group x={bodyX} y={bodyY}>
        <Rect
          x={-20}
          y={-14}
          width={40}
          height={28}
          fill="#0ea5e9"
          cornerRadius={6}
          shadowBlur={6}
        />
      </Group>

      {/* forces from body center */}
      <VectorArrow
        x={bodyX}
        y={bodyY}
        length={Math.hypot(v1.x, v1.y) * FORCE_SCALE}
        angle={(Math.atan2(v1.y, v1.x) * 180) / Math.PI}
        color="#ef4444"
        label={`F1=${Math.hypot(v1.x, v1.y).toFixed(1)}N`}
      />
      <VectorArrow
        x={bodyX}
        y={bodyY}
        length={Math.hypot(v2.x, v2.y) * FORCE_SCALE}
        angle={(Math.atan2(v2.y, v2.x) * 180) / Math.PI}
        color="#22c55e"
        label={`F2=${Math.hypot(v2.x, v2.y).toFixed(1)}N`}
      />
      <VectorArrow
        x={bodyX}
        y={bodyY}
        length={Math.hypot(v3.x, v3.y) * FORCE_SCALE}
        angle={(Math.atan2(v3.y, v3.x) * 180) / Math.PI}
        color="#a78bfa"
        label={`F3=${Math.hypot(v3.x, v3.y).toFixed(1)}N`}
      />
      {model.includeWeight ? (
        <VectorArrow
          x={bodyX}
          y={bodyY}
          length={Math.hypot(w.x, w.y) * FORCE_SCALE}
          angle={90}
          color="#0ea5e9"
          label={`mg=${Math.hypot(w.x, w.y).toFixed(1)}N`}
        />
      ) : null}

      {/* net force */}
      <VectorArrow
        x={bodyX}
        y={bodyY}
        length={mag * FORCE_SCALE}
        angle={(Math.atan2(sum.y, sum.x) * 180) / Math.PI}
        color="#f97316"
        label={`ΣF=${mag.toFixed(1)}N`}
        labelOffsetY={-28}
      />
    </Layer>
  );
};

export default EquilibriumRenderer;
