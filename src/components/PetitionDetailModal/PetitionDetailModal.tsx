import React from 'react';
import { MyPetition } from '../../types';
import { X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DataRequestDocument } from '../DataRequestDocument/DataRequestDocument';
import './PetitionDetailModal.css';

interface PetitionDetailModalProps {
  petition: MyPetition | null;
  onClose: () => void;
}

export const PetitionDetailModal: React.FC<PetitionDetailModalProps> = ({ petition, onClose }) => {
  if (!petition) return null;

  const statusConfig: Record<string, { icon: React.ElementType, color: string, bgColor: string }> = {
    approved: { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    pending: { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
    rejected: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
    expired: { icon: Clock, color: 'text-slate-500', bgColor: 'bg-slate-50' },
    draft: { icon: Clock, color: 'text-slate-500', bgColor: 'bg-slate-50' },
  };

  const currentStatus = statusConfig[petition.status] || statusConfig.pending;

  return (
    <div className="petition-modal-overlay animate-in fade-in duration-200" onClick={onClose}>
      <div className="petition-modal-content animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="petition-modal-header">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${currentStatus.bgColor} rounded-lg flex items-center justify-center`}>
                <currentStatus.icon size={20} className={currentStatus.color} />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">{petition.title}</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submitted on {petition.date}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-12 py-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-4xl mx-auto space-y-6">
            <DataRequestDocument 
              title={petition.title}
              justification={petition.justification}
              patientCount={petition.patientCount || 0}
              date={petition.date}
              status={petition.status}
              requestedData={petition.requestedData}
              cohortFilters={petition.cohortFilters}
              availabilitySummary={petition.availabilitySummary}
              
              // New formal fields
              registrationTime={petition.registrationTime}
              applicationDate={petition.applicationDate}
              applicantDetails={petition.applicantDetails}
              researchersInvolved={petition.researchersInvolved}
              projectBriefSummary={petition.projectBriefSummary}
              projectDetailedDescription={petition.projectDetailedDescription}
            />
          </div>
        </div>
        <div className="petition-modal-footer">
            <button onClick={onClose} className="px-5 py-2 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">
              Close
            </button>
        </div>
      </div>
    </div>
  );
};
