
import React, { useState } from 'react';
import { User as UserIcon, Calendar, Mail, Phone, Edit3, Save, X, ShieldCheck, BadgeCheck } from 'lucide-react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);
  const [email, setEmail] = useState(user.email || '');

  const handleSave = () => {
    onUpdate({
      ...user,
      name,
      dob,
      email
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setDob(user.dob);
    setEmail(user.email || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
             <UserIcon size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{user.name}</h1>
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldCheck size={14} /> Verified Citizen Account
            </p>
          </div>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit My Details
          </button>
        ) : (
          <div className="flex gap-3">
             <button 
                onClick={handleCancel}
                className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Card */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <div className="space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
               <BadgeCheck size={16} className="text-blue-500" /> Basic Information
             </h3>
             
             <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400"><UserIcon size={20}/></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Legal Name</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-extrabold text-lg text-slate-800 dark:text-white">{user.name}</p>
                    )}
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400"><Calendar size={20}/></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-extrabold text-lg text-slate-800 dark:text-white">{new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    )}
                  </div>
               </div>
             </div>
           </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <div className="space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
               <ShieldCheck size={16} className="text-blue-500" /> Contact Details
             </h3>

             <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400"><Phone size={20}/></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Number (Verified)</p>
                    <p className="font-extrabold text-lg text-slate-800 dark:text-white">+91 {user.phoneNumber}</p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400"><Mail size={20}/></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={email} 
                        placeholder="Not specified"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-extrabold text-lg text-slate-800 dark:text-white">{user.email || 'Not specified'}</p>
                    )}
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Account Security Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
               <ShieldCheck size={40} />
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left">
               <h4 className="text-xl font-black uppercase tracking-tight">Your data is secure</h4>
               <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
                 All your personal details and welfare documents are protected with 256-bit encryption and are only accessible through secure Aadhaar-based OTP authentication.
               </p>
            </div>
            <div className="hidden lg:block">
               <div className="px-6 py-3 border border-white/10 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Privacy Certified
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
