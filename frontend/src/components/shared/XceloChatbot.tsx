import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, BrainCircuit, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Message { role: 'ai' | 'user'; content: string; }

const QUICK_ACTIONS = {
  student: ['Explain simpler', 'Give example', 'Generate quiz', 'Summarize'],
  faculty: ['Draft email to students', 'Summarize weak topics', 'Review schedule'],
  admin: ['System Health Check', 'Generate KPI Report', 'Export Data'],
};

const INITIAL_MESSAGES: Record<string, string> = {
  student: "Hi there! I'm **Xcelo**, your AI tutor. How can I help you excel today? 🚀",
  faculty: "Hi! I'm **Xcelo**, your AI Teaching Assistant. How can I assist with your classes? 📊",
  admin: "Hi! I'm **Xcelo**, your AI System Admin. How can I help with platform management? ⚙️",
};

// Lightweight markdown renderer (no external deps needed)
function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  const parseInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(<span key={key++}>{parseInline(boldMatch[1])}</span>);
        parts.push(<strong key={key++} className="font-semibold">{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
        continue;
      }
      // Inline code `text`
      const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/s);
      if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={key++}>{parseInline(codeMatch[1])}</span>);
        parts.push(<code key={key++} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[11px] font-mono text-brand-700 dark:text-brand-300">{codeMatch[2]}</code>);
        remaining = codeMatch[3];
        continue;
      }
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    return <>{parts}</>;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-slate-900 dark:bg-slate-800 text-emerald-300 text-xs rounded-xl p-3 overflow-x-auto my-2 font-mono leading-5">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Heading ## or ###
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-bold text-sm text-slate-900 dark:text-white mt-3 mb-1">{parseInline(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-base text-slate-900 dark:text-white mt-3 mb-1.5">{parseInline(line.slice(3))}</h3>);
    }
    // Unordered list
    else if (/^[-*•]\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        listItems.push(<li key={i} className="flex gap-2 text-sm leading-relaxed"><span className="text-brand-500 mt-0.5 flex-shrink-0">•</span><span>{parseInline(lines[i].replace(/^[-*•]\s/, ''))}</span></li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="space-y-1 my-1.5">{listItems}</ul>);
      continue;
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(<li key={i} className="flex gap-2 text-sm leading-relaxed"><span className="text-brand-600 dark:text-brand-400 font-bold flex-shrink-0 w-5">{num}.</span><span>{parseInline(lines[i].replace(/^\d+\.\s/, ''))}</span></li>);
        i++;
        num++;
      }
      elements.push(<ol key={`ol-${i}`} className="space-y-1 my-1.5">{listItems}</ol>);
      continue;
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="border-slate-200 dark:border-slate-700 my-2" />);
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
    }
    // Normal paragraph
    else {
      elements.push(<p key={i} className="text-sm leading-relaxed">{parseInline(line)}</p>);
    }
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

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

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const newMessages = [...messages, { role: 'user', content: msg } as Message];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    try {
      const res = await api.chat.send(msg, roleContext, messages);
      if (res.success) {
        setMessages(prev => [...prev, { role: 'ai', content: res.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to my brain right now. Please try again!" }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "An error occurred. Please try again!" }]);
    }
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-32 right-6 w-[390px] h-[560px] flex flex-col rounded-3xl overflow-hidden z-50 shadow-2xl border border-white/20 dark:border-white/10 bg-white dark:bg-dark-surface"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-dark-border bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shadow-sm border border-white/30 z-10 relative overflow-hidden">
                <img src="/xcelo-avatar.jpg" alt="Xcello" className="w-full h-full object-cover" />
              </div>
              <div className="z-10 relative">
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
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10 relative"
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
                  <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center mr-2 mt-1 flex-shrink-0 overflow-hidden shadow-sm">
                    <img src="/xcelo-avatar.jpg" alt="Xcello" className="w-full h-full object-cover" />
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
                  {msg.role === 'ai' ? <MarkdownMessage content={msg.content} /> : msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 max-w-[88%]">
                <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  <img src="/xcelo-avatar.jpg" alt="Xcello" className="w-full h-full object-cover" />
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
