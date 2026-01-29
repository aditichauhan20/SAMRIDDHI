
import React, { useState } from 'react';
import { X, Search, Globe, Check, Sparkles } from 'lucide-react';
import { Language, LANGUAGE_LABELS } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelect: (lang: Language) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose, currentLanguage, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = Object.entries(LANGUAGE_LABELS).filter(([_, label]) => 
    label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-600/5 to-transparent">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest">
              <Globe size={14} /> Multilingual Bharat
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Select Your Language</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by language name (Hindi, Bengali, etc.)..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-800 dark:text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLanguages.map(([code, label]) => {
              const isActive = currentLanguage === code;
              return (
                <button
                  key={code}
                  onClick={() => {
                    onSelect(code as Language);
                    onClose();
                  }}
                  className={`relative group p-6 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-lg font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                      {label.split('(')[1]?.replace(')', '') || label}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {label.split('(')[0].trim()}
                    </p>
                  </div>
                  {isActive ? (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={18} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={14} className="text-blue-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Sparkles size={18} className="text-blue-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest">AI-Powered Real-time Localisation</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center md:text-right">
            Supports official 22 scheduled languages of India and regional dialects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
