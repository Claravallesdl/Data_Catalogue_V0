import React from 'react';
import { ArrowRight, Database, Search } from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="landing-container flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text Content */}
        <div className="text-left">
          <span className="landing-tagline text-sm">VHIO Data Ecosystem</span>
          <h1 className="landing-title text-6xl font-bold mt-2 mb-6 font-inter">
            Accelerate Your Oncology Research
          </h1>
          <p className="text-lg text-main leading-relaxed max-w-lg mb-12">
            A multi-dimensional oncology data platform. Explore available patient data, define cohorts and request data access to power your research.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="btn-primary px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              Read the Guide <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Action Cards */}
        <div className="space-y-6">
          <ActionCard
            icon={Database}
            title="Go to VHIO Lake"
            description="A high-precision oncology data lake integrating clinical histories with molecular NGS profiling."
            onClick={() => onNavigate('lake')}
          />
          <ActionCard
            icon={Search}
            title="Explore the Catalogue"
            description="Use powerful filtering tools to define patient cohorts and discover datasets."
            onClick={() => onNavigate('catalogue')}
          />
          <ActionCard
            icon={Database}
            title="Manage Your Workspace"
            description="Track your data requests, manage saved queries, and review petitions."
            onClick={() => onNavigate('workspace')}
          />
        </div>

      </div>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick }) => (
  <button onClick={onClick} className="action-card w-full p-6 rounded-xl flex items-center text-left hover:shadow-xl transition-all group">
    <div className="action-card-icon w-12 h-12 rounded-lg flex items-center justify-center mr-5 transition-all">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h3 className="text-base font-bold text-main mb-1">{title}</h3>
      <p className="text-sm text-muted leading-snug">{description}</p>
    </div>
    <ArrowRight size={20} className="text-muted group-hover:text-brand transition-all ml-4 transform group-hover:translate-x-1" />
  </button>
);
