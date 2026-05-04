import React from 'react';
import { FilterState } from '../../types';
import { X } from 'lucide-react';
import './FilterTags.css';

interface FilterTagsProps {
  filters: FilterState;
  onRemove: (key: keyof FilterState, value: string) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({ filters, onRemove }) => {
  const activeTags: { key: keyof FilterState; value: string; label: string }[] = [];

  const getFilterConfig = (key: string) => {
    switch(key) {
      case 'primaryTumors': return { prefix: 'T:', className: 'tag-tumor' };
      case 'sex': return { prefix: 'S:', className: 'tag-sex' };
      case 'ageRanges': return { prefix: 'A:', className: 'tag-age' };
      case 'biopsySites': return { prefix: 'L:', className: 'tag-site' };
      case 'types': return { prefix: 'O:', className: 'tag-type' };
      case 'treatments': return { prefix: 'Rx:', className: 'tag-treatment' };
      default: return { prefix: '', className: 'tag-default' };
    }
  };

  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(val => {
        activeTags.push({ 
          key: key as keyof FilterState, 
          value: val, 
          label: val
        });
      });
    }
  });

  if (activeTags.length === 0) return (
    <div className="flex items-center gap-2 text-[9px] text-muted font-black uppercase tracking-widest">
      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
      No active filters
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 overflow-hidden max-h-8">
      {activeTags.slice(0, 5).map((tag) => {
        const config = getFilterConfig(tag.key);
        return (
          <div 
            key={`${tag.key}-${tag.value}`}
            className={`filter-tag-base ${config.className}`}
          >
            <span className="tag-prefix">
              {config.prefix}
            </span>
            <span className="tag-value">{tag.value.replace(/\s*\(.*?\)$/, '').replace(/_/g, ' ')}</span>
            <button 
              onClick={() => onRemove(tag.key, tag.value)}
              className="ml-0.5 p-0.5 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={8} />
            </button>
          </div>
        );
      })}
      {activeTags.length > 5 && (
        <span className="text-[9px] font-black text-muted bg-surface-muted px-1.5 py-0.5 rounded-md uppercase border border-subtle shadow-sm">
          +{activeTags.length - 5} more
        </span>
      )}
    </div>
  );
};
