import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  Loader2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { Grievance, User } from '../types';

const GrievancesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'TRACK'>('NEW');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user from storage for defaults
  useEffect(() => {
    const saved = localStorage.getItem('samriddhi_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, userName: parsedUser.name }));
    }
  }, []);

  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      id: 'GR-2024-001',
      subject: 'Delayed PM-KISAN Installment',
      department: 'Ministry of Agriculture',
      status: 'IN_PROGRESS',
      date: '2024-05-10',
      description: 'The 15th installment has not been credited yet despite registration.'
    }
  ]);

  // Expanded Form state
  const [formData, setFormData] = useState({
    userName: '',
    aadhaarLast4: '',
    location: '',
    department: '',
    scheme: '',
    subject: '',
    urgency: 'MEDIUM',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department || !formData.subject || !formData.description || !formData.userName || !formData.location) {
      alert("Please fill in all mandatory fields (Name, Location, Department, Subject, and Details).");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newGrievance: Grievance = {
        id: `GR-2024-00${grievances.length + 1}`,
        subject: formData.subject,
        department: formData.department,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0],
        description: `${formData.description} | Reported by: ${formData.userName} | Location: ${formData.location} | Priority: ${formData.urgency}`
      };

      setGrievances(prev => [newGrievance, ...prev]);
      setIsSubmitting(false);
      setActiveTab('TRACK');
      
      // Reset form but keep name/location context
      setFormData(p => ({ 
        ...p, 
        scheme: '', 
        subject: '', 
        description: '', 
        urgency: 'MEDIUM' 
      }));

      // Trigger Notification
      window.dispatchEvent(new CustomEvent('push-notification', {
        detail: {
          title: "Report Submitted",
          message: `Grievance ${newGrievance.id} has been logged under ${formData.department}.`,
          type: "INFO"
        }
      }));

      // Simulate Status Updates
      setTimeout(() => updateGrievanceStatus(newGrievance.id, 'IN_PROGRESS'), 8000);
      setTimeout(() => updateGrievanceStatus(newGrievance.id, 'RESOLVED'), 20000);

    }, 1500);
  };

  const updateGrievanceStatus = (id: string, status: Grievance['status']) => {
    setGrievances(prev => prev.map(g => {
      if (g.id === id) {
        const title = status === 'IN_PROGRESS' ? "Grievance Update" : "Grievance Resolved";
        const msg = status === 'IN_PROGRESS' 
          ? `Department has acknowledged report ${id}.` 
          : `Grievance ${id} has been resolved successfully.`;
        
        window.dispatchEvent(new CustomEvent('push-notification', {
          detail: { title, message: msg, type: status === 'RESOLVED' ? "SUCCESS" : "INFO" }
        }));
        
        return { ...g, status };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
            <Sparkles size={12} className="animate-pulse" /> Official Grievance Portal
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Redressal Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Report service failures or delays directly to central and state departments.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-[1.5rem] w-full sm:w-fit shadow-xl shadow-slate-200/20 dark:shadow-none">
        <button 
          onClick={() => setActiveTab('NEW')}
          className={`flex-1 sm:flex-none px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'NEW' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Plus size={18} /> New Report
        </button>
        <button 
          onClick={() => setActiveTab('TRACK')}
          className={`flex-1 sm:flex-none px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'TRACK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Search size={18} /> Track History
        </button>
      </div>

      {activeTab === 'NEW' ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[3rem] p-8 md:p-12 shadow-sm max-w-5xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
            
            {/* Section 1: Identity & Location */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                <UserIcon size={16} /> Identity & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporting For</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Name of individual"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
                      value={formData.userName}
                      onChange={e => setFormData(p => ({...p, userName: e.target.value}))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aadhaar (Last 4 Digits)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="XXXX"
                      maxLength={4}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
                      value={formData.aadhaarLast4}
                      onChange={e => setFormData(p => ({...p, aadhaarLast4: e.target.value.replace(/\D/g, '')}))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location of Issue</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="City/District, State"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
                      value={formData.location}
                      onChange={e => setFormData(p => ({...p, location: e.target.value}))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Department & Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.2em] border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                <FileText size={16} /> Department & Concern
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Department</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all appearance-none"
                    value={formData.department}
                    onChange={e => setFormData(p => ({...p, department: e.target.value}))}
                    required
                  >
                    <option value="">Select Dept</option>
                    <option>Ministry of Agriculture</option>
                    <option>Ministry of Health</option>
                    <option>Education Department</option>
                    <option>Panchayati Raj</option>
                    <option>Social Justice</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urgency Level</label>
                  <div className="relative">
                    <AlertTriangle className={`absolute left-4 top-1/2 -translate-y-1/2 ${formData.urgency === 'HIGH' ? 'text-red-500' : 'text-slate-400'}`} size={16} />
                    <select 
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all appearance-none"
                       value={formData.urgency}
                       onChange={e => setFormData(p => ({...p, urgency: e.target.value}))}
                    >
                      <option value="LOW">Low (Standard Inquiry)</option>
                      <option value="MEDIUM">Medium (Delayed Service)</option>
                      <option value="HIGH">High (Immediate Need)</option>
                      <option value="EMERGENCY">Emergency (Life/Security)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Related Scheme (If Any)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Ayushman Bharat"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
                    value={formData.scheme}
                    onChange={e => setFormData(p => ({...p, scheme: e.target.value}))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Summary Subject</label>
                <input 
                  type="text" 
                  placeholder="E.g. Non-receipt of disability pension for 3 months"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                  value={formData.subject}
                  onChange={e => setFormData(p => ({...p, subject: e.target.value}))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the incident, names of officers (if any), and previous attempts to resolve..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-bold text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                  value={formData.description}
                  onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                  required
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={20} /> Transmitting Data...</>
              ) : (
                <>Lodge Official Complaint <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-3xl w-full shadow-sm">
               <Search className="text-slate-400 ml-2" size={20} />
               <input 
                 type="text" 
                 placeholder="Filter by ID, Name or Keyword..." 
                 className="flex-1 outline-none text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400 font-bold text-sm" 
               />
               <button className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:bg-blue-50 transition-colors">
                 <Filter size={18} />
               </button>
            </div>
            <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-800/30 flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Central Audit Sync: Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {grievances.map(g => (
              <div key={g.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className={`absolute left-0 top-0 w-2 h-full ${
                  g.status === 'RESOLVED' ? 'bg-green-500' : g.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-orange-500'
                }`}></div>
                
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-sm uppercase tracking-tighter bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">{g.id}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12}/> {new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight tracking-tight group-hover:text-blue-600 transition-colors">{g.subject}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{g.department}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl line-clamp-2">{g.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-4 min-w-fit">
                    <StatusBadge status={g.status} />
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                       Case File <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {g.status === 'IN_PROGRESS' && (
                  <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700/50">
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <span>Resolution Progress</span>
                        <span className="text-blue-500">Processing Audit</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-blue-500 animate-shimmer"></div>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {grievances.length === 0 && (
             <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-700">
               <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                 <AlertCircle size={32} />
               </div>
               <p className="text-slate-400 font-black uppercase tracking-widest">No active case files found</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: Grievance['status'] }) => {
  const configs = {
    PENDING: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: <Clock size={16}/>, label: 'Submitted' },
    IN_PROGRESS: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: <Hourglass size={16}/>, label: 'In Review' },
    RESOLVED: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: <CheckCircle2 size={16}/>, label: 'Resolved' },
  };
  const config = configs[status];
  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest ${config.bg} ${config.text} border border-current`}>
      {config.icon}
      {config.label}
    </div>
  );
};

export default GrievancesPage;
