import { PUBLIC_RESOURCES, RESOURCE_CATEGORIES, type ResourceCategory } from './platformContent';
import { scrollToSectionSmooth } from './lenisScroll';
import { getNavScrollOffset } from '../hooks/useLandingHashScroll';

export type ResourceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  action?: 'nova';
  featured?: boolean;
  source: 'static' | 'api';
  /** Key used for saved-resources (title-based for consistency). */
  saveKey: string;
};

export type ApiResourceRow = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  url?: string;
};

const FEATURED_IDS = new Set(['nova', 'web', 'ml', 'hack']);

export function staticResourceItems(): ResourceItem[] {
  return PUBLIC_RESOURCES.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    href: r.href,
    ...('action' in r && r.action === 'nova' ? { action: 'nova' as const } : {}),
    featured: FEATURED_IDS.has(r.id),
    source: 'static' as const,
    saveKey: r.title,
  }));
}

export function mergeResourceCatalog(apiItems: ApiResourceRow[]): ResourceItem[] {
  const staticCards = staticResourceItems();
  const seen = new Set(staticCards.map((c) => c.title.toLowerCase()));
  const merged = [...staticCards];
  for (const row of apiItems) {
    if (seen.has(row.title.toLowerCase())) continue;
    merged.push({
      id: row._id,
      title: row.title,
      category: row.category || 'Chapter',
      description: row.description || '',
      href: row.url || '#',
      source: 'api',
      saveKey: row.title,
    });
  }
  return merged;
}

export function deriveCategories(items: ResourceItem[]): ResourceCategory[] {
  const base = new Set<string>(RESOURCE_CATEGORIES);
  for (const item of items) {
    if (item.category) base.add(item.category);
  }
  return ['All', ...[...base].filter((c) => c !== 'All').sort()] as ResourceCategory[];
}

export function filterResources(
  items: ResourceItem[],
  search: string,
  category: ResourceCategory
): ResourceItem[] {
  const q = search.trim().toLowerCase();
  return items.filter((r) => {
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
}

export function getFeaturedResources(items: ResourceItem[], limit = 4): ResourceItem[] {
  const featured = items.filter((r) => r.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return [...featured, ...items.filter((r) => !r.featured)].slice(0, limit);
}

export function openResource(
  resource: ResourceItem,
  onNova: () => void
): void {
  if (resource.action === 'nova' || resource.id === 'nova') {
    onNova();
    return;
  }
  if (resource.href.startsWith('#')) {
    const target = resource.href.slice(1);
    if (target) scrollToSectionSmooth(target, getNavScrollOffset());
    return;
  }
  if (resource.href === '#') return;
  window.open(resource.href, '_blank', 'noopener,noreferrer');
}
