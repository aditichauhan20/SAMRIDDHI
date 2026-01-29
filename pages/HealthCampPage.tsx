
import { HEALTH_CAMPS } from '../constants';
import { Calendar, MapPin, Clock, Info, HeartPulse, Search, Filter, ChevronRight, Map as MapIcon, X, CheckCircle2, AlertTriangle, ExternalLink, CalendarPlus, BellRing } from 'lucide-react';
import React, { useState, useMemo } from 'react';

const HealthCampPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredCamps, setRegisteredCamps] = useState<string[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCalendarPrompt, setShowCalendarPrompt] = useState<string | null>(null);

  const majorCities = useMemo(() => {
    const cities = new Set(HEALTH_CAMPS.map(c => c.city));
    return ['All', ...Array.from(cities).sort()];
  }, []);

  const filteredCamps = useMemo(() => {
    return HEALTH_CAMPS.filter(camp => {
      const matchesCity = selectedCity === 'All' || camp.city === selectedCity;
      const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            camp.city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCity && matchesSearch;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedCity, searchTerm]);

  const handleRegister = (id: string) => {
    setRegisteredCamps(prev => [...prev, id]);
    setShowCalendarPrompt(id);
    
    // Trigger a system notification as well
    window.dispatchEvent(new CustomEvent('push-notification', {
      detail: {
        title: "Registration Success",
        message: "You have been registered for the health camp. Check your SMS.",
        type: "SUCCESS"
      }
    }));
  };

  const downloadIcs = (camp: typeof HEALTH_CAMPS[0]) => {
    const dateStr = camp.date.replace(/-/g, '');
    const startTime = "090000"; // Assuming 9 AM start if not detailed
    const endTime = "160000";   // Assuming 4 PM end
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Samriddhi//Citizen Portal//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${camp.title}`,
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      `LOCATION:${camp.location}, ${camp.city}`,
      `DESCRIPTION:${camp.description}\\n\\nPlease carry your Aadhaar card and previous medical records.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new globalThis.Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${camp.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowCalendarPrompt(null);
  };

  const handleViewLocation = (location: string, city: string) => {
    const query = encodeURIComponent(`${location}, ${city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const processCancellation = () => {
    if (!cancellationReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    setRegisteredCamps(prev => prev.filter(id => id !== showCancelModal));
    setShowCancelModal(null);
    setCancellationReason('');
    
    window.dispatchEvent(new CustomEvent('push-notification', {
      detail: {
        title: "Registration Cancelled",
        message: "The health camp registration has been removed.",
        type: "INFO"
      }
    }));
  };

  const CANCELLATION_REASONS = [
    "Personal health issues",
    "Change of plans",
    "Transportation unavailability",
    "Already visited another clinic",
    "Emergency at home",
    "Incorrect location selection",
    "Other"
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
            <HeartPulse size={12} /> National Health Initiative
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Health Camp Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">June 2024: Bridging the gap to quality healthcare across major Indian cities.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{HEALTH_CAMPS.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Camps</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-black text-green-600 dark:text-green-400">10</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Major Cities</p>
          </div>
        </div>
      </div>

      {/* 2. Top Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-8 rounded-[2rem] text-white shadow-2xl shadow-red-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <HeartPulse size={48} className="mb-6" />
            <h2 className="text-2xl font-black mb-3">Your Health, Our Priority</h2>
            <p className="text-red-100 text-sm mb-8 leading-relaxed max-w-lg">
              Samriddhi's free health camps bring specialized diagnosis and treatment to your doorstep. Every consultation includes a free health card update.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 text-xs bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <span className="shrink-0"><Info size={18} className="text-red-200" /></span>
                <span className="font-medium">Please carry your Aadhaar card and medical prescriptions for accurate diagnosis.</span>
              </div>
              <div className="flex items-start gap-3 text-xs bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <span className="shrink-0"><Clock size={18} className="text-red-200" /></span>
                <span className="font-medium">Token distribution starts 30 minutes before time. Early arrival is recommended.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Monthly Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-between group cursor-default bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Eye Checkups</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">4 Locations</p>
                </div>
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                  <ChevronRight size={16} />
                </div>
              </div>
              <div className="flex items-center justify-between group cursor-default bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-purple-500/30 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Child Wellness</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">3 Locations</p>
                </div>
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                  <ChevronRight size={16} />
                </div>
              </div>
              <div className="flex items-center justify-between group cursor-default bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-red-500/30 transition-all">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Diabetes Care</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">6 Locations</p>
                </div>
                <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-4 border-2 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
            Download PDF Full Schedule
          </button>
        </div>
      </div>

      {/* 3. Extended Filter Section */}
      <div className="space-y-6">
        {/* Full-width Search Bar */}
        <div className="bg-white dark:bg-slate-800 p-3 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
             <Search size={24} className="text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by specialty, city name, or landmark..." 
               className="outline-none text-slate-700 dark:text-slate-200 bg-transparent w-full text-lg font-bold placeholder-slate-400" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                <Filter size={12} /> Filtered View
             </div>
          </div>
        </div>

        {/* City Filters Row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {majorCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                selectedCity === city 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Schedule (Calendar with timeline) */}
      <div className="space-y-8">
        {filteredCamps.length > 0 ? (
          filteredCamps.map((camp, index) => {
            const campDate = new Date(camp.date);
            const isToday = campDate.toDateString() === new Date().toDateString();
            const isRegistered = registeredCamps.includes(camp.id);
            const isCalendarPromptActive = showCalendarPrompt === camp.id;
            
            return (
              <div key={camp.id} className="relative group ml-4 md:ml-10">
                {/* Timeline Dot & Line */}
                <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700">
                   <div className={`absolute top-12 -left-2 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-900 transition-all ${isToday ? 'bg-red-500 scale-125 shadow-lg shadow-red-500/50' : isRegistered ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                </div>

                <div className={`bg-white dark:bg-slate-800 border rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isToday ? 'border-red-500/50 shadow-lg shadow-red-500/5' : isRegistered ? 'border-green-500/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
                    {/* Date Block */}
                    <div className="w-full md:w-40 flex-shrink-0">
                      <div className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-colors border-2 ${
                        isToday 
                          ? 'bg-red-600 text-white border-red-500 shadow-2xl shadow-red-500/30' 
                          : isRegistered
                          ? 'bg-green-600 text-white border-green-500 shadow-2xl shadow-green-500/30'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700'
                      }`}>
                         <p className={`text-xs font-black uppercase tracking-widest ${isToday || isRegistered ? 'text-white/80' : 'text-slate-400'}`}>
                           {campDate.toLocaleDateString('en-US', { month: 'short' })}
                         </p>
                         <p className="text-5xl font-black tabular-nums">{campDate.getDate()}</p>
                         <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isToday || isRegistered ? 'text-white/80' : 'text-slate-500'}`}>
                           {campDate.toLocaleDateString('en-US', { weekday: 'long' })}
                         </p>
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                           <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {camp.title}
                           </h3>
                           {isToday && (
                             <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase animate-pulse shadow-lg shadow-red-500/20">Active Now</span>
                           )}
                           {isRegistered && (
                             <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                               <CheckCircle2 size={12} /> Registered
                             </span>
                           )}
                        </div>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400 font-bold">
                          <div className="flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> {camp.city}</div>
                          <div className="flex items-center gap-2"><MapIcon size={18} className="text-blue-500" /> {camp.location}</div>
                          <div className="flex items-center gap-2"><Clock size={18} className="text-blue-500" /> {camp.time}</div>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base font-medium">{camp.description}</p>
                      
                      {isCalendarPromptActive ? (
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-[2rem] border border-green-200 dark:border-green-800/30 animate-in slide-in-from-top-2 duration-500 space-y-4">
                           <div className="flex items-center gap-3">
                              {/* Fix: Replaced non-existent member BellCheck with BellRing from lucide-react */}
                              <BellRing size={20} className="text-green-600" />
                              <p className="text-sm font-black text-green-700 dark:text-green-400 uppercase tracking-tight">Registration Confirmed!</p>
                           </div>
                           <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Would you like to add this event to your calendar to receive a reminder?</p>
                           <div className="flex gap-3">
                              <button 
                                onClick={() => downloadIcs(camp)}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
                              >
                                <CalendarPlus size={16} /> Yes, Add to Calendar
                              </button>
                              <button 
                                onClick={() => setShowCalendarPrompt(null)}
                                className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all"
                              >
                                Not Now
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                          {isRegistered ? (
                            <div className="flex gap-2">
                               <button 
                                onClick={() => setShowCancelModal(camp.id)}
                                className="px-10 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all text-xs uppercase tracking-[0.1em] border border-red-200 dark:border-red-800 active:scale-95"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => downloadIcs(camp)}
                                className="px-10 py-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-black rounded-2xl hover:bg-green-100 transition-all text-xs uppercase tracking-[0.1em] border border-green-200 flex items-center gap-2"
                              >
                                <CalendarPlus size={16} /> Add to Calendar
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleRegister(camp.id)}
                              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all text-xs uppercase tracking-[0.1em] shadow-xl shadow-blue-500/30 active:scale-95"
                            >
                              Confirm Registration
                            </button>
                          )}
                          <button 
                            onClick={() => handleViewLocation(camp.location, camp.city)}
                            className="px-10 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-xs uppercase tracking-[0.1em] active:scale-95 flex items-center gap-2"
                          >
                            View Location <ExternalLink size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-700">
             <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <Calendar size={40} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] text-lg">No Matching Camps</p>
             <button onClick={() => {setSelectedCity('All'); setSearchTerm('');}} className="text-blue-600 dark:text-blue-400 font-black text-sm hover:underline mt-4 uppercase tracking-widest">Clear Search Results</button>
          </div>
        )}
      </div>

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Cancel Registration</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">We're sorry to see you go. Please let us know the reason for cancellation to help us improve.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Reason</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {CANCELLATION_REASONS.map(reason => (
                  <button
                    key={reason}
                    onClick={() => setCancellationReason(reason)}
                    className={`text-left px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
                      cancellationReason === reason 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setShowCancelModal(null)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200"
              >
                Go Back
              </button>
              <button 
                onClick={processCancellation}
                className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCampPage;
