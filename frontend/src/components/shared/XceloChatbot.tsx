import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message { role: 'ai' | 'user'; content: string; }

const QUICK_ACTIONS = {
  student: ['Explain simpler', 'Give example', 'Generate quiz', 'Summarize'],
  faculty: ['Draft email to students', 'Summarize weak topics', 'Review schedule'],
  admin: ['System Health Check', 'Generate KPI Report', 'Export Data'],
};

const INITIAL_MESSAGES: Record<string, string> = {
  student: 'Hello! I\'m Xcelo. I noticed you\'re struggling with DBMS. Would you like me to explain Database Normalization in simple terms based on your syllabus?',
  faculty: 'Hello! I\'m Xcelo. Your DBMS class has a high-risk profile this week. Would you like me to generate a personalized intervention plan for struggling students?',
  admin: 'Hello! I\'m Xcelo. The system is operating optimally today. Would you like me to generate a global analytics report on student retention rates this semester?',
};

const AI_RESPONSES: Record<string, string> = {
  student: 'Normalization is the process of organizing data to minimize redundancy. Think of it as organizing a messy closet — every item has exactly one logical place. 1NF removes repeating groups, 2NF removes partial dependencies, and 3NF removes transitive dependencies. Want me to generate a practice quiz on this?',
  faculty: 'Based on recent assessment data, I recommend scheduling a targeted review session focusing on 3NF. Here\'s a drafted email you can send to the at-risk cohort: "Dear students, we\'ve identified that normalization concepts need reinforcement. Please attend the extra session on Friday at 2 PM."',
  admin: 'Generating report... Student retention has improved by 4.2% since the new early-warning system was deployed. High-risk interventions have a 78% success rate. Would you like a detailed breakdown by department?',
};

export default function XceloChatbot({
  isOpen,
  onClose,
  roleContext = 'student',
}: {
  isOpen: boolean;
  onClose: () => void;
  roleContext?: 'student' | 'faculty' | 'admin';
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: INITIAL_MESSAGES[roleContext] },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: AI_RESPONSES[roleContext] }]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-28 right-8 w-[390px] h-[560px] flex flex-col rounded-3xl overflow-hidden z-50 shadow-2xl border border-white/20 dark:border-white/10 bg-white dark:bg-dark-surface"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-dark-border bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shadow-sm border border-white/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Xcelo AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-brand-100 font-bold tracking-wider uppercase">
                    {roleContext === 'student' ? 'Syllabus Context Active' : 'Class Context Active'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-dark-bg/50 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={cn('flex max-w-[88%]', msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto')}
              >
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    'p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-brand-600 dark:bg-brand-500 text-white rounded-br-sm'
                      : 'bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 max-w-[88%]">
                <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions + Input */}
          <div className="p-4 bg-white dark:bg-dark-surface border-t border-slate-100 dark:border-dark-border">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_ACTIONS[roleContext].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action)}
                  className="whitespace-nowrap px-3 py-1.5 bg-brand-50 dark:bg-brand-500/20 hover:bg-brand-100 dark:hover:bg-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold rounded-full border border-brand-200 dark:border-brand-500/30 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
            <form
              onSubmit={e => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Xcelo anything..."
                className="w-full bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl pl-4 pr-12 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-500/30 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
