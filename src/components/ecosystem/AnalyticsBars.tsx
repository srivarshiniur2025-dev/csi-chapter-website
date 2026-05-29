import './AnalyticsBars.css';

interface AnalyticsBarsProps {
  labels: string[];
  values: number[];
  title?: string;
}

export default function AnalyticsBars({ labels, values, title }: AnalyticsBarsProps) {
  const max = Math.max(...values, 1);

  return (
    <div className="analytics-bars">
      {title ? <p className="analytics-bars__title">{title}</p> : null}
      <div className="analytics-bars__chart" role="img" aria-label={title ?? 'Chart'}>
        {values.map((v, i) => (
          <div key={labels[i] ?? i} className="analytics-bars__col">
            <div
              className="analytics-bars__fill"
              style={{ height: `${Math.round((v / max) * 100)}%` }}
              title={`${labels[i]}: ${v}`}
            />
            <span className="analytics-bars__label">{labels[i]}</span>
            <span className="analytics-bars__val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
