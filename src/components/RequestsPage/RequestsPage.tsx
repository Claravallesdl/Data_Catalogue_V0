import React, { useState, useRef } from 'react';
import { RequestReviewModal } from '../RequestReviewModal/RequestReviewModal';
import { Database, Bookmark, Clock, CheckCircle, XCircle, ExternalLink, Search, Trash2, Calendar, RotateCcw, X, FileText, ClipboardList } from 'lucide-react';
import { SavedQuery, FilterState, HierarchyField, RequestStatus, DataRequest, MyPetition, RequestedData } from '../../types';
import './RequestsPage.css';

interface RequestsPageProps {
  onLoadQuery: (filters: FilterState, hierarchy: HierarchyField[]) => void;
  savedQueries: SavedQuery[];
  setSavedQueries: React.Dispatch<React.SetStateAction<SavedQuery[]>>;
  incomingRequests: DataRequest[];
  myPetitions: MyPetition[];
  setMyPetitions: React.Dispatch<React.SetStateAction<MyPetition[]>>;
  onApprove: (id: string) => void;
  onReject: (id: string, justification: string) => void;
  onSelectPetition: (petition: MyPetition) => void;
  onEditPetition: (petition: MyPetition) => void;
  onNavigate: (tab: string) => void;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({ 
  onLoadQuery, 
  savedQueries, 
  setSavedQueries, 
  incomingRequests, 
  myPetitions, 
  onApprove, 
  onReject, 
  onSelectPetition,
  onEditPetition, 
  onNavigate 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'petitions' | 'queries'>('incoming');
  const [search, setSearch] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  
  // Undo state
  const [lastDeletedQuery, setLastDeletedQuery] = useState<{ query: SavedQuery, index: number } | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const config: Record<RequestStatus, { className: string; icon: React.ElementType }> = {
      pending: { className: 'status-pending', icon: Clock },
      approved: { className: 'status-approved', icon: CheckCircle },
      rejected: { className: 'status-rejected', icon: XCircle },
      expired: { className: 'status-muted', icon: Clock },
      draft: { className: 'status-muted', icon: Bookmark },
    };
    const { className, icon: Icon } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${className}`}>
        <Icon size={10} />
        {status}
      </span>
    );
  };

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

  const handleDeleteQuery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = savedQueries.findIndex(q => q.id === id);
    if (index === -1) return;

    const queryToDelete = savedQueries[index];
    setLastDeletedQuery({ query: queryToDelete, index });
    setSavedQueries(prev => prev.filter(q => q.id !== id));
    
    // Show toast
    setShowUndoToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowUndoToast(false);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (lastDeletedQuery) {
      setSavedQueries(prev => {
        const newQueries = [...prev];
        newQueries.splice(lastDeletedQuery.index, 0, lastDeletedQuery.query);
        return newQueries;
      });
      setLastDeletedQuery(null);
      setShowUndoToast(false);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    }
  };

  const filteredQueries = savedQueries.filter(q => 
    q.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReviewRequest = (request: DataRequest) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedRequest(null);
    setIsReviewModalOpen(false);
  };

  const getRequestedDataSummary = (data: RequestedData) => {
    const summary: string[] = [];
    if (data.patientDemographics && data.patientDemographics.length > 0) summary.push('Demographics');
    if (data.patientFirstVisit && data.patientFirstVisit.length > 0) summary.push('First Visit');
    if (data.biopsyClinical && data.biopsyClinical.length > 0) summary.push('Biopsy Clinical');
    if (data.treatmentHistory && data.treatmentHistory.length > 0) summary.push('Treatment History');
    if (data.clinicalTrials && data.clinicalTrials.length > 0) summary.push('Clinical Trials');
    if (data.omicsData && data.omicsData.length > 0) summary.push('Omics Data');
    if (data.molecularInfo && data.molecularInfo.length > 0) summary.push('Molecular Info');
    return summary;
  };

  return (
    <div className="requests-container">
      {/* Sub-Header / Tabs */}
      <div className="requests-header">
        <div className="max-w-6xl mx-auto px-8 pt-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1 text-left">
              <h1 className="workspace-title">
                My Workspace
              </h1>
              <p className="text-xs font-medium text-slate-400 max-w-md">Centralized management for your cohort discovery, data access petitions, and collaborative requests.</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-6 pr-6 border-r border-slate-100">
                <div className="text-right">
                  <p className="text-sm font-bold text-main">{incomingRequests.length}</p>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Pending Review</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-main">{myPetitions.length}</p>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Active Petitions</p>
                </div>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input 
                  type="text" 
                  placeholder="Search workspace..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <button 
              onClick={() => setActiveSubTab('incoming')}
              className={`subtab-button ${activeSubTab === 'incoming' ? 'subtab-active' : 'subtab-inactive'}`}
            >
              <Database size={14} className={activeSubTab === 'incoming' ? 'text-blue-600' : ''} />
              Incoming Requests
              {incomingRequests.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${activeSubTab === 'incoming' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveSubTab('petitions')}
              className={`subtab-button ${activeSubTab === 'petitions' ? 'subtab-active' : 'subtab-inactive'}`}
            >
              <ClipboardList size={14} className={activeSubTab === 'petitions' ? 'text-blue-600' : ''} />
              My Petitions
              {myPetitions.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${activeSubTab === 'petitions' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {myPetitions.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveSubTab('queries')}
              className={`subtab-button ${activeSubTab === 'queries' ? 'subtab-active' : 'subtab-inactive'}`}
            >
              <Bookmark size={14} className={activeSubTab === 'queries' ? 'text-blue-600' : ''} />
              Saved Queries
              {savedQueries.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${activeSubTab === 'queries' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {savedQueries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {activeSubTab === 'petitions' && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => onNavigate('catalogue')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                <FileText size={12} /> New Data Request
              </button>
            </div>
          )}

          {activeSubTab === 'incoming' && (
            <div className="grid grid-cols-1 gap-6">
              {incomingRequests.length > 0 ? (
                incomingRequests.map((req) => (
                  <div key={req.id} className="request-card group">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 text-left">
                        <div className="flex gap-6">
                          <div className="w-1 h-12 bg-brand rounded-full flex-shrink-0" />
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-main uppercase tracking-tight leading-none">{req.title}</h4>
                              <StatusBadge status={req.status} />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                              <span className="text-brand font-bold">{req.requester}</span>
                              <span className="flex items-center gap-1.5"><Calendar size={12} /> {req.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleReviewRequest(req)} className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-white shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                            Review Request
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
                        <div className="lg:col-span-7 space-y-4">
                          <h5 className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Research Justification</h5>
                          <p className="text-sm font-medium text-main leading-relaxed italic border-l-2 border-subtle pl-4">
                            "{req.justification}"
                          </p>
                        </div>
                        <div className="lg:col-span-5 space-y-4">
                          <h5 className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Requested Data Scope</h5>
                          <p className="text-sm font-bold text-main leading-relaxed">
                            {getRequestedDataSummary(req.requestedData).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <Database size={40} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">No incoming requests</p>
                  <p className="text-xs text-slate-300 mt-2">New requests will appear here for your review.</p>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'petitions' && (
            <div className="grid grid-cols-1 gap-6">
              {myPetitions.length > 0 ? (
                myPetitions.map((pet) => (
                  <div key={pet.id} className="request-card group">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 text-left">
                        <div className="flex gap-6">
                          <div className="w-1 h-12 bg-indigo-600 rounded-full flex-shrink-0" />
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-main uppercase tracking-tight leading-none">{pet.title}</h4>
                              <StatusBadge status={pet.status} />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><Calendar size={12} /> Submitted on {pet.date}</span>
                              <span className="text-brand font-bold">Est. Review: 4 Days</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {pet.status === 'draft' && (
                            <button onClick={() => onEditPetition(pet)} className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all">
                              Edit Draft
                            </button>
                          )}
                          <button onClick={() => onSelectPetition(pet)} className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-white shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
                        <div className="lg:col-span-7 space-y-4">
                          <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Research Justification</h5>
                          <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-indigo-100 pl-4">
                            "{pet.justification}"
                          </p>
                        </div>
                        <div className="lg:col-span-5 space-y-4">
                          <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Requested Data Scope</h5>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            {getRequestedDataSummary(pet.requestedData).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <ClipboardList size={40} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">No petitions submitted</p>
                  <button onClick={() => onNavigate('catalogue')} className="mt-6 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all">
                    Start Cohort Discovery
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'queries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <div key={query.id} className="request-card group relative overflow-hidden flex flex-col min-h-[240px]">
                    <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-10">
                      <button 
                        onClick={(e) => handleDeleteQuery(query.id, e)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete saved query"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="p-8 flex flex-col gap-6 flex-1 text-left">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">Saved Configuration</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 tracking-tight leading-tight pr-10">{query.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {query.date}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Filters</h5>
                        <div className="space-y-2">
                           {Object.entries(query.filters).map(([k, v]) => {
                             if (Array.isArray(v) && v.length > 0) {
                               const config = getFilterConfig(k);
                               return (
                                 <div key={k} className="flex items-baseline gap-2">
                                   <span className="text-[9px] font-bold text-muted uppercase min-w-[24px]">{config.prefix}</span>
                                   <span className="text-[11px] font-bold text-main">
                                     {v.map(val => val.replace(/_/g, ' ')).join(', ')}
                                   </span>
                                 </div>
                               );
                             }
                             return null;
                           })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-6 border-t border-slate-50 mt-auto">
                        <button 
                          onClick={() => onLoadQuery(query.filters, query.hierarchy)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                        >
                          <ExternalLink size={14} /> Load Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <Bookmark size={40} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">No saved queries found</p>
                  <p className="text-xs text-slate-300 mt-2">Save your filter configurations in the catalogue to see them here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Undo Toast */}
      {showUndoToast && lastDeletedQuery && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="undo-toast px-6 py-4 rounded-xl shadow-2xl flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <RotateCcw size={14} />
                 </div>
                 <div className="flex flex-col text-left">
                    <p className="text-xs font-bold uppercase tracking-tight">Query Deleted</p>
                    <p className="text-[10px] text-slate-400 font-medium">"{lastDeletedQuery.query.name}" removed.</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                 <button 
                    onClick={handleUndoDelete}
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                 >
                    Undo
                 </button>
                 <button 
                    onClick={() => setShowUndoToast(false)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                 >
                    <X size={14} />
                 </button>
              </div>
           </div>
        </div>
      )}
      <RequestReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        request={selectedRequest}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
};
