import React from 'react';
import { RequestedData, FilterState, GroupedAvailability, ResearcherInvolved } from '../../types';
import './DataRequestDocument.css';

interface DataRequestDocumentProps {
  title: string;
  justification: string;
  patientCount: number;
  date: string;
  status: string;
  requestedData: RequestedData;
  cohortFilters?: FilterState;
  availabilitySummary?: GroupedAvailability[];
  groupedVariables?: { title: string; items: { label: string }[] }[];

  // New formal fields
  registrationTime?: string;
  applicationDate?: string;
  applicantDetails?: {
    name: string;
    email: string;
    group: string;
    isMulticenter: boolean;
    centerDetails: string;
    principalInvestigator: string;
  };
  researchersInvolved?: ResearcherInvolved[];
  projectBriefSummary?: string;
  projectDetailedDescription?: {
    previousWork: string;
    objectiveResearchApproach: string;
    anticipatedResults: string;
  };
}

export const DataRequestDocument: React.FC<DataRequestDocumentProps> = ({
  title,
  justification,
  patientCount,
  date,
  status,
  requestedData,
  cohortFilters,
  availabilitySummary,
  groupedVariables,
  registrationTime,
  applicationDate,
  applicantDetails,
  researchersInvolved,
  projectBriefSummary,
  projectDetailedDescription
}) => {
  const labelMap: Record<string, string> = {
    primaryTumors: 'Primary Tumor',
    sex: 'Biological Sex',
    ageRanges: 'Age Range',
    biopsySites: 'Biopsy Site',
    types: 'Biopsy Origin',
    treatments: 'Treatments',
    omicsData: 'Omics Data',
    molecularInfo: 'Molecular info'
  };

  const activeFilterEntries = cohortFilters 
    ? Object.entries(cohortFilters).filter(([key, val]) => Array.isArray(val) && val.length > 0 && labelMap[key])
    : [];

  const getFallbackGroupedVariables = () => {
    const groups: { title: string; items: { label: string }[] }[] = [];
    
    if (requestedData.patientDemographics && requestedData.patientDemographics.length > 0) {
      groups.push({
        title: 'Patient Demographics',
        items: requestedData.patientDemographics.map(opt => ({ label: opt }))
      });
    }

    if (requestedData.patientFirstVisit && requestedData.patientFirstVisit.length > 0) {
      groups.push({
        title: 'First Visit Data',
        items: requestedData.patientFirstVisit.map(opt => ({ label: opt }))
      });
    }

    if (requestedData.previousTumor && requestedData.previousTumor.length > 0) {
      groups.push({
        title: 'Patient Clinical: Previous Tumor',
        items: requestedData.previousTumor.map(opt => ({ label: opt }))
      });
    }
    
    if (requestedData.biopsyClinical.length > 0) {
      groups.push({
        title: 'Biopsies: Clinical Information',
        items: requestedData.biopsyClinical.map(opt => ({ label: opt }))
      });
    }
    
    if (requestedData.treatmentHistory.length > 0) {
      groups.push({
        title: 'Treatment History',
        items: requestedData.treatmentHistory.map(opt => ({ label: opt }))
      });
    }

    if (requestedData.clinicalTrials.length > 0) {
      groups.push({
        title: 'Clinical Trials',
        items: requestedData.clinicalTrials.map(opt => ({ label: opt }))
      });
    }
    
    if (requestedData.omicsData.length > 0) {
      groups.push({
        title: 'Omics Data',
        items: requestedData.omicsData.map(opt => ({ label: opt }))
      });
    }
    
    if (requestedData.molecularInfo.length > 0) {
      groups.push({
        title: 'Molecular Information',
        items: requestedData.molecularInfo.map(opt => ({ label: opt }))
      });
    }
    
    return groups;
  };

  const finalGroupedVariables = groupedVariables || getFallbackGroupedVariables();

  return (
    <div className="document-container">
      {/* Official Letterhead Strip */}
      <div className="h-2 bg-slate-900" />
      
      <div className="p-12 md:p-16 flex-1 space-y-16">
        {/* Header Metadata */}
        <div className="document-header-metadata">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Document Type</span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Data Access Request</h2>
            <div className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Issue Date: {date}</div>
          </div>
          <div className="text-right space-y-2">
              <div className="document-ref-badge">
                Ref: DAC-2026-{(Math.floor(Math.random() * 9000) + 1000)}
              </div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Status: {status === 'approved' ? 'Approved' : 'Pending Approval'}</p>
          </div>
        </div>

        {/* 1. General Aspects of Data Request */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="document-section-number">01</span>
            <h3 className="document-section-title">General Aspects</h3>
          </div>
          
          <div className="pl-6 space-y-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registration Time</label>
                <p className="text-[13px] font-bold text-slate-700">{registrationTime || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Application Date</label>
                <p className="text-[13px] font-bold text-slate-700">{applicationDate || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Main Applicant</label>
                <p className="text-[13px] font-bold text-slate-700">{applicantDetails?.name || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <p className="text-[13px] font-bold text-slate-700 underline">{applicantDetails?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Group / Department</label>
                <p className="text-[13px] font-bold text-slate-700">{applicantDetails?.group || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Principal Investigator</label>
                <p className="text-[13px] font-bold text-slate-700">{applicantDetails?.principalInvestigator || applicantDetails?.name || 'N/A'}</p>
              </div>
            </div>

            {applicantDetails?.isMulticenter && (
              <div className="space-y-2 pt-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Multicenter Project Details</label>
                <p className="text-[12px] text-slate-600 leading-relaxed italic">{applicantDetails.centerDetails}</p>
              </div>
            )}

            {/* Researchers Table */}
            {researchersInvolved && researchersInvolved.length > 0 && (
              <div className="space-y-3 pt-4">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Authorized Researchers Involved</label>
                <div className="overflow-hidden border border-slate-100 rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Function</th>
                        <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">Contact?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {researchersInvolved.map((r, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-[12px] font-bold text-slate-700">{r.name}</td>
                          <td className="px-4 py-2 text-[12px] text-slate-500">{r.function}</td>
                          <td className="px-4 py-2 text-[12px] text-center">
                            {r.isDataContact ? (
                              <span className="text-blue-600 font-black text-[10px] uppercase">Yes</span>
                            ) : (
                              <span className="text-slate-200">No</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Project Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="document-section-number">02</span>
            <h3 className="document-section-title">Project Details</h3>
          </div>
          <div className="pl-6 space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Project Title</label>
              <p className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{title}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Brief Summary</label>
              <p className="text-[13px] text-slate-600 leading-relaxed">{projectBriefSummary || justification}</p>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">1. Previous Work Foundation</label>
                <p className="text-[13px] text-slate-600 leading-relaxed italic">{projectDetailedDescription?.previousWork}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">2. Objected Research Approach</label>
                <p className="text-[13px] text-slate-600 leading-relaxed italic">{projectDetailedDescription?.objectiveResearchApproach}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">3. Anticipated Results</label>
                <p className="text-[13px] text-slate-600 leading-relaxed italic">{projectDetailedDescription?.anticipatedResults}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cohort Specifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="document-section-number">03</span>
            <h3 className="document-section-title">Cohort Specifications</h3>
          </div>
          <div className="pl-6 space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-[0.6rem]">Total Population Requested</span>
              <span className="text-[11px] font-semibold text-blue-600">{patientCount} Patients</span>
            </div>
            
            {activeFilterEntries.length > 0 ? (
              <div className="space-y-2">
                {activeFilterEntries.map(([key, val]) => (
                  <div key={key} className="flex justify-between items-baseline border-b border-slate-50 pb-1 px-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-[0.6rem]">{labelMap[key]}:</span>
                    <span className="text-[10px] font-medium text-slate-700">
                      {(val as string[]).map(v => v.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">No specific filtering criteria applied.</p>
            )}
          </div>
        </div>

        {/* 4. Requested Data Variables */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="document-section-number">04</span>
            <h3 className="document-section-title">Requested Data Variables</h3>
          </div>
          <div className="pl-6 space-y-8">
            {finalGroupedVariables && finalGroupedVariables.length > 0 ? (
              finalGroupedVariables.map((group, gIdx) => (
                <div key={gIdx} className="space-y-3">
                  <h4 className="variable-group-title">{group.title}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        <span className="text-[10px] font-normal text-slate-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
               <div className="space-y-4">
                  <p className="text-xs text-slate-400 italic">Individual variable list unavailable for this record summary.</p>
               </div>
            )}
          </div>
        </div>

        {/* 5. Mini Data Availability Snapshot (Discrete) */}
        {availabilitySummary && availabilitySummary.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Preliminary Availability Assessment</h3>
              <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest">Aggregated Metric Summary</span>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {availabilitySummary.map((group, idx) => {
                const itemsCount = group.items.length;
                const avgPercent = itemsCount > 0 ? group.items.reduce((acc, curr) => acc + (curr.percent || 0), 0) / itemsCount : 0;
                const barColor = avgPercent < 30 ? 'bg-red-500' : avgPercent < 70 ? 'bg-amber-500' : 'bg-blue-500';
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[80%]">{group.title}</span>
                      <span className="text-[9px] font-bold text-slate-800">{Math.round(avgPercent)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${avgPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Signature Area */}
      <div className="bg-slate-50 border-t border-slate-100 p-12 flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
         <div className="space-y-1">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Electronic ID</p>
            <p className="text-[10px] font-mono text-slate-400 font-semibold">{(Math.random().toString(16).substring(2, 20)).toUpperCase()}</p>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Applicant Signature Placeholder</p>
            <div className="w-48 h-px bg-slate-300 ml-auto" />
         </div>
      </div>
    </div>
  );
};
