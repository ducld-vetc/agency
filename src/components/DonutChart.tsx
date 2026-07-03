import React from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  callout?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const DonutChart: React.FC<DonutChartProps> = ({ segments, centerLabel, centerValue }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 120;
  const cy = 120;
  const outerR = 88;
  const innerR = 58;
  let cursor = 0;

  const arcs = segments.map((seg) => {
    const sweep = (seg.value / total) * 360;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    const mid = start + sweep / 2;
    const calloutPos = polarToCartesian(cx, cy, outerR + 28, mid);
    return { ...seg, start, end, mid, calloutPos };
  });

  return (
    <div className="am-donut">
      <svg viewBox="0 0 240 240" className="am-donut__svg" aria-hidden>
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={describeArc(cx, cy, outerR, arc.start, arc.end - 0.5)}
            fill="none"
            stroke={arc.color}
            strokeWidth={outerR - innerR}
            strokeLinecap="butt"
          />
        ))}
      </svg>

      {arcs.map((arc) => (
        <div
          key={`${arc.label}-callout`}
          className="am-donut__callout"
          style={{
            left: `${(arc.calloutPos.x / 240) * 100}%`,
            top: `${(arc.calloutPos.y / 240) * 100}%`,
          }}
        >
          {arc.callout ?? `${arc.value.toLocaleString('vi-VN')} đ`}
        </div>
      ))}

      <div className="am-donut__center">
        <span>{centerLabel}</span>
        <strong>{centerValue}</strong>
      </div>
    </div>
  );
};

export default DonutChart;
