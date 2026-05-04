import React, { useState } from 'react';
import { Bell, Settings, User, ChevronDown, Info, LogOut, UserCircle, Database, CheckCircle, Layout } from 'lucide-react';
import './Header.css';

const DataLogo = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
    <circle cx="50" cy="50" r="15" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
    
    <g stroke="#ffffff" strokeWidth="1.5">
      <line x1="50" y1="50" x2="80" y2="20" opacity="0.6" />
      <line x1="50" y1="50" x2="30" y2="85" opacity="0.4" />
      <line x1="50" y1="50" x2="15" y2="40" opacity="0.3" />
    </g>
    
    <circle cx="80" cy="20" r="3.5" fill="#3b82f6" />
    <circle cx="30" cy="85" r="3" fill="#60a5fa" />
    <circle cx="15" cy="40" r="2.5" fill="#93c5fd" />
    
    <g stroke="#ffffff" strokeWidth="1.2">
      <line x1="50" y1="50" x2="85" y2="60" opacity="0.5" />
      <line x1="50" y1="50" x2="65" y2="80" opacity="0.3" />
    </g>
    <circle cx="85" cy="60" r="3" fill="#ea580c" />
    <circle cx="65" cy="80" r="2" fill="#f97316" />
    
    <circle cx="50" cy="50" r="5" fill="#ffffff" />
  </svg>
);

interface Notification {
  id: string;
  type: 'incoming_request' | 'request_approved';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'incoming_request',
    title: 'New Data Request',
    description: 'Dr. Maria Garcia requested access to your "Metastatic Breast Cancer" cohort.',
    time: '12m ago',
    read: false,
  },
  {
    id: '2',
    type: 'request_approved',
    title: 'Request Approved',
    description: 'Your request for the "Lung Adenocarcinoma Multi-omic" dataset has been approved by the DAC.',
    time: '2h ago',
    read: false,
  },
  {
    id: '3',
    type: 'incoming_request',
    title: 'New Data Request',
    description: 'The Pathology Lab requested raw sequencing data for 12 cases in VHIO-Lake.',
    time: 'Yesterday',
    read: true,
  }
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="header-container fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 shadow-xl">
      {/* Left: Branding */}
      <div className="flex items-center gap-3 min-w-[280px]">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onTabChange('lake')}>
          <DataLogo />
        </div>
        <div className="flex flex-col">
          <span className="logo-text-main text-base font-bold leading-tight tracking-tight">VHIO</span>
          <span className="logo-text-sub text-[10px] font-bold uppercase tracking-[0.2em]">Data Ecosystem</span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex items-center h-full gap-8">
        {[
          { id: 'home', label: 'Home' },
          { id: 'how-it-works', label: 'How it Works' },
          { id: 'lake', label: 'VHIO-Lake', icon: <Info size={14} className="logo-text-sub" /> },
          { id: 'catalogue', label: 'Data Catalogue' },
          { id: 'workspace', label: 'My Workspace', icon: <Layout size={14} className="text-secondary-brand" /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`nav-link h-full px-2 flex items-center gap-2 border-b-2 ${
              activeTab === tab.id 
                ? 'nav-link-active' 
                : 'nav-link-inactive'
            }`}
          >
            {tab.label}
            {tab.icon}
          </button>
        ))}
      </nav>

      {/* Right: User & Config */}
      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden sm:flex items-center gap-1">
          {/* Notification Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsUserMenuOpen(false);
              }}
              className={`p-2 rounded-md transition-all relative ${isNotificationsOpen ? 'text-white-pure bg-white/10' : 'text-dark-muted hover:text-white-pure hover:bg-white/5'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-3.5 h-3.5 indicator-alert border-2 border-surface-dark rounded-full flex items-center justify-center text-[7px] font-bold text-white-pure">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-surface rounded-xl shadow-2xl border border-strong overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-main uppercase tracking-widest">Notifications</h3>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[9px] font-bold text-brand uppercase hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-subtle hover:bg-surface-muted transition-colors cursor-pointer group flex gap-3 ${!notif.read ? 'bg-primary-50/20' : ''}`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'incoming_request' ? 'status-pending' : 'status-approved'}`}>
                            {notif.type === 'incoming_request' ? <Database size={16} /> : <CheckCircle size={16} />}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-main uppercase tracking-tight truncate">{notif.title}</span>
                              <span className="text-[8px] font-bold text-muted/60 uppercase whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-[10px] font-medium text-muted leading-normal">
                              {notif.description}
                            </p>
                            {!notif.read && (
                              <div className="mt-2 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 indicator-new rounded-full"></div>
                                <span className="text-[8px] font-bold text-brand uppercase">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center opacity-30 text-muted">
                        <Bell size={32} />
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-surface-muted text-center">
                    <button className="text-[9px] font-bold text-muted uppercase tracking-widest hover:text-main transition-colors">
                      View Activity Log
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => {
              onTabChange('settings');
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            className={`p-2 rounded-md transition-all ${activeTab === 'settings' ? 'text-white-pure bg-white/10' : 'text-dark-muted hover:text-white-pure hover:bg-white/5'}`}
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg transition-all group"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white-pure leading-none mb-1">Dr. Julian Vales</p>
              <p className="text-[10px] font-medium text-dark-muted">Principal Investigator</p>
            </div>
            <div className={`w-9 h-9 bg-surface-dark border-2 rounded-full flex items-center justify-center shadow-sm overflow-hidden transition-all ${isUserMenuOpen ? 'border-brand' : 'border-dark-subtle group-hover:border-brand'}`}>
              <User size={20} className="text-dark-muted" />
            </div>
            <ChevronDown size={14} className={`text-dark-muted transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsUserMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-2xl border border-subtle py-2 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <button 
                   onClick={() => {
                     onTabChange('profile');
                     setIsUserMenuOpen(false);
                   }}
                   className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-main hover:bg-surface-muted transition-colors text-left"
                >
                  <UserCircle size={16} className="text-muted" />
                  Profile
                </button>
                <div className="h-px bg-surface-muted my-1 mx-2"></div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-error hover:bg-error-subtle transition-colors text-left">
                  <LogOut size={16} className="text-error" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
