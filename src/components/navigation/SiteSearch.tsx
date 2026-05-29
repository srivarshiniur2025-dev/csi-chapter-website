import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search, X } from 'lucide-react';
import { dispatchOpenNova, useAuth } from '../../contexts/AuthContext';
import { searchSiteIndex, type SiteIndexItem } from '../../lib/siteIndex';
import { scrollToSectionSmooth } from '../../lib/lenisScroll';
import { getNavScrollOffset } from '../../hooks/useLandingHashScroll';
import './SiteSearch.css';

const EASE = [0.22, 1, 0.36, 1] as const;

interface SiteSearchProps {
  open: boolean;
  onClose: () => void;
}

function runTarget(item: SiteIndexItem, openAuth: (tab: 'login' | 'signup') => void, openDashboard: () => void) {
  if (item.target === 'nova') {
    dispatchOpenNova();
    return;
  }
  if (item.target === 'dashboard') {
    openDashboard();
    return;
  }
  if (item.target === 'auth-signup') {
    openAuth('signup');
    return;
  }
  if (item.target === 'auth-login') {
    openAuth('login');
    return;
  }
  scrollToSectionSmooth(item.target, getNavScrollOffset());
}

export default function SiteSearch({ open, onClose }: SiteSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openAuth, openDashboard } = useAuth();

  const results = searchSiteIndex(query);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const select = useCallback(
    (item: SiteIndexItem) => {
      runTarget(item, openAuth, openDashboard);
      onClose();
    },
    [onClose, openAuth, openDashboard]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[activeIdx]) {
        e.preventDefault();
        select(results[activeIdx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx, select, onClose]);

  useEffect(() => {
    const onGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', onGlobal);
    return () => window.removeEventListener('keydown', onGlobal);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="csi-search"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          data-lenis-prevent
        >
          <button type="button" className="csi-search__backdrop" aria-label="Close search" onClick={onClose} />
          <motion.div
            className="csi-search__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search CSI platform"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="csi-search__input-row">
              <Search size={18} aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, resources, sections…"
                aria-label="Search"
                autoComplete="off"
              />
              <kbd className="csi-search__kbd" aria-hidden>
                Esc
              </kbd>
              <button type="button" className="csi-search__close" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <ul className="csi-search__results" role="listbox">
              {results.length === 0 ? (
                <li className="csi-search__empty">No matches — try “events”, “nova”, or “resources”.</li>
              ) : (
                results.map((item, i) => (
                  <li key={item.id} role="option" aria-selected={i === activeIdx}>
                    <button
                      type="button"
                      className={`csi-search__item${i === activeIdx ? ' csi-search__item--active' : ''}`}
                      onClick={() => select(item)}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <span className="csi-search__item-title">{item.title}</span>
                      {item.subtitle ? (
                        <span className="csi-search__item-sub">{item.subtitle}</span>
                      ) : null}
                      <span className="csi-search__item-cat">{item.category}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="csi-search__hint">
              <Command size={12} aria-hidden /> Navigate · Enter to open · Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Toggle search from parent; also registers Cmd/Ctrl+K globally */
export function useSiteSearchHotkey(onOpen: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpen]);
}
