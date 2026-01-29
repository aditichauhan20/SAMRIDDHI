
import React, { useState, useMemo } from 'react';
import { GOV_DOCUMENTS } from '../constants.tsx';
import { 
  ExternalLink, 
  HelpCircle, 
  UserCheck, 
  Gift, 
  ScrollText, 
  Phone, 
  Search,
  Filter,
  LayoutGrid,
  ShieldCheck,
  HeartPulse,
  Banknote,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', title: 'All Documents', icon: <LayoutGrid size={20} /> },
  { id: 'Identity', title: 'Identity', icon: <ShieldCheck size={20} /> },
  { id: 'Social Welfare', title: 'Social Welfare', icon: <HeartPulse size={20} /> },
  { id: 'Financial', title: 'Financial', icon: <Banknote size={20} /> },
  { id: 'Vital Records', title: 'Vital Records', icon: <FileText size={20} /> },
];

const DocumentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    return GOV_DOCUMENTS.filter(doc => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.procedure.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Official Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Essential identity and service-related documents issued by the Government of India. Learn how to apply and understand their benefits.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{GOV_DOCUMENTS.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available IDs</p>
           </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700">
             <Search size={18} className="text-slate-400" />
             <input 
               type="text" 
               placeholder="Search documents by name or keyword..." 
               className="outline-none text-slate-700 dark:text-slate-200 bg-transparent w-full text-sm font-medium" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-300'
                }`}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ScrollText size={32} />
                    </div>
                    <div className="md:hidden">
                       <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{doc.category}</span>
                    </div>
                  </div>
                  <div>
                    <span className="hidden md:inline-block text-[10px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded mb-2">{doc.category}</span>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{doc.name}</h2>
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <a 
                      href={doc.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Apply Online <ExternalLink size={16}/>
                    </a>
                    {doc.helpline && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <Phone size={14} className="text-blue-500" />
                        Support: <span className="text-blue-600 dark:text-blue-400 font-bold">{doc.helpline}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <HelpCircle size={16} className="text-orange-500" /> Application Procedure
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">{doc.procedure}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          <UserCheck size={16} className="text-green-500" /> Who is Eligible?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{doc.eligibility}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          <Gift size={16} className="text-purple-500" /> Benefits
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{doc.benefits}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                <FileText size={32} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">No documents found for this selection</p>
             <button onClick={() => {setSelectedCategory('All'); setSearchTerm('');}} className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline mt-2">View all documents</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
