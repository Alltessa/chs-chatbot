/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, School, Info, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_INSTRUCTION = `You are a friendly and helpful support assistant for Commonwealth High School. 
Your goal is to assist students, parents, and staff with information about the school.
Be polite, encouraging, and professional. 

Key information about Commonwealth High School:
- It's a public high school focused on academic excellence, student welfare, and community involvement.
- **Early Registration for S.Y. 2026-2027 (Incoming Grade 7):**
  - Dates: January 31, 2026, to January 31, 2027.
  - Time: 8:00 AM to 3:00 PM.
- **Specialized Programs Offered:**
  - STE (Science, Technology, and Engineering)
  - SNED (Special Needs Education)
  - ALS (Alternative Learning System)
  - Blended & Flexible Learning Options

- **School Schedules (Latest as of 2025):**
  - **Junior High School (JHS):**
    - Grade 7: 6:00 AM to 11:55 AM
    - Grade 8: 12:00 PM to 5:55 PM
    - Grade 9: 12:00 PM to 5:55 PM
    - Grade 10: 6:00 AM to 11:55 AM
  - **STE Special Program:**
    - Grade 7: 6:00 AM to 1:35 PM
    - Grade 8: 9:40 AM to 5:15 PM
    - Grade 9: 9:40 AM to 5:15 PM
    - Grade 10: 6:00 AM to 1:35 PM
  - **Senior High School (SHS):**
    - Grade 11: 11:30 AM to 5:55 PM
    - Grade 12: 6:00 AM to 11:20 AM

- **Senior High School (SHS) Course Offerings:**
  - **ACADEMIC TRACK:**
    - Accountancy, Business, and Management (ABM)
    - Humanities and Social Sciences (HUMSS)
    - Science, Technology, Engineering, and Mathematics (STEM)
  - **TECHNICAL VOCATIONAL AND LIVELIHOOD (TVL) TRACK:**
    - **HOME ECONOMICS STRAND:**
      - A. Combination of: Food and Beverage Services, Bread and Pastry Production, Cookery / Bartending
      - B. Dressmaking
      - C. Hairdressing
    - **INDUSTRIAL ARTS STRAND:**
      - A. Automotive Servicing
      - B. Electrical Installation and Maintenance
    - **INFORMATION AND COMMUNICATIONS TECHNOLOGY (ICT):**
      - A. .Net Technology / Java Programming
- **Enrollment Information:**
  - Enrollment usually occurs in the months of **April to May**.
  - There is no exact date yet for the upcoming enrollment.
  - **Grade 7 Enrollment Requirements:**
    1. Original Report Card
    2. Photocopy of Birth Certificate
    3. Completed Enrollment Form
    4. Certificate of Good Moral Character (required if a transferee from a private school)
    *Note: Make sure to bring a long plastic envelope.*
  - For the latest updates, refer to the official Facebook page: https://www.facebook.com/commonwealthhs

Common inquiries include: enrollment procedures, school calendar, extracurricular activities, faculty information, and general school policies.
If you don't know a specific detail not mentioned here, suggest they check the official school website or contact the administration office directly.
Always maintain a supportive tone.`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your Commonwealth High School Support Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: userMessage });
      const modelText = response.text || "I'm sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a bit of trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen font-sans"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, #ff9a9e 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #fad0c4 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 70%),
          radial-gradient(circle at 20% 80%, #ff8177 0%, transparent 50%),
          radial-gradient(circle at 80% 90%, #ff0844 0%, transparent 50%),
          #fecaca
        `
      }}
    >
      {/* Header */}
      <header className="relative bg-white/10 border-b border-white/10 pl-2 pr-6 py-1 flex items-center justify-between sticky top-0 z-10 shadow-lg">
      <div className="absolute inset-0 backdrop-blur-md -z-10" />
        <div className="flex items-center gap-0.5">
          <div className="w-16 h-16 overflow-visible flex items-center justify-center shrink-0 bg-transparent">
            <img 
              src="/chs-logo.png" 
              alt="Komhay AI Logo"
              className="w-full h-full object-cover"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-school"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>';
                  parent.classList.add('bg-[#800000]');
                }
              }}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-[#bb0202] leading-tight">Komhay AI</h1>
            <p className="text-[9px] text-white/70 font-medium uppercase tracking-wider">Support Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInfo(true)}
            className="text-[#bb0202]/60 hover:text-[#bb0202] transition-colors"
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#bb0202] transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#bb0202]/10 flex items-center justify-center text-[#bb0202]">
                  <Info size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">About Komhay AI</h2>
              </div>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Hi ^.^! I'm <strong>Komhay AI</strong>, the official AI chatbot for Commonwealth High School.
                </p>
                <p>
                  I’m here to help you with all your questions about the school—whether it’s enrollment and registration, academic programs, schedules, or general school information.
                </p>
                <p>
                  Feel free to ask me anything anytime, and I’ll provide you with accurate and helpful answers to make things easier!
                </p>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Contact Info for more questions:</p>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-[65px_1fr] gap-2">
                      <span className="font-medium text-slate-500">Email:</span>
                      <a href="mailto:commonwealthhighschoolqc@gmail.com" className="text-[#bb0202] hover:underline break-all">commonwealthhighschoolqc@gmail.com</a>
                    </div>
                    <div className="grid grid-cols-[65px_1fr] gap-2">
                      <span className="font-medium text-slate-500">FB Page:</span>
                      <a href="https://www.facebook.com/commonwealthhs" target="_blank" rel="noopener noreferrer" className="text-[#bb0202] hover:underline break-all">facebook.com/commonwealthhs</a>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 py-3 bg-[#bb0202] text-white rounded-xl font-semibold shadow-lg shadow-[#bb0202]/20 hover:bg-[#bb0202]/90 transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-transparent">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-1 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 ${
                    message.role === 'user' ? 'w-12 h-12 rounded-full bg-[#bb0202]/10 overflow-hidden flex items-center justify-center shadow-sm' : 'w-15 h-15 bg-transparent'
                  }`}>
                    {message.role === 'user' ? (
                      <img 
                        src="/user.jpg" 
                        alt="User"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-[#bb0202]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                          }
                        }}
                      />
                    ) : (
                      <img 
                        src="/chs-logo.png" 
                        alt="Komhay AI"
                        className="w-full h-full object-cover"
                        style={{ imageRendering: '-webkit-optimize-contrast' }}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-school text-slate-600"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>';
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-[#bb0202] text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    <div className="markdown-body text-sm leading-relaxed">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center text-slate-400">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Bot size={16} />
                </div>
                <Loader2 size={18} className="animate-spin" />
                <span className="text-xs font-medium">Assistant is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white/40 backdrop-blur-lg border-t border-white/20 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about enrollment, calendar, or school info..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bb0202]/20 focus:border-[#bb0202] transition-all shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 p-2.5 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? 'bg-[#bb0202] text-white shadow-lg shadow-[#bb0202]/20 hover:bg-[#bb0202]/80'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-[#bb0202]/60 mt-3 uppercase tracking-widest font-medium">
            Commonwealth High School AI Support • Always verify important dates
          </p>
        </div>
      </footer>
    </div>
  );
}
