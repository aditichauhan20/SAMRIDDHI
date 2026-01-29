
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  HandHeart, 
  ArrowUpRight, 
  Sparkles,
  Users,
  Globe,
  TrendingUp,
  Languages,
  CheckCircle2,
  BarChart3,
  Clock,
  ArrowRight,
  Bot,
  Siren,
  MessageCircle
} from 'lucide-react';
import { useTranslationContext } from '../App';
import { LANGUAGE_LABELS } from '../types';

const HomePage: React.FC = () => {
  const { language, isTranslating } = useTranslationContext();
  const [liveCitizens, setLiveCitizens] = useState(12450);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCitizens(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const languageName = LANGUAGE_LABELS[language];

  return (
    <div className={`space-y-24 pb-20 transition-opacity duration-500 ${isTranslating ? 'opacity-50' : 'opacity-100'}`}>
      {/* 1. Hero Section */}
      <section className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(59,130,246,0.3)] dark:shadow-none"></div>
        <div className="relative z-10 p-10 md:p-20 overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
              <Sparkles size={12} className="animate-pulse" /> 
              {language === 'en' ? 'National Digital Infrastructure' : `Bharat Infrastructure (${languageName})`}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter">
              {language === 'en' ? 'A Resilient' : ''} <span className="text-blue-300">Bharat</span> {language === 'en' ? 'for Every Citizen.' : `for ${languageName} Citizens.`}
            </h1>
            <p className="text-blue-50/80 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Your gateway to 500+ Welfare Schemes, verified documentation, and human-centric AI support in 26 regional languages including {languageName}.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
              <Link to="/schemes" className="px-10 py-5 bg-white text-blue-700 font-extrabold rounded-[2rem] hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20 uppercase tracking-widest text-xs flex items-center gap-2">
                Discover Schemes <ArrowUpRight size={18} />
              </Link>
              <Link to="/auth" className="px-10 py-5 bg-blue-500/30 backdrop-blur-md border border-white/20 text-white font-extrabold rounded-[2rem] hover:bg-blue-500/40 transition-all uppercase tracking-widest text-xs">
                My Citizen Dashboard
              </Link>
            </div>
          </div>

          <div className="lg:w-1/3 relative hidden lg:block">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] shadow-2xl animate-float">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <p className="text-white font-black text-sm uppercase tracking-tight">Verified Citizen</p>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Samriddhi ID Active</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-blue-200 uppercase tracking-widest">
                         <span>Native Language Support</span>
                         <span>Enabled</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-blue-400"></div>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Interface: {languageName}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Unified Services Hub */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Unified Services Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Explore all essential services now available in 26 languages.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            to="/schemes"
            icon={<Search className="text-blue-600" />} 
            title="Eligibility Engine" 
            desc="Discover welfare schemes available for your profile, translated in your native tongue."
            accent="bg-blue-600"
          />
          <FeatureCard 
            to="/documents"
            icon={<FileText className="text-indigo-600" />} 
            title="Digital Vault" 
            desc="Access official identity documentation and procedure guides in regional scripts."
            accent="bg-indigo-600"
          />
          <FeatureCard 
            to="/grievances"
            icon={<HandHeart className="text-emerald-600" />} 
            title="Swift Redressal" 
            desc="Lodge complaints in any dialect and track status with real-time AI updates."
            accent="bg-emerald-600"
          />
        </div>
      </section>

      {/* 3. Live Impact Analytics */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Live Impact Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring the reach of Samriddhi across Bharat.</p>
          </div>
          <div className="px-5 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-full flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Hub Active: {languageName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users className="text-blue-500" />} value={liveCitizens.toLocaleString()} label="Live Citizens" sub="Active users nationwide" trend="+12%" />
          <StatCard icon={<CheckCircle2 className="text-green-500" />} value="14.2M" label="Resolutions" sub="Cases successfully closed" trend="+5.4%" />
          <StatCard icon={<Clock className="text-orange-500" />} value="1.2s" label="Response" sub="AI Sahayak latency" trend="-0.2s" />
          <StatCard icon={<ShieldCheck className="text-indigo-500" />} value="Secure" label="Encryption" sub="E2E Protocol Active" isStatus />
        </div>
      </section>

      {/* 4. AI Performance Section (Multilingual Assistance & Localisation Index) */}
      <section className="bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100 dark:border-blue-800/30 p-10 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               <Bot size={14} /> AI Sahayak - {languageName} Mode
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight">
              Multilingual Assistance, <br />Instant Solutions.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
              Our AI Sahayak is currently optimised for <strong>{languageName}</strong>. You can speak or type in your native dialect for a seamless experience.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">98.2%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linguistic Accuracy</p>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">26</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supported Dialects</p>
               </div>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-assistant'))}
              className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all text-xs uppercase tracking-widest flex items-center gap-3"
            >
              Consult Sahayak in {languageName} <MessageCircle size={18} />
            </button>
          </div>
          <div className="relative">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                         <Languages size={24} />
                      </div>
                      <h4 className="font-black uppercase tracking-tight dark:text-white">Localisation Index</h4>
                   </div>
                   <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Dynamic</span>
                </div>
                <div className="space-y-6">
                   <PerformanceMetric label="Speech Recognition (Native)" value={99.1} />
                   <PerformanceMetric label="Contextual Translation" value={97.5} />
                   <PerformanceMetric label="Dialect Detection" value={98.8} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Help Banner */}
      <section className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center space-y-10 border border-white/5 relative overflow-hidden group">
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
             <Siren size={40} className="animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Need Urgent Help?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Integrated Helplines are ready to assist you in {languageName} for emergencies, medical aid or legal support.
            </p>
          </div>
          <Link to="/helplines" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
             Explore Help Directory <ArrowRight size={20} className="text-blue-600" />
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, value, label, sub, trend, isStatus }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:shadow-xl transition-all duration-300">
     <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
           {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend}
          </span>
        )}
     </div>
     <div>
        <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">{label}</p>
     </div>
     <p className="text-[11px] text-slate-500 font-medium">{sub}</p>
  </div>
);

const PerformanceMetric = ({ label, value }: any) => (
  <div className="space-y-3">
     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-blue-600 dark:text-blue-400">{value}%</span>
     </div>
     <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const FeatureCard = ({ icon, title, desc, to, accent }: any) => (
  <Link to={to} className="group relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl overflow-hidden h-full flex flex-col">
    <div className={`absolute top-0 left-0 w-1.5 h-full ${accent} opacity-0 group-hover:opacity-100 transition-all`}></div>
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-blue-600 transition-colors tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8 flex-1">{desc}</p>
    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
      Open Service Hub <ChevronRight size={14} />
    </div>
  </Link>
);

export default HomePage;
