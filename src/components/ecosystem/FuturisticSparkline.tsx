import { useId } from 'react';
import './FuturisticSparkline.css';

interface FuturisticSparklineProps {
  values: number[];
  label?: string;
  className?: string;
}

export default function FuturisticSparkline({ values, label, className = '' }: FuturisticSparklineProps) {
  const gradId = useId();
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 40;
  const pts = values
    .map((v, i) => {
      const x = values.length === 1 ? w / 2 : (i / (values.length - 1)) * w;
      const y = h - (v / max) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const area = `${pts} ${w},${h} 0,${h}`;

  return (
    <div className={`csi-sparkline ${className}`.trim()} aria-hidden={!label}>
      {label ? <span className="csi-sparkline__label">{label}</span> : null}
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="csi-sparkline__svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(148, 0, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(148, 0, 255, 0)" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline points={pts} fill="none" stroke="#c77dff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
