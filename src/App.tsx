import React, { useState, useMemo, useRef } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SummaryBox } from './components/SummaryBox/SummaryBox';
import { SunburstChart } from './components/SunburstChart/SunburstChart';
import { DataTable } from './components/DataTable/DataTable';
import { FilterTags } from './components/FilterTags/FilterTags';
import { ProfilePage } from './components/ProfilePage/ProfilePage';
import { SettingsPage } from './components/SettingsPage/SettingsPage';
import { RequestsPage } from './components/RequestsPage/RequestsPage';

import { HowItWorksPage } from './components/HowItWorksPage/HowItWorksPage';
import { LandingPage } from './components/LandingPage/LandingPage';
import { DataRequestPage, RequestDraft } from './components/DataRequestPage/DataRequestPage';
import { PetitionDetailModal } from './components/PetitionDetailModal/PetitionDetailModal';
import { DataModelViewer } from './components/DataModelViewer/DataModelViewer';
import './App.css';
import { MyPetition, DataRequest, RequestStatus } from './types';
import { FilterState, ViewMode, HierarchyField, SavedQuery, HierarchyNode } from './types';
import * as d3 from 'd3';
import { MOCK_RECORDS, MOCK_SAVED_QUERIES, MOCK_INCOMING_REQUESTS, MOCK_MY_PETITIONS } from '../services/mockData';
import { 
  LayoutGrid, Table as TableIcon, Layers, Info, 
  AlertCircle, Database, Bookmark, Check, ArrowRight, X, Save, Filter,
  FileText, Dna, ClipboardList, Pill, Search, Microscope, Image as ImageIcon
} from 'lucide-react';

export interface AppConfig {
  autoExpand: boolean;
  highDensity: boolean;
  showLabels: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  anonymousExport: boolean;
  defaultExport: string;
}



