import React, { useState, useMemo, useEffect } from 'react';
import { FilterState } from '../../types';
import { PRIMARY_TUMORS, SEXES, AGE_RANGES, BIOPSY_SITES, TYPES, TREATMENTS, OMICS_DATA, MOLECULAR_INFO, IMAGE_TYPES } from '../../constants';
import { ChevronDown, Search, X, Maximize2, Minimize2, Info } from 'lucide-react';
import './Sidebar.css';

interface FilterSectionProps {
  title: string;
  items: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  multi?: boolean;
  extra?: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, items, selected, onChange, isOpen, onToggle, multi = true, extra }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const parseItem = (item: string) => {
    const match = item.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { label: match[1], info: match[2] };
    }
    return { label: item, info: null };
  };

  const getDisplayLabel = React.useCallback((item: string) => {
    if (item === 'Met') return 'Metastatic Tumor Biopsy';
    if (item === 'Prim') return 'Primary Tumor Biopsy';
    const { label } = parseItem(item);
    return label.replace(/_/g, ' ');
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      getDisplayLabel(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery, getDisplayLabel]);

  const toggleItem = (item: string) => {
    if (multi) {
      if (selected.includes(item)) {
        onChange(selected.filter(i => i !== item));
      } else {
        onChange([...selected, item]);
      }
    } else {
      onChange(selected.includes(item) ? [] : [item]);
    }
  };

  return (
    <div className="mb-0.5 border-b border-slate-50 last:border-0 pb-0.5">
      <button 
        onClick={onToggle}
        className="section-button flex items-center justify-between w-full text-left py-2 px-2 group"
      >
        <span className={`section-title flex items-center gap-2 transition-colors ${selected.length > 0 ? 'text-brand' : ''}`}>
          {title}
          {selected.length > 0 && (
            <span className="badge-primary px-1.5 py-0.5 rounded-md text-[8px] font-black shadow-sm">
              {selected.length}
            </span>
          )}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={14} className="text-slate-300 group-hover:text-primary-400" />
        </div>
      </button>
      
      {isOpen && (
        <div className="pt-1 px-2 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {extra && <div className="mb-4">{extra}</div>}
          
          {items.length > 8 && (
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
              <input
                type="text"
                placeholder={`Filter ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-8 pr-7 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-400 font-medium text-slate-700"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          <div className={`space-y-0.5 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1`}>
            {filteredItems.map(item => (
              <React.Fragment key={item}>
                <label 
                  className={`flex items-center group cursor-pointer py-1.5 px-2 rounded-md transition-all ${selected.includes(item) ? 'bg-primary-50/50' : 'hover:bg-slate-50'}`}
                >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => toggleItem(item)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer opacity-0 absolute z-10"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selected.includes(item) ? 'badge-primary border-brand shadow-sm' : 'bg-surface border-strong group-hover:border-primary-400'}`}>
                    {selected.includes(item) && <ChevronDown size={10} className="text-white" />}
                  </div>
                </div>
                <span className={`ml-3 text-[11px] font-semibold leading-tight truncate transition-colors ${selected.includes(item) ? 'text-brand' : 'text-main group-hover:text-slate-900'}`}>
                  {getDisplayLabel(item)}
                </span>
                {parseItem(item).info && (
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveInfo(activeInfo === item ? null : item);
                      }}
                      className={`p-1 rounded-full hover:bg-slate-200 transition-colors ${activeInfo === item ? 'text-brand bg-slate-100' : 'text-slate-300'}`}
                    >
                      <Info size={12} />
                    </button>
                  </div>
                )}
              </label>
              {activeInfo === item && parseItem(item).info && (
                <div className="mx-2 mb-2 p-2 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {parseItem(item).info}
                </div>
              )}
            </React.Fragment>
          ))}
            {filteredItems.length === 0 && (
              <p className="text-[10px] text-slate-400 font-medium text-center py-4 italic">No matches found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string[] | string) => void;
  onReset: () => void;
  autoExpand?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onReset, autoExpand = false }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tumor: autoExpand,
    sex: autoExpand,
    age: autoExpand,
    site: autoExpand,
    type: autoExpand,
    treatment: autoExpand,
    omics: autoExpand,
    molecular: autoExpand,
    images: autoExpand
  });

  useEffect(() => {
    if (autoExpand) {
      setOpenSections({
        tumor: true, sex: true, age: true, site: true, type: true, treatment: true, omics: true, molecular: true, images: true
      });
    }
  }, [autoExpand]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isAnyOpen = Object.values(openSections).some(v => v === true);

  const handleToggleAll = () => {
    const newState = !isAnyOpen;
    setOpenSections({
      tumor: newState,
      sex: newState,
      age: newState,
      site: newState,
      type: newState,
      treatment: newState,
      omics: newState,
      molecular: newState,
      images: newState
    });
  };

  const LogicToggle = ({ filterKey, value }: { filterKey: keyof FilterState, value: 'any' | 'all' }) => (
    <div className="logic-toggle-container flex flex-col gap-2 p-1 rounded-lg">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2 pt-1">Match Logic</p>
      <div className="flex bg-slate-200/50 p-1 rounded-md gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onFilterChange(filterKey, 'any'); }}
          className={`logic-button ${value === 'any' ? 'logic-button-inactive' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Any (OR)
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onFilterChange(filterKey, 'all'); }}
          className={`logic-button ${value === 'all' ? 'logic-button-active' : 'text-slate-500 hover:text-slate-700'}`}
        >
          All (AND)
        </button>
      </div>
    </div>
  );

  return (
    <aside className="sidebar-container w-72 fixed left-0 top-16 bottom-0 p-6 overflow-hidden z-40 flex flex-col shadow-sm">
      <div className="flex flex-col gap-5 mb-6 flex-shrink-0">
        <div className="px-1">
          <h1 className="sidebar-title text-base leading-tight">
            Data Catalogue
          </h1>
        </div>

        <div className="flex items-center px-1">
          <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex-shrink-0">
            Filters
          </span>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleToggleAll}
              className="flex items-center gap-1 py-1 px-2 text-[8px] font-black text-slate-600 hover:text-brand bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-all uppercase tracking-tighter"
            >
              {isAnyOpen ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
              {isAnyOpen ? "Collapse All" : "Expand All"}
            </button>
            
            <button 
              onClick={onReset}
              className="py-1 px-2 text-[8px] font-black text-slate-600 hover:text-brand bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-all uppercase tracking-widest"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 -mr-2">
        <FilterSection 
          title="Primary Tumor" 
          items={PRIMARY_TUMORS} 
          selected={filters.primaryTumors}
          onChange={(val) => onFilterChange('primaryTumors', val)}
          isOpen={openSections.tumor}
          onToggle={() => toggleSection('tumor')}
        />

        <FilterSection 
          title="Treatment" 
          items={TREATMENTS} 
          selected={filters.treatments}
          onChange={(val) => onFilterChange('treatments', val)}
          isOpen={openSections.treatment}
          onToggle={() => toggleSection('treatment')}
          extra={<LogicToggle filterKey="treatmentLogic" value={filters.treatmentLogic} />}
        />

        <FilterSection 
          title="Biological Sex" 
          items={SEXES} 
          selected={filters.sex}
          onChange={(val) => onFilterChange('sex', val)}
          isOpen={openSections.sex}
          onToggle={() => toggleSection('sex')}
        />

        <FilterSection 
          title="Age Range" 
          items={AGE_RANGES} 
          selected={filters.ageRanges}
          onChange={(val) => onFilterChange('ageRanges', val)}
          isOpen={openSections.age}
          onToggle={() => toggleSection('age')}
        />

        <FilterSection 
          title="Biopsy Site" 
          items={BIOPSY_SITES} 
          selected={filters.biopsySites}
          onChange={(val) => onFilterChange('biopsySites', val)}
          isOpen={openSections.site}
          onToggle={() => toggleSection('site')}
        />

        <FilterSection 
          title="Biopsy Origin" 
          items={TYPES} 
          selected={filters.types}
          onChange={(val) => onFilterChange('types', val)}
          isOpen={openSections.type}
          onToggle={() => toggleSection('type')}
        />

        <FilterSection 
          title="Omics Data" 
          items={OMICS_DATA} 
          selected={filters.omicsData}
          onChange={(val) => onFilterChange('omicsData', val)}
          isOpen={openSections.omics}
          onToggle={() => toggleSection('omics')}
          extra={<LogicToggle filterKey="omicsLogic" value={filters.omicsLogic} />}
        />

        <FilterSection 
          title="Molecular Information" 
          items={MOLECULAR_INFO} 
          selected={filters.molecularInfo}
          onChange={(val) => onFilterChange('molecularInfo', val)}
          isOpen={openSections.molecular}
          onToggle={() => toggleSection('molecular')}
          extra={<LogicToggle filterKey="molecularLogic" value={filters.molecularLogic} />}
        />

        <FilterSection 
          title="Images" 
          items={IMAGE_TYPES} 
          selected={filters.images}
          onChange={(val) => onFilterChange('images', val)}
          isOpen={openSections.images}
          onToggle={() => toggleSection('images')}
          extra={<LogicToggle filterKey="imagesLogic" value={filters.imagesLogic} />}
        />
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 flex-shrink-0">
      </div>
    </aside>
  );
};
