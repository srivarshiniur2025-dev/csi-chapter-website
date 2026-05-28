export type AmbientKind =
  | 'cube'
  | 'sphere'
  | 'ring'
  | 'hex'
  | 'node'
  | 'wire'
  | 'glass'
  | 'blob'
  | 'fragment'
  | 'orbit'
  | 'line';

export interface AmbientItem {
  id: string;
  kind: AmbientKind;
  top: string;
  left: string;
  width: string;
  height?: string;
  depth?: number;
  opacity?: number;
  delay?: number;
  duration?: number;
  rotate?: boolean;
  liteHide?: boolean;
}

export type AmbientPreset =
  | 'hero'
  | 'about'
  | 'events'
  | 'journey'
  | 'team'
  | 'contact'
  | 'dashboard';

export const AMBIENT_PRESETS: Record<AmbientPreset, AmbientItem[]> = {
  hero: [],
  about: [
    { id: 'a-ring', kind: 'ring', top: '6%', left: '80%', width: '6.5rem', depth: 0.6, delay: 0 },
    { id: 'a-glass', kind: 'glass', top: '52%', left: '2%', width: '5.5rem', height: '3.5rem', depth: 0.5, delay: 1 },
    { id: 'a-cube', kind: 'cube', top: '70%', left: '86%', width: '3.5rem', depth: 0.65, delay: 0.5, rotate: true, liteHide: true },
    { id: 'a-sphere', kind: 'sphere', top: '22%', left: '3%', width: '3.75rem', depth: 0.5, delay: 1.8 },
    { id: 'a-hex', kind: 'hex', top: '38%', left: '90%', width: '3rem', depth: 0.55, delay: 0.9 },
    { id: 'a-orbit', kind: 'orbit', top: '82%', left: '8%', width: '3.5rem', depth: 0.45, delay: 1.2 },
  ],
  events: [
    { id: 'e-grid', kind: 'wire', top: '4%', left: '3%', width: '6.5rem', depth: 0.5, delay: 0 },
    { id: 'e-fragment-t', kind: 'fragment', top: '2%', left: '88%', width: '3.25rem', depth: 0.6, delay: 1.2 },
    { id: 'e-ring', kind: 'ring', top: '42%', left: '1%', width: '5.5rem', depth: 0.55, delay: 0.6, liteHide: true },
    { id: 'e-orbit', kind: 'orbit', top: '36%', left: '91%', width: '4.5rem', depth: 0.65, delay: 1.5 },
    { id: 'e-glass', kind: 'glass', top: '76%', left: '86%', width: '4.5rem', height: '3rem', depth: 0.45, delay: 0.3 },
    { id: 'e-blob', kind: 'blob', top: '80%', left: '4%', width: '6rem', depth: 0.35, opacity: 0.5 },
    { id: 'e-node', kind: 'node', top: '18%', left: '94%', width: '1.25rem', depth: 0.4, delay: 2 },
    { id: 'e-cube', kind: 'cube', top: '58%', left: '92%', width: '3rem', depth: 0.5, rotate: true, delay: 0.9, liteHide: true },
  ],
  journey: [
    { id: 'j-line', kind: 'line', top: '8%', left: '86%', width: '7rem', depth: 0.5, delay: 0 },
    { id: 'j-hex', kind: 'hex', top: '32%', left: '3%', width: '3.75rem', depth: 0.55, delay: 1 },
    { id: 'j-sphere', kind: 'sphere', top: '58%', left: '88%', width: '4rem', depth: 0.5, delay: 0.5 },
    { id: 'j-cube', kind: 'cube', top: '76%', left: '6%', width: '3.25rem', depth: 0.6, delay: 1.4, rotate: true, liteHide: true },
    { id: 'j-ring', kind: 'ring', top: '46%', left: '90%', width: '4.5rem', depth: 0.65, delay: 0.8, liteHide: true },
    { id: 'j-fragment', kind: 'fragment', top: '20%', left: '5%', width: '2.75rem', depth: 0.5, delay: 1.6 },
  ],
  team: [
    { id: 't-glass-l', kind: 'glass', top: '10%', left: '4%', width: '5rem', height: '3.25rem', depth: 0.5, delay: 0 },
    { id: 't-ring', kind: 'ring', top: '18%', left: '84%', width: '5.5rem', depth: 0.6, delay: 1.1 },
    { id: 't-wire', kind: 'wire', top: '68%', left: '88%', width: '5rem', depth: 0.5, delay: 0.6, liteHide: true },
    { id: 't-fragment', kind: 'fragment', top: '72%', left: '3%', width: '3rem', depth: 0.55, delay: 1.8 },
    { id: 't-orbit', kind: 'orbit', top: '40%', left: '2%', width: '4rem', depth: 0.65, delay: 0.4, liteHide: true },
    { id: 't-blob', kind: 'blob', top: '52%', left: '86%', width: '5.5rem', depth: 0.35, opacity: 0.48 },
    { id: 't-sphere', kind: 'sphere', top: '38%', left: '92%', width: '3rem', depth: 0.45, delay: 0.7 },
  ],
  contact: [
    { id: 'c-sphere', kind: 'sphere', top: '12%', left: '6%', width: '3.75rem', depth: 0.5, delay: 0 },
    { id: 'c-hex', kind: 'hex', top: '22%', left: '86%', width: '3.5rem', depth: 0.55, delay: 1 },
    { id: 'c-line', kind: 'line', top: '68%', left: '83%', width: '7rem', depth: 0.5, delay: 0.5 },
    { id: 'c-ring', kind: 'ring', top: '62%', left: '4%', width: '4.5rem', depth: 0.6, delay: 1.2, liteHide: true },
    { id: 'c-glass', kind: 'glass', top: '38%', left: '90%', width: '4rem', height: '2.75rem', depth: 0.45, delay: 0.8 },
    { id: 'c-orbit', kind: 'orbit', top: '78%', left: '12%', width: '3.5rem', depth: 0.5, delay: 0.4 },
  ],
  dashboard: [
    { id: 'd-ring', kind: 'ring', top: '6%', left: '5%', width: '5rem', depth: 0.45, delay: 0 },
    { id: 'd-glass', kind: 'glass', top: '16%', left: '86%', width: '4.25rem', height: '2.75rem', depth: 0.5, delay: 0.8 },
    { id: 'd-sphere', kind: 'sphere', top: '70%', left: '8%', width: '3.25rem', depth: 0.4, delay: 0.5, opacity: 0.65 },
    { id: 'd-hex', kind: 'hex', top: '76%', left: '83%', width: '2.75rem', depth: 0.55, delay: 1.2, liteHide: true },
    { id: 'd-node', kind: 'node', top: '40%', left: '3%', width: '1rem', depth: 0.35, delay: 1.5 },
  ],
};
