import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, ChevronLeft, ChevronRight, Plus, Trash2, Info } from 'lucide-react';
import { FilterState, RequestedData, DashboardRecord, GroupedAvailability, ResearcherInvolved, DataRequest, ColumnInfo } from '../../types';
import { DataRequestDocument } from '../DataRequestDocument/DataRequestDocument';
import './DataRequestPage.css';

export interface RequestDraft {
  title: string;
  justification: string;
  requestedData: RequestedData;
  cohortFilters?: FilterState;
  patientCount?: number;
  availabilitySummary?: GroupedAvailability[];
  
  // New fields
  applicantDetails: {
    name: string;
    email: string;
    group: string;
    isMulticenter: boolean;
    centerDetails?: string;
    principalInvestigator?: string;
  };
  researchersInvolved: ResearcherInvolved[];
  projectBriefSummary: string;
  projectDetailedDescription: {
    previousWork: string;
    objectiveResearchApproach: string;
    anticipatedResults: string;
  };
}

interface DataRequestPageProps {
  onBack: () => void;
  onSubmit: (details: DataRequest) => void;
  onSaveDraft: (draft: RequestDraft) => void;
  filters: FilterState;
  filteredRecords: DashboardRecord[];
  draft?: RequestDraft | null;
}

const TextFilterSummary: React.FC<{ filters: FilterState, patientCount: number }> = ({ filters, patientCount }) => {
  const labelMap: Record<string, string> = {
    primaryTumors: 'Primary Tumor',
    sex: 'Biological Sex',
    ageRanges: 'Age Range',
    biopsySites: 'Biopsy Site',
    types: 'Biopsy Origin',
    treatments: 'Treatments',
    omicsData: 'Omics Data',
    molecularInfo: 'Molecular info',
    images: 'Images'
  };

  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => Array.isArray(value) && value.length > 0 && labelMap[key])
    .map(([key, value]) => ({ 
      key, 
      label: labelMap[key], 
      values: value as string[] 
    }));

  if (activeFilters.length === 0) {
    return <p className="text-sm text-brand italic">No filters applied. Requesting full cohort of {patientCount.toLocaleString()} patients.</p>;
  }

  return (
    <div className="text-xs text-brand font-medium space-y-1.5">
      <p className="flex items-center gap-1.5">
        <strong className="font-black text-primary-700">{patientCount.toLocaleString()} patients</strong> 
        <span>matching criteria:</span>
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pl-1">
        {activeFilters.map(({ key, label, values }) => (
          <div key={key} className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{label}:</span>
            <span className="text-[11px] font-bold">{values.map(v => v.replace(/_/g, ' ')).join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange, disabled, description }: { id: string, label: React.ReactNode, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean, description?: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group/checkbox flex items-center">
      <label 
        htmlFor={id} 
        className={`flex items-center justify-between text-sm font-normal transition-all p-1.5 rounded-md flex-1 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group hover:bg-surface-muted'}`}
      >
          <div className="flex items-center flex-1">
            <input 
              id={id} 
              type="checkbox" 
              checked={checked} 
              onChange={onChange} 
              disabled={disabled}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed" 
            />
            <span className={`ml-3 truncate ${checked ? 'text-brand' : 'text-slate-700'} ${!disabled && 'group-hover:text-brand'}`}>
              {label}
            </span>
          </div>
      </label>
      {description && !disabled && (
        <div className="relative ml-1 pr-1">
          <button 
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(!showTooltip);
            }}
            className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
          >
            <Info size={12} />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 border border-slate-800 text-white text-[10px] rounded-lg shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-200">
              <p className="font-bold mb-1 uppercase tracking-widest text-[8px] text-blue-400">Description</p>
              <p className="leading-relaxed opacity-90">{description}</p>
              <div className="absolute top-full right-3 -mt-1 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CollapsibleCategory = ({ 
  title, 
  children, 
  isOpen, 
  onToggle,
  availability
}: { 
  title: string, 
  children: React.ReactNode, 
  isOpen: boolean, 
  onToggle: () => void,
  availability?: { count: number, total: number, percent: number, unit: string }
}) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm mb-2">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-white hover:bg-surface-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">{title}</span>
          {availability && (
            <span className="availability-badge">
              {availability.count}/{availability.total} {availability.unit} ({availability.percent}%)
            </span>
          )}
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <Plus size={14} className={isOpen ? 'hidden' : 'block'} />
          <div className={`${isOpen ? 'block' : 'hidden'} w-3 h-0.5 bg-slate-400 rounded-full`} />
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export const DataRequestPage: React.FC<DataRequestPageProps> = ({ onBack, onSubmit, onSaveDraft, filters, filteredRecords, draft }) => {
  // Navigation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [justification, setJustification] = useState('');
  const [requestedData, setRequestedData] = useState<RequestedData>({
    patientDemographics: [],
    patientFirstVisit: [],
    previousTumor: [],
    biopsyClinical: [],
    treatmentHistory: [],
    clinicalTrials: [],
    omicsData: [],
    molecularInfo: [],
    images: []
  });

  // New Formal Fields
  const [registrationTime] = useState(new Date().toLocaleString());
  const [applicationDate] = useState(new Date().toLocaleString());
  
  const [applicantDetails, setApplicantDetails] = useState({
    name: '',
    email: '',
    group: '',
    isMulticenter: false,
    centerDetails: '',
    principalInvestigator: ''
  });

  const [researchersInvolved, setResearchersInvolved] = useState<ResearcherInvolved[]>([
    { name: '', function: '', email: '', isDataContact: false }
  ]);

  const [projectBriefSummary, setProjectBriefSummary] = useState('');
  const [projectDetailedDescription, setProjectDetailedDescription] = useState({
    previousWork: '',
    objectiveResearchApproach: '',
    anticipatedResults: ''
  });

  const [variableDescriptions, setVariableDescriptions] = useState<Record<string, string>>({});
  const [variableLabels, setVariableLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const hardcodedDescriptions: Record<string, string> = {
      'WGS': 'Whole Genome Sequencing',
      'WES': 'Whole Exome Sequencing',
      'RNA-sq': 'RNA Sequencing',
      'scRNA-sq': 'Single-cell RNA Sequencing',
      'miRNA-seq': 'MicroRNA Sequencing',
      'ATAC-seq': 'Assay for Transposase-Accessible Chromatin',
      'ChIP -seq': 'Chromatin Immunoprecipitation Sequencing',
      'CNA': 'Copy Number Alterations',
      'Mutation': 'Single Nucleotide Variants and Indels',
      'TMB': 'Tumor Mutational Burden',
      'HRD': 'Homologous Recombination Deficiency',
      'Overexpression': 'Increased transcript or protein levels',
      'Fusion': 'Gene fusion events',
      'VIGEx': 'Gene expression signature for immune response',
      'Tumor Cellularity Quantification': 'Percentage of tumor cells in sample',
      'MSI Status': 'Microsatellite Instability',
      'Amplification': 'Specific gene amplification',
      'Rearrangement': 'Chromosomal rearrangements',
      'SAP': 'Clinical Information System ID',
      'Name and Surnames': 'Patient identification',
      'Date of first visit': 'First recorded clinical encounter date',
      'Age at first visit': 'Patient age at the time of first visit',
      'Physicians (DMEAL)': 'Attending medical team records',
      'Origin (VH/External)': 'Patient origin (Vall d\'Hebron or External)',
      'Hospital Reference': 'Referring medical center',
      'Comunidad autonoma': 'Autonomous community',
      'Conciero SNS': 'National Health System agreement status',
      'Reference type': 'Type of referral',
      'Intention of the first visit': 'Clinical goal of the visit',
      'Type of patient': 'New or returning patient classification'
    };
    setVariableDescriptions(prev => ({ ...prev, ...hardcodedDescriptions }));
  }, []);

  useEffect(() => {
    const fetchDescriptions = async () => {
      const tablesToFetch = ['antineoplasic_therapy', 'demographics'];
      const descriptions: Record<string, string> = {};
      const labels: Record<string, string> = {};

      for (const table of tablesToFetch) {
        try {
          const tableName = table.toLowerCase().replace(/\s+/g, '_');
          const response = await fetch(`./api/data/${tableName}_en.json`);
          if (response.ok) {
            const data = await response.json();
            let columns: (ColumnInfo & { label?: string, description?: string })[] = [];
            
            if (Array.isArray(data)) {
              const entry = data.find(item => item.name === tableName || item.name === `${tableName}_en`);
              columns = entry ? entry.columns : (data[0]?.columns || []);
            } else if (data && data.columns) {
              columns = data.columns;
            }
            
            columns.forEach((col) => {
              descriptions[col.name] = col.description || '';
              labels[col.name] = col.label || col.name;
              
              if (col.label) {
                descriptions[col.label] = col.description || '';
              }
            });
          }
        } catch (err) {
          console.error(`Error fetching descriptions for ${table}:`, err);
        }
      }
      setVariableDescriptions(prev => ({ ...prev, ...descriptions }));
      setVariableLabels(prev => ({ ...prev, ...labels }));
    };

    fetchDescriptions();
  }, []);

  const recordsByPatient = useMemo(() => {
    const map = new Map<string, DashboardRecord[]>();
    filteredRecords.forEach(r => {
      const list = map.get(r.sap);
      if (!list) {
        map.set(r.sap, [r]);
      } else {
        list.push(r);
      }
    });
    return map;
  }, [filteredRecords]);

  const patientCount = recordsByPatient.size;

  const options = useMemo(() => {
    const base = {
      patientDemographics: [
        'SAP', 'Name and Surnames', 'Date of Birth', 'Gender'
      ],
      patientFirstVisit: [
        'Date of first visit', 'Age at first visit', 'Physicians (DMEAL)', 'Origin (VH/External)',
        'Hospital Reference', 'Province', 'Comunidad autonoma', 'Conciero SNS',
        'Reference type', 'Intention of the first visit', 'Type of patient'
      ],
      previousTumor: [
        'Location of the previous tumor', 'Other Location previous tumors', 'Tumor site', 
        'Year of previous tumor diagnosis'
      ],
      biopsyClinical: [
        'Biopsy ID', 'BX Code', 'VHIOPAT BX Code', 'Biopsy site', 'Collection date', 
        'Met or prim', 'Disease status at collection', 'Subtype VHIOPAT'
      ],
      treatmentHistory: [
        'Scheme', 'Scheme scheduled date', 'Administration date', 'Intention', 'Cycle',
        'Day in cycle', 'Drug', 'Drug type', 'Dose'
      ],
      clinicalTrials: [
        'Trial ID', 'Phase', 'Start date', 'End date', 'Last odse', 'End reason'
      ],
      omicsData: [
        'WGS', 'WES', 'RNA-sq', 'scRNA-sq', 'miRNA-seq', 'ATAC-seq', 'ChIP -seq'
      ],
      molecularInfo: [
        'CNA', 'Mutation', 'TMB', 'HRD', 'Overexpression', 'Fusion', 'VIGEx',
        'Tumor Cellularity Quantification', 'MSI Status', 'Amplification', 'Rearrangement'
      ],
      images: [
        'CT Scan', 'MRI', 'PET Scan', 'X-Ray', 'Pathology Slide'
      ]
    };
    return base;
  }, []);

  const cohortStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {
      patientDemographics: { '': patientCount },
      patientFirstVisit: { '': patientCount },
      previousTumor: { '': 0 },
      biopsyClinical: { '': 0 },
      treatmentHistory: { '': 0 },
      clinicalTrials: { '': 0 },
      omicsData: { '': 0 },
      molecularInfo: { '': 0 },
      images: { '': 0 }
    };

    // Initialize all sub-options to ensure they are available for selection
    options.patientDemographics.forEach(o => stats.patientDemographics[o] = patientCount);
    options.patientFirstVisit.forEach(o => stats.patientFirstVisit[o] = patientCount);
    options.previousTumor.forEach(o => stats.previousTumor[o] = 0); // Re-calculated below
    options.biopsyClinical.forEach(o => stats.biopsyClinical[o] = 0);
    options.treatmentHistory.forEach(o => stats.treatmentHistory[o] = 0);
    options.clinicalTrials.forEach(o => stats.clinicalTrials[o] = 0);
    options.omicsData.forEach(o => stats.omicsData[o] = 0);
    options.molecularInfo.forEach(m => stats.molecularInfo[m] = 0);
    options.images.forEach(i => stats.images[i] = 0);

    for (const [sap, patientRecords] of recordsByPatient.entries()) {
      const sapHash = parseInt(sap) || 0;
      
      if (sapHash % 4 === 0) {
        stats.previousTumor['']++;
        options.previousTumor.forEach(o => stats.previousTumor[o]++);
      }
      
      if (patientRecords.length > 0) {
        stats.biopsyClinical['']++;
        options.biopsyClinical.forEach(o => stats.biopsyClinical[o]++);
      }

      if (patientRecords.some(r => r.treatment && r.treatment !== 'UNK')) {
        stats.treatmentHistory['']++;
        options.treatmentHistory.forEach(o => stats.treatmentHistory[o]++);
      }

      if (sapHash % 5 < 2) {
        stats.clinicalTrials['']++;
        options.clinicalTrials.forEach(o => stats.clinicalTrials[o]++);
      }

      const hasAnyOmic = patientRecords.some(r => r.omicsData && r.omicsData.length > 0);
      if (hasAnyOmic) stats.omicsData['']++;
      options.omicsData.forEach(o => {
        if (patientRecords.some(r => r.omicsData?.includes(o))) stats.omicsData[o]++;
      });

      const hasAnyMol = patientRecords.some(r => r.molecularInfo && r.molecularInfo.length > 0);
      if (hasAnyMol) stats.molecularInfo['']++;
      options.molecularInfo.forEach(m => {
        if (patientRecords.some(r => r.molecularInfo?.includes(m))) stats.molecularInfo[m]++;
      });

      const hasAnyImg = patientRecords.some(r => r.images && r.images.length > 0);
      if (hasAnyImg) stats.images['']++;
      options.images.forEach(i => {
        if (patientRecords.some(r => r.images?.includes(i))) stats.images[i]++;
      });
    }
    return stats;
  }, [recordsByPatient, options, patientCount]);

  const getAvailability = useCallback((category: keyof RequestedData, option: string): { percent: number, count: number, total: number, level: 'patient' | 'biopsy', unit: string } => {
    if (patientCount === 0) return { percent: 0, count: 0, total: 0, level: 'patient', unit: 'p.' };
    const count = cohortStats[category]?.[option || ''] || 0;
    return { 
      percent: Math.round((count / patientCount) * 100), 
      count, 
      total: patientCount, 
      level: 'patient', 
      unit: 'p.' 
    };
  }, [patientCount, cohortStats]);

  useEffect(() => {
    if (draft) {
      setTitle(draft.title || '');
      setJustification(draft.justification || '');
      setRequestedData(draft.requestedData);
      setApplicantDetails(draft.applicantDetails);
      setResearchersInvolved(draft.researchersInvolved);
      setProjectBriefSummary(draft.projectBriefSummary);
      setProjectDetailedDescription(draft.projectDetailedDescription);
    }
  }, [draft]);

  const handleToggleOption = (category: keyof RequestedData, option: string) => {
    const availability = getAvailability(category, option);
    if (availability.percent === 0) return;

    setRequestedData(prev => {
      const current = prev[category] as string[];
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [category]: next };
    });
  };

  const handleSubmit = () => {
    if (title.trim() && justification.trim()) {
      onSubmit({ 
        title, 
        justification, 
        requestedData,
        cohortFilters: filters,
        patientCount,
        availabilitySummary: getGroupedSummary(),
        registrationTime,
        applicationDate,
        applicantDetails,
        researchersInvolved,
        projectBriefSummary,
        projectDetailedDescription,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString(),
        status: 'pending'
      });
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft({ 
      title, 
      justification, 
      requestedData,
      cohortFilters: filters,
      patientCount,
      availabilitySummary: getGroupedSummary(),
      applicantDetails,
      researchersInvolved,
      projectBriefSummary,
      projectDetailedDescription
    });
  };

  const handleSelectAll = (category: keyof RequestedData, sectionItems: string[]) => {
    const availableItems = sectionItems.filter(item => getAvailability(category, item).percent > 0);
    setRequestedData(prev => {
      const current = prev[category] as string[];
      const otherItems = current.filter(item => !sectionItems.includes(item));
      return {
        ...prev,
        [category]: [...otherItems, ...availableItems]
      };
    });
  };

  const handleResetCategory = (category: keyof RequestedData, sectionItems?: string[]) => {
    setRequestedData(prev => {
      if (!sectionItems) {
        return {
          ...prev,
          [category]: []
        };
      }
      const current = prev[category] as string[];
      return {
        ...prev,
        [category]: current.filter(item => !sectionItems.includes(item))
      };
    });
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const CategorySection = ({ title, category, items, isSubSection, hideAvailability, hideSelectAll, isCollapsible, sectionId }: { title: string, category: keyof RequestedData, items: string[], isSubSection?: boolean, hideAvailability?: boolean, hideSelectAll?: boolean, isCollapsible?: boolean, sectionId?: string }) => {
    const [isInternalOpen, setIsInternalOpen] = useState(false);
    
    // Logic to sync with "Expand All / Collapse All" would go here via effect if needed, 
    // but we'll use openCategories state for controlled expansion.
    const isOpen = sectionId ? openCategories.includes(sectionId) : isInternalOpen;
    const toggle = () => {
      if (sectionId) {
        toggleCategory(sectionId);
      } else {
        setIsInternalOpen(!isInternalOpen);
      }
    };

    const blockAvailability = getAvailability(category, items.length > 0 ? items[0] : '');
    const avgPercent = blockAvailability.percent;
    const avgCount = blockAvailability.count;
    const total = blockAvailability.total;
    const unit = blockAvailability.unit;

    const content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
        {items.map(item => {
          const availability = getAvailability(category, item);
          return (
            <Checkbox 
              key={item} 
              id={`${category}-${item}`} 
              label={variableLabels[item] || item} 
              checked={(requestedData[category] as string[]).includes(item)} 
              onChange={() => handleToggleOption(category, item)} 
              disabled={availability.percent === 0}
              description={variableDescriptions[item] || variableDescriptions[item.toLowerCase().replace(/ /g, '_')]}
            />
          );
        })}
      </div>
    );

    if (isCollapsible) {
      return (
        <div className={`border border-slate-100 rounded-lg overflow-hidden mb-2 ${isSubSection ? 'ml-4' : ''}`}>
          <div 
            onClick={toggle}
            className="w-full flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{title}</h4>
              {!hideAvailability && (
                <span className="availability-badge">
                  {avgCount}/{total} {unit} ({avgPercent}%)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!hideSelectAll && (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => handleSelectAll(category, items)}
                    className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Select All
                  </button>
                  <div className="w-px h-2 bg-slate-200" />
                  <button 
                    onClick={() => handleResetCategory(category, items)}
                    className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:underline"
                  >
                    Reset
                  </button>
                </div>
              )}
              <Plus size={12} className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            </div>
          </div>
          {isOpen && (
            <div className="p-3 bg-white border-t border-slate-100">
              {content}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={isSubSection ? "space-y-2 pl-4 border-l border-slate-200 my-4 first:mt-0 last:mb-0" : "space-y-2"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className={isSubSection ? "text-[10px] font-bold text-slate-500 uppercase tracking-widest" : "text-xs font-bold text-slate-900 uppercase tracking-widest"}>{title}</h4>
            {!hideAvailability && (
              <span className="availability-badge">
                {avgCount}/{total} {unit} ({avgPercent}%)
              </span>
            )}
          </div>
          {!hideSelectAll && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleSelectAll(category, items)}
                className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
              >
                Select All
              </button>
              <div className="w-px h-2 bg-slate-200" />
              <button 
                onClick={() => handleResetCategory(category, items)}
                className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>
        {content}
      </div>
    );
  };

  const getGroupedSummary = () => {
    const groups: GroupedAvailability[] = [];
    
    if (requestedData.patientDemographics.length > 0) {
      groups.push({
        title: 'Patient Demographics',
        items: requestedData.patientDemographics.map(opt => ({ label: opt, ...getAvailability('patientDemographics', opt) }))
      });
    }

    if (requestedData.patientFirstVisit.length > 0) {
      groups.push({
        title: 'First Visit Data',
        items: requestedData.patientFirstVisit.map(opt => ({ label: opt, ...getAvailability('patientFirstVisit', opt) }))
      });
    }

    if (requestedData.previousTumor.length > 0) {
      groups.push({
        title: 'Patient Clinical: Previous Tumor',
        items: requestedData.previousTumor.map(opt => ({ label: opt, ...getAvailability('previousTumor', opt) }))
      });
    }
    
    if (requestedData.biopsyClinical.length > 0) {
      groups.push({
        title: 'Biopsies: Clinical Information',
        items: requestedData.biopsyClinical.map(opt => ({ label: opt, ...getAvailability('biopsyClinical', opt) }))
      });
    }
    
    if (requestedData.treatmentHistory.length > 0) {
      groups.push({
        title: 'Treatment History',
        items: requestedData.treatmentHistory.map(opt => ({ label: opt, ...getAvailability('treatmentHistory', opt) }))
      });
    }

    if (requestedData.clinicalTrials.length > 0) {
      groups.push({
        title: 'Clinical Trials',
        items: requestedData.clinicalTrials.map(opt => ({ label: opt, ...getAvailability('clinicalTrials', opt) }))
      });
    }
    
    if (requestedData.omicsData.length > 0) {
      groups.push({
        title: 'Omics Data',
        items: requestedData.omicsData.map(opt => ({ label: opt, ...getAvailability('omicsData', opt) }))
      });
    }
    
    if (requestedData.molecularInfo.length > 0) {
      groups.push({
        title: 'Molecular Information',
        items: requestedData.molecularInfo.map(opt => ({ label: opt, ...getAvailability('molecularInfo', opt) }))
      });
    }

    if (requestedData.images.length > 0) {
      groups.push({
        title: 'Images',
        items: requestedData.images.map(opt => ({ label: opt, ...getAvailability('images', opt) }))
      });
    }
    
    return groups;
  };

  const addResearcher = () => {
    setResearchersInvolved(prev => [...prev, { name: '', function: '', email: '', isDataContact: false }]);
  };

  const removeResearcher = (index: number) => {
    setResearchersInvolved(prev => prev.filter((_, i) => i !== index));
  };

  const updateResearcher = (index: number, field: keyof ResearcherInvolved, value: string | boolean) => {
    setResearchersInvolved(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const isStepValid = (stepNum: number) => {
    if (stepNum === 1) {
      return applicantDetails.name && 
             applicantDetails.email && 
             applicantDetails.group && 
             title.trim() && 
             projectBriefSummary.trim();
    }
    if (stepNum === 2) {
      return getGroupedSummary().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3 && isStepValid(currentStep)) {
      setCurrentStep((prev: number) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev: number) => (prev - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="request-page-container">
      <div className="request-header">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Step Info */}
            <div className="flex items-center gap-6 min-w-max">
              <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
                <ChevronLeft size={18} />
              </button>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 font-medium uppercase tracking-[0.2em] leading-none mb-1">Institutional Data Access Committee (DAC)</span>
                <p className="step-title leading-none">
                  Step {currentStep} of 3: <span className="step-active ml-1">{
                    currentStep === 1 ? 'Project Details' : 
                    currentStep === 2 ? 'Requested Data' : 
                    'Formal Signing'
                  }</span>
                </p>
              </div>
            </div>
            
            {/* Center: Progress Bar Dots */}
            <div className="flex-1 flex items-center justify-center max-w-sm relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 -z-10" />
              <div 
                className="absolute top-1/2 left-0 h-px indicator-new -translate-y-1/2 -z-10 transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
              <div className="flex items-center justify-between w-full">
                {[1, 2, 3].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setCurrentStep(s as 1 | 2 | 3)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 relative group ${s <= currentStep ? (s === currentStep ? 'badge-primary ring-4 ring-primary-50' : 'badge-primary') : 'bg-white border border-slate-200 hover:border-slate-400'}`}
                    title={`Step ${s}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 min-w-max">
               {currentStep < 3 ? (
                  <>
                    <button onClick={handleSaveDraft} className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                       <Save size={12} /> Save
                    </button>
                    {currentStep > 1 && (
                      <button onClick={handlePrev} className="flex items-center justify-center px-4 py-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                         Back
                      </button>
                    )}
                    <button 
                     onClick={handleNext} 
                     disabled={!isStepValid(currentStep)}
                     className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                       Next Step <ChevronRight size={12} />
                    </button>
                  </>
               ) : (
                  <>
                    <button onClick={() => setCurrentStep(2)} className="flex items-center justify-center px-4 py-2 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                       Edit
                    </button>
                    <button onClick={handleSubmit} className="flex items-center justify-center gap-2 px-8 py-2 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                       Submit request
                    </button>
                  </>
               )}
            </div>
          </div>
        </div>
      </div>

      <main className="request-main scrollbar-thin scrollbar-thumb-slate-200">
        <div className="max-w-5xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <section className="space-y-3">
                <div className="section-header">
                  <h2 className="section-title italic">1.1 Application Dates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="form-label">Registration Time</label>
                    <div className="form-input opacity-50 cursor-not-allowed bg-slate-50">
                      {registrationTime}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="form-label">Application Date</label>
                    <div className="form-input opacity-50 cursor-not-allowed bg-slate-50">
                      {applicationDate}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="section-header">
                  <h2 className="section-title italic">1.2 Details of Main Applicant</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="form-label">Name of Main Applicant</label>
                    <input 
                      type="text" 
                      value={applicantDetails.name} 
                      onChange={(e) => setApplicantDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      value={applicantDetails.email} 
                      onChange={(e) => setApplicantDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="form-label">Group / Department</label>
                    <input 
                      type="text" 
                      value={applicantDetails.group} 
                      onChange={(e) => setApplicantDetails(prev => ({ ...prev, group: e.target.value }))}
                      placeholder="e.g. Oncology Research Group"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="form-label">Principal Investigator (PI)</label>
                    <input 
                      type="text" 
                      value={applicantDetails.principalInvestigator} 
                      onChange={(e) => setApplicantDetails(prev => ({ ...prev, principalInvestigator: e.target.value }))}
                      placeholder="Leave empty if you are the PI"
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="pt-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={applicantDetails.isMulticenter}
                      onChange={(e) => setApplicantDetails(prev => ({ ...prev, isMulticenter: e.target.checked }))}
                      className="peer h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span className="text-[11px] font-medium text-slate-600 transition-colors">Is this a multi-center data access request?</span>
                  </label>
                  
                  {applicantDetails.isMulticenter && (
                    <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="form-label">Details of relevant implied centers</label>
                      <textarea 
                        value={applicantDetails.centerDetails} 
                        onChange={(e) => setApplicantDetails(prev => ({ ...prev, centerDetails: e.target.value }))}
                        placeholder="Please list centers..."
                        className="form-input h-20"
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="section-title italic">1.3 Details of researchers involved</h2>
                  <button 
                    onClick={addResearcher}
                    className="flex items-center gap-1 px-2 py-1 border border-slate-200 text-slate-600 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    <Plus size={12} /> Add Researcher
                  </button>
                </div>
                
                <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                        <th className="px-3 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Function</th>
                        <th className="px-3 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                        <th className="px-3 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">Contact?</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {researchersInvolved.map((researcher, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-1.5">
                            <input type="text" value={researcher.name} onChange={(e) => updateResearcher(idx, 'name', e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-xs text-black p-0" />
                          </td>
                          <td className="px-3 py-1.5">
                            <input type="text" value={researcher.function} onChange={(e) => updateResearcher(idx, 'function', e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-xs text-slate-600 p-0" />
                          </td>
                          <td className="px-3 py-1.5">
                            <input type="email" value={researcher.email} onChange={(e) => updateResearcher(idx, 'email', e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-xs text-slate-600 p-0" />
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <input type="checkbox" checked={researcher.isDataContact} onChange={(e) => updateResearcher(idx, 'isDataContact', e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button onClick={() => removeResearcher(idx)} disabled={researchersInvolved.length === 1} className="p-1 text-slate-300 hover:text-red-500 disabled:opacity-0 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="section-header">
                  <h2 className="section-title italic">1.4 Project Information</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="form-label">Project Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="e.g., 'Metastatic Breast Cancer Genomic Landscape Study'" 
                      className="form-input max-w-2xl" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="form-label">Brief summary of the project <span className="text-red-500">*</span></label>
                    <p className="text-[11px] text-slate-500 italic ml-0.5 mb-1">Include purpose, which data and relevance for patients.</p>
                    <textarea 
                      value={projectBriefSummary} 
                      onChange={(e) => setProjectBriefSummary(e.target.value)} 
                      placeholder="Summarize your project..." 
                      className="form-input h-24" 
                    />
                  </div>

                  <div className="space-y-6 pt-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">Detailed Description</h3>
                    
                    <div className="space-y-1.5">
                      <label className="form-label opacity-70 italic">1. Previous work on which the project is based</label>
                      <textarea 
                        value={projectDetailedDescription.previousWork} 
                        onChange={(e) => setProjectDetailedDescription(prev => ({ ...prev, previousWork: e.target.value }))} 
                        className="form-input h-24" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="form-label opacity-70 italic">2. Objected research approach</label>
                      <textarea 
                        value={projectDetailedDescription.objectiveResearchApproach} 
                        onChange={(e) => setProjectDetailedDescription(prev => ({ ...prev, objectiveResearchApproach: e.target.value }))} 
                        className="form-input h-24" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="form-label opacity-70 italic">3. Anticipated results</label>
                      <textarea 
                        value={projectDetailedDescription.anticipatedResults} 
                        onChange={(e) => setProjectDetailedDescription(prev => ({ ...prev, anticipatedResults: e.target.value }))} 
                        className="form-input h-24" 
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col gap-1 text-left">
                    <h3 className="text-[10px] font-bold text-blue-800 tracking-[0.2em] uppercase">2. REQUESTED DATA: Cohort Summary</h3>
                    <TextFilterSummary filters={filters} patientCount={patientCount} />
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-lg border border-blue-100">{patientCount} Patients</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Variables to Request</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setOpenCategories(['demographics', 'firstVisit', 'Tumor History', 'Biopsy', 'Participation', 'Clinical Trials', 'Omics', 'Molecular'])}
                      className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Expand All
                    </button>
                    <div className="w-px h-2 bg-slate-200" />
                    <button 
                      onClick={() => setOpenCategories([])}
                      className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:underline"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <CollapsibleCategory 
                    title="Demographics" 
                    isOpen={openCategories.includes('demographics')} 
                    onToggle={() => toggleCategory('demographics')}
                    availability={getAvailability('patientDemographics', '')}
                  >
                    <CategorySection 
                      title="Demographics" 
                      category="patientDemographics" 
                      items={options.patientDemographics} 
                      hideAvailability 
                    />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="First Visit" 
                    isOpen={openCategories.includes('firstVisit')} 
                    onToggle={() => toggleCategory('firstVisit')}
                    availability={getAvailability('patientFirstVisit', '')}
                  >
                    <CategorySection 
                      title="First Visit Details" 
                      category="patientFirstVisit" 
                      items={options.patientFirstVisit} 
                      hideAvailability 
                    />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Tumor History" 
                    isOpen={openCategories.includes('Tumor History')} 
                    onToggle={() => toggleCategory('Tumor History')}
                    availability={getAvailability('previousTumor', '')}
                  >
                    <CategorySection title="Previous Tumor Record" category="previousTumor" items={options.previousTumor} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Biopsies" 
                    isOpen={openCategories.includes('Biopsy')} 
                    onToggle={() => toggleCategory('Biopsy')}
                    availability={getAvailability('biopsyClinical', '')}
                  >
                    <CategorySection title="Clinical Biopsy Data" category="biopsyClinical" items={options.biopsyClinical} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Treatment History" 
                    isOpen={openCategories.includes('Participation')} 
                    onToggle={() => toggleCategory('Participation')}
                    availability={getAvailability('treatmentHistory', '')}
                  >
                    <CategorySection title="Treatment Cycles & Response" category="treatmentHistory" items={options.treatmentHistory} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Clinical Trials" 
                    isOpen={openCategories.includes('Clinical Trials')} 
                    onToggle={() => toggleCategory('Clinical Trials')}
                    availability={getAvailability('clinicalTrials', '')}
                  >
                    <CategorySection title="Trial Details" category="clinicalTrials" items={options.clinicalTrials} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Omics Data" 
                    isOpen={openCategories.includes('Omics')} 
                    onToggle={() => toggleCategory('Omics')}
                    availability={getAvailability('omicsData', '')}
                  >
                    <CategorySection title="Available Sequencing" category="omicsData" items={options.omicsData} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Molecular Information" 
                    isOpen={openCategories.includes('Molecular')} 
                    onToggle={() => toggleCategory('Molecular')}
                    availability={getAvailability('molecularInfo', '')}
                  >
                    <CategorySection title="Tests & Panels" category="molecularInfo" items={options.molecularInfo} hideAvailability />
                  </CollapsibleCategory>

                  <CollapsibleCategory 
                    title="Images" 
                    isOpen={openCategories.includes('Images')} 
                    onToggle={() => toggleCategory('Images')}
                    availability={getAvailability('images', '')}
                  >
                    <CategorySection title="Radiology & Pathology Images" category="images" items={options.images} hideAvailability />
                  </CollapsibleCategory>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
              <div className="flex justify-between items-end mb-4 px-1 text-left">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Document Type</span>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Data Access Request</h2>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Issue Date</span>
                  <p className="text-xs font-bold text-slate-600 tracking-tight">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <DataRequestDocument 
                title={title}
                justification={justification}
                patientCount={patientCount}
                date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                status="pending"
                requestedData={requestedData}
                cohortFilters={filters}
                availabilitySummary={[
                  { 
                    title: 'Clinical', 
                    items: [
                      { ...getAvailability('patientDemographics', ''), label: 'Patient Demographics' }, 
                      { ...getAvailability('patientFirstVisit', ''), label: 'First Visit Data' }, 
                      { ...getAvailability('previousTumor', ''), label: 'Previous Tumor Record' }
                    ] 
                  },
                  { title: 'Biopsies', items: [{ ...getAvailability('biopsyClinical', ''), label: 'Biopsy Information' }] },
                  { title: 'History', items: [{ ...getAvailability('treatmentHistory', ''), label: 'Treatment History' }] },
                  { title: 'Profiling', items: [{ ...getAvailability('molecularInfo', ''), label: 'Molecular Profiling' }] }
                ]}
                groupedVariables={getGroupedSummary()}
                
                // Pass new formal fields to document
                registrationTime={registrationTime}
                applicationDate={applicationDate}
                applicantDetails={{
                  ...applicantDetails,
                  centerDetails: applicantDetails.centerDetails || ''
                }}
                researchersInvolved={researchersInvolved}
                projectBriefSummary={projectBriefSummary}
                projectDetailedDescription={projectDetailedDescription}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
