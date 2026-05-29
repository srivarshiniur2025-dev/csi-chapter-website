import { Search } from 'lucide-react';
import type { ResourceCategory } from '../../lib/platformContent';
import { RESOURCE_CATEGORIES } from '../../lib/platformContent';
import './ResourcesToolbar.css';

interface ResourcesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: ResourceCategory;
  onCategoryChange: (cat: ResourceCategory) => void;
  resultCount: number;
  categories?: ResourceCategory[];
}

export default function ResourcesToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  resultCount,
  categories = [...RESOURCE_CATEGORIES],
}: ResourcesToolbarProps) {
  return (
    <div className="res-toolbar" role="search">
      <label className="res-toolbar__search">
        <Search size={16} strokeWidth={1.5} aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources, domains, topics…"
          aria-label="Search resources"
        />
      </label>
      <p className="res-toolbar__count" aria-live="polite">
        {resultCount} resource{resultCount === 1 ? '' : 's'}
      </p>
      <div className="res-toolbar__cats" role="tablist" aria-label="Resource categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={`res-toolbar__cat${category === cat ? ' res-toolbar__cat--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