const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [appConfig, setAppConfig] = useState<AppConfig>({
    autoExpand: false,
    highDensity: false,
    showLabels: true,
    emailNotifs: true,
    pushNotifs: true,
    anonymousExport: false,
    defaultExport: 'CSV'
  });

  const [filters, setFilters] = useState<FilterState>({
    primaryTumors: [],
    sex: [],
    ageRanges: [],
    biopsySites: [],
    types: [],
    treatments: [],
    omicsData: [],
    molecularInfo: [],
    images: [],
    treatmentLogic: 'any',
    omicsLogic: 'any',
    molecularLogic: 'any',
    imagesLogic: 'any'
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Sunburst);
  const [activeHierarchy, setActiveHierarchy] = useState<HierarchyField[]>(['primaryTumor', 'treatment']);
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(MOCK_SAVED_QUERIES);
  
  // Save Dialog State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [queryNameToSave, setQueryNameToSave] = useState('');
  
  // Feedback states
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showSubmitToast, setShowSubmitToast] = useState(false);
  const [lastSavedName, setLastSavedName] = useState('');
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);

  // Data Request State
  const [requestDraft, setRequestDraft] = useState<RequestDraft | null>(null);
  const [showDraftToast, setShowDraftToast] = useState(false);
  const [myPetitions, setMyPetitions] = useState<MyPetition[]>(MOCK_MY_PETITIONS);
  const [selectedPetition, setSelectedPetition] = useState<MyPetition | null>(null);
  const [editingPetition, setEditingPetition] = useState<MyPetition | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<DataRequest[]>(MOCK_INCOMING_REQUESTS);
  const [hoveredNode, setHoveredNode] = useState<d3.HierarchyRectangularNode<HierarchyNode> | null>(null);
  const [previousTab, setPreviousTab] = useState('home');

  // Total unique patients in the clinical database is 18
  const totalUniquePatients = 57290;

  const filteredData = useMemo(() => {
    return MOCK_RECORDS.filter(record => {
      const matchTumor = filters.primaryTumors.length === 0 || filters.primaryTumors.includes(record.primaryTumor);
      const matchSex = filters.sex.length === 0 || filters.sex.includes(record.gender);
      const matchAge = filters.ageRanges.length === 0 || filters.ageRanges.includes(record.rangeAge);
      const matchSite = filters.biopsySites.length === 0 || filters.biopsySites.includes(record.biopsySite);
      const matchType = filters.types.length === 0 || filters.types.includes(record.type);
      
      const matchOmics = filters.omicsData.length === 0 || (() => {
        if (filters.omicsLogic === 'all') {
          return filters.omicsData.every(o => record.omicsData.includes(o));
        } else {
          return filters.omicsData.some(o => record.omicsData.includes(o));
        }
      })();

      const matchMolecular = filters.molecularInfo.length === 0 || (() => {
        if (filters.molecularLogic === 'all') {
          return filters.molecularInfo.every(m => record.molecularInfo.includes(m));
        } else {
          return filters.molecularInfo.some(m => record.molecularInfo.includes(m));
        }
      })();

      const matchImages = filters.images.length === 0 || (() => {
        if (filters.imagesLogic === 'all') {
          return filters.images.every(idx => record.images.includes(idx));
        } else {
          return filters.images.some(idx => record.images.includes(idx));
        }
      })();
      
      const matchTreatment = filters.treatments.length === 0 || (() => {
        const patientTreatments = record.treatment.split(',').map(t => t.trim());
        if (filters.treatmentLogic === 'all') {
          return filters.treatments.every(t => patientTreatments.includes(t));
        } else {
          return filters.treatments.some(t => patientTreatments.includes(t));
        }
      })();

      return matchTumor && matchSex && matchAge && matchSite && matchType && matchTreatment && matchOmics && matchMolecular && matchImages;
    });
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string[] | string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      primaryTumors: [],
      sex: [],
      ageRanges: [],
      biopsySites: [],
      types: [],
      treatments: [],
      omicsData: [],
      molecularInfo: [],
      images: [],
      treatmentLogic: 'any',
      omicsLogic: 'any',
      molecularLogic: 'any',
      imagesLogic: 'any'
    });
    setActiveHierarchy(['primaryTumor', 'treatment']);
  };

  const toggleHierarchyField = (field: HierarchyField) => {
    setActiveHierarchy(prev => {
      const isCurrentlyActive = prev.includes(field);
      if (isCurrentlyActive) {
        return prev.filter(f => f !== field);
      } else {
        if (prev.length >= 4) return prev; 
        return [...prev, field];
      }
    });
  };

  const generateDynamicTitle = () => {
    const parts: string[] = [];
    if (filters.types.length === 1) {
      parts.push(filters.types[0] === 'Met' ? 'Metastatic' : 'Primary');
    } else if (filters.types.length > 1) {
      parts.push('Mixed Origin');
    }
    if (filters.sex.length === 1) {
      parts.push(filters.sex[0]);
    }
    if (filters.primaryTumors.length === 1) {
      parts.push(filters.primaryTumors[0].charAt(0).toUpperCase() + filters.primaryTumors[0].slice(1).replace(/_/g, ' '));
    } else if (filters.primaryTumors.length > 1) {
      parts.push('Multi-tumor');
    }
    if (parts.length === 0) {
      parts.push('Full');
    }
    parts.push('Cohort');
    if (filters.ageRanges.length > 0) {
      const isSenior = filters.ageRanges.every(r => ['45-59', '60-74', '75+'].includes(r)) && filters.ageRanges.length >= 2;
      const isYoung = filters.ageRanges.every(r => ['0-18', '19-29', '30-44'].includes(r)) && filters.ageRanges.length >= 2;
      if (isSenior) parts.push('> 45y');
      else if (isYoung) parts.push('< 45y');
      else if (filters.ageRanges.length === 1) parts.push(`(${filters.ageRanges[0]})`);
    }
    if (filters.treatments.length === 1) {
      parts.push(`w/ ${filters.treatments[0].split(' ')[0]}`);
    } else if (filters.treatments.length > 1) {
      parts.push('w/ Multi-therapy');
    }
    const title = parts.join(' ');
    const maxLength = 50;
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const openSaveModal = () => {
    setQueryNameToSave(generateDynamicTitle());
    setIsSaveModalOpen(true);
    setTimeout(() => saveInputRef.current?.select(), 100);
  };

  const handleSaveConfirmed = () => {
    const finalName = queryNameToSave.trim() || `Query ${new Date().toLocaleDateString()}`;
    const newQuery: SavedQuery = {
      id: `q_${Date.now()}`,
      name: finalName,
      date: new Date().toISOString().split('T')[0],
      filters: { ...filters },
      hierarchy: [...activeHierarchy]
    };
    setSavedQueries(prev => [newQuery, ...prev]);
    setLastSavedName(finalName);
    setIsSaveModalOpen(false);
    setShowSaveToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowSaveToast(false);
    }, 4000);
  };

  const handleRequestSubmit = (details: Partial<DataRequest>) => {
    if (editingPetition) {
      const updatedPetition = { ...editingPetition, ...details, status: 'pending' as RequestStatus } as MyPetition;
      setMyPetitions(myPetitions.map(p => p.id === editingPetition.id ? updatedPetition : p));
      setEditingPetition(null);
    } else {
    const newPetition: MyPetition = {
      id: `req_${Date.now()}`,
      requester: 'Current User',
      title: details.title || '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      justification: details.justification || '',
      requestedData: details.requestedData!,
      cohortFilters: details.cohortFilters,
      patientCount: details.patientCount,
      availabilitySummary: details.availabilitySummary,
      
      registrationTime: details.registrationTime || '',
      applicationDate: details.applicationDate || '',
      applicantDetails: details.applicantDetails || { name: '', email: '', group: '', isMulticenter: false },
      researchersInvolved: details.researchersInvolved || [],
      projectBriefSummary: details.projectBriefSummary || '',
      projectDetailedDescription: details.projectDetailedDescription || { previousWork: '', objectiveResearchApproach: '', anticipatedResults: '' }
    };
    const newIncomingRequest: DataRequest = { ...newPetition };

    setMyPetitions(prev => [newPetition, ...prev]);
    setIncomingRequests(prev => [newIncomingRequest, ...prev]);
    }
    setActiveTab('workspace');
    setShowSubmitToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowSubmitToast(false);
    }, 4000);
  };

  const handleSaveDraft = (draft: RequestDraft) => {
    if (editingPetition) {
      const updatedPetition = { ...editingPetition, ...draft };
      setMyPetitions(myPetitions.map(p => p.id === editingPetition.id ? updatedPetition : p));
      setEditingPetition(null);
    } else {
    const newPetition: MyPetition = {
      id: `draft_${Date.now()}`,
      title: draft.title || 'Untitled Draft',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      justification: draft.justification,
      requestedData: draft.requestedData,
    };
    setMyPetitions(prev => [newPetition, ...prev]);
    }
    setRequestDraft(draft);
    setActiveTab('workspace');
    setShowDraftToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowDraftToast(false);
    }, 4000);
  };

  const handleApproveRequest = (id: string) => {
    setIncomingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    setMyPetitions(prev => prev.map(pet => pet.id === id ? { ...pet, status: 'approved' } : pet));
  };

  const handleRejectRequest = (id: string, justification: string) => {
    console.log(`Rejecting request ${id} with justification: ${justification}`);
    setIncomingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    setMyPetitions(prev => prev.map(pet => pet.id === id ? { ...pet, status: 'rejected' } : pet));
  };

  const handleLoadQuery = (queryFilters: FilterState, queryHierarchy: HierarchyField[]) => {
    setFilters(queryFilters);
    setActiveHierarchy(queryHierarchy);
    setActiveTab('catalogue');
  };

  const handleSunburstClick = (nodeFilters: Partial<Record<keyof FilterState, string>>) => {
    if (Object.keys(nodeFilters).length === 0) {
      handleReset();
      return;
    }
    setFilters(prev => {
      const newFilters = { ...prev };
      Object.entries(nodeFilters).forEach(([key, value]) => {
        const filterKey = key as keyof FilterState;
        if (Array.isArray(newFilters[filterKey])) {
          // If the value contains commas (joined from array fields or treatment string), split it
          if (['treatments', 'omicsData', 'molecularInfo'].includes(filterKey) && value.includes(',')) {
            (newFilters[filterKey] as string[]) = value.split(',').map(v => v.trim());
          } else {
            (newFilters[filterKey] as string[]) = [value];
          }
        }
      });
      return newFilters;
    });
  };

  const handleEditPetition = (petition: MyPetition) => {
    setEditingPetition(petition);
    setRequestDraft({
      title: petition.title,
      justification: petition.justification,
      requestedData: petition.requestedData,
    });
    setPreviousTab(activeTab);
    setActiveTab('request-data');
  };

  const hierarchyOptions: { label: string; value: HierarchyField }[] = [
    { label: 'Primary Tumor', value: 'primaryTumor' },
    { label: 'Biological Sex', value: 'gender' },
    { label: 'Age at Diagnosis', value: 'rangeAge' },
    { label: 'Biopsy Site', value: 'biopsySite' },
    { label: 'Biopsy Origin', value: 'type' },
    { label: 'Treatment', value: 'treatment' },
    { label: 'Omics Data', value: 'omicsData' },
    { label: 'Molecular Info', value: 'molecularInfo' },
    { label: 'Images', value: 'images' }
  ];

    const activeFilterEntries = Object.entries(filters).filter(([, val]) => Array.isArray(val) && val.length > 0);
  const atLimit = activeHierarchy.length >= 4;

  const dbs = [
    { id: 'OC', icon: FileText, name: 'OncoClinical', desc: 'Clinical data curated by Odyssey.', patientCount: 20915 },
    { id: 'GC', icon: Pill, name: 'OncoPharma', desc: 'Treatment history for oncology patients at Vall d\'Hebron (doses, drug types, etc.).', patientCount: 40353 },
    { id: 'TC', icon: ClipboardList, name: 'Clinical Trials', desc: 'Trial metadata (inclusion criteria, etc.) and patient enrollment tracking status.', patientCount: 20396 },
    { id: 'PS', icon: Dna, name: 'Prescreening', desc: 'Molecular test results from patients in the Prescreening project.', patientCount: 18133 },
    { id: 'OM', icon: Microscope, name: 'Omics data', desc: 'Genomic and transcriptomic data.', patientCount: 12450 },
    { id: 'IM', icon: ImageIcon, name: 'Images', desc: 'Radiology and pathology images linked to clinical cases.', patientCount: 8900 }
  ];

  return (
    <div className={`h-screen bg-app-main flex flex-col overflow-hidden font-inter ${appConfig.highDensity ? 'text-xs' : ''}`}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex flex-1 pt-16 overflow-hidden">


        {activeTab === 'catalogue' && (
          <>
            <Sidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={handleReset} 
              autoExpand={appConfig.autoExpand}
            />

            <main className="ml-72 flex-1 flex flex-col overflow-hidden bg-surface relative">
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Hierarchy Selector */}
                <div className={`flex-shrink-0 border-b border-subtle flex items-center justify-between gap-6 ${appConfig.highDensity ? 'px-4 py-2' : 'px-6 py-3'}`}>
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <Layers size={12} /> Hierarchy <span className="text-muted/60">({activeHierarchy.length}/4)</span>:
                      </span>
                      {atLimit && (
                        <div className="flex items-center gap-1 text-[8px] font-bold text-warning uppercase tracking-tight animate-pulse">
                          <AlertCircle size={10} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {hierarchyOptions.map(option => {
                        const isActive = activeHierarchy.includes(option.value);
                        const disabled = !isActive && atLimit;
                        return (
                          <button
                            key={option.value}
                            disabled={disabled}
                            onClick={() => toggleHierarchyField(option.value)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border uppercase tracking-tight 
                              ${isActive 
                                ? 'badge-primary border-brand shadow-md' 
                                : disabled 
                                  ? 'bg-surface-muted border-subtle text-muted cursor-not-allowed' 
                                  : 'bg-surface border-strong text-main hover:border-brand hover:text-brand'}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 bg-surface-muted p-1 rounded-xl border border-strong shadow-inner h-fit">
                    <button onClick={() => setViewMode(ViewMode.Sunburst)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tight ${viewMode === ViewMode.Sunburst ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-main'}`}>
                      <LayoutGrid size={13} /> Sunburst
                    </button>
                    <button onClick={() => setViewMode(ViewMode.Table)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tight ${viewMode === ViewMode.Table ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-main'}`}>
                      <TableIcon size={13} /> Dataset
                    </button>
                  </div>
                </div>

                {/* Top Action Bar: Filters & Buttons */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-subtle bg-surface-muted">
                  <FilterTags filters={filters} onRemove={(key, val) => {
                    setFilters(prev => {
                      const currentVal = prev[key as keyof FilterState];
                      if (!Array.isArray(currentVal)) return prev;
                      return { ...prev, [key as keyof FilterState]: currentVal.filter(v => v !== val) };
                    });
                  }} />
                  <div className="flex items-center gap-2">
                    <button onClick={openSaveModal} className="group flex items-center gap-2 px-4 py-1.5 btn-ghost rounded-lg text-[10px] font-black shadow-sm uppercase tracking-wider">
                      <Bookmark size={12} className="group-hover:scale-110 transition-transform" /> Save Query
                    </button>
                    <button onClick={() => { setPreviousTab('catalogue'); setActiveTab('request-data'); }} className="flex items-center gap-2 px-4 py-1.5 btn-primary rounded-lg text-[10px] font-black transition-all shadow-md uppercase tracking-wider">
                      <FileText size={12} /> Request Data
                    </button>
                  </div>
                </div>

                {/* Main Visualization Area */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 relative overflow-hidden flex flex-col pr-0">
                    {viewMode === ViewMode.Sunburst && (
                      <SunburstChart 
                        data={filteredData} 
                        filters={filters} 
                        activeHierarchy={activeHierarchy}
                        forceLabels={appConfig.showLabels}
                        onHover={setHoveredNode}
                        onNodeClick={handleSunburstClick}
                      />
                    )}
                    {viewMode === ViewMode.Table && <DataTable data={filteredData} />}
                  </div>

                  <div className={`${appConfig.highDensity ? 'w-56' : 'w-64'} flex-shrink-0 border-l border-subtle bg-surface-muted/10 p-5 flex flex-col gap-4`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <Info size={14} className="text-brand" />
                      <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Cohort Insights</span>
                    </div>
                    <SummaryBox 
                      allRecords={MOCK_RECORDS} 
                      filteredRecords={filteredData} 
                      dashboardIntegrated 
                      hoveredNode={hoveredNode}
                      activeHierarchy={activeHierarchy}
                    />
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {activeTab === 'lake' && (
          <main className="flex-1 overflow-y-auto bg-app-main p-6">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
              
              {/* Unified VHIO-LAKE Information Box */}
              <div className="bg-surface-dark rounded-2xl overflow-hidden shadow-2xl border border-dark-subtle relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none scale-150 translate-x-1/4 -translate-y-1/4">
                  <Database size={200} strokeWidth={0.5} className="text-white-pure" />
                </div>
                
                <div className="py-6 px-8 relative z-10">
                  {/* Header */}
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold uppercase tracking-tight text-white-pure italic">VHIO-LAKE</h1>
                      <div className="flex gap-10">
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-white-pure">{totalUniquePatients.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Total Patients</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-brand">{dbs.length}</span>
                          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Data Sources</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 w-full">
                      <div className="space-y-2">
                        <p className="text-[14px] text-white-pure leading-relaxed">
                          VHIO-LAKE is a datalake consisting of six complementary databases: OncoClinical, OncoPharma, Clinical Trials, Prescreening, Omics data, and Images.
                        </p>
                        <p className="text-[14px] text-white-pure leading-relaxed opacity-80">
                          These systems are linked to provide a comprehensive view of the patient, connecting clinical, pharmacological, and molecular data.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('catalogue')}
                        className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-dark-muted hover:text-white-pure transition-colors group px-3 py-1.5 border border-dark-subtle bg-dark-hover/50 hover:bg-dark-hover shadow-xl"
                      >
                        <Search size={12} className="group-hover:text-brand transition-colors" />
                        Interactive Exploration
                      </button>
                    </div>
                  </div>

                  {/* Databases Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dbs.map((db, idx) => {
                      const cardClass = `card-db-${idx % 6}`;
                      const iconClass = `card-db-${idx % 6}-icon`;
                      
                      return (
                         <div key={db.id} className={`p-4 rounded-xl border transition-all duration-300 group flex flex-col h-full ${cardClass}`}>
                           <div className="flex items-center justify-between mb-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
                               <db.icon size={16} />
                             </div>
                             <div className="text-right">
                               <p className="text-[11px] font-bold text-white-pure">{db.patientCount.toLocaleString()}</p>
                               <p className="text-[7px] font-bold opacity-50 uppercase tracking-widest">Cohort</p>
                             </div>
                           </div>
                           
                           <div className="flex-1">
                             <h3 className="text-[11px] font-bold text-white-pure uppercase tracking-wider mb-1 group-hover:translate-x-1 transition-transform">{db.name}</h3>
                             <p className="text-[10px] text-dark-muted leading-tight font-medium">
                               {db.desc}
                             </p>
                           </div>
                         </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtle Visualization Bar */}
                <div className="h-1 w-full bg-surface-dark flex">
                   <div className="h-full bg-brand" style={{ width: '25%' }}></div>
                   <div className="h-full bg-accent-rose" style={{ width: '25%' }}></div>
                   <div className="h-full bg-accent-amber" style={{ width: '25%' }}></div>
                   <div className="h-full bg-accent-emerald" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Data Model Viewer Section */}
              <div className="min-h-[600px] flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DataModelViewer />
              </div>
            </div>

            <style>{`
              .bg-grid-slate-800 {
                background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                background-size: 20px 20px;
              }
            `}</style>
          </main>
        )}

        {activeTab === 'workspace' && (
          <RequestsPage 
            onLoadQuery={handleLoadQuery} 
            savedQueries={savedQueries}
            setSavedQueries={setSavedQueries}
            myPetitions={myPetitions}
            setMyPetitions={setMyPetitions}
            incomingRequests={incomingRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onSelectPetition={setSelectedPetition}
            onEditPetition={handleEditPetition}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'request-data' && (
          <DataRequestPage 
            onBack={() => { setActiveTab(previousTab); setEditingPetition(null); }}
            onSubmit={handleRequestSubmit}
            onSaveDraft={handleSaveDraft}
            filters={filters}
            filteredRecords={filteredData}
            draft={requestDraft}
          />
        )}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'home' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'how-it-works' && <HowItWorksPage />}
        

        {activeTab === 'settings' && (
          <SettingsPage 
            config={appConfig} 
            onChange={(key, val) => setAppConfig(prev => ({ ...prev, [key]: val }))} 
          />
        )}
      </div>

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 toast-container/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-strong overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="px-8 pt-8 pb-4">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 badge-light rounded-xl flex items-center justify-center">
                          <Bookmark size={20} />
                       </div>
                       <div>
                          <h3 className="text-base font-black text-main uppercase tracking-tight">Save Search Query</h3>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Workspace Archival</p>
                       </div>
                    </div>
                    <button onClick={() => setIsSaveModalOpen(false)} className="p-2 text-muted hover:text-main transition-colors">
                      <X size={20} />
                    </button>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">Query Title</label>
                       <input ref={saveInputRef} type="text" value={queryNameToSave} onChange={(e) => setQueryNameToSave(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveConfirmed()} placeholder="Enter a descriptive name..." className="w-full bg-surface-muted border border-strong rounded-xl py-3 px-4 text-xs font-bold text-main focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-brand transition-all" />
                    </div>
                    <div className="bg-surface-muted rounded-xl p-5 border border-subtle">
                       <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Filter size={12} className="text-brand" /> Active Filters Summary</p>
                       <div className="space-y-3">
                         {activeFilterEntries.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                             {activeFilterEntries.map(([key, val]) => (
                               <div key={key} className="flex flex-col gap-1">
                                 <span className="text-[8px] font-black text-muted uppercase tracking-tighter">{key.replace('primaryTumors', 'Tumor').replace('sex', 'Sex').replace('treatments', 'Rx').replace('biopsySites', 'Site').replace('ageRanges', 'Age')}:</span>
                                 <div className="flex flex-wrap gap-1">{(val as string[]).map(v => <span key={v} className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm bg-surface-muted text-main`}>{v.replace(/_/g, ' ')}</span>)}</div>
                               </div>
                             ))}
                           </div>
                         ) : <div className="flex flex-col items-center py-4 text-muted"><Database size={24} className="opacity-20 mb-2" /><p className="text-[9px] font-black uppercase tracking-widest">Full Cohort (No Filters)</p></div>}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-surface-muted/50 border-t border-subtle flex items-center justify-end gap-3 mt-4">
                 <button onClick={() => setIsSaveModalOpen(false)} className="px-6 py-2.5 rounded-lg text-[10px] font-black text-muted uppercase tracking-widest hover:bg-surface-muted transition-all">Cancel</button>
                 <button onClick={handleSaveConfirmed} disabled={!queryNameToSave.trim()} className="flex items-center gap-2 px-8 py-2.5 btn-primary text-white-pure rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 disabled:opacity-50 disabled:shadow-none"><Save size={14} /> Confirm & Save</button>
              </div>
           </div>
        </div>
      )}

       {showSubmitToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="toast-container px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg toast-success-icon flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Request Submitted Successfully</p><p className="text-[10px] text-muted font-medium">Your data access request is now under review by the DAC.</p></div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <button onClick={() => { setActiveTab('workspace'); setShowSubmitToast(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-success hover:text-success/80 transition-colors">View <ArrowRight size={12} /></button>
                 <button onClick={() => setShowSubmitToast(false)} className="p-1 text-muted hover:text-white-pure transition-colors"><X size={14} /></button>
              </div>
           </div>
        </div>
      )}

      {showSaveToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="toast-container px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg toast-info-icon flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Query Saved Successfully</p><p className="text-[10px] text-muted font-medium">"{lastSavedName}" added to My Workspace.</p></div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <button onClick={() => { setActiveTab('workspace'); setShowSaveToast(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand hover:text-brand/80 transition-colors">View <ArrowRight size={12} /></button>
                 <button onClick={() => setShowSaveToast(false)} className="p-1 text-muted hover:text-white-pure transition-colors"><X size={14} /></button>
              </div>
           </div>
        </div>
      )}

      <PetitionDetailModal 
        petition={selectedPetition}
        onClose={() => setSelectedPetition(null)}
      />

      {showDraftToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="toast-container px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg toast-warning-icon flex items-center justify-center"><Save size={18} strokeWidth={3} /></div>
                 <div className="flex flex-col"><p className="text-xs font-black uppercase tracking-tight">Draft Saved Successfully</p><p className="text-[10px] text-muted font-medium">Your request draft has been saved.</p></div>
              </div>
              <button onClick={() => setShowDraftToast(false)} className="p-1 text-muted hover:text-white-pure transition-colors"><X size={14} /></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;