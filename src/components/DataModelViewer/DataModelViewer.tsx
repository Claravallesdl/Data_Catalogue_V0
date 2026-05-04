import React, { useState, useEffect } from 'react';
import { Search, Key, Table as TableIcon, ChevronRight, Layout, Database, Globe } from 'lucide-react';
import { TableInfo, ColumnInfo } from '../../types';
import { DATA_MODEL_SCHEMA } from '../../services/dataModelSchema';
import { dataModelTranslations } from './dataModelTranslations';
import './DataModelViewer.css';

const getDBThemeClass = (name: string) => {
  const base = name.toLowerCase().replace(/\s+/g, '-');
  return `theme-${base}`;
};

export const DataModelViewer: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es' | 'ca'>('en');
  const [selectedDBName, setSelectedDBName] = useState<string>(DATA_MODEL_SCHEMA[0].name);
  const [selectedTable, setSelectedTable] = useState<TableInfo>(DATA_MODEL_SCHEMA[0].tables[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [translatedColumns, setTranslatedColumns] = useState<(ColumnInfo & { label?: string })[]>([]);
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});

  // Fetch table counts for the sidebar
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`./api/data/summary_${language}.json`);
        if (response.ok) {
          const counts = await response.json();
          setTableCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching table counts:', error);
      }
    };
    fetchCounts();
  }, [language]);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoadingTranslations(true);
      try {
        const tableName = selectedTable.name.toLowerCase().replace(/\s+/g, '_');
        const response = await fetch(`./api/data/${tableName}_${language}.json`);
        if (!response.ok) throw new Error('Translation not found');
        const fullData = await response.json();
        
        // Extract columns from the array structure in the JSON files
        let data: (ColumnInfo & { label?: string })[] = [];
        if (Array.isArray(fullData)) {
          const entry = fullData.find(item => item.name === tableName || item.name === `${tableName}_${language}`);
          data = entry ? entry.columns : (fullData[0]?.columns || []);
        } else if (fullData && fullData.columns) {
          data = fullData.columns;
        }

        // Use JSON columns as base, merge with schema metadata if available
        const merged = data.map((transCol: ColumnInfo & { label?: string }) => {
          const origCol = selectedTable.columns.find(c => c.name === transCol.name);
          return {
            ...origCol, // Default/Schema metadata (isPK, isFK)
            ...transCol, // Translated data (label, description, type)
            isPK: transCol.name === 'dem_sap' || (origCol?.isPK ?? false)
          };
        });
        
        setTranslatedColumns(merged);
      } catch (error) {
        console.warn(`Could not load translations for ${selectedTable.name} in ${language}. Falling back to default schema.`);
        setTranslatedColumns(selectedTable.columns);
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    fetchTranslations();
  }, [selectedTable.name, language, selectedTable.columns]);

  const t = dataModelTranslations[language];

  const allDBs = [
    ...DATA_MODEL_SCHEMA,
    { name: 'Omics data', tables: [] },
    { name: 'Images', tables: [] }
  ];

  const selectedDB = allDBs.find(db => db.name === selectedDBName) || allDBs[0];
  const dbThemeClass = getDBThemeClass(selectedDB.name);

  const filteredTables = selectedDB.tables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isComingSoon = selectedDB.name === 'Omics data' || selectedDB.name === 'Images';

  const columnsToShow = translatedColumns;

  return (
    <div className={`model-viewer-container ${dbThemeClass}`}>
      {/* Header section */}
      <div className="model-viewer-header">
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.2em]">Data Model</h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                {(['en', 'es', 'ca'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded text-[9px] font-black transition-all uppercase tracking-tighter
                      ${language === lang 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {dataModelTranslations[lang].language_label}
                  </button>
                ))}
              </div>

              {/* DB Tabs */}
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                {allDBs.map(db => {
                  const themeClass = getDBThemeClass(db.name);
                  const isActive = selectedDB.name === db.name;
                  
                  // Translate name if possible
                  let displayName = db.name;
                  if (db.name === 'Omics data') displayName = t.category_omics;
                  if (db.name === 'Images') displayName = t.category_images;
                  if (db.name === 'Oncoclinical') displayName = t.category_onco_clinical;
                  if (db.name === 'OncoPharma') displayName = t.category_onco_pharma;
                  if (db.name === 'Prescreening') displayName = t.category_prescreening;
                  if (db.name === 'ClinicalTrials') displayName = t.category_clinical_trials;

                  return (
                    <button
                      key={db.name}
                      onClick={() => {
                        setSelectedDBName(db.name);
                        if (db.tables.length > 0) {
                          setSelectedTable(db.tables[0]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all border uppercase tracking-tight ${themeClass}
                        ${isActive 
                          ? `bg-theme border-transparent text-white shadow-md` 
                          : `bg-white border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50`}`}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="table-sidebar">
          {isComingSoon ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center bg-slate-50/50">
               <div className="space-y-3 opacity-30">
                 <Globe size={40} className="mx-auto text-slate-400" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.coming_soon}...</p>
               </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.search_placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-1.5">
                  {filteredTables.map(table => (
                    <button
                      key={table.name}
                      onClick={() => setSelectedTable(table)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border group text-left
                        ${selectedTable.name === table.name 
                          ? `bg-theme-light border-theme text-theme` 
                          : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${selectedTable.name === table.name ? `bg-theme text-white shadow-md` : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                        <TableIcon size={14} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-[11px] font-black uppercase tracking-tight truncate ${selectedTable.name === table.name ? 'text-theme' : 'text-slate-700'}`}>
                          {table.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {tableCounts[table.name.toLowerCase().replace(/\s+/g, '_')] || 0} {t.variables_suffix}
                        </p>
                      </div>
                      {selectedTable.name === table.name && <ChevronRight size={14} className="opacity-50 text-theme" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {isComingSoon ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Database size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-300 uppercase tracking-tighter mb-2">{t.coming_soon}</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Integrating extended datasets for oncology research</p>
            </div>
          ) : (
            <>
              {/* Database Strip */}
              <div className={`bg-theme px-8 py-2.5 text-white flex items-center shadow-sm relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.2),transparent)]"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Database size={12} strokeWidth={3} className="text-white ring-4 ring-white/10 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">{selectedDB.name}</span>
                </div>
              </div>

              <div className="px-8 py-6 border-b border-slate-50 bg-white text-left">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedTable.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-2xl italic">
                      {selectedTable.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                      <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-white">
                        <Key size={10} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{t.pk_label}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white">
                        <Layout size={10} />
                      </div>
                      <span className="text-[9px] font-black text-blue-700 uppercase tracking-tight">{t.fk_label}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.label_col}</th>
                      <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.variable_col}</th>
                      <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.type_col}</th>
                      <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.description_col}</th>
                      <th className="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.keys_col}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isLoadingTranslations ? (
                       <tr>
                         <td colSpan={5} className="py-12 text-center">
                           <div className="flex flex-col items-center justify-center text-slate-300 gap-2 animate-pulse">
                             <Database size={32} strokeWidth={1} />
                             <p className="text-[10px] font-black uppercase tracking-widest">Loading translations...</p>
                           </div>
                         </td>
                       </tr>
                    ) : columnsToShow.length > 0 ? (
                      columnsToShow.map((col: ColumnInfo & { label?: string }, idx: number) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors text-left">
                          <td className="py-4 px-4">
                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{col.label || '-'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-[11px] text-slate-700 uppercase tracking-tight group-hover:text-theme transition-colors`}>[{col.name}]</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-bold text-slate-500 font-mono border border-slate-200">
                              {col.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{col.description}</p>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center gap-1">
                              {col.isPK && (
                                <div className="w-6 h-6 bg-amber-500 text-white rounded-md flex items-center justify-center shadow-sm" title="Primary Key">
                                  <Key size={12} />
                                </div>
                              )}
                              {col.isFK && (
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center shadow-sm" title="Foreign Key">
                                  <Layout size={12} />
                                </div>
                              )}
                              {!col.isPK && !col.isFK && <span className="text-slate-300">-</span>}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                            <Layout size={32} strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-widest">No columns documented yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
