import { isLowPowerDevice, prefersReducedMotion } from '../../lib/performance';
import { AMBIENT_PRESETS, type AmbientPreset } from './ambientPresets';
import AmbientObject from './AmbientObject';
import './ambient.css';

interface SectionAmbientProps {
  preset: AmbientPreset;
}

export default function SectionAmbient({ preset }: SectionAmbientProps) {
  if (prefersReducedMotion()) return null;

  const lite = isLowPowerDevice();
  const items = AMBIENT_PRESETS[preset].filter((i) => !lite || !i.liteHide);

  if (!items.length) return null;

  return (
    <div className="ambient-section" aria-hidden>
      {items.map((item) => (
        <AmbientObject key={item.id} item={item} />
      ))}
    </div>
  );
}
