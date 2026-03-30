'use client';

import React, { useMemo } from 'react';

interface CpuChartProps {
  data: { cpu: number }[];
  color?: string;
}

export const CpuChart: React.FC<CpuChartProps> = ({ data, color = '#3b82f6' }) => {
  const points = useMemo(() => {
    if (data.length < 2) return '';
    const width = 100;
    const height = 40;
    const step = width / (data.length - 1);
    
    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - (d.cpu / 100) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data]);

  return (
    <div className="w-full h-12 overflow-hidden">
      <svg
        viewBox="0 0 100 40"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-300 ease-linear"
        />
        {/* Optional: Gradient fill under the curve */}
        <path
          d={`M 0 40 L ${points} L 100 40 Z`}
          fill={color}
          fillOpacity="0.1"
          className="transition-all duration-300 ease-linear"
        />
      </svg>
    </div>
  );
};
