import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import SectionReveal from './immersive/SectionReveal';
import ResourcesToolbar from './resources/ResourcesToolbar';
import { dispatchOpenNova } from '../contexts/AuthContext';
import { PUBLIC_RESOURCES, type ResourceCategory } from '../lib/platformContent';
import { api, isApiConfigured } from '../lib/api';
import { scrollToSectionSmooth } from '../lib/lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';
import './Resources.css';

const EASE = [0.22, 1, 0.36, 1] as const;

type ResourceCard = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  action?: 'nova';
};

export default function Resources() {
  const [apiItems, setApiItems] = useState<ResourceCard[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('All');

  useEffect(() => {
    if (!isApiConfigured()) return;
    void api
      .resources()
      .then((res) => {
        setApiItems(
          res.resources.map((r) => ({
            id: r._id,
            title: r.title,
            category: r.category || 'Chapter',
            description: r.description || '',
            href: r.url || '#',
          }))
        );
      })
      .catch(() => {
        /* keep static catalog */
      });
  }, []);

  const resources = useMemo<ResourceCard[]>(() => {
    const staticCards: ResourceCard[] = PUBLIC_RESOURCES.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      href: r.href,
      ...('action' in r && r.action === 'nova' ? { action: 'nova' as const } : {}),
    }));
    const seen = new Set(staticCards.map((c) => c.title.toLowerCase()));
    const merged = [...staticCards];
    for (const item of apiItems) {
      if (seen.has(item.title.toLowerCase())) continue;
      merged.push(item);
    }
    return merged;
  }, [apiItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      const catOk =
        category === 'All' || r.category.toLowerCase() === category.toLowerCase();
      if (!catOk) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [resources, search, category]);

  const handleOpen = (resource: ResourceCard) => {
    if (resource.action === 'nova' || resource.id === 'nova') {
      dispatchOpenNova();
      return;
    }
    if (resource.href.startsWith('#')) {
      scrollToSectionSmooth(resource.href.slice(1), getNavScrollOffset());
      return;
    }
    if (resource.href === '#') return;
    window.open(resource.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="resources" className="csi-resources text-csi-pale" aria-labelledby="resources-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-resources__inner">
        <header className="csi-resources__header">
          <p className="csi-resources__eyebrow">Learning &amp; tools</p>
          <h2 id="resources-heading" className="csi-resources__title">
            Chapter <span className="csi-resources__accent">Resources</span>
          </h2>
          <p className="csi-resources__desc">
            Curated learning portal for every CSI domain — roadmaps, interview prep, and workshop
            materials. Sign in to save favorites in your dashboard.
          </p>
        </header>

        <ResourcesToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
        />

        <div className="csi-resources__grid">
          {filtered.map((r, index) => (
            <motion.article
              key={r.id}
              className="csi-resources__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
            >
              <span className="csi-resources__cat">{r.category}</span>
              <h3 className="csi-resources__card-title">{r.title}</h3>
              <p className="csi-resources__card-desc">{r.description}</p>
              <button type="button" className="csi-resources__link" onClick={() => handleOpen(r)}>
                {r.action === 'nova' || r.id === 'nova' ? (
                  <>
                    <Sparkles size={14} /> Ask CSI Nova
                  </>
                ) : (
                  <>
                    Open resource <ExternalLink size={13} aria-hidden />
                  </>
                )}
              </button>
            </motion.article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
