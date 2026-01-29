
import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, User as UserIcon, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile Fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowProfileSetup(true);
    }, 1000);
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;
    
    const newUser: User = {
      phoneNumber,
      name,
      dob,
      email,
      isAuthenticated: true
    };
    
    onLogin(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-500">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 relative z-10">
            {showProfileSetup ? <UserIcon size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight relative z-10">
            {showProfileSetup ? 'Create Your Profile' : 'Citizen Login'}
          </h1>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 relative z-10">
            {showProfileSetup ? 'Complete your details for better service' : 'Access your digital welfare dashboard safely'}
          </p>
        </div>

        <div className="p-8">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-300 dark:border-slate-600 pr-3">+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-20 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 px-1 font-medium">An OTP will be sent for verification.</p>
              </div>

              <button 
                type="submit" 
                disabled={phoneNumber.length < 10 || isLoading}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>Get OTP <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          ) : !showProfileSetup ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <CheckCircle2 size={16} /> OTP sent to +91 {phoneNumber}
                </div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enter 4-Digit OTP</label>
                <div className="flex justify-center gap-3">
                  {[...Array(4)].map((_, i) => (
                    <input 
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-black text-2xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => {
                        if(e.target.value) setOtp(prev => (prev + e.target.value).slice(0, 4));
                      }}
                    />
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest hover:underline mt-6"
                >
                  Change Phone Number
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                 {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCompleteProfile} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter your legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
              >
                Complete Profile & Join
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
