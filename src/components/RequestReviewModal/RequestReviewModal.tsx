import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, FileText } from 'lucide-react';
import { DataRequest } from '../../types';
import { DataRequestDocument } from '../DataRequestDocument/DataRequestDocument';
import './RequestReviewModal.css';

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: DataRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string, justification: string) => void;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({ isOpen, onClose, request, onApprove, onReject }) => {
  const [rejectionJustification, setRejectionJustification] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRejectionJustification('');
      setShowRejectionInput(false);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    onApprove(request.id);
    onClose();
  };

  const handleReject = () => {
    if (!showRejectionInput) {
      setShowRejectionInput(true);
    } else {
      if (rejectionJustification.trim() === '') {
        alert('Please provide a justification for rejection.');
        return;
      }
      onReject(request.id, rejectionJustification);
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-in fade-in duration-200">
      <div className="modal-content animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="modal-header">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{request.title}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submitted by {request.requester} on {request.date}</p>
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
              title={request.title}
              justification={request.justification}
              patientCount={request.patientCount || 0}
              date={request.date}
              status={request.status}
              requestedData={request.requestedData}
              cohortFilters={request.cohortFilters}
              availabilitySummary={request.availabilitySummary}
              
              // New formal fields
              registrationTime={request.registrationTime}
              applicationDate={request.applicationDate}
              applicantDetails={request.applicantDetails}
              researchersInvolved={request.researchersInvolved}
              projectBriefSummary={request.projectBriefSummary}
              projectDetailedDescription={request.projectDetailedDescription}
            />

            {showRejectionInput && (
              <div className="mt-4 space-y-1.5 animate-in fade-in duration-300 pb-2 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rejection Reason</label>
                <textarea
                  value={rejectionJustification}
                  onChange={(e) => setRejectionJustification(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                  placeholder="Provide a clear reason..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleReject} className="flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black text-amber-700 uppercase tracking-widest bg-amber-100 hover:bg-amber-200/80 transition-all">
            <AlertTriangle size={12} /> {showRejectionInput ? 'Confirm Rejection' : 'Reject'}
          </button>
          <button onClick={handleApprove} className="flex items-center gap-2 px-6 py-2 btn-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
            <Check size={12} /> Approve
          </button>
        </div>
      </div>
    </div>
  );
};
