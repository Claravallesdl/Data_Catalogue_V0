import React, { useState } from 'react';
import { Settings, Monitor, Bell, Shield, Globe, Save, RotateCcw, Check, Eye, FileJson } from 'lucide-react';
import { AppConfig } from '../../App';
import './SettingsPage.css';

interface ToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, enabled, onChange }) => (
  <div className="toggle-item group">
    <div className="flex flex-col gap-0.5 text-left">
      <span className="text-xs font-black text-main uppercase tracking-tight">{label}</span>
      <span className="text-[10px] font-medium text-muted">{description}</span>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-brand' : 'bg-surface-muted'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

interface SettingsPageProps {
  config: AppConfig;
  onChange: (key: keyof AppConfig, val: string | boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config, onChange }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="settings-container text-left">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
        
        {/* Header Area */}
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand">
              <Settings size={20} />
              <h1 className="settings-header-title">System Settings</h1>
            </div>
            <p className="text-xs font-medium text-muted">Manage your VHIO Ecosystem workspace preferences and security.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted hover:text-main transition-colors">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-md ${isSaved ? 'bg-emerald-500 text-white' : 'btn-primary text-white'}`}
            >
              {isSaved ? <Check size={14} /> : <Save size={14} />}
              {isSaved ? 'Settings Applied' : 'Apply Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Display & UI Section */}
          <div className="settings-card space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                <Monitor size={16} />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interface Preferences</h3>
            </div>
            
            <div className="space-y-3">
              <Toggle 
                label="Auto-Expand Sidebar" 
                description="Automatically expand all filter sections on data reload."
                enabled={config.autoExpand}
                onChange={() => onChange('autoExpand', !config.autoExpand)}
              />
              <Toggle 
                label="High-Density Mode" 
                description="Reduce padding and text size for high-res monitoring."
                enabled={config.highDensity}
                onChange={() => onChange('highDensity', !config.highDensity)}
              />
              <Toggle 
                label="Force Text Labels" 
                description="Always show Sunburst segment labels where possible."
                enabled={config.showLabels}
                onChange={() => onChange('showLabels', !config.showLabels)}
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-card space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
                <Bell size={16} />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Triggers</h3>
            </div>
            
            <div className="space-y-3">
              <Toggle 
                label="Data Access Requests" 
                description="Notify when other PIs request access to your datasets."
                enabled={config.emailNotifs}
                onChange={() => onChange('emailNotifs', !config.emailNotifs)}
              />
              <Toggle 
                label="Approval Alerts" 
                description="Real-time alerts when your requests are reviewed by DAC."
                enabled={config.pushNotifs}
                onChange={() => onChange('pushNotifs', !config.pushNotifs)}
              />
              <div className="p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Globe size={10} /> Delivery Channel
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">Email Digest</span>
                  <span className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-black">In-App Banner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="settings-card space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Shield size={16} />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privacy & Access</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-1 opacity-10">
                  <FileJson size={64} className="text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.25em] mb-1">Personal API Key</p>
                  <p className="text-[10px] font-mono text-slate-300">vhio_ak_••••••••••••••••</p>
                </div>
                <button className="relative z-10 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[9px] font-black text-white uppercase rounded-md transition-all border border-white/10">
                  Reveal
                </button>
              </div>
              
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all text-left">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Active Sessions</p>
                  <p className="text-[10px] font-medium text-slate-400">Currently logged in from 2 devices</p>
                </div>
                <Eye size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
