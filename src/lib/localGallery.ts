import { DEFAULT_GALLERY_ITEMS, type GalleryItem } from '../data/galleryItems';

const KEY = 'csi-local-gallery';

export function loadLocalGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [...DEFAULT_GALLERY_ITEMS];
    return JSON.parse(raw) as GalleryItem[];
  } catch {
    return [...DEFAULT_GALLERY_ITEMS];
  }
}

export function saveLocalGallery(items: GalleryItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addLocalGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
  const items = loadLocalGallery();
  const next: GalleryItem = { ...item, id: `local-g-${Date.now()}` };
  items.unshift(next);
  saveLocalGallery(items);
  return next;
}

export function removeLocalGalleryItem(id: string): void {
  saveLocalGallery(loadLocalGallery().filter((i) => i.id !== id));
}
