import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import SectionAmbient from './ambient/SectionAmbient';
import SectionReveal from './immersive/SectionReveal';
import ResourcesToolbar from './resources/ResourcesToolbar';
import FeaturedResourcesStrip from './resources/FeaturedResourcesStrip';
import { dispatchOpenNova, useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useResourceCatalog } from '../hooks/useResourceCatalog';
import {
  deriveCategories,
  filterResources,
  getFeaturedResources,
  openResource,
  type ResourceItem,
} from '../lib/resourceCatalog';
import type { ResourceCategory } from '../lib/platformContent';
import { api, hasApiSession, isApiConfigured } from '../lib/api';
import { toggleSavedResource } from '../lib/userDashboard';
import EmptyState from './ui/EmptyState';
import { EventsCarouselSkeleton } from './ui/Skeleton';
import './Resources.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Resources() {
  const { user, profile, updateUserProfile, openAuth } = useAuth();
  const toast = useToast();
  const { resources, loading } = useResourceCatalog();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('All');

  const categories = useMemo(() => deriveCategories(resources), [resources]);
  const filtered = useMemo(
    () => filterResources(resources, search, category),
    [resources, search, category]
  );
  const featured = useMemo(() => getFeaturedResources(resources), [resources]);

  const isSaved = (item: ResourceItem) =>
    (profile?.savedResources ?? []).includes(item.saveKey);

  const toggleSave = async (item: ResourceItem) => {
    if (!user) {
      openAuth('login');
      return;
    }
    if (isApiConfigured() && (await hasApiSession())) {
      try {
        const { saved, savedResources } = await api.toggleResourceSave(item.saveKey);
        updateUserProfile({ savedResources });
        toast.success(saved ? 'Saved to your dashboard' : 'Removed from saved');
        return;
      } catch {
        toast.error('Could not update saved resources.');
        return;
      }
    }
    const next = toggleSavedResource(user.uid, item.saveKey);
    updateUserProfile({ savedResources: next.savedResources });
    toast.success(
      next.savedResources.includes(item.saveKey) ? 'Saved to your dashboard' : 'Removed from saved'
    );
  };

  const handleOpen = (resource: ResourceItem) => {
    openResource(resource, dispatchOpenNova);
  };

  return (
    <section id="resources" className="csi-resources text-csi-pale" aria-labelledby="resources-heading">
      <SectionAmbient preset="about" />
      <SectionReveal className="csi-resources__inner">
        <header className="csi-resources__header">
          <p className="csi-resources__eyebrow">Learning &amp; tools</p>
          <h2 id="resources-heading" className="csi-resources__title">
            Chapter <span className="csi-resources__accent">Resource Hub</span>
          </h2>
          <p className="csi-resources__desc">
            Curated roadmaps, workshop prep, and chapter materials — searchable by domain. Sign in
            to save favorites and sync them with your member dashboard.
          </p>
        </header>

        {!loading && search === '' && category === 'All' ? (
          <FeaturedResourcesStrip items={featured} onOpen={handleOpen} />
        ) : null}

        <ResourcesToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
          categories={categories}
        />

        {loading ? (
          <EventsCarouselSkeleton />
        ) : filtered.length ? (
          <div className="csi-resources__grid">
            {filtered.map((r, index) => {
              const saved = isSaved(r);
              return (
                <motion.article
                  key={r.id}
                  className="csi-resources__card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
                >
                  <div className="csi-resources__card-top">
                    <span className="csi-resources__cat">{r.category}</span>
                    {r.source === 'api' ? (
                      <span className="csi-resources__badge">Chapter</span>
                    ) : null}
                  </div>
                  <h3 className="csi-resources__card-title">{r.title}</h3>
                  <p className="csi-resources__card-desc">{r.description}</p>
                  <div className="csi-resources__actions">
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
                    <button
                      type="button"
                      className={`csi-resources__save${saved ? ' is-saved' : ''}`}
                      onClick={() => void toggleSave(r)}
                      aria-pressed={saved}
                      aria-label={saved ? `Remove ${r.title} from saved` : `Save ${r.title}`}
                    >
                      <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No resources match"
            description="Try another category or clear your search to browse the full chapter library."
          />
        )}
      </SectionReveal>
    </section>
  );
}
