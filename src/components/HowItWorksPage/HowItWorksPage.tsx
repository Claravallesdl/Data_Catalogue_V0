import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
import { FileText, Database, Layers, User, BookOpen, Share2, Bookmark, Clock, Search, MousePointerClick } from 'lucide-react';
import './HowItWorksPage.css';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: BookOpen },
  { id: 'overview', title: 'Overview of Tabs', icon: Layers },
  { id: 'catalogue', title: 'Data Catalogue', icon: FileText },
  { id: 'workspace', title: 'My Workspace', icon: User },
];

const SectionCard: React.FC<PropsWithChildren<{ id: string; title: string }>> = ({ id, title, children }) => (
  <section id={id} className="mb-16 scroll-mt-20 text-left">
    <h2 className="section-card-title">{title}</h2>
    <div className="space-y-8">{children}</div>
  </section>
);

const Step: React.FC<PropsWithChildren<{ icon: React.ElementType; title: string }>> = ({ icon: Icon, title, children }) => (
  <div className="flex gap-6 text-left">
    <div className="flex flex-col items-center">
      <div className="step-icon-container">
        <Icon size={24} className="text-slate-500" />
      </div>
      <div className="flex-1 w-px bg-slate-200 my-2"></div>
    </div>
    <div className="flex-1 pb-8">
      <h3 className="font-bold text-slate-800 mb-2 text-lg">{title}</h3>
      <div className="text-slate-600 text-sm leading-relaxed space-y-4">{children}</div>
    </div>
  </div>
);

const CatalogueOverview: React.FC = () => (
  <div className="relative bg-slate-100 rounded-2xl p-8 border border-slate-200 mb-12 overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Catalogue Interface Overview</h4>
    </div>
    
    <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 aspect-video overflow-hidden flex">
      {/* Sidebar Mockup */}
      <div className="w-1/4 border-r border-slate-100 bg-slate-50 p-3 space-y-3">
        <div className="h-2 w-12 bg-slate-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-white border border-slate-200 rounded"></div>
          <div className="h-4 w-full bg-white border border-slate-200 rounded"></div>
          <div className="h-4 w-full bg-white border border-slate-200 rounded"></div>
        </div>
      </div>
      
      {/* Main Area Mockup */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-slate-50 flex items-center justify-between px-4">
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
          </div>
          <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-blue-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10"></div>
          </div>
        </div>
      </div>
      
      {/* Insights Mockup */}
      <div className="w-1/5 border-l border-slate-50 bg-slate-50/30 p-3 space-y-4">
        <div className="h-2 w-16 bg-slate-200 rounded"></div>
        <div className="h-20 w-full bg-white border border-slate-100 rounded-lg"></div>
        <div className="h-20 w-full bg-white border border-slate-100 rounded-lg"></div>
      </div>

      {/* Arrows and Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sidebar Arrow */}
        <div className="absolute top-[40%] left-[12%] flex flex-col items-center">
          <div className="w-px h-12 bg-blue-500 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-tighter mt-1 shadow-lg">Filters Sidebar</span>
        </div>

        {/* Header Arrow */}
        <div className="absolute top-[8%] left-[45%] flex flex-col items-center">
          <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-tighter mb-1 shadow-lg">Hierarchy & Views</span>
          <div className="w-px h-8 bg-blue-500 relative">
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Actions Arrow */}
        <div className="absolute top-[8%] left-[65%] flex flex-col items-center">
          <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-tighter mb-1 shadow-lg">Save & Request</span>
          <div className="w-px h-8 bg-blue-500 relative">
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Insights Arrow */}
        <div className="absolute top-[50%] right-[10%] flex flex-col items-center">
          <div className="w-px h-12 bg-blue-500 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-tighter mt-1 shadow-lg">Cohort Insights</span>
        </div>
      </div>
    </div>
  </div>
);

const VisualizationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sunburst');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex gap-1.5 text-left">
          {['Primary Tumor', 'Treatment'].map(label => (
            <span key={label} className="px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all border uppercase tracking-tight bg-blue-600 border-blue-600 text-white shadow-md">
              {label}
            </span>
          ))}
        </div>
        <div className="flex flex-shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner h-fit">
          <button onClick={() => setActiveTab('sunburst')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight ${activeTab === 'sunburst' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Sunburst
          </button>
          <button onClick={() => setActiveTab('trends')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight ${activeTab === 'trends' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Trends
          </button>
          <button onClick={() => setActiveTab('dataset')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight ${activeTab === 'dataset' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Dataset
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-inner flex-1 flex items-center justify-center min-h-[300px]">
        {/* Note: In a real app these would be the actual Chart components or screenshots */}
        {activeTab === 'sunburst' && <div className="text-slate-300 flex flex-col items-center gap-2"><Database size={48} /><p className="text-[10px] font-bold uppercase tracking-widest">Sunburst Visualization</p></div>}
        {activeTab === 'trends' && <div className="text-slate-300 flex flex-col items-center gap-2"><Database size={48} /><p className="text-[10px] font-bold uppercase tracking-widest">Trends Visualization</p></div>}
        {activeTab === 'dataset' && <div className="text-slate-300 flex flex-col items-center gap-2"><Database size={48} /><p className="text-[10px] font-bold uppercase tracking-widest">Dataset Visualization</p></div>}
      </div>
    </div>
  );
};

export const HowItWorksPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = contentRef.current?.scrollTop || 0;
      let currentSection = 'introduction';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition + 150) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    const contentEl = contentRef.current;
    contentEl?.addEventListener('scroll', handleScroll);
    return () => contentEl?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="how-it-works-container">
      <aside className="how-it-works-sidebar">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 text-left">How It Works</h2>
        <nav>
          <ul>
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 my-1 rounded-lg text-sm font-bold transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}>
                  <section.icon size={18} />
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main ref={contentRef} className="how-it-works-main">
        <div className="max-w-3xl mx-auto text-left">
          <section id="introduction" className="mb-16 scroll-mt-20">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Introduction</h1>
            <p className="text-lg text-slate-600 leading-relaxed">Welcome to the VHIO Data Ecosystem, a centralized platform designed to accelerate high-impact oncology research. This platform provides researchers with streamlined access to a rich, integrated dataset of clinical and molecular information, simplifying cohort discovery and data acquisition.</p>
          </section>

          <SectionCard id="overview" title="Overview of the Three Main Tabs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"><Database size={20} className="text-slate-500"/></div>
                <div>
                  <h3 className="font-bold text-slate-800">VHIO-Lake</h3>
                  <p className="text-sm text-slate-600">A high-level overview of the data ecosystem, showcasing integrated databases and total patient scope.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"><FileText size={20} className="text-slate-500"/></div>
                <div>
                  <h3 className="font-bold text-slate-800">Data Catalogue</h3>
                  <p className="text-sm text-slate-600">The interactive core for detailed cohort discovery using powerful filtering tools and visualizations.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"><User size={20} className="text-slate-500"/></div>
                <div>
                  <h3 className="font-bold text-slate-800">My Workspace</h3>
                  <p className="text-sm text-slate-600">Your personal hub for managing queries, tracking data requests, and accessing approved datasets.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard id="catalogue" title="How the Data Catalogue Works">
            <CatalogueOverview />
            
            <Step icon={Search} title="Step 1: Browse and Filter">
              <p>Use the comprehensive filters in the left sidebar to specify criteria and build your cohort. The visualizations will update in real-time to reflect your selection. Available filters include: Primary Tumor, Tumor Stage, Primary Met Site, Current Status, Gender, Therapy Type, and Genomic Biomarkers.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 text-left">
                <div className="font-inter text-sm font-bold text-slate-800 mb-1">Primary Tumor</div>
                <p className="font-inter text-xs text-slate-500 mb-4">Filter by the main cancer type.</p>
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search tumors..." className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center text-sm text-slate-700 font-medium"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /><span className="ml-3">Breast</span></label>
                  <label className="flex items-center text-sm text-slate-700 font-medium"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /><span className="ml-3">Colon</span></label>
                  <label className="flex items-center text-sm text-slate-700 font-medium"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" /><span className="ml-3">Lung</span></label>
                </div>
              </div>
            </Step>
            <Step icon={Layers} title="Step 2: Analyze Your Cohort">
              <p>Explore your defined cohort using three different visualization modes to gain insights into its composition and characteristics. These modes exactly replicate the interactive tools available in the main catalogue.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-6">
                <VisualizationTabs />
              </div>
            </Step>
            <Step icon={MousePointerClick} title="Step 3: Request Data or Save Query">
              <p>Once your cohort is defined, you have two primary actions. You can click <strong>"Save Query"</strong> to bookmark your current filter configuration for future use, or click <strong>"Request Data"</strong> to initiate a formal request for the curated dataset. You'll be guided through a form to provide a title, research justification, and specify the data types you need.</p>
              <div className="bg-white rounded-xl border border-slate-200 p-8 my-6 flex flex-col items-center gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <button className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm uppercase tracking-wider">
                    <Bookmark size={14} className="group-hover:scale-110 transition-transform" /> Save Query
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-[10px] font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 uppercase tracking-wider">
                    <Share2 size={14} /> Request Data
                  </button>
                </div>
              </div>
            </Step>
          </SectionCard>

          <SectionCard id="workspace" title="How My Workspace Works">
             <Step icon={Bookmark} title="Manage Saved Queries">
                <p>Any filter combination from the Catalogue can be saved, allowing you to quickly reload complex cohort definitions without starting from scratch. Saved queries appear in your workspace with a summary of their active filters.</p>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 my-4 shadow-sm text-left">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">Metastatic Breast Patients &gt; 45y</h4>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={10} /> 2025-05-14
                        </div>
                      </div>
                      <Bookmark size={16} className="text-blue-500" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[8px] font-black rounded-lg uppercase tracking-tighter">T: Breast</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-[8px] font-black rounded-lg uppercase tracking-tighter">S: Female</span>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[8px] font-black rounded-lg uppercase tracking-tighter">O: Met</span>
                    </div>
                  </div>
                </div>
            </Step>
            <Step icon={Clock} title="Track Petitions and Requests">
                <p>Every data request becomes a petition. Your workspace provides a detailed list of all your petitions and their current status. You can also review incoming requests from other researchers if you have the necessary permissions.</p>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm my-4 text-left">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <Share2 size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Prostate Treatment Outcomes</h4>
                        <p className="text-[10px] font-bold text-slate-400">Submitted on 2025-05-15</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest bg-amber-50 border-amber-100 text-amber-600">
                      <Clock size={10} /> pending
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl mb-4">
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                      "Comparative study with internal hormone deprivation cohort to validate survival markers."
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 transition-all">View Details</button>
                  </div>
                </div>
            </Step>
          </SectionCard>
        </div>
      </main>
    </div>
  );
};
