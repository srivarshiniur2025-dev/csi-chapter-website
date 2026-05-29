import type { ResponseMatch } from './aiAssistant';

const STORAGE_KEY = 'csi-nova-knowledge-admin';

export function loadAdminNovaEntries(): ResponseMatch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ResponseMatch[];
  } catch {
    return [];
  }
}

export function saveAdminNovaEntries(entries: ResponseMatch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export function mergeKnowledge(base: ResponseMatch[], admin: ResponseMatch[]): ResponseMatch[] {
  return [...admin, ...base];
}
