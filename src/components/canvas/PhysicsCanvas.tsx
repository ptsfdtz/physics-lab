import React, { useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { Button } from '../ui/Button';
import { useUserSettings } from '../../store/userSettings';
import { GridBackground } from '../physics/GridBackground';

interface PhysicsCanvasProps {
  children: React.ReactNode;
  /** 可选覆盖层（例如图表）会显示在画布之上 */
  overlay?: React.ReactNode;
}

export const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({ children, overlay }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { showGrid } = useUserSettings();
  const [showOverlay, setShowOverlay] = useState(false);

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

      {/* 右下角切换按钮 */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
        {overlay ? (
          <Button
            onClick={() => setShowOverlay(s => !s)}
            className="px-3 py-1 flex items-center justify-center gap-2"
          >
            {showOverlay ? '关闭图表' : '显示图表'}
          </Button>
        ) : null}
      </div>

      {/* 覆盖层（例如图表） */}
      {overlay && showOverlay ? (
        <div className="absolute bottom-16 right-4 w-96 h-90 bg-white/95 rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {overlay}
        </div>
      ) : null}
    </div>
  );
};
