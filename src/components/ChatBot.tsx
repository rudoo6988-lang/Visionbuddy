import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. ChatBot AI features will be disabled.');
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am the VisionBuddy assistant. Ask me anything about our future vision!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = getAI();
      if (!ai) {
        setMessages(prev => [...prev, { role: 'bot', text: "I'm currently disconnected from my neural core (API Key missing). Please contact support!" }]);
        return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are VisionBuddy, a futuristic AI assistant for a project called VisionBuddy. 
              The project is a visionary AI companion that helps people see and understand the world in new ways. 
              Be futuristic, polite, and exciting. 
              Context: This is a landing page for collecting interest.
              User says: ${userMsg}` }]
          }
        ],
        config: {
            systemInstruction: "You are a helpful, futuristic, and encouraging AI assistant for Project VisionBuddy."
        }
      });

      const botText = response.text || "I'm processing the future right now. Please try again in a moment.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, my neural links are a bit fuzzy. Can you repeat that?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 sm:w-96 glass rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            style={{ height: '500px' }}
          >
            <div className="bg-primary/20 p-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">VisionBuddy AI</h3>
                  <p className="text-[10px] text-primary-foreground/70 uppercase tracking-widest">Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask VisionBuddy..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-2 bg-primary rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-glow"
      >
        <div className="relative">
          <MessageSquare size={26} className="text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark"></span>
        </div>
      </motion.button>
    </div>
  );
};
