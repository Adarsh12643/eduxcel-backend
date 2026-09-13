import React from 'react';
import { X } from 'lucide-react';
import XceloChatbot from './XceloChatbot';

interface ChatbotButtonProps {
  isAIOpen: boolean;
  setIsAIOpen: (isOpen: boolean) => void;
  roleContext: 'student' | 'faculty' | 'admin';
}

export default function ChatbotButton({ isAIOpen, setIsAIOpen, roleContext }: ChatbotButtonProps) {
  return (
    <>
      <div className="fixed bottom-4 right-6 z-50 flex items-end gap-2 cursor-pointer group" onClick={() => setIsAIOpen(!isAIOpen)}>
        {!isAIOpen && (
          <div className="mb-14 px-4 py-2 bg-white dark:bg-slate-800 shadow-xl rounded-2xl rounded-br-sm text-sm font-black text-brand-600 dark:text-brand-400 relative animate-bounce border border-slate-100 dark:border-slate-700">
            Hii I am Xcello
            <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-slate-100 dark:border-slate-700 rotate-45"></div>
          </div>
        )}
        <div className="relative">
          {isAIOpen ? (
            <button className="w-14 h-14 rounded-full bg-slate-800 dark:bg-slate-700 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform mb-4">
              <X className="w-6 h-6" />
            </button>
          ) : (
            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGRjNTZ4MnphdnE5ejRkdGY2bHltY2RreHE4M3g5ODRvcGR5a2k0eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dqxEEMhIXaR1DrcEZA/giphy.gif" alt="Xcello Robot" className="w-28 h-28 drop-shadow-2xl hover:scale-110 transition-transform origin-bottom" />
          )}
        </div>
      </div>
      <XceloChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} roleContext={roleContext} />
    </>
  );
}
