
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  FileText, 
  AlertCircle, 
  User as UserIcon, 
  Menu, 
  X, 
  Calendar, 
  ShieldCheck, 
  Languages,
  ArrowRight,
  Info,
  Phone,
  LayoutDashboard,
  MessageCircle,
  Siren,
  LogOut,
  Globe,
  Sparkles,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bot,
  Bell,
  Trash2,
  Loader2
} from 'lucide-react';
import { Language, User, LANGUAGE_LABELS, Notification } from './types';
import VoiceAssistant from './components/VoiceAssistant';
import LanguageModal from './components/LanguageModal';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import GrievancesPage from './pages/GrievancesPage';
import DocumentsPage from './pages/DocumentsPage';
import HealthCampPage from './pages/HealthCampPage';
import HelplinePage from './pages/HelplinePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { translatePageContent } from './services/gemini';

// Translation Context for Global Access
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  language: Language.ENGLISH,
  setLanguage: () => {},
  isTranslating: false
});

export const useTranslationContext = () => useContext(TranslationContext);

const SamriddhiLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm transition-transform hover:scale-110 duration-500"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path 
      d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
      fill="url(#logoGradient)" 
      className="opacity-10"
    />
    <path 
      d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
      stroke="url(#logoGradient)" 
      strokeWidth="8" 
      strokeLinejoin="round" 
      filter="url(#logoShadow)"
    />
    <circle cx="50" cy="35" r="5" fill="white" />
    <circle cx="35" cy="45" r="5" fill="white" />
    <circle cx="65" cy="45" r="5" fill="white" />
    <path d="M50 55L35 75M50 55L65 75M50 55V85" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M42 60L50 52L58 60" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(Language.ENGLISH);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('samriddhi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeAlert, setActiveAlert] = useState<Notification | null>(null);

  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDesktopSidebar = () => setIsSidebarHidden(!isSidebarHidden);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('samriddhi_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('samriddhi_user');
    setIsSidebarOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('samriddhi_user', JSON.stringify(updatedUser));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveAlert(newNotif);
    setTimeout(() => setActiveAlert(null), 5000);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // AI Translation Trigger
  useEffect(() => {
    if (selectedLang !== Language.ENGLISH) {
      setIsTranslating(true);
      // In a real production app, we would translate static strings via a JSON mapping.
      // Here, we simulate the AI processing and would hook into page components to localise headings.
      const timer = setTimeout(() => setIsTranslating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedLang]);

  useEffect(() => {
    const handleOpen = () => setIsVoiceAssistantOpen(true);
    const handleNotif = (e: any) => addNotification(e.detail);

    window.addEventListener('open-assistant', handleOpen);
    window.addEventListener('push-notification', handleNotif);
    
    return () => {
      window.removeEventListener('open-assistant', handleOpen);
      window.removeEventListener('push-notification', handleNotif);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <TranslationContext.Provider value={{ language: selectedLang, setLanguage: setSelectedLang, isTranslating }}>
      <Router>
        <div className={`min-h-screen flex flex-col transition-all duration-500 ease-out ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
          
          {/* Top Status Bar */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white text-[10px] py-1.5 px-4 font-bold flex justify-center items-center gap-4 tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              Live Services Status: Operational
            </div>
            <span className="opacity-40 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <Globe size={10} />
              Supported in 26 Regional Languages
            </div>
            {isTranslating && (
              <>
                <span className="opacity-40 hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-blue-100 animate-pulse">
                  <Loader2 size={10} className="animate-spin" />
                  AI Localising Page...
                </div>
              </>
            )}
          </div>

          {/* Header */}
          <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/50 h-16 md:h-20 flex items-center px-4 md:px-8 justify-between">
            <div className="flex items-center gap-3 md:gap-5">
              <button 
                onClick={window.innerWidth < 768 ? toggleMobileSidebar : toggleDesktopSidebar} 
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 transition-all active:scale-90"
              >
                <Menu size={20} />
              </button>
              <Link to="/" className="flex items-center gap-3 group">
                <SamriddhiLogo size={40} />
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-xl md:text-2xl tracking-tighter text-slate-800 dark:text-white uppercase transition-colors group-hover:text-blue-600">Samriddhi</span>
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-0.5">Jan Kalyan Portal</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 shadow-sm"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div className="relative">
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); markAllAsRead(); }}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 shadow-sm relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full animate-bounce border-2 border-white dark:border-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Activity Center</h3>
                      <button onClick={clearNotifications} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center space-y-3">
                           <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-300">
                             <Bell size={20} />
                           </div>
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No new updates</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {notifications.map(n => (
                            <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 ${n.isRead ? 'opacity-60' : ''}`}>
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'SUCCESS' ? 'bg-green-500' : n.type === 'ALERT' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                              <div className="space-y-1">
                                <p className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">{n.title}</p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{n.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Language Selector Button */}
              <button 
                onClick={() => setIsLangModalOpen(true)}
                className="hidden sm:flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/30 transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm group"
              >
                <Languages size={18} className="text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                <div className="text-left leading-none">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Language</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {LANGUAGE_LABELS[selectedLang]}
                  </p>
                </div>
              </button>
              
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/profile" className="hidden lg:flex flex-col items-end leading-none group">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">My Profile</span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{user.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-400 hover:text-red-600 transition-all border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-extrabold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <aside 
              className={`hidden md:flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/50 transition-all duration-500 ease-in-out z-30 ${
                isSidebarHidden ? 'w-0 opacity-0' : 'w-72 opacity-100'
              }`}
            >
              <div className="p-6 space-y-2 flex-1 overflow-y-auto no-scrollbar">
                <SidebarLink to="/" icon={<Home size={20} />} label="Home Dashboard" />
                {user && <SidebarLink to="/profile" icon={<UserIcon size={20} />} label="My Citizen Profile" />}
                
                <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Public Services</div>
                <SidebarLink to="/schemes" icon={<Search size={20} />} label="Welfare Schemes" />
                <SidebarLink to="/documents" icon={<FileText size={20} />} label="Identity Docs" />
                <SidebarLink to="/grievances" icon={<AlertCircle size={20} />} label="Report Grievance" />
                
                <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Support & Health</div>
                <SidebarLink to="/health-camps" icon={<Calendar size={20} />} label="Free Health Camps" />
                <SidebarLink to="/helplines" icon={<Siren size={20} />} label="Emergency Help" />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth transition-all duration-300">
              <div className="max-w-6xl mx-auto py-8 px-4 md:px-10">
                 <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
                  <Route path="/schemes" element={<SchemesPage />} />
                  <Route path="/grievances" element={user ? <GrievancesPage /> : <Navigate to="/auth" />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/health-camps" element={<HealthCampPage />} />
                  <Route path="/helplines" element={<HelplinePage />} />
                  <Route path="/profile" element={user ? <ProfilePage user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/auth" />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Voice Assistant & Language Modal */}
          <VoiceAssistant 
            isOpen={isVoiceAssistantOpen} 
            onClose={() => setIsVoiceAssistantOpen(false)} 
            currentLanguage={selectedLang}
            onLanguageChange={setSelectedLang}
          />
          <LanguageModal 
            isOpen={isLangModalOpen} 
            onClose={() => setIsLangModalOpen(false)} 
            currentLanguage={selectedLang}
            onSelect={setSelectedLang}
          />

          <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/50 py-10 px-8">
             <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                   <div className="flex items-center gap-3">
                      <SamriddhiLogo size={32} />
                      <span className="font-extrabold text-lg uppercase tracking-tight dark:text-white">Samriddhi Portal</span>
                   </div>
                   <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                     Multilingual Jan Kalyan Interface
                   </p>
                </div>
                <div className="flex items-center gap-8">
                   <button onClick={() => setIsLangModalOpen(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                     <Languages size={14} /> Change Language
                   </button>
                   <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privacy</a>
                   <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Help</a>
                </div>
             </div>
          </footer>
        </div>
      </Router>
    </TranslationContext.Provider>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
    >
      <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default App;
