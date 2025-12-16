import React from 'react';
import Konva from 'konva';
import { Group, Rect, Text } from 'react-konva';

interface ChartInfoCardProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  padding?: number;
  cornerRadius?: number;
  draggable?: boolean;
  titleFontSize?: number;
  autoHeight?: boolean;
  title?: string;
  onDragEnd?: (pos: { x: number; y: number }) => void;
  children?: React.ReactNode; // react-konva nodes
}

export const ChartInfoCard: React.FC<ChartInfoCardProps> = ({
  x,
  y,
  width = 240,
  height = 300,
  padding = 10,
  cornerRadius = 8,
  draggable = true,
  title,
  titleFontSize = 20,
  autoHeight = true,
  onDragEnd,
  children,
}) => {
  const contentRef = React.useRef<Konva.Group | null>(null);
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    if (!autoHeight) return;
    const node = contentRef.current;
    if (node && node.getClientRect) {
      const rect = node.getClientRect();
      const titleBlock = title ? titleFontSize + 8 : 0;
      const total = padding + titleBlock + rect.height + padding;
      setMeasuredHeight(total);
    }
  }, [autoHeight, title, titleFontSize, padding, children]);
  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={e => onDragEnd?.({ x: e.target.x(), y: e.target.y() })}
    >
      <Rect
        x={0}
        y={0}
        width={width}
        height={measuredHeight ?? height}
        fill="white"
        stroke="#d1d5db"
        strokeWidth={1}
        cornerRadius={cornerRadius}
        shadowBlur={4}
      />
      {title && (
        <Text
          x={padding}
          y={padding}
          text={title}
          fontSize={titleFontSize}
          fill="#1f2937"
          fontStyle="bold"
        />
      )}
      <Group x={padding} y={title ? padding + titleFontSize + 8 : padding}>
        {children}
      </Group>
    </Group>
  );
};

export default ChartInfoCard;
