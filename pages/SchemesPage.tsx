import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Bookmark, 
  LayoutGrid, 
  Tractor, 
  Briefcase, 
  GraduationCap, 
  HeartPulse, 
  Users, 
  Baby,
  Sparkles,
  Filter,
  ArrowUpRight,
  Info,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  FileSearch,
  Loader2,
  ListChecks,
  Gift,
  UserCheck,
  ShieldCheck,
  Zap,
  Building,
  Hammer
} from 'lucide-react';
import { SCHEMES } from '../constants';
import { checkEligibilityAI, verifyEligibilityWithDocument, semanticSearchSchemes } from '../services/gemini';
import { Scheme } from '../types';

// Category Configuration mapping internal category names to display groups
const CATEGORIES_CONFIG = [
  { id: 'all', title: 'All Schemes', icon: <LayoutGrid size={20} />, color: 'text-blue-500', groups: [] },
  { id: 'Agriculture', title: 'Agriculture', icon: <Tractor size={20} />, color: 'text-green-500', groups: ['Agriculture'] },
  { id: 'Health', title: 'Healthcare', icon: <HeartPulse size={20} />, color: 'text-rose-500', groups: ['Health'] },
  { id: 'Education', title: 'Education', icon: <GraduationCap size={20} />, color: 'text-purple-500', groups: ['Education'] },
  { id: 'Business', title: 'Business & Finance', icon: <Briefcase size={20} />, color: 'text-orange-500', groups: ['Business', 'Banking'] },
  { id: 'Social Welfare', title: 'Social Welfare', icon: <Users size={20} />, color: 'text-indigo-500', groups: ['Social Welfare', 'Disability'] },
  { id: 'Women & Child', title: 'Women & Child', icon: <Baby size={20} />, color: 'text-pink-500', groups: ['Women & Child'] },
  { id: 'Infrastructure', title: 'Housing & Utility', icon: <Building size={20} />, color: 'text-cyan-500', groups: ['Housing', 'Sanitation', 'Utility'] },
  { id: 'Employment', title: 'Work & Skills', icon: <Hammer size={20} />, color: 'text-teal-500', groups: ['Employment', 'Skills'] },
];

const SchemesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any[] | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  
  // AI Search State
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);

  // Document Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Calculate Dynamic Counts
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES_CONFIG.map(cat => {
      const count = cat.id === 'all' 
        ? SCHEMES.length 
        : SCHEMES.filter(s => cat.groups.includes(s.category)).length;
      return { ...cat, count };
    });
  }, []);

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    try {
      const matchedIds = await semanticSearchSchemes(searchTerm, SCHEMES);
      setAiSearchResults(matchedIds);
    } catch (err) {
      console.error(err);
      setAiSearchResults([]);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredSchemes = useMemo(() => {
    // If we have AI semantic search results, prioritize them
    if (aiSearchResults !== null) {
      return SCHEMES.filter(s => aiSearchResults.includes(s.id));
    }

    // Default local filter
    return SCHEMES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const config = CATEGORIES_CONFIG.find(c => c.id === selectedCategory);
      const matchesCategory = selectedCategory === 'all' || (config && config.groups.includes(s.category));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, aiSearchResults]);

  const clearSearch = () => {
    setSearchTerm('');
    setAiSearchResults(null);
  };

  const handleAiCheck = async () => {
    if (!userProfile) return;
    setIsAnalyzing(true);
    try {
      const results = await checkEligibilityAI(userProfile);
      setAiAnalysis(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to verify documents.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureDocument = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imgData);
        stopCamera();
      }
    }
  };

  const handleDocumentVerify = async () => {
    if (!capturedImage || !selectedScheme) return;
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyEligibilityWithDocument(
        capturedImage, 
        selectedScheme.name, 
        selectedScheme.eligibility
      );
      setVerificationResult(result);
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again with a clearer photo.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isAiSearching ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} size={20} />
          <input 
            type="text" 
            placeholder='Search over 500+ Welfare Schemes...'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (aiSearchResults) setAiSearchResults(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            className="w-full h-16 md:h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-16 pr-32 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-lg font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchTerm && (
              <button onClick={clearSearch} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={18} />
              </button>
            )}
            <button 
              onClick={handleAiSearch}
              disabled={isAiSearching || !searchTerm.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isAiSearching ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {isAiSearching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span className="hidden sm:inline">AI Search</span>
            </button>
          </div>
        </div>
        <button className="h-16 md:h-20 px-8 bg-slate-200 dark:bg-slate-800 rounded-[2rem] text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-all font-black text-xs uppercase tracking-widest hidden md:flex items-center gap-3">
          <Filter size={20} /> Advanced Filters
        </button>
      </div>

      {/* AI Search Info Alert */}
      {aiSearchResults !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-[2rem] flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Semantic Match Active</p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Displaying results best matching your search intent: "{searchTerm}"</p>
            </div>
          </div>
          <button onClick={clearSearch} className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
            Reset Results
          </button>
        </div>
      )}

      {/* AI Assistant Banner */}
      <div className="bg-slate-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 skew-x-[-20deg] translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40">
                  <Sparkles size={24} className="animate-pulse" />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Gemini Eligibility Sahayak</h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">AI Matching Engine</p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder='E.g. "I am a retired teacher looking for pension benefits"'
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 rounded-2xl outline-none focus:border-blue-500 text-white placeholder-slate-500 font-medium"
                value={userProfile}
                onChange={(e) => setUserProfile(e.target.value)}
              />
              <button 
                onClick={handleAiCheck}
                disabled={isAnalyzing}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30"
              >
                {isAnalyzing ? "Processing..." : "Find Matches"}
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-48">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 text-center">
              <Info size={32} className="mx-auto text-blue-400 mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Describe your life context for accurate results.</p>
            </div>
          </div>
        </div>
        
        {aiAnalysis && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in slide-in-from-top-4 duration-500">
            {aiAnalysis.map((res, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => {
                const scheme = SCHEMES.find(s => s.name.toLowerCase().includes(res.schemeName.toLowerCase()));
                if(scheme) setSelectedScheme(scheme);
              }}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-blue-400 text-sm uppercase tracking-tight">{res.schemeName}</h4>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{res.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Scroller */}
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
        {categoriesWithCounts.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setAiSearchResults(null);
            }}
            className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] min-w-fit border transition-all duration-300 ${
              selectedCategory === cat.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400'
            }`}
          >
            <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 ${selectedCategory === cat.id ? 'text-blue-600' : cat.color}`}>
              {cat.icon}
            </div>
            <div className="text-left">
              <p className="font-extrabold whitespace-nowrap text-sm tracking-tight">{cat.title}</p>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedCategory === cat.id ? 'text-blue-200' : 'text-slate-400'}`}>{cat.count} Available</p>
            </div>
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 md:p-10 hover:shadow-2xl hover:border-blue-500/20 transition-all group relative overflow-hidden flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full uppercase tracking-widest">
                   {scheme.category}
                 </span>
                 <button className="text-slate-300 dark:text-slate-600 hover:text-orange-500 transition-colors">
                    <Bookmark size={20} />
                 </button>
              </div>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 transition-colors tracking-tight">
                {scheme.name}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                {scheme.description}
              </p>
              <div className="flex flex-wrap gap-2">
                 {scheme.benefits.slice(0, 1).map((b, i) => (
                   <div key={i} className="flex items-center gap-2 text-[10px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full uppercase tracking-widest">
                     <Sparkles size={12} /> {b}
                   </div>
                 ))}
              </div>
            </div>
            <button 
              onClick={() => setSelectedScheme(scheme)}
              className="mt-10 w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm flex items-center justify-center gap-3"
            >
              Application Details <ChevronRight size={16} />
            </button>
          </div>
        ))}

        {filteredSchemes.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6">
                <Search size={40} />
             </div>
             <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">No matching schemes found</p>
             <p className="text-slate-500 mt-2">Try searching for something else or reset your filters.</p>
             <button onClick={clearSearch} className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Clear Search</button>
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex justify-between items-start">
              <div className="space-y-4 max-w-2xl">
                <span className="text-[10px] font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-widest">{selectedScheme.category}</span>
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">{selectedScheme.name}</h2>
                <p className="text-blue-100 font-medium leading-relaxed opacity-90">{selectedScheme.description}</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedScheme(null);
                  setVerificationResult(null);
                  setCapturedImage(null);
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content Scroller */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 no-scrollbar">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Information Column */}
                <div className="lg:col-span-2 space-y-10">
                  <section className="space-y-6">
                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest">
                      <Gift size={18} className="text-blue-500" /> Major Benefits
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedScheme.benefits.map((b, i) => (
                        <div key={i} className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl flex items-start gap-3">
                          <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{b}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest">
                      <UserCheck size={18} className="text-blue-500" /> Detailed Eligibility
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      {selectedScheme.eligibility.map((e, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                           <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                           <p className="font-bold text-base">{e}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest">
                      <ListChecks size={18} className="text-blue-500" /> Documents Needed
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedScheme.documentsRequired.map((doc, i) => (
                        <span key={i} className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Eligibility Verification Column */}
                <div className="space-y-8">
                   <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute -top-4 -right-4 text-blue-500/10 group-hover:scale-125 transition-transform duration-700">
                         <ShieldCheck size={100} />
                      </div>
                      
                      <div className="relative z-10 space-y-2">
                        <h4 className="text-lg font-black uppercase tracking-tighter">AI Verification</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Instantly check your eligibility by scanning your document (e.g. Ration Card, Aadhaar).</p>
                      </div>

                      <div className="relative z-10 space-y-4">
                        {capturedImage ? (
                          <div className="space-y-4">
                             <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-blue-500/50">
                                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                                <button 
                                  onClick={() => {
                                    setCapturedImage(null);
                                    setVerificationResult(null);
                                  }}
                                  className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-xl"
                                >
                                  <X size={16} />
                                </button>
                             </div>
                             {!verificationResult && (
                               <button 
                                 onClick={handleDocumentVerify}
                                 disabled={isVerifying}
                                 className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                               >
                                 {isVerifying ? (
                                   <><Loader2 size={18} className="animate-spin" /> Analyzing Docs...</>
                                 ) : (
                                   <><FileSearch size={18} /> Verify Eligibility</>
                                 )}
                               </button>
                             )}
                          </div>
                        ) : showCamera ? (
                          <div className="space-y-4">
                             <div className="aspect-[3/4] bg-black rounded-2xl overflow-hidden relative">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none"></div>
                             </div>
                             <div className="flex gap-3">
                                <button 
                                  onClick={captureDocument}
                                  className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                                >
                                  <Camera size={18} /> Capture
                                </button>
                                <button 
                                  onClick={stopCamera}
                                  className="p-4 bg-white/10 text-white rounded-2xl"
                                >
                                  <X size={18} />
                                </button>
                             </div>
                          </div>
                        ) : (
                          <button 
                            onClick={startCamera}
                            className="w-full py-10 border-2 border-dashed border-white/20 hover:border-blue-500/50 bg-white/5 hover:bg-white/10 rounded-[2rem] transition-all flex flex-col items-center justify-center gap-4 group"
                          >
                             <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <Camera size={28} />
                             </div>
                             <div className="text-center">
                                <p className="font-black text-[10px] uppercase tracking-widest">Scan Your Document</p>
                                <p className="text-[9px] text-slate-500 mt-1 font-bold">Privacy: Analyzed in-memory only.</p>
                             </div>
                          </button>
                        )}

                        {verificationResult && (
                          <div className={`p-6 rounded-2xl border-2 animate-in slide-in-from-bottom-2 ${verificationResult.isEligible ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                             <div className="flex items-center gap-3 mb-4">
                                {verificationResult.isEligible ? (
                                  <div className="p-1.5 bg-green-500 text-white rounded-lg"><CheckCircle size={14} /></div>
                                ) : (
                                  <div className="p-1.5 bg-red-500 text-white rounded-lg"><AlertCircle size={14} /></div>
                                )}
                                <h5 className="font-black text-[10px] uppercase tracking-widest text-white">Result: {verificationResult.isEligible ? 'Qualified' : 'Requires Review'}</h5>
                             </div>
                             <p className="text-[11px] font-bold text-slate-300 leading-relaxed mb-4">{verificationResult.observation}</p>
                             {verificationResult.missingInformation?.length > 0 && (
                                <div className="space-y-2 pt-3 border-t border-white/10">
                                   <p className="text-[9px] font-black text-slate-500 uppercase">Missing / Blurry Fields:</p>
                                   <div className="flex flex-wrap gap-2">
                                      {verificationResult.missingInformation.map((m: any, i: number) => (
                                        <span key={i} className="text-[9px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">{m}</span>
                                      ))}
                                   </div>
                                </div>
                             )}
                             <button 
                               onClick={() => {
                                 setCapturedImage(null);
                                 setVerificationResult(null);
                               }}
                               className="mt-6 w-full py-3 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                             >
                               Scan Another
                             </button>
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30">
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                        <Info size={14} /> Note for Applicants
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        The AI verification is for preliminary guidance only. Official confirmation will be provided after manual audit by the department.
                      </p>
                   </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-8 md:p-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-5">
               <button 
                 onClick={() => setSelectedScheme(null)}
                 className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
               >
                 Close
               </button>
               <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                 Proceed to Apply <ArrowUpRight size={18} />
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesPage;