import React from 'react';
import { Layer, Line, Rect, Text } from 'react-konva';

import { ChartInfoCard } from '@/components';
import { VectorArrow } from '@/components/physics/VectorArrow';

import type { ForceTypesModel } from './model';
import { calculateForces, g } from './model';

interface Props {
  model: ForceTypesModel;
  onModelChange?: (m: ForceTypesModel) => void;
}

// 力向量组件：使用与受力分析相同的 VectorArrow 风格
const ForceVectorShape = ({
  x,
  y,
  dx,
  dy,
  color,
  label,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  label: string;
}) => {
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 1e-3) return null;
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <VectorArrow
      x={x}
      y={y}
      length={length}
      angle={angleDeg}
      color={color}
      label={label}
      labelOffsetY={-18}
    />
  );
};

export const ForceTypesRenderer: React.FC<Props> = ({ model }) => {
  const SCALE = 10;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const CENTER_X = CANVAS_WIDTH / 3;
  const CENTER_Y = CANVAS_HEIGHT * 1.6;
  const CARD_WIDTH = 240;
  const CARD_PADDING = 20;
  const [cardPos, setCardPos] = React.useState({
    x: CANVAS_WIDTH - CARD_WIDTH - CARD_PADDING,
    y: CARD_PADDING,
  });
  const [decompPhase, setDecompPhase] = React.useState(0); // 0: idle, 1: G∥, 2: G⊥, 3: done
  const [decompProgress, setDecompProgress] = React.useState(0);

  const forces = calculateForces(model);
  const angleRad = (model.angle * Math.PI) / 180;

  const inclineWidth = 800;
  const inclineHeight = inclineWidth * Math.tan(angleRad);

  const blockWidth = 50;
  const blockHeight = 30;
  const tObj = 0.5; // 物块位于斜面中上部的位置参数（0~1）
  const planePointX = CENTER_X + tObj * inclineWidth;
  const planePointY = CENTER_Y - tObj * inclineHeight;
  const nx = -Math.sin(angleRad);
  const ny = -Math.cos(angleRad);
  const objectX = planePointX + nx * (blockHeight / 2);
  const objectY = planePointY + ny * (blockHeight / 2);

  const inclinePoints: [number, number][] = [
    [CENTER_X, CENTER_Y],
    [CENTER_X + inclineWidth, CENTER_Y],
    [CENTER_X + inclineWidth, CENTER_Y - inclineHeight],
  ];

  // 分解动画：分阶段（1 显示 G∥，2 显示 G⊥，3 完成）
  React.useEffect(() => {
    let raf = 0;
    let start = 0;
    let phase = 0;
    const phaseDur = 800; // ms per phase

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / phaseDur);
      setDecompProgress(p);
      if (p >= 1) {
        phase += 1;
        if (phase >= 3) {
          setDecompPhase(3);
          setDecompProgress(1);
          return;
        }
        setDecompPhase(phase + 1);
        start = ts;
        setDecompProgress(0);
      }
      raf = requestAnimationFrame(step);
    };

    if (model.showComponents) {
      phase = 0;
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
  }, [model.showComponents]);

  const parallelScale = decompPhase === 0 ? 0 : decompPhase === 1 ? decompProgress : 1;
  const perpScale = decompPhase < 2 ? 0 : decompPhase === 2 ? decompProgress : 1;

  // 计算合力（屏幕坐标：y 向下）
  const alongPlane = forces.tension - forces.gravityParallel; // >0: 趋势向上
  const frictionDirSign = alongPlane < 0 ? 1 : -1;
  const vecGravity = { x: 0, y: forces.gravity };
  const vecNormal = {
    x: -forces.normal * Math.sin(angleRad),
    y: -forces.normal * Math.cos(angleRad),
  };
  const vecTension = {
    x: forces.tension * Math.cos(angleRad),
    y: -forces.tension * Math.sin(angleRad),
  };
  const vecFriction = {
    x: frictionDirSign * forces.friction * Math.cos(angleRad),
    y: -frictionDirSign * forces.friction * Math.sin(angleRad),
  };

  const netVec = {
    x: vecGravity.x + vecNormal.x + vecTension.x + vecFriction.x,
    y: vecGravity.y + vecNormal.y + vecTension.y + vecFriction.y,
  };
  const netMag = Math.sqrt(netVec.x * netVec.x + netVec.y * netVec.y);

  return (
    <Layer>
      <Text x={50} y={20} text="力的分类与应用" fontSize={18} fill="#1f2937" fontWeight="bold" />
      <Text
        x={50}
        y={45}
        text={`当前显示: ${
          model.selectedForces && model.selectedForces.length > 0
            ? model.selectedForces
                .map(
                  f =>
                    (
                      ({
                        gravity: '重力',
                        normal: '支持力',
                        friction: '摩擦力',
                        tension: '拉力',
                        applied: '外加力',
                      }) as Record<string, string>
                    )[f] ?? f
                )
                .join('/')
            : '无'
        }`}
        fontSize={12}
        fill="#64748b"
      />

      {model.angle > 0 && (
        <Line
          points={[...inclinePoints.flat(), inclinePoints[0][0], inclinePoints[0][1]]}
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth={2}
          closed
        />
      )}

      {model.angle === 0 && (
        <Rect x={CENTER_X} y={CENTER_Y} width={inclineWidth} height={3} fill="#9ca3af" />
      )}

      <Rect
        x={objectX}
        y={objectY}
        width={blockWidth}
        height={blockHeight}
        offsetX={blockWidth / 2}
        offsetY={blockHeight / 2}
        rotation={-model.angle}
        cornerRadius={4}
        fill="#3b82f6"
        stroke="#1e40af"
        strokeWidth={2}
        shadowBlur={4}
      />
      <Text x={objectX - 6} y={objectY - 8} text="m" fontSize={14} fill="white" fontWeight="bold" />

      {model.selectedForces.includes('gravity') && (
        <>
          <ForceVectorShape
            x={objectX}
            y={objectY}
            dx={0}
            dy={forces.gravity * SCALE}
            color="#ef4444"
            label={`G=${forces.gravity.toFixed(1)}N`}
          />
          {model.showComponents && model.angle > 0 && (
            <>
              <ForceVectorShape
                x={objectX}
                y={objectY}
                dx={-parallelScale * forces.gravityParallel * SCALE * Math.cos(angleRad)}
                dy={parallelScale * forces.gravityParallel * SCALE * Math.sin(angleRad)}
                color="#fbbf24"
                label={`G∥=${forces.gravityParallel.toFixed(1)}N`}
              />
              <ForceVectorShape
                x={objectX}
                y={objectY}
                dx={perpScale * forces.gravityPerpendicular * SCALE * Math.sin(angleRad)}
                dy={perpScale * forces.gravityPerpendicular * SCALE * Math.cos(angleRad)}
                color="#a78bfa"
                label={`G⊥=${forces.gravityPerpendicular.toFixed(1)}N`}
              />
            </>
          )}
        </>
      )}

      {model.selectedForces.includes('normal') && (
        <ForceVectorShape
          x={objectX}
          y={objectY}
          dx={-forces.normal * SCALE * Math.sin(angleRad)}
          dy={-forces.normal * SCALE * Math.cos(angleRad)}
          color="#10b981"
          label={`N=${forces.normal.toFixed(1)}N`}
        />
      )}

      {model.selectedForces.includes('friction') &&
        (() => {
          const alongPlane = forces.tension - forces.gravityParallel; // >0: 趋势向上
          const dirSign = alongPlane < 0 ? 1 : -1; // 趋势向下(负)→摩擦向上(+1); 趋势向上(正)→摩擦向下(-1)
          return (
            <ForceVectorShape
              x={objectX}
              y={objectY}
              dx={dirSign * forces.friction * SCALE * Math.cos(angleRad)}
              dy={-dirSign * forces.friction * SCALE * Math.sin(angleRad)}
              color="#ec4899"
              label={`f=${forces.friction.toFixed(1)}N`}
            />
          );
        })()}

      {model.selectedForces.includes('tension') && (
        <ForceVectorShape
          x={objectX}
          y={objectY}
          dx={forces.tension * SCALE * Math.cos(angleRad)}
          dy={-forces.tension * SCALE * Math.sin(angleRad)}
          color="#06b6d4"
          label={`F=${forces.tension.toFixed(1)}N`}
        />
      )}

      {/* 合力向量 */}
      {netMag > 1e-3 && (
        <ForceVectorShape
          x={objectX}
          y={objectY}
          dx={netVec.x * SCALE}
          dy={netVec.y * SCALE}
          color="#f97316"
          label={`ΣF=${netMag.toFixed(1)}N`}
        />
      )}

      <ChartInfoCard
        x={cardPos.x}
        y={cardPos.y}
        width={CARD_WIDTH}
        cornerRadius={8}
        title="力的大小 (N)"
        titleFontSize={20}
        onDragEnd={setCardPos}
      >
        <Text
          x={0}
          y={0}
          text={`重力 G = ${forces.gravity.toFixed(2)} N`}
          fontSize={16}
          fill="#ef4444"
        />
        <Text
          x={0}
          y={20}
          text={`支持力 N = ${forces.normal.toFixed(2)} N`}
          fontSize={16}
          fill="#10b981"
        />
        <Text
          x={0}
          y={40}
          text={`摩擦力 f = ${forces.friction.toFixed(2)} N`}
          fontSize={16}
          fill="#ec4899"
        />
        <Text
          x={0}
          y={60}
          text={`拉力 F = ${forces.tension.toFixed(2)} N`}
          fontSize={16}
          fill="#06b6d4"
        />

        {model.angle > 0 && (
          <>
            <Text
              x={0}
              y={80}
              text={`G∥ = ${forces.gravityParallel.toFixed(2)} N`}
              fontSize={16}
              fill="#fbbf24"
            />
            <Text
              x={0}
              y={100}
              text={`G⊥ = ${forces.gravityPerpendicular.toFixed(2)} N`}
              fontSize={16}
              fill="#a78bfa"
            />
          </>
        )}

        <Text x={0} y={122} text="物理量" fontSize={16} fill="#1f2937" fontStyle="bold" />
        <Text
          x={0}
          y={144}
          text={`质量 m = ${model.mass.toFixed(1)} kg`}
          fontSize={16}
          fill="#334155"
        />
        <Text x={0} y={164} text={`斜面角 θ = ${model.angle}°`} fontSize={16} fill="#334155" />
        <Text
          x={0}
          y={184}
          text={`摩擦系数 μ = ${model.coefficientFriction.toFixed(2)}`}
          fontSize={16}
          fill="#334155"
        />
        <Text x={0} y={204} text={`重力加速度 g = ${g} m/s²`} fontSize={16} fill="#334155" />
      </ChartInfoCard>
    </Layer>
  );
};

export default ForceTypesRenderer;
