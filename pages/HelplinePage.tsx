
import React, { useState } from 'react';
import { HELPLINES } from '../constants.tsx';
import { Phone, Search, Users, Shield, Hospital, GraduationCap, Train, Tractor, Siren, Info, Clock, PhoneCall, Zap, Globe, HelpCircle, Bot, Headphones } from 'lucide-react';

const HelplinePage: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Police', 'Medical', 'Disaster', 'Farmers', 'Women & Child', 'Senior Citizen', 'Students', 'Railway', 'Cyber', 'Utility', 'Tourism'];

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Police': return <Siren className="text-blue-600 dark:text-blue-400" />;
      case 'Medical': return <Hospital className="text-red-600 dark:text-red-400" />;
      case 'Farmers': return <Tractor className="text-orange-600 dark:text-orange-400" />;
      case 'Women & Child': return <Users className="text-purple-600 dark:text-purple-400" />;
      case 'Senior Citizen': return <Shield className="text-emerald-600 dark:text-emerald-400" />;
      case 'Students': return <GraduationCap className="text-indigo-600 dark:text-indigo-400" />;
      case 'Railway': return <Train className="text-slate-600 dark:text-slate-400" />;
      case 'Disaster': return <HelpCircle className="text-red-700 dark:text-red-500" />;
      case 'Cyber': return <Shield className="text-cyan-600 dark:text-cyan-400" />;
      case 'Utility': return <Zap className="text-amber-500" />;
      case 'Tourism': return <Globe className="text-teal-600 dark:text-teal-400" />;
      default: return <Phone className="text-slate-600 dark:text-slate-400" />;
    }
  };

  const filtered = HELPLINES.filter(h => 
    (filter === 'All' || h.category === filter) &&
    (h.title.toLowerCase().includes(searchTerm.toLowerCase()) || h.number.includes(searchTerm))
  );

  const requestAiGuidance = (h: any) => {
    window.dispatchEvent(new CustomEvent('trigger-ai-guidance', { 
      detail: { 
        title: h.title, 
        procedure: h.procedure 
      } 
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <PhoneCall className="text-blue-500" size={32} />
            Government Helpline Numbers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive directory of national helplines for every domain. Available 24/7 for citizen support and emergency response.</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-4">
           <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20">
              <Bot size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">New Feature</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Request AI Voice Guidance for any facility.</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by domain, name or number..." 
             className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(h => (
          <div key={h.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-xl transition-all">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    {getIcon(h.category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{h.title}</h3>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{h.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-2xl font-black text-slate-800 dark:text-white tracking-wider">{h.number}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase flex items-center gap-2 mb-2 tracking-widest">
                    <Info size={14} className="text-blue-500" /> About this Helpline
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{h.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                  <a 
                    href={`tel:${h.number.replace(/\s+/g, '')}`} 
                    className="flex-1 px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <Phone size={16} /> Direct Standard Call
                  </a>
                  <button 
                    onClick={() => requestAiGuidance(h)}
                    className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <Headphones size={16} /> AI Voice Guidance Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
           <p className="text-slate-400 font-medium">No helpline found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HelplinePage;
