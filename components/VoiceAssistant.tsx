
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Bot, MessageSquare, Send, Keyboard, Volume2, X, Globe, ChevronDown, Trash2, Power, Download, PhoneIncoming } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini';
import { Language, LANGUAGE_LABELS } from '../types';

interface GenAIBlob {
  data: string;
  mimeType: string;
}

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
  
  // Audio Recording State for Text Mode
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

  // Listen for external guidance triggers
  useEffect(() => {
    const handleGuidanceTrigger = (e: any) => {
      const { title, procedure } = e.detail;
      setGuidanceContext(title);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Initiating AI Guidance Call for: ${title}. How can I assist you with this facility?`, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      // Open assistant and start voice session automatically
      if (!isOpen) {
        // We can't directly call onClose/isOpen here easily without lifting state, 
        // but since it's passed as a prop we assume the parent handles it.
        // For this demo, we use a window event.
        window.dispatchEvent(new CustomEvent('open-assistant'));
      }
      setMode('VOICE');
      startVoiceSession(`The user needs help with ${title}. Procedure: ${procedure}. Guide them step-by-step.`);
    };

    window.addEventListener('trigger-ai-guidance', handleGuidanceTrigger);
    return () => window.removeEventListener('trigger-ai-guidance', handleGuidanceTrigger);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    const blob = new globalThis.Blob([`SAMRIDDHI PORTAL - CHAT HISTORY\nGenerated: ${new Date().toLocaleString()}\nLanguage: ${languageLabel}\n\n${log}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Samriddhi_Chat_Log_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const createGenAIBlob = (data: Float32Array): GenAIBlob => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

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
      setMessages(prev => [...prev, { role: 'bot', text: response || 'Sorry, I couldn\'t process the audio.', timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error processing your voice message.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

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
      setMessages(prev => [...prev, { role: 'bot', text: response || 'Sorry, I couldn\'t process that.', timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to the service.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-[90vw] sm:w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden flex flex-col h-[650px] border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-blue-600 p-5 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-green-400 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'bg-blue-500 shadow-inner'}`}>
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase tracking-tight">Samriddhi Sahayak</h2>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-[9px] text-blue-100 uppercase tracking-widest font-black hover:text-white transition-colors"
              >
                <Globe size={10} /> {languageLabel} <ChevronDown size={10} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button 
              onClick={downloadChatLog}
              disabled={messages.length === 0}
              className="p-2.5 bg-blue-700 hover:bg-blue-500 rounded-xl transition-all text-white disabled:opacity-30"
              title="Download Chat History"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => {
                if(isActive) stopVoiceSession();
                setMode(mode === 'VOICE' ? 'TEXT' : 'VOICE');
              }}
              className={`p-2.5 rounded-xl transition-all ${mode === 'VOICE' ? 'bg-blue-500' : 'bg-blue-700'} hover:bg-blue-500`}
              title="Switch Mode"
            >
              {mode === 'VOICE' ? <Keyboard size={18}/> : <Volume2 size={18}/>}
            </button>
            <button 
              onClick={handleCloseAction} 
              className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-red-600 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/10"
              title="Close Assistant"
            >
              <X size={16} />
            </button>
          </div>

          {/* Language Menu Dropdown */}
          {showLangMenu && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-20 max-h-60 overflow-y-auto no-scrollbar shadow-xl animate-in fade-in slide-in-from-top-2">
              <div className="p-2 grid grid-cols-2 gap-1">
                {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code as Language);
                      setShowLangMenu(false);
                    }}
                    className={`text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                      currentLanguage === code 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guidance Banner */}
        {guidanceContext && (
          <div className="bg-orange-50 dark:bg-orange-950/30 px-6 py-3 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between animate-in slide-in-from-top-4">
             <div className="flex items-center gap-3">
                <PhoneIncoming size={14} className="text-orange-600 animate-bounce" />
                <p className="text-[10px] font-black uppercase text-orange-700 dark:text-orange-400 tracking-widest">Guidance Mode: {guidanceContext}</p>
             </div>
             <button onClick={() => setGuidanceContext(null)} className="text-orange-400 hover:text-orange-600"><X size={12}/></button>
          </div>
        )}

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50 dark:bg-slate-900 no-scrollbar">
          {messages.length === 0 && (
            <div className="text-center mt-20 text-slate-400 dark:text-slate-500 space-y-6">
               <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl mx-auto flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                 <MessageSquare className="opacity-20 text-blue-500" size={40} />
               </div>
               <div className="space-y-2">
                <p className="font-extrabold text-sm uppercase tracking-widest text-slate-700 dark:text-slate-200">Namaste! {languageLabel}</p>
                <p className="text-xs font-medium max-w-[200px] mx-auto">I am your multilingual helper. Ask me about government schemes or documents.</p>
               </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none font-medium'
                }`}>
                  {m.isAudio ? (
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="animate-pulse" />
                      <span>Voice Message</span>
                    </div>
                  ) : m.text}
                </div>
                <span className={`text-[8px] font-bold text-slate-400 uppercase tracking-widest ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Bar */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          {mode === 'TEXT' ? (
            <div className="flex gap-3 items-center">
              {isRecording ? (
                <div className="flex-1 flex items-center gap-4 bg-red-50 dark:bg-red-950/30 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-black text-red-600 dark:text-red-400 tabular-nums">Recording: {formatDuration(recordingDuration)}</span>
                  <div className="flex-1"></div>
                  <button onClick={cancelRecording} className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={stopRecording} className="p-2 bg-red-600 text-white rounded-lg shadow-lg">
                    <Send size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder={`Ask in ${languageLabel}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                    className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 font-medium transition-all"
                  />
                  <button 
                    onClick={startRecording}
                    className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                    title="Send Voice Message"
                  >
                    <Mic size={20} />
                  </button>
                  <button 
                    onClick={handleSendText}
                    disabled={!inputText.trim()}
                    className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Send size={20} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative">
                {isActive && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                )}
                <button
                  onClick={isActive ? stopVoiceSession : () => startVoiceSession()}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 ${
                    isActive ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'
                  }`}
                >
                  {isActive ? <MicOff size={32} /> : <Mic size={32} />}
                </button>
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-red-500' : 'text-slate-400'}`}>
                  {status === 'CONNECTING' ? 'Connecting...' : isActive ? 'Listening...' : `Real-time ${languageLabel}`}
                </p>
                {status === 'CONNECTED' && <p className="text-[9px] text-green-500 font-bold mt-1 uppercase">Microphone Active</p>}
              </div>
            </div>
          )}
          
          <div className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <button 
              onClick={handleCloseAction}
              className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
            >
              <Power size={14} /> End Conversation & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
