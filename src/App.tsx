/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Bot, 
  Settings, 
  Users, 
  Info, 
  Send, 
  Image as ImageIcon, 
  Phone, 
  MessageCircle,
  Cpu,
  Zap,
  Shield,
  Smartphone,
  Sparkles,
  ChevronRight,
  Menu
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Types ---
type Tab = 'home' | 'ai' | 'settings' | 'team' | 'info';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// --- Components ---

const NeonCard = ({ children, className, glowColor = "blue" }: { children: React.ReactNode, className?: string, glowColor?: "blue" | "green" | "purple" }) => {
  const glowClasses = {
    blue: "shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/30",
    green: "shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-500/30",
    purple: "shadow-[0_0_15px_rgba(168,85,247,0.5)] border-purple-500/30",
  };

  return (
    <div className={cn(
      "bg-zinc-900/80 backdrop-blur-xl border rounded-2xl p-4 transition-all duration-300",
      glowClasses[glowColor],
      className
    )}>
      {children}
    </div>
  );
};

const Logo3D = ({ size = 200, animate = true }: { size?: number, animate?: boolean }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, perspective: 1000 }}
      animate={animate ? {
        rotateY: [0, 360],
        rotateX: [0, 10, 0, -10, 0],
      } : {}}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse" />
      
      {/* Circuit Pattern Background (Simulated) */}
      <div className="absolute inset-4 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M10 10 L90 10 L90 90 L10 90 Z" fill="none" stroke="cyan" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="magenta" strokeWidth="0.5" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke="cyan" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Central Text */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-4xl font-black text-white tracking-tighter leading-none">AKM</span>
          <span className="text-xs font-bold text-blue-400 tracking-[0.2em] mt-1">TECHNOLOGY</span>
        </div>
      </div>
      
      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            top: '50%',
            left: '50%',
            marginTop: -4,
            marginLeft: -4,
            transformOrigin: `${50 + (i + 1) * 20}px 0px`
          }}
        />
      ))}
    </motion.div>
  );
};

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Logo3D size={240} />
      </motion.div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          KARIBU <span className="text-blue-500">ABDULKARIIM AI</span>
        </h1>
        <p className="mt-4 text-zinc-400 font-medium tracking-widest uppercase text-xs">
          By Admin ABDULKARIIM AI
        </p>
        <div className="mt-6 px-4 py-2 rounded-full bg-zinc-900/50 border border-blue-500/30 text-blue-400 text-sm font-mono">
          Whatsapp: +255650791310
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-12 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsTyping(true);

    try {
      const isImagePrompt = textToSend.toLowerCase().includes('generate') || textToSend.toLowerCase().includes('picha') || textToSend.toLowerCase().includes('image');
      
      if (isImagePrompt) {
        // Simulate Image Generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        const aiMsg: Message = { 
          role: 'ai', 
          content: `### 🎨 Image Generated!\n\nHapa kuna picha ya: **${textToSend}**\n\n![Generated Image](https://picsum.photos/seed/${encodeURIComponent(textToSend)}/800/600?blur=1)\n\n*Note: Hii ni picha ya mfano (placeholder). Ili kutumia Gemini Image Generation halisi, unganisha Gemini 2.5 Flash Image API hapa.*`, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: textToSend,
          config: {
            systemInstruction: "You are ABDULKARIIM AI, a helpful technology expert. You specialize in phones, AI, editing, and general tech tricks. Keep your tone professional, premium, and friendly. You are the AI for AKM TECHNOLOGY 🇹🇿. Jibu kwa Kiswahili na Kiingereza pale inapofaa."
          }
        });
        
        const aiMsg: Message = { 
          role: 'ai', 
          content: response.text || "Samahani, kuna tatizo kidogo. Jaribu tena.", 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI. Please check your connection.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hello Admin ABDULKARIIM AI, nimefungua AKM TECHNOLOGY App");
    window.open(`https://wa.me/255650791310?text=${msg}`, '_blank');
  };

  const callAdmin = () => {
    window.location.href = "tel:+255650791310";
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">AKM TECHNOLOGY</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full bg-zinc-900 border border-white/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="relative h-48 rounded-3xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop" 
                  alt="AI Tech" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 rounded-full bg-blue-500 text-[10px] font-black uppercase tracking-widest">Trending</span>
                  <h3 className="text-xl font-black mt-2">Future of AI in 2026</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <NeonCard glowColor="blue" className="flex flex-col items-center text-center py-6">
                  <Zap className="w-8 h-8 text-blue-400 mb-3" />
                  <span className="text-sm font-bold">Tech Tips</span>
                </NeonCard>
                <NeonCard glowColor="purple" className="flex flex-col items-center text-center py-6">
                  <Smartphone className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="text-sm font-bold">Phone Tricks</span>
                </NeonCard>
              </div>

              <section>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Latest News</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors">
                      <div className="w-20 h-20 rounded-xl bg-zinc-800 flex-shrink-0" />
                      <div className="flex flex-col justify-center">
                        <h5 className="font-bold text-sm leading-tight">How to optimize your Android for gaming in 2026</h5>
                        <span className="text-[10px] text-zinc-500 mt-2">2 hours ago • 5 min read</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col h-[calc(100vh-220px)]"
            >
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <Bot className="w-16 h-16 mb-4 text-blue-500" />
                    <h3 className="text-xl font-black">ABDULKARIIM AI</h3>
                    <p className="text-sm max-w-[200px] mt-2">Uliza chochote kuhusu technology, phones, au AI.</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-zinc-900 border border-white/10 text-zinc-200 rounded-tl-none shadow-lg"
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <span className="text-[9px] text-zinc-600 mt-1 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 p-3 bg-zinc-900 rounded-2xl w-16 items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSendMessage("Generate an image of a futuristic tech city in Tanzania")}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-blue-500/20 text-[10px] font-bold text-blue-400 flex items-center justify-center gap-2 hover:bg-blue-500/10 transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Generate Image
                  </button>
                  <button 
                    onClick={() => handleSendMessage("Nipe settings za kuongeza speed ya simu")}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-purple-500/20 text-[10px] font-bold text-purple-400 flex items-center justify-center gap-2 hover:bg-purple-500/10 transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    Phone Tricks
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-black">Settings & Tricks</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, label: "Privacy & Security", color: "text-green-400" },
                  { icon: Zap, label: "Performance Boost", color: "text-blue-400" },
                  { icon: Smartphone, label: "Display Settings", color: "text-purple-400" },
                  { icon: Sparkles, label: "AI Personalization", color: "text-pink-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-xl bg-zinc-800", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
              
              <NeonCard glowColor="green" className="mt-8">
                <h4 className="font-black text-sm mb-2">PRO TIP</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Turn off "Usage & Diagnostics" in your Google settings to save battery and increase privacy.
                </p>
              </NeonCard>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  Admin Bora wa AKM GROUP
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "I.T KAJU MPEMBA",
                    "JOACKIM",
                    "SEMAJI LA CUF (MR LOGISTICS BERNARD)",
                    "BOBAN.",
                    "ABDKARIIM (MWALABU)"
                  ].map((name, i) => (
                    <NeonCard key={i} glowColor="blue" className="flex items-center gap-4 py-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center font-black text-lg border-2 border-white/10">
                        {name[0]}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{name}</span>
                    </NeonCard>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-green-500 rounded-full" />
                  Top 5 Members
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Khalifa",
                    "Ibrahimovic",
                    "Diamind Platinum",
                    "Elias",
                    "Kizzy Brand"
                  ].map((name, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-900 border border-green-500/20 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-green-500/30 mb-3 flex items-center justify-center font-black text-green-400">
                        {name[0]}
                      </div>
                      <span className="text-xs font-bold">{name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
                
                <div className="relative z-10 whitespace-pre-wrap font-medium text-sm leading-relaxed text-zinc-300">
                  <h3 className="text-2xl font-black text-white mb-6">KARIBU 🅰︎🅺︎🅼︎ GROUP 🔥</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20">
                      <h4 className="text-red-400 font-black text-xs uppercase tracking-widest mb-3">SHERIA ZA GROUP</h4>
                      <p>🎯 USITUME LINK ZA GROUP WALA CHANNEL HUMU</p>
                      <p>🎯 USITUME STIKA WALA VIDEO CHAFU</p>
                      <p>🎯 CHANGIA MADA USIWE BUBU</p>
                    </div>

                    <div className="py-4 border-y border-white/5">
                      <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-3">🔥 HUDUMA ZA GROUP</h4>
                      <p>✅ SETTINGS ZOTE ZA SIMU</p>
                      <p>✅ APPLICATION MUHIMU ZA SIMU</p>
                      <p>✅ AI PAMOJA NA EDITING ZOTE</p>
                    </div>

                    <p className="italic text-zinc-500 text-xs">
                      NB; PUNGUZA UJUAJII JAMBO KAMA ULIJUI ULIZA
                    </p>

                    <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/10">
                      <h4 className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-3">⛔ NOTE</h4>
                      <p>SETTINGS ZOTE NA TRICKS ZOTE ZA 🅰︎🅺︎🅼︎ NI SIRI ZETU NO KUZAGAZA</p>
                    </div>

                    <p className="text-center font-black text-white pt-4">
                      ALL THE IMPORTANT SETTINGS AND ALL THE IMPORTANT TRICKS 🅰︎🅺︎🅼︎ GROUP IS FREE 🔥🔥🔥🔥💪
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-28 right-6 flex flex-col gap-3 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openWhatsApp}
          className="w-14 h-14 rounded-full bg-green-600 shadow-[0_0_20px_rgba(22,163,74,0.5)] flex items-center justify-center border-2 border-white/20"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={callAdmin}
          className="w-14 h-14 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center border-2 border-white/20"
        >
          <Phone className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {[
            { id: 'home', icon: Home, label: "Home" },
            { id: 'ai', icon: Bot, label: "AI Chat" },
            { id: 'settings', icon: Settings, label: "Settings" },
            { id: 'team', icon: Users, label: "Team" },
            { id: 'info', icon: Info, label: "Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                activeTab === tab.id ? "text-blue-500 scale-110" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                activeTab === tab.id ? "bg-blue-500/10" : ""
              )}>
                <tab.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
