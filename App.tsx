
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
  Loader2,
  Headphones
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

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (selectedLang !== Language.ENGLISH) {
      setIsTranslating(true);
      const timer = setTimeout(() => setIsTranslating(false), 1500);
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
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Gov Services Status: Operational
            </div>
            <span className="opacity-40 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <Globe size={10} />
              26 Regional Languages Supported
            </div>
            {isTranslating && (
              <div className="flex items-center gap-1.5 text-blue-100 animate-pulse ml-4">
                <Loader2 size={10} className="animate-spin" />
                Linguistic Localisation...
              </div>
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
                  <span className="font-extrabold text-xl md:text-2xl tracking-tighter text-slate-800 dark:text-white uppercase">Samriddhi</span>
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-0.5">Welfare Portal</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button 
                onClick={() => setIsLangModalOpen(true)}
                className="hidden sm:flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/30 transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm"
              >
                <Languages size={18} className="text-blue-600 dark:text-blue-400" />
                <div className="text-left leading-none">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Language</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {LANGUAGE_LABELS[selectedLang]}
                  </p>
                </div>
              </button>
              
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/profile" className="hidden lg:flex flex-col items-end leading-none">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Profile</span>
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{user.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-red-500 transition-all">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-extrabold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest">
                  Login
                </Link>
              )}
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/50 transition-all duration-500 ${isSidebarHidden ? 'w-0 opacity-0' : 'w-72 opacity-100'}`}>
              <div className="p-6 space-y-2 flex-1 overflow-y-auto no-scrollbar">
                <SidebarLink to="/" icon={<Home size={20} />} label="Dashboard" />
                {user && <SidebarLink to="/profile" icon={<UserIcon size={20} />} label="My Account" />}
                <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Public Services</div>
                <SidebarLink to="/schemes" icon={<Search size={20} />} label="Welfare Schemes" />
                <SidebarLink to="/documents" icon={<FileText size={20} />} label="Official IDs" />
                <SidebarLink to="/grievances" icon={<AlertCircle size={20} />} label="Report Grievance" />
                <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Community</div>
                <SidebarLink to="/health-camps" icon={<Calendar size={20} />} label="Health Camps" />
                <SidebarLink to="/helplines" icon={<Siren size={20} />} label="Emergency Hub" />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth">
              <div className="max-w-6xl mx-auto py-8 px-4 md:px-10">
                 <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
                  <Route path="/schemes" element={<SchemesPage />} />
                  <Route path="/grievances" element={user ? <GrievancesPage /> : <Navigate to="/auth" />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/health-camps" element={<HealthCampPage />} />
                  <Route path="/helplines" element={<HelplinePage />} />
                  <Route path="/profile" element={user ? <ProfilePage user={user} onUpdate={handleLogin} /> : <Navigate to="/auth" />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Floating Chatbot Access Button */}
          {!isVoiceAssistantOpen && (
            <button 
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all group animate-bounce"
            >
              <Bot size={32} className="group-hover:rotate-12 transition-transform" />
              <div className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with Sahayak AI
              </div>
            </button>
          )}

          {/* Modal Components */}
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
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;
