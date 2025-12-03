import React from 'react';
import { Arrow, Text, Group } from 'react-konva';

interface VectorArrowProps {
  x: number;
  y: number;
  length: number;
  angle?: number; // degrees
  color?: string;
  label?: string;
}

export const VectorArrow: React.FC<VectorArrowProps> = ({
  x,
  y,
  length,
  angle = 0,
  color = 'red',
  label,
}) => {
  // Don't render tiny vectors
  if (Math.abs(length) < 0.1) return null;

  return (
    <Group x={x} y={y} rotation={angle}>
      <Arrow
        points={[0, 0, length, 0]}
        pointerLength={10}
        pointerWidth={10}
        fill={color}
        stroke={color}
        strokeWidth={4}
      />
      {label && (
        <Text x={length / 2} y={-20} text={label} fontSize={14} fill={color} fontStyle="bold" />
      )}
    </Group>
  );
};
