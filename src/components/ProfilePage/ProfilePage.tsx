import React from 'react';
import { User, Mail, Shield, Building, MapPin, Edit3, Key, FileText, CheckCircle, Lock } from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container text-left">
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        
        {/* Profile Header Card */}
        <div className="profile-card">
          <div className="profile-cover">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={48} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8 flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-main tracking-tight">Dr. Julian Vales</h1>
              <p className="text-brand font-bold text-sm uppercase tracking-widest">Principal Investigator</p>
              <div className="flex items-center gap-4 mt-4 text-muted text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <Building size={14} className="text-muted/60" />
                  Genomics Department
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-muted/60" />
                  VHIO, Barcelona
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-muted hover:bg-surface border border-subtle rounded-lg text-xs font-bold text-muted transition-all">
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Details & Permissions */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-brand">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Email</p>
                    <p className="text-xs font-bold text-main truncate">jvales@vhio.net</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">User Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-surface-muted rounded-lg border border-subtle">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-brand" />
                    <span className="text-[10px] font-black text-main uppercase">Administrator</span>
                  </div>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface-muted rounded-lg border border-subtle">
                  <div className="flex items-center gap-2">
                    <Key size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black text-main uppercase">Data Lake Write</span>
                  </div>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface-muted rounded-lg border border-subtle">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-muted/60" />
                    <span className="text-[10px] font-black text-main uppercase">Data Export</span>
                  </div>
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Data export requested', item: 'Breast Cancer Cohort v2', date: '2 hours ago' },
                  { action: 'Hierarchy modified', item: 'Lung Adenocarcinoma Analysis', date: 'Yesterday' },
                  { action: 'Custom filter updated', item: 'Metastatic Sites Primary', date: '3 days ago' },
                  { action: 'Session started', item: 'From Barcelona, ES', date: '4 days ago' },
                  { action: 'Dataset download', item: 'Oncology_Export_2025.csv', date: '1 week ago' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-700">{activity.action}</p>
                      <p className="text-[10px] font-medium text-slate-400">{activity.item}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
