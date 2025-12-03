import React from 'react';
import { Layer, Line, Text } from 'react-konva';

interface GridBackgroundProps {
  width: number;
  height: number;
  gridSize?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ width, height, gridSize = 50 }) => {
  const lines = [];
  const labels = [];

  // Vertical lines
  for (let i = 0; i <= width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * gridSize, 0, i * gridSize, height]}
        stroke={i === 0 ? '#94a3b8' : '#e2e8f0'} // Darker for axis
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
    if (i % 2 === 0 && i !== 0) {
      labels.push(
        <Text
          key={`tx-${i}`}
          x={i * gridSize + 2}
          y={height - 20}
          text={`${i * (gridSize / 10)}m`} // Scale assumption 10px = 1m approx, just visualization
          fontSize={10}
          fill="#94a3b8"
        />
      );
    }
  }

  // Horizontal lines
  for (let j = 0; j <= height / gridSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, height - j * gridSize, width, height - j * gridSize]}
        stroke={j === 0 ? '#94a3b8' : '#e2e8f0'}
        strokeWidth={j === 0 ? 2 : 1}
      />
    );
  }

  return (
    <Layer listening={false}>
      {lines}
      {labels}
    </Layer>
  );
};
