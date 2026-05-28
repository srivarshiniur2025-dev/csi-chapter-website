import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { AmbientItem } from './ambientPresets';

interface AmbientObjectProps {
  item: AmbientItem;
}

export default function AmbientObject({ item }: AmbientObjectProps) {
  const duration = item.duration ?? 16 + (item.delay ?? 0) * 2;
  const floatY = 16 + (item.depth ?? 0.4) * 14;
  const depth = item.depth ?? 0.4;

  const shellStyle: CSSProperties = {
    top: item.top,
    left: item.left,
    width: item.width,
    height: item.height ?? item.width,
    ['--ambient-depth' as string]: depth,
  };

  return (
    <div className="ambient-obj-shell" style={shellStyle}>
      <motion.div
        className={`ambient-obj ambient-obj--${item.kind}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: item.opacity ?? 0.82,
          y: [0, -floatY, 0],
          ...(item.rotate ? { rotate: [0, 180, 360] } : {}),
        }}
        transition={{
          opacity: { duration: 1.4, delay: item.delay ?? 0 },
          y: { duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay ?? 0 },
          rotate: item.rotate
            ? { duration: duration * 1.8, repeat: Infinity, ease: 'linear', delay: item.delay ?? 0 }
            : undefined,
        }}
      />
    </div>
  );
}
