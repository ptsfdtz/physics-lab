import React, { useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { useUserSettings } from '../../store/userSettings';
import { GridBackground } from '../physics/GridBackground';

interface PhysicsCanvasProps {
  children: React.ReactNode;
}

export const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { showGrid } = useUserSettings();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full bg-white relative overflow-hidden rounded-lg shadow-inner border border-gray-200 m-2"
    >
      {dimensions.width > 0 && (
        <Stage width={dimensions.width} height={dimensions.height}>
          {showGrid && <GridBackground width={dimensions.width} height={dimensions.height} />}
          {children}
        </Stage>
      )}
      <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur rounded text-xs text-gray-500 pointer-events-none">
        画布: {dimensions.width}x{dimensions.height}
      </div>
    </div>
  );
};
