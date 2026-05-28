import './SectionDivider.css';

type Variant = 'default' | 'strong' | 'subtle';

export default function SectionDivider({ variant = 'default' }: { variant?: Variant }) {
  return (
    <div className={`section-divider section-divider--${variant}`} aria-hidden>
      <span className="section-divider__beam section-divider__beam--left" />
      <span className="section-divider__core">
        <span className="section-divider__ring" />
        <span className="section-divider__node" />
      </span>
      <span className="section-divider__beam section-divider__beam--right" />
    </div>
  );
}
