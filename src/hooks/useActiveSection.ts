import { useEffect, useState } from 'react';

const DEFAULT_IDS = [
  'home',
  'about',
  'domains',
  'events',
  'journey',
  'gallery',
  'team',
  'resources',
  'dashboard-access',
  'contact',
];

/** Tracks which landing section is most visible for navbar highlighting */
export function useActiveSection(sectionIds: string[] = DEFAULT_IDS) {
  const [active, setActive] = useState(sectionIds[0] ?? 'home');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.05)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0];
        if (top?.target.id) setActive(top.target.id);
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: [0.1, 0.25, 0.4, 0.55] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds.join('|')]);

  return active;
}
