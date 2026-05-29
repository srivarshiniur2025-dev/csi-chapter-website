import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import SectionReveal from './immersive/SectionReveal';
import { api, isApiConfigured } from '../lib/api';
import {
  DEFAULT_GALLERY_ITEMS,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from '../data/galleryItems';
import { loadLocalGallery } from '../lib/localGallery';
import './Gallery.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.28, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: EASE },
  },
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [category, setCategory] = useState<GalleryCategory>('All');
  const [preview, setPreview] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      if (isApiConfigured()) {
        const { items: remote } = await api.gallery();
        if (remote?.length) {
          setItems(
            remote.map((r) => ({
              id: r.id,
              title: r.title,
              category: r.category as GalleryItem['category'],
              imageUrl: r.imageUrl,
              caption: r.caption || '',
            }))
          );
        }
      } else {
        setItems(loadLocalGallery());
      }
    } catch {
      setItems(loadLocalGallery());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const filtered = useMemo(() => {
    if (category === 'All') return items;
    return items.filter((i) => i.category === category);
  }, [items, category]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPreview(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [preview]);

  return (
    <section id="gallery" className="gallery-section text-csi-pale" aria-labelledby="gallery-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="gallery-section__inner">
        <motion.header
          className="gallery-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <p className="gallery-header__eyebrow">CSI Visual Archive</p>
          <h2 id="gallery-heading" className="gallery-header__title">
            Chapter <span className="gallery-header__accent">Gallery</span>
          </h2>
          <p className="gallery-header__desc">
            Workshops, hackathons, team moments, and technical milestones from CSI VIT Chennai.
          </p>
        </motion.header>

        <div className="gallery-filters" role="tablist" aria-label="Gallery categories">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              className={`gallery-filters__chip${category === cat ? ' gallery-filters__chip--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-stage" aria-live="polite">
          {loading ? (
            <div className="gallery-loading" aria-busy>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="gallery-skeleton" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.p
                  key="empty"
                  className="gallery-empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  No images in this category yet.
                </motion.p>
              ) : (
                <motion.div
                  key={category}
                  className="gallery-grid"
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {filtered.map((item) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className="gallery-card"
                      variants={cardVariants}
                      layout
                      whileHover={{ y: -6, transition: { duration: 0.28, ease: EASE } }}
                      whileTap={{ scale: 0.99 }}
                      onMouseMove={(e) => {
                        const el = e.currentTarget.querySelector('.gallery-card__media') as HTMLElement | null;
                        if (!el) return;
                        const r = el.getBoundingClientRect();
                        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
                        const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
                        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget.querySelector('.gallery-card__media') as HTMLElement;
                        if (el) el.style.transform = '';
                      }}
                      onClick={() => setPreview(item)}
                    >
                      <span className="gallery-card__glow" aria-hidden />
                      <span className="gallery-card__edge" aria-hidden />
                      <div className="gallery-card__media">
                        <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
                        <span className="gallery-card__overlay" />
                        <span className="gallery-card__zoom">
                          <ZoomIn size={18} />
                        </span>
                      </div>
                      <div className="gallery-card__body">
                        <span className="gallery-card__cat">{item.category}</span>
                        <h3 className="gallery-card__title">{item.title}</h3>
                        {item.caption ? <p className="gallery-card__caption">{item.caption}</p> : null}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </SectionReveal>

      <AnimatePresence>
        {preview && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={preview.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              className="gallery-lightbox__panel"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="gallery-lightbox__close"
                onClick={() => setPreview(null)}
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
              <img src={preview.imageUrl} alt={preview.title} />
              <div className="gallery-lightbox__meta">
                <span>{preview.category}</span>
                <h3>{preview.title}</h3>
                {preview.caption ? <p>{preview.caption}</p> : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
