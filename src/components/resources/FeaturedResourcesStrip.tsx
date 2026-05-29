import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import type { ResourceItem } from '../../lib/resourceCatalog';
import './FeaturedResourcesStrip.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface FeaturedResourcesStripProps {
  items: ResourceItem[];
  onOpen: (item: ResourceItem) => void;
}

export default function FeaturedResourcesStrip({ items, onOpen }: FeaturedResourcesStripProps) {
  if (!items.length) return null;

  return (
    <div className="res-featured" aria-label="Featured resources">
      <div className="res-featured__head">
        <Star size={14} aria-hidden />
        <span>Featured picks</span>
      </div>
      <div className="res-featured__track">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            className="res-featured__card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: EASE }}
            onClick={() => onOpen(item)}
          >
            <span className="res-featured__cat">{item.category}</span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <span className="res-featured__cta">
              {item.action === 'nova' ? (
                <>
                  <Sparkles size={13} /> Ask Nova
                </>
              ) : (
                <>
                  Open <ArrowRight size={13} />
                </>
              )}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
