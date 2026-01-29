
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Bot, MessageSquare, Send, Keyboard, Volume2, X, Globe, ChevronDown, Trash2, Power, Download, PhoneIncoming, Languages, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini';
import { Language, LANGUAGE_LABELS } from '../types';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

type Mode = 'VOICE' | 'TEXT';

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, currentLanguage, onLanguageChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>('TEXT');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; isAudio?: boolean; timestamp: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [guidanceContext, setGuidanceContext] = useState<string | null>(null);
  
  // Audio Recording State for Chat Messages
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<globalThis.Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const languageLabel = LANGUAGE_LABELS[currentLanguage];

  useEffect(() => {
    const handleGuidanceTrigger = (e: any) => {
      const { title, procedure } = e.detail;
      setGuidanceContext(title);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Initiating AI Guidance Call for: ${title}. How can I assist you with this facility?`, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setMode('VOICE');
      startVoiceSession(`The user needs help with ${title}. Procedure: ${procedure}. Guide them step-by-step.`);
    };

    window.addEventListener('trigger-ai-guidance', handleGuidanceTrigger);
    return () => window.removeEventListener('trigger-ai-guidance', handleGuidanceTrigger);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isRecording]);

  const handleCloseAction = () => {
    stopVoiceSession();
    cancelRecording();
    setGuidanceContext(null);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    onClose();
  };

  const downloadChatLog = () => {
    if (messages.length === 0) return;
    const log = messages.map(m => `[${m.timestamp}] ${m.role === 'user' ? 'CITIZEN' : 'SAMRIDDHI SAHAYAK'}: ${m.text}`).join('\n\n');
    const blob = new globalThis.Blob([`SAMRIDDHI PORTAL - CHAT HISTORY\nLanguage: ${languageLabel}\n\n${log}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Samriddhi_Chat_Log_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Base64 Helpers
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const createGenAIBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  // --- AUDIO MESSAGE FACILITY (TEXT MODE) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new globalThis.Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendAudioMessage(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendAudioMessage = async (base64Audio: string) => {
    setMessages(prev => [...prev, { role: 'user', text: "Voice Message", isAudio: true, timestamp: new Date().toLocaleTimeString() }]);
    setIsTyping(true);
    try {
      const response = await getGeminiResponse("", { language: languageLabel }, base64Audio);
      setMessages(prev => [...prev, { role: 'bot', text: response || 'I heard your message but couldn\'t generate a response.', timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Apologies, I encountered an error processing that audio.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- REAL-TIME LIVE VOICE FACILITY (VOICE MODE) ---
  const startVoiceSession = async (customInstruction?: string) => {
    try {
      setStatus('CONNECTING');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createGenAIBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = outAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            if (message.serverContent?.outputTranscription) {
                setMessages(prev => [...prev, { role: 'bot', text: message.serverContent?.outputTranscription?.text || '', timestamp: new Date().toLocaleTimeString() }]);
            }
          },
          onerror: () => setStatus('ERROR'),
          onclose: () => setStatus('IDLE'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: customInstruction || `You are Samriddhi Sahayak, an Indian e-governance chatbot. Help users with schemes, documents, and grievances. Use a helpful, respectful, and authoritative tone. Respond ONLY in ${languageLabel}.`
        }
      });
      
      sessionRef.current = await sessionPromise;
      setIsActive(true);
      setMode('VOICE');
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outAudioContextRef.current) outAudioContextRef.current.close();
    setIsActive(false);
    setStatus('IDLE');
    sessionRef.current = null;
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString() }]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(userMsg, { language: languageLabel });
      setMessages(prev => [...prev, { role: 'bot', text: response || 'I processed your request but have no response.', timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'I encountered an error. Please try again.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] sm:inset-auto sm:bottom-6 sm:right-6 flex items-center justify-center sm:block">
      <div className="bg-white dark:bg-slate-950 w-full h-full sm:w-[450px] sm:h-[700px] sm:rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <div className="flex justify-between items-center relative z-10">
             <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isActive ? 'bg-green-400 animate-pulse' : 'bg-white/10'}`}>
                   <Bot size={24} />
                </div>
                <div>
                   <h2 className="text-lg font-black uppercase tracking-tight">Sahayak AI</h2>
                   <button 
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-100 hover:text-white transition-colors"
                   >
                      <Globe size={10} /> {languageLabel} <ChevronDown size={10} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                   </button>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={downloadChatLog} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><Download size={18}/></button>
                <button onClick={handleCloseAction} className="p-2.5 bg-white/10 hover:bg-red-500 rounded-xl transition-all"><X size={18}/></button>
             </div>
          </div>

          {/* Language Selector Dropdown */}
          {showLangMenu && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-2xl z-20 border-b border-slate-200 dark:border-slate-800 max-h-64 overflow-y-auto no-scrollbar animate-in slide-in-from-top-4 duration-300">
              <div className="p-4 grid grid-cols-2 gap-2">
                {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code as Language);
                      setShowLangMenu(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${
                      currentLanguage === code 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guidance Notice */}
        {guidanceContext && (
          <div className="bg-orange-50 dark:bg-orange-900/10 px-6 py-3 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <PhoneIncoming size={12} className="text-orange-600 animate-bounce" />
                <p className="text-[9px] font-black uppercase text-orange-700 dark:text-orange-400 tracking-widest">Guidance Active: {guidanceContext}</p>
             </div>
             <button onClick={() => setGuidanceContext(null)} className="text-orange-400"><X size={10}/></button>
          </div>
        )}

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-900 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
               <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                 <MessageSquare size={48} className="text-blue-500" />
               </div>
               <div className="space-y-2">
                  <p className="font-black text-sm uppercase tracking-widest">Vandanam!</p>
                  <p className="text-xs font-bold max-w-[200px]">I am Sahayak. Ask me about Welfare schemes in 26 languages.</p>
               </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm font-medium leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              }`}>
                {m.isAudio ? (
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                         <Volume2 size={16} />
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-widest">Audio Message</span>
                   </div>
                ) : (
                  <div className={currentLanguage === Language.URDU ? 'text-right' : 'text-left'}>{m.text}</div>
                )}
                <p className={`text-[8px] mt-2 font-black uppercase opacity-50 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Thinking...</span>
               </div>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
           
           {/* Mode Switcher */}
           <div className="flex justify-center gap-4">
              <button 
                 onClick={() => { if(isActive) stopVoiceSession(); setMode('TEXT'); }}
                 className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'TEXT' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}
              >
                 <Keyboard size={14} /> Typing & Audio
              </button>
              <button 
                 onClick={() => { setMode('VOICE'); if(!isActive) startVoiceSession(); }}
                 className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'VOICE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400'}`}
              >
                 <Mic size={14} /> Real-time Live
              </button>
           </div>

           {mode === 'TEXT' ? (
              <div className="flex gap-3 items-center">
                 {isRecording ? (
                    <div className="flex-1 flex items-center gap-4 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-2xl border border-red-200 dark:border-red-900/30 animate-pulse">
                       <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                       <span className="text-sm font-black text-red-600 dark:text-red-400">Recording {formatDuration(recordingDuration)}</span>
                       <div className="flex-1"></div>
                       <button onClick={cancelRecording} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18}/></button>
                       <button onClick={stopRecording} className="p-3 bg-red-600 text-white rounded-xl shadow-lg"><Send size={18}/></button>
                    </div>
                 ) : (
                    <>
                       <div className="flex-1 relative group">
                          <input 
                             type="text" 
                             placeholder={`Message in ${languageLabel}...`}
                             className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-slate-800 dark:text-white transition-all"
                             value={inputText}
                             onChange={e => setInputText(e.target.value)}
                             onKeyDown={e => e.key === 'Enter' && handleSendText()}
                          />
                       </div>
                       <button 
                          onClick={startRecording}
                          className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all border border-slate-200 dark:border-slate-800"
                          title="Record Audio Message"
                       >
                          <Mic size={20} />
                       </button>
                       <button 
                          onClick={handleSendText}
                          disabled={!inputText.trim()}
                          className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/30 disabled:opacity-30 transition-all"
                       >
                          <Send size={20} />
                       </button>
                    </>
                 )}
              </div>
           ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                 <div className="relative">
                    {isActive && <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-150"></div>}
                    <button
                       onClick={isActive ? stopVoiceSession : () => startVoiceSession()}
                       className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
                    >
                       {isActive ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                 </div>
                 <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                       {status === 'CONNECTING' ? 'Initializing...' : isActive ? 'Listening Live...' : 'Start Conversation'}
                    </p>
                    <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Powered by Gemini Multimodal 2.5</p>
                 </div>
              </div>
           )}

           <div className="flex justify-center border-t border-slate-50 dark:border-slate-800 pt-4">
              <button onClick={handleCloseAction} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-all">
                 <Power size={12} /> End Chat Session
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
