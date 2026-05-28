import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import SiteBackground from '../components/SiteBackground';
import SectionAmbient from '../components/ambient/SectionAmbient';
import SectionReveal from '../components/immersive/SectionReveal';
import { api, isApiConfigured } from '../lib/api';
import {
  DEFAULT_GALLERY_ITEMS,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from '../data/galleryItems';
import { loadLocalGallery } from '../lib/localGallery';
import { useImmersiveMotion } from '../hooks/useImmersiveMotion';
import AmbientNetwork3D from '../components/ecosystem/AmbientNetwork3D';
import ImmersiveCursorGlow from '../components/immersive/ImmersiveCursorGlow';
import './GalleryPage.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  useImmersiveMotion();
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [category, setCategory] = useState<GalleryCategory>('All');
  const [preview, setPreview] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isApiConfigured()) {
        const { items: remote } = await api.gallery(category === 'All' ? undefined : category);
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
        const local = loadLocalGallery();
        setItems(
          category === 'All' ? local : local.filter((i) => i.category === category)
        );
      }
    } catch {
      const local = loadLocalGallery();
      setItems(category === 'All' ? local : local.filter((i) => i.category === category));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (category === 'All') return items;
    return items.filter((i) => i.category === category);
  }, [items, category]);

  return (
    <div className="gallery-page site-shell selection:bg-csi-accent selection:text-csi-pale">
      <ImmersiveCursorGlow />
      <SiteBackground />
      <AmbientNetwork3D />
      <div className="site-chrome" role="presentation">
        <Navbar />
      </div>

      <section className="gallery-section" aria-labelledby="gallery-heading">
        <SectionAmbient preset="about" />
        <SectionReveal className="gallery-section__inner">
          <Link to="/" className="gallery-back">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <header className="gallery-header">
            <p className="gallery-header__eyebrow">CSI Visual Archive</p>
            <h1 id="gallery-heading" className="gallery-header__title">
              Chapter <span className="gallery-header__accent">Gallery</span>
            </h1>
            <p className="gallery-header__desc">
              Workshops, hackathons, team moments, and technical milestones from CSI VIT Chennai.
            </p>
          </header>

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

          {loading ? (
            <div className="gallery-loading" aria-busy>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="gallery-skeleton" />
              ))}
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className="gallery-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onMouseMove={(e) => {
                    const el = e.currentTarget.querySelector('.gallery-card__media') as HTMLElement | null;
                    if (!el) return;
                    const r = el.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
                    const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
                    el.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget.querySelector('.gallery-card__media') as HTMLElement;
                    if (el) el.style.transform = '';
                  }}
                  onClick={() => setPreview(item)}
                >
                  <span className="gallery-card__glow" aria-hidden />
                  <span className="gallery-card__edge" aria-hidden />
                  <span className="gallery-card__holo-frame" aria-hidden />
                  <div className="gallery-card__media">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                    <span className="gallery-card__overlay" />
                    <span className="gallery-card__zoom">
                      <ZoomIn size={18} />
                    </span>
                  </div>
                  <div className="gallery-card__body">
                    <span className="gallery-card__cat">{item.category}</span>
                    <h2 className="gallery-card__title">{item.title}</h2>
                    {item.caption ? <p className="gallery-card__caption">{item.caption}</p> : null}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </SectionReveal>
      </section>

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
            onClick={() => setPreview(null)}
          >
            <motion.div
              className="gallery-lightbox__panel"
              initial={{ scale: 0.92, opacity: 0, filter: 'blur(8px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.96, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="gallery-lightbox__holo" aria-hidden />
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
    </div>
  );
}
