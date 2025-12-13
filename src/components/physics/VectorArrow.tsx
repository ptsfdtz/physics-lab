import React from 'react';
import { Arrow, Group, Text } from 'react-konva';

interface VectorArrowProps {
  x: number;
  y: number;
  length: number;
  angle?: number; // degrees
  color?: string;
  label?: string;
  labelOffsetY?: number; // vertical offset for the label (defaults to -20)
}

export const VectorArrow: React.FC<VectorArrowProps> = ({
  x,
  y,
  length,
  angle = 0,
  color = 'red',
  label,
  labelOffsetY = -20,
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
        <Text
          x={length + (length >= 0 ? 10 : -10)}
          y={labelOffsetY}
          text={label}
          fontSize={14}
          fill={color}
          fontStyle="bold"
          rotation={-angle}
          offsetY={7}
        />
      )}
    </Group>
  );
};
