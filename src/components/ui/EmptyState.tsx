import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`csi-empty ${className}`.trim()}>
      <p className="csi-empty__title">{title}</p>
      {description ? <p className="csi-empty__desc">{description}</p> : null}
      {action ? <div className="csi-empty__action">{action}</div> : null}
    </div>
  );
}
