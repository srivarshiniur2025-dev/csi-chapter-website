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
  hero: [
    { id: 'h-cube-l', kind: 'cube', top: '18%', left: '6%', width: '2.75rem', depth: 0.4, delay: 0, rotate: true, liteHide: true },
    { id: 'h-sphere-r', kind: 'sphere', top: '22%', left: '88%', width: '3.5rem', depth: 0.6, delay: 1.2 },
    { id: 'h-hex-l', kind: 'hex', top: '55%', left: '4%', width: '2.5rem', depth: 0.35, delay: 0.8 },
    { id: 'h-wire-r', kind: 'wire', top: '48%', left: '90%', width: '4rem', depth: 0.5, delay: 2, liteHide: true },
    { id: 'h-node-1', kind: 'node', top: '30%', left: '12%', width: '1.25rem', depth: 0.25, delay: 0.4 },
    { id: 'h-node-2', kind: 'node', top: '38%', left: '82%', width: '1rem', depth: 0.3, delay: 1.6 },
    { id: 'h-fragment', kind: 'fragment', top: '62%', left: '92%', width: '2rem', depth: 0.45, delay: 1 },
    { id: 'h-blob', kind: 'blob', top: '12%', left: '78%', width: '5rem', depth: 0.2, opacity: 0.35 },
    { id: 'h-orbit', kind: 'orbit', top: '42%', left: '8%', width: '3rem', depth: 0.55, delay: 0.6, liteHide: true },
    { id: 'h-line', kind: 'line', top: '70%', left: '6%', width: '6rem', depth: 0.3, delay: 1.4 },
  ],
  about: [
    { id: 'a-ring', kind: 'ring', top: '8%', left: '82%', width: '5rem', depth: 0.5, delay: 0 },
    { id: 'a-glass', kind: 'glass', top: '55%', left: '3%', width: '4.5rem', height: '3rem', depth: 0.4, delay: 1 },
    { id: 'a-cube', kind: 'cube', top: '72%', left: '88%', width: '2.25rem', depth: 0.55, delay: 0.5, rotate: true, liteHide: true },
    { id: 'a-sphere', kind: 'sphere', top: '25%', left: '5%', width: '2.5rem', depth: 0.35, delay: 1.8 },
    { id: 'a-hex', kind: 'hex', top: '40%', left: '92%', width: '2rem', depth: 0.45, delay: 0.9 },
  ],
  events: [
    { id: 'e-grid', kind: 'wire', top: '6%', left: '4%', width: '5.5rem', depth: 0.35, delay: 0 },
    { id: 'e-fragment-t', kind: 'fragment', top: '4%', left: '90%', width: '2.5rem', depth: 0.5, delay: 1.2 },
    { id: 'e-ring', kind: 'ring', top: '45%', left: '2%', width: '4rem', depth: 0.4, delay: 0.6, liteHide: true },
    { id: 'e-orbit', kind: 'orbit', top: '38%', left: '93%', width: '3.25rem', depth: 0.55, delay: 1.5 },
    { id: 'e-glass', kind: 'glass', top: '78%', left: '88%', width: '3.5rem', height: '2.5rem', depth: 0.3, delay: 0.3 },
    { id: 'e-blob', kind: 'blob', top: '82%', left: '6%', width: '4.5rem', depth: 0.2, opacity: 0.3 },
    { id: 'e-node', kind: 'node', top: '20%', left: '96%', width: '1rem', depth: 0.25, delay: 2 },
  ],
  journey: [
    { id: 'j-line', kind: 'line', top: '10%', left: '88%', width: '5rem', depth: 0.4, delay: 0 },
    { id: 'j-hex', kind: 'hex', top: '35%', left: '4%', width: '2.75rem', depth: 0.45, delay: 1 },
    { id: 'j-sphere', kind: 'sphere', top: '60%', left: '90%', width: '3rem', depth: 0.35, delay: 0.5 },
    { id: 'j-cube', kind: 'cube', top: '78%', left: '8%', width: '2rem', depth: 0.5, delay: 1.4, rotate: true, liteHide: true },
    { id: 'j-ring', kind: 'ring', top: '48%', left: '92%', width: '3.5rem', depth: 0.55, delay: 0.8, liteHide: true },
  ],
  team: [
    { id: 't-glass-l', kind: 'glass', top: '12%', left: '5%', width: '4rem', height: '2.75rem', depth: 0.4, delay: 0 },
    { id: 't-ring', kind: 'ring', top: '20%', left: '86%', width: '4.5rem', depth: 0.5, delay: 1.1 },
    { id: 't-wire', kind: 'wire', top: '70%', left: '90%', width: '4rem', depth: 0.35, delay: 0.6, liteHide: true },
    { id: 't-fragment', kind: 'fragment', top: '75%', left: '4%', width: '2.25rem', depth: 0.45, delay: 1.8 },
    { id: 't-orbit', kind: 'orbit', top: '42%', left: '3%', width: '2.75rem', depth: 0.55, delay: 0.4, liteHide: true },
    { id: 't-blob', kind: 'blob', top: '55%', left: '88%', width: '4rem', depth: 0.2, opacity: 0.28 },
  ],
  contact: [
    { id: 'c-sphere', kind: 'sphere', top: '15%', left: '8%', width: '2.75rem', depth: 0.35, delay: 0 },
    { id: 'c-hex', kind: 'hex', top: '25%', left: '88%', width: '2.5rem', depth: 0.45, delay: 1 },
    { id: 'c-line', kind: 'line', top: '70%', left: '85%', width: '5.5rem', depth: 0.4, delay: 0.5 },
    { id: 'c-ring', kind: 'ring', top: '65%', left: '5%', width: '3.5rem', depth: 0.5, delay: 1.2, liteHide: true },
    { id: 'c-glass', kind: 'glass', top: '40%', left: '92%', width: '3rem', height: '2rem', depth: 0.3, delay: 0.8 },
  ],
  dashboard: [
    { id: 'd-ring', kind: 'ring', top: '8%', left: '6%', width: '4rem', depth: 0.35, delay: 0 },
    { id: 'd-glass', kind: 'glass', top: '18%', left: '88%', width: '3.5rem', height: '2.25rem', depth: 0.4, delay: 0.8 },
    { id: 'd-sphere', kind: 'sphere', top: '72%', left: '10%', width: '2.5rem', depth: 0.3, delay: 0.5, opacity: 0.4 },
    { id: 'd-hex', kind: 'hex', top: '78%', left: '85%', width: '2rem', depth: 0.45, delay: 1.2, liteHide: true },
    { id: 'd-node', kind: 'node', top: '42%', left: '4%', width: '0.85rem', depth: 0.2, delay: 1.5 },
  ],
};
