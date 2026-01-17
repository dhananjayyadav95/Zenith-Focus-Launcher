
import React, { useState, useRef, useEffect } from 'react';
import { Screen, Message } from '../types';
import { getChatResponse } from '../services/geminiService';
import { ArrowLeft, Send, Sparkles, Link, CheckCircle } from 'lucide-react';

interface FocusCoachProps {
  onNavigate: (screen: Screen) => void;
}

const FocusCoach: React.FC<FocusCoachProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'I am your Focus Coach. What are we working on today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const has = await window.aistudio.hasSelectedApiKey();
        setIsLinked(has);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleLinkAccount = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setIsLinked(true);
    } else {
      alert("Account linking is only available in the AI Studio environment.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: userMessage }] });
      
      const response = await getChatResponse(history);
      setMessages(prev => [...prev, { role: 'model', text: response || "Stay focused. That's all that matters." }]);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        setIsLinked(false);
        setMessages(prev => [...prev, { role: 'model', text: "Account session expired. Please re-link your account using the icon above." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Error connecting to wisdom. Re-center and try again." }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-8 pt-12 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(Screen.HOME)} className="p-2 -ml-2 text-white/50 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-light">Zenith Coach</h2>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-tighter text-white/30">
              <Sparkles size={10} className="text-blue-400" /> Powered by Gemini
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLinkAccount}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-[10px] uppercase tracking-widest ${
            isLinked 
            ? 'border-white/20 text-white/40' 
            : 'border-white/40 text-white hover:bg-white hover:text-black'
          }`}
        >
          {isLinked ? (
            <><CheckCircle size={12} /> Linked</>
          ) : (
            <><Link size={12} /> Link Gemini</>
          )}
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-8"
      >
        {!isLinked && (
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-sm font-semibold mb-2">Connect Your Account</h3>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              To use the personal focus coach, please link your Google Gemini API key. You will need a project with billing enabled.
              <br/><br/>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-white">Learn more about billing</a>
            </p>
            <button 
              onClick={handleLinkAccount}
              className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg uppercase tracking-widest"
            >
              Connect Now
            </button>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <p className={`text-xl font-light leading-relaxed ${m.role === 'user' ? 'text-white' : 'text-white/60'}`}>
                {m.text}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="space-x-1 flex">
              <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="px-8 pb-12 pt-4">
        <div className="relative">
          <input 
            type="text"
            placeholder={isLinked ? "Talk to me..." : "Connect account to chat..."}
            disabled={!isLinked}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-zinc-900/50 border-none rounded-2xl py-4 pl-6 pr-14 text-white focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/20 font-light disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping || !isLinked}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white disabled:opacity-30"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FocusCoach;
