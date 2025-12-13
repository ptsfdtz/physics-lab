import { useEffect, useRef } from 'react';
import type { EChartsOption } from 'echarts';
import { LineChart, ScatterChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import type { EChartsType } from 'echarts/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { CSSProperties } from 'react';

let echartsInitialized = false;

const ensureEcharts = () => {
  if (echartsInitialized) return;
  echarts.use([
    LineChart,
    ScatterChart,
    GridComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    CanvasRenderer,
  ]);
  echartsInitialized = true;
};

interface ChartHostProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
}

export const ChartHost: React.FC<ChartHostProps> = ({ option, className, style }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    ensureEcharts();
    if (!containerRef.current) return;
    chartRef.current = echarts.init(containerRef.current);
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.setOption(option, true);
  }, [option]);

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return <div ref={containerRef} className={className} style={{ minHeight: 320, ...style }} />;
};
