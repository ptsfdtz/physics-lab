import React, { useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';

import { useUserSettings } from '../../store/userSettings';
import { GridBackground } from '../physics/GridBackground';
import { Button } from '../ui/Button';

interface PhysicsCanvasProps {
  children: React.ReactNode;
  overlay?: React.ReactNode;
}

export const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({ children, overlay }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { showGrid } = useUserSettings();
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPos, setOverlayPos] = useState<{ x: number; y: number } | null>(null);
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

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

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const s = dragState.current;
      const el = containerRef.current;
      if (!s || !s.dragging || !el) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      let nx = s.origX + dx;
      let ny = s.origY + dy;
      nx = Math.max(8, Math.min(el.offsetWidth - 320 - 8, nx));
      ny = Math.max(8, Math.min(el.offsetHeight - 240 - 8, ny));
      setOverlayPos({ x: nx, y: ny });
    };

    const onUp = () => {
      if (dragState.current) dragState.current.dragging = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
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
        <div
          className="drag-handle cursor-move p-2 bg-white/80 border-b text-sm text-gray-600"
          onMouseDown={e => {
            const el = containerRef.current;
            dragState.current = {
              dragging: true,
              startX: e.clientX,
              startY: e.clientY,
              origX: overlayPos ? overlayPos.x : el ? el.offsetWidth - 16 - 384 : 0,
              origY: overlayPos ? overlayPos.y : el ? el.offsetHeight - 64 - 360 : 0,
            };
            e.preventDefault();
          }}
        >
          <div
            className={`absolute w-96 h-90 bg-white/95 rounded-xl shadow-lg overflow-hidden border border-gray-200`}
            style={
              overlayPos ? { left: overlayPos.x, top: overlayPos.y } : { right: 16, bottom: 64 }
            }
          >
            <div className="w-full h-[calc(100%-40px)]">{overlay}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
