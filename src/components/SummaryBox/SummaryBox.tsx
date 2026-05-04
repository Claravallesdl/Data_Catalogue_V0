import React from 'react';
import { Users, Microscope, Target, Database } from 'lucide-react';
import { DashboardRecord, HierarchyNode, HierarchyField } from '../../types';
import * as d3 from 'd3';
import './SummaryBox.css';

interface SummaryBoxProps {
  allRecords: DashboardRecord[];
  filteredRecords: DashboardRecord[];
  dashboardIntegrated?: boolean;
  hoveredNode?: d3.HierarchyRectangularNode<HierarchyNode> | null;
  activeHierarchy?: HierarchyField[];
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ 
  allRecords, 
  filteredRecords, 
  dashboardIntegrated = false,
  hoveredNode,
  activeHierarchy = []
}) => {
  const uniquePatientsAll = new Set(allRecords.map(r => r.sap)).size;
  const uniquePatientsFiltered = new Set(filteredRecords.map(r => r.sap)).size;
  
  const metastaticCount = filteredRecords.filter(r => r.type === 'Met' || r.type === 'Metastatic').length;
  const primaryCount = filteredRecords.filter(r => r.type === 'Prim' || r.type === 'Primary').length;

  const layerNameMap: Record<string, string> = {
    type: 'Biopsy Origin',
    omicsData: 'Omics Data',
    molecularInfo: 'Molecular Info',
    primaryTumor: 'Primary Tumor Location',
    gender: 'Biological Sex',
    rangeAge: 'Age Range',
    treatment: 'Treatment Type',
    biopsySite: 'Biopsy Site',
    images: 'Images'
  };

  const getDisplayName = (name: string) => {
    if (name === 'Met') return 'Metastatic Tumor Biopsy';
    if (name === 'Prim') return 'Primary Tumor Biopsy';
    return name.replace(/\s*\(.*?\)$/, '').replace(/_/g, ' ');
  };

  const layerColors = [
    'var(--chart-color-1)',
    'var(--chart-color-2)',
    'var(--chart-color-3)',
    'var(--chart-color-4)',
    'var(--chart-color-5)',
    'var(--chart-color-6)',
  ];

  if (dashboardIntegrated) {
    return (
      <div className="summary-container flex flex-col h-[700px] overflow-hidden animate-in fade-in duration-300">
        {!hoveredNode ? (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-6">
            <div className="space-y-2">
              <div className="space-y-1">
                <h4 className="summary-value text-3xl">
                  {uniquePatientsFiltered.toLocaleString()}
                </h4>
                <p className="summary-label">Total Patients</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-black text-slate-700">{metastaticCount + primaryCount}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase">Biopsies</span>
                </div>
                <div className="w-px h-4 bg-slate-100"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-black text-slate-700">{uniquePatientsFiltered}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase">Samples</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50/50 p-3 rounded-xl border border-primary-100/30">
              <p className="text-[9px] text-brand font-medium leading-relaxed">
                Explore the cohort by hovering over the <strong>Sunburst Chart</strong> segments to see specific sub-group insights.
              </p>
            </div>
          </div>
        ) : (() => {
          const ancestors = hoveredNode.ancestors().reverse().slice(1);
          const deepestColor = layerColors[(ancestors.length - 1) % layerColors.length];
          
          return (
            <div className="p-4 flex-1 flex flex-col gap-6">
              <div className="space-y-1">
                 <h4 
                   className="sub-selection-value text-2xl"
                   style={{ color: deepestColor }}
                 >
                   {hoveredNode.value?.toLocaleString()} patients
                 </h4>
                 <p className="sub-selection-label">Current Selection</p>
              </div>
              
              <div className="space-y-5">
                {ancestors.map((node, idx) => {
                  const field = activeHierarchy[idx];
                  const label = layerNameMap[field] || field;
                  const isLast = idx === ancestors.length - 1;
                  const color = layerColors[idx % layerColors.length];
                  
                  return (
                    <div key={idx} className={`relative pl-5 ${isLast ? '' : 'pb-1'}`}>
                      {!isLast && <div className="layer-connector"></div>}
                      <div 
                        className="layer-dot"
                        style={{ backgroundColor: color }}
                      ></div>
                      
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span 
                            className="text-[12px] font-black leading-none"
                            style={{ color: color }}
                          >
                            {node.value?.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">patients</span>
                        </div>
                        <div className="space-y-0.5">
                          <p 
                            className="text-[13px] font-black leading-tight"
                            style={{ color: color }}
                          >
                            {getDisplayName(node.data.name)}
                          </p>
                          <p 
                            className="text-[9px] font-black uppercase tracking-wider opacity-70"
                            style={{ color: color }}
                          >
                            {label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  const items = [
    { label: 'Patients', value: uniquePatientsFiltered.toLocaleString(), sub: `of ${uniquePatientsAll}`, icon: Users, color: 'blue' },
    { label: 'Biopsies', value: filteredRecords.length.toLocaleString(), sub: 'records', icon: Microscope, color: 'indigo' },
    { label: 'Metastatic Biopsy', value: metastaticCount.toLocaleString(), sub: `${((metastaticCount / (filteredRecords.length || 1)) * 100).toFixed(0)}%`, icon: Target, color: 'amber' },
    { label: 'Primary Biopsy', value: primaryCount.toLocaleString(), sub: `${((primaryCount / (filteredRecords.length || 1)) * 100).toFixed(0)}%`, icon: Database, color: 'emerald' }
  ];

  if (dashboardIntegrated) {
    const dashboardItems = items.filter(item => !['Metastatic Biopsy', 'Primary Biopsy'].includes(item.label));
    return (
      <div className="grid grid-cols-1 gap-2">
        {dashboardItems.map((item, idx) => (
          <div key={idx} className="bg-surface p-2.5 rounded-2xl border border-subtle shadow-sm flex items-center gap-2.5">
            <div className={`w-8 h-8 flex-shrink-0 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center`}>
              <item.icon size={15} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider truncate">{item.label}</span>
                <span className={`text-[8px] font-bold text-${item.color}-500 whitespace-nowrap`}>{item.sub}</span>
              </div>
              <h4 className="text-sm font-black text-slate-800 leading-none mt-0.5">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center`}>
              <item.icon size={20} />
            </div>
            <p className={`text-xs font-bold text-${item.color}-500`}>{item.sub}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</p>
            <h4 className="text-xl font-black text-slate-800">{item.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};
